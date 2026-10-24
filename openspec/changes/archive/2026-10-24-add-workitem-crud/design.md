# Design

## Context

The app is a Next.js 15 App Router project (`src/app`) with Tailwind, Jest (`next/jest`, jsdom default environment), ESLint, and Prettier. There is no persistence layer yet. No Jira instance is reachable for this PoC (see proposal.md - Why). Requirements live in `specs/work-items/spec.md`.

## Goals / Non-Goals

**Goals:**
- A thin, typed facade seam (`WorkItemRepository`) so UI code never imports Prisma or knows about SQLite.
- Server-rendered pages with Server Actions for mutations; the forms still work with minimal client JavaScript.
- Reproducible schema through versioned Prisma migrations.
- Tests that keep the quality gates in AGENTS.md green and do not depend on a developer's local DB file.

**Non-Goals:**
- Concurrency control or optimistic locking (single-user PoC).
- Pagination (PoC data volumes are small).
- A public REST API for work items.

## Decisions

### 1. Layering

```
 src/app/workitems/**          pages (Server Components) + actions.ts (Server Actions)
          |
 src/lib/workitems/
   types.ts                    WorkItem, WorkItemInput, enum value lists
   validation.ts               validateWorkItemInput(formData) -> {ok,data}|{ok:false,errors}
   repository.ts               WorkItemRepository interface
   prisma-repository.ts        PrismaWorkItemRepository implements WorkItemRepository
   index.ts                    getWorkItemRepository() factory
          |
 src/lib/db/prisma.ts          PrismaClient singleton (globalThis in dev) + better-sqlite3 adapter
          |
 data/jira-facade.db
```

- Pages and actions depend only on `getWorkItemRepository()` and the interface. That keeps the later Jira DC or post-EOL swap contained in one place, and component tests can mock it.
- **Alternative**: call Prisma directly from pages. Rejected because it defeats the facade goal and makes component tests touch the DB.

### 2. Prisma 7 with the better-sqlite3 driver adapter
- `prisma/schema.prisma` uses the `prisma-client` generator with `output = "../src/generated/prisma"`, plus a `sqlite` datasource. The URL is configured in `prisma.config.ts` from `DATABASE_URL` (default `file:./data/jira-facade.db`, with `.env.example` committed).
- The client is created with `new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) })`.
- **Alternatives**: plain `better-sqlite3` SQL (lighter, but no typed schema or migrations); `node:sqlite` (still experimental); Drizzle (fine, but the user chose Prisma).

### 3. Data model and keys
```prisma
model WorkItem {
  id          Int      @id @default(autoincrement())
  summary     String
  description String?
  type        String   @default("Task")
  status      String   @default("To Do")
  priority    String   @default("Medium")
  assignee    String?
  reporter    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  @@index([status])
  @@index([updatedAt])
}
```
- `key` is not stored. The repository maps `id <-> "JF-" + id` (`toKey` / `parseKey`). A malformed key such as `JF-abc` resolves to not-found.
- Prisma emits `INTEGER PRIMARY KEY AUTOINCREMENT` on SQLite, which guarantees ids are never reused after a delete, as the key spec requires.
- Enumerated fields are stored as `String` and validated in the app against the constant lists in `types.ts`. Values like "To Do" and "In Progress" contain spaces, which Prisma enum identifiers cannot hold. Plain strings also avoid SQLite enum quirks.

### 4. Mutations via Server Actions
- `createWorkItem`, `updateWorkItem`, and `deleteWorkItem` live in `src/app/workitems/actions.ts`.
- Create and update use `useActionState`. On validation failure they return `{ errors, values }`, so the form re-renders with field errors and the user's input intact. On success they call `revalidatePath("/workitems")` and `redirect()` to the detail page.
- Delete: the detail page has a client `DeleteWorkItemButton` that opens a confirmation dialog (native `<dialog>`). Only the confirm action submits a form bound to `deleteWorkItem(key)`, which then redirects to `/workitems`.
- **Alternative**: Route Handlers under `/api/workitems`. Deferred until a non-UI client needs them.

### 5. Pages and components
- `/workitems` (`page.tsx`): reads `searchParams.status`, ignores invalid values (treated as "All"), and renders `WorkItemTable` plus `StatusFilter`. The filter is a GET form or links, so the filter state lives in the URL.
- `/workitems/new` and `/workitems/[key]/edit` share `WorkItemForm` (a client component). Edit calls `notFound()` when the item is missing.
- `/workitems/[key]`: detail view plus `DeleteWorkItemButton`, and `notFound()` when the item is missing.
- All pages export `dynamic = "force-dynamic"` so the list always reflects the DB.
- `Header` gets a "Work Items" link.

### 6. Testing strategy
- **Pure unit tests** (default jsdom environment is fine): `validation.ts`, key mapping.
- **Component tests** (jsdom): `WorkItemForm`, `WorkItemTable`, `StatusFilter`, `DeleteWorkItemButton`, `Header`. Server Actions are passed in as props or mocked, so the components never import Prisma.
- **Page tests**: the async Server Component pages are awaited and rendered with `jest.mock("@/lib/workitems")` returning fixtures.
- **Repository integration test**: the `@jest-environment node` docblock, with `DATABASE_URL=file:./data/test.db`. The schema is applied before the suite (`prisma migrate reset --force --skip-seed` via a helper, or `prisma db push`). It covers create defaults, key sequencing and no reuse, update timestamps, delete, and list ordering and filtering.
- **Spike first** (task 1): confirm that `next/jest` can import the Prisma 7 generated ESM client and the native `better-sqlite3` module. If it can't, fall back to `transformIgnorePatterns` / `moduleNameMapper` adjustments, or run the integration test through a separate Jest project config.
  - *Spike outcome*: `jest.config.ts` was updated to export an async config that overrides `transformIgnorePatterns` with `['/node_modules/(?!(@prisma)/)', ...]` so that Next's SWC compiler transforms Prisma 7's `@prisma/client` ESM runtime.
  - *Next.js bundler config*: `next.config.ts` was updated with `serverExternalPackages: ["better-sqlite3", "@prisma/adapter-better-sqlite3"]` so the Next.js server runtime externalizes native sqlite and driver adapter modules.

### 7. Tooling hygiene
- Ignore `src/generated/`, `data/`, and `.env` in `.gitignore`. Ignore `src/generated/` in `.prettierignore` and in the ESLint ignore patterns.
- Scripts: `postinstall: prisma generate`, `db:migrate: prisma migrate dev`, `db:reset: prisma migrate reset`.
- On first run the DB is created by `prisma migrate dev` (documented in tasks); the app does not auto-migrate at runtime.

## Risks / Trade-offs

- [Prisma 7 ESM client or native addon fails under Jest] → Do the spike task first. Component tests never touch Prisma, so only the integration test is at risk.
- [Native `better-sqlite3` build failure on another machine or CI] → Rely on prebuilt binaries for Node 24 and document the toolchain requirement.
- [Dev hot reload opens multiple clients or locks SQLite] → Keep a `globalThis` singleton in dev.
- [String-typed enums can drift] → Use a single source of truth in `types.ts`, used by both validation and the form options.
- [Hard delete is irreversible] → Require an explicit confirmation dialog. Acceptable for a PoC.
- [Derived keys tie the key to the DB id] → Acceptable for the PoC. A real backend swap will map keys inside its own repository implementation.

## Migration Plan

New capability; no existing data. Rollback = revert the change and delete `data/`.
