(function attachTurnPolicy(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
    return;
  }
  root.WhiteboardTurnPolicy = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createTurnPolicy() {
  const DEFAULT_EDGE_CASES = [
    {
      id: "concurrent-incidents",
      pattern: /\b(concurrent|simultaneous|multiple events?|overlapping events?|happen(?:ing)? at the same time)\b/,
      probe: "How does the flow handle multiple events happening at the same time?"
    },
    {
      id: "telemetry-loss",
      pattern: /\b(telemetry loss|missing telemetry|lost telemetry|sensor outage|no telemetry|stale data|data gap)\b/,
      probe: "What happens when telemetry is delayed, stale, or missing entirely?"
    },
    {
      id: "permissions",
      pattern: /\b(permissions?|role-based|rbac|access control|authorized|authorization)\b/,
      probe: "Who has permission to acknowledge, suppress, or escalate an incident?"
    }
  ];

  const SCENARIO_EDGE_CASES = {
    "ai-explanations": [
      {
        id: "conflicting-suggestions",
        pattern: /\b(conflict(?:ing)? suggestions?|suggestions? conflict|contradict(?:ion|ory)?|suggestions? disagree|inconsistent suggestions?)\b/,
        probe: "What happens when two AI suggestions conflict?"
      },
      {
        id: "missing-evidence",
        pattern: /\b(missing (?:source|citation|evidence)|no (?:source|citation|evidence)|unsupported suggestion|provenance)\b/,
        probe: "How should the experience respond when a suggestion has incomplete evidence?"
      },
      {
        id: "low-confidence",
        pattern: /\b(low confidence|uncertain(?:ty)?|confidence score|model is unsure|ambiguous)\b/,
        probe: "What changes when the AI has low confidence?"
      },
      {
        id: "harmful-action",
        pattern: /\b(harmful|high impact|irreversible|risky action|undo|recovery)\b/,
        probe: "What protection is needed before a high-impact suggestion is accepted?"
      }
    ]
  };

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

  function nextUnaddressedEdgeCase({ boardSummary, transcript, scenarioId }) {
    const edgeCases = SCENARIO_EDGE_CASES[scenarioId] || DEFAULT_EDGE_CASES;
    // Include interviewer turns so a probe is considered used as soon as it is
    // asked. Candidate evidence also marks it addressed. Never default back to
    // the first probe once the set is exhausted.
    const evidence = `${boardSummary || ""} ${(transcript || []).map((turn) => turn?.text || "").join(" ")}`.toLowerCase();
    return edgeCases.find((item) => !item.pattern.test(evidence)) || null;
  }

  return { consecutiveCandidateTurns, shouldForceFollowUp, nextUnaddressedEdgeCase };
});
