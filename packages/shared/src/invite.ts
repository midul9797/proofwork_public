import { z } from "zod";

export const MIN_DEADLINE_HOURS = 1;
export const MAX_DEADLINE_DAYS = 90;

/** What a hiring manager fills in to invite a candidate. */
export const inviteInputSchema = z.object({
  taskId: z.uuid("Choose a task"),
  candidateName: z
    .string()
    .trim()
    .min(2, "Enter the candidate's name")
    .max(100, "That name is too long"),
  candidateEmail: z
    .string()
    .trim()
    .toLowerCase()
    .max(254, "That email is too long")
    .pipe(z.email("Enter a valid email address")),
  /** ISO timestamp (UTC). The browser converts the picked local time before sending. */
  deadline: z.iso.datetime("Pick a deadline"),
});

export type InviteInput = z.infer<typeof inviteInputSchema>;

/** Checks the deadline is neither too soon nor too far away. Returns an error message or null. */
export function checkDeadline(deadline: Date, now: Date = new Date()): string | null {
  const earliest = now.getTime() + MIN_DEADLINE_HOURS * 3_600_000;
  const latest = now.getTime() + MAX_DEADLINE_DAYS * 86_400_000;
  if (deadline.getTime() < earliest) {
    return `The deadline must be at least ${MIN_DEADLINE_HOURS} hour from now`;
  }
  if (deadline.getTime() > latest) {
    return `The deadline can be at most ${MAX_DEADLINE_DAYS} days from now`;
  }
  return null;
}
