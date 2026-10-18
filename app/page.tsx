import { ArrowRight, Check, FileIcon, Logo } from "@/components/Icons";
import { Nav } from "@/components/Nav";
import { AssessmentExample } from "@/components/AssessmentExample";
import { RoleExplorer } from "@/components/RoleExplorer";
import { Reveals } from "@/components/Reveals";
import { faqs } from "@/lib/content";
import { CONTACT_EMAIL, CONTACT_URL, DEMO_URL, LOGIN_URL, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const dimensions = [
  { name: "Problem framing", description: "Understands the task, identifies constraints, and structures an approach.", evidence: "The questions they ask before they begin." },
  { name: "AI collaboration", description: "Supplies context and directs AI toward useful work.", evidence: "The instructions and decisions that shape the answer." },
  { name: "Verification", description: "Checks important claims and validates information.", evidence: "The sources they return to and the claims they check." },
  { name: "Domain judgment", description: "Applies professional knowledge and makes considered trade-offs.", evidence: "The choices they make when the answer is not obvious." },
  { name: "Outcome", description: "Delivers work that is correct, relevant, and useful for the task.", evidence: "The actual submission, assessed against the brief." },
];

const workflow = [
  { title: "Choose and invite", text: "Select an available role and task, then send the candidate an invitation.", preview: "Product manager", detail: "Prioritise next quarter", kind: "invite" },
  { title: "Complete the task", text: "The candidate works with relevant materials and an AI assistant in the assessment workspace.", preview: "Task materials + AI assistant", detail: "A workspace built around the work", kind: "work" },
  { title: "Review the evidence", text: "Inspect the submitted work, draft evaluation, and selected moments from the session.", preview: "Recommendation → Evidence", detail: "Follow the reasoning back to its source", kind: "review" },
  { title: "Make your assessment", text: "Review the draft, adjust it where needed, and decide your next interview step.", preview: "Your assessment", detail: "Every rating remains yours to change", kind: "decide" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": `${SITE_URL}/#org`, name: SITE_NAME, url: `${SITE_URL}/`, logo: `${SITE_URL}/icon.svg`, email: CONTACT_EMAIL },
    { "@type": "WebSite", url: `${SITE_URL}/`, name: SITE_NAME, description: SITE_DESCRIPTION, publisher: { "@id": `${SITE_URL}/#org` } },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Nav />
      <main id="main">
        <section className="hero wrap" aria-labelledby="hero-title">
          <div className="hero__copy">
            <h1 id="hero-title"><span>See how candidates</span><span>work with AI.</span></h1>
            <div className="hero__intro">
              <p>Hands-on assessments.<br />Evidence you can review.</p>
              <p>Assess how candidates frame problems, direct AI, check information, apply domain judgment, and deliver useful results.</p>
            </div>
          </div>
          <div className="hero__actions"><a className="btn" href={DEMO_URL}>Request a demo <ArrowRight /></a><a className="text-link" href="#sample-evaluation">View a sample evaluation</a></div>
          <p className="hero__roles">Hands-on assessments for product managers, business analysts, sales professionals, and QA/SDET candidates.</p>
        </section>

        <section className="example-section wrap" id="sample-evaluation" aria-label="Illustrative assessment with fictional data">
          <AssessmentExample />
          <div className="example-caption"><p>Illustrative assessment with fictional data</p><p>Explore the task, the approach, the result, and the evaluation.</p></div>
        </section>

        <section className="section problem wrap" aria-labelledby="problem-title">
          <h2 id="problem-title" data-reveal>The result is only<br />part of the story.</h2>
          <div className="problem__body" data-reveal><p>A finished assignment shows what a candidate delivered. When AI is part of the work, you also need to understand the decisions behind it.</p><p>How did they interpret the brief? What did they check? Which trade-offs did they make? Proofwork brings that work into view.</p></div>
        </section>

        <section className="dimensions-section" id="dimensions" aria-labelledby="dimensions-title">
          <div className="wrap dimensions-layout">
            <div className="dimensions-intro"><h2 id="dimensions-title" data-reveal>Five dimensions.<br />A fuller picture.</h2><p data-reveal>Evaluate the decisions behind the result, with supporting evidence from the session and submitted work.</p><a href="#sample-evaluation" className="text-link" data-reveal>Explore the example evaluation</a></div>
            <div className="dimensions-list">{dimensions.map((d) => <article className="dimension" key={d.name} data-reveal><h3>{d.name}</h3><p>{d.description}</p><span>{d.evidence}</span></article>)}</div>
          </div>
          <div className="wrap reviewer-note" data-reveal><Check /><p>A draft to support your judgment. Review the reasoning, inspect the evidence, and change any rating before making your own assessment.</p></div>
        </section>

        <section className="section wrap evidence-section" aria-labelledby="evidence-title">
          <div className="section-heading"><h2 id="evidence-title" data-reveal>Follow the evidence.</h2><p data-reveal>Move from an evaluation to the work behind it. Keep observed actions separate from interpretations.</p></div>
          <div className="evidence-showcase">
            <div className="replay-fragment" data-ui data-reveal>
              <div className="fragment-bar"><span>Selected session moments</span><span>Product manager</span></div>
              <div className="replay-moment"><span>03:12</span><div><strong>Frames the constraints</strong><p>Identifies capacity and a dependency before ranking the options.</p></div></div>
              <div className="replay-moment replay-moment--selected"><span>14:06</span><div><strong>Returns to the source</strong><p>Checks the usage table before relying on an impact claim.</p></div><Check /></div>
              <div className="replay-moment"><span>41:05</span><div><strong>Submits the recommendation</strong><p>A delivery sequence with the trade-offs made explicit.</p></div></div>
              <div className="replay-track"><span /><i /><i /><i /></div><div className="replay-times"><span>00:00</span><span>41:05</span></div>
            </div>
            <div className="evidence-explanation"><h3 data-reveal>A session, with context.</h3><p data-reveal>Replay the work and jump to selected moments, including AI exchanges, edits, and submission. The evaluation gives you a place to start; the session lets you inspect it.</p><div className="explain-note" data-reveal><h3>Continue the conversation.</h3><p>Optional explain-back questions help explore the candidate’s understanding and prepare a more specific follow-up interview.</p></div><p className="illustration-note">Illustrative assessment with fictional data</p></div>
          </div>
        </section>

        <section className="how-section" id="how" aria-labelledby="how-title"><div className="wrap"><div className="section-heading"><h2 id="how-title" data-reveal>From invitation to insight.</h2><p data-reveal>A task for the candidate. A reviewable body of work for you.</p></div><ol className="workflow">{workflow.map((step) => <li key={step.title} data-reveal><div className={`workflow-preview workflow-preview--${step.kind}`} data-ui><span>{step.kind === "decide" ? <Check /> : <FileIcon />}{step.preview}</span><p>{step.detail}</p>{step.kind === "review" && <div className="preview-evidence"><span /><span /><span /><span /><span /></div>}</div><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol></div></section>

        <section className="section wrap roles-section" id="tasks" aria-labelledby="tasks-title"><div className="section-heading"><h2 id="tasks-title" data-reveal>Built around the role.</h2><p data-reveal>Work that calls for professional judgment. Explore the four roles currently covered by Proofwork.</p></div><RoleExplorer /><div className="development-note" data-reveal><span>In development</span><div><h3>Assessments for your requirements.</h3><p>We’re building tools to help hiring teams create AI-assisted assessments around their own requirements, with automated checks during task preparation.</p></div></div></section>

        <section className="candidate-section" id="candidates" aria-labelledby="candidate-title"><div className="wrap candidate-layout"><div><h2 id="candidate-title" data-reveal>Know what to expect.</h2><p data-reveal>Taking a Proofwork task? You should understand the workspace, the recording, and the evaluation before you agree to begin.</p></div><div className="candidate-info"><article data-reveal><h3>AI is part of the task.</h3><p>Use the assistant in the workspace. How you direct, check, and apply its work matters; the number of prompts does not earn points.</p></article><article data-reveal><h3>Know what is recorded.</h3><p>Typing, pastes, test runs, AI exchanges, and time away from the assessment window are recorded. You agree to recording before starting, and the time allowance is shown up front.</p></article><article data-reveal><h3>Check what you rely on.</h3><p>The assistant can include deliberate mistakes. Check important claims against the materials, data, or tests. Verification is one of five evaluation dimensions.</p></article><article data-reveal><h3>A person makes the assessment.</h3><p>The evaluation is a draft. The reviewer can inspect the evidence, change ratings, and ask follow-up questions about your work.</p></article></div></div></section>

        <section className="section wrap faq-section" id="faq" aria-labelledby="faq-title"><div className="faq-intro"><h2 id="faq-title" data-reveal>A few more details.</h2><p>Something else on your mind?<br /><a className="text-link" href={CONTACT_URL}>Ask the founder</a></p></div><div className="faq-list">{faqs.map((faq) => <details key={faq.q} data-reveal><summary><h3>{faq.q}</h3><span aria-hidden="true">+</span></summary><p>{faq.a}</p></details>)}</div></section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title"><div className="wrap"><div className="contact-heading"><h2 id="contact-title" data-reveal>See the work<br />behind the answer.</h2><div data-reveal><p>Hiring for a role that works with AI?<br />Let’s walk through an assessment together.</p><a className="btn" href={DEMO_URL}>Request a demo <ArrowRight /></a></div></div></div></section>
      </main>
      <footer className="foot wrap"><div className="foot__top"><a className="brand" href="/" aria-label="Proofwork home"><Logo /><span>Proofwork</span></a><nav aria-label="Footer"><a href="#sample-evaluation">The assessment</a><a href="#tasks">Roles</a><a href="#candidates">For candidates</a><a href={LOGIN_URL}>Sign in</a><a href={CONTACT_URL}>Contact</a></nav></div><div className="foot__bottom"><p>Better questions start with the work.</p><span>© 2026 Proofwork</span></div></footer>
      <Reveals />
    </>
  );
}
