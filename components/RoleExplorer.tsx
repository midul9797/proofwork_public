"use client";

import { useState } from "react";
import { roles } from "@/lib/content";
import { DEMO_URL } from "@/lib/site";
import { ArrowRight, FileIcon } from "./Icons";

export function RoleExplorer() {
  const [selected, setSelected] = useState(0);
  const role = roles[selected];
  return (
    <div className="role-explorer" data-reveal>
      <div className="role-explorer__nav" aria-label="Assessment roles">{roles.map((r, i) => <button key={r.role} type="button" aria-pressed={selected === i} aria-controls="role-tasks" onClick={() => setSelected(i)} className={selected === i ? "is-selected" : ""}>{r.role}<ArrowRight /></button>)}</div>
      <div className="role-explorer__content" id="role-tasks" aria-live="polite" key={selected}>
        <p className="role-explorer__caption">Tasks for {role.role === "Sales" ? "sales professionals" : role.role === "QA / SDET" ? "QA / SDET candidates" : `${role.role.toLowerCase()}s`}</p>
        {role.tasks.map((task) => <article key={task.name} className="role-task"><FileIcon /><div><h3>{task.name}</h3><p>{task.text}</p></div></article>)}
        <div className="role-explorer__footer"><span>{selected === 0 ? "45 minutes per task" : "Time allowance shown before starting"}</span><a href={DEMO_URL}>Request a demo <ArrowRight /></a></div>
      </div>
    </div>
  );
}
