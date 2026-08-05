import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../app.js", import.meta.url), "utf8");

test("guides the candidate through the requested sections in order", () => {
  const orderedLabels = [
    "Clarify the problem",
    "Define success",
    "Identify users",
    "Map the journey",
    "Prioritize one problem",
    "Ideate",
    "Design the end-to-end flow",
    "Discuss edge cases"
  ];
  let previous = -1;
  orderedLabels.forEach((label) => {
    const index = source.indexOf(`label: "${label}"`);
    assert.ok(index > previous, `${label} should appear in framework order`);
    previous = index;
  });
});

test("binds every model turn to one active structured section", () => {
  assert.match(source, /Current structured section: \$\{structuredStep\.label\}/);
  assert.match(source, /Keep the conversation on the current section until there is concrete evidence/);
  assert.match(source, /Do not recite the full framework/);
  assert.match(source, /do not repeatedly call this an \"interview scenario\.\"/);
});

test("blocks appearance questions and replaces them with section-specific reasoning questions", () => {
  assert.match(source, /Never ask what the design, screen, interface, or solution should look like/);
  assert.match(source, /const appearanceQuestion =/);
  assert.match(source, /if \(appearanceQuestion\.test\(text\)\) return structuredSectionQuestion/);
  assert.match(source, /What does the user do first, and how does the system respond\?/);
});

test("preserves established context while the realtime transcript window is pruned", () => {
  assert.match(source, /function establishedContextForPrompt\(\)/);
  assert.match(source, /Prior interviewer answers, binding for this session/);
  assert.match(source, /Durable context ledger\. This survives the short realtime transcript window/);
  assert.match(source, /Converge instead of expanding the story/);
  assert.match(source, /never replace it, rename it, or introduce a competing version later/);
  assert.match(source, /Constraints must narrow the same challenge, never replace its story/);
});

test("locks the AI explanation challenge to one canonical audience", () => {
  const scenarioStart = source.indexOf('id: "ai-explanations"');
  const scenarioEnd = source.indexOf("\n  }\n];", scenarioStart);
  const scenario = source.slice(scenarioStart, scenarioEnd);
  assert.match(scenario, /Knowledge workers reviewing AI suggestions/);
  assert.doesNotMatch(scenario, /expert admins|enterprise tools|first-time users/);
  assert.match(source, /Canonical identity locks\. These are immutable for the session/);
  assert.match(source, /Never replace these with a consumer, enterprise, administrator, operator, or other audience/);
});

test("actively challenges reasoning and guides progress without prescribing a solution", () => {
  assert.match(source, /function nextProgressionProbe\(text, options = \{\}\)/);
  assert.match(source, /progressionProbeCounts/);
  assert.match(source, /What evidence would show that you framed the wrong problem\?/);
  assert.match(source, /What would change your prioritization decision\?/);
  assert.match(source, /What tradeoff separates your strongest direction from the alternatives\?/);
  assert.match(source, /The candidate leads, but you are an active facilitator/);
  assert.match(source, /Challenge the rationale, not the artifact/);
  assert.match(source, /Think alongside the candidate/);
  assert.match(source, /Interrupt between candidate turns when they commit/);
  assert.match(source, /function decisionConstraintProbe\(text\)/);
  assert.match(source, /What changes in the direction you just chose\?/);
});

test("keeps follow-ups relevant and blocks broken-record questions", () => {
  assert.match(source, /if \(\["design-flow", "edge-cases"\]\.includes\(stepId\)\) return nextUnaddressedEdgeCase/);
  assert.match(source, /Recent interviewer questions—do not repeat or lightly paraphrase any of these/);
  assert.match(source, /ensureNovelInterviewerResponse\(sanitizeInterviewerText/);
  assert.match(source, /questionSimilarity\(question, asked\) >= 0\.68/);
});

test("answers quantitative customer-call questions before broad audience matching", () => {
  const quantityCheck = source.indexOf("const quantitativeAnswer = answerQuantitativeClarification");
  const broadRules = source.indexOf("const rules = [", quantityCheck);
  assert.ok(quantityCheck >= 0 && broadRules > quantityCheck);
  assert.match(source, /assume a typical rep handles about 5 customer calls per day/);
  assert.match(source, /\["crm-meeting-prep", "crm-follow-up"\]\.includes\(scenario\.id\)/);
});

test("preserves active reasoning memory for the full session", () => {
  assert.match(source, /reasoningMemory: createEmptyReasoningMemory\(\)/);
  assert.match(source, /function updateReasoningMemoryFromCandidate\(text\)/);
  assert.match(source, /Active session reasoning memory\. Use this across the entire session/);
  assert.match(source, /reasoningMemory: state\.reasoningMemory/);
  assert.match(source, /reasoningMemory: snapshot\.reasoningMemory \|\| createEmptyReasoningMemory\(\)/);
});

test("keeps the full staff-level framework in mind without turning it into a script", () => {
  assert.match(source, /Keep the CLEAR DESIGN framework in mind as a flexible coverage map, not a script/);
  assert.match(source, /Recognize strong evidence in any order/);
  assert.match(source, /never make them repeat it/);
  assert.match(source, /adjacent journeys, trust, privacy, safety, system scale/);
  assert.match(source, /"cross-functional": has/);
  assert.match(source, /"validate-success": has/);
  assert.match(source, /"trade-offs": has/);
  assert.match(source, /"future-vision": has/);
});

test("uses a concise report disclaimer and a focused practice summary", () => {
  assert.match(source, /Practice feedback only\. Based on public/);
  assert.match(source, /title\.textContent = "Practice summary"/);
  assert.match(source, /label: "What went well"/);
  assert.match(source, /label: "What to practice next"/);
  assert.match(source, /function simplifyCoachingCopy\(value\)/);
  assert.doesNotMatch(source, /renderTimelineBar\(\);/);
  assert.doesNotMatch(source, /renderProcessSection\(\);/);
});
