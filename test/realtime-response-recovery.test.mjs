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
  assert.match(source, /\}, 15000\);/);
});

test("a transcript-less opening cannot swallow the next interviewer answer", () => {
  assert.match(source, /if \(wasOpeningResponse\) state\.skipNextInterviewerTranscript = false;/);
});
