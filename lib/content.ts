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
    tasks: [{ name: "Revenue drop diagnosis" }, { name: "Two dashboards disagree" }],
  },
  {
    role: "Sales",
    tasks: [{ name: "Pipeline review and forecast call" }, { name: "Recover a stalled deal" }],
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
  {
    q: "Which roles can I hire for?",
    // Built from `roles`, so it stays current as roles are added.
    a: `Any role where people now do the work with AI. Roles available today: ${new Intl.ListFormat("en", { type: "conjunction" }).format(roles.map((r) => r.role))}. New roles are added as they’re ready.`,
  },
  {
    q: "Is AI allowed?",
    a: "Yes. An AI assistant sits inside the workspace and candidates are told up front that using it is part of the task. Sending more AI messages is never rewarded; message counts are shown as context only.",
  },
  {
    q: "Is the AI ever wrong on purpose?",
    a: "Yes, and we say so openly. Some answers contain a deliberate mistake, so checking the assistant’s work is part of the task, just as it is on the job. Which answers are planted is never shown during the task.",
  },
  {
    q: "What is recorded?",
    a: "Everything the candidate types, pastes, runs and asks the AI, what the AI answered, and time spent away from the window. Candidates agree to recording before the task starts.",
  },
  {
    q: "How long are tasks?",
    a: "Every task is timed, for example 45 minutes for the product manager tasks. The candidate sees the limit before starting, and the timer stays in view.",
  },
  {
    q: "Can I override the evaluation?",
    a: "Always. The AI judge only drafts scores, and every quote it cites is checked against the real session. You can change any score and mark your own evaluation final.",
  },
  {
    q: "Where is data stored?",
    a: "On Supabase, in the Tokyo region.",
  },
  {
    q: "Do candidates install anything?",
    a: "No. The workspace runs in a desktop browser with its own sandbox per candidate: the task's files and documents, an editor and test runner where the task needs them, and the AI chat.",
  },
  {
    q: "What does it cost?",
    a: "Proofwork is free while in early access. Sign in with your work email; no password and no card.",
  },
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
