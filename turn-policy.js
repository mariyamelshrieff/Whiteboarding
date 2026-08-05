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

  const AI_EXPLANATION_PROBES = [
    { id: "trust-accuracy", topic: "trust", phases: ["define-success", "design-flow"], pattern: /\b(accurate explanation|explanation accuracy|believe|trustworthy rationale|verify the explanation)\b/, probe: "How can the user verify that the explanation is accurate?" },
    { id: "interaction-disclosure", topic: "interaction", phases: ["ideate", "design-flow"], pattern: /\b(inline|expandable|progressive disclosure|show more|collapsed explanation)\b/, probe: "When should the explanation be inline versus progressively disclosed?" },
    { id: "interaction-after-accept", topic: "interaction", phases: ["design-flow"], pattern: /\b(after (?:accept|accepting)|accepted suggestion|undo|edit after accepting)\b/, probe: "What happens after the user accepts, edits, or undoes the suggestion?" },
    { id: "reuse-configurability", topic: "reuse", phases: ["ideate", "design-flow"], pattern: /\b(reusable|configurable|configuration|across products?|different products?|component api|variant)\b/, probe: "Which parts stay consistent across products, and which are configurable?" },
    { id: "accessibility-explanation", topic: "accessibility", phases: ["design-flow", "edge-cases"], pattern: /\b(accessib|screen reader|keyboard|nonvisual|cognitive load)\b/, probe: "How does the explanation remain understandable and operable for users with accessibility needs?" },
    { id: "failure-conflicting-suggestions", topic: "failure", phases: ["edge-cases"], pattern: /\b(conflict(?:ing)? suggestions?|suggestions?.{0,20}conflict|multiple (?:ai )?suggestions?|different (?:ai )?suggestions?|suggestions?.{0,30}(?:same time|simultaneous|overlap)|contradict(?:ion|ory)?|suggestions? disagree|inconsistent suggestions?)\b/, probe: "What happens when two AI suggestions conflict?" },
    { id: "failure-missing-evidence", topic: "failure", phases: ["edge-cases"], pattern: /\b(missing (?:source|citation|evidence)|no (?:source|citation|evidence)|unsupported suggestion|provenance|incomplete evidence)\b/, probe: "How should the experience respond when a suggestion has incomplete evidence?" },
    { id: "failure-low-confidence", topic: "failure", phases: ["edge-cases"], pattern: /\b(low confidence|uncertain(?:ty)?|confidence score|model is unsure|ambiguous)\b/, probe: "What changes when the AI has low confidence?" },
    { id: "metrics-decision-quality", topic: "metrics", phases: ["define-success", "edge-cases"], pattern: /\b(accept rate|edit rate|time to decision|decision quality|trust score|satisfaction|measure success|metric)\b/, probe: "Which measure would show better decisions rather than merely more accepted suggestions?" }
  ];

  function createQuestionMemory(value = {}) {
    return {
      askedProbeIds: [...new Set(value.askedProbeIds || [])],
      coveredTopicIds: [...new Set(value.coveredTopicIds || [])],
      incompleteTopicIds: [...new Set(value.incompleteTopicIds || [])],
      askedQuestions: [...new Set(value.askedQuestions || [])].slice(-40),
      pendingProbeId: value.pendingProbeId || ""
    };
  }

  function normalizeQuestion(text) {
    return String(text || "").toLowerCase().replace(/\b(ai|artificial intelligence)\b/g, "ai").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  }

  function probeForText(text, scenarioId) {
    const normalized = normalizeQuestion(text);
    const library = scenarioId === "ai-explanations" ? AI_EXPLANATION_PROBES : [];
    return library.find((probe) => probe.pattern.test(normalized)) || null;
  }

  function rememberInterviewerQuestion(memoryValue, text, scenarioId) {
    const memory = createQuestionMemory(memoryValue);
    const questions = String(text || "").match(/[^?.!]*\?/g) || [];
    questions.forEach((question) => {
      const normalized = normalizeQuestion(question);
      if (normalized && !memory.askedQuestions.includes(normalized)) memory.askedQuestions.push(normalized);
      const probe = probeForText(question, scenarioId);
      if (probe && !memory.askedProbeIds.includes(probe.id)) memory.askedProbeIds.push(probe.id);
      if (probe) memory.pendingProbeId = probe.id;
    });
    memory.askedQuestions = memory.askedQuestions.slice(-40);
    return memory;
  }

  function rememberCandidateAnswer(memoryValue, text, scenarioId) {
    const memory = createQuestionMemory(memoryValue);
    const normalized = normalizeQuestion(text);
    const explicitProbe = probeForText(normalized, scenarioId);
    const pending = AI_EXPLANATION_PROBES.find((probe) => probe.id === memory.pendingProbeId);
    const probe = explicitProbe || pending;
    if (!probe) return memory;
    const wordCount = normalized.split(/\s+/).filter(Boolean).length;
    const incomplete = wordCount < 8 || /\b(?:not sure|don'?t know|need to think|come back to|haven'?t decided|unclear)\b/.test(normalized);
    const remove = (list, id) => list.filter((item) => item !== id);
    if (incomplete) {
      if (!memory.incompleteTopicIds.includes(probe.id)) memory.incompleteTopicIds.push(probe.id);
    } else {
      if (!memory.coveredTopicIds.includes(probe.id)) memory.coveredTopicIds.push(probe.id);
      memory.incompleteTopicIds = remove(memory.incompleteTopicIds, probe.id);
    }
    memory.pendingProbeId = "";
    return memory;
  }

  function selectNextProbe({ scenarioId, activeStepId, memory: memoryValue, boardSummary = "" }) {
    if (scenarioId !== "ai-explanations") return null;
    let memory = createQuestionMemory(memoryValue);
    const boardProbe = probeForText(boardSummary, scenarioId);
    if (boardProbe && !memory.coveredTopicIds.includes(boardProbe.id)) memory.coveredTopicIds.push(boardProbe.id);
    const available = AI_EXPLANATION_PROBES.filter((probe) => {
      if (memory.coveredTopicIds.includes(probe.id)) return false;
      return !memory.askedProbeIds.includes(probe.id) || memory.incompleteTopicIds.includes(probe.id);
    });
    const incomplete = available.find((probe) => memory.incompleteTopicIds.includes(probe.id) && probe.phases.includes(activeStepId));
    if (incomplete) return incomplete;
    return available.find((probe) => probe.phases.includes(activeStepId)) || available[0] || null;
  }

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
    const commitsToDecision = /\b(i(?:'m| am| will| would)? (?:choos(?:e|ing)|prioritiz(?:e|ing)|going with|propos(?:e|ing)|decid(?:e|ed|ing)|focus(?:ing)? on)|my (?:decision|direction|approach)|the (?:best|primary|main) (?:option|direction|flow))\b/.test(normalized);
    const unsupportedCertainty = /\b(obviously|clearly|definitely|everyone|always|never|best|simplest)\b/.test(normalized)
      && !/\b(because|evidence|research|data|metric|trade[ -]?off|constraint)\b/.test(normalized);
    const lateSummary = ["sketch", "summary"].includes(phaseId) && normalized.length >= 180;
    return isWalkthroughOrTradeoff || commitsToDecision || unsupportedCertainty || lateSummary || consecutiveCandidateTurns(transcript) >= 2;
  }

  function nextUnaddressedEdgeCase({ boardSummary, transcript, scenarioId, memory, activeStepId = "edge-cases" }) {
    if (scenarioId === "ai-explanations" && memory) return selectNextProbe({ scenarioId, activeStepId, memory, boardSummary });
    const edgeCases = SCENARIO_EDGE_CASES[scenarioId] || DEFAULT_EDGE_CASES;
    // Include interviewer turns so a probe is considered used as soon as it is
    // asked. Candidate evidence also marks it addressed. Never default back to
    // the first probe once the set is exhausted.
    const evidence = `${boardSummary || ""} ${(transcript || []).map((turn) => turn?.text || "").join(" ")}`.toLowerCase();
    return edgeCases.find((item) => !item.pattern.test(evidence)) || null;
  }

  return { consecutiveCandidateTurns, shouldForceFollowUp, nextUnaddressedEdgeCase, createQuestionMemory, rememberInterviewerQuestion, rememberCandidateAnswer, selectNextProbe };
});
