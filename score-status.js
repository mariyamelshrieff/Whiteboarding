(function attachScoreStatus(root, factory) {
  const api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
    return;
  }

  root.WhiteboardScoreStatus = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createScoreStatus() {
  function scoreStatus(rawScore) {
    const score = Math.max(1, Math.min(5, Math.round(Number(rawScore) || 1)));

    if (score === 5) return { kind: "strong", label: "Strong" };
    if (score === 4) return { kind: "good", label: "Went well" };
    if (score === 3) return { kind: "improve", label: "Could improve" };
    return { kind: "needs-work", label: "Needs work" };
  }

  return { scoreStatus };
});
