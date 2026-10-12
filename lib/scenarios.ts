/**
 * Invented example sessions for the walkthrough, one per profession.
 * Topics deliberately avoid the real tasks (planning/feedback, revenue, dashboards,
 * pipeline/forecast, deals, checkout, test suites) so the page never hints at what
 * a real task checks.
 */
export type Check = { text: string; ok: boolean; isNew?: boolean };

export type Scenario = {
  id: string;
  role: string;
  task: string;
  /** Code answers render in mono with syntax colour; prose answers render as text. */
  kind: "code" | "prose";
  prompt: string;
  answer: string[];
  flagIndex: number;
  realLine: string;
  caught: {
    reply: string;
    file: string;
    del: string;
    add: string;
    checkTitle: string;
    checks: Check[];
    verdict: string;
  };
  missed: {
    file: string;
    add: string;
    checkTitle: string;
    checks: Check[];
    verdict: string;
  };
};

export const scenarios: Scenario[] = [
  {
    id: "pm",
    role: "Product manager",
    task: "Release notes",
    kind: "prose",
    prompt: "Draft this month’s customer release notes from changelog.md.",
    answer: [
      "New this month:",
      "Bulk invite is now live for every workspace.",
      "Saved filters and dark mode are available too.",
    ],
    flagIndex: 1,
    realLine: "Bulk invite is still behind a flag, so it is not listed.",
    caught: {
      reply: "Bulk invite is still behind a flag in the changelog. Leaving it out.",
      file: "release-notes.md · edited by candidate",
      del: "Bulk invite is now live for every workspace.",
      add: "Coming soon: bulk invite (in testing).",
      checkTitle: "Sources opened",
      checks: [
        { text: "changelog.md, after the answer", ok: true },
        { text: "Flag status confirmed", ok: true, isNew: true },
      ],
      verdict: "The unreleased feature is not in the submitted notes. Found at 00:08:20 in the replay.",
    },
    missed: {
      file: "release-notes.md · pasted from AI",
      add: "Bulk invite is now live for every workspace.",
      checkTitle: "Sources opened",
      checks: [{ text: "Changelog not reopened after the answer", ok: false }],
      verdict: "The submitted notes announce a feature customers can’t use yet.",
    },
  },
  {
    id: "ba",
    role: "Business analyst",
    task: "Hiring-funnel report",
    kind: "prose",
    prompt: "What was our offer acceptance rate last quarter?",
    answer: [
      "From offers.csv:",
      "40 of 50 offers were accepted, an 80% acceptance rate.",
      "Engineering accepted fastest.",
    ],
    flagIndex: 1,
    realLine: "40 of 62 offers were accepted, a 65% acceptance rate.",
    caught: {
      reply: "offers.csv has 62 offers, not 50. Recounting.",
      file: "report.md · edited by candidate",
      del: "Offer acceptance: 80% (40 of 50)",
      add: "Offer acceptance: 65% (40 of 62)",
      checkTitle: "Checks",
      checks: [
        { text: "Rows counted in offers.csv", ok: true, isNew: true },
        { text: "Rate recomputed", ok: true },
      ],
      verdict: "The wrong denominator is not in the submitted report. Found at 00:11:05.",
    },
    missed: {
      file: "report.md · pasted from AI",
      add: "Offer acceptance: 80% (40 of 50)",
      checkTitle: "Checks",
      checks: [{ text: "No recount after the answer", ok: false }],
      verdict: "The submitted report overstates acceptance by 15 points.",
    },
  },
  {
    id: "sales",
    role: "Sales",
    task: "Renewal email",
    kind: "prose",
    prompt: "Write the renewal reminder for Northfield Clinics using their contract.",
    answer: [
      "Hi Dana,",
      "Your plan renews on March 1 at your current price.",
      "Happy to walk through any changes before then.",
    ],
    flagIndex: 1,
    realLine: "Your plan renews on February 1 at your current price.",
    caught: {
      reply: "The contract says February 1, with 30 days’ notice. Fixing the date.",
      file: "email.md · edited by candidate",
      del: "Your plan renews on March 1.",
      add: "Your plan renews on February 1.",
      checkTitle: "Checks",
      checks: [
        { text: "contract.md opened after the answer", ok: true, isNew: true },
        { text: "Notice period checked", ok: true },
      ],
      verdict: "The wrong renewal date is not in the submitted email. Found at 00:06:15.",
    },
    missed: {
      file: "email.md · pasted from AI",
      add: "Your plan renews on March 1.",
      checkTitle: "Checks",
      checks: [{ text: "Contract not opened after the answer", ok: false }],
      verdict: "The submitted email tells the customer the wrong renewal date.",
    },
  },
  {
    id: "qa",
    role: "QA / SDET",
    task: "Rate limiter",
    kind: "code",
    prompt: "Write allow() so each client gets 100 requests per minute.",
    answer: [
      "export function allow(hits: number[], now: number) {",
      "  const recent = hits.filter((t) => now - t < WINDOW_MS);",
      "  return recent.length <= LIMIT;",
      "}",
    ],
    flagIndex: 2,
    realLine: "return recent.length < LIMIT;",
    caught: {
      reply: "Isn’t <= one too many? recent doesn’t include this request.",
      file: "rateLimit.ts · edited by candidate",
      del: "  return recent.length <= LIMIT;",
      add: "  return recent.length < LIMIT;",
      checkTitle: "Test run",
      checks: [
        { text: "allows the first 100 requests", ok: true },
        { text: "blocks request 101 in a window", ok: true, isNew: true },
        { text: "5 more passed", ok: true },
      ],
      verdict: "The planted error is fixed in the submitted code. Found at 00:07:30.",
    },
    missed: {
      file: "rateLimit.ts · pasted from AI",
      add: "  return recent.length <= LIMIT;",
      checkTitle: "Test run",
      checks: [
        { text: "6 passed", ok: true },
        { text: "No test covers request 101", ok: false },
      ],
      verdict: "The planted error is in the submitted code. Request 101 gets through.",
    },
  },
];
