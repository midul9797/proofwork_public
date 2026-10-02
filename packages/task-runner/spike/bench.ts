// Repeats create -> upload -> install -> test -> destroy to see timing variance.
// Usage: tsx spike/bench.ts <e2b|daytona> [runs]
import { CommandExitError, Sandbox } from "e2b";
import { Daytona, Image } from "@daytona/sdk";
import { IMAGE, REMOTE_DIR, TEST_CMD, fixtureFiles, loadEnv } from "./common";

loadEnv();
const provider = process.argv[2];
const runs = Number(process.argv[3] ?? 3);
const files = fixtureFiles();
const ms = (t: number) => Math.round(performance.now() - t);

async function e2bOnce() {
  const s: Record<string, number> = {};
  let t = performance.now();
  const sbx = await Sandbox.create("proofwork-playwright-spike", { timeoutMs: 600_000 });
  s.create = ms(t);
  try {
    t = performance.now();
    await sbx.files.write(files.map((f) => ({ path: `${REMOTE_DIR}/${f.path}`, data: f.content })));
    s.upload = ms(t);
    const run = async (cmd: string) => {
      try {
        return (await sbx.commands.run(cmd, { cwd: REMOTE_DIR, timeoutMs: 300_000 })).exitCode;
      } catch (e) {
        if (e instanceof CommandExitError) return e.exitCode;
        throw e;
      }
    };
    t = performance.now();
    await run("npm install --no-audit --no-fund");
    s.install = ms(t);
    t = performance.now();
    s.testExit = await run(TEST_CMD);
    s.test = ms(t);
  } finally {
    t = performance.now();
    await sbx.kill();
    s.destroy = ms(t);
  }
  return s;
}

async function daytonaOnce(daytona: Daytona) {
  const s: Record<string, number> = {};
  let t = performance.now();
  const sbx = await daytona.create(
    { image: Image.base(IMAGE), resources: { cpu: 2, memory: 4, disk: 10 } },
    { timeout: 600 },
  );
  s.create = ms(t);
  try {
    t = performance.now();
    await sbx.fs.uploadFiles(
      files.map((f) => ({
        source: Buffer.from(f.content),
        destination: `${REMOTE_DIR}/${f.path}`,
      })),
    );
    s.upload = ms(t);
    t = performance.now();
    await sbx.process.executeCommand(
      "npm install --no-audit --no-fund",
      REMOTE_DIR,
      undefined,
      300,
    );
    s.install = ms(t);
    t = performance.now();
    s.testExit = (await sbx.process.executeCommand(TEST_CMD, REMOTE_DIR, undefined, 300)).exitCode;
    s.test = ms(t);
  } finally {
    t = performance.now();
    await sbx.delete();
    s.destroy = ms(t);
  }
  return s;
}

const daytona = provider === "daytona" ? new Daytona() : undefined;
const rows: Record<string, number>[] = [];
for (let i = 0; i < runs; i++) {
  const row = provider === "e2b" ? await e2bOnce() : await daytonaOnce(daytona!);
  rows.push(row);
  console.log(provider, i + 1, JSON.stringify(row));
}
const keys = Object.keys(rows[0]!).filter((k) => k !== "testExit");
for (const k of keys) {
  const v = rows.map((r) => r[k]!).sort((a, b) => a - b);
  console.log(
    `${provider} ${k}: median ${v[Math.floor(v.length / 2)]} ms, min ${v[0]}, max ${v.at(-1)}`,
  );
}
