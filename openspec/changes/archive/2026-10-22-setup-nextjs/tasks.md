# Tasks

## 1. Project Initialization & Configuration

- [x] 1.1 Create `package.json` with Next.js, React, TypeScript, Tailwind CSS, Jest, Prettier, and ESLint dependencies, and verify installation via `npm install`.
- [x] 1.2 Configure TypeScript (`tsconfig.json`), Next.js (`next.config.ts`), and Tailwind/PostCSS (`postcss.config.mjs`, `tailwind.config.ts`), and verify type check passes via `npx tsc --noEmit`.
- [x] 1.3 Configure Jest (`jest.config.ts`, `jest.setup.ts`), ESLint (`.eslintrc.json`), and Prettier (`.prettierrc`), and verify test and lint commands are executable.

## 2. Core Application Shell & Routes

- [x] 2.1 Create root layout (`src/app/layout.tsx`) and global styles (`src/app/globals.css`), and verify application shell compiles successfully.
- [x] 2.2 Implement landing dashboard view (`src/app/page.tsx`), and verify page renders Jira Facade welcome and placeholder sections.
- [x] 2.3 Implement health check route handler (`src/app/api/health/route.ts`), and verify unit test or direct request returns status 200 with `{ status: "ok" }`.

## 3. UI Component & Quality Verification

- [x] 3.1 Create a reusable Header component (`src/components/Header.tsx`) with corresponding Jest test (`src/components/Header.test.tsx`), and verify unit test passes via `npm test`.
- [x] 3.2 Run complete quality gates (`npm run lint`, `npm run test`, and `npm run build`), and verify all checks pass without errors or unhandled warnings per AGENTS.md.
