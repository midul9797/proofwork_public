import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import { DaytonaProvider, PLAYWRIGHT_IMAGE, type Sandbox } from "./index";

try {
  process.loadEnvFile(new URL("../../../.env", import.meta.url));
} catch {
  // No .env file (e.g. in CI): rely on real environment variables.
}

// Talks to a real Daytona sandbox, so it only runs when a key is available.
const skip = process.env.DAYTONA_API_KEY ? false : "DAYTONA_API_KEY is not set";

describe("DaytonaProvider", { skip }, () => {
  let sandbox: Sandbox;

  before(async () => {
    sandbox = await new DaytonaProvider().create({ image: PLAYWRIGHT_IMAGE });
  });

  after(async () => {
    await sandbox?.destroy();
  });

  test("returns the exit code of a failing command", async () => {
    const result = await sandbox.run("echo out; echo err 1>&2; exit 3");
    assert.equal(result.exitCode, 3);
    assert.equal(result.timedOut, false);
    assert.match(result.output, /out/);
    assert.match(result.output, /err/);
  });

  test("returns 0 for a passing command", async () => {
    assert.equal((await sandbox.run("true")).exitCode, 0);
  });

  test("streams output while the command runs", async () => {
    const chunks: string[] = [];
    await sandbox.run("echo first; sleep 1; echo second", { onOutput: (c) => chunks.push(c) });
    const joined = chunks.join("");
    assert.match(joined, /first/);
    assert.match(joined, /second/);
  });

  test("writes files and runs in a directory with env vars", async () => {
    await sandbox.writeFiles([{ path: "demo/hello.txt", content: "it's working" }]);
    const result = await sandbox.run("cat hello.txt; echo $GREETING", {
      cwd: "demo",
      env: { GREETING: "hi there" },
    });
    assert.equal(result.exitCode, 0);
    assert.match(result.output, /it's working/);
    assert.match(result.output, /hi there/);
  });

  test("stops a command that runs too long", async () => {
    const result = await sandbox.run("sleep 30", { timeoutMs: 2000 });
    assert.equal(result.timedOut, true);
    assert.equal(result.exitCode, 124);
  });
});
