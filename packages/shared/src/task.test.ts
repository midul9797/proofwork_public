import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, test } from "node:test";
import { parse, stringify } from "yaml";
import { parseTaskYaml, TaskConfigError } from "./task";

const sampleText = readFileSync(
  new URL("../../../tasks/checkout-regression/task.yaml", import.meta.url),
  "utf8",
);

/** Returns the sample task as text after applying `change` to its parsed form. */
function variant(change: (task: Record<string, unknown>) => void) {
  const task = parse(sampleText) as Record<string, unknown>;
  change(task);
  return stringify(task);
}

function assertRejects(text: string, expected: RegExp) {
  assert.throws(
    () => parseTaskYaml(text),
    (error) => error instanceof TaskConfigError && expected.test(error.message),
  );
}

describe("parseTaskYaml", () => {
  test("accepts the checkout-regression sample", () => {
    const task = parseTaskYaml(sampleText);
    assert.equal(task.slug, "checkout-regression");
    assert.equal(task.durationMinutes, 60);
    assert.equal(task.run.testCommand, "npx playwright test");
    assert.deepEqual(task.traps, []);
    assert.deepEqual(task.files.readOnly, ["package.json", "playwright.config.ts"]);
  });

  test("fills in defaults", () => {
    const task = parseTaskYaml(
      variant((t) => {
        delete t.image;
        delete (t.run as Record<string, unknown>).workdir;
        delete (t.run as Record<string, unknown>).testTimeoutSeconds;
        delete (t.files as Record<string, unknown>).readOnly;
        delete t.traps;
      }),
    );
    assert.match(task.image, /playwright/);
    assert.equal(task.run.workdir, "repo");
    assert.equal(task.run.testTimeoutSeconds, 120);
    assert.deepEqual(task.files.readOnly, []);
    assert.deepEqual(task.traps, []);
  });

  test("rejects a slug that is not kebab-case", () => {
    assertRejects(
      variant((t) => (t.slug = "Checkout Regression")),
      /slug/,
    );
  });

  test("rejects rubric weights that do not add up to 100", () => {
    assertRejects(
      variant((t) => ((t.rubric as Record<string, number>).diagnosis = 30)),
      /add up to 105, expected 100/,
    );
  });

  test("rejects a missing run command", () => {
    assertRejects(
      variant((t) => delete (t.run as Record<string, unknown>).testCommand),
      /testCommand/,
    );
  });

  test("rejects a duration outside 15 to 240 minutes", () => {
    assertRejects(
      variant((t) => (t.durationMinutes = 5)),
      /durationMinutes/,
    );
  });

  test("rejects traps until week 5 defines their format", () => {
    assertRejects(
      variant((t) => (t.traps = [{ id: "x" }])),
      /traps/,
    );
  });

  test("rejects an empty visible file list", () => {
    assertRejects(
      variant((t) => ((t.files as Record<string, unknown>).visible = [])),
      /visible/,
    );
  });

  test("reports invalid YAML clearly", () => {
    assertRejects("slug: [unclosed", /not valid YAML/);
  });
});
