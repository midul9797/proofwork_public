---
name: Proofwork
description: Landing system for Proofwork. Graphite SaaS polish at Linear craft, with the product's own replay UI as the imagery.
colors:
  graphite: "#111418"
  graphite-deep: "#0d1013"
  panel: "#1a1e24"
  panel-raised: "#232830"
  hairline: "#343b42"
  hairline-soft: "rgb(52 59 66 / 0.55)"
  ink: "#f3f5f2"
  ink-secondary: "#c3c9c4"
  ink-muted: "#8e968f"
  pencil-blue: "#3d68e8"
  pencil-blue-strong: "#2d5be3"
  pencil-blue-soft: "#6d8ef0"
  pencil-blue-text: "#9db4f3"
  caught-teal: "#19a28b"
  caught-teal-ink: "#062620"
  flag-amber: "#e0a04a"
  flag-amber-ink: "#2a1a05"
typography:
  display:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 1.45rem + 4.3vw, 4.75rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.042em"
  headline:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.35rem + 2.3vw, 3.25rem)"
    fontWeight: 600
    lineHeight: 1.06
    letterSpacing: "-0.035em"
  headline-sm:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 1.3rem + 1.5vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.06
    letterSpacing: "-0.032em"
  title:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.012em"
  lede:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 0.98rem + 0.35vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.005em"
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "11.5px"
    fontWeight: 400
    lineHeight: 1.7
  document:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: "6px"
  control: "8px"
  md: "10px"
  lg: "14px"
  pill: "999px"
spacing:
  gutter: "clamp(16px, 4vw, 40px)"
  section-y: "clamp(96px, 11vw, 160px)"
  max: "1160px"
  max-wide: "1320px"
  nav-h: "60px"
components:
  button-primary:
    backgroundColor: "{colors.pencil-blue-strong}"
    textColor: "#ffffff"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "#3a66ea"
  button-primary-lg:
    backgroundColor: "{colors.pencil-blue-strong}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "0 22px"
    height: "52px"
  button-primary-sm:
    backgroundColor: "{colors.pencil-blue-strong}"
    textColor: "#ffffff"
    rounded: "7px"
    padding: "0 14px"
    height: "34px"
  chip-flag:
    backgroundColor: "rgb(224 160 74 / 0.1)"
    textColor: "{colors.flag-amber}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 9px"
    height: "24px"
  chip-caught:
    backgroundColor: "{colors.caught-teal}"
    textColor: "{colors.caught-teal-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 9px"
    height: "24px"
  chip-missed:
    backgroundColor: "{colors.flag-amber}"
    textColor: "{colors.flag-amber-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 9px"
    height: "24px"
  chip-draft:
    backgroundColor: "rgb(61 104 232 / 0.14)"
    textColor: "{colors.pencil-blue-text}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 9px"
    height: "24px"
  product-panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.lg}"
  product-panel-bar:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.ink-muted}"
    padding: "11px 16px"
  segmented-control:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.control}"
    padding: "3px"
  segmented-control-active:
    backgroundColor: "{colors.panel-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
  profession-toggle:
    backgroundColor: "transparent"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "38px"
  profession-toggle-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.graphite}"
  nav-link:
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.sm}"
    padding: "6px 10px"
---

# Design System: Proofwork

## Overview

**Creative North Star: "The Replay Desk"**

The landing page is category-standard SaaS polish executed at Linear craft, set on the same graphite as Proofwork's dark replay app. Nothing on the page is decoration borrowed from elsewhere: the imagery is the product's own interface (replay panel, walkthrough stage, feature vignettes) authored in HTML, and the one dramatic story it tells is a single planted mistake resolving to Caught or Missed. Type is a tight, confident grotesk; surfaces are flat graphite tiers separated by 1px hairlines; colour is spent almost entirely on meaning.

Density is generous at page level (long section rhythm, a single left-aligned column of argument) and dense inside the product panels, where small 12–14px UI text, file trees, timelines and chat bubbles read like the real app. That contrast is deliberate: calm marketing frame, believable working tool inside it.

Confirmed rejections: no themed metaphor worlds (owner, PRODUCT.md), no invented proof (customers, logos, metrics), no headline-plus-three-feature-cards-plus-logo-strip layout.

**Key Characteristics:**
- Graphite ground with two raised tiers and 1px slate hairlines; depth by tone, not glow.
- One pencil-blue accent for action and "the AI's real answer"; teal and amber are semantic, never decorative.
- Schibsted Grotesk set tight (-0.03em to -0.042em) for display; JetBrains Mono only for code and timecodes; Newsreader only for task documents inside panels.
- Authored product panels are the imagery system, always captioned as example data.
- Signature motion: a sticky, scroll-driven walkthrough where the whole session is ghosted in and resolves step by step from an amber flag to the outcome.

## Colors

A graphite, near-monochrome dark palette where three hues each carry exactly one meaning.

### Primary
- **Pencil Blue** ({colors.pencil-blue}): track fills, the "how it works" progress rail, the replay timeline played portion. The brand accent in passive marks.
- **Pencil Blue Strong** ({colors.pencil-blue-strong}): the filled primary button and in-panel primary actions. White text on it.
- **Pencil Blue Soft** ({colors.pencil-blue-soft}): focus outline, AI-message ticks, score meters, the highlight on the AI's real line in the replay vignette.
- **Pencil Blue Text** ({colors.pencil-blue-text}): accent used as text on graphite (draft chips, "replay matches" badge, evidence footers, inline links, link underline at 50% alpha).

### Secondary
- **Caught Teal** ({colors.caught-teal}, ink {colors.caught-teal-ink}): the "Caught" chip, the Caught verdict badge and the resolved flag line on the walkthrough's last step. Nothing else.

### Tertiary
- **Flag Amber** ({colors.flag-amber}, ink {colors.flag-amber-ink}): planted-error flags (outline chip, 2px left rule plus 13% wash on the flagged line, timeline tick) and the filled "Missed" outcome.

### Neutral
- **Graphite** ({colors.graphite}): page ground, panel title bars, file trees, timelines.
- **Graphite Deep** ({colors.graphite-deep}): code and prose wells inside chat messages.
- **Panel** ({colors.panel}): product panel bodies, vignette bodies, AI message bubbles, document pane.
- **Panel Raised** ({colors.panel-raised}): user bubbles, active segment, timeline track, meter track.
- **Hairline** ({colors.hairline}): every panel border and divider; at 55% alpha ({colors.hairline-soft}) for section seams and list rules.
- **Ink / Ink Secondary / Ink Muted** ({colors.ink} / {colors.ink-secondary} / {colors.ink-muted}): headings, body and lede, captions and metadata. Warm-neutral, not blue-grey.

### Named Rules
**The Teal Means Caught Rule.** Teal appears only where a planted error was caught. Test passes, "live" states and success ticks use ink or pencil blue, never teal.

**The Amber Means Look Here Rule.** Amber marks a planted error or a Missed outcome. It is never used for warnings, emphasis or decoration.

**The One Accent Rule.** Pencil blue is the only brand hue. A screen should read as graphite with small, deliberate blue marks; never tint whole sections blue.

## Typography

**Display Font:** Schibsted Grotesk (with ui-sans-serif, system-ui)
**Body Font:** Schibsted Grotesk
**Label/Mono Font:** JetBrains Mono (with ui-monospace), ligatures off
**Document Font:** Newsreader (with Georgia), task documents in panels only

**Character:** One grotesk does everything a visitor reads, set tight and confident at size and plain at body; mono and serif appear only as the product's own materials (code, timecodes, documents).

### Hierarchy
- **Display** (600, clamp 2.5–4.75rem, 1.02, -0.042em): hero headline and the closing restatement (closing uses clamp 2.25–4rem, -0.04em). Balanced wrap, max ~14.5em.
- **Headline** (600, clamp 2–3.25rem, 1.06, -0.035em): section heads. Feature heads step down to headline-sm (clamp 1.75–2.5rem, -0.032em); problem claims and walkthrough step titles sit between (≈1.4–2rem, -0.028 to -0.03em).
- **Title** (600, 1.125rem, 1.3, -0.012em): list and card titles, FAQ questions (500 there).
- **Lede** (400, clamp 1.0625–1.25rem, 1.55): one supporting line under display, max 38em, ink secondary.
- **Body** (400, 1.0625rem, 1.6): paragraphs, max 30–36em, ink secondary.
- **Label** (600, 0.75rem, +0.005em, sentence case): chips. Captions are 0.8125rem ink muted.
- **Mono** (400, 11.5–12.5px, 1.7): code inside chat and diffs, timeline timecodes with tabular numerals.

### Named Rules
**The Tight Display Rule.** Display and headline sizes always carry negative tracking (-0.028em or tighter) at weight 600; body text is never tracked.

**The Materials Rule.** JetBrains Mono and Newsreader are product materials, not voice. They never set marketing headings, body copy or labels.

## Layout

Single centred column at `max` (1160px) with a fluid gutter; the hero replay panel and nav break out to `max-wide` (1320px). Sections are separated by a soft hairline top border and `section-y` vertical padding (clamp 96–160px); the closing CTA uses a larger clamp (112–200px) and is the only centred block. Headings and argument are left-aligned.

Recurring arrangements: hero (headline, lede, Start free with magic-link note, plain-text profession line, then a full-width tilted replay panel); two-column text/vignette feature rows that alternate sides and collapse to one column under 900px; a sticky side head with an accordion for FAQ; row-per-item lists ruled by hairlines rather than card grids (problems, tasks by profession). The walkthrough is a 0.8fr/1fr grid with a sticky stage; under 900px the stage pins above the steps at min(400px, 46vh).

Breakpoints observed: 1100, 900, 820, 760 (nav links hide), 720, 520, 480px.

## Elevation & Depth

Depth is tonal: graphite, panel and raised tiers plus 1px hairlines do the work. Shadows exist only to lift product panels off the page and to give the primary button weight; there are no ambient glows or coloured auras on sections.

### Shadow Vocabulary
- **Hero panel lift** (`box-shadow: 0 0 0 1px rgb(0 0 0 / 0.35), 0 40px 80px -30px rgb(0 0 0 / 0.8), 0 18px 40px -20px rgb(0 0 0 / 0.6), inset 0 1px 0 rgb(255 255 255 / 0.04)`): the hero replay panel only, which is also tilted back (rotateX 14deg) and fades out at the bottom via a mask.
- **Stage lift** (`box-shadow: 0 30px 60px -30px rgb(0 0 0 / 0.75), inset 0 1px 0 rgb(255 255 255 / 0.04)`): walkthrough stage.
- **Vignette lift** (`box-shadow: 0 24px 48px -28px rgb(0 0 0 / 0.75), inset 0 1px 0 rgb(255 255 255 / 0.04)`): feature vignettes.
- **Button weight** (`box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.18), 0 1px 2px rgb(0 0 0 / 0.4), 0 6px 20px -6px rgb(45 91 227 / 0.55)`): primary button; grows on hover.
- **Active segment** (`box-shadow: 0 1px 2px rgb(0 0 0 / 0.5)`): selected segment in segmented controls.

### Named Rules
**The Panels Float, Page Stays Flat Rule.** Only product panels and the primary button cast shadows. Section backgrounds, list rows and text blocks are flat.

## Shapes

Gently rounded and consistent: 6px for small controls and nav links, 8px for buttons and segmented controls, 10px for message bubbles, 14px for every product panel. Pills (999px) are reserved for chips and the profession toggle. Chat bubbles square one corner (4px) toward their speaker. Flags and highlights are drawn as 2px inset left rules, never as outlines around text. Borders are always 1px hairline; the only dashed or gradient strokes are functional (the amber-to-teal arrow in the closing flag→outcome mini).

## Components

### Buttons
- **Shape:** gently rounded (8px; 7px small, 10px large).
- **Primary:** pencil blue strong with white 600 text, 44px tall (34px nav, 52px hero/closing), trailing arrow icon.
- **Hover / Focus:** lightens to #3a66ea with a larger blue under-shadow, arrow nudges 3px right; active presses down 1px. Focus is a 2px pencil-blue-soft outline at 3px offset site-wide.
- **Secondary:** none on the page; nav "Sign in" is a text link (ink secondary, 5% white wash on hover).

### Chips
- **Style:** 24px pill, 0.75rem/600, 12px stroked icon leading. Flag = amber text on 10% amber with inset amber hairline. Caught = filled teal with dark teal ink. Missed = filled amber with dark amber ink. Draft = pencil-blue text on 14% blue with inset blue hairline.
- **State:** on Caught resolution the flag chip desaturates to an ink-secondary outline so the outcome carries the colour.

### Cards / Containers (product panels)
- **Corner Style:** 14px.
- **Background:** panel body, graphite title bar with a muted 12.5–13px label or breadcrumb.
- **Shadow Strategy:** see Elevation; one lift per panel.
- **Border:** 1px hairline.
- **Internal Padding:** 18px body, 11px 16px bar.
- **Caption:** every panel carries a muted figcaption naming it as example data or an example screen.

### Navigation
- Sticky 60px bar, graphite at 95% with saturate+blur backdrop and a soft hairline bottom. Brand mark and 700-weight wordmark left, 0.875rem ink-secondary links, Sign in text link and small primary button right. Links hide under 760px.

### Profession switcher and segmented control
- Profession toggles are 38px hairline pills; the pressed one inverts to ink fill with graphite text. The Caught/Missed segmented control is a graphite well with a raised active segment.

### Walkthrough stage (signature)
A sticky product panel beside numbered steps. The whole session is present from the start; unreached items are ghosted (22% opacity, 1.5px blur, 40% saturation) and come into focus as steps activate. The AI line carrying the planted error gains an amber left rule and wash from step two; on the last step the flag gives way to the outcome (teal rule for Caught, amber for Missed) and the verdict badge resolves with a short scale-and-unblur. Inactive step text is muted and turns ink when active.

### Motion
Easing is `cubic-bezier(0.16, 1, 0.3, 1)` throughout. Reveal (fade + 14px rise, 700–900ms) and the hero tilt-in and timeline fill run only when JS has set `data-motion` and the visitor has not asked for reduced motion; otherwise everything renders in its final state.

## Do's and Don'ts

### Do:
- **Do** build imagery from authored product UI (replay panel, stage, vignettes) and caption each one as example data.
- **Do** keep teal for Caught and amber for planted errors and Missed, exactly as the walkthrough and chips use them.
- **Do** set display and headline type at weight 600 with negative tracking (-0.028em to -0.042em).
- **Do** separate sections and list rows with 1px hairlines and tone shifts rather than cards or shadows.
- **Do** gate entrance motion on JS plus no reduced-motion preference so content is visible by default.

### Don't:
- **Don't** use teal for test passes, "live" states or generic success.
- **Don't** introduce a second brand hue or tint section backgrounds with pencil blue.
- **Don't** set marketing headings or body in JetBrains Mono or Newsreader.
- **Don't** add eyebrows or kickers above section heads; the headline opens each section.
- **Don't** show customer logos, testimonials, metrics or pricing tiers that do not exist.
- **Don't** fall back to the headline, three feature cards and logo strip layout.
