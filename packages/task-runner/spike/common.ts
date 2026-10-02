import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

export const PLAYWRIGHT_VERSION = "1.63.0";
export const IMAGE = `mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-noble`;
export const REMOTE_DIR = "/tmp/repo";
// Run a normal Playwright suite. One test fails on purpose, so exit code 1 is expected.
export const TEST_CMD = "PLAYWRIGHT_BROWSERS_PATH=/ms-playwright npx playwright test";

const here = fileURLToPath(new URL(".", import.meta.url));

export function loadEnv() {
  try {
    process.loadEnvFile(join(here, "../../../.env"));
  } catch {
    // rely on real environment
  }
}

export function fixtureFiles(): { path: string; content: string }[] {
  const root = join(here, "fixture");
  const out: { path: string; content: string }[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else
        out.push({
          path: relative(root, full).replaceAll("\\", "/"),
          content: readFileSync(full, "utf8"),
        });
    }
  };
  walk(root);
  return out;
}

export class Timer {
  steps: Record<string, number> = {};
  async time<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const t = performance.now();
    try {
      return await fn();
    } finally {
      this.steps[name] = Math.round(performance.now() - t);
    }
  }
}

export function saveResult(provider: string, data: unknown) {
  const dir = join(here, "results");
  mkdirSync(dir, { recursive: true });
  const file = join(dir, `${provider}-${Date.now()}.json`);
  writeFileSync(file, JSON.stringify(data, null, 2));
  console.log(`\nSaved ${relative(process.cwd(), file)}`);
}
