(function attachTurnPolicy(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
    return;
  }
  root.WhiteboardTurnPolicy = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createTurnPolicy() {
  const EDGE_CASES = [
    {
      id: "concurrent-incidents",
      pattern: /\b(concurrent|simultaneous|multiple incidents?|incident storm|overlapping incidents?)\b/,
      probe: "How does the design behave when several incidents happen at the same time?"
    },
    {
      id: "telemetry-loss",
      pattern: /\b(telemetry loss|missing telemetry|lost telemetry|sensor outage|no telemetry|stale data|data gap)\b/,
      probe: "What happens when telemetry is delayed, stale, or missing entirely?"
    },
    {
      id: "permissions",
      pattern: /\b(permission|role-based|rbac|access control|authorized|authorization)\b/,
      probe: "Who has permission to acknowledge, suppress, or escalate an incident?"
    }
  ];

  function consecutiveCandidateTurns(transcript) {
    let count = 0;
    for (let index = (transcript || []).length - 1; index >= 0; index -= 1) {
      const role = transcript[index]?.role;
      if (role === "interviewer") break;
      if (role === "candidate") count += 1;
    }
    return count;
  }

  function shouldForceFollowUp({ text, phaseId, transcript }) {
    const normalized = String(text || "").toLowerCase();
    const isWalkthroughOrTradeoff = /\b(walk(?:ing)? through|walkthrough|trade[ -]?off|alternative|chose|choose|rationale|to summarize|in summary|recap|overall approach)\b/.test(normalized);
    const lateSummary = ["sketch", "summary"].includes(phaseId) && normalized.length >= 180;
    return isWalkthroughOrTradeoff || lateSummary || consecutiveCandidateTurns(transcript) >= 2;
  }

  function nextUnaddressedEdgeCase({ boardSummary, transcript }) {
    const evidence = `${boardSummary || ""} ${(transcript || []).filter((turn) => turn?.role === "candidate").map((turn) => turn.text || "").join(" ")}`.toLowerCase();
    return EDGE_CASES.find((item) => !item.pattern.test(evidence)) || EDGE_CASES[0];
  }

  return { consecutiveCandidateTurns, shouldForceFollowUp, nextUnaddressedEdgeCase };
});
