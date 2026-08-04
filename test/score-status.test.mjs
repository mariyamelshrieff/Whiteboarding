import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const { scoreStatus } = require("../score-status.js");

test("derives the evaluation chip from the criterion score", () => {
  assert.deepEqual(scoreStatus(1), { kind: "needs-work", label: "Needs work" });
  assert.deepEqual(scoreStatus(2), { kind: "needs-work", label: "Needs work" });
  assert.deepEqual(scoreStatus(3), { kind: "improve", label: "Could improve" });
  assert.deepEqual(scoreStatus(4), { kind: "good", label: "Went well" });
  assert.deepEqual(scoreStatus(5), { kind: "strong", label: "Strong" });
});

test("a 5/5 criterion can never render Could improve", () => {
  const status = scoreStatus(5);
  assert.equal(status.label, "Strong");
  assert.notEqual(status.label, "Could improve");
});
