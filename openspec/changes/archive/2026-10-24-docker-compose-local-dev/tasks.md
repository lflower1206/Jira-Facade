# Tasks

## 1. Container Image & Build Context Configuration

- [x] 1.1 Create `.dockerignore` excluding `node_modules`, `.next`, `.git`, `coverage`, and `data/*.db*` from the build context, and verify the file exists with the expected patterns.
- [x] 1.2 Create `Dockerfile` using `node:24-bookworm-slim` with build/runtime dependencies (`openssl`, `python3`, `make`, `g++`), copying package manifests and Prisma schema to install dependencies and generate the Prisma client, and verify the Dockerfile syntax and structure.

## 2. Docker Compose & Package Scripts

- [x] 2.1 Create `docker-compose.yml` defining the `app` service on port `3000:3000` with `DATABASE_URL="file:./data/jira-facade.db"`, bind-mounting `.:/app`, overlaying named volumes for `/app/node_modules`, `/app/.next`, and `/app/data`, and running `npx prisma generate && npx prisma migrate deploy && npx next dev -H 0.0.0.0`, and verify configuration validity with `docker compose config`.
- [x] 2.2 Add convenience scripts (`docker:dev`, `docker:down`, `docker:reset`) to `package.json` and add unit tests verifying the Docker configuration and scripts, then verify `npm test`, `npm run lint`, and `npm run format` pass.

## 3. End-to-End Container Verification

- [x] 3.1 Verify that starting the environment with `docker compose up -d --build` runs on Node 24, applies migrations into the named volume without creating `.db` files in the host `./data` directory, and responds with HTTP 200 on `http://localhost:3000/api/health`, then clean up with `docker compose down -v`.
