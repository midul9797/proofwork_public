import { eq, getDb, users, workspaces } from "@proofwork/db";

/** Returns the user's row, creating a workspace with them as admin on first login. */
export async function ensureUserWorkspace(authUser: { id: string; email?: string | undefined }) {
  const db = getDb();
  const email = authUser.email;
  if (!email) throw new Error("Auth user has no email");

  return db.transaction(async (tx) => {
    const [existing] = await tx
      .select({ user: users, workspace: workspaces })
      .from(users)
      .innerJoin(workspaces, eq(users.workspaceId, workspaces.id))
      .where(eq(users.id, authUser.id));
    if (existing) return existing;

    const [workspace] = await tx
      .insert(workspaces)
      .values({ name: `${email.split("@")[0]} workspace` })
      .returning();
    if (!workspace) throw new Error("Failed to create workspace");
    const [user] = await tx
      .insert(users)
      .values({ id: authUser.id, workspaceId: workspace.id, email, role: "admin" })
      .returning();
    if (!user) throw new Error("Failed to create user");
    return { user, workspace };
  });
}
