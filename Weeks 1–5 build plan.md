# Weeks 1–5 build plan

By 8 Nov, a candidate can take task 1 end to end in the browser, the AI proxy injects a seeded trap, and you can replay the whole session.

## Ground rules

One TypeScript monorepo, deployed from day one, with your own Playwright tests guarding the candidate flow. Budget about 40 hours a week: roughly 34 for building and 6 for discovery calls and demos.

```
interview-platform/
  apps/
    web/            Next.js app: hiring dashboard, candidate session, reviewer report, API routes
    worker/         Background jobs: sandbox cleanup, scoring (from week 6)
  packages/
    db/             Drizzle schema, migrations, typed queries
    shared/         Types shared by web and worker (events, task config, trap rules)
    task-runner/    Sandbox client: create, write files, run command, stream output, destroy
  tasks/
    checkout-regression/   One folder per task: task.yaml, brief.md, repo/, hidden/, traps/
  e2e/              Your own Playwright tests for the platform
```

- **Language and checks:** TypeScript strict mode everywhere; ESLint + Prettier; CI on GitHub Actions runs lint, type check, unit tests and e2e on every push.
- **Environments:** `dev` (local + a dev Supabase project) and `prod` (Vercel + prod Supabase). Secrets only in environment variables.
- **Migrations:** every schema change is a Drizzle migration committed to the repo; never edit the prod database by hand.
- **Branching:** short-lived branches, merge to `main` daily; `main` auto-deploys to prod.
- **Weekly rhythm:** Monday plan the week from this tab; Friday record a 3-minute demo video of what works; 2 discovery calls a week (see the main plan).
- **Hour estimates** below are for one developer and include testing; if a week runs over by more than 20%, cut scope using the order in the main plan, not quality.

## Week 1 (5–11 Oct): foundations and the sandbox decision

Goal: a deployed app where a hiring manager can sign in, plus a firm choice of sandbox provider backed by a working spike.

| #   | Task                     | Details                                                                                                                                                                | Hours | Done when                                              |
| --- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ------------------------------------------------------ |
| 1.1 | Repo and tooling         | Create monorepo with pnpm workspaces, TS strict, ESLint, Prettier; GitHub Actions running lint + type check                                                            | 3     | CI is green on an empty app                            |
| 1.2 | Next.js app skeleton     | App Router, Tailwind, base layout, `/dashboard` and `/s/[token]` (candidate) route stubs                                                                               | 3     | Both routes render locally                             |
| 1.3 | Supabase + Drizzle       | Dev and prod projects; Drizzle config; first migration: `workspaces`, `users`                                                                                          | 4     | Migration runs on both databases from CI               |
| 1.4 | Hiring-side auth         | Email magic-link sign-in; on first login create a workspace and make the user its admin; protect `/dashboard`                                                          | 6     | You can sign up, sign out, sign back in                |
| 1.5 | Deploy                   | Vercel project linked to `main`; env vars for prod; custom domain optional                                                                                             | 2     | Prod URL serves the signed-in dashboard                |
| 1.6 | Sandbox spike            | Build a Docker image with Node 20 + Playwright + browsers. Try E2B and Daytona: start a sandbox, upload a tiny repo, run `npx playwright test`, stream output, destroy | 10    | A script runs a real Playwright suite in each provider |
| 1.7 | Sandbox decision note    | Compare cold-start time, run time, cost per hour, egress controls, SDK quality; pick one                                                                               | 2     | Decision written in the repo README                    |
| 1.8 | `task-runner` package v0 | Wrap the chosen provider: `create(image)`, `writeFiles()`, `run(cmd, onOutput)`, `destroy()`                                                                           | 4     | Unit test runs a command and gets its exit code        |

**Week 1 deliverable:** prod URL with working sign-in, and `task-runner` able to run Playwright in a sandbox from a script. Total about 34 hours.

## Week 2 (12–18 Oct): tasks, invites and candidate entry

Goal: you can invite yourself to task 1 by email, open the link, accept the rules and start a timed session.

| #   | Task                      | Details                                                                                                                                                                                   | Hours | Done when                                           |
| --- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | --------------------------------------------------- |
| 2.1 | Task format spec          | Define `task.yaml`: slug, version, title, duration, run command, file list visible to candidate, rubric weights, trap rules (empty for now). Zod schema in `packages/shared`              | 3     | Schema validates a sample task                      |
| 2.2 | Task 1 repo               | "Checkout regression": small app (cart + discount codes), served locally in the sandbox; 4–5 existing Playwright tests; brief with acceptance criteria and one deliberate ambiguity       | 10    | Suite runs green in the sandbox in under 60 s       |
| 2.3 | Task seeding CLI          | `pnpm tasks:sync` reads `tasks/*`, validates, uploads repo files to storage, upserts `tasks` rows (new version on change)                                                                 | 4     | Task 1 appears in the database with a version       |
| 2.4 | Schema v2                 | Migrations for `tasks`, `invites`, `sessions` (fields as in the main plan)                                                                                                                | 2     | Migrations applied to dev and prod                  |
| 2.5 | Task picker + invite form | Dashboard lists tasks (title, duration, what it measures); form for candidate name, email, deadline; creates invite with a random single-use token                                        | 5     | Invite row created from the UI                      |
| 2.6 | Invite email              | Transactional email (Resend or Postmark) with the candidate link and deadline                                                                                                             | 2     | Email arrives in a real inbox                       |
| 2.7 | Invite list               | Table of invites with status: invited, started, submitted, expired                                                                                                                        | 2     | Status updates when a session starts                |
| 2.8 | Candidate entry pages     | `/s/[token]`: validate token and deadline; rules + consent page (AI allowed, AI can be wrong, session recorded); brief page; Start button creates a `session` with server-side start time | 6     | Session row exists with correct start and end times |

**Week 2 deliverable:** invite-to-start flow works on prod; task 1 runs in the sandbox. Total about 34 hours.

## Week 3 (19–25 Oct): editor, sandbox and submit

Goal: a candidate can edit task 1's files in the browser, run the Playwright suite in their own sandbox, and submit. This is the hardest week; protect it from other work.

| #   | Task                     | Details                                                                                                                                 | Hours | Done when                                                |
| --- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- | ----- | -------------------------------------------------------- |
| 3.1 | Session workspace layout | Three panes: file tree, Monaco editor with tabs, bottom panel for test output; brief in a collapsible side panel                        | 5     | Layout works at 1280 px and wider                        |
| 3.2 | Sandbox per session      | On Start: create sandbox from the task image, copy the task repo in, start the app under test; store `sandbox_id` on the session        | 5     | Sandbox ready within 30 s of Start, with a loading state |
| 3.3 | File sync                | Load files from the sandbox into Monaco; on edit, debounce 1 s and write to the sandbox; show saved / saving state                      | 6     | Edits survive a page refresh                             |
| 3.4 | Run tests                | Run button calls `task-runner.run()`; stream output to the panel via Server-Sent Events; parse pass/fail counts; insert `test_runs` row | 6     | Output streams live; a row is stored per run             |
| 3.5 | Timer and auto-submit    | Countdown from the server's end time; at zero, server submits and locks editing; 5-minute warning                                       | 3     | Expired session cannot write files                       |
| 3.6 | Submit                   | Copy final repo files to storage as a snapshot; set `submitted_at`; destroy sandbox; show thank-you page                                | 3     | Snapshot in storage, sandbox gone                        |
| 3.7 | Sandbox safety           | Idle timeout, hard kill at end time + 10 min, CPU/memory limits, network egress blocked except package registry if needed               | 3     | A killed sandbox cannot be reached afterwards            |
| 3.8 | Resume session           | Reopening the link mid-session reconnects to the same sandbox and timer                                                                 | 3     | Closing and reopening the tab loses nothing              |

**Week 3 deliverable:** full edit-run-submit loop on task 1, on prod. Total about 34 hours. If the sandbox fights you, cut 3.8 first and add it in week 5.

## Week 4 (26 Oct–1 Nov): AI proxy, chat and event capture

Goal: the candidate chats with the AI inside the session, and everything they do (edits, pastes, chat, runs, focus) is recorded.

| #   | Task                     | Details                                                                                                                                                                                                                            | Hours | Done when                                      |
| --- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ---------------------------------------------- |
| 4.1 | Schema v3                | Migrations for `ai_messages` and `test_runs` (if not done), plus `event_log_url` on sessions                                                                                                                                       | 1     | Applied to dev and prod                        |
| 4.2 | AI proxy endpoint        | `POST /api/ai/chat`: auth by session token; build system prompt (task context, "you are a normal coding assistant"); attach files the candidate selects; call the model; stream back; log prompt, response, model, tokens, latency | 8     | Every message appears in `ai_messages`         |
| 4.3 | Session AI budget        | Per-session token cap and request rate limit; friendly message when reached                                                                                                                                                        | 2     | Cap enforced in a test                         |
| 4.4 | Chat panel               | Right-hand panel: streaming replies, markdown + code blocks, copy and "insert at cursor" buttons, "add current file as context" toggle                                                                                             | 7     | Chat feels usable on task 1                    |
| 4.5 | Event recorder (client)  | Capture Monaco content changes, paste events (with size), file switches, insert-from-chat, window focus/blur, run clicks; buffer and send every 5 s and on unload                                                                  | 6     | Events arrive in order with timestamps         |
| 4.6 | Event ingestion (server) | `POST /api/events`: validate with Zod, append to an NDJSON log in storage per session (chunked files)                                                                                                                              | 4     | A 60-min session log loads in under 2 s        |
| 4.7 | Task 2 repo              | "Flaky suite rescue": 3 flaky tests with real race conditions                                                                                                                                                                      | 6     | Tests fail intermittently for the right reason |

**Week 4 deliverable:** a complete recorded session you can inspect as raw JSON (events + AI log + test runs). Total about 34 hours.

## Week 5 (2–8 Nov): traps, replay and a first dry run

Goal: the proxy injects a seeded trap on task 1, you can replay any session, and two friendly testers have taken task 1.

| #   | Task                      | Details                                                                                                                                                                                                                                           | Hours | Done when                                             |
| --- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ----------------------------------------------------- |
| 5.1 | Trap rules in `task.yaml` | Each trap: id, trigger (e.g. prompt mentions "discount" and asks for a test), max fires per session, and a pre-written flawed answer variant. Pre-written beats asking the model to make a mistake: it is deterministic and the same for everyone | 3     | Schema validates task 1's 2 traps                     |
| 5.2 | Trap engine in proxy      | On a matching request, generate the normal answer, then swap in the flawed code block; log `injected_trap_id`; never fire more than the cap                                                                                                       | 6     | Trap fires exactly when its trigger matches, in tests |
| 5.3 | Trap detection v0         | After submit, check the final snapshot: is the trap's flawed pattern still present? Did a test run happen after the trap fired? Store caught / missed                                                                                             | 4     | Correct result on 4 hand-made test sessions           |
| 5.4 | Replay v0                 | Reviewer page: rebuild file contents at any time from the event log; scrubber with markers for AI messages, pastes, test runs and traps; click a marker to jump                                                                                   | 10    | You can watch a full session back at 4x speed         |
| 5.5 | Platform e2e test         | Your own Playwright test: sign in, invite, start session, edit, run, chat, submit, open replay                                                                                                                                                    | 4     | Runs in CI on every push                              |
| 5.6 | Error tracking and logs   | Sentry (or similar) on web and API; structured logs for sandbox and proxy calls                                                                                                                                                                   | 2     | A thrown error shows up with context                  |
| 5.7 | Dry run                   | 2 QA engineers you know take task 1 on prod; watch their replays; list the top 5 problems                                                                                                                                                         | 5     | Problems logged as issues for week 6                  |

**Week 5 deliverable:** a replayable session containing an injected trap and a caught/missed result. Total about 34 hours.

## End-of-week-5 checkpoint

On Sunday 8 Nov, tick these off honestly; anything unticked becomes the first work of week 6, before any evaluation-layer features.

- [ ] A stranger can go from invite email to submitted session on prod without your help
- [ ] Task 1 runs reliably in the sandbox (no failed starts in the last 10 sessions)
- [ ] Every AI message, test run and editor event is stored for every session
- [ ] Task 1's traps fire on trigger and are scored caught or missed correctly
- [ ] Replay shows a full session, with jump-to markers for AI messages and traps
- [ ] Platform e2e test passes in CI
- [ ] Task 2 repo exists and runs; task 3 chosen
- [ ] At least 1 design partner has said yes (from the discovery track)

Week 6 then starts the evaluation layer: rule-based key moments, the LLM summary, AI-only baseline runs on tasks 1–2, explain-back questions, and the reviewer report screen.
