import type { LoadedTask, TaskFile } from "./load";

/** What sync needs from the outside world. Real implementations are in supabase.ts. */
export interface SyncStore {
  /** The newest stored version of a slug, if any. */
  latestVersion(slug: string): Promise<{ version: number; contentHash: string } | undefined>;
  uploadFiles(prefix: string, files: TaskFile[]): Promise<void>;
  insertVersion(row: NewTaskVersion): Promise<void>;
}

export interface NewTaskVersion {
  slug: string;
  version: number;
  title: string;
  summary: string;
  briefMd: string;
  measures: string[];
  durationMinutes: number;
  config: LoadedTask["config"];
  contentHash: string;
  storagePrefix: string;
}

export type SyncOutcome =
  | { slug: string; action: "unchanged"; version: number }
  | { slug: string; action: "created" | "would-create"; version: number; files: number };

export function storagePrefixFor(slug: string, version: number) {
  return `${slug}/v${version}`;
}

/**
 * Makes the store match the tasks on disk. A task whose content is unchanged is left alone; any
 * change, even to a hidden file, becomes a new version. Old versions are never touched, because
 * sessions already in progress point at them.
 */
export async function syncTasks(
  tasks: LoadedTask[],
  store: SyncStore,
  options: { dryRun?: boolean } = {},
): Promise<SyncOutcome[]> {
  const outcomes: SyncOutcome[] = [];

  for (const task of tasks) {
    const latest = await store.latestVersion(task.slug);
    if (latest && latest.contentHash === task.contentHash) {
      outcomes.push({ slug: task.slug, action: "unchanged", version: latest.version });
      continue;
    }

    const version = (latest?.version ?? 0) + 1;
    if (options.dryRun) {
      outcomes.push({
        slug: task.slug,
        action: "would-create",
        version,
        files: task.repoFiles.length,
      });
      continue;
    }

    // Files first: if the row insert fails, the next run reuses this version number and
    // overwrites the files, so no half-finished version is ever visible.
    const storagePrefix = storagePrefixFor(task.slug, version);
    await store.uploadFiles(storagePrefix, task.repoFiles);
    await store.insertVersion({
      slug: task.slug,
      version,
      title: task.config.title,
      summary: task.config.summary,
      briefMd: task.briefMd,
      measures: task.config.measures,
      durationMinutes: task.config.durationMinutes,
      config: task.config,
      contentHash: task.contentHash,
      storagePrefix,
    });
    outcomes.push({ slug: task.slug, action: "created", version, files: task.repoFiles.length });
  }

  return outcomes;
}
