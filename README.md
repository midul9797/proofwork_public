# Proofwork

A hiring platform where candidates complete real engineering tasks with an AI assistant, and reviewers see how they worked, not just what they shipped.

## Layout

- `apps/web` — Next.js app: hiring dashboard, candidate session, reviewer report, API routes
- `apps/worker` — background jobs (from week 6)
- `packages/db` — Drizzle schema and migrations
- `packages/shared` — shared types and schemas
- `packages/task-runner` — sandbox client
- `tasks/` — one folder per task
- `e2e/` — Playwright tests for the platform

## Development

```bash
pnpm install
pnpm lint
pnpm typecheck
```

## Sandbox provider decision

_To be written in task 1.7._
