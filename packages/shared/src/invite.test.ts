import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { checkDeadline, inviteInputSchema } from "./invite";

const valid = {
  taskId: "6f1c2f3e-3c4d-4a5b-8c9d-0e1f2a3b4c5d",
  candidateName: "  Asha Rahman ",
  candidateEmail: "  Asha@Example.COM ",
  deadline: "2026-10-20T12:00:00.000Z",
};

describe("inviteInputSchema", () => {
  test("accepts valid input and tidies name and email", () => {
    const parsed = inviteInputSchema.parse(valid);
    assert.equal(parsed.candidateName, "Asha Rahman");
    assert.equal(parsed.candidateEmail, "asha@example.com");
  });

  test("rejects a bad email", () => {
    const result = inviteInputSchema.safeParse({ ...valid, candidateEmail: "not-an-email" });
    assert.equal(result.success, false);
  });

  test("rejects a missing name and a bad task id", () => {
    assert.equal(inviteInputSchema.safeParse({ ...valid, candidateName: " " }).success, false);
    assert.equal(inviteInputSchema.safeParse({ ...valid, taskId: "abc" }).success, false);
  });

  test("rejects a deadline that is not an ISO timestamp", () => {
    assert.equal(inviteInputSchema.safeParse({ ...valid, deadline: "next friday" }).success, false);
    assert.equal(inviteInputSchema.safeParse({ ...valid, deadline: "" }).success, false);
  });
});

describe("checkDeadline", () => {
  const now = new Date("2026-10-03T00:00:00.000Z");
  const hours = (n: number) => new Date(now.getTime() + n * 3_600_000);

  test("accepts a deadline a few days away", () => {
    assert.equal(checkDeadline(hours(72), now), null);
  });

  test("rejects a deadline in the past or less than an hour away", () => {
    assert.match(checkDeadline(hours(-5), now) ?? "", /at least 1 hour/);
    assert.match(checkDeadline(hours(0.5), now) ?? "", /at least 1 hour/);
  });

  test("rejects a deadline more than 90 days away", () => {
    assert.match(checkDeadline(hours(24 * 91), now) ?? "", /at most 90 days/);
  });
});
