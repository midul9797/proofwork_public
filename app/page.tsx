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
import { LOGIN_URL, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const problems = [
  {
    claim: "AI does the take-home.",
    detail:
      "Every candidate has a capable assistant. A finished assignment, whether a spec, a forecast or a fix, no longer shows who did the thinking.",
  },
  {
    claim: "Polished work can’t tell skill from copy-paste.",
    detail: "A clean answer looks the same whether the candidate reasoned it through or pasted it in.",
  },
  {
    claim: "Interviews take weeks.",
    detail: "Without a signal you trust, you add rounds. Each one costs your team time and costs you candidates.",
  },
];

const how = [
  { name: "Invite", text: "Choose the role, pick a task and send the candidate a link." },
  {
    name: "They work",
    text: "A real workspace for the job: documents and data, or an editor and tests, plus an AI assistant they are allowed to use.",
  },
  { name: "Replay", text: "Everything they typed, pasted, ran and asked, second by second." },
  { name: "Decide", text: "A draft evaluation with checked evidence. You override any score." },
];

const features = [
  {
    id: "traps",
    title: "Planted mistakes, checked after submission",
    body: "Some AI answers carry a deliberate error: a feature that isn’t live yet, a wrong date, an off-by-one. After the candidate submits, Proofwork checks whether each one was caught or missed. A candidate who reads what the AI gives them looks different from one who pastes it.",
    Vignette: TrapsVignette,
  },
  {
    id: "replay",
    title: "What the AI said, next to what they saw",
    body: "Replay the whole session second by second: typing, pastes, test runs and every AI exchange. Where an answer was planted, see the AI’s real answer beside the version the candidate was shown.",
    Vignette: ReplayVignette,
  },
  {
    id: "moments",
    title: "Key moments, so you know where to look",
    body: "First message to the assistant, inserts and large pastes from the AI, planted errors, test runs, regressions, quiet stretches, time away from the window and submission. Worked out by plain rules: facts, not judgments.",
    Vignette: KeyMomentsVignette,
  },
  {
    id: "evaluation",
    title: "A draft evaluation you can check",
    body: "On request, an AI judge drafts scores for five competencies, from problem framing to verification, each with evidence. Every quote is checked against the real session, and evidence that doesn’t check out is dropped. It stays a draft until you mark your own evaluation final.",
    Vignette: EvaluationVignette,
  },
  {
    id: "baseline",
    title: "The AI-only baseline",
    body: "See what the AI scores on the same task working alone. You can tell at a glance whether the candidate added anything beyond the assistant.",
    Vignette: BaselineVignette,
  },
  {
    id: "explain",
    title: "Explain-back",
    body: "After submitting, the candidate can answer short questions about their own work. You also get suggested questions to take into the interview.",
    Vignette: ExplainBackVignette,
  },
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
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD", description: "Free in early access" },
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
              See how candidates work with AI, not just what&nbsp;they&nbsp;ship.
            </h1>
            <p className="hero__sub">Hands-on interview tasks for every role that works with AI, not only engineers.</p>
            <p className="hero__lede">
              AI is allowed. Proofwork plants mistakes in some of its answers, records the whole session, and shows you
              whether the candidate caught them.
            </p>
            <StartFree />
            <a className="hero__roles" href="#tasks">
              Browse roles and tasks <ArrowRight />
            </a>
          </div>
          <div className="wrap wrap--wide">
            <ReplayPanel />
          </div>
        </section>

        {/* Signature: walkthrough */}
        <section className="section section--walk" aria-labelledby="walk-title">
          <div className="wrap">
            <header className="head" data-reveal>
              <h2 id="walk-title">One planted mistake. Two kinds of candidate.</h2>
              <p>
                Scroll through an example session for any role. The AI&rsquo;s answer looks right. Whether the
                candidate notices is the signal a take-home can&rsquo;t give you.
              </p>
            </header>
            <Walkthrough />
          </div>
        </section>

        {/* Problem */}
        <section className="section" aria-labelledby="problem-title">
          <div className="wrap">
            <header className="head" data-reveal>
              <h2 id="problem-title">The take-home stopped working.</h2>
              <p>Not just for engineers. Any job now done with AI has the same problem.</p>
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

        {/* How it works */}
        <section className="section section--how" id="how" aria-labelledby="how-title">
          <div className="wrap">
            <header className="head" data-reveal>
              <h2 id="how-title">How it works</h2>
              <p>From invite to decision, on your own schedule.</p>
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

        {/* Features */}
        <section className="section section--features" aria-label="Features">
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

        {/* Tasks by profession */}
        <section className="section" id="tasks" aria-labelledby="tasks-title">
          <div className="wrap">
            <header className="head" data-reveal>
              <h2 id="tasks-title">Interview tasks for every role</h2>
              <p>
                Pick the role you&rsquo;re hiring for, then a timed task. New roles are added as they&rsquo;re ready,
                for any job where people now do the work with AI.
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
                    <Clock /> {r.tasks.length} timed tasks · AI assistant included
                  </p>
                </article>
              ))}
              <article className="role role--next" data-reveal>
                <h3 className="role__name">Next professions</h3>
                <p className="role__text">
                  Proofwork is built for any role that uses AI to do the job. New professions and tasks are added
                  as they are ready.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Fair to candidates */}
        <section className="section section--fair" aria-labelledby="fair-title">
          <div className="wrap fair">
            <div className="fair__text" data-reveal>
              <h2 id="fair-title">Fair to candidates</h2>
              <p>
                A good signal starts with a fair test. The workspace is built to stay calm and legible under time
                pressure, and nothing about it is hidden from the person taking it.
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
              <h2 id="cand-title">Taking a Proofwork task?</h2>
              <p>
                If a company sent you a Proofwork link, here is everything that will happen. No surprises, nothing
                hidden from you.
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
              <h2 id="faq-title">Questions</h2>
              <p>
                Something else? <a href={LOGIN_URL}>Start free</a> and look around. It takes a work email.
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
        <section className="final" aria-labelledby="final-title">
          <div className="wrap">
            <h2 id="final-title" className="final__title" data-reveal>
              See how candidates work with AI, not just what&nbsp;they&nbsp;ship.
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
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </nav>
          <p className="foot__fine">© 2026 Proofwork. Example sessions on this page use invented data.</p>
        </div>
      </footer>
      <Reveals />
    </>
  );
}
