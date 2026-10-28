import { ArrowRight, Chat, Check, Logo } from "@/components/Icons";
import { Nav } from "@/components/Nav";
import { ReplayPanel } from "@/components/ReplayPanel";
import { Reveals } from "@/components/Reveals";
import { StartFree } from "@/components/StartFree";
import {
  BaselineVignette,
  EvaluationVignette,
  KeyMomentsVignette,
} from "@/components/Vignettes";
import { TaskGeneration } from "@/components/TaskGeneration";
import { Walkthrough } from "@/components/Walkthrough";
import { faqs } from "@/lib/content";
import { CONTACT_URL, DEMO_URL, LOGIN_URL, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const how = [
  { name: "Create and invite", text: "Generate a task for your role, review the materials and scoring, then invite a candidate." },
  { name: "Complete the task", text: "The candidate works with relevant materials and an AI assistant in the assessment workspace." },
  { name: "Review the evidence", text: "Inspect the submitted work, draft evaluation, and selected moments from the session." },
  { name: "Make your assessment", text: "Review the draft, adjust it where needed, and decide your next interview step." },
];

const features = [
  { id: "baseline", title: "An AI-only reference.", body: "See how AI performs on the same task without a candidate directing it. Use that reference alongside the candidate’s work and decisions, with the model and task conditions in mind.", Vignette: BaselineVignette },
  { id: "moments", title: "A session, with context.", body: "Jump from the evaluation to the candidate’s AI exchanges, edits, and submitted work. Use the session to prepare a more specific follow-up conversation.", Vignette: KeyMomentsVignette },
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
            <p className="hero__sub">Hands-on candidate assessments, built around the role you’re hiring for.</p>
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

        {/* Sample evaluation */}
        <section className="section section--walk" id="sample-evaluation" aria-labelledby="walk-title">
          <div className="wrap">
            <header className="head" data-reveal>
              <h2 id="walk-title">Evidence you can review.</h2>
              <p>
                A draft evaluation connects the candidate’s work with the decisions behind it.
              </p>
            </header>
            <article className="feature" data-reveal>
              <div className="feature__text">
                <h3>A draft to support your judgment.</h3>
                <p>Review the reasoning, inspect the evidence, and change any rating before making your own assessment.</p>
                <p><a href={DEMO_URL}>Explore the full review in a demo.</a></p>
              </div>
              <EvaluationVignette />
            </article>
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

        {/* Planted-error walkthrough */}
        <section className="section section--walk" id="traps" aria-labelledby="traps-title">
          <div className="wrap">
            <header className="head" data-reveal>
              <h2 id="traps-title">Can they spot the mistake?</h2>
              <p>Follow an illustrative session as the candidate asks, checks, and submits. Switch roles or compare caught and missed outcomes as you scroll.</p>
            </header>
            <Walkthrough />
          </div>
        </section>

        {/* Features */}
        <section className="section section--features" aria-label="Follow the evidence" id="evidence">
          <div className="wrap">
            {features.map(({ id, title, body, Vignette }, i) => (
              <article key={id} id={id} className={`feature${i % 2 === 0 ? " feature--flip" : ""}`} data-reveal>
                <div className="feature__text">
                  <h2>{title}</h2>
                  <p>{body}</p>
                </div>
                <Vignette />
              </article>
            ))}
          </div>
        </section>

        <TaskGeneration />

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
                <Chat /> AI allowed
              </span>
              <span className="final__arrow" />
              <span className="chip chip--caught">
                <Check /> Human review
              </span>
            </div>
            <StartFree />
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap foot__in">
          <a className="brand" href="/" aria-label="Evaliro home">
            <Logo />
            <span>Evaliro</span>
          </a>
          <nav aria-label="Footer" className="foot__nav">
            <a href="#how">How it works</a>
            <a href="#tasks">Task generation</a>
            <a href="#faq">FAQ</a>
            <a href="#traps">Planted errors</a>
            <a href="#baseline">AI-only reference</a>
            <a href={LOGIN_URL}>Sign in</a>
            <a href={CONTACT_URL}>Contact</a>
          </nav>
          <p className="foot__fine">© 2026 Evaliro. Example sessions on this page use invented data.</p>
        </div>
      </footer>
      <Reveals />
    </>
  );
}
