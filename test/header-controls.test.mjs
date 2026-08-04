import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("header controls follow setup, workspace, and session groups", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  assert.match(html, /class="control-group setup-controls"[^>]*aria-label="Exercise setup"/);
  assert.match(html, /class="control-group workspace-controls"[^>]*aria-label="Workspace options"/);
  assert.match(html, /class="control-group session-actions"[^>]*aria-label="Session actions"/);
});

test("idle state exposes one blue Start action", async () => {
  const css = await readFile(new URL("../app-frame.css", import.meta.url), "utf8");
  assert.match(css, /body\[data-session="idle"\] \.session-actions \{[\s\S]*?display: none !important;/);
  assert.match(css, /\.statusbar #capsuleStart[\s\S]*?background: var\(--accent\) !important;[\s\S]*?color: var\(--on-dark\) !important;/);
});
