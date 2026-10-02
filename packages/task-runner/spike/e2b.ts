import { CommandExitError, Sandbox, Template, defaultBuildLogger } from "e2b";
import { IMAGE, REMOTE_DIR, TEST_CMD, Timer, fixtureFiles, loadEnv, saveResult } from "./common";

loadEnv();
const NAME = "proofwork-playwright-spike";
const timer = new Timer();
const result: Record<string, unknown> = { provider: "e2b", image: IMAGE };

async function run(sbx: Sandbox, cmd: string, label: string) {
  let firstOutputMs: number | undefined;
  const t0 = performance.now();
  let out = "";
  const onData = (d: string) => {
    firstOutputMs ??= Math.round(performance.now() - t0);
    out += d;
    process.stdout.write(d);
  };
  let exitCode = 0;
  await timer.time(label, async () => {
    try {
      const r = await sbx.commands.run(cmd, {
        cwd: REMOTE_DIR,
        onStdout: onData,
        onStderr: onData,
        timeoutMs: 5 * 60_000,
      });
      exitCode = r.exitCode;
    } catch (e) {
      if (e instanceof CommandExitError) exitCode = e.exitCode;
      else throw e;
    }
  });
  return { exitCode, firstOutputMs, out };
}

// 1. Template (custom image). Cached after the first build.
const exists = await Template.exists(NAME);
result.templateAlreadyExisted = exists;
if (!exists) {
  await timer.time("templateBuild", async () => {
    await Template.build(Template().fromImage(IMAGE), NAME, {
      cpuCount: 2,
      memoryMB: 4096,
      onBuildLogs: defaultBuildLogger({ minLevel: "warn" }),
    });
  });
}

// 2. Main run
let sbx: Sandbox | undefined;
try {
  sbx = await timer.time("create", () => Sandbox.create(NAME, { timeoutMs: 15 * 60_000 }));
  result.sandboxId = sbx.sandboxId;
  await timer.time("upload", async () => {
    await sbx!.files.write(
      fixtureFiles().map((f) => ({ path: `${REMOTE_DIR}/${f.path}`, data: f.content })),
    );
  });
  const install = await run(sbx, "npm install --no-audit --no-fund", "npmInstall");
  const tests = await run(sbx, TEST_CMD, "playwrightRun");
  result.installExit = install.exitCode;
  result.testExit = tests.exitCode;
  result.testFirstOutputMs = tests.firstOutputMs;
  result.testSummary = tests.out.match(/\d+ (passed|failed)[^\n]*/g);

  // Egress probe on the same sandbox: can it reach the open internet?
  const net = await run(
    sbx,
    "curl -s -o /dev/null -m 8 -w '%{http_code}' https://example.com",
    "egressProbe",
  );
  result.egressOpenByDefault = net.out.includes("200");
} finally {
  if (sbx) await timer.time("destroy", () => sbx!.kill());
}

// 3. Egress controls: a sandbox created with the internet disabled.
let locked: Sandbox | undefined;
try {
  locked = await Sandbox.create(NAME, { allowInternetAccess: false, timeoutMs: 5 * 60_000 });
  const r = await locked.commands
    .run("curl -s -o /dev/null -m 8 -w '%{http_code}' https://example.com", { timeoutMs: 20_000 })
    .then((x) => x.stdout)
    .catch(() => "blocked");
  result.egressBlockedWhenDisabled = r !== "200";
  result.lockedProbeOutput = r;
} finally {
  if (locked) await locked.kill();
}

result.timingsMs = timer.steps;
console.log("\n", JSON.stringify(result, null, 2));
saveResult("e2b", result);
