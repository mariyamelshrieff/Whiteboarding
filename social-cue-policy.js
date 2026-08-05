(function attachSocialCuePolicy(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
    return;
  }
  root.WhiteboardSocialCuePolicy = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createSocialCuePolicy() {
  const SIGNALS = [
    {
      id: "explicit-frustration",
      pattern: /\b(i(?:'m| am) (?:frustrated|overwhelmed|confused|lost|stuck)|this is frustrating|i can'?t figure this out)\b/i,
      guidance: "Acknowledge the difficulty without judging the candidate. Reduce response density and ask one manageable, ownership-preserving question."
    },
    {
      id: "self-consciousness",
      pattern: /\b(sorry|this (?:might|may) be (?:dumb|stupid|obvious)|i(?:'m| am) bad at this|this is probably wrong)\b/i,
      guidance: "Respond respectfully and normalize ambiguity without giving reassurance about performance. Return attention to the decision or evidence."
    },
    {
      id: "uncertainty",
      pattern: /\b(i(?:'m| am) not sure|i don'?t know|maybe|perhaps|i guess|i think but|could be wrong)\b/i,
      guidance: "Do not treat uncertainty as weakness. Ask for the assumption, criterion, or evidence that would help the candidate decide."
    },
    {
      id: "time-pressure",
      pattern: /\b(running out of time|short on time|need to move (?:fast|quickly)|i(?:'ll| will) rush|quickly before time)\b/i,
      guidance: "Be especially concise. Help the candidate prioritize by asking what they will preserve or cut, without choosing for them."
    },
    {
      id: "repair-request",
      pattern: /\b(repeat that|say that again|slow down|i didn'?t catch|what did you say|can you rephrase)\b/i,
      guidance: "Repair the conversation directly: repeat or rephrase the last point more slowly. Do not add a new question or constraint."
    },
    {
      id: "high-confidence-language",
      pattern: /\b(i(?:'m| am) confident|definitely|clearly the best|obviously|without a doubt)\b/i,
      guidance: "Match the candidate's directness while testing the substance. Probe one assumption or tradeoff; do not reward confidence itself."
    }
  ];

  function observeSocialCues(text) {
    const value = String(text || "").trim();
    if (!value) return [];
    return SIGNALS.filter((signal) => signal.pattern.test(value)).map(({ id, guidance }) => ({ id, guidance }));
  }

  function socialCuePrompt(text) {
    const cues = observeSocialCues(text);
    if (!cues.length) {
      return "No explicit social or conversational cue is present. Do not infer emotion from silence, brevity, typing, sighs, or background noise.";
    }
    return [
      `Observable candidate signals: ${cues.map((cue) => cue.id).join(", ")}.`,
      ...cues.map((cue) => cue.guidance),
      "Treat these as conversational signals, not facts about the candidate's internal emotional state. Never diagnose, label, or mention an inferred emotion."
    ].join(" ");
  }

  return { observeSocialCues, socialCuePrompt };
});
