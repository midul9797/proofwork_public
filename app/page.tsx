import { ArrowRight, Chat, Check, Clock, Eye, Flag, Logo } from "@/components/Icons";
import { Nav } from "@/components/Nav";
import { ReplayPanel } from "@/components/ReplayPanel";
import { Reveals } from "@/components/Reveals";
import { StartFree } from "@/components/StartFree";
import {
  BaselineVignette,
  EvaluationVignette,
  ExplainBackVignette,
  KeyMomentsVignette,
  ReplayVignette,
  TrapsVignette,
} from "@/components/Vignettes";
import { Walkthrough } from "@/components/Walkthrough";
import { faqs, roles } from "@/lib/content";
import { CONTACT_URL, LOGIN_URL, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const problems = [
  { claim: "Interpret the brief.", detail: "How did they understand the requirements and structure an approach?" },
  { claim: "Check important claims.", detail: "What did they verify before relying on the AI’s answer?" },
  { claim: "Make the trade-offs.", detail: "Which constraints and professional decisions shaped the result?" },
];

const how = [
  { name: "Choose and invite", text: "Select an available role and task, then send the candidate an invitation." },
  { name: "Complete the task", text: "The candidate works with relevant materials and an AI assistant in the assessment workspace." },
  { name: "Review the evidence", text: "Inspect the submitted work, draft evaluation, and selected moments from the session." },
  { name: "Make your assessment", text: "Review the draft, adjust it where needed, and decide your next interview step." },
];

const features = [
  { id: "moments", title: "A session, with context.", body: "Replay the work and jump to selected moments, including AI exchanges, edits, and submission. The evaluation gives you a place to start; the session lets you inspect it.", Vignette: KeyMomentsVignette },
  { id: "replay", title: "Follow the evidence.", body: "Move from an evaluation to the work behind it. Keep observed actions separate from interpretations, and inspect the session in context.", Vignette: ReplayVignette },
  { id: "traps", title: "Check what matters.", body: "Verification is one of five evaluation dimensions. Review how candidates check important claims against source materials, data, or tests; one missed mistake is not a verdict on overall competence.", Vignette: TrapsVignette },
  { id: "explain", title: "Continue the conversation.", body: "Optional explain-back questions help explore the candidate’s understanding and prepare a more specific follow-up interview.", Vignette: ExplainBackVignette },
  { id: "baseline", title: "An AI-only reference.", body: "An AI-only reference run offers another view of the task under stated conditions. Comparisons depend on the model, tools, time allowance, and evaluation setup.", Vignette: BaselineVignette },
];

const dimensions = [
  { name: "Problem framing", text: "Understands the task, identifies constraints, and structures an approach.", evidence: "The questions they ask before they begin." },
  { name: "AI collaboration", text: "Supplies context and directs AI toward useful work.", evidence: "The instructions and decisions that shape the answer." },
  { name: "Verification", text: "Checks important claims and validates information.", evidence: "The sources they return to and the claims they check." },
  { name: "Domain judgment", text: "Applies professional knowledge and makes considered trade-offs.", evidence: "The choices they make when the answer is not obvious." },
  { name: "Outcome", text: "Delivers work that is correct, relevant, and useful for the task.", evidence: "The actual submission, assessed against the brief." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/icon.svg`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      publisher: { "@id": `${SITE_URL}/#org` },
      inLanguage: "en",
    },
    {
      "@type": "SoftwareApplication",
      name: SITE_NAME,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web browser",
      description: SITE_DESCRIPTION,
      url: `${SITE_URL}/`,
      publisher: { "@id": `${SITE_URL}/#org` },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Nav />
      <main id="main">
        {/* Hero */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="wrap">
            <h1 id="hero-title" className="hero__title">
              See how candidates work with AI.
            </h1>
            <p className="hero__sub">Hands-on assessments for product managers, business analysts, sales professionals, and QA/SDET candidates.</p>
            <p className="hero__lede">
              Assess how candidates frame problems, direct AI, check information, apply domain judgment, and deliver useful results.
            </p>
            <StartFree />
            <a className="hero__roles" href="#sample-evaluation">
              View a sample evaluation <ArrowRight />
            </a>
          </div>
          <div className="wrap wrap--wide">
            <ReplayPanel />
          </div>
        </section>

        {/* Signature: walkthrough */}
        <section className="section section--walk" id="sample-evaluation" aria-labelledby="walk-title">
          <div className="wrap">
            <header className="head" data-reveal>
              <h2 id="walk-title">From a work task to evidence you can review.</h2>
              <p>
                Follow an example assessment from the task brief to the submitted work. Inspect the candidate’s decisions and the evidence behind each part of the evaluation.
              </p>
            </header>
            <article className="feature" data-reveal>
              <div className="feature__text">
                <h3>A draft to support your judgment.</h3>
                <p>Review the reasoning, inspect the evidence, and change any rating before making your own assessment.</p>
                <p>Illustrative assessment with fictional data.</p>
              </div>
              <EvaluationVignette />
            </article>
            <Walkthrough />
          </div>
        </section>

        {/* Problem */}
        <section className="section" aria-labelledby="problem-title">
          <div className="wrap">
            <header className="head" data-reveal>
              <h2 id="problem-title">The result is only part of the story.</h2>
              <p>A finished assignment shows what a candidate delivered. When AI is part of the work, you also need to understand the decisions behind it.</p>
            </header>
            <ul className="problems">
              {problems.map((p) => (
                <li key={p.claim} data-reveal>
                  <p className="problems__claim">{p.claim}</p>
                  <p className="problems__detail">{p.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Five evaluation dimensions, using the existing role-row layout. */}
        <section className="section" id="dimensions" aria-labelledby="dimensions-title">
          <div className="wrap">
            <header className="head" data-reveal>
              <h2 id="dimensions-title">Five dimensions. A fuller picture.</h2>
              <p>Evaluate the decisions behind the result, with supporting evidence from the session and submitted work.</p>
            </header>
            <div className="roles-grid">
              {dimensions.map((dimension) => (
                <article key={dimension.name} className="role" data-reveal>
                  <h3 className="role__name">{dimension.name}</h3>
                  <div><p className="role__task">{dimension.text}</p><p className="role__text">{dimension.evidence}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="section section--features" aria-label="Follow the evidence" id="evidence">
          <div className="wrap">
            {features.map(({ id, title, body, Vignette }, i) => (
              <article key={id} id={id} className={`feature${i % 2 ? " feature--flip" : ""}`} data-reveal>
                <div className="feature__text">
                  <h2>{title}</h2>
                  <p>{body}</p>
                </div>
                <Vignette />
              </article>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="section section--how" id="how" aria-labelledby="how-title">
          <div className="wrap">
            <header className="head" data-reveal>
              <h2 id="how-title">From invitation to insight.</h2>
              <p>A task for the candidate. A reviewable body of work for you.</p>
            </header>
            <ol className="how" data-reveal>
              {how.map(({ name, text }, i) => (
                <li key={name} className={`how__step how__step--${i}`}>
                  <span className="how__tick" aria-hidden="true" />
                  <h3>{name}</h3>
                  <p>{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Tasks by profession */}
        <section className="section" id="tasks" aria-labelledby="tasks-title">
          <div className="wrap">
            <header className="head" data-reveal>
              <h2 id="tasks-title">Built around the role.</h2>
              <p>
                Work that calls for professional judgment. Explore the four roles currently covered by Proofwork.
              </p>
            </header>
            <div className="roles-grid">
              {roles.map((r) => (
                <article key={r.role} className="role" data-reveal>
                  <h3 className="role__name">{r.role}</h3>
                  <ul className="role__tasks">
                    {r.tasks.map((t) => (
                      <li key={t.name}>
                        <p className="role__task">{t.name}</p>
                        {t.text && <p className="role__text">{t.text}</p>}
                      </li>
                    ))}
                  </ul>
                  <p className="role__meta">
                    <Clock /> {r.role === "Product manager" ? "45 minutes per task" : "Time allowance shown before starting"}
                  </p>
                </article>
              ))}
              <article className="role role--next" data-reveal>
                <h3 className="role__name">In development</h3>
                <p className="role__text">
                  Assessments for your requirements. We’re building tools to help hiring teams create AI-assisted assessments around their own requirements, with automated checks during task preparation.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Fair to candidates */}
        <section className="section section--fair" aria-labelledby="fair-title">
          <div className="wrap fair">
            <div className="fair__text" data-reveal>
              <h2 id="fair-title">Clear expectations before the task.</h2>
              <p>
                Taking a Proofwork task? You should understand the workspace, the recording, and the evaluation before you agree to begin.
              </p>
              <ul className="fair__list">
                <li>
                  <Clock />
                  <span>
                    <strong>A calm, timed workspace.</strong> The time limit is shown before they start and stays in
                    view.
                  </span>
                </li>
                <li>
                  <Chat />
                  <span>
                    <strong>AI openly allowed.</strong> Using it well is part of the skill. Sending more messages is
                    never rewarded.
                  </span>
                </li>
                <li>
                  <Eye />
                  <span>
                    <strong>Consent first.</strong> Candidates agree to recording before the task begins.
                  </span>
                </li>
              </ul>
            </div>
            <figure className="vig consent" data-reveal>
              <div className="vig__panel" aria-hidden="true">
                <div className="vig__bar">Before you start</div>
                <div className="vig__body">
                  <p className="consent__h">This session is recorded</p>
                  <p className="consent__p">
                    Your typing, pastes, test runs, AI chat and time away from this window are recorded so the
                    reviewer can replay how you worked. The AI assistant is allowed.
                  </p>
                  <div className="consent__row">
                    <span className="consent__time">
                      <Clock /> 45 min, shown before you start
                    </span>
                    <span className="eval__btn eval__btn--primary">I agree, start the task</span>
                  </div>
                </div>
              </div>
              <figcaption className="vig__cap">Example screen</figcaption>
            </figure>
          </div>
        </section>

        {/* For candidates */}
        <section className="section section--cand" id="candidates" aria-labelledby="cand-title">
          <div className="wrap cand">
            <header className="cand__head" data-reveal>
              <h2 id="cand-title">Know what to expect.</h2>
              <p>
                AI is part of the task. How you direct, check, and apply its work matters. The evaluation remains a draft for a person to review.
              </p>
            </header>
            <ol className="cand__rules" data-reveal>
              <li>
                <h3>Use the AI the way you would at work.</h3>
                <p>The assistant in the workspace is allowed. Using it well is part of what the task looks at.</p>
              </li>
              <li>
                <h3>It is sometimes wrong on purpose.</h3>
                <p>
                  Some answers contain a deliberate mistake. Check what it gives you against the materials, the data
                  or the tests before you rely on it, just as you would with any colleague&rsquo;s work.
                </p>
              </li>
              <li>
                <h3>Your session is recorded, with your consent.</h3>
                <p>
                  Typing, pastes, test runs, the AI chat and time away from the window. You agree to this before the
                  task starts, and the time limit is shown up front.
                </p>
              </li>
              <li>
                <h3>More AI messages won&rsquo;t raise your score.</h3>
                <p>How often you ask is context only. What counts is how you check, decide and explain your work.</p>
              </li>
            </ol>
          </div>
        </section>

        {/* FAQ */}
        <section className="section" id="faq" aria-labelledby="faq-title">
          <div className="wrap faq-wrap">
            <header className="head head--side" data-reveal>
              <h2 id="faq-title">A few more details.</h2>
              <p>
                Something else on your mind? <a href={CONTACT_URL}>Ask the founder</a>.
              </p>
            </header>
            <div className="faq">
              {faqs.map((f) => (
                <details key={f.q}>
                  <summary>
                    <h3>{f.q}</h3>
                    <span className="faq__icon" aria-hidden="true" />
                  </summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="final" id="contact" aria-labelledby="final-title">
          <div className="wrap">
            <h2 id="final-title" className="final__title" data-reveal>
              See the work behind the answer.
            </h2>
            <div className="final__mini" aria-hidden="true">
              <span className="chip chip--flag">
                <Flag /> Planted error
              </span>
              <span className="final__arrow" />
              <span className="chip chip--caught">
                <Check /> Caught
              </span>
            </div>
            <StartFree />
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap foot__in">
          <a className="brand" href="/" aria-label="Proofwork home">
            <Logo />
            <span>Proofwork</span>
          </a>
          <nav aria-label="Footer" className="foot__nav">
            <a href="#how">How it works</a>
            <a href="#tasks">Tasks</a>
            <a href="#faq">FAQ</a>
            <a href="#candidates">For candidates</a>
            <a href={LOGIN_URL}>Sign in</a>
            <a href={CONTACT_URL}>Contact</a>
          </nav>
          <p className="foot__fine">© 2026 Proofwork. Example sessions on this page use invented data.</p>
        </div>
      </footer>
      <Reveals />
    </>
  );
}
