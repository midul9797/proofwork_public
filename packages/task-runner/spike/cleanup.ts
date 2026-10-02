// Deletes every sandbox in the Daytona account (spike leftovers).
import { Daytona } from "@daytona/sdk";
import { loadEnv } from "./common";

loadEnv();
const daytona = new Daytona();
let count = 0;
for await (const sandbox of daytona.list()) {
  await sandbox.delete();
  count++;
  console.log("deleted", sandbox.id);
}
console.log(`deleted ${count} sandbox(es)`);
