# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: hiring managers and reviewers. They invite candidates to a task, then read the evaluation report and watch the session replay to judge how the candidate worked. Secondary: candidates, who do a timed task in a desktop browser workspace (file tree, Monaco editor, test runner, AI chat). Admins (an `ADMIN_EMAILS` allow-list) use `/admin`.

## Product Purpose

Proofwork is a hiring platform. A candidate completes a timed, hands-on task (engineering, or a written task for a business role) with an AI assistant they are allowed to use. Everything is recorded so a reviewer sees how they worked, not only what they shipped. Success: a reviewer can trust and quickly act on a hire/no-hire signal.

## Positioning

The platform plants mistakes ("traps") in some AI answers and checks whether the candidate kept them. The replay shows what the AI actually said against what the candidate saw. A plain coding test or ATS does not show how someone works with AI.

## Operating Context

Web app (Next.js 16, App Router, Tailwind v4) in `apps/web`. Routes: landing `/`, `/login`, `/dashboard` (invites, sessions, report, replay), `/s/[token]` (candidate workspace), `/admin`. Candidate sessions run in a sandbox per candidate. Reviewers move between light hiring pages and the dark replay.

## Capabilities and Constraints

- Platform decisions are in `docs/DECISIONS.md`; D13 fixed the current palette and fonts (Schibsted Grotesk interface, Newsreader long reading; light hiring pages, dark candidate workspace and replay).
- Never expose traps, hidden tests, reference solutions or candidate tokens to the browser.
- Keep `data-testid` values and accessible names stable (end-to-end test depends on them).
- The landing page was left untouched at the owner's request in D13.

## Brand Commitments

Product name: Proofwork. Existing palette and fonts per D13 are incumbent for the app.

Marketing surfaces (landing page): the owner chose the category standard, modern SaaS polish, executed at the craft level of Linear (11 Oct 2026). No themed metaphor worlds.

## Evidence on Hand

No customer testimonials, logos or usage metrics exist. Do not fabricate any.

## Product Principles

- Show the process, not just the result: evidence a reviewer can verify beats a score.
- Honest about limits: say what was and was not checked.
- Reviewer time is scarce: surface what matters first, detail on demand.
- Candidate fairness: the workspace stays calm and legible under time pressure.

## Accessibility & Inclusion

WCAG 2.2 AA. English only. Desktop-first for the candidate workspace; dashboard and report should still work on narrow screens.
