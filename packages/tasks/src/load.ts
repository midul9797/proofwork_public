import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { parseTaskYaml, type TaskConfig } from "@proofwork/shared";

export interface TaskFile {
  /** Path relative to the task folder, always with forward slashes. */
  path: string;
  content: Buffer;
}

export interface LoadedTask {
  slug: string;
  config: TaskConfig;
  briefMd: string;
  /** Files from repo/, with the `repo/` prefix removed. These are what a candidate's sandbox gets. */
  repoFiles: TaskFile[];
  /** Hash of every file in the task folder, including hidden/ and traps/. */
  contentHash: string;
}

const IGNORED = new Set(["node_modules", "test-results", "playwright-report", ".DS_Store"]);

/** Text files get LF line endings so the same task hashes the same on Windows and Linux. */
function normalise(content: Buffer): Buffer {
  if (content.includes(0)) return content;
  return Buffer.from(content.toString("utf8").replaceAll("\r\n", "\n"), "utf8");
}

export function readFiles(dir: string): TaskFile[] {
  const files: TaskFile[] = [];
  const walk = (current: string) => {
    for (const name of readdirSync(current).sort()) {
      if (IGNORED.has(name)) continue;
      const full = join(current, name);
      if (statSync(full).isDirectory()) walk(full);
      else {
        files.push({
          path: relative(dir, full).replaceAll("\\", "/"),
          content: normalise(readFileSync(full)),
        });
      }
    }
  };
  walk(dir);
  return files.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
}

export function hashFiles(files: TaskFile[]): string {
  const hash = createHash("sha256");
  for (const file of files) {
    hash.update(file.path);
    hash.update("\0");
    hash.update(createHash("sha256").update(file.content).digest());
  }
  return hash.digest("hex");
}

/** Reads and validates one task folder. Throws with a message that names the folder. */
export function loadTask(taskDir: string, folderName: string): LoadedTask {
  const fail = (message: string): never => {
    throw new Error(`tasks/${folderName}: ${message}`);
  };

  const all = readFiles(taskDir);
  const yaml = all.find((file) => file.path === "task.yaml");
  if (!yaml) return fail("task.yaml is missing");
  let config: TaskConfig;
  try {
    config = parseTaskYaml(yaml.content.toString("utf8"));
  } catch (error) {
    return fail((error as Error).message);
  }
  if (config.slug !== folderName) {
    fail(`slug "${config.slug}" must match the folder name`);
  }

  const brief = all.find((file) => file.path === "brief.md");
  if (!brief) return fail("brief.md is missing");

  const repoFiles = all
    .filter((file) => file.path.startsWith("repo/"))
    .map((file) => ({ path: file.path.slice("repo/".length), content: file.content }));
  if (repoFiles.length === 0) fail("repo/ is empty");

  // Everything the candidate can see must exist in repo/.
  for (const pattern of config.files.readOnly) {
    if (!repoFiles.some((file) => file.path === pattern) && !pattern.includes("*")) {
      fail(`files.readOnly lists "${pattern}", which is not in repo/`);
    }
  }

  return {
    slug: config.slug,
    config,
    briefMd: brief.content.toString("utf8"),
    repoFiles,
    contentHash: hashFiles(all),
  };
}

/** Loads every folder in `tasksRoot` that contains a task.yaml. */
export function loadAllTasks(tasksRoot: string): LoadedTask[] {
  if (!existsSync(tasksRoot)) return [];
  return readdirSync(tasksRoot)
    .filter((name) => statSync(join(tasksRoot, name)).isDirectory())
    .filter((name) => existsSync(join(tasksRoot, name, "task.yaml")))
    .sort()
    .map((name) => loadTask(join(tasksRoot, name), name));
}
