import { createClient } from "@supabase/supabase-js";
import { desc, eq, getDb, tasks } from "@proofwork/db";
import type { NewTaskVersion, SyncStore } from "./sync";

/** Private bucket holding the candidate-visible files of every task version. */
export const TASK_FILES_BUCKET = "task-files";

export async function createSupabaseSyncStore(options: {
  supabaseUrl: string;
  serviceRoleKey: string;
}): Promise<SyncStore> {
  const supabase = createClient(options.supabaseUrl, options.serviceRoleKey, {
    auth: { persistSession: false },
  });
  const db = getDb();

  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw new Error(`Cannot reach Supabase Storage: ${listError.message}`);
  if (!buckets.some((bucket) => bucket.name === TASK_FILES_BUCKET)) {
    const { error } = await supabase.storage.createBucket(TASK_FILES_BUCKET, { public: false });
    if (error) throw new Error(`Cannot create bucket ${TASK_FILES_BUCKET}: ${error.message}`);
  }

  return {
    async latestVersion(slug) {
      const [row] = await db
        .select({ version: tasks.version, contentHash: tasks.contentHash })
        .from(tasks)
        .where(eq(tasks.slug, slug))
        .orderBy(desc(tasks.version))
        .limit(1);
      return row;
    },

    async uploadFiles(prefix, files) {
      for (const file of files) {
        const { error } = await supabase.storage
          .from(TASK_FILES_BUCKET)
          .upload(`${prefix}/${file.path}`, file.content, {
            upsert: true,
            contentType: "application/octet-stream",
          });
        if (error) throw new Error(`Upload of ${prefix}/${file.path} failed: ${error.message}`);
      }
    },

    async insertVersion(row: NewTaskVersion) {
      await db.insert(tasks).values(row);
    },
  };
}
