import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
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

test("AI voice control preloads visible speaker states without repainting the icon reference", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const css = await readFile(new URL("../app-frame.css", import.meta.url), "utf8");
  const source = await readFile(new URL("../app.js", import.meta.url), "utf8");
  const sprite = await readFile(new URL("../lucide-sprite.svg", import.meta.url), "utf8");

  assert.match(html, /class="audio-state-proxy"[^>]*hidden[\s\S]*?class="shell-icon audio-on-icon"/);
  assert.match(html, /class="shell-icon audio-on-icon"[\s\S]*?lucide-sprite\.svg\?v=2#volume-2/);
  assert.match(html, /class="shell-icon audio-off-icon"[\s\S]*?lucide-sprite\.svg\?v=2#volume-x/);
  assert.match(sprite, /<symbol id="volume-2"/);
  assert.match(sprite, /<symbol id="volume-x"/);
  assert.match(css, /\.interviewer-state \{[\s\S]*?animation: none !important;/);
  assert.match(css, /#interviewerState\.is-muted,[\s\S]*?background: var\(--accent\) !important;[\s\S]*?color: var\(--on-dark\) !important;/);
  assert.match(source, /querySelector\("use"\)[\s\S]*?setAttribute\("href"/);
});


test("a fresh page activates the existing Shuffle control once", async () => {
  const source = await readFile(new URL("../initial-challenge.js", import.meta.url), "utf8");
  let clicks = 0;
  const document = {
    querySelector(selector) {
      assert.equal(selector, "#shuffleChallenge");
      return { click() { clicks += 1; } };
    }
  };
  runInNewContext(source, { globalThis: { document } });
  assert.equal(clicks, 1);
});

test("initial randomization is safe when the control is unavailable", async () => {
  const source = await readFile(new URL("../initial-challenge.js", import.meta.url), "utf8");
  assert.doesNotThrow(() => runInNewContext(source, {
    globalThis: { document: { querySelector() { return null; } } }
  }));
});
