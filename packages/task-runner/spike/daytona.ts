import { Daytona, Image, type Sandbox } from "@daytona/sdk";
import { IMAGE, REMOTE_DIR, TEST_CMD, Timer, fixtureFiles, loadEnv, saveResult } from "./common";

loadEnv();
const daytona = new Daytona(); // reads DAYTONA_API_KEY
const timer = new Timer();
const result: Record<string, unknown> = { provider: "daytona", image: IMAGE };

async function run(sbx: Sandbox, cmd: string, label: string) {
  let firstOutputMs: number | undefined;
  const t0 = performance.now();
  let out = "";
  const onData = (d: string) => {
    firstOutputMs ??= Math.round(performance.now() - t0);
    out += d;
    process.stdout.write(d);
  };
  const sessionId = `s-${label}-${Date.now()}`;
  let exitCode = -1;
  await timer.time(label, async () => {
    await sbx.process.createSession(sessionId);
    const started = await sbx.process.executeSessionCommand(sessionId, {
      command: `cd ${REMOTE_DIR} && ${cmd}`,
      runAsync: true,
    });
    await sbx.process.getSessionCommandLogs(sessionId, started.cmdId!, onData, onData);
    // Logs stream until the command ends; then read the exit code.
    for (let i = 0; i < 20; i++) {
      const c = await sbx.process.getSessionCommand(sessionId, started.cmdId!);
      if (c.exitCode !== undefined && c.exitCode !== null) {
        exitCode = c.exitCode;
        break;
      }
      await new Promise((r) => setTimeout(r, 250));
    }
  });
  return { exitCode, firstOutputMs, out };
}

async function createSandbox(label: string, extra: Record<string, unknown> = {}) {
  return timer.time(label, () =>
    daytona.create(
      {
        image: Image.base(IMAGE),
        resources: { cpu: 2, memory: 4, disk: 10 },
        autoStopInterval: 15,
        ...extra,
      },
      { timeout: 600, onSnapshotCreateLogs: (l) => process.stdout.write(`[build] ${l}\n`) },
    ),
  );
}

let sbx: Sandbox | undefined;
try {
  // First create builds and caches the image; the second shows the steady-state cold start.
  const warmup = await createSandbox("createFirst_includesImageBuild");
  await timer.time("destroyFirst", () => warmup.delete());
  sbx = await createSandbox("create");
  result.sandboxId = sbx.id;

  await timer.time("upload", () =>
    sbx!.fs.uploadFiles(
      fixtureFiles().map((f) => ({
        source: Buffer.from(f.content),
        destination: `${REMOTE_DIR}/${f.path}`,
      })),
    ),
  );
  const install = await run(sbx, "npm install --no-audit --no-fund", "npmInstall");
  const tests = await run(sbx, TEST_CMD, "playwrightRun");
  result.installExit = install.exitCode;
  result.testExit = tests.exitCode;
  result.testFirstOutputMs = tests.firstOutputMs;
  result.testSummary = tests.out.match(/\d+ (passed|failed)[^\n]*/g);

  const net = await run(
    sbx,
    "curl -s -o /dev/null -m 8 -w '%{http_code}' https://example.com",
    "egressProbe",
  );
  result.egressOpenByDefault = net.out.includes("200");
} finally {
  if (sbx) await timer.time("destroy", () => sbx!.delete());
}

// Egress controls: block all network at creation.
let locked: Sandbox | undefined;
try {
  locked = await createSandbox("createLocked", { networkBlockAll: true });
  const r = await locked.process.executeCommand(
    "curl -s -o /dev/null -m 8 -w '%{http_code}' https://example.com || echo blocked",
  );
  result.egressBlockedWhenDisabled = !r.result.includes("200");
  result.lockedProbeOutput = r.result.trim();
} finally {
  if (locked) await locked.delete();
}

result.timingsMs = timer.steps;
console.log("\n", JSON.stringify(result, null, 2));
saveResult("daytona", result);
