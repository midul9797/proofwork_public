"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Flag } from "./Icons";
import styles from "./TaskGeneration.module.css";

const steps = [
  { title: "Describe your role", text: "Set the responsibilities, seniority, and skills you want to see. Choose a document or coding task." },
  { title: "Choose an idea", text: "Start with three different proposals. Ask for more until you find the right fit, up to nine ideas." },
  { title: "Review the materials", text: "Read the generated files and answer key. Coding projects must pass checks in a real sandbox." },
  { title: "Choose the planted errors", text: "Review deliberately wrong AI answers and select the ones that test careful verification." },
  { title: "Make the scoring yours", text: "Edit the criteria, weights, and descriptions of strong and weak answers before creating the task." },
  { title: "Invite with confidence", text: "Keep the finished task private to your workspace. Compare candidate work with an AI-only benchmark." },
];

const examples = {
  document: {
    title: "Investigate a support backlog",
    role: "Customer operations lead",
    focus: "Data analysis and prioritisation",
    description: "Leads a support team, investigates service delays, and turns ticket data into operational decisions.",
    brief: "Response times have risen while ticket volume has stayed steady. Find what changed and recommend where the team should act first.",
    ideas: ["Investigate a support backlog", "Plan a team handover", "Review an escalation policy"],
    files: ["Ticket history.csv", "Team handover.md", "Service targets.md"],
    check: "Answer-key figures checked against the data",
    error: "“Ticket volume increased, so the team needs more people.”",
    correction: "The volume stayed steady. Check the ticket history before accepting the explanation.",
    criteria: ["Finding the cause", "Evidence and verification", "Practical recommendation"],
    weights: [40, 35, 25],
  },
  coding: {
    title: "Repair a booking conflict",
    role: "Backend engineer · Python",
    focus: "Debugging and review",
    description: "Builds Python services, investigates production defects, and writes tests for critical business rules.",
    brief: "Some overlapping reservations are being accepted. Investigate the booking service, fix the behavior, and add a regression test.",
    ideas: ["Repair a booking conflict", "Trace a stale cache", "Reconcile a billing total"],
    files: ["bookings.py", "test_bookings.py", "README.md"],
    check: "Starting code and reference solution checked in a sandbox",
    error: "“Reservations that touch at a boundary must always conflict.”",
    correction: "Check the booking rules and test cases before relying on the suggested condition.",
    criteria: ["Correctness of the fix", "Test coverage", "Reasoning and verification"],
    weights: [45, 30, 25],
  },
};

export function TaskGeneration() {
  const [kind, setKind] = useState<keyof typeof examples>("document");
  const [active, setActive] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);
  const example = examples[kind];

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const mobile = window.matchMedia("(max-width: 820px)").matches;
      const stage = stageRef.current;
      const readingLine = mobile && stage
        ? Math.min(window.innerHeight - 60, stage.getBoundingClientRect().bottom + 64)
        : window.innerHeight * 0.48;
      let next = 0;
      stepRefs.current.forEach((element, index) => {
        if (element && element.getBoundingClientRect().top <= readingLine) next = index;
      });
      setActive(next);
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(measure); };
    setEnhanced(true);
    measure();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, []);

  const goToStep = (index: number) => {
    const target = stepRefs.current[index];
    if (!target) return;
    const mobile = window.matchMedia("(max-width: 820px)").matches;
    const offset = mobile && stageRef.current ? stageRef.current.offsetHeight + 100 : window.innerHeight * 0.4;
    window.scrollTo({
      top: window.scrollY + target.getBoundingClientRect().top - offset,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };

  return (
    <section className="section" id="tasks" aria-labelledby="tasks-title">
      <div className="wrap">
        <header className="head" data-reveal>
          <h2 id="tasks-title">Your role. Your task.</h2>
          <p>Generate an assessment around the work you’re hiring for. Scroll through the creation process, from the first idea to a task ready to send.</p>
        </header>
        <div className={`${styles.layout} ${enhanced ? styles.enhanced : ""}`}>
          <ol className={styles.steps}>
            {steps.map(({ title, text }, index) => (
              <li key={title} ref={(element) => { stepRefs.current[index] = element; }} className={active === index ? styles.current : ""} aria-current={active === index ? "step" : undefined}>
                <div className={styles.stepCopy}>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className={styles.stage} ref={stageRef}>
            <figure className={styles.preview} data-ui aria-label="Illustrative task creation walkthrough" data-active-step={active + 1}>
              <div className={styles.toolbar}>
                <span>{steps[active].title}</span>
                <span className={styles.private}>{active + 1} of {steps.length}</span>
              </div>
              <div className={styles.body}>
                <div className={styles.switcher} role="group" aria-label="Example task format">
                  <button type="button" aria-pressed={kind === "document"} onClick={() => setKind("document")}>Document task</button>
                  <button type="button" aria-pressed={kind === "coding"} onClick={() => setKind("coding")}>Coding task</button>
                </div>
                <div className={styles.scenes}>
                  {steps.map(({ title }, index) => (
                    <div key={title} className={`${styles.scene} ${active === index ? styles.visible : ""}`} aria-hidden={active !== index}>
                      {index === 0 && <>
                        <p className={styles.label}>The role you’re hiring for</p>
                        <h3 className={styles.title}>{example.role}</h3>
                        <p className={styles.brief}>{example.description}</p>
                        <div className={styles.field}><span>What should the task bring out?</span><strong>{example.focus}</strong></div>
                        <p className={styles.check}><Check />Difficulty shaped by the role and seniority</p>
                      </>}
                      {index === 1 && <>
                        <h3 className={styles.title}>Three ways to see the skill.</h3>
                        <ul className={styles.ideas}>{example.ideas.map((idea, i) => <li key={idea} className={i === 0 ? styles.chosen : ""}><span>{idea}</span>{i === 0 && <Check />}</li>)}</ul>
                        <p className={styles.hint}>Choose the idea that fits your team’s work.</p>
                      </>}
                      {index === 2 && <>
                        <h3 className={styles.title}>{example.title}</h3>
                        <p className={styles.brief}>{example.brief}</p>
                        <div className={styles.materials}><h4>Candidate materials</h4><ul>{example.files.map((file) => <li key={file}>{file}</li>)}</ul></div>
                        <p className={styles.check}><Check />{example.check}</p>
                      </>}
                      {index === 3 && <>
                        <p className={styles.label}>A proposed AI mistake</p>
                        <blockquote className={styles.error}>{example.error}</blockquote>
                        <p className={styles.brief}>{example.correction}</p>
                        <p className={styles.check}><Flag />You review and select the planted errors.</p>
                      </>}
                      {index === 4 && <>
                        <h3 className={styles.title}>Define a strong answer.</h3>
                        <div className={styles.scoring}><dl>{example.criteria.map((criterion, i) => <div key={criterion}><dt>{criterion}</dt><dd>{example.weights[i]}%</dd></div>)}</dl></div>
                        <p className={styles.check}><Check />Total weight: 100%</p>
                        <p className={styles.hint}>Edit criteria, weights, and descriptions before creating the task.</p>
                      </>}
                      {index === 5 && <>
                        <p className={styles.ready}><Check />Ready for candidate invitations</p>
                        <h3 className={styles.title}>{example.title}</h3>
                        <p className={styles.brief}>Private to your workspace. Your team can now use this task in a candidate invitation.</p>
                        <div className={styles.field}><strong>How far can AI get on its own?</strong><span>Two AI-only runs create a reference score for candidate reports.</span></div>
                      </>}
                    </div>
                  ))}
                </div>
                <nav className={styles.progress} aria-label="Task creation steps">
                  {steps.map(({ title }, index) => <button key={title} type="button" aria-label={`Show step: ${title}`} aria-current={active === index ? "step" : undefined} onClick={() => goToStep(index)}><span className={index <= active ? styles.complete : ""} /></button>)}
                </nav>
              </div>
              <figcaption className={styles.caption}>Illustrative process · Fictional task data</figcaption>
            </figure>
          </div>
        </div>
        <p className={styles.note}>Progress is saved after every step. Document tasks support a wide range of roles; coding tasks run in JavaScript or Python. Task generation is currently in English.</p>
      </div>
    </section>
  );
}
