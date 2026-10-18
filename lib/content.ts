import { CONTACT_EMAIL } from "./site";

export const roles = [
  {
    role: "Product manager",
    tasks: [
      {
        name: "Prioritise next quarter",
        text: "Choose what the team builds next quarter from feedback, usage data, estimates and strategy, then write requirements for the top item.",
      },
      {
        name: "Ship or not, from a noisy experiment",
        text: "An A/B test looks like a clear win. Decide whether to ship, extend or stop, from data that does not all agree.",
      },
    ],
  },
  {
    role: "Business analyst",
    tasks: [
      { name: "Revenue drop diagnosis", text: "Investigate a change in revenue, check the supporting data, and recommend what to examine next." },
      { name: "Two dashboards disagree", text: "Reconcile conflicting metrics, examine definitions and assumptions, and explain which numbers to use." },
    ],
  },
  {
    role: "Sales",
    tasks: [
      { name: "Pipeline review and forecast call", text: "Review opportunities, challenge assumptions, and build a forecast you can explain." },
      { name: "Recover a stalled deal", text: "Assess the account context and propose a practical next step grounded in the buyer’s needs." },
    ],
  },
  {
    role: "QA / SDET",
    tasks: [
      { name: "Checkout regression", text: "Fix a stale-discount bug in a small shop, then add tests that keep it fixed." },
      { name: "Flaky suite rescue", text: "Find out why a test suite fails intermittently and make it reliable." },
    ],
  },
] as { role: string; tasks: { name: string; text?: string }[] }[];

export const faqs: { q: string; a: string }[] = [
  { q: "What does Proofwork evaluate?", a: "Five dimensions: problem framing, AI collaboration, verification, domain judgment, and outcome. Each draft evaluation links to evidence from the session or submitted work. An observed action and an interpretation of it are different; reviewers should inspect both." },
  { q: "Can I change the evaluation?", a: "Yes. The evaluation remains a draft until the reviewer finalises it. You can inspect the supporting evidence and change any rating. A quote matching the session confirms the quote, not the correctness of the evaluator’s interpretation." },
  { q: "How long does an assessment take?", a: "The product manager tasks allow 45 minutes. Each task’s time allowance is shown before the candidate begins and stays visible in the workspace. Other roles use the time allowance specified for their task." },
  { q: "Do candidates need to install anything?", a: "No. Candidates complete the task in a desktop browser. The assessment workspace contains relevant materials and an AI assistant, plus an editor and test runner where the task calls for them." },
  { q: "Can we create our own assessments?", a: "Custom assessment creation is in development. The current workflow uses the available role-based tasks. Contact the founder to discuss your requirements and what is currently available." },
  { q: "How do I get access?", a: `Access is arranged directly while we work with interested hiring teams. Request a demo or contact ${CONTACT_EMAIL} to discuss your role, access, and the current offer.` },
];

export const keyMoments = [
  { t: "1m 40s", label: "First message to the assistant", kind: "notable" },
  { t: "4m 05s", label: "Planted error shown in an AI answer", kind: "flag" },
  { t: "6m 30s", label: "Inserted 9 lines from the assistant into release-notes.md", kind: "notable" },
  { t: "9m 12s", label: "Opened materials/changelog.md again", kind: "note" },
  { t: "18m 40s", label: "Left the window · 2m 05s", kind: "note" },
  { t: "41m 05s", label: "Submitted by the candidate", kind: "note" },
] as const;

/** Timeline positions (percent of the session) for the replay ticks. */
export const timelineTicks = [
  { at: 4, kind: "ai", label: "First message" },
  { at: 10, kind: "flag", label: "Trap fired" },
  { at: 15.8, kind: "paste", label: "Insert" },
  { at: 22.4, kind: "ai", label: "AI message" },
  { at: 38, kind: "paste", label: "Paste" },
  { at: 45.4, kind: "away", label: "Left the window" },
  { at: 71, kind: "ai", label: "AI message 3" },
] as const;
