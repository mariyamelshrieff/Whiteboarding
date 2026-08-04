import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the browser QA gesture creates an element at 5% of canvas width", async () => {
  const source = await readFile(new URL("../excalidraw-board.js", import.meta.url), "utf8");
  assert.match(source, /rect\.left \+ rect\.width \* 0\.05/);
  assert.match(source, /document\.elementFromPoint\(start\.x, start\.y\)/);
  assert.match(source, /getSceneElements\(\)\.find\(\(element\) => !element\.isDeleted && !before\.has\(element\.id\)\)/);
  assert.match(source, /passed: Boolean\(created\)/);
});

test("the properties panel is a collapsed rail docked away from the left edge", async () => {
  const css = await readFile(new URL("../app-frame.css", import.meta.url), "utf8");
  const rule = css.match(/\.selected-shape-actions \.App-menu__left \{([\s\S]*?)\n\}/)?.[1] || "";
  assert.match(rule, /position: absolute !important/);
  assert.match(rule, /inset: 72px 8px auto auto !important/);
  assert.match(rule, /width: 40px !important/);
  assert.doesNotMatch(rule, /left:\s*\d/);
});
