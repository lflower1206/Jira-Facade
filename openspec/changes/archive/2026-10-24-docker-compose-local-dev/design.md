# Design

## Context

 Jira Facade uses Next.js 15, Prisma 7 (`prisma-client` generator outputting TypeScript to `src/generated/prisma`), and `@prisma/adapter-better-sqlite3` backed by `better-sqlite3` (a native C++ addon). See `proposal.md` for motivation. When bind-mounting a macOS workspace into a Linux container, sharing `node_modules` or `.next` between host and container causes native binary ABI mismatches (`ERR_DLOPEN_FAILED` on `better_sqlite3.node`) and Next.js SWC cache conflicts.

## Goals / Non-Goals

**Goals:**
- Run the local development server and SQLite database inside a Node 24 container (`node:24-bookworm-slim`).
- Isolate `node_modules`, `.next`, and `data` in named Docker volumes so zero runtime binaries, build caches, or `.db` files pollute the host workspace.
- Preserve instant hot module replacement (HMR) when editing source files on the host.
- Keep `src/generated/prisma` available on the bind-mounted workspace so host IDEs have accurate TypeScript types.

**Non-Goals:**
- Production multi-stage deployment containerization (this design targets local development workflow isolation).
- Replacing SQLite with an external database server container (SQLite remains the persistence engine, stored inside a named volume).

## Decisions

### 1. Base Image: `node:24-bookworm-slim` over `node:24-alpine`
- **Choice**: Use `node:24-bookworm-slim` (Debian glibc) and install minimal build/runtime prerequisites (`openssl`, `python3`, `make`, `g++` for `better-sqlite3` fallback compilation if prebuilds are unavailable for Node 24).
- **Rationale**: `better-sqlite3` and Prisma tools primarily target `glibc`. Alpine (`musl`) frequently causes native addon compilation issues or Prisma library detection warnings.

### 2. Volume Layering Strategy (Hybrid Bind Mount + Named Volumes)
- **Choice**: Mount `.:/app` as a bind mount, and overlay three named volumes:
  - `node_modules:/app/node_modules`
  - `next_cache:/app/.next`
  - `sqlite_data:/app/data`
- **Rationale**:
  - Overlaying `/app/node_modules` keeps Linux-compiled `better-sqlite3` binaries isolated from the macOS host.
  - Overlaying `/app/.next` prevents container root/node user build caches from colliding with host builds.
  - Overlaying `/app/data` satisfies the requirement to keep `.db`, `.db-wal`, and `.db-shm` files off the host filesystem while persisting across `docker compose restart` and wiping cleanly via `docker compose down -v`.
  - Leaving `src/generated/prisma` on the bind mount allows `prisma generate` inside the container to populate pure TypeScript client definitions directly where the host IDE can read them.
- **Alternatives Considered**:
  - *Host bind mount for `./data:/app/data`*: Rejected because it leaves SQLite database and WAL files in the local workspace.
  - *Pure container without host bind mount*: Rejected because it breaks live reload without rebuilding images on every edit.

### 3. Startup Command & Dependency Synchronization
- **Choice**: In `Dockerfile`, copy `package.json`, `package-lock.json`, `prisma/`, and `prisma.config.ts` and run `npm ci` during build so the image layer and initial `node_modules` volume are pre-populated. In `docker-compose.yml`, start the service with:
  `sh -c "npx prisma generate && npx prisma migrate deploy && exec npx next dev -H 0.0.0.0"`
- **Rationale**:
  - `npx prisma generate` ensures `src/generated/prisma` exists on the bind-mounted host directory even on a fresh clone.
  - `npx prisma migrate deploy` initializes or updates the SQLite database inside the `sqlite_data` volume before Next.js accepts requests.
  - `-H 0.0.0.0` is required inside Docker containers so port forwarding from host `localhost:3000` reaches Next.js.
  - `exec` replaces the `/bin/sh` shell process with Next.js (PID 1), enabling clean signal propagation (`SIGTERM`/`SIGINT`) for instant container termination without 10-second timeout hangs.

## Risks / Trade-offs

- **[Stale `node_modules` volume after `package.json` updates]** → Document and configure `docker:dev` / `docker compose up --build` (or `docker compose down -v` via `npm run docker:reset`) so developers can refresh the `node_modules` volume when dependencies change.
- **[Native compilation on Node 24]** → Include `python3`, `make`, and `g++` in `Dockerfile` so `better-sqlite3` builds reliably even if prebuilt binaries for a newer Node 24 point release are not yet published.
