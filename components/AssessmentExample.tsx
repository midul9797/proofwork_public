"use client";

import { useState } from "react";
import { ArrowRight, Check, Clock, FileIcon, Logo } from "./Icons";

const stages = ["The task", "The approach", "The result", "The evaluation"];

const dimensions = [
  { name: "Problem framing", finding: "Identifies the constraints", source: "Session · 03:12", quote: "Before ranking anything, separate customer impact from effort. We have six engineer-weeks, and the export depends on the permissions work.", interpretation: "The candidate identifies capacity and dependencies before asking for a recommendation.", limitation: "This shows how they framed this task; it does not establish how they approach every unfamiliar problem.", context: "The candidate’s opening direction to the AI assistant." },
  { name: "AI collaboration", finding: "Gives the assistant direction", source: "AI exchange · 08:24", quote: "Compare the options against the feedback and usage data. Show your assumptions, and keep the six-week capacity limit visible.", interpretation: "The candidate gives relevant context and criteria, then asks the assistant to make its assumptions explicit.", limitation: "Prompt volume is context, not a measure of collaboration quality.", context: "A selected instruction from the candidate to the assistant." },
  { name: "Verification", finding: "Checks a consequential claim", source: "Session · 14:06", quote: "The feedback mentions exports, but that is not the same as weekly usage. Check the usage table before treating exports as the highest-impact option.", interpretation: "The candidate distinguishes stated demand from observed usage and asks for a source check.", limitation: "One checked claim does not show that every important claim was verified.", context: "A session moment linked to the supplied usage data." },
  { name: "Domain judgment", finding: "Makes the trade-off explicit", source: "Submitted work · Recommendation", quote: "Prioritise permissions first. It unblocks exports and addresses the access issues in customer feedback. Defer the dashboard refresh until we can measure its impact.", interpretation: "The recommendation connects customer needs, delivery dependencies, and limited capacity.", limitation: "The recommendation depends on the task’s fictional estimates and available materials.", context: "An excerpt from the candidate’s submitted recommendation." },
  { name: "Outcome", finding: "Delivers a usable recommendation", source: "Submitted work · Next steps", quote: "Ship permissions in the first four weeks. Use the remaining two weeks to scope exports and validate adoption with the accounts that requested it.", interpretation: "The submission gives a concrete sequence within the capacity limit and proposes a way to test demand.", limitation: "Commercial impact is unknown. This assessment ends at the recommendation.", context: "The closing section of the candidate’s submitted work." },
];

export function AssessmentExample() {
  const [stage, setStage] = useState(3);
  const [selected, setSelected] = useState(0);
  const evidence = dimensions[selected];

  return (
    <div className="assessment" data-ui>
      <div className="assessment__bar">
        <span className="assessment__brand"><Logo size={18} /> Assessment review</span>
        <span className="assessment__fiction">Fictional example</span>
      </div>
      <div className="assessment__workspace">
        <aside className="assessment__sidebar">
          <span className="workspace-label">Product manager</span>
          <p className="assessment__task-name">Prioritise next quarter</p>
          <span className="assessment__time"><Clock /> 45-minute task</span>
          <nav aria-label="Example assessment stages" className="stage-nav">
            {stages.map((name, i) => (
              <button key={name} type="button" onClick={() => setStage(i)} aria-pressed={stage === i} aria-controls="example-stage" className={stage === i ? "is-selected" : ""}>
                <span className="stage-nav__mark" aria-hidden="true">{i === 3 ? <Check /> : <FileIcon />}</span>{name}<ArrowRight />
              </button>
            ))}
          </nav>
          <div className="assessment__sidebar-note"><span className="status-dot" />Submitted work<br /><span>Ready for your review</span></div>
        </aside>
        <div className="assessment__main" id="example-stage" role="region" aria-label={stages[stage]}>
          <div className="assessment__heading"><span>{stages[stage]}</span><span className="draft-badge">Draft evaluation</span></div>
          <div key={stage} className="stage-content">
            {stage === 0 && <div className="task-content"><h3>A quarter’s worth of decisions.</h3><p>You have six engineer-weeks. Recommend what the team should build next, using customer feedback, usage data, estimates, and dependencies.</p><div className="source-files"><span><FileIcon /> Customer feedback</span><span><FileIcon /> Product usage</span><span><FileIcon /> Capacity & dependencies</span></div><div className="task-deliverable"><span className="workspace-label">Your deliverable</span><p>A prioritised recommendation, the trade-offs behind it, and requirements for the top item.</p></div><p className="ui-note">The AI assistant is available throughout the task.</p></div>}
            {stage === 1 && <div className="approach-content"><h3>The decisions along the way.</h3><div className="session-entry"><span>03:12 · Candidate</span><p>“Before ranking anything, separate customer impact from effort. We have six engineer-weeks.”</p></div><div className="session-entry session-entry--ai"><span>08:24 · Direction to AI</span><p>“Compare the options against the feedback and usage data. Show your assumptions.”</p></div><div className="session-entry"><span>14:06 · Source check</span><p>“Check the usage table before treating exports as the highest-impact option.”</p></div><p className="ui-note">Selected session excerpts. More prompts do not mean a stronger assessment.</p></div>}
            {stage === 2 && <div className="result-content"><div className="document-label"><FileIcon /> Submitted recommendation</div><h3>Build the prerequisite first.</h3><p>Prioritise permissions. It unblocks exports and addresses the access issues in customer feedback.</p><div className="recommendation-row"><span>Build now</span><strong>Permissions</strong><span>4 weeks</span></div><div className="recommendation-row"><span>Scope next</span><strong>Exports</strong><span>2 weeks</span></div><div className="recommendation-row"><span>Defer</span><strong>Dashboard refresh</strong><span>—</span></div><blockquote>“Validate adoption with the accounts that requested it.”</blockquote><p className="ui-note">An excerpt from the fictional submission, not a measured business outcome.</p></div>}
            {stage === 3 && <div className="evaluation-content"><div className="evaluation-intro"><h3>Reasoning you can review.</h3><p>Five dimensions. Evidence behind each one.</p></div><div className="evaluation-grid"><div className="dimension-picker" aria-label="Evaluation dimensions">{dimensions.map((d, i) => <button key={d.name} onClick={() => setSelected(i)} type="button" aria-pressed={selected === i} aria-controls="dimension-evidence" className={selected === i ? "is-selected" : ""}><span><strong>{d.name}</strong><span>{d.finding}</span></span><ArrowRight /></button>)}</div><section className="evidence-detail" id="dimension-evidence" aria-label={`${evidence.name} evidence`} aria-live="polite"><div className="evidence-detail__source"><span className="status-dot" />{evidence.source}</div><p className="evidence-detail__context">{evidence.context}</p><blockquote key={selected}>“{evidence.quote}”</blockquote><div className="evidence-interpretation"><span>Draft interpretation</span><p>{evidence.interpretation}</p></div><p className="evidence-limitation"><strong>Keep in mind.</strong> {evidence.limitation}</p></section></div></div>}
          </div>
          <div className="assessment__bottom"><span><Check /> Evidence-linked, reviewer-led</span><span>You make the final assessment.</span></div>
        </div>
      </div>
    </div>
  );
}
