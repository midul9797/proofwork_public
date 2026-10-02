// Checks a task behaves as designed, inside a real sandbox:
//   1. repo/ alone: the visible suite passes, quickly.
//   2. repo/ + hidden/tests: the hidden tests catch the planted bug (some fail).
//   3. repo/ + hidden/tests + hidden/solution: everything passes.
// Usage: pnpm --filter @proofwork/task-runner verify-task <slug>
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { parseTaskYaml } from "@proofwork/shared";
import { DaytonaProvider, type SandboxFile } from "../src/index";

try {
  process.loadEnvFile(new URL("../../../.env", import.meta.url));
} catch {
  // rely on real environment
}

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: verify-task <slug>");
  process.exit(1);
}

const taskDir = join(fileURLToPath(new URL("../../../tasks", import.meta.url)), slug);
const SKIP = new Set(["node_modules", "test-results", "playwright-report"]);

function readTree(dir: string, prefix: string, skip = new Set<string>()): SandboxFile[] {
  const files: SandboxFile[] = [];
  const walk = (current: string) => {
    for (const name of readdirSync(current)) {
      if (SKIP.has(name) || (current === dir && skip.has(name))) continue;
      const full = join(current, name);
      if (statSync(full).isDirectory()) walk(full);
      else {
        const path = relative(dir, full).replaceAll("\\", "/");
        files.push({ path: `${prefix}/${path}`, content: readFileSync(full) });
      }
    }
  };
  walk(dir);
  return files;
}

const task = parseTaskYaml(readFileSync(join(taskDir, "task.yaml"), "utf8"));
const workdir = task.run.workdir;
const count = (output: string, word: string) =>
  Number(new RegExp(`(\\d+) ${word}`).exec(output)?.[1] ?? 0);

const failures: string[] = [];
const check = (ok: boolean, message: string) => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${message}`);
  if (!ok) failures.push(message);
};

const sandbox = await new DaytonaProvider().create({ image: task.image });
try {
  await sandbox.writeFiles(readTree(join(taskDir, "repo"), workdir));
  if (task.run.setupCommand) {
    const setup = await sandbox.run(task.run.setupCommand, { cwd: workdir, env: task.run.env });
    check(setup.exitCode === 0, `setup "${task.run.setupCommand}" succeeds`);
  }

  const runTests = async () => {
    const started = performance.now();
    const result = await sandbox.run(task.run.testCommand, {
      cwd: workdir,
      env: task.run.env,
      timeoutMs: task.run.testTimeoutSeconds * 1000,
    });
    const seconds = (performance.now() - started) / 1000;
    return {
      ...result,
      seconds,
      passed: count(result.output, "passed"),
      failed: count(result.output, "failed"),
    };
  };

  const visible = await runTests();
  console.log(
    `\n[1] repo only: ${visible.passed} passed, ${visible.failed} failed in ${visible.seconds.toFixed(1)}s`,
  );
  if (visible.failed > 0) console.log(visible.output);
  check(visible.exitCode === 0 && visible.failed === 0, "visible suite is green on the buggy repo");
  check(visible.passed >= 4 && visible.passed <= 6, "visible suite has 4 to 6 tests");
  check(visible.seconds < 60, "visible suite runs in under 60 s");

  await sandbox.writeFiles(readTree(join(taskDir, "hidden"), workdir, new Set(["solution"])));
  const hidden = await runTests();
  console.log(
    `\n[2] + hidden tests: ${hidden.passed} passed, ${hidden.failed} failed in ${hidden.seconds.toFixed(1)}s`,
  );
  check(hidden.failed >= 1, "hidden tests fail on the buggy repo");
  check(hidden.passed >= visible.passed, "visible tests still pass next to the hidden ones");

  await sandbox.writeFiles(readTree(join(taskDir, "hidden", "solution"), workdir));
  const fixed = await runTests();
  console.log(
    `\n[3] + reference solution: ${fixed.passed} passed, ${fixed.failed} failed in ${fixed.seconds.toFixed(1)}s`,
  );
  if (fixed.failed > 0) console.log(fixed.output);
  check(
    fixed.exitCode === 0 && fixed.failed === 0,
    "everything passes with the reference solution",
  );
} finally {
  await sandbox.destroy();
}

if (failures.length > 0) {
  console.error(`\n${failures.length} check(s) failed`);
  process.exit(1);
}
console.log("\nTask verified.");
