export const RUBRIC = [
  "Problem framing & scope",
  "User focus & insight",
  "Clarifying questions & assumptions",
  "Information architecture & journey",
  "Core solution & interaction flow",
  "Edge cases, accessibility & scale",
  "Tradeoffs, constraints & rationale",
  "Communication & design narrative",
  "Collaboration & adaptability"
];

const BASE_GUIDANCE = {
  "Problem framing & scope": "Defines the problem, goal, boundaries, success measures, and product or business context before solving.",
  "User focus & insight": "Identifies primary users, motivations, context, pain points, and bases decisions on user needs rather than assumptions alone.",
  "Clarifying questions & assumptions": "Asks focused questions, makes uncertainty explicit, and prioritizes assumptions that materially affect the solution.",
  "Information architecture & journey": "Organizes information and maps a coherent end-to-end journey before going deep on screens.",
  "Core solution & interaction flow": "Develops a useful, usable primary flow with clear decisions, hierarchy, states, and cross-surface continuity where relevant.",
  "Edge cases, accessibility & scale": "Accounts for failure states, accessibility, trust, privacy, technical realities, ecosystem fit, and scale where relevant.",
  "Tradeoffs, constraints & rationale": "Explores alternatives, responds to evolving constraints, and explains why the chosen direction is stronger.",
  "Communication & design narrative": "Thinks aloud clearly, connects the board to the argument, manages time, and lands a concise summary.",
  "Collaboration & adaptability": "Engages the interviewer as a partner, incorporates feedback, and adjusts the solution without losing coherence."
};

const COMPANY_PROFILES = {
  Google: {
    signals: "user-centered problem framing, structured exploration, useful and usable flows, systems thinking, accessibility, scale, evidence, collaboration, and adaptation to constraints",
    emphasis: {
      "Information architecture & journey": "Look for a clear end-to-end journey and coherent behavior across relevant surfaces or ecosystem touchpoints.",
      "Edge cases, accessibility & scale": "Look for inclusive design, failure recovery, trust, technical feasibility, and behavior at large scale.",
      "Tradeoffs, constraints & rationale": "Look for explicit rationale supported by user needs, constraints, and measurable outcomes."
    }
  },
  Meta: {
    signals: "product sense, clear prioritization, social and network dynamics, rapid iteration, impact, integrity, collaboration, and decisive tradeoffs",
    emphasis: {
      "User focus & insight": "Look for well-chosen user segments, behavioral motivations, social context, and network effects where relevant.",
      "Core solution & interaction flow": "Look for a focused, high-impact core experience that can be tested and iterated quickly.",
      "Edge cases, accessibility & scale": "Look for integrity, privacy, abuse prevention, accessibility, international use, and operation at scale.",
      "Tradeoffs, constraints & rationale": "Look for decisive prioritization, experiment design, success metrics, and consideration of ecosystem effects."
    }
  },
  Apple: {
    signals: "human-centered clarity, simplicity, craft in interaction behavior, accessibility, privacy, platform coherence, thoughtful details, and strong rationale",
    emphasis: {
      "Information architecture & journey": "Look for simplicity, progressive disclosure, and a coherent journey that respects familiar platform conventions.",
      "Core solution & interaction flow": "Look for intuitive interaction behavior, clear hierarchy, and careful handling of key moments without judging visual polish.",
      "Edge cases, accessibility & scale": "Look for accessibility, privacy, safety, offline or interruption behavior, and consistency across relevant devices.",
      "Tradeoffs, constraints & rationale": "Look for disciplined reduction, attention to user trust, and a strong explanation of why each interaction belongs."
    }
  },
  Netflix: {
    signals: "consumer insight, entertainment discovery, personalization, experimentation, global audiences, business impact, candid reasoning, and informed judgment",
    emphasis: {
      "User focus & insight": "Look for nuanced understanding of audience intent, context, taste, and differences across households or markets.",
      "Core solution & interaction flow": "Look for a direct, low-friction path to user value and clear handling of personalization or discovery where relevant.",
      "Edge cases, accessibility & scale": "Look for global and multilingual use, accessibility, varying devices and connectivity, account or household complexity, and trust.",
      "Tradeoffs, constraints & rationale": "Look for testable hypotheses, meaningful success metrics, business impact, and explicit judgment under ambiguity."
    }
  }
};

export async function evaluateSession(body, env = process.env, options = {}) {
  if (!env.OPENAI_API_KEY) throw httpError(503, "OPENAI_API_KEY is missing on the server.");
  validateBody(body);

  const company = normalizeCompany(body.company);
  const profile = COMPANY_PROFILES[company];
  const baseContent = [
    {
      type: "input_text",
      text: buildEvaluationInput(body)
    }
  ];
  if (body.canvasImage) {
    baseContent.push({ type: "input_image", image_url: body.canvasImage, detail: "high" });
  }
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  let retryFeedback = "";
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const content = [...baseContent];
    if (retryFeedback) {
      content.push({
        type: "input_text",
        text: `Your previous evaluation was rejected by consistency validation: ${retryFeedback}. Re-evaluate the evidence and return a complete corrected result. Do not merely raise scores; make every integer score and rationale agree.`
      });
    }
    const apiResponse = await fetchImpl("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: env.OPENAI_EVALUATION_MODEL || "gpt-5-mini",
        instructions: evaluationInstructions(company, profile),
        input: [{ role: "user", content }],
        text: evaluationTextFormat()
      })
    });
    const draft = await parseEvaluationResponse(apiResponse);
    const errors = evaluationConsistencyErrors(draft);
    if (!errors.length) return finalizeEvaluation(draft);
    retryFeedback = errors.join("; ");
  }
  throw httpError(502, `OpenAI returned an internally inconsistent evaluation after retry: ${retryFeedback}`);
}

function evaluationInstructions(company, profile) {
  return [
    "You are a rigorous product-design whiteboarding interview evaluator.",
    "Treat the transcript as the primary evidence for reasoning and the rendered canvas image as the primary evidence for the visual artifact. Use scene JSON only to verify exact labels, timestamps, and bindings.",
    "Actually inspect the canvas image for hand-drawn wireframes, handwritten annotations, hierarchy, spatial grouping, and visual flows. Do not penalize freedraw merely because scene JSON lacks labels when the image communicates recognizable structure.",
    "Never judge visual polish, drawing skill, aesthetics, handwriting, or pixel quality.",
    "Do not infer work that is neither said nor visible. Score missing evidence conservatively.",
    "Treat only structured connectors marked connectionStatus 'verified' as exact flow connections. Connectors marked degenerate, unbound, ambiguous-endpoint, or self-binding are not flow evidence even if raw bindings exist. The rendered image may still show a separate visible flow, but do not infer one from rejected scene data.",
    "Excalidraw stores bound labels as separate text elements. Use each shape's resolvedLabel when present; do not call a shape unlabeled merely because its own raw label field is empty.",
    "Rectangle elements marked inferredRole 'probable-phone-wireframe' or 'screen-like-wireframe' are geometry-based cues, not ground truth. Confirm them against the rendered image and their containedLabels/containedElementCount before describing them as screens. Do not treat every rectangle as a screen.",
    "Do not expose raw element IDs in feedback. Refer to visible labels, element types, or board regions.",
    "Use only integer scores: 1 means materially absent or counterproductive, 2 means emerging with major gaps, 3 means adequate interview-level evidence, 4 means strong and well-supported, and 5 means exceptional with no material gaps.",
    "Each criterion object must contain its integer score and the rationale that directly justifies that same score. If the rationale calls evidence clear, explicit, strong, shows good attention, or quantitative, the score must be at least 3. If multiple material gaps are named, the score cannot be 5.",
    "When voice was attempted but no candidate transcript was captured, use score 1 with confidence 'insufficient' for transcript-dependent criteria. State that evidence was unavailable rather than characterizing the candidate's behavior.",
    "For every rubric score, cite brief, concrete evidence from the transcript or canvas.",
    `Calibrate this evaluation to publicly available ${company} product-design interview signals: ${profile.signals}.`,
    `This is a practice rubric tailored to ${company}; it is not an official, proprietary, or leaked ${company} hiring rubric and must not be described as one.`,
    "Do not generate an overall score. The application computes it from the nine criterion scores.",
    "Return only data matching the requested JSON schema."
  ].join(" ");
}

function evaluationTextFormat() {
  return {
    format: {
      type: "json_schema",
      name: "whiteboard_evaluation",
      strict: true,
      schema: {
        type: "object",
        additionalProperties: false,
        required: ["summary", "strongestMoment", "priorityImprovement", "scores"],
        properties: {
          summary: { type: "string" },
          strongestMoment: { type: "string" },
          priorityImprovement: { type: "string" },
          scores: {
            type: "array",
            minItems: 9,
            maxItems: 9,
            items: {
              type: "object",
              additionalProperties: false,
              required: ["label", "score", "rationale", "evidence", "confidence"],
              properties: {
                label: { type: "string", enum: RUBRIC },
                score: { type: "integer", minimum: 1, maximum: 5 },
                rationale: { type: "string" },
                evidence: { type: "string" },
                confidence: { type: "string", enum: ["high", "medium", "low", "insufficient"] }
              }
            }
          }
        }
      }
    }
  };
}

async function parseEvaluationResponse(apiResponse) {
  const responseBody = await apiResponse.json().catch(() => ({}));
  if (!apiResponse.ok) {
    const message = responseBody?.error?.message || "OpenAI could not evaluate this session.";
    throw httpError(apiResponse.status, message);
  }
  const outputText = responseBody.output_text || responseBody.output
    ?.flatMap((item) => item.content || [])
    .find((item) => item.type === "output_text")?.text;
  if (!outputText) throw httpError(502, "OpenAI returned an empty evaluation.");
  try {
    return JSON.parse(outputText);
  } catch {
    throw httpError(502, "OpenAI returned an invalid evaluation.");
  }
}

export function evaluationConsistencyErrors(evaluation) {
  const errors = [];
  if (!Array.isArray(evaluation?.scores) || evaluation.scores.length !== RUBRIC.length) return ["exactly nine criterion objects are required"];
  const seen = new Set();
  evaluation.scores.forEach((row, index) => {
    const expectedLabel = RUBRIC[index];
    if (row?.label !== expectedLabel) errors.push(`criterion ${index + 1} must be '${expectedLabel}'`);
    if (seen.has(row?.label)) errors.push(`criterion '${row?.label || index + 1}' is duplicated`);
    seen.add(row?.label);
    if (!Number.isInteger(row?.score) || row.score < 1 || row.score > 5) errors.push(`${expectedLabel} score must be an integer from 1 to 5`);
    if (typeof row?.rationale !== "string" || !row.rationale.trim()) errors.push(`${expectedLabel} rationale is required`);
    if (typeof row?.evidence !== "string" || !row.evidence.trim()) errors.push(`${expectedLabel} evidence is required`);
    if (Number(row?.score) < 3 && rationaleContainsPositiveSignal(row?.rationale || "")) {
      errors.push(`${expectedLabel} uses positive-signal language with a score below 3`);
    }
  });
  return errors;
}

function rationaleContainsPositiveSignal(rationale) {
  const patterns = [/\bclear(?:ly)?\b/gi, /\bexplicit(?:ly)?\b/gi, /\bstrong\b/gi, /\bgood attention\b/gi, /\bquantitative\b/gi];
  return patterns.some((pattern) => [...rationale.matchAll(pattern)].some((match) => {
    const prefix = rationale.slice(Math.max(0, match.index - 36), match.index).toLowerCase();
    return !/\b(?:no|not|never|without|lacks?|lacking|limited|little|insufficient|unclear|weak)\s+(?:\w+\s+){0,2}$/.test(prefix);
  }));
}

export function finalizeEvaluation(evaluation) {
  const scores = evaluation.scores.map((row) => ({ ...row, score: Number(row.score) }));
  const overall = Math.round((scores.reduce((sum, row) => sum + row.score, 0) / scores.length) * 10) / 10;
  return {
    summary: evaluation.summary || "",
    strongestMoment: evaluation.strongestMoment || "",
    priorityImprovement: evaluation.priorityImprovement || "",
    scores,
    overall
  };
}

function buildEvaluationInput(body) {
  const company = normalizeCompany(body.company);
  const profile = COMPANY_PROFILES[company];
  const transcript = body.transcript
    .slice(-160)
    .map((turn) => `[${Math.round((Number(turn.at) || 0) / 1000)}s] ${turn.role === "candidate" ? "Candidate" : "Interviewer"}: ${String(turn.text || "").trim()}`)
    .join("\n");
  const sceneElements = describeSceneElements(body.sceneElements, 160);
  const checkpoints = (body.canvasCheckpoints || []).slice(-120).map((checkpoint) => ({
    atMinutes: Math.round((Number(checkpoint.atMs) || 0) / 6000) / 10,
    phase: checkpoint.phaseLabel || checkpoint.phaseId || "",
    reason: checkpoint.reason || "interval",
    elementCount: Number(checkpoint.elementCount) || 0,
    summary: checkpoint.summary || "",
    elements: Array.isArray(checkpoint.elements) ? describeSceneElements(checkpoint.elements, 120) : []
  }));
  return [
    `Selected company: ${company}`,
    `Challenge: ${body.prompt}`,
    `Session duration: ${((Number(body.elapsedMs) || 0) / 60000).toFixed(1)} minutes`,
    `Voice capture attempted: ${Boolean(body.voiceAttempted)}`,
    `Rendered canvas image attached: ${Boolean(body.canvasImage)}`,
    `Pinned constraints: ${JSON.stringify(body.constraints || [])}`,
    "",
    "Transcript (primary evidence):",
    transcript || "No transcript was captured.",
    "",
    "Readable Excalidraw scene summary:",
    body.sceneSummary || "No structured scene was captured.",
    "",
    "Structured scene elements:",
    JSON.stringify(sceneElements),
    "",
    "Timestamped canvas checkpoints (use to assess order of work, phase transitions, revision, and adaptation—not visual polish):",
    JSON.stringify(checkpoints),
    "",
    "Score exactly these nine areas in this order:",
    ...RUBRIC.map((label) => `${label}: ${BASE_GUIDANCE[label]} ${profile.emphasis[label] || ""}`.trim())
  ].join("\n");
}

export function describeSceneElements(elements, limit) {
  const normalized = elements.slice(0, limit).map((element) => ({
    id: String(element.id || ""),
    type: String(element.type || "element"),
    label: String(element.text || "").trim(),
    position: { x: Number(element.x) || 0, y: Number(element.y) || 0 },
    size: { width: Number(element.width) || 0, height: Number(element.height) || 0 },
    startBinding: bindingId(element.startBinding),
    endBinding: bindingId(element.endBinding),
    boundElements: Array.isArray(element.boundElements) ? element.boundElements.map(bindingId).filter(Boolean) : [],
    containerId: String(element.containerId || ""),
    groupIds: Array.isArray(element.groupIds) ? element.groupIds : [],
    frameId: String(element.frameId || ""),
    points: Array.isArray(element.points) ? element.points.slice(0, 40) : []
  }));
  const byId = new Map(normalized.map((element) => [element.id, element]));
  const labels = evaluationLabelsByContainer(normalized, byId);
  const screenCandidates = detectEvaluationScreens(normalized, labels);
  const screensById = new Map(screenCandidates.map((screen) => [screen.element.id, screen]));
  return normalized.map((element) => {
    const resolvedLabel = labels.get(element.id) || element.label;
    const screen = screensById.get(element.id);
    const semantics = screen ? {
      inferredRole: screen.role,
      containedElementCount: screen.containedCount,
      containedLabels: screen.containedLabels
    } : {};
    if (!isEvaluationConnector(element)) return { ...element, resolvedLabel, ...semantics };
    const connection = analyzeEvaluationConnector(element, byId, labels);
    return {
      ...element,
      resolvedLabel,
      ...semantics,
      connectionStatus: connection.status,
      connection: connection.status === "verified" ? { from: connection.fromLabel, to: connection.toLabel } : null
    };
  });
}

function bindingId(binding) {
  if (typeof binding === "string") return binding;
  return binding?.elementId ? String(binding.elementId) : binding?.id ? String(binding.id) : "";
}

function isEvaluationConnector(element) {
  return element?.type === "arrow" || element?.type === "line";
}

function isEvaluationShape(element) {
  return Boolean(element && !["text", "arrow", "line", "freedraw", "draw"].includes(element.type));
}

function evaluationLabelsByContainer(elements, byId) {
  const labels = new Map();
  elements.filter((element) => element.type === "text" && element.label).forEach((textElement) => {
    if (textElement.containerId && byId.has(textElement.containerId)) labels.set(textElement.containerId, textElement.label);
  });
  elements.filter(isEvaluationShape).forEach((shape) => {
    if (labels.has(shape.id)) return;
    const boundLabel = shape.boundElements.map((id) => byId.get(id)).find((element) => element?.type === "text" && element.label);
    if (boundLabel) labels.set(shape.id, boundLabel.label);
  });
  return labels;
}

function evaluationBounds(element) {
  const left = element.position.x;
  const top = element.position.y;
  const width = Math.abs(element.size.width);
  const height = Math.abs(element.size.height);
  return { left, top, right: left + width, bottom: top + height, width, height, area: width * height };
}

function evaluationElementInside(inner, outer, inset = 4) {
  const innerBounds = evaluationBounds(inner);
  const outerBounds = evaluationBounds(outer);
  const centerX = innerBounds.left + innerBounds.width / 2;
  const centerY = innerBounds.top + innerBounds.height / 2;
  return centerX >= outerBounds.left + inset && centerX <= outerBounds.right - inset && centerY >= outerBounds.top + inset && centerY <= outerBounds.bottom - inset;
}

function detectEvaluationScreens(elements, labels) {
  const textElements = elements.filter((element) => element.type === "text" && element.label);
  const screenCue = /\b(screen|home|dashboard|profile|detail|results?|search|settings|checkout|login|sign[ -]?in|nav|menu|button|card|modal|empty state|error state|success)\b/i;
  const candidates = elements
    .filter((element) => element.type === "rectangle")
    .map((element) => {
      const bounds = evaluationBounds(element);
      const contained = elements.filter((candidate) => {
        if (candidate.id === element.id || isEvaluationConnector(candidate)) return false;
        if (candidate.type === "text" && candidate.containerId === element.id) return false;
        return evaluationElementInside(candidate, element);
      });
      const containedLabels = textElements
        .filter((textElement) => textElement.containerId !== element.id && evaluationElementInside(textElement, element))
        .map((textElement) => textElement.label)
        .filter(Boolean)
        .slice(0, 8);
      const labelText = [labels.get(element.id) || "", ...containedLabels].join(" ");
      const phoneLike = bounds.width >= 96 && bounds.height >= 160 && bounds.height / Math.max(1, bounds.width) >= 1.35;
      const populatedFrame = bounds.width >= 140 && bounds.height >= 110 && contained.length >= 3 && screenCue.test(labelText);
      if (!phoneLike && !populatedFrame) return null;
      if (phoneLike && contained.length === 0 && !screenCue.test(labelText)) return null;
      return {
        element,
        bounds,
        role: phoneLike ? "probable-phone-wireframe" : "screen-like-wireframe",
        containedCount: contained.length,
        containedLabels
      };
    })
    .filter(Boolean);
  return candidates.filter((candidate) => !candidates.some((outer) => {
    if (outer.element.id === candidate.element.id || outer.bounds.area < candidate.bounds.area * 1.5) return false;
    return evaluationElementInside(candidate.element, outer.element, 0);
  }));
}

function evaluationConnectorSpan(element) {
  const width = Math.abs(element.size.width);
  const height = Math.abs(element.size.height);
  const points = element.points;
  const pointSpan = points.length > 1
    ? Math.hypot((Number(points.at(-1)?.[0]) || 0) - (Number(points[0]?.[0]) || 0), (Number(points.at(-1)?.[1]) || 0) - (Number(points[0]?.[1]) || 0))
    : 0;
  return Math.max(Math.hypot(width, height), pointSpan);
}

function resolveEvaluationBinding(binding, byId) {
  const target = byId.get(binding);
  if (!target) return null;
  if (target.type === "text") {
    const container = target.containerId ? byId.get(target.containerId) : null;
    return container && isEvaluationShape(container) ? container : null;
  }
  return isEvaluationShape(target) ? target : null;
}

function evaluationElementLabel(element, labels) {
  return labels.get(element.id) || element.label || `${element.type} near (${Math.round(element.position.x)}, ${Math.round(element.position.y)})`;
}

function analyzeEvaluationConnector(element, byId, labels) {
  if (evaluationConnectorSpan(element) < 12) return { status: "degenerate" };
  if (!element.startBinding || !element.endBinding) return { status: "unbound" };
  const from = resolveEvaluationBinding(element.startBinding, byId);
  const to = resolveEvaluationBinding(element.endBinding, byId);
  if (!from || !to) return { status: "ambiguous-endpoint" };
  if (from.id === to.id) return { status: "self-binding" };
  return {
    status: "verified",
    fromLabel: evaluationElementLabel(from, labels),
    toLabel: evaluationElementLabel(to, labels)
  };
}

function normalizeCompany(company) {
  return Object.hasOwn(COMPANY_PROFILES, company) ? company : "Google";
}

function validateBody(body) {
  if (!body || typeof body !== "object") throw httpError(400, "Invalid evaluation request.");
  if (typeof body.prompt !== "string" || !body.prompt.trim()) throw httpError(400, "The interview prompt is required.");
  if (body.company !== undefined && typeof body.company !== "string") throw httpError(400, "The selected company is invalid.");
  if (!Array.isArray(body.transcript) || !Array.isArray(body.sceneElements)) throw httpError(400, "Transcript and scene data must be arrays.");
  if (body.canvasCheckpoints !== undefined && !Array.isArray(body.canvasCheckpoints)) throw httpError(400, "Canvas checkpoints must be an array.");
  if (body.canvasImage && (!body.canvasImage.startsWith("data:image/png;base64,") || body.canvasImage.length > 3_500_000)) {
    throw httpError(413, "The canvas screenshot is invalid or too large.");
  }
}

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}
