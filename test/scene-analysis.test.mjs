import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const { analyzeScene, evidencePhaseIndex } = require("../scene-analysis.js");

function labeledShape(id, label, x, y, width = 100, height = 70) {
  return [
    { id, type: "rectangle", x, y, width, height, boundElements: [`${id}-label`], groupIds: [] },
    { id: `${id}-label`, type: "text", text: label, x: x + 10, y: y + 20, width: 80, height: 24, containerId: id, boundElements: [], groupIds: [] }
  ];
}

function arrow(id, fromId, toId, x1, y1, x2, y2) {
  return {
    id,
    type: "arrow",
    x: x1,
    y: y1,
    width: x2 - x1,
    height: y2 - y1,
    points: [[0, 0], [x2 - x1, y2 - y1]],
    startBinding: fromId,
    endBinding: toId,
    boundElements: [],
    groupIds: []
  };
}

test("attributes bound text children to their shapes", () => {
  const elements = [
    ...labeledShape("one", "Rack risk feed", 0, 0),
    ...labeledShape("two", "Incident detail", 180, 0),
    ...labeledShape("three", "Containment action", 360, 0),
    ...labeledShape("four", "Resolution", 540, 0)
  ];
  const analysis = analyzeScene(elements);
  assert.equal(analysis.labeledShapeCount, 4);
  assert.equal(analysis.unlabeledShapeCount, 0);
  assert.match(analysis.summary, /4 labeled shapes, 0 unlabeled shapes/);
});

test("reports every ordinary-size label without dropping late evidence", () => {
  const labels = Array.from({ length: 16 }, (_, index) => `Label ${index + 1}`)
    .concat(["Success metrics: cascading incidents per quarter -30%", "Trade-off: speed versus false positives"]);
  const elements = labels.map((text, index) => ({ id: `text-${index}`, type: "text", text, x: (index % 6) * 120, y: Math.floor(index / 6) * 80, width: 100, height: 24, boundElements: [], groupIds: [] }));
  const analysis = analyzeScene(elements);
  assert.equal(analysis.labels.length, 18);
  assert.match(analysis.summary, /Success metrics: cascading incidents per quarter -30%/);
  assert.match(analysis.summary, /Trade-off: speed versus false positives/);
  assert.doesNotMatch(analysis.summary, /additional labels? (?:was|were) omitted/);
});

test("excludes zero-length arrows and emits a left-to-right labeled flow", () => {
  const elements = [
    ...labeledShape("feed", "Rack risk feed", 0, 0),
    ...labeledShape("detail", "Incident detail", 200, 0),
    ...labeledShape("action", "Containment action", 400, 0),
    arrow("feed-detail", "feed", "detail", 50, 35, 250, 35),
    arrow("detail-action", "detail", "action", 250, 35, 450, 35),
    { id: "collapsed", type: "arrow", x: 20, y: 20, width: 0, height: 0, points: [[0, 0], [0, 0]], startBinding: "feed", endBinding: "feed", boundElements: [], groupIds: [] }
  ];
  const analysis = analyzeScene(elements);
  assert.equal(analysis.validConnections.length, 2);
  assert.equal(analysis.invalidConnections.length, 1);
  assert.equal(analysis.invalidConnections[0].status, "degenerate");
  assert.match(analysis.summary, /Rack risk feed → Incident detail → Containment action/);
});

test("detects a sketch cluster below the flow and advances phases from evidence", () => {
  const flow = [
    ...labeledShape("feed", "Rack risk feed", 0, 0),
    ...labeledShape("detail", "Incident detail", 200, 0),
    arrow("feed-detail", "feed", "detail", 50, 35, 250, 35)
  ];
  const sketch = [0, 1, 2, 3].flatMap((index) => labeledShape(`screen-${index}`, `Screen ${index + 1}`, 20 + index * 112, 260, 92, 170));
  const analysis = analyzeScene([...flow, ...sketch]);
  assert.equal(analysis.hasFlow, true);
  assert.equal(analysis.hasSketchCluster, true);
  assert.equal(evidencePhaseIndex({ openingComplete: true, answeredQuestionCount: 2, analysis, candidateTurns: [] }), 4);
  const longSummary = `${"I will walk through the decision and trade-off. ".repeat(8)} Rack risk feed leads to Incident detail and then Screen 1.`;
  assert.ok(longSummary.length > 300);
  assert.equal(evidencePhaseIndex({ openingComplete: true, answeredQuestionCount: 2, analysis, candidateTurns: [longSummary] }), 5);
});

test("normalizes spatial regions against the scene bounds", () => {
  const elements = [
    ...labeledShape("first", "Far negative", -1200, -900),
    ...labeledShape("last", "Far positive", 1800, 1200)
  ];
  const summary = analyzeScene(elements).summary;
  assert.match(summary, /"Far negative" \(top left\)/);
  assert.match(summary, /"Far positive" \(bottom right\)/);
});
