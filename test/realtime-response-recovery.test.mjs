import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../app.js", import.meta.url), "utf8");

test("a failed response.create send cannot leave the interviewer stuck active", () => {
  assert.match(source, /const sent = sendRealtimeEvent\(\{[\s\S]*?type: "response\.create"/);
  assert.match(source, /if \(!sent\) \{[\s\S]*?realtimeResponseRequested = false;[\s\S]*?realtimeResponseActive = false;[\s\S]*?return false;/);
});

test("clarifying responses recover from empty or timed-out model output", () => {
  assert.match(source, /else if \(!wasOpeningResponse && responseMeta\?\.fallbackText\) \{[\s\S]*?deliverRealtimeResponseFallback/);
  assert.match(source, /setTimeout\(\(\) => \{[\s\S]*?deliverRealtimeResponseFallback\(meta\.fallbackText/);
  assert.match(source, /\}, 30000\);/);
});

test("response progress refreshes the inactivity watchdog instead of cutting off speech", () => {
  assert.match(source, /if \(isRealtimeTextDelta\(event\)\) \{[\s\S]*?armRealtimeResponseWatchdog\(state\.realtimeResponseMeta\)/);
  assert.match(source, /if \(isRealtimeTextDone\(event\)\) \{[\s\S]*?armRealtimeResponseWatchdog\(state\.realtimeResponseMeta\)/);
});

test("short repeat requests replay the previous interviewer answer", () => {
  assert.match(source, /words\.length < 3 && !isRepeatRequest\(normalized\)/);
  assert.match(source, /if \(isRepeatRequest\(text\)\) \{[\s\S]*?lastInterviewerTurnText\(\)[\s\S]*?Repeat this previous interviewer response verbatim/);
});

test("a transcript-less opening cannot swallow the next interviewer answer", () => {
  assert.match(source, /if \(wasOpeningResponse\) state\.skipNextInterviewerTranscript = false;/);
});

test("the interviewer cannot transcribe or interrupt its own spoken prompt", () => {
  assert.match(source, /if \(candidateAudioIsSuppressed\(\) \|\| isLikelyInterviewerEcho\(text\)\)/);
  assert.match(source, /state\.interviewerPlaybackGuardUntil = Math\.max/);
  assert.match(source, /const overlap = shared \/ Math\.min\(captured\.size, interviewer\.size\)/);
  assert.match(source, /rememberInterviewerPlayback\(text\);[\s\S]*?new SpeechSynthesisUtterance/);
});

test("a recoverable response error does not masquerade as a microphone or board-observation failure", () => {
  assert.match(source, /function restoreListeningAfterResponseFailure\(\)/);
  assert.match(source, /The last response could not be completed, but the microphone is still connected/);
  assert.doesNotMatch(source, /useFallback\("Give me a moment to look at your board\."\)/);
  const disconnectedCheck = source.indexOf('if (!state.listening && !state.realtimeConnecting)');
  const observingCheck = source.indexOf('setInterviewerState("Observing your board")', disconnectedCheck);
  assert.ok(disconnectedCheck >= 0 && observingCheck > disconnectedCheck);
});
