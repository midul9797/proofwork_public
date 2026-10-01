import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { fileURLToPath } from "node:url";
import pg from "pg";

// Usage: pnpm --filter @proofwork/db migrate <dev|prod>
// Connection strings come from env vars (a local .env file is loaded if present).
const VARS = { dev: "SUPABASE_DEV_SESSION_POOLER", prod: "SUPABASE_PROD_SESSION_POOLER" } as const;

try {
  process.loadEnvFile(new URL("../../../.env", import.meta.url));
} catch {
  // No .env file (e.g. in CI): rely on real environment variables.
}

const target = process.argv[2];
if (target !== "dev" && target !== "prod") {
  console.error("Usage: migrate <dev|prod>");
  process.exit(1);
}

const url = process.env[VARS[target]];
if (!url) {
  console.error(`Missing env var ${VARS[target]}`);
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: url, ssl: { rejectUnauthorized: false }, max: 1 });
try {
  await migrate(drizzle(pool), {
    migrationsFolder: fileURLToPath(new URL("../drizzle", import.meta.url)),
  });
  console.log(`Migrations applied to ${target}`);
} finally {
  await pool.end();
}
