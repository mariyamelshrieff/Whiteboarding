import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const { consecutiveCandidateTurns, shouldForceFollowUp, nextUnaddressedEdgeCase, createQuestionMemory, rememberInterviewerQuestion, rememberCandidateAnswer, selectNextProbe } = require("../turn-policy.js");

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

test("interrupts between turns when the candidate commits to a decision", () => {
  const transcript = [{ role: "candidate", text: "I am choosing an inline explanation as my primary direction." }];
  assert.equal(shouldForceFollowUp({ text: transcript[0].text, phaseId: "flow", transcript }), true);
});

test("pushes back on unsupported certainty without requiring two candidate turns", () => {
  const transcript = [{ role: "candidate", text: "Obviously this is the best option for everyone." }];
  assert.equal(shouldForceFollowUp({ text: transcript[0].text, phaseId: "framing", transcript }), true);
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

test("durably blocks semantic variants of an answered multiple-suggestion probe", () => {
  let memory = createQuestionMemory();
  memory = rememberInterviewerQuestion(memory, "How does the design behave when different AI suggestions happen at the same time?", "ai-explanations");
  memory = rememberCandidateAnswer(memory, "I group concurrent suggestions, show their conflicts, and let the user resolve one before accepting another.", "ai-explanations");
  assert.ok(memory.askedProbeIds.includes("failure-conflicting-suggestions"));
  assert.ok(memory.coveredTopicIds.includes("failure-conflicting-suggestions"));
  assert.notEqual(selectNextProbe({ scenarioId: "ai-explanations", activeStepId: "edge-cases", memory })?.id, "failure-conflicting-suggestions");
});

test("permits a probe revisit only when the prior answer was incomplete", () => {
  let memory = createQuestionMemory();
  memory = rememberInterviewerQuestion(memory, "What happens when two AI suggestions conflict?", "ai-explanations");
  memory = rememberCandidateAnswer(memory, "Not sure yet.", "ai-explanations");
  assert.ok(memory.incompleteTopicIds.includes("failure-conflicting-suggestions"));
  assert.equal(selectNextProbe({ scenarioId: "ai-explanations", activeStepId: "edge-cases", memory })?.id, "failure-conflicting-suggestions");
});

test("prefers uncovered probe categories relevant to the active interview step", () => {
  const probe = selectNextProbe({ scenarioId: "ai-explanations", activeStepId: "design-flow", memory: createQuestionMemory() });
  assert.ok(["trust", "interaction", "reuse"].includes(probe.topic));
  assert.notEqual(probe.topic, "failure");
});
