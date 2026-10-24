# Proposal

## Why

Running the application directly on the host machine compiles OS-specific native Node addons (`better-sqlite3`), creates local SQLite database files (`data/jira-facade.db`), and writes Next.js build caches (`.next`), polluting the local development environment and tying development to a specific host Node version. Providing a Docker Compose local development environment isolates runtime dependencies, build caches, and database state inside containers and named Docker volumes while preserving live code reloading and IDE TypeScript support on the host.

## What Changes

- Add a development `Dockerfile` based on Node.js 24 (`node:24-bookworm-slim`) with necessary system packages for Prisma and native SQLite compilation/runtime.
- Add `.dockerignore` to prevent copying host `node_modules`, `.next`, `.git`, and local `data/*.db` files into the image build context.
- Add `docker-compose.yml` configuring the `app` service for local development:
  - Bind-mounts the project workspace into `/app` for live editing and hot module replacement (HMR), while allowing generated TypeScript Prisma client files (`src/generated/prisma`) to remain visible to the host IDE.
  - Isolates `/app/node_modules`, `/app/.next`, and `/app/data` in named Docker volumes so Linux binaries, Next.js build caches, and SQLite database files never pollute the host filesystem.
  - Automatically runs Prisma client generation, database migrations (`prisma migrate deploy`), and starts the Next.js development server bound to `0.0.0.0:3000`.
- Add convenience npm scripts in `package.json` (`docker:dev`, `docker:down`, `docker:reset`) for managing the containerized development lifecycle.

## Capabilities

### New Capabilities
- `local-dev-container`: Containerized local development environment using Docker Compose with Node 24, live source reloading, and named-volume isolation for dependencies, build cache, and SQLite storage.

### Modified Capabilities

## Impact

- **New Files**: `Dockerfile`, `docker-compose.yml`, `.dockerignore`.
- **Modified Files**: `package.json` (helper scripts for Docker Compose workflow).
- **Developer Workflow**: Developers can run the full application and SQLite database via `docker compose up` (or `npm run docker:dev`) without installing or running the server and database directly on the host OS, and reset all state cleanly via `docker compose down -v` (or `npm run docker:reset`).
