import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const { observeSocialCues, socialCuePrompt } = require("../social-cue-policy.js");

test("recognizes explicit frustration without diagnosing an emotion", () => {
  const cues = observeSocialCues("I'm stuck and frustrated with this flow.");
  assert.deepEqual(cues.map((cue) => cue.id), ["explicit-frustration"]);
  assert.match(socialCuePrompt("I'm stuck and frustrated with this flow."), /conversational signals, not facts/i);
});

test("treats a repeat request as conversational repair", () => {
  assert.deepEqual(observeSocialCues("Could you repeat that?").map((cue) => cue.id), ["repair-request"]);
  assert.match(socialCuePrompt("Could you repeat that?"), /repeat or rephrase/i);
});

test("does not infer emotion from non-speech sounds or silence", () => {
  assert.deepEqual(observeSocialCues("[sighs]"), []);
  assert.deepEqual(observeSocialCues("typing sounds"), []);
  assert.match(socialCuePrompt("[sighs]"), /do not infer emotion/i);
});

test("calibrates uncertainty without treating it as poor performance", () => {
  const prompt = socialCuePrompt("I'm not sure which path is safer.");
  assert.match(prompt, /uncertainty/i);
  assert.match(prompt, /assumption, criterion, or evidence/i);
});
