import test from "node:test";
import assert from "node:assert/strict";
import { evaluateSession, RUBRIC } from "../evaluation.mjs";

const testEnv = { OPENAI_API_KEY: "test-key", OPENAI_EVALUATION_MODEL: "test-model" };

const goldenSessions = {
  empty: {
    prompt: "Golden empty session",
    company: "Google",
    transcript: [],
    sceneElements: [],
    sceneSummary: "",
    canvasCheckpoints: [],
    constraints: [],
    elapsedMs: 60_000,
    voiceAttempted: true
  },
  mediocre: {
    prompt: "Golden mediocre session",
    company: "Google",
    transcript: [
      { role: "candidate", at: 20_000, text: "I will focus on new users and sketch the main path." },
      { role: "candidate", at: 90_000, text: "The flow goes from entry to a result, but I have not explored edge cases yet." }
    ],
    sceneElements: [
      { id: "m1", type: "rectangle", text: "Entry", x: 40, y: 40, width: 180, height: 100 },
      { id: "m2", type: "rectangle", text: "Result", x: 320, y: 40, width: 180, height: 100 }
    ],
    sceneSummary: "Two labeled flow boxes; no verified connector.",
    canvasCheckpoints: [],
    constraints: [],
    elapsedMs: 8 * 60_000,
    voiceAttempted: true
  },
  strong: {
    prompt: "Golden strong session",
    company: "Google",
    transcript: [
      { role: "candidate", at: 15_000, text: "I will define the primary user, their goal, the scope, and a measurable success criterion before drawing." },
      { role: "candidate", at: 75_000, text: "The core journey is discover, compare, decide, and recover from an unavailable result." },
      { role: "candidate", at: 180_000, text: "I am trading breadth for a focused first-use flow, with accessibility and error recovery included." },
      { role: "candidate", at: 300_000, text: "Success is task completion plus a quantitative guardrail for failed attempts." }
    ],
    sceneElements: [
      { id: "s1", type: "rectangle", text: "Discover", x: 40, y: 40, width: 180, height: 100 },
      { id: "s2", type: "rectangle", text: "Compare", x: 320, y: 40, width: 180, height: 100 },
      { id: "s3", type: "rectangle", text: "Decide", x: 600, y: 40, width: 180, height: 100 },
      { id: "a1", type: "arrow", x: 220, y: 90, width: 100, height: 0, points: [[0, 0], [100, 0]], startBinding: "s1", endBinding: "s2" },
      { id: "a2", type: "arrow", x: 500, y: 90, width: 100, height: 0, points: [[0, 0], [100, 0]], startBinding: "s2", endBinding: "s3" }
    ],
    sceneSummary: "Three labeled stages with two verified connections, error recovery, accessibility notes, and quantitative success metrics.",
    canvasCheckpoints: [],
    constraints: [{ text: "Works with intermittent connectivity" }],
    elapsedMs: 25 * 60_000,
    voiceAttempted: true
  }
};

function evaluationDraft(level) {
  const scoreSets = {
    empty: [1, 1, 1, 1, 1, 1, 1, 1, 1],
    mediocre: [2, 2, 2, 2, 3, 2, 2, 3, 2],
    strong: [4, 4, 4, 4, 5, 4, 4, 5, 4]
  };
  const scores = scoreSets[level];
  return {
    overall: level === "empty" ? "5.0" : "1.0",
    summary: `${level} fixture summary`,
    strongestMoment: level === "empty" ? "No evidence captured." : "The candidate connected decisions to evidence.",
    priorityImprovement: level === "strong" ? "Tighten the closing summary." : "Add more complete reasoning and artifacts.",
    scores: RUBRIC.map((label, index) => ({
      label,
      score: scores[index],
      rationale: level === "strong"
        ? "Clear and explicit evidence supports this criterion."
        : scores[index] >= 3
          ? "Clear evidence reaches an adequate interview level."
          : level === "empty"
            ? "Evidence is absent for this criterion."
            : "Some evidence appears, but major gaps remain.",
      evidence: level === "empty" ? "No transcript or canvas evidence." : "Golden fixture transcript and scene.",
      confidence: level === "empty" ? "insufficient" : "high"
    }))
  };
}

function fakeFetch(drafts, callCounter = { count: 0 }) {
  return async () => {
    const index = Math.min(callCounter.count, drafts.length - 1);
    callCounter.count += 1;
    return {
      ok: true,
      status: 200,
      json: async () => ({ output_text: JSON.stringify(drafts[index]) })
    };
  };
}

test("golden sessions preserve empty < mediocre < strong ordering", async () => {
  const results = {};
  for (const level of ["empty", "mediocre", "strong"]) {
    results[level] = await evaluateSession(goldenSessions[level], testEnv, { fetchImpl: fakeFetch([evaluationDraft(level)]) });
  }

  assert.equal(results.empty.overall, 1);
  assert.equal(results.mediocre.overall, 2.2);
  assert.equal(results.strong.overall, 4.2);
  assert.ok(results.empty.overall < results.mediocre.overall);
  assert.ok(results.mediocre.overall < results.strong.overall);
  assert.ok(results.strong.overall - results.empty.overall >= 2);
});

test("positive rationale with a score below 3 is rejected and retried", async () => {
  const inconsistent = evaluationDraft("empty");
  inconsistent.scores[0] = {
    ...inconsistent.scores[0],
    score: 2,
    rationale: "Clear and explicit framing is visible."
  };
  const corrected = evaluationDraft("mediocre");
  corrected.scores[0] = {
    ...corrected.scores[0],
    score: 3,
    rationale: "Clear and explicit framing reaches an adequate level."
  };
  const calls = { count: 0 };

  const result = await evaluateSession(goldenSessions.mediocre, testEnv, { fetchImpl: fakeFetch([inconsistent, corrected], calls) });

  assert.equal(calls.count, 2);
  assert.equal(result.scores[0].score, 3);
  assert.equal(result.overall, 2.3);
});
