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

**Decision: Daytona** for candidate sandboxes (3 Oct 2026). E2B stays as the fallback; `task-runner` hides the provider behind one interface so switching is a small change.

### What was tested

The spike lives in `packages/task-runner/spike/`. Both providers ran the same job: create a sandbox from the official `mcr.microsoft.com/playwright:v1.63.0-noble` image (2 vCPU, 4 GiB), upload a tiny repo, `npm install`, run `npx playwright test` with live output (2 tests pass, 1 fails on purpose so the exit code is 1), then destroy. Medians over 4 runs, from a developer laptop:

| Step (ms)                             | E2B                            | Daytona             |
| ------------------------------------- | ------------------------------ | ------------------- |
| Create sandbox (image already cached) | 1271                           | 1168                |
| Upload repo (3 files)                 | 1194                           | 558                 |
| `npm install`                         | 4869                           | 1983                |
| Playwright run (3 tests)              | 11370                          | 7000                |
| Destroy                               | 547                            | 593                 |
| One-off image build                   | 74 s (explicit template build) | 11 s (first create) |

| Other                 | E2B                                                                                                     | Daytona                                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Price, 2 vCPU + 4 GiB | about $0.17/hour ($0.000014 per vCPU-s, $0.0000045 per GiB-s)                                           | about $0.17/hour ($0.0504 per vCPU-h, $0.0162 per GiB-h, disk beyond 5 GiB extra)                      |
| Free credits          | $100 one-off                                                                                            | $200                                                                                                   |
| Session length        | Hobby: 1 hour max. Pro: 24 hours                                                                        | No fixed cap found; auto-stop is configurable                                                          |
| Egress control        | Hostname allowlist works: allowing only `registry.npmjs.org` blocked `example.com` and `api.github.com` | CIDR allowlist or block-all only. Default tier policy allowed npm and GitHub and blocked `example.com` |
| Streaming output      | `onStdout` callback, throws on non-zero exit                                                            | Session commands plus a log stream; exit code is read separately                                       |
| SDK                   | `e2b`                                                                                                   | `@daytona/sdk` (the old `@daytonaio/sdk` name is deprecated)                                           |

### Why Daytona

- Faster at every step that matters to a candidate: about 40% quicker test runs and 2.5x quicker installs. Candidates click Run many times in a session.
- Same price, and the larger free credit covers the weeks 1 to 6 testing.
- No 1-hour session cap on the free plan. Our sessions run up to about 90 minutes, so E2B would need a paid Pro plan from day one.

### What we give up, and the mitigation

- No hostname-level egress allowlist. The AI proxy runs on our server, not in the sandbox, and a candidate can already reach any website on their own laptop, so strict egress is a nice-to-have. Block-all or a CIDR list is enough for task 3.7.
- Exit codes need a small polling step after log streaming ends. `task-runner` hides that.

### Still to verify (before week 3)

- The maximum sandbox lifetime and auto-stop behaviour for sessions longer than 60 minutes.
- Concurrent sandbox limits on the plan we will use, for pilot sessions with several candidates at once.

## `task-runner`

Provider-neutral sandbox client in `packages/task-runner`. The rest of the app only sees the `Sandbox` interface: `create`, `writeFiles`, `run(command, { cwd, env, timeoutMs, onOutput })` and `destroy`. `DaytonaProvider` is the first implementation; adding E2B means adding one more class that implements `SandboxProvider`.

```ts
const sandbox = await new DaytonaProvider().create({ image: PLAYWRIGHT_IMAGE });
await sandbox.writeFiles([{ path: "repo/package.json", content: "..." }]);
const result = await sandbox.run("npx playwright test", {
  cwd: "repo",
  env: { PLAYWRIGHT_BROWSERS_PATH: "/ms-playwright" }, // Daytona does not carry over the image's ENV
  onOutput: (chunk) => process.stdout.write(chunk),
});
await sandbox.destroy();
```

Notes for whoever extends it:

- Daytona's built-in log stream adds 1 to 3 seconds at each end of a command, so `run` starts the command in the background, writes to a log file and polls it every 250 ms. A trivial command takes about 1 second end to end.
- Each command runs in its own `bash -c`, so an `exit` or `cd` in one run never affects the next.
- `pnpm test` runs the real-sandbox tests when `DAYTONA_API_KEY` is set and skips them otherwise.
- `pnpm --filter @proofwork/task-runner spike:playwright` runs the fixture Playwright suite through the runner; `spike:cleanup` deletes any sandboxes left behind.

## Tasks and `pnpm tasks:sync`

Each task is a folder in `tasks/` (`task.yaml`, `brief.md`, `repo/`, `hidden/`, `traps/`); the format is documented in `packages/shared/src/task.ts`.

```bash
pnpm tasks:sync dev --dry-run   # show what would change
pnpm tasks:sync dev             # validate, upload and record new versions
```

- Only `repo/` is uploaded (to the private `task-files` bucket). `hidden/` and `traps/` never leave the repository.
- A task whose content is unchanged is skipped. Any change, even to a hidden file, creates a new version (`checkout-regression/v2/...`). Old versions are kept because running sessions point at them.
- Text files are hashed with LF line endings, so Windows and Linux agree.
- It reads `SUPABASE_DEV_SESSION_POOLER`, `SUPABASE_DEV_URL` and `SUPABASE_DEV_SERVICE_ROLE_KEY` (and the `PROD` equivalents) from `.env` or the environment. The service-role key can bypass all security: never commit it, and never put it in a `NEXT_PUBLIC_` variable.
- `pnpm --filter @proofwork/task-runner verify-task <slug>` checks in a real sandbox that a task's visible tests pass, its hidden tests catch the planted bug, and the reference solution passes.

## Database security

Row-level security is on for every table and there are no policies, so the publishable key can read nothing through Supabase's REST API. The app talks to Postgres directly from the server. Any new table must call `.enableRLS()` in `packages/db/src/schema.ts`.
