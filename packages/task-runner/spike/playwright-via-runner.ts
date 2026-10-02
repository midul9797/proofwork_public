// Runs the fixture Playwright suite through the task-runner package (the week 1 deliverable).
import { DaytonaProvider, PLAYWRIGHT_IMAGE } from "../src/index";
import { fixtureFiles, loadEnv } from "./common";

loadEnv();
const t0 = performance.now();
const stamp = () => `[${((performance.now() - t0) / 1000).toFixed(1)}s]`;

const sandbox = await new DaytonaProvider().create({ image: PLAYWRIGHT_IMAGE });
console.log(stamp(), "sandbox ready", sandbox.id);
try {
  await sandbox.writeFiles(
    fixtureFiles().map((f) => ({ path: `repo/${f.path}`, content: f.content })),
  );
  const install = await sandbox.run("npm install --no-audit --no-fund", { cwd: "repo" });
  console.log(stamp(), "npm install exit", install.exitCode);
  const tests = await sandbox.run("npx playwright test", {
    cwd: "repo",
    env: { PLAYWRIGHT_BROWSERS_PATH: "/ms-playwright" },
    onOutput: (chunk) => process.stdout.write(chunk),
  });
  console.log(
    stamp(),
    "playwright exit",
    tests.exitCode,
    "(1 expected: one test fails on purpose)",
  );
} finally {
  await sandbox.destroy();
  console.log(stamp(), "sandbox destroyed");
}
