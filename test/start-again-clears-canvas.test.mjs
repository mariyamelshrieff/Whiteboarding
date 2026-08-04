import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const appSource = await readFile(new URL("../app.js", import.meta.url), "utf8");
const boardSource = await readFile(new URL("../excalidraw-board.js", import.meta.url), "utf8");

test("starting again clears the mounted Excalidraw scene", () => {
  assert.match(appSource, /function startSession\(\) \{[\s\S]*?if \(state\.ended\) resetSession\(\);/);
  assert.match(appSource, /function resetSession\(\) \{[\s\S]*?state\.clearBoardScene\?\.\(\);/);
  assert.match(appSource, /state\.clearBoardScene = typeof api\.clearScene === "function" \? api\.clearScene : null;/);
});

test("canvas reset removes elements and clears undo history", () => {
  assert.match(boardSource, /clearScene: clearCanvasForNewAttempt/);
  assert.match(boardSource, /function clearCanvasForNewAttempt\(\) \{[\s\S]*?updateScene\(\{[\s\S]*?elements: \[\]/);
  assert.match(boardSource, /history\?\.clear\?\.\(\);/);
});
