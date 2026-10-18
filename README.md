# Proofwork landing page

Next.js 16 App Router, statically rendered. The landing page explains the full assessment: problem framing, AI collaboration, verification, domain judgment, and outcome.

```bash
npm install
npm run dev
npm run build
npm run start
```

## Configuration

Copy `.env.example` to `.env.local`, or set the variables on the hosting provider. Public variables are included at build time; rebuild after changing them.

| Variable | Used for |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL, Open Graph, sitemap, and robots. Falls back to the Vercel production URL, then localhost. |
| `NEXT_PUBLIC_APP_URL` | The existing application's sign-in destination. Defaults to `https://proofwork-public.vercel.app`. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Demo requests, founder contact links, FAQ, and organization metadata. Defaults to `moklasurrahman9797@gmail.com`, as supplied by the founder. |

Demo actions open the visitor's email client with a subject and a short enquiry template. There is no lead collection backend or claim that an email has been sent. The page does not publish or deploy itself.

## Content and interactions

- `components/AssessmentExample.tsx`: four selectable assessment stages, with the evaluation open by default. Each of the five dimensions opens its source excerpt, draft interpretation, and limitation. All content is explicitly fictional.
- `components/RoleExplorer.tsx`: four role selectors and the corresponding tasks, from `lib/content.ts`.
- `lib/content.ts`: role/task descriptions and FAQ answers. Business analyst and sales descriptions are editorial summaries of the existing task titles; confirm against the assessment app before public launch.
- `lib/site.ts`: branding, description, URLs, and email configuration.
- `app/page.tsx`: page structure and JSON-LD generated from the same FAQ content.
- `app/globals.css`: responsive tokens, layouts, interaction states, and reduced-motion behavior.

The detailed mechanics of deliberate mistakes, task generation, simulations, and answer keys are not rendered on the public page. Candidate information still discloses deliberate mistakes, recording, timing, consent, and reviewer control. Custom assessment creation is explicitly in development.

Only product manager task timing is stated as 45 minutes. Other roles refer to the allowance shown before starting. Confirm live role availability and timing against the app before sharing externally.

## Metadata and visual system

The wordmark, favicon, theme color, manifest, and generated Open Graph image use the same paper and green palette. Schibsted Grotesk is self-hosted by `next/font`. See `DESIGN.md` for the system and the local `.taste-skill/redesign-report.md` for design review notes.

Product previews are authored interface examples using fictional materials, not real candidate sessions or screenshots. No customer logos, endorsements, outcome metrics, or unverified pricing claims are included. The footer does not link to nonexistent policy pages; add actual policies when they are ready.
