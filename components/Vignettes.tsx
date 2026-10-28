import { keyMoments } from "@/lib/content";
import { hl } from "@/lib/highlight";
import { Chat, Check, Clock, Eye, Flag, Link } from "./Icons";

function Frame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <figure className="vig">
      <div className="vig__panel" aria-hidden="true">
        <div className="vig__bar">{title}</div>
        <div className="vig__body">{children}</div>
      </div>
      <figcaption className="vig__cap">Example data</figcaption>
    </figure>
  );
}

export function TrapsVignette() {
  return (
    <Frame title="Report · Planted errors">
      <ul className="traps">
        <li>
          <div>
            <div className="traps__what">Checked an AI claim against the source</div>
            <div className="traps__where">Product manager · illustrative example</div>
          </div>
          <span className="chip chip--caught">
            <Check /> Caught
          </span>
        </li>
        <li>
          <div>
            <div className="traps__what">Accepted an unsupported assumption</div>
            <div className="traps__where">Business analyst · illustrative example</div>
          </div>
          <span className="chip chip--missed">
            <Flag /> Missed
          </span>
        </li>
        <li>
          <div>
            <div className="traps__what">Validated a suggested change with tests</div>
            <div className="traps__where">Coding task · illustrative example</div>
          </div>
          <span className="chip chip--caught">
            <Check /> Caught
          </span>
        </li>
      </ul>
      <p className="vig__note">Checked against the submitted work after the session ends.</p>
    </Frame>
  );
}

export function ReplayVignette() {
  return (
    <Frame title="Replay · 6m 40s · QA / SDET">
      <div className="said">
        <div className="said__col">
          <div className="said__h">
            <Chat /> What the AI really said
          </div>
          <pre className="said__code">
            <span>{hl("const recent = hits.filter(")}</span>
            <span>{hl("  (t) => now - t < WINDOW_MS);")}</span>
            <span className="said__mark said__mark--ok">{hl("return recent.length < LIMIT;")}</span>
          </pre>
        </div>
        <div className="said__col">
          <div className="said__h">
            <Eye /> What the candidate saw
          </div>
          <pre className="said__code">
            <span>{hl("const recent = hits.filter(")}</span>
            <span>{hl("  (t) => now - t < WINDOW_MS);")}</span>
            <span className="said__mark said__mark--flag">{hl("return recent.length <= LIMIT;")}</span>
          </pre>
        </div>
      </div>
      <div className="scrub">
        <span className="scrub__fill" />
        <span className="scrub__head" />
      </div>
      <div className="scrub__legend">
        <span>Typed</span>
        <span>Pasted</span>
        <span>Ran tests</span>
        <span>Asked AI</span>
      </div>
    </Frame>
  );
}

export function KeyMomentsVignette() {
  return (
    <Frame title="Report · Key moments · Product manager">
      <ol className="moments">
        {keyMoments.map((m, i) => (
          <li key={i} className={`moments__row moments__row--${m.kind}`}>
            <span className="moments__t">{m.t}</span>
            <span className="moments__dot" />
            <span className="moments__label">{m.label}</span>
          </li>
        ))}
      </ol>
      <p className="vig__note">Each one opens the replay at that moment.</p>
    </Frame>
  );
}

const competencies = [
  { name: "Problem framing", draft: 72, final: 72 },
  { name: "AI collaboration", draft: 64, final: 64 },
  { name: "Verification", draft: 48, final: 60 },
];

export function EvaluationVignette() {
  return (
    <Frame title="Report · Evaluation">
      <div className="eval__head">
        <span className="chip chip--draft">Draft by AI judge</span>
        <span className="eval__btn">Mark final</span>
      </div>
      <ul className="eval">
        {competencies.map((c) => (
          <li key={c.name} className={c.final !== c.draft ? "is-edited" : undefined}>
            <span className="eval__name">{c.name}</span>
            <span className="meter">
              <span style={{ width: `${c.final}%` }} />
            </span>
            <span className="eval__score">{c.final}</span>
            <span className="eval__by">{c.final !== c.draft ? `You · was ${c.draft}` : "Draft"}</span>
          </li>
        ))}
        <li className="eval__more">+ 2 more competencies</li>
      </ul>
      <blockquote className="evidence">
        <p>&ldquo;I compared the changelog with the style guide before drafting the customer release notes.&rdquo;</p>
        <footer>
          <Check /> Quote found in the session · AI chat, 8m 20s
        </footer>
      </blockquote>
      <p className="vig__note">The reviewer can inspect the evidence and adjust the ratings.</p>
    </Frame>
  );
}

export function BaselineVignette() {
  return (
    <Frame title="Report · Compared with the AI alone">
      <div className="base">
        <div className="base__row">
          <span className="base__k">AI alone</span>
          <span className="meter meter--muted">
            <span style={{ width: "62%" }} />
          </span>
          <span className="base__v">62</span>
        </div>
        <div className="base__row">
          <span className="base__k">Candidate</span>
          <span className="meter">
            <span style={{ width: "81%" }} />
          </span>
          <span className="base__v">81</span>
        </div>
      </div>
      <p className="base__out">This candidate: 81 · 19 above the AI alone.</p>
      <p className="vig__note">Illustrative scores. The reference depends on the model and task conditions.</p>
    </Frame>
  );
}

export function ExplainBackVignette() {
  return (
    <Frame title="Explaining their own work · Sales">
      <div className="qa">
        <div className="qa__q">Why did you change the renewal date in the email?</div>
        <div className="qa__a">
          The contract says February 1 with 30 days&rsquo; notice. The draft said March 1, which would have had the
          customer planning around the wrong month.
        </div>
      </div>
      <div className="qa__suggest">
        <div className="qa__suggest-h">
          <Link /> Questions to ask the candidate
        </div>
        <ul>
          <li>What would you do if the customer had already been told March 1?</li>
          <li>What else in a contract do you check before a renewal email goes out?</li>
        </ul>
      </div>
      <p className="vig__note">
        <Clock /> Answered after submission
      </p>
    </Frame>
  );
}
