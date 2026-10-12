"use client";

import { useEffect, useRef, useState } from "react";
import { hl } from "@/lib/highlight";
import { scenarios } from "@/lib/scenarios";
import { Chat, Check, Cross, Flag, Terminal } from "./Icons";

type Outcome = "caught" | "missed";

const steps = [
  {
    title: "The candidate asks the AI.",
    body: "AI is allowed, and the candidate knows it. Switch roles above to see the same moment in different work.",
  },
  {
    title: "The AI answers, with a mistake planted on purpose.",
    body: "Some answers carry a deliberate error: a feature that isn’t live yet, a wrong denominator, a wrong date, an off-by-one. It reads as correct, and nothing tells the candidate which answers are planted.",
  },
  {
    title: "Proofwork keeps both versions.",
    body: "What the AI really said, and the planted version the candidate saw. The reviewer sees the line flagged in the replay. The candidate never does.",
  },
  {
    title: "Then the work shows.",
    body: "Caught: they check the answer against the source and fix it. Missed: they take it as given and move on.",
  },
  {
    title: "Checked after submission.",
    body: "Proofwork checks the submitted work against every planted error. The result is Caught or Missed, with the moment in the replay one click away.",
  },
];

// Stage item that should be in view for each step (steps 1 and 2 share the AI answer).
const STEP_TO_ITEM = [0, 1, 1, 2, 3];

function Line({ text, code }: { text: string; code: boolean }) {
  return <>{code ? hl(text) : text}</>;
}

export function Walkthrough() {
  // Server render shows the finished story; on mount the scroll position takes over.
  const [step, setStep] = useState(4);
  const [outcome, setOutcome] = useState<Outcome>("caught");
  const [roleId, setRoleId] = useState(scenarios[0].id);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const feedRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const s = scenarios.find((x) => x.id === roleId) ?? scenarios[0];
  const code = s.kind === "code";
  const o = outcome === "caught" ? s.caught : s.missed;

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    setStep(0);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setStep(Number((e.target as HTMLElement).dataset.step));
        }
      },
      { rootMargin: "-62% 0px -28% 0px" },
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  // Keep the newest message in view inside the stage.
  useEffect(() => {
    const feed = feedRef.current;
    const item = itemRefs.current[STEP_TO_ITEM[step]];
    if (!feed || !item) return;
    const target = Math.max(0, item.offsetTop + item.offsetHeight - feed.clientHeight + 24);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    feed.scrollTo({ top: target, behavior: reduce ? "auto" : "smooth" });
  }, [step, outcome, roleId]);

  const on = (n: number) => (step >= n ? " is-on" : "");
  const setItem = (i: number) => (el: HTMLDivElement | null) => {
    itemRefs.current[i] = el;
  };

  return (
    <>
      <div className="roles" role="group" aria-label="Choose a profession">
        {scenarios.map((x) => (
          <button
            key={x.id}
            type="button"
            className="roles__btn"
            aria-pressed={x.id === roleId}
            onClick={() => setRoleId(x.id)}
          >
            {x.role}
          </button>
        ))}
        <span className="roles__more">More professions on the way</span>
      </div>

      <div className="wt" data-outcome={outcome}>
        <ol className="wt-steps">
          {steps.map((st, i) => (
            <li
              key={st.title}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              data-step={i}
              className={`wt-step${step === i ? " is-active" : ""}`}
            >
              <h3>{st.title}</h3>
              <p>{st.body}</p>
            </li>
          ))}
        </ol>

        <div className="wt-stage-wrap">
          <div className="wt-stage" data-step={step}>
            <div className="wt-stage__bar">
              <span className="wt-stage__title">
                {s.role} <span className="rp-dim">· {s.task} (example)</span>
              </span>
              <div className="seg" role="group" aria-label="Show outcome">
                <button type="button" aria-pressed={outcome === "caught"} onClick={() => setOutcome("caught")}>
                  Caught
                </button>
                <button type="button" aria-pressed={outcome === "missed"} onClick={() => setOutcome("missed")}>
                  Missed
                </button>
              </div>
            </div>

            <div className="wt-feed" ref={feedRef} aria-live="polite" key={s.id}>
              <div ref={setItem(0)} className="wt-item is-on">
                <div className="msg msg--me">{s.prompt}</div>
              </div>

              <div ref={setItem(1)} className={`wt-item${on(1)}`}>
                <div className="msg msg--ai">
                  <div className="msg__who">
                    <Chat /> AI assistant
                  </div>
                  <div className={code ? "msg__code msg__code--lg" : "msg__prose"}>
                    {s.answer.map((l, i) => (
                      <span key={i} className={i === s.flagIndex ? "msg__flag-line" : undefined}>
                        <Line text={l} code={code} />
                      </span>
                    ))}
                  </div>
                  <div className="wt-said">
                    <span className="wt-said__k">What the AI really said</span>
                    <span className={code ? "wt-said__v wt-said__v--code" : "wt-said__v"}>
                      <Line text={s.realLine} code={code} />
                    </span>
                  </div>
                  <div className="msg__chips">
                    <span className="chip chip--flag">
                      <Flag /> Planted error · reviewer view only
                    </span>
                  </div>
                </div>
              </div>

              <div ref={setItem(2)} className={`wt-item${on(3)}`}>
                {outcome === "caught" && <div className="msg msg--me">{s.caught.reply}</div>}
                <div className="wt-card">
                  <div className="wt-card__h">{o.file}</div>
                  <pre className={`diff${code ? "" : " diff--prose"}`}>
                    {outcome === "caught" && (
                      <span className="diff--del">
                        <Line text={`- ${s.caught.del}`} code={code} />
                      </span>
                    )}
                    <span className="diff--add">
                      <Line text={`+ ${o.add}`} code={code} />
                    </span>
                  </pre>
                </div>
                <div className="wt-card">
                  <div className="wt-card__h">
                    <Terminal /> {o.checkTitle}
                  </div>
                  <ul className="tests">
                    {o.checks.map((c) => (
                      <li key={c.text} className={c.ok ? (c.isNew ? "tests--new" : undefined) : "tests--none"}>
                        {c.ok ? <Check /> : <Cross />} {c.text}
                        {c.isNew && <em>new</em>}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div ref={setItem(3)} className={`wt-item${on(4)}`}>
                <div className={`verdict verdict--${outcome}`}>
                  <span className="verdict__badge">
                    {outcome === "caught" ? <Check /> : <Flag />}
                    {outcome === "caught" ? "Caught" : "Missed"}
                  </span>
                  <span className="verdict__text">{o.verdict}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
