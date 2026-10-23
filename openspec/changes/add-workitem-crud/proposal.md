# Proposal

## Why

Jira Facade needs to show that business users can manage Jira-style work items entirely through the custom UI, without depending on Jira Data Center. Because no Jira instance is reachable for this proof of concept, work items are persisted in a local SQLite database behind a repository boundary that can later be swapped for a Jira DC or post-EOL backend.

## What Changes

- Add a work item list page (`/workitems`) showing all work items, sorted by most recently updated, with a status filter.
- Add a create page (`/workitems/new`) with a validated form.
- Add a detail page (`/workitems/[key]`) and an edit page (`/workitems/[key]/edit`) for updating a work item.
- Add delete with an explicit confirmation step (hard delete).
- Introduce a `WorkItemRepository` interface as the facade seam, with a Prisma-backed SQLite implementation.
- Add Prisma 7 (`prisma`, `@prisma/client`, `@prisma/adapter-better-sqlite3`, `better-sqlite3`) with a versioned schema and migrations; the database file lives under a gitignored `data/` directory.
- Add a "Work Items" navigation link to the global header.
- Work item model: auto-generated key (`JF-<id>`), summary, description, type, status, priority, assignee, reporter, created/updated timestamps.

## Capabilities

### New Capabilities
- `work-items`: Creating, listing, viewing, updating, and deleting work items, including the field model, validation rules, and persistence behavior.

### Modified Capabilities
*(None - the header link is a presentation detail and does not change `web-app` requirements)*

## Impact

- **Dependencies**: Adds `@prisma/client`, `@prisma/adapter-better-sqlite3`, `better-sqlite3`, `dotenv`; dev dependencies `prisma`, `@types/better-sqlite3`.
- **Project Structure**: New `prisma/` (schema, migrations), `prisma.config.ts`, `src/lib/workitems/` (types, validation, repository), `src/app/workitems/**` routes, `src/components/workitems/**` components, generated client under `src/generated/prisma` (gitignored).
- **Config**: `.env` / `.env.example` with `DATABASE_URL`; `.gitignore`, `.prettierignore`, ESLint ignores updated for `data/` and generated client; `postinstall` script runs `prisma generate`.
- **Testing**: Component tests mock the repository; a repository integration test runs in the Jest `node` environment against a disposable SQLite file.
- **Out of scope**: Jira DC integration or sync, projects/multiple key prefixes, workflow transition rules, comments, attachments, custom fields, labels, issue links, real user directory, authentication.
