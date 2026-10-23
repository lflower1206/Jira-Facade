# Tasks

## 1. Persistence Setup & Jest Spike

- [x] 1.1 Install `@prisma/client`, `@prisma/adapter-better-sqlite3`, `better-sqlite3`, `dotenv` and dev deps `prisma`, `@types/better-sqlite3`; verify `npm install` succeeds and `node -e "require('better-sqlite3')"` loads the native module.
- [x] 1.2 Create `prisma/schema.prisma` (`prisma-client` generator, output `../src/generated/prisma`, `WorkItem` model per design), `prisma.config.ts`, and `.env.example` with `DATABASE_URL="file:./data/jira-facade.db"`; verify `npx prisma validate` passes.
- [x] 1.3 Run `npx prisma migrate dev --name init_work_items` and verify the generated migration SQL contains `PRIMARY KEY AUTOINCREMENT` and that `data/jira-facade.db` is created.
- [x] 1.4 Update `.gitignore` (`data/`, `.env`, `src/generated/`), `.prettierignore` and ESLint ignores (`src/generated/`), and add scripts `postinstall`, `db:migrate`, `db:reset`; verify `npm run lint` and `npm run format` still pass and `git status` shows no generated/DB files.
- [x] 1.5 Create `src/lib/db/prisma.ts` (singleton client with better-sqlite3 adapter, `globalThis` cache in dev).
- [x] 1.6 Spike: write a throwaway `@jest-environment node` test that imports the client and runs `prisma.workItem.count()` against `data/test.db`; verify it passes under `npm test` (adjust Jest config if needed and record any config changes in design.md), then keep or remove the spike test.

## 2. Domain Layer & Repository

- [x] 2.1 Implement `src/lib/workitems/types.ts` (WorkItem, WorkItemInput, `WORK_ITEM_TYPES`/`STATUSES`/`PRIORITIES`, defaults) and key helpers `toKey`/`parseKey`; verify unit tests cover `JF-1` <-> 1 and reject malformed keys (`JF-abc`, `XX-1`, `JF-0`).
- [x] 2.2 Implement `src/lib/workitems/validation.ts` (`validateWorkItemInput` from FormData: trims, required summary, 255 limit, enum checks, defaults); verify unit tests cover every Input Validation scenario in the spec.
- [x] 2.3 Define `WorkItemRepository` interface (`list({status?})`, `getByKey`, `create`, `update`, `delete`) and `getWorkItemRepository()` factory in `src/lib/workitems/index.ts`.
- [x] 2.4 Implement `PrismaWorkItemRepository` with a `@jest-environment node` integration test against a freshly reset `data/test.db`; verify tests cover creation defaults and timestamps, sequential keys and no key reuse after delete, update refreshing `updatedAt` while preserving key/`createdAt`, delete, missing key returns null, list ordering by `updatedAt` desc, and status filtering.

## 3. Server Actions

- [x] 3.1 Implement `src/app/workitems/actions.ts` (`createWorkItem`, `updateWorkItem`, `deleteWorkItem`) using validation + repository, returning `{ errors, values }` on failure and `revalidatePath` + `redirect` on success; verify unit tests (repository and `next/navigation`/`next/cache` mocked) cover success redirects, validation failure without persistence, and not-found on update/delete.

## 4. List Page

- [x] 4.1 Build `WorkItemTable` and `StatusFilter` components with Jest tests; verify tests cover rendered columns, links to `/workitems/<key>`, empty-state with create link, and filter options writing `?status=` (including "All").
- [x] 4.2 Build `src/app/workitems/page.tsx` (force-dynamic, reads `searchParams.status`, invalid -> All) with a page test using a mocked repository; verify the list and filtered views render the expected items.

## 5. Create & Edit Pages

- [x] 5.1 Build client `WorkItemForm` (shared create/edit, `useActionState`, field errors, preserved values, enum options from `types.ts`) with Jest tests; verify tests cover pre-filled values, error display, and option lists.
- [x] 5.2 Build `src/app/workitems/new/page.tsx` and `src/app/workitems/[key]/edit/page.tsx` (`notFound()` for missing/malformed key) with page tests; verify the edit page pre-fills values and missing keys trigger not-found.

## 6. Detail Page & Delete

- [x] 6.1 Build client `DeleteWorkItemButton` (native `<dialog>` confirm, submits only on confirm) with Jest tests; verify cancel does not submit and confirm submits the delete form.
- [x] 6.2 Build `src/app/workitems/[key]/page.tsx` (all fields, Edit link, delete button, `notFound()`) with page tests; verify fields render and missing key triggers not-found.

## 7. Navigation

- [x] 7.1 Add "Work Items" link to `Header` and extend `Header.test.tsx`; verify the link points to `/workitems`.

## 8. Integration & Quality Gates

- [x] 8.1 Manually verify end-to-end with `npm run dev`: create, list, filter, view, edit, delete with confirm/cancel, not-found for `/workitems/JF-999`, and data persisting after a dev server restart.
- [x] 8.2 Run `npm run lint`, `npm run format`, `npm test`, and `npm run build`; verify all pass with zero errors or unhandled warnings per AGENTS.md.
- [x] 8.3 Run `openspec validate add-workitem-crud --strict` and verify it passes.

## Workflow follow-up

- Present `git status` / `git diff --stat` and a proposed conventional commit message; commit only after explicit user approval (AGENTS.md).
- Archive the change with `/opsx-archive` after review.
