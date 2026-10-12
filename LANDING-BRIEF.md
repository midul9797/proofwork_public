# Proofwork landing page: design brief

Hand-off for a separate landing-page project. Read `PRODUCT.md` (copied beside this file) first; it holds the product truth. This file holds what is specific to the landing page. Written 11 Oct 2026.

## 1. Job and audience

- **Mode:** Persuade. The visitor decides and acts.
- **Visitor:** founders, engineering managers and heads of talent at startups and scale-ups (about 20 to 500 people) who hire engineers.
- **Their situation:** take-home tests and coding scores stopped meaning much once every candidate uses AI. They cannot tell real skill from pasted output, and hiring takes too long.
- **What they must understand in 5 seconds:** Proofwork shows how a candidate works *with* AI, not just what they ship.
- **The one action:** enter a work email and start free.

## 2. What only Proofwork can claim (the proof)

All true today. Use these, and nothing beyond them.

- **Real task in a real sandbox.** The candidate works in the browser: file tree, Monaco editor, test runner, their own sandbox. Timed.
- **AI is allowed.** An AI assistant sits in the workspace. Using it well is part of the skill being judged.
- **Planted mistakes ("traps").** Some AI answers deliberately contain a mistake. After submission the platform checks whether the candidate kept it or caught it. Result: **Caught** or **Kept**.
- **Full replay.** Everything the candidate typed, pasted, ran and asked, replayable second by second. The reviewer sees "what the AI really said" next to "what the candidate saw".
- **Key moments.** The points a reviewer should look at first (first prompt, large pastes from the AI, planted errors, first passing test run, regressions, quiet stretches, time away from the window, submission). Worked out by plain rules: facts, not judgments.
- **Draft evaluation with checked evidence.** On request, an AI judge drafts scores for five competencies with evidence. Every quote is checked against the real session; evidence that does not check out is dropped. It is only a draft: the reviewer changes any score and marks their own evaluation final.
- **AI-only baseline.** What the AI scores on the same task alone, so a reviewer sees whether the candidate added anything beyond the AI.
- **Explain-back.** After submitting, the candidate can answer short questions about their own work. The reviewer also gets suggested questions to ask.
- **Fair, not hidden volume metrics.** Sending more AI messages is never rewarded; message counts are context only.
- **No password.** Sign-in is a magic link to a work email. The first sign-in creates a workspace.

### Tasks available

- Live (published): **Checkout regression** (fix a stale-discount bug in a small shop, add tests) and **Flaky suite rescue**. Both are coding tasks.
- Drafts, not offered yet: Product manager (*Prioritise next quarter*, *Ship or not, from a noisy experiment*), Business analyst (*Revenue drop diagnosis*, *Two dashboards disagree*), Sales (*Pipeline review and forecast call*, *Recover a stalled deal*). Show these only as **coming soon**, never as available.

### What does not exist (never invent)

No customers, logos, testimonials, case studies, usage numbers, benchmarks, pricing, security certifications or integrations. Leave those sections out. Any demonstration session on the page must be labelled as an example.

## 3. Visual direction

- **Owner's decision:** modern SaaS polish at the craft level of **Linear** (linear.app). Not a themed metaphor. Three rounds of themed directions were shown and rejected.
- **Dark-first.** The app's own replay and candidate workspace are dark, so real product screenshots sit on the page naturally.
- **Colour:** near-black graphite ground, one accent. Tie it to the app so the page and product feel like one brand:

| Role | App token | Value |
| --- | --- | --- |
| Darkest ground | slate-950 | `#111418` |
| Dark surface | slate-900 | `#1a1e24` |
| Raised surface | slate-800 | `#232830` |
| Border / muted | slate-700 | `#343b42` |
| Muted text | slate-400 | `#8e968f` |
| Light text / paper | slate-50 | `#f3f5f2` |
| Accent (pencil blue) | sky-500 / sky-600 | `#3d68e8` / `#2d5be3` |
| Accent light | sky-300 / sky-400 | `#9db4f3` / `#6d8ef0` |
| "Caught" (verified teal) | emerald-500 | `#19a28b` |
| "Look here" flag | amber-400 / amber-500 | `#e0a04a` / `#c97d1c` |

  The app uses Schibsted Grotesk (interface) and Newsreader (long reading). The landing page may pick its own display face for headlines; keep body text in a workhorse sans.
- **Imagery:** real product UI is the hero image (see `screenshots/`). No gradient blobs, no stock photos, no generic icon tiles.
- **Motion:** one signature moment plus small, restrained reveals. Respect `prefers-reduced-motion`; content visible by default.

## 4. Page structure, top to bottom

1. **Nav:** logo · How it works · Tasks · FAQ · Sign in · **Start free** (button).
2. **Hero:** headline idea *"See how candidates work with AI, not just what they ship."* One supporting line about planted mistakes and full replay. A working work-email field and **Start free**, with "No password. No card." beneath. A large real replay screenshot.
3. **Signature moment:** a scroll-driven walk through an example session. The AI gives an answer with a planted mistake, it is highlighted, the candidate catches it, and the badge resolves to **Caught** (show the **Kept** outcome too). This is the moment a competitor cannot copy.
4. **The problem:** three short statements: AI writes the take-home; scores cannot tell skill from copy-paste; interviews take weeks. Plain claims, no statistics.
5. **How it works:** four steps: **Invite** (pick a task, send a link) → **They work** (real sandbox, editor, tests, AI allowed) → **Replay** (everything they typed, pasted and asked) → **Decide** (draft evaluation with checked evidence that you can override).
6. **Feature detail:** alternating rows, each with real UI: Traps · Replay ("what the AI said vs what they saw") · Key moments · Draft evaluation · AI-only baseline · Explain-back.
7. **Tasks:** the two live coding tasks as cards; PM, BA and Sales tasks as "coming soon".
8. **Fair to candidates:** a calm, timed workspace; AI openly allowed; candidates consent to recording before they start.
9. **FAQ:** Is AI allowed? What is recorded? How long are tasks? Can I override the evaluation? Where is data stored (Supabase, Tokyo region)?
10. **Final call to action:** the headline again with the email field.
11. **Footer:** product links, sign in, privacy, terms.

## 5. Constraints

- WCAG 2.2 AA, full keyboard use, visible focus. English only.
- Responsive: works at 390px wide with the hero email field above the fold; checked at 1280 to 1600 desktop widths.
- Fast: no heavy video in the hero; images sized and lazy-loaded below the fold.
- **Sign-up hand-off:** the app's sign-in lives at `https://proofwork-public.vercel.app/login` (the hostname is a leftover and may change). A separate landing project cannot send the magic link itself. Either link Start free to the app's `/login`, or the app gains a small endpoint that accepts the email. Do not put the email in a URL query string.
- Never show traps' contents, hidden tests or reference solutions from the real tasks; the example session must be invented and labelled.

## 6. Open decisions (owner to answer)

1. **Pricing:** "Free while in early access", or no pricing section?
2. **Privacy and terms pages:** do they exist? The footer and the email form need them.
3. **Final headline:** keep the line above, or the owner's own?
4. **Domain and sign-up hand-off:** the final domain for the landing page and the app; link to `/login` or add an endpoint (see section 5).

## 7. Screenshots

The owner adds real screenshots to `screenshots/`. Wanted, at desktop width (about 1440 wide, 2x pixel density if possible):

1. `replay.png`: the replay of a finished session, mid-session, with the editor and AI chat visible.
2. `trap-caught.png`: the replay at a planted-error answer, highlighted, with the **Caught** result.
3. `trap-kept.png`: the same for a **Kept** result, if one exists.
4. `report.png`: the reviewer report (evaluation with competency scores and evidence).
5. `key-moments.png`: the key moments list on the report.
6. `baseline.png`: the AI-only baseline comparison on the report.
7. `workspace.png`: the candidate workspace (file tree, editor, test runner, AI chat).
8. `dashboard.png`: the invite list with statuses.

Use demo data only: no real candidate names or emails, and no trap contents, hidden tests or solutions from the real tasks. If a screenshot is missing, build the section around a labelled placeholder and list it as still needed.
