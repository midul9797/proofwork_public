import { parse as parseYaml } from "yaml";
import { z } from "zod";

/**
 * The format of `tasks/<slug>/task.yaml`. One folder per task:
 *
 *   task.yaml   this file
 *   brief.md    what the candidate reads
 *   repo/       the starting code the candidate edits
 *   hidden/     files that never reach the candidate (extra tests, answer keys)
 *   traps/      pre-written flawed AI answers (used from week 5)
 */

const globList = z.array(z.string().min(1)).min(1);

export const taskSchema = z
  .object({
    /** Folder name and stable identifier. */
    slug: z
      .string()
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "use lowercase words separated by single dashes"),
    /** Author-declared version, bumped when the task changes meaningfully. */
    version: z.number().int().min(1),
    title: z.string().min(3).max(80),
    /** One or two sentences shown in the task picker. */
    summary: z.string().min(10).max(300),
    /** What this task tells a reviewer, shown in the task picker. */
    measures: z.array(z.string().min(2)).min(1).max(6),
    /** Time the candidate gets once they press Start. */
    durationMinutes: z.number().int().min(15).max(240),

    /** Docker image the sandbox starts from. */
    image: z.string().min(1).default("mcr.microsoft.com/playwright:v1.63.0-noble"),
    run: z.object({
      /** Directory in the sandbox where `repo/` is copied. Relative paths start from the sandbox home. */
      workdir: z.string().min(1).default("repo"),
      /** Run once after the files are copied, e.g. `npm ci`. */
      setupCommand: z.string().min(1).optional(),
      /** Starts the app under test in the background, if the tests need it running. */
      startCommand: z.string().min(1).optional(),
      /** What the Run button executes. */
      testCommand: z.string().min(1),
      env: z.record(z.string(), z.string()).default({}),
      /** Longest a single test run may take. */
      testTimeoutSeconds: z.number().int().min(10).max(600).default(120),
    }),

    files: z.object({
      /** Globs relative to `repo/` that appear in the candidate's file tree. */
      visible: globList,
      /** Subset of visible files the candidate can open but not change. */
      readOnly: z.array(z.string().min(1)).default([]),
    }),

    /** Weight of each thing the reviewer report scores. Must add up to 100. */
    rubric: z
      .record(z.string().min(1), z.number().positive())
      .refine((weights) => Object.keys(weights).length >= 1, "add at least one rubric item"),

    /** Seeded AI mistakes. Empty until week 5, which defines the rule format. */
    traps: z.array(z.never()).default([]),
  })
  .superRefine((task, ctx) => {
    const total = Object.values(task.rubric).reduce((sum, weight) => sum + weight, 0);
    if (Math.abs(total - 100) > 1e-9) {
      ctx.addIssue({
        code: "custom",
        path: ["rubric"],
        message: `rubric weights add up to ${total}, expected 100`,
      });
    }
  });

export type TaskConfig = z.infer<typeof taskSchema>;

export class TaskConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TaskConfigError";
  }
}

/** Parses and validates the text of a task.yaml. Throws `TaskConfigError` with readable messages. */
export function parseTaskYaml(text: string): TaskConfig {
  let raw: unknown;
  try {
    raw = parseYaml(text);
  } catch (error) {
    throw new TaskConfigError(`task.yaml is not valid YAML: ${(error as Error).message}`);
  }
  const result = taskSchema.safeParse(raw);
  if (!result.success) throw new TaskConfigError(z.prettifyError(result.error));
  return result.data;
}
