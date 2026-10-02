import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, test } from "node:test";
import { fileURLToPath } from "node:url";
import { loadAllTasks, loadTask, type LoadedTask } from "./load";
import { syncTasks, type NewTaskVersion, type SyncStore } from "./sync";

const realTasks = fileURLToPath(new URL("../../../tasks", import.meta.url));

let root: string;
let taskDir: string;

before(() => {
  root = mkdtempSync(join(tmpdir(), "proofwork-tasks-"));
  taskDir = join(root, "checkout-regression");
  cpSync(join(realTasks, "checkout-regression"), taskDir, { recursive: true });
});
after(() => rmSync(root, { recursive: true, force: true }));

class FakeStore implements SyncStore {
  rows: NewTaskVersion[] = [];
  uploads: { prefix: string; paths: string[] }[] = [];
  async latestVersion(slug: string) {
    return this.rows
      .filter((row) => row.slug === slug)
      .sort((a, b) => b.version - a.version)
      .map((row) => ({ version: row.version, contentHash: row.contentHash }))[0];
  }
  async uploadFiles(prefix: string, files: { path: string }[]) {
    this.uploads.push({ prefix, paths: files.map((file) => file.path) });
  }
  async insertVersion(row: NewTaskVersion) {
    this.rows.push(row);
  }
}

describe("loadTask", () => {
  test("loads the checkout-regression task", () => {
    const task = loadTask(taskDir, "checkout-regression");
    assert.equal(task.config.title, "Checkout regression");
    assert.match(task.briefMd, /^# Checkout regression/);
    assert.ok(task.repoFiles.some((file) => file.path === "src/cart.js"));
    assert.ok(task.repoFiles.some((file) => file.path === "package-lock.json"));
  });

  test("never includes hidden files in the candidate files", () => {
    const task = loadTask(taskDir, "checkout-regression");
    for (const file of task.repoFiles) {
      assert.ok(!file.path.startsWith("hidden/"), file.path);
      assert.ok(!file.path.includes("discount-recalc"), file.path);
      assert.ok(!file.path.includes("solution"), file.path);
    }
  });

  test("hash ignores line-ending differences but notices content changes", () => {
    const before = loadTask(taskDir, "checkout-regression").contentHash;
    const cart = join(taskDir, "repo", "src", "cart.js");
    const original = readFileSync(cart, "utf8");

    writeFileSync(cart, original.replaceAll("\n", "\r\n"));
    assert.equal(loadTask(taskDir, "checkout-regression").contentHash, before);

    writeFileSync(cart, original + "// changed\n");
    assert.notEqual(loadTask(taskDir, "checkout-regression").contentHash, before);
    writeFileSync(cart, original);
  });

  test("a change to a hidden file also changes the hash", () => {
    const before = loadTask(taskDir, "checkout-regression").contentHash;
    const hidden = join(taskDir, "hidden", "tests", "discount-recalc.spec.ts");
    const original = readFileSync(hidden, "utf8");
    writeFileSync(hidden, original + "\n// tweak\n");
    assert.notEqual(loadTask(taskDir, "checkout-regression").contentHash, before);
    writeFileSync(hidden, original);
  });

  test("rejects a slug that does not match the folder name", () => {
    assert.throws(() => loadTask(taskDir, "other-name"), /must match the folder name/);
  });

  test("names the folder when task.yaml is invalid", () => {
    const yaml = join(taskDir, "task.yaml");
    const original = readFileSync(yaml, "utf8");
    writeFileSync(yaml, original.replace("durationMinutes: 60", "durationMinutes: 1"));
    assert.throws(
      () => loadTask(taskDir, "checkout-regression"),
      /tasks\/checkout-regression:.*durationMinutes/s,
    );
    writeFileSync(yaml, original);
  });

  test("loadAllTasks finds task folders only", () => {
    assert.deepEqual(
      loadAllTasks(root).map((task) => task.slug),
      ["checkout-regression"],
    );
  });
});

describe("syncTasks", () => {
  let task: LoadedTask;
  before(() => {
    task = loadTask(taskDir, "checkout-regression");
  });

  test("creates v1 for a new task and uploads only the repo files", async () => {
    const store = new FakeStore();
    const [outcome] = await syncTasks([task], store);
    assert.deepEqual(outcome, {
      slug: "checkout-regression",
      action: "created",
      version: 1,
      files: task.repoFiles.length,
    });
    assert.equal(store.rows[0]?.storagePrefix, "checkout-regression/v1");
    assert.equal(store.uploads[0]?.prefix, "checkout-regression/v1");
    assert.ok(store.uploads[0]?.paths.every((path) => !path.includes("hidden")));
  });

  test("a second sync of unchanged content does nothing", async () => {
    const store = new FakeStore();
    await syncTasks([task], store);
    const [outcome] = await syncTasks([task], store);
    assert.equal(outcome?.action, "unchanged");
    assert.equal(store.rows.length, 1);
    assert.equal(store.uploads.length, 1);
  });

  test("changed content becomes v2 and v1 stays", async () => {
    const store = new FakeStore();
    await syncTasks([task], store);
    const [outcome] = await syncTasks([{ ...task, contentHash: "different" }], store);
    assert.equal(outcome?.action, "created");
    assert.equal(outcome?.action === "created" && outcome.version, 2);
    assert.deepEqual(
      store.rows.map((row) => row.version),
      [1, 2],
    );
  });

  test("dry run writes nothing", async () => {
    const store = new FakeStore();
    const [outcome] = await syncTasks([task], store, { dryRun: true });
    assert.equal(outcome?.action, "would-create");
    assert.equal(store.rows.length, 0);
    assert.equal(store.uploads.length, 0);
  });
});
