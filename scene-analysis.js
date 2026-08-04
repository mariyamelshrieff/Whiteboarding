(function attachSceneAnalysis(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
    return;
  }
  root.WhiteboardSceneAnalysis = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createSceneAnalysis() {
  const REGION_ROWS = ["top", "middle", "bottom"];
  const REGION_COLUMNS = ["left", "center", "right"];

  function normalizeText(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function isConnector(element) {
    return element?.type === "arrow" || element?.type === "line";
  }

  function isShape(element) {
    return Boolean(element && !["text", "arrow", "line", "freedraw", "draw"].includes(element.type));
  }

  function boundsOf(element) {
    const x = Number(element?.x) || 0;
    const y = Number(element?.y) || 0;
    const width = Math.abs(Number(element?.width) || 0);
    const height = Math.abs(Number(element?.height) || 0);
    return { left: x, top: y, right: x + width, bottom: y + height, width, height, area: width * height };
  }

  function centerOf(element) {
    const bounds = boundsOf(element);
    return { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 };
  }

  function sceneBounds(elements) {
    const visible = elements.filter((element) => !isConnector(element));
    const source = visible.length ? visible : elements;
    if (!source.length) return { left: 0, top: 0, right: 1, bottom: 1, width: 1, height: 1 };
    const allBounds = source.map(boundsOf);
    const left = Math.min(...allBounds.map((bounds) => bounds.left));
    const top = Math.min(...allBounds.map((bounds) => bounds.top));
    const right = Math.max(...allBounds.map((bounds) => bounds.right));
    const bottom = Math.max(...allBounds.map((bounds) => bounds.bottom));
    return { left, top, right, bottom, width: Math.max(1, right - left), height: Math.max(1, bottom - top) };
  }

  function regionFor(element, scene) {
    const center = centerOf(element);
    const xRatio = clampRatio((center.x - scene.left) / scene.width);
    const yRatio = clampRatio((center.y - scene.top) / scene.height);
    const column = Math.min(2, Math.floor(xRatio * 3));
    const row = Math.min(2, Math.floor(yRatio * 3));
    return `${REGION_ROWS[row]} ${REGION_COLUMNS[column]}`;
  }

  function clampRatio(value) {
    return Math.max(0, Math.min(0.999999, Number(value) || 0));
  }

  function labelsByContainer(elements, byId = new Map(elements.map((element) => [element.id, element]))) {
    const labels = new Map();
    const add = (containerId, text) => {
      const normalized = normalizeText(text);
      if (!containerId || !normalized || !byId.has(containerId)) return;
      const current = labels.get(containerId) || [];
      if (!current.includes(normalized)) current.push(normalized);
      labels.set(containerId, current);
    };
    elements.filter((element) => element.type === "text").forEach((textElement) => add(textElement.containerId, textElement.text));
    elements.filter(isShape).forEach((shape) => {
      (shape.boundElements || []).forEach((id) => {
        const bound = byId.get(id);
        if (bound?.type === "text") add(shape.id, bound.text);
      });
    });
    return new Map([...labels].map(([id, values]) => [id, values.join(" / ")]));
  }

  function connectorSpan(element) {
    const points = Array.isArray(element?.points) ? element.points : [];
    const pointSpan = points.length > 1
      ? Math.hypot((Number(points.at(-1)?.[0]) || 0) - (Number(points[0]?.[0]) || 0), (Number(points.at(-1)?.[1]) || 0) - (Number(points[0]?.[1]) || 0))
      : 0;
    return Math.max(Math.hypot(Math.abs(Number(element?.width) || 0), Math.abs(Number(element?.height) || 0)), pointSpan);
  }

  function connectorEndpoints(element) {
    const x = Number(element?.x) || 0;
    const y = Number(element?.y) || 0;
    const points = Array.isArray(element?.points) ? element.points : [];
    if (points.length > 1) {
      return {
        start: { x: x + (Number(points[0]?.[0]) || 0), y: y + (Number(points[0]?.[1]) || 0) },
        end: { x: x + (Number(points.at(-1)?.[0]) || 0), y: y + (Number(points.at(-1)?.[1]) || 0) }
      };
    }
    return { start: { x, y }, end: { x: x + (Number(element?.width) || 0), y: y + (Number(element?.height) || 0) } };
  }

  function resolveBinding(bindingId, byId) {
    const target = byId.get(bindingId);
    if (!target) return null;
    if (target.type === "text") {
      const container = target.containerId ? byId.get(target.containerId) : null;
      return container && isShape(container) ? container : null;
    }
    return isShape(target) ? target : null;
  }

  function analyzeConnector(element, byId, labelMap, scene) {
    if (connectorSpan(element) < 12) return { id: element.id, status: "degenerate" };
    if (!element.startBinding || !element.endBinding) return { id: element.id, status: "unbound" };
    const from = resolveBinding(element.startBinding, byId);
    const to = resolveBinding(element.endBinding, byId);
    if (!from || !to) return { id: element.id, status: "ambiguous-endpoint" };
    if (from.id === to.id) return { id: element.id, status: "self-binding" };
    const endpoints = connectorEndpoints(element);
    const fromCenter = centerOf(from);
    const toCenter = centerOf(to);
    const startDistance = Math.hypot(endpoints.start.x - fromCenter.x, endpoints.start.y - fromCenter.y);
    const endDistance = Math.hypot(endpoints.end.x - toCenter.x, endpoints.end.y - toCenter.y);
    if (startDistance > 40 || endDistance > 40) {
      return { id: element.id, status: "distant-binding", startDistance: Math.round(startDistance), endDistance: Math.round(endDistance) };
    }
    return {
      id: element.id,
      status: "verified",
      fromId: from.id,
      toId: to.id,
      fromLabel: labelMap.get(from.id) || `${from.type} in the ${regionFor(from, scene)} region`,
      toLabel: labelMap.get(to.id) || `${to.type} in the ${regionFor(to, scene)} region`
    };
  }

  function gapBetween(a, b) {
    const first = boundsOf(a);
    const second = boundsOf(b);
    const gapX = Math.max(0, Math.max(first.left, second.left) - Math.min(first.right, second.right));
    const gapY = Math.max(0, Math.max(first.top, second.top) - Math.min(first.bottom, second.bottom));
    return Math.hypot(gapX, gapY);
  }

  function clusterShapes(shapes, scene, labelMap) {
    if (!shapes.length) return [];
    const threshold = Math.max(48, Math.min(180, Math.hypot(scene.width, scene.height) * 0.11));
    const remaining = new Set(shapes.map((shape) => shape.id));
    const byId = new Map(shapes.map((shape) => [shape.id, shape]));
    const clusters = [];
    while (remaining.size) {
      const firstId = remaining.values().next().value;
      remaining.delete(firstId);
      const ids = [firstId];
      for (let index = 0; index < ids.length; index += 1) {
        const current = byId.get(ids[index]);
        [...remaining].forEach((candidateId) => {
          const candidate = byId.get(candidateId);
          if (gapBetween(current, candidate) <= threshold) {
            remaining.delete(candidateId);
            ids.push(candidateId);
          }
        });
      }
      const members = ids.map((id) => byId.get(id));
      const memberBounds = members.map(boundsOf);
      const bounds = {
        left: Math.min(...memberBounds.map((item) => item.left)),
        top: Math.min(...memberBounds.map((item) => item.top)),
        right: Math.max(...memberBounds.map((item) => item.right)),
        bottom: Math.max(...memberBounds.map((item) => item.bottom))
      };
      bounds.width = Math.max(1, bounds.right - bounds.left);
      bounds.height = Math.max(1, bounds.bottom - bounds.top);
      const proxy = { x: bounds.left, y: bounds.top, width: bounds.width, height: bounds.height };
      const centers = members.map(centerOf);
      const xSpread = Math.max(...centers.map((center) => center.x)) - Math.min(...centers.map((center) => center.x));
      const ySpread = Math.max(...centers.map((center) => center.y)) - Math.min(...centers.map((center) => center.y));
      const arrangement = members.length === 1 ? "single item" : ySpread > xSpread * 1.35 ? "vertical stack" : xSpread > ySpread * 1.35 ? "horizontal row" : "cluster or grid";
      const typeCounts = members.reduce((counts, member) => {
        counts[member.type] = (counts[member.type] || 0) + 1;
        return counts;
      }, {});
      const typePhrase = Object.entries(typeCounts).map(([type, count]) => `${count} ${type}${count === 1 ? "" : "s"}`).join(" and ");
      const labels = members.map((member) => labelMap.get(member.id)).filter(Boolean);
      clusters.push({ ids, members, bounds, region: regionFor(proxy, scene), arrangement, typePhrase, labels });
    }
    return clusters.sort((a, b) => a.bounds.top - b.bounds.top || a.bounds.left - b.bounds.left);
  }

  function buildFlowSequences(connections, shapesById) {
    if (!connections.length) return [];
    const outgoing = new Map();
    const incoming = new Map();
    const nodeIds = new Set();
    connections.forEach((connection) => {
      nodeIds.add(connection.fromId);
      nodeIds.add(connection.toId);
      outgoing.set(connection.fromId, [...(outgoing.get(connection.fromId) || []), connection]);
      incoming.set(connection.toId, (incoming.get(connection.toId) || 0) + 1);
    });
    const starts = [...nodeIds]
      .filter((id) => !incoming.get(id))
      .sort((a, b) => centerOf(shapesById.get(a)).x - centerOf(shapesById.get(b)).x);
    const candidates = starts.length ? starts : [...nodeIds].sort((a, b) => centerOf(shapesById.get(a)).x - centerOf(shapesById.get(b)).x).slice(0, 1);
    const visitedEdges = new Set();
    const sequences = [];
    candidates.forEach((startId) => {
      const ids = [startId];
      let current = startId;
      const seenNodes = new Set(ids);
      while (outgoing.get(current)?.length) {
        const nextConnection = [...outgoing.get(current)]
          .filter((connection) => !visitedEdges.has(connection.id))
          .sort((a, b) => centerOf(shapesById.get(a.toId)).x - centerOf(shapesById.get(b.toId)).x)[0];
        if (!nextConnection || seenNodes.has(nextConnection.toId)) break;
        visitedEdges.add(nextConnection.id);
        ids.push(nextConnection.toId);
        seenNodes.add(nextConnection.toId);
        current = nextConnection.toId;
      }
      if (ids.length > 1) {
        sequences.push([...ids].sort((a, b) => centerOf(shapesById.get(a)).x - centerOf(shapesById.get(b)).x));
      }
    });
    return sequences;
  }

  function analyzeScene(rawElements) {
    const elements = (Array.isArray(rawElements) ? rawElements : []).filter((element) => element?.id && !element.isDeleted);
    if (!elements.length) return emptyAnalysis();
    const byId = new Map(elements.map((element) => [element.id, element]));
    const scene = sceneBounds(elements);
    const labelMap = labelsByContainer(elements, byId);
    const shapes = elements.filter(isShape);
    const shapesById = new Map(shapes.map((shape) => [shape.id, shape]));
    const connectorAnalyses = elements.filter(isConnector).map((connector) => analyzeConnector(connector, byId, labelMap, scene));
    const validConnections = connectorAnalyses.filter((analysis) => analysis.status === "verified");
    const invalidConnections = connectorAnalyses.filter((analysis) => analysis.status !== "verified");
    const flowSequences = buildFlowSequences(validConnections, shapesById);
    const flowShapeIds = new Set(validConnections.flatMap((connection) => [connection.fromId, connection.toId]));
    const connectedLabeledShapeIds = [...flowShapeIds].filter((id) => labelMap.has(id));
    const flowBottom = flowShapeIds.size ? Math.max(...[...flowShapeIds].map((id) => boundsOf(shapesById.get(id)).bottom)) : -Infinity;
    const allClusters = clusterShapes(shapes, scene, labelMap);
    const nonFlowClusters = clusterShapes(shapes.filter((shape) => !flowShapeIds.has(shape.id)), scene, labelMap);
    const sketchClusters = nonFlowClusters.filter((cluster) => cluster.ids.length >= 4 && cluster.bounds.top > flowBottom);
    const labels = elements
      .filter((element) => normalizeText(element.text))
      .sort((a, b) => boundsOf(a).top - boundsOf(b).top || boundsOf(a).left - boundsOf(b).left)
      .map((element) => ({ id: element.id, text: normalizeText(element.text), containerId: element.containerId || "", region: regionFor(element, scene) }));
    const labeledShapeCount = shapes.filter((shape) => labelMap.has(shape.id)).length;
    const groups = new Set(elements.flatMap((element) => element.groupIds || []).filter(Boolean));
    const counts = elements.reduce((result, element) => {
      result[element.type] = (result[element.type] || 0) + 1;
      return result;
    }, {});
    const analysis = {
      elementCount: elements.length,
      counts,
      sceneBounds: scene,
      labels,
      labelByContainer: Object.fromEntries(labelMap),
      shapeCount: shapes.length,
      labeledShapeCount,
      unlabeledShapeCount: Math.max(0, shapes.length - labeledShapeCount),
      groupCount: groups.size,
      validConnections,
      invalidConnections,
      flowSequences,
      flowShapeIds: [...flowShapeIds],
      connectedLabeledShapeCount: connectedLabeledShapeIds.length,
      clusters: allClusters.map(serializeCluster),
      sketchClusters: sketchClusters.map(serializeCluster),
      hasFlow: connectedLabeledShapeIds.length >= 2,
      hasSketchCluster: sketchClusters.length > 0
    };
    analysis.summary = summarizeAnalysis(analysis, shapesById);
    return analysis;
  }

  function serializeCluster(cluster) {
    return { ids: cluster.ids, bounds: cluster.bounds, region: cluster.region, arrangement: cluster.arrangement, typePhrase: cluster.typePhrase, labels: cluster.labels };
  }

  function summarizeAnalysis(analysis, shapesById) {
    const countText = Object.entries(analysis.counts).sort(([a], [b]) => a.localeCompare(b)).map(([type, count]) => `${count} ${type}`).join(", ");
    const maxLabels = 60;
    const includedLabels = analysis.labels.slice(0, maxLabels);
    const omitted = Math.max(0, analysis.labels.length - includedLabels.length);
    const labelsText = includedLabels.length
      ? `All canvas labels (${analysis.labels.length}): ${includedLabels.map((label) => `"${label.text}" (${label.region})`).join("; ")}${omitted ? `. ${omitted} additional label${omitted === 1 ? " was" : "s were"} omitted from this text summary` : ""}.`
      : "No canvas labels were captured.";
    const clusterText = analysis.clusters.length
      ? `Spatial regions: ${analysis.clusters.map((cluster, index) => {
        const labels = cluster.labels.length ? `, labeled ${cluster.labels.map((label) => `"${label}"`).join(", ")}` : ", with no bound labels";
        return `${cluster.region} region ${index + 1} contains a group of ${cluster.typePhrase} forming a ${cluster.arrangement}${labels}`;
      }).join("; ")}.`
      : "No shape clusters were detected.";
    const flowText = analysis.flowSequences.length
      ? `Arrow-connected flow sequences, ordered left to right: ${analysis.flowSequences.map((sequence) => sequence.map((id) => analysis.labelByContainer[id] || shapesById.get(id)?.type || "shape").join(" → ")).join("; ")}.`
      : "No verified arrow-connected labeled flow was captured.";
    const ignoredText = analysis.invalidConnections.length
      ? `Ignored ${analysis.invalidConnections.length} connector${analysis.invalidConnections.length === 1 ? "" : "s"} (${analysis.invalidConnections.map((connection) => connection.status).join(", ")}); these do not count as flow evidence.`
      : "No ambiguous or degenerate connectors were counted.";
    return `${countText}. ${labelsText} ${clusterText} ${flowText} ${ignoredText} Completeness cues: ${analysis.elementCount} readable elements, ${analysis.validConnections.length} verified connections, ${analysis.groupCount} groups, ${analysis.labeledShapeCount} labeled shapes, ${analysis.unlabeledShapeCount} unlabeled shapes, ${analysis.sketchClusters.length} sketch clusters below the flow.`.replace(/\s+/g, " ").trim();
  }

  function emptyAnalysis() {
    return {
      summary: "",
      elementCount: 0,
      counts: {},
      sceneBounds: { left: 0, top: 0, right: 1, bottom: 1, width: 1, height: 1 },
      labels: [],
      labelByContainer: {},
      shapeCount: 0,
      labeledShapeCount: 0,
      unlabeledShapeCount: 0,
      groupCount: 0,
      validConnections: [],
      invalidConnections: [],
      flowSequences: [],
      flowShapeIds: [],
      connectedLabeledShapeCount: 0,
      clusters: [],
      sketchClusters: [],
      hasFlow: false,
      hasSketchCluster: false
    };
  }

  function referencedLabelCount(text, analysis) {
    const normalized = normalizeText(text).toLowerCase();
    if (!normalized) return 0;
    return analysis.labels.filter((label) => label.text.length >= 3 && normalized.includes(label.text.toLowerCase())).length;
  }

  function evidencePhaseIndex({ openingComplete, answeredQuestionCount, analysis, candidateTurns }) {
    if (!openingComplete) return 0;
    if ((Number(answeredQuestionCount) || 0) < 2) return 1;
    if (!analysis?.hasFlow) return 2;
    if (!analysis?.hasSketchCluster) return 3;
    const summaryTurn = (candidateTurns || []).some((turn) => normalizeText(turn).length > 300 && referencedLabelCount(turn, analysis) >= 3);
    return summaryTurn ? 5 : 4;
  }

  return { analyzeScene, connectorSpan, connectorEndpoints, centerOf, referencedLabelCount, evidencePhaseIndex };
});
