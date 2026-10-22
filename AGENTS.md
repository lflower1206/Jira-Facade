# Agent Guidelines

This document defines operational rules and conventions for AI coding agents working in this repository.

## Git Operations & Commit Confirmation Rules

### ⚠️ Mandatory Confirmation Before `git commit`
**Never execute `git commit` without explicit prior confirmation from the user.**

Whenever ready to commit changes:
1. **Summarize Changes**: Present a clear breakdown of modified, added, or deleted files (e.g., via `git status` or `git diff --stat`).
2. **Propose Commit Message**: Offer a clear, descriptive commit message following conventional commits format.
3. **Wait for Explicit Approval**: Ask the user for confirmation and wait for their approval before running `git commit`.
4. **Push Operations**: Do not execute `git push` unless explicitly instructed by the user.

## OpenSpec Guidelines
- Follow the OpenSpec schema and workflows configured in `openspec/` and `.agents/`.
- Verify changes against specifications before requesting commit confirmation.
