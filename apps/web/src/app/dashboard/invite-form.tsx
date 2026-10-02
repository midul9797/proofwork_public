"use client";

import { useActionState, useState } from "react";
import { createInvite, type CreateInviteState } from "./actions";

export interface TaskOption {
  id: string;
  title: string;
  summary: string;
  durationMinutes: number;
  measures: string[];
}

const initialState: CreateInviteState = { status: "idle" };

/** `datetime-local` gives a time without a zone; convert it to UTC in the browser. */
function localToIso(value: string): string {
  return value ? new Date(value).toISOString() : "";
}

function defaultDeadline(): string {
  const d = new Date(Date.now() + 3 * 86_400_000);
  d.setMinutes(0, 0, 0);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); // shift so toISOString shows local time
  return d.toISOString().slice(0, 16);
}

export function InviteForm({ tasks }: { tasks: TaskOption[] }) {
  const [state, formAction, pending] = useActionState(createInvite, initialState);
  const [deadlineLocal, setDeadlineLocal] = useState(defaultDeadline);
  const [copied, setCopied] = useState(false);

  if (tasks.length === 0) {
    return (
      <p className="rounded-md border border-slate-200 bg-white p-4 text-slate-600">
        No tasks are available yet. Run <code>pnpm tasks:sync</code> to add them.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-6" data-testid="invite-form">
      <fieldset className="space-y-3">
        <legend className="mb-2 text-sm font-medium text-slate-700">1. Choose a task</legend>
        {tasks.map((task, index) => (
          <label
            key={task.id}
            className="flex cursor-pointer gap-3 rounded-lg border border-slate-200 bg-white p-4 has-[:checked]:border-slate-900 has-[:checked]:ring-1 has-[:checked]:ring-slate-900"
          >
            <input
              type="radio"
              name="taskId"
              value={task.id}
              defaultChecked={index === 0}
              className="mt-1"
            />
            <span className="space-y-1">
              <span className="flex items-baseline gap-2">
                <span className="font-medium">{task.title}</span>
                <span className="text-sm text-slate-500">{task.durationMinutes} min</span>
              </span>
              <span className="block text-sm text-slate-600">{task.summary}</span>
              <span className="block text-xs text-slate-500">
                Measures: {task.measures.join(" · ")}
              </span>
            </span>
          </label>
        ))}
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-2 text-sm font-medium text-slate-700 sm:col-span-2">
          2. Who is it for?
        </legend>
        <label className="space-y-1 text-sm">
          <span className="text-slate-700">Candidate name</span>
          <input
            name="candidateName"
            required
            minLength={2}
            autoComplete="off"
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-slate-700">Candidate email</span>
          <input
            name="candidateEmail"
            type="email"
            required
            autoComplete="off"
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="space-y-1 text-sm sm:col-span-2">
          <span className="text-slate-700">Link expires (your local time)</span>
          <input
            type="datetime-local"
            required
            value={deadlineLocal}
            onChange={(event) => setDeadlineLocal(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 sm:w-auto"
          />
          <input type="hidden" name="deadline" value={localToIso(deadlineLocal)} />
          <span className="block text-xs text-slate-500">
            After this the candidate can no longer start. A session already running is not cut off.
          </span>
        </label>
      </fieldset>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Creating…" : "Create invite"}
      </button>

      {state.status === "error" && (
        <p role="alert" className="text-sm text-red-600" data-testid="invite-error">
          {state.message}
        </p>
      )}

      {state.status === "created" && (
        <div
          role="status"
          className="space-y-2 rounded-md border border-emerald-300 bg-emerald-50 p-4 text-sm"
          data-testid="invite-created"
        >
          <p className="font-medium text-emerald-900">
            Invite created for {state.candidateName} ({state.candidateEmail})
          </p>
          <p className="text-emerald-900">
            This link is shown only once. Copy it now; it is not stored anywhere you can read it
            later.
          </p>
          <div className="flex gap-2">
            <input
              readOnly
              value={state.link}
              data-testid="invite-link"
              onFocus={(event) => event.currentTarget.select()}
              className="min-w-0 flex-1 rounded-md border border-emerald-300 bg-white px-3 py-2 font-mono text-xs"
            />
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(state.link);
                setCopied(true);
              }}
              className="rounded-md border border-emerald-400 bg-white px-3 py-2"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
