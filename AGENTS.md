# Agent Guidelines

This document defines operational rules, conventions, and quality gates for AI coding agents working in this repository.

## Project Overview & Mission

**Jira Facade** is a custom interface built to support corporate business and project management workflows.

- **Primary Motivations**:
  1. Internal Jira Data Center edition will reach End-of-Life (EOL) in ~2 years.
  2. Data Center Jira cannot satisfy all corporate project management use cases.
- **Architectural Role**: Serves as a flexible facade layer over Jira Data Center, allowing custom workflow enhancements today and seamless backend migration when Jira DC reaches EOL.
- **Tech Stack**: [Next.js](https://nextjs.org/) (React), Jest, Prettier, and ESLint.

---

## Ground Rules & Quality Verification

Before proposing commits or completing tasks, all changes must satisfy the following quality gates:

1. **Component Unit Tests**: Every component must have corresponding unit tests written in **Jest** and must pass successfully.
2. **Syntax Formatting**: All code must pass formatting checks via **Prettier**.
3. **Linting Compliance**: All code must pass **ESLint** checks adhering to Next.js rule sets without errors or unhandled warnings.

---

## Git Operations & Commit Confirmation Rules

### ⚠️ Mandatory Confirmation Before `git commit`
**Never execute `git commit` without explicit prior confirmation from the user.**

Whenever ready to commit changes:
1. **Summarize Changes**: Present a clear breakdown of modified, added, or deleted files (e.g., via `git status` or `git diff --stat`).
2. **Propose Commit Message**: Offer a clear, descriptive commit message following conventional commits format.
3. **Wait for Explicit Approval**: Ask the user for confirmation and wait for their approval before running `git commit`.
4. **Push Operations**: Do not execute `git push` unless explicitly instructed by the user.

---

## OpenSpec Guidelines
- Follow the OpenSpec schema and workflows configured in `openspec/` and `.agents/`.
- Verify changes against specifications before requesting commit confirmation.
