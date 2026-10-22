# Design

## Context

The repository is currently an empty directory with repository guidelines ([AGENTS.md](file:///Users/william/workspace/Jira-Facade/AGENTS.md)) and OpenSpec configurations. The project will serve as an enterprise facade over Jira Data Center. See `proposal.md` for overall motivation.

## Goals / Non-Goals

**Goals:**
- Establish a clean Next.js 15+ App Router application with TypeScript.
- Set up Tailwind CSS for layout styling and utility tokens.
- Configure complete verification tooling required by [AGENTS.md](file:///Users/william/workspace/Jira-Facade/AGENTS.md): Jest with React Testing Library, ESLint with Next.js rules, and Prettier.
- Structure the project under `src/` to support future facade modules (`src/lib/jira`, `src/components`, `src/app/api`).
- Include an initial dashboard shell page, a healthcheck endpoint (`/api/health`), and a passing sample Jest component test.

**Non-Goals:**
- Actual integration with a live Jira Data Center instance or Jira OAuth/PAT authentication (reserved for follow-up changes).
- End-to-end (E2E) testing frameworks like Playwright/Cypress.
- Production hosting/CI deployment infrastructure.

## Decisions

### 1. App Router Architecture (`src/app/`)
- **Choice**: Next.js App Router using `src/app` directory layout.
- **Rationale**: Server Components provide efficient server rendering, while Route Handlers (`src/app/api/...`) create the ideal server-side facade boundary to authenticate, proxy, and reshape Jira Data Center REST responses.
- **Alternatives considered**: Pages Router (`pages/`) - older convention, lacks server components and fine-grained layouts.

### 2. TypeScript with Strict Mode
- **Choice**: TypeScript with `"strict": true` in `tsconfig.json`.
- **Rationale**: Jira's REST API returns large, nested objects (custom fields, issue types, status transitions). Strict types prevent runtime degradation and ease future migration away from Jira DC.
- **Alternatives considered**: JavaScript - rejected due to lack of type safety and higher maintenance burden.

### 3. Tailwind CSS for Styling
- **Choice**: Tailwind CSS with PostCSS.
- **Rationale**: Utility-first CSS provides fast prototyping, consistent spacing/colors for enterprise layouts, and zero runtime performance overhead.
- **Alternatives considered**: CSS Modules (requires extra boilerplate for layout components), styled-components (requires runtime style injection and has SSR complexities).

### 4. Testing Framework: Jest with `next/jest`
- **Choice**: Jest configured via `next/jest` alongside React Testing Library and `@testing-library/jest-dom`.
- **Rationale**: Strictly aligns with the project quality gate in [AGENTS.md](file:///Users/william/workspace/Jira-Facade/AGENTS.md). `next/jest` handles SWC transformations for TSX out of the box without manual Babel setups.
- **Alternatives considered**: Vitest - fast, but [AGENTS.md](file:///Users/william/workspace/Jira-Facade/AGENTS.md) explicitly mandates Jest.

### 5. ESLint and Prettier Setup
- **Choice**: ESLint with `eslint-config-next` and a standalone Prettier configuration (`.prettierrc`).
- **Rationale**: Satisfies the linting and formatting compliance quality gates specified in [AGENTS.md](file:///Users/william/workspace/Jira-Facade/AGENTS.md).

## Risks / Trade-offs

- **[Risk]** Next.js 15 / React 19 testing library peer dependency or Jest transform issues.  
  → **Mitigation**: Use compatible versions of `ts-node`, `jest-environment-jsdom`, and `@testing-library/react` aligned with the Next.js standard Jest documentation.
- **[Risk]** Route Handlers caching unexpected responses.  
  → **Mitigation**: Explicitly declare dynamic route configuration (`export const dynamic = 'force-dynamic'`) on the health check and future facade endpoints.
