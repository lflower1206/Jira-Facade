# Spec Delta

## Purpose

Provides an isolated, containerized local development runtime using Docker Compose on Node.js 24 so developers can run the application and SQLite database with live source reloading without polluting the host machine with runtime dependencies, build caches, or database files.

## ADDED Requirements

### Requirement: Containerized Development Server on Node 24
The system SHALL provide a Docker Compose configuration that builds and runs the application in a Node.js 24 container and exposes the development server on `http://localhost:3000`.

#### Scenario: Starting the containerized development environment
- **WHEN** a developer runs `docker compose up` (or `npm run docker:dev`)
- **THEN** the container runs on Node.js 24, applies pending database migrations, starts the development server listening on `0.0.0.0:3000`, and responds with HTTP 200 on `http://localhost:3000/api/health`.

### Requirement: Host Filesystem Isolation via Named Volumes
The containerized development environment SHALL isolate `node_modules`, `.next` build artifacts, and the `data` SQLite database directory inside named Docker volumes so that runtime binaries, build caches, and database files are not written to the host workspace.

#### Scenario: Running the container does not create host database or build artifacts
- **WHEN** the containerized development environment is started and work items are created
- **THEN** no SQLite `.db`, `.db-wal`, or `.db-shm` files are written to the host `./data` directory, and container Linux `node_modules` and `.next` caches remain inside Docker volumes rather than overwriting host directories.

#### Scenario: Persistence across container restarts and clean volume reset
- **WHEN** the container is restarted via `docker compose restart`
- **THEN** work items stored in the named `data` volume persist across the restart
- **WHEN** the environment is torn down with volumes removed via `docker compose down -v` (or `npm run docker:reset`)
- **THEN** the isolated database, build cache, and dependency volumes are completely removed.

### Requirement: Live Source Reloading and Prisma Client Sync
The containerized development environment SHALL bind-mount the project workspace so that source code edits trigger hot reloading in the container and generated Prisma TypeScript client files in `src/generated/prisma` remain accessible to the host IDE.

#### Scenario: Editing source code on the host
- **WHEN** a developer modifies a source file under `src/` on the host machine while the container is running
- **THEN** the change is immediately visible inside the running container for hot module replacement without rebuilding the image.
