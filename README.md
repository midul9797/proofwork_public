# Proofwork landing page

Next.js 16 (App Router), fully static. Product truth lives in `PRODUCT.md`, the page brief in `LANDING-BRIEF.md`.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start
```

## Configuration

Copy `.env.example` to `.env.local` (or set these in your host):

| Variable | Used for |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL, Open Graph URLs, sitemap, robots. Falls back to Vercel's production URL, then localhost. |
| `NEXT_PUBLIC_APP_URL` | The app. Every "Start free" and "Sign in" link goes to `$NEXT_PUBLIC_APP_URL/login`. Defaults to `https://proofwork-public.vercel.app`. |

## SEO

- Static prerender of `/` with one `h1`, semantic sections and real text (no text baked into images).
- `metadata` in `app/layout.tsx`: title, description, canonical, Open Graph, Twitter card.
- `app/opengraph-image.tsx` generates the 1200×630 share image at build time.
- `app/robots.ts`, `app/sitemap.ts`, `app/manifest.ts`, `app/icon.svg`.
- JSON-LD in `app/page.tsx`: Organization, WebSite, SoftwareApplication (free offer), FAQPage built from the same `lib/content.ts` FAQ the page renders.
- Fonts are self-hosted at build time by `next/font` (Schibsted Grotesk, JetBrains Mono).

## Professions

The page covers every live profession: Product manager, Business analyst, Sales, and QA / SDET (two tasks each). Tasks live in `lib/content.ts` (`roles`) and the walkthrough examples in `lib/scenarios.ts`. Adding a profession means adding one entry to each; the hero role row, the switcher and the Tasks grid pick it up.

**Rule for examples:** walkthrough and hero examples must use topics no real task covers, and never a real trap's text or kind. The page is public, and candidates can read it. Saying that traps exist is fine and stated openly in the "Taking a Proofwork task?" section. Which answers are planted, how many per task, and how checks are scored stay private.

## Still needed from the owner

- **Product views are authored, not screenshots.** The screenshots in `screenshots/` show real email addresses and a real task's planted-error text, which the brief rules out. So every product view on the page is authored HTML in the app's style, labelled as an example with invented data. To use real captures, retake them with demo data and no trap text.
- **One-line descriptions** for the Business analyst and Sales tasks. Only their titles are known, so their cards show titles only.
- **Durations for the non-PM tasks.** The FAQ only cites 45 minutes for the product manager tasks.
- **Privacy and terms pages.** The footer links to `/privacy` and `/terms`, which do not exist yet.
- **Final domain.** Set `NEXT_PUBLIC_SITE_URL` once it is chosen.
- **Check against the app:** the "Flaky suite rescue" one-line description, and the outcome wording. The page uses Caught / Missed, as in the report; the brief said Kept.
