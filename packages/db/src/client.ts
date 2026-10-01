import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as { pool?: pg.Pool };

export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  globalForDb.pool ??= new pg.Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    max: 5,
  });
  return drizzle(globalForDb.pool, { schema });
}
