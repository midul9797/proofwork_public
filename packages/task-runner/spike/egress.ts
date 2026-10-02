// Can we allow only the npm registry? Probes registry.npmjs.org and example.com.
import { Sandbox } from "e2b";
import { Daytona, Image } from "@daytona/sdk";
import { IMAGE, loadEnv } from "./common";

loadEnv();
const PROBE =
  "for u in https://registry.npmjs.org/left-pad https://example.com https://api.github.com; do " +
  "echo \"$u -> $(curl -s -o /dev/null -m 8 -w '%{http_code}' $u)\"; done";

// E2B: hostname allowlist
const e2b = await Sandbox.create("proofwork-playwright-spike", {
  network: { denyOut: ({ allTraffic }) => [allTraffic], allowOut: ["registry.npmjs.org"] },
  timeoutMs: 120_000,
});
try {
  console.log("E2B allowOut=[registry.npmjs.org]\n" + (await e2b.commands.run(PROBE)).stdout);
} finally {
  await e2b.kill();
}

// Daytona: default policy (no network options)
const daytona = new Daytona();
const d = await daytona.create(
  { image: Image.base(IMAGE), resources: { cpu: 2, memory: 4, disk: 10 } },
  { timeout: 300 },
);
try {
  console.log("Daytona default\n" + (await d.process.executeCommand(PROBE)).result);
} finally {
  await d.delete();
}
