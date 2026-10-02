"use server";

import { eq, getDb, invites, tasks } from "@proofwork/db";
import { checkDeadline, inviteInputSchema } from "@proofwork/shared";
import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { generateToken, hashToken } from "@/lib/tokens";
import { ensureUserWorkspace } from "@/lib/workspace";

export type CreateInviteState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "created"; candidateName: string; candidateEmail: string; link: string };

export async function createInvite(
  _previous: CreateInviteState,
  formData: FormData,
): Promise<CreateInviteState> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) return { status: "error", message: "Your session has expired. Sign in again." };
  const { user, workspace } = await ensureUserWorkspace(authUser);

  const parsed = inviteInputSchema.safeParse({
    taskId: formData.get("taskId"),
    candidateName: formData.get("candidateName"),
    candidateEmail: formData.get("candidateEmail"),
    deadline: formData.get("deadline"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Check the form" };
  }
  const input = parsed.data;

  const deadlineError = checkDeadline(new Date(input.deadline));
  if (deadlineError) return { status: "error", message: deadlineError };

  const db = getDb();
  const [task] = await db.select({ id: tasks.id }).from(tasks).where(eq(tasks.id, input.taskId));
  if (!task) return { status: "error", message: "That task no longer exists. Reload the page." };

  // The token goes in the candidate link and is shown once. Only its hash is stored.
  const token = generateToken();
  await db.insert(invites).values({
    workspaceId: workspace.id,
    taskId: task.id,
    createdBy: user.id,
    candidateName: input.candidateName,
    candidateEmail: input.candidateEmail,
    tokenHash: hashToken(token),
    deadline: new Date(input.deadline),
  });

  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
  return {
    status: "created",
    candidateName: input.candidateName,
    candidateEmail: input.candidateEmail,
    link: `${protocol}://${host}/s/${token}`,
  };
}
