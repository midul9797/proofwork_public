import { CONTACT_EMAIL } from "./site";

export const faqs: { q: string; a: string }[] = [
  { q: "What does Evaliro evaluate?", a: "Five dimensions: problem framing, AI collaboration, verification, domain judgment, and outcome. Each draft evaluation links to evidence from the session or submitted work. An observed action and an interpretation of it are different; reviewers should inspect both." },
  { q: "Can I change the evaluation?", a: "Yes. The evaluation remains a draft until the reviewer finalises it. You can inspect the supporting evidence and change any rating. A quote matching the session confirms the quote, not the correctness of the evaluator’s interpretation." },
  { q: "How long does an assessment take?", a: "The time allowance depends on the task. It is shown before the candidate begins and stays visible in the workspace. Example sessions on this page use a 45-minute task." },
  { q: "Do candidates need to install anything?", a: "No. Candidates complete the task in a desktop browser. The assessment workspace contains relevant materials and an AI assistant, plus an editor and test runner where the task calls for them." },
  { q: "Can we create our own assessments?", a: "Yes. Admins and task creators can describe a role, choose a generated idea, review the files and planted errors, and edit scoring criteria and weights. Finished tasks are private to your workspace and ready for candidate invitations. Each task also gets an AI-only benchmark." },
  { q: "What kinds of tasks can we generate?", a: "Document tasks can assess work across a wide range of professions. Coding tasks currently support JavaScript and Python, with projects checked in a sandbox before approval. Task generation is currently in English. The role title and description help set the level of difficulty." },
  { q: "Can I finish creating a task later?", a: "Yes. Each completed step is saved, so you can close the page and resume from Your tasks. Once created, the finished task is read only; create a new task if you need to change it." },
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
