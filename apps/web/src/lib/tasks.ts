import { desc, getDb, tasks, type Task } from "@proofwork/db";

/** The newest version of each task, for the task picker. */
export async function listLatestTasks(): Promise<Task[]> {
  const rows = await getDb().select().from(tasks).orderBy(tasks.slug, desc(tasks.version));
  const latest = new Map<string, Task>();
  for (const row of rows) if (!latest.has(row.slug)) latest.set(row.slug, row);
  return [...latest.values()];
}
