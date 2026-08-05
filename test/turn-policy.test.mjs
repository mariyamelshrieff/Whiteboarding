import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const { consecutiveCandidateTurns, shouldForceFollowUp, nextUnaddressedEdgeCase } = require("../turn-policy.js");

test("never permits two consecutive candidate turns without a follow-up", () => {
  const transcript = [
    { role: "interviewer", text: "Tell me more." },
    { role: "candidate", text: "First I map the flow." },
    { role: "candidate", text: "Then I sketch the incident detail." }
  ];
  assert.equal(consecutiveCandidateTurns(transcript), 2);
  assert.equal(shouldForceFollowUp({ text: transcript.at(-1).text, phaseId: "flow", transcript }), true);
});

test("always probes a walkthrough or trade-off turn", () => {
  const transcript = [{ role: "candidate", text: "My trade-off is faster containment at the cost of more false positives." }];
  assert.equal(shouldForceFollowUp({ text: transcript[0].text, phaseId: "sketch", transcript }), true);
});

test("chooses an unaddressed resilience edge case", () => {
  const edgeCase = nextUnaddressedEdgeCase({
    boardSummary: "The design covers concurrent incidents and missing telemetry.",
    transcript: []
  });
  assert.equal(edgeCase.id, "permissions");
  assert.match(edgeCase.probe, /permission/i);
});

test("never repeats an edge-case probe the interviewer already asked", () => {
  const transcript = [
    { role: "interviewer", text: "How does the flow handle multiple events happening at the same time?" },
    { role: "candidate", text: "I would queue and prioritize them." }
  ];
  const edgeCase = nextUnaddressedEdgeCase({ boardSummary: "", transcript });
  assert.notEqual(edgeCase?.id, "concurrent-incidents");
});

test("returns no probe after every edge case has been asked or addressed", () => {
  const transcript = [
    { role: "interviewer", text: "How do concurrent events work with missing telemetry and permissions?" }
  ];
  assert.equal(nextUnaddressedEdgeCase({ boardSummary: "", transcript }), null);
});

test("uses AI-explanation edge cases instead of incident probes", () => {
  const first = nextUnaddressedEdgeCase({ boardSummary: "", transcript: [], scenarioId: "ai-explanations" });
  assert.equal(first.id, "conflicting-suggestions");
  assert.match(first.probe, /AI suggestions conflict/i);
  const second = nextUnaddressedEdgeCase({
    boardSummary: "",
    scenarioId: "ai-explanations",
    transcript: [{ role: "interviewer", text: first.probe }]
  });
  assert.equal(second.id, "missing-evidence");
});
