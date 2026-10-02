// Usage: pnpm tasks:sync <dev|prod> [--dry-run]
// Reads tasks/*, validates them, uploads candidate-visible files to storage and records a new
// version in the database for any task whose content changed.
import { fileURLToPath } from "node:url";
import { createSupabaseSyncStore, loadAllTasks, syncTasks } from "../src/index";

try {
  process.loadEnvFile(new URL("../../../.env", import.meta.url));
} catch {
  // No .env file (e.g. in CI): rely on real environment variables.
}

const VARS = {
  dev: {
    database: "SUPABASE_DEV_SESSION_POOLER",
    url: "SUPABASE_DEV_URL",
    key: "SUPABASE_DEV_SERVICE_ROLE_KEY",
  },
  prod: {
    database: "SUPABASE_PROD_SESSION_POOLER",
    url: "SUPABASE_PROD_URL",
    key: "SUPABASE_PROD_SERVICE_ROLE_KEY",
  },
} as const;

const target = process.argv[2];
const dryRun = process.argv.includes("--dry-run");
if (target !== "dev" && target !== "prod") {
  console.error("Usage: tasks:sync <dev|prod> [--dry-run]");
  process.exit(1);
}

const names = VARS[target];
const missing = Object.values(names).filter((name) => !process.env[name]);
if (missing.length > 0) {
  console.error(`Missing env vars: ${missing.join(", ")}`);
  process.exit(1);
}
process.env.DATABASE_URL = process.env[names.database];

const tasksRoot = fileURLToPath(new URL("../../../tasks", import.meta.url));
const tasks = loadAllTasks(tasksRoot);
console.log(
  `Found ${tasks.length} task(s) in tasks/ (target: ${target}${dryRun ? ", dry run" : ""})`,
);

const store = await createSupabaseSyncStore({
  supabaseUrl: process.env[names.url]!,
  serviceRoleKey: process.env[names.key]!,
});

for (const outcome of await syncTasks(tasks, store, { dryRun })) {
  if (outcome.action === "unchanged") {
    console.log(`  ${outcome.slug}: unchanged (v${outcome.version})`);
  } else {
    const verb = outcome.action === "created" ? "created" : "would create";
    console.log(`  ${outcome.slug}: ${verb} v${outcome.version} (${outcome.files} files)`);
  }
}
process.exit(0); // the database pool would otherwise keep the process alive
