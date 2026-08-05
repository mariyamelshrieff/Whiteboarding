import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const server = await readFile(new URL("../server.mjs", import.meta.url), "utf8");

test("post-session feedback has two required radio questions and one optional text field", () => {
  assert.match(html, /name="realistic" value="yes" required/);
  assert.match(html, /name="helpful" value="yes" required/);
  assert.match(html, /id="feedbackComment"[^>]*maxlength="1000"/);
  assert.match(app, /fetch\("\/feedback"/);
});

test("feedback collection validates input and limits public submissions", () => {
  assert.match(server, /url\.pathname === "\/feedback"/);
  assert.match(server, /recent\.length >= 5/);
  assert.match(server, /new Set\(\["yes", "somewhat", "no"\]\)/);
  assert.match(server, /String\(body\.comment \|\| ""\).*slice\(0, 1000\)/);
  assert.match(server, /process\.env\.FEEDBACK_WEBHOOK_URL/);
  assert.match(server, /USER_FEEDBACK/);
});
