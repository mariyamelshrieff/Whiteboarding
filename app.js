const scenarios = [
  {
    id: "google-data-center-anomaly-dashboard",
    prompt: "Design a 0-1 centralized, intelligent dashboard for Google's global cloud data-center technicians to predict, isolate, and manually override server hardware anomalies before they cascade.",
    truth: {
      object: "A mission-critical operations dashboard for anomaly prediction, triage, isolation, and manual override across global cloud data centers.",
      who: "Google Cloud data-center technicians, site reliability engineers, incident commanders, and hardware operations leads.",
      platform: "Dense desktop command-center UI with mobile/pager handoffs and low-latency alert surfaces.",
      goal: "Help operators detect cascading hardware anomalies early, understand confidence and blast radius, and take safe manual action under time pressure.",
      constraint: "The UI must support massive data density, extreme accessibility standards, low-latency critical interactions, and clear human override paths.",
      curveball: "The model has a 12% false-positive rate on one anomaly class, and a regional network event is delaying telemetry by 5 seconds."
    }
  },
  {
    id: "google-travel-flight-delay-remediation",
    prompt: "Design a seamless, ambient flight-delay remediation experience for Google Travel that spans a Pixel Watch, an Android lock screen, and a Google Home smart display.",
    truth: {
      object: "A cross-surface travel disruption assistant that detects flight delays and helps users remediate with minimal cognitive load.",
      who: "Travelers in high-stress airport, transit, home, and family-coordination contexts.",
      platform: "Pixel Watch, Android lock screen, Google Home smart display, Google Travel, Assistant, Gmail, Calendar, and notifications.",
      goal: "Prioritize the right intervention at the right moment while preserving user trust, privacy, and control.",
      constraint: "The experience must handle low bandwidth, international travel, accessibility needs, and cross-device continuity without overwhelming the user.",
      curveball: "The user is roaming internationally on spotty 3G, and Assistant confidence drops because the itinerary email is partially parsed."
    }
  },
  {
    id: "appeal-policy",
    prompt: "Design a system for appealing a policy violation.",
    truth: {
      object: "An appeals workflow for users or admins who believe an automated policy decision was wrong.",
      who: "Creators, business admins, and internal reviewers.",
      platform: "Web first, with email and notification touchpoints.",
      goal: "Help users understand the decision, submit the right evidence, and track review status without overwhelming reviewers.",
      constraint: "The system must avoid exposing abuse-detection details that could help bad actors.",
      curveball: "New constraint: enterprise admins need to appeal on behalf of multiple affected users at once."
    }
  },
  {
    id: "hacked-account",
    prompt: "Design how users recover a hacked account.",
    truth: {
      object: "An account recovery flow after suspected takeover.",
      who: "Everyday users plus Workspace admins helping employees recover access.",
      platform: "Mobile and web, with email/SMS/security-key handoffs.",
      goal: "Restore legitimate access while preventing attackers from exploiting recovery.",
      constraint: "Users are stressed and may have lost access to their primary email or phone.",
      curveball: "Curveball: the attacker has already changed recovery information."
    }
  },
  {
    id: "ai-agent-dashboard",
    prompt: "Design a dashboard for monitoring AI agents.",
    truth: {
      object: "A monitoring surface for AI agents completing business tasks.",
      who: "Operations leads, admins, and IC owners responsible for AI-assisted workflows.",
      platform: "Enterprise web dashboard with alert and audit trails.",
      goal: "Make agent status, risk, handoffs, and human review needs visible.",
      constraint: "Not every AI failure is obvious; confidence and impact need to be interpretable.",
      curveball: "Curveball: one agent starts taking repeated actions that are technically valid but harmful to the business."
    }
  },
  {
    id: "enterprise-admin-onboarding",
    prompt: "Design onboarding for enterprise administrators.",
    truth: {
      object: "A first-run setup and education flow for admins configuring a product for an organization.",
      who: "New enterprise admins, often IT or RevOps, setting up teams, permissions, and policies.",
      platform: "Desktop web.",
      goal: "Get admins to a secure, usable configuration without forcing them to understand every setting up front.",
      constraint: "Admins may inherit a messy organization and need confidence before inviting users.",
      curveball: "Curveball: the admin has to configure multiple departments with different policies."
    }
  },
  {
    id: "gmail-search",
    prompt: "Improve Gmail search for enterprise users.",
    truth: {
      object: "A better Gmail search and refinement experience.",
      who: "Enterprise users searching across large mail histories, attachments, and shared context.",
      platform: "Gmail web, with possible mobile follow-up.",
      goal: "Help users find the right message, file, or thread faster with less query expertise.",
      constraint: "Search results may include sensitive data and permission boundaries.",
      curveball: "Curveball: legal and compliance teams need auditable search behavior."
    }
  },
  {
    id: "calendar-scheduling",
    prompt: "Improve Google Calendar scheduling for first-time users.",
    truth: {
      object: "A scheduling flow that helps people create meetings without understanding Calendar power features.",
      who: "New or infrequent Calendar users coordinating with several attendees.",
      platform: "Calendar web and mobile.",
      goal: "Reduce scheduling back-and-forth and help users pick a good time confidently.",
      constraint: "Availability, time zones, and working hours can conflict.",
      curveball: "Curveball: one attendee has limited visibility into their calendar due to privacy settings."
    }
  },
  {
    id: "drive-permissions",
    prompt: "Improve Google Drive permissions.",
    truth: {
      object: "A clearer model for sharing, access review, and permission changes.",
      who: "Workspace users and admins managing files across teams.",
      platform: "Drive web with Docs/Sheets sharing surfaces.",
      goal: "Help users share confidently without accidentally exposing sensitive files.",
      constraint: "Permission inheritance is powerful but hard to understand.",
      curveball: "Curveball: a file is shared through multiple folders and groups with conflicting access expectations."
    }
  },
  {
    id: "workspace-collaboration",
    prompt: "Design collaboration across Docs, Meet, and Chat.",
    truth: {
      object: "A cross-product collaboration system rather than a single screen.",
      who: "Teams moving between async writing, live meetings, and chat follow-ups.",
      platform: "Google Workspace across desktop and mobile.",
      goal: "Preserve context and decisions as work moves across products.",
      constraint: "People join and leave collaboration at different times with different permissions.",
      curveball: "Curveball: users need to find one decision made across a meeting, chat thread, and document comment."
    }
  },
  {
    id: "notification-priority",
    prompt: "Design notification priorities across Google Workspace.",
    truth: {
      object: "A system for ranking, grouping, and explaining notifications.",
      who: "Knowledge workers receiving email, chat, calendar, document, and task alerts.",
      platform: "Workspace web, mobile notifications, and email summaries.",
      goal: "Help users notice what matters without losing trust or missing urgent work.",
      constraint: "Importance is contextual and changes by role, time, and relationship.",
      curveball: "Curveball: a notification is low priority most days but critical during an incident."
    }
  },
  {
    id: "ai-email-prioritization",
    prompt: "Design AI that helps prioritize email.",
    truth: {
      object: "An AI-assisted priority layer for inbox triage.",
      who: "Busy professionals managing high email volume.",
      platform: "Gmail web and mobile.",
      goal: "Surface urgent, important, and action-required emails while preserving user control.",
      constraint: "AI confidence and explainability matter because missed email can be costly.",
      curveball: "Curveball: the AI deprioritizes an email that later becomes business-critical."
    }
  },
  {
    id: "ai-research-assistant",
    prompt: "Design an AI research assistant.",
    truth: {
      object: "An assistant that helps synthesize, cite, and compare research sources.",
      who: "Product teams, analysts, students, and enterprise researchers.",
      platform: "Web app integrated with Docs or Drive.",
      goal: "Help users move from broad question to reliable synthesis with traceable evidence.",
      constraint: "The assistant can be wrong or overconfident, so provenance and uncertainty are essential.",
      curveball: "Curveball: two high-quality sources disagree and the assistant needs to help the user decide what to trust."
    }
  },
  {
    id: "crm-meeting-prep",
    prompt: "Design an experience for a sales rep preparing for a customer meeting.",
    truth: {
      object: "A meeting-prep workflow for sales reps using CRM and company knowledge.",
      who: "Sales reps and account owners preparing for customer calls.",
      platform: "CRM web, calendar integration, and possibly mobile before the meeting.",
      goal: "Help reps understand account history, risks, open opportunities, and suggested next steps quickly.",
      constraint: "Customer data can be stale, duplicated, or owned by multiple teams.",
      curveball: "Curveball: two account owners have conflicting notes about the customer’s priority."
    }
  },
  {
    id: "crm-follow-up",
    prompt: "Design follow-up after a customer call.",
    truth: {
      object: "A post-call workflow that captures notes, commitments, and next steps.",
      who: "Sales reps, customer success managers, and account teams.",
      platform: "CRM plus email/calendar integrations.",
      goal: "Turn call outcomes into accurate CRM updates and timely customer follow-up.",
      constraint: "Reps resist extra data entry and may not trust automated summaries.",
      curveball: "Curveball: the call summary contains an AI-generated mistake that could damage the customer relationship."
    }
  },
  {
    id: "permission-model",
    prompt: "Design a reusable permission model.",
    truth: {
      object: "A reusable permissions framework for users, groups, roles, and exceptions.",
      who: "Admins, team leads, and collaborators across enterprise products.",
      platform: "Enterprise web settings and sharing surfaces.",
      goal: "Make access understandable, scalable, and safe across products.",
      constraint: "Simple presets are easy, but enterprise customers need granular control.",
      curveball: "Curveball: temporary external collaborators need access that expires automatically."
    }
  },
  {
    id: "ai-explanations",
    prompt: "Design a reusable component for AI explanations.",
    truth: {
      object: "A pattern for explaining AI output, confidence, sources, and user controls.",
      who: "Users reviewing AI suggestions in productivity and enterprise tools.",
      platform: "Reusable component across web product surfaces.",
      goal: "Help users decide whether to trust, inspect, accept, edit, or reject AI output.",
      constraint: "Too much explanation creates clutter; too little explanation erodes trust.",
      curveball: "Curveball: the explanation must work for both expert admins and first-time users."
    }
  }
];

const phasePlans = {
  express: [
    { id: "frame", label: "Framing", ms: 4 * 60 * 1000 },
    { id: "explore", label: "Exploration", ms: 6 * 60 * 1000 },
    { id: "deep", label: "Deep dive", ms: 5 * 60 * 1000 },
    { id: "push", label: "Pushback", ms: 3 * 60 * 1000 },
    { id: "wrap", label: "Wrap-up", ms: 2 * 60 * 1000 }
  ],
  full: [
    { id: "frame", label: "Framing", ms: 8 * 60 * 1000 },
    { id: "explore", label: "Exploration", ms: 12 * 60 * 1000 },
    { id: "deep", label: "Deep dive", ms: 12 * 60 * 1000 },
    { id: "push", label: "Pushback", ms: 8 * 60 * 1000 },
    { id: "wrap", label: "Wrap-up", ms: 5 * 60 * 1000 }
  ]
};

const state = {
  scenarioIndex: 0,
  difficulty: "hard",
  mode: "full",
  started: false,
  ended: false,
  transcript: [],
  revealed: new Set(),
  curveballUsed: false,
  phaseIndex: 0,
  phaseElapsed: 0,
  elapsed: 0,
  lastInterjectionAt: 0,
  lastCandidateAt: 0,
  lastCandidateQuestionAt: 0,
  timer: null,
  tool: "select",
  drawing: false,
  selectedId: null,
  textEditing: null,
  camera: { x: 0, y: 0, scale: 1 },
  strokes: [],
  redoStack: [],
  activeStroke: null,
  lastPoint: null,
  boardElements: [],
  boardText: "",
  boardSummary: "",
  lastBoardActivityAt: 0,
  boardPrompted: false,
  firstBoardNudgeAt: 0,
  voiceRunId: 0,
  realtime: null,
  realtimeReady: false,
  realtimeConnecting: false,
  realtimeResponseActive: false,
  localStream: null,
  remoteStream: null,
  remoteAudio: null,
  listening: false,
  voiceAvailable: false,
  noSpeechTimer: null,
  transcriptText: "",
  interimText: "",
  interviewerDraft: "",
  loggedCandidateItems: new Set(),
  guidanceCount: 0
};

const els = {
  promptTitle: document.querySelector("#promptTitle"),
  shuffleChallenge: document.querySelector("#shuffleChallenge"),
  difficultySelect: document.querySelector("#difficultySelect"),
  modeSelect: document.querySelector("#modeSelect"),
  startSession: document.querySelector("#startSession"),
  endSession: document.querySelector("#endSession"),
  phaseName: document.querySelector("#phaseName"),
  phaseHint: document.querySelector("#phaseHint"),
  sessionClock: document.querySelector("#sessionClock"),
  interviewerState: document.querySelector("#interviewerState"),
  budgetLabel: document.querySelector("#budgetLabel"),
  interviewerLog: document.querySelector("#interviewerLog"),
  candidateInput: document.querySelector("#candidateInput"),
  sendTurn: document.querySelector("#sendTurn"),
  voiceToggle: document.querySelector("#voiceToggle"),
  voiceStatus: document.querySelector("#voiceStatus"),
  micHelp: document.querySelector("#micHelp"),
  listeningTitle: document.querySelector("#listeningTitle"),
  heardPreview: document.querySelector("#heardPreview"),
  transcriptDrawer: document.querySelector("#transcriptDrawer"),
  liveTranscript: document.querySelector("#liveTranscript"),
  scorecard: document.querySelector("#scorecard"),
  overallScore: document.querySelector("#overallScore"),
  scoreRows: document.querySelector("#scoreRows"),
  nextNotes: document.querySelector("#nextNotes"),
  screenReaderStatus: document.querySelector("#screenReaderStatus"),
  undoBoard: document.querySelector("#undoBoard"),
  redoBoard: document.querySelector("#redoBoard"),
  zoomOut: document.querySelector("#zoomOut"),
  zoomIn: document.querySelector("#zoomIn"),
  zoomLevel: document.querySelector("#zoomLevel"),
  boardTextEditor: document.querySelector("#boardTextEditor"),
  excalidrawMount: document.querySelector("#excalidrawMount"),
  boardLoading: document.querySelector("#boardLoading"),
  board: document.querySelector("#board")
};

const ctx = els.board?.getContext("2d");
const theme = getComputedStyle(document.documentElement);

function init() {
  window.speechSynthesis?.cancel();
  bindEvents();
  setupVoice();
  setupBoard();
  render();
}

function bindEvents() {
  els.shuffleChallenge.addEventListener("click", shuffleChallenge);
  els.difficultySelect.addEventListener("change", () => {
    state.difficulty = els.difficultySelect.value;
  });
  els.modeSelect.addEventListener("change", () => {
    state.mode = els.modeSelect.value;
    resetSession();
  });
  els.startSession.addEventListener("click", startSession);
  els.endSession.addEventListener("click", endSession);
  els.sendTurn.addEventListener("click", submitCandidateTurn);
  els.voiceToggle.addEventListener("click", toggleVoice);
  els.undoBoard?.addEventListener("click", undoBoard);
  els.redoBoard?.addEventListener("click", redoBoard);
  els.zoomOut?.addEventListener("click", () => zoomBoard(0.88));
  els.zoomIn?.addEventListener("click", () => zoomBoard(1.14));
  els.boardTextEditor?.addEventListener("blur", commitBoardText);
  els.boardTextEditor?.addEventListener("keydown", handleBoardTextKeydown);
  els.candidateInput.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") submitCandidateTurn();
  });
  document.querySelectorAll(".tool").forEach((button) => {
    if (button.classList.contains("action-tool")) return;
    button.addEventListener("click", () => {
      commitBoardText();
      state.tool = button.dataset.tool;
      document.querySelectorAll(".tool").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
    });
  });
}

function startSession() {
  if (state.started) return;
  if (state.ended) resetSession();
  state.started = true;
  state.ended = false;
  state.lastCandidateAt = Date.now();
  state.lastInterjectionAt = 0;
  logMessage("interviewer", openingLine());
  announce(`Interviewer: ${openingLine()}`);
  setListeningState("requesting", "Requesting microphone", "Allow microphone access if your browser asks. I will keep listening while you draw.");
  startListening();
  state.timer = setInterval(tick, 1000);
  render();
}

function endSession() {
  if (!state.started) return;
  state.ended = true;
  state.started = false;
  clearInterval(state.timer);
  state.timer = null;
  stopListening();
  showDebrief();
  render();
}

function resetSession() {
  clearInterval(state.timer);
  stopListening();
  Object.assign(state, {
    started: false,
    ended: false,
    transcript: [],
    revealed: new Set(),
    curveballUsed: false,
    phaseIndex: 0,
    phaseElapsed: 0,
    elapsed: 0,
    lastInterjectionAt: 0,
    lastCandidateAt: 0,
    lastCandidateQuestionAt: 0,
    timer: null,
    strokes: [],
    redoStack: [],
    activeStroke: null,
    boardElements: [],
    boardText: "",
    boardSummary: "",
    selectedId: null,
    textEditing: null,
    lastBoardActivityAt: 0,
    boardPrompted: false,
    firstBoardNudgeAt: 0,
    voiceRunId: state.voiceRunId,
    realtime: null,
    realtimeReady: false,
    realtimeConnecting: false,
    realtimeResponseActive: false,
    localStream: null,
    remoteStream: null,
    remoteAudio: null,
    listening: false,
    noSpeechTimer: null,
    transcriptText: "",
    interimText: "",
    interviewerDraft: "",
    loggedCandidateItems: new Set(),
    guidanceCount: 0
  });
  els.interviewerLog.innerHTML = "";
  els.candidateInput.value = "";
  els.liveTranscript.textContent = "";
  els.scorecard.hidden = true;
  renderBoard();
  render();
}

function shuffleChallenge() {
  if (state.started) return;
  const nextIndex = (state.scenarioIndex + 1 + Math.floor(Math.random() * (scenarios.length - 1))) % scenarios.length;
  state.scenarioIndex = nextIndex;
  resetSession();
  announce(`New design challenge: ${scenarios[state.scenarioIndex].prompt}`);
}

function submitCandidateTurn() {
  const text = els.candidateInput.value.trim();
  if (!text || !state.started || state.ended) return;
  if (state.realtimeReady) {
    sendRealtimeText(text);
  } else {
    processCandidateTurn(text, { forceResponse: true });
  }
  els.candidateInput.value = "";
  render();
}

function processCandidateTurn(text, options = {}) {
  state.lastCandidateAt = Date.now();
  state.transcript.push({ role: "candidate", text, at: state.elapsed });
  announce(`Candidate: ${text}`);

  const answer = answerQuestion(text);
  if (answer) {
    respond(answer);
  } else if (options.forceResponse && shouldInterviewerRespondTo(text)) {
    respond(interviewerReaction(text));
  } else {
    setSilent();
  }
}

function setupVoice() {
  state.voiceAvailable = Boolean(window.RTCPeerConnection && navigator.mediaDevices?.getUserMedia);
  if (!state.voiceAvailable) {
    useFallback("This browser cannot open a live WebRTC microphone. Use text fallback.");
    els.voiceToggle.disabled = true;
  }
}

function toggleVoice() {
  if (state.listening || state.realtimeConnecting) stopListening();
  else startListening();
}

async function startListening() {
  if (!state.voiceAvailable || state.listening || state.realtimeConnecting || !state.started || state.ended) return;
  const runId = state.voiceRunId + 1;
  state.voiceRunId = runId;
  state.listening = true;
  setListeningState("requesting", "Requesting microphone", "Allow microphone access if your browser asks.");
  els.voiceToggle.classList.add("listening");
  try {
    await connectRealtime(runId);
    if (!isActiveVoiceRun(runId)) return;
    setListeningState("listening", "Listening", "Speak naturally while you draw. Your words will appear here.");
    armNoSpeechTimer();
  } catch (error) {
    if (!isActiveVoiceRun(runId)) return;
    state.listening = false;
    disconnectRealtime();
    useFallback(realtimeErrorMessage(error));
    els.voiceToggle.classList.remove("listening");
  }
}

function stopListening() {
  if (!state.listening && !state.realtime && !state.realtimeConnecting) return;
  state.voiceRunId += 1;
  state.listening = false;
  clearNoSpeechTimer();
  setListeningState(state.ended ? "ended" : "paused", state.ended ? "Mic ended" : "Mic paused", state.ended ? "" : "Listening paused. Press the mic to resume.");
  els.voiceToggle.classList.remove("listening");
  disconnectRealtime();
}

async function connectRealtime(runId) {
  state.realtimeConnecting = true;
  const tokenResponse = await fetch("/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ instructions: realtimeInstructions() })
  });
  if (!tokenResponse.ok) {
    const data = await safeJson(tokenResponse);
    throw new Error(data?.error || "Realtime token request failed.");
  }
  if (!isActiveVoiceRun(runId)) throw new Error("Voice start cancelled.");
  const tokenData = await tokenResponse.json();
  const ephemeralKey = tokenData.value || tokenData.client_secret?.value;
  if (!ephemeralKey) throw new Error("Realtime token was missing.");

  const pc = new RTCPeerConnection();
  const dc = pc.createDataChannel("oai-events");
  const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  if (!isActiveVoiceRun(runId)) {
    localStream.getTracks().forEach((track) => track.stop());
    pc.close();
    throw new Error("Voice start cancelled.");
  }
  localStream.getAudioTracks().forEach((track) => pc.addTrack(track, localStream));

  pc.ontrack = (event) => {
    if (!isActiveVoiceRun(runId)) return;
    state.remoteStream = event.streams[0];
    attachRemoteAudio(state.remoteStream);
  };
  pc.onconnectionstatechange = () => {
    if (isActiveVoiceRun(runId) && ["failed", "disconnected", "closed"].includes(pc.connectionState) && state.started && !state.ended) {
      useFallback("Live voice disconnected. Use text fallback, or press the mic to retry.");
      els.voiceToggle.classList.remove("listening");
    }
  };
  dc.addEventListener("open", () => {
    if (!isActiveVoiceRun(runId)) {
      pc.close();
      localStream.getTracks().forEach((track) => track.stop());
      return;
    }
    state.realtimeReady = true;
    state.realtimeConnecting = false;
    setListeningState("listening", "Listening", "Connected. Think out loud and ask the interviewer questions naturally.");
    createRealtimeOpening();
  });
  dc.addEventListener("message", handleRealtimeEvent);
  dc.addEventListener("close", () => {
    if (isActiveVoiceRun(runId)) state.realtimeReady = false;
  });

  state.realtime = { pc, dc };
  state.localStream = localStream;

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  if (!isActiveVoiceRun(runId)) throw new Error("Voice start cancelled.");
  const sdpResponse = await fetch("https://api.openai.com/v1/realtime/calls", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ephemeralKey}`,
      "Content-Type": "application/sdp"
    },
    body: offer.sdp
  });
  if (!sdpResponse.ok) throw new Error(await sdpResponse.text());
  if (!isActiveVoiceRun(runId)) throw new Error("Voice start cancelled.");
  await pc.setRemoteDescription({ type: "answer", sdp: await sdpResponse.text() });
}

function isActiveVoiceRun(runId) {
  return state.voiceRunId === runId && state.listening && state.started && !state.ended;
}

function disconnectRealtime() {
  cancelRealtimeResponse();
  state.realtimeReady = false;
  state.realtimeConnecting = false;
  if (state.realtime?.dc) state.realtime.dc.close();
  if (state.realtime?.pc) state.realtime.pc.close();
  state.realtime = null;
  if (state.localStream) state.localStream.getTracks().forEach((track) => track.stop());
  state.localStream = null;
  clearRemoteAudioBuffer();
  if (state.remoteAudio) state.remoteAudio.remove();
  state.remoteAudio = null;
  state.remoteStream = null;
}

function handleRealtimeEvent(message) {
  const event = JSON.parse(message.data);
  if (event.type === "input_audio_buffer.speech_started") {
    clearNoSpeechTimer();
    state.lastCandidateAt = Date.now();
    state.interimText = "Listening...";
    setListeningState("receiving", "Hearing you", "I am hearing you. Keep thinking out loud.");
    cancelRealtimeResponse();
    clearRemoteAudioBuffer();
    renderLiveTranscript();
    return;
  }
  if (event.type === "input_audio_buffer.speech_stopped") {
    state.interimText = "";
    setListeningState("listening", "Listening", "I heard you. I will stay quiet unless you ask the interviewer to answer.");
    renderLiveTranscript();
    return;
  }
  if (event.type === "conversation.item.input_audio_transcription.completed") {
    const text = event.transcript?.trim();
    state.interimText = "";
    if (text && !state.loggedCandidateItems.has(event.item_id || text)) {
      state.loggedCandidateItems.add(event.item_id || text);
      state.transcriptText = `${state.transcriptText} ${text}`.trim();
      state.transcript.push({ role: "candidate", text, at: state.elapsed });
      logMessage("candidate", text);
      announce(`Candidate: ${text}`);
      if (shouldInterviewerRespondTo(text)) {
        state.lastCandidateQuestionAt = Date.now();
        sendRealtimeEvent({
          type: "response.create",
          response: { instructions: responseInstructionFor(text) }
        });
      } else {
        els.interviewerState.textContent = "Listening";
      }
    }
    renderLiveTranscript();
    return;
  }
  if (event.type === "response.created") {
    state.realtimeResponseActive = true;
    state.interviewerDraft = "";
    els.interviewerState.textContent = "Speaking";
    return;
  }
  if (isRealtimeTextDelta(event)) {
    state.interviewerDraft += event.delta || "";
    setInterviewerDraft(state.interviewerDraft);
    return;
  }
  if (isRealtimeTextDone(event)) {
    state.interviewerDraft = event.transcript || event.text || event.output_text || state.interviewerDraft;
    setInterviewerDraft(state.interviewerDraft);
    return;
  }
  if (event.type === "response.done") {
    state.realtimeResponseActive = false;
    const finalText = extractRealtimeResponseText(event) || state.interviewerDraft;
    if (finalText.trim()) {
      const text = finalText.trim();
      state.transcript.push({ role: "interviewer", text, at: state.elapsed });
      replaceInterviewerDraft(text);
      announce(`Interviewer: ${text}`);
    }
    state.interviewerDraft = "";
    els.interviewerState.textContent = "Listening";
    return;
  }
  if (event.type === "error") {
    useFallback(event.error?.message || "Realtime voice had an error. Use text fallback.");
  }
}

function isRealtimeTextDelta(event) {
  return [
    "response.audio_transcript.delta",
    "response.output_audio_transcript.delta",
    "response.output_text.delta",
    "response.text.delta"
  ].includes(event.type);
}

function isRealtimeTextDone(event) {
  return [
    "response.audio_transcript.done",
    "response.output_audio_transcript.done",
    "response.output_text.done",
    "response.text.done"
  ].includes(event.type);
}

function extractRealtimeResponseText(event) {
  const output = event.response?.output || [];
  const parts = output.flatMap((item) => item.content || []);
  return parts
    .map((part) => part.transcript || part.text || part.output_text || "")
    .filter(Boolean)
    .join(" ")
    .trim();
}

function shouldInterviewerRespondTo(text) {
  const normalized = text.toLowerCase();
  const stuckSignal = [
    "i'm stuck",
    "i am stuck",
    "i feel stuck",
    "i'm blocked",
    "i am blocked",
    "i don't know what to do",
    "i dont know what to do",
    "i'm lost",
    "i am lost",
    "not sure where to go",
    "not sure what to do"
  ].some((phrase) => normalized.includes(phrase));
  if (stuckSignal) return true;
  const selfTalk = [
    "what if",
    "i wonder",
    "i'm thinking",
    "i am thinking",
    "let me",
    "maybe",
    "we could",
    "i could",
    "how might we",
    "should we",
    "what happens if"
  ].some((phrase) => normalized.includes(phrase));
  const directedAsk = [
    "interviewer",
    "can you clarify",
    "could you clarify",
    "can you tell me",
    "could you tell me",
    "can you repeat",
    "could you repeat",
    "say that again",
    "what did you say",
    "what is the goal",
    "what's the goal",
    "who is the user",
    "who are the users",
    "what is the user",
    "what's the user",
    "what is the platform",
    "what's the platform",
    "what constraints",
    "what are the constraints",
    "is there a constraint",
    "why are we designing",
    "what are we designing",
    "what am i designing",
    "what do you think",
    "do you think",
    "does that make sense",
    "am i on the right track",
    "any feedback",
    "give me feedback",
    "do you have feedback",
    "should i go deeper",
    "would you",
    "is that reasonable",
    "is this reasonable",
    "help me"
  ].some((phrase) => normalized.includes(phrase));
  if (directedAsk) return true;
  if (selfTalk) return false;
  if (isQuestion(normalized) && /\b(you|your)\b/.test(normalized)) return true;
  return false;
}

function responseInstructionFor(text) {
  const base = `Respond to the candidate's latest turn only: "${text}".\n${boardContextForPrompt()}`;
  const common = "Act like a Senior Staff Product Designer and hiring manager in a fast-moving whiteboard interview. Keep it short: one or two sentences. Be collaborative, conversational, direct, and neutral. Assess the candidate's thinking instead of directing the work. Do not tell them what to create next, which slice to choose, which user to pick, which flow to sketch, or which constraint to use. If this sounds like thinking aloud, stay silent or stop after the narrow answer.";
  const asksOpinion = /what do you think|do you think|does that make sense|am i on the right track|any feedback|give me feedback|do you have feedback|is that reasonable|is this reasonable|how does that sound/.test(text.toLowerCase());
  const soundsStuck = /i'?m stuck|i am stuck|i feel stuck|i'?m blocked|i am blocked|i don'?t know what to do|i'?m lost|i am lost|not sure where to go|not sure what to do/.test(text.toLowerCase());
  if (soundsStuck) {
    return `${base} The candidate is stuck. Do not give the solution and do not choose the next artifact for them. Ask one neutral assessment question that makes them decide their own assumption, scope, evaluation criterion, or framework step. ${common}`;
  }
  if (asksOpinion) {
    return `${base} The candidate is asking for your opinion. Stay neutral: do not approve the solution, redesign it, or tell them what to do next. Reflect one observable tradeoff, framework gap, or stakeholder risk, then ask one evaluation question that returns ownership to them. ${common}`;
  }
  if (state.difficulty === "easy") {
    return `${base} Easy mode: be friendly, structured, and patient. If they forgot the framework, explicitly prompt the next framework step without giving the answer. Agree with valid assumptions unless they conflict with the scenario. ${common}`;
  }
  if (state.difficulty === "hard") {
    return `${base} Hard mode: be analytical, skeptical, time-conscious, and focused on system tradeoffs. Push weak assumptions, especially early assumptions, but do not solve. If giving pushback, make it about logic, evidence, scope, feasibility, or resilience under a severe pivot. ${common}`;
  }
  return `${base} Medium mode: be professional, collaborative, and sharp. Expect the candidate to drive the framework without prompting. If they ask for feedback, challenge one assumption only when it lacks data or logic. ${common}`;
}

function createRealtimeOpening() {
  sendRealtimeEvent({
    type: "response.create",
    response: {
      instructions: `Say exactly this opening line, then stop and listen without adding guidance: "${openingLine()}"`
    }
  });
}

function sendRealtimeText(text) {
  state.lastCandidateAt = Date.now();
  state.transcript.push({ role: "candidate", text, at: state.elapsed });
  state.transcriptText = `${state.transcriptText} ${text}`.trim();
  logMessage("candidate", text);
  renderLiveTranscript();
  sendRealtimeEvent({
    type: "conversation.item.create",
    item: {
      type: "message",
      role: "user",
      content: [{ type: "input_text", text }]
    }
  });
  if (shouldInterviewerRespondTo(text)) {
    sendRealtimeEvent({
      type: "response.create",
      response: { instructions: responseInstructionFor(text) }
    });
  } else {
    setSilent();
  }
}

function sendRealtimeEvent(event) {
  if (state.realtime?.dc?.readyState === "open") state.realtime.dc.send(JSON.stringify(event));
}

function cancelRealtimeResponse() {
  if (!state.realtimeResponseActive) return;
  sendRealtimeEvent({ type: "response.cancel" });
  state.realtimeResponseActive = false;
  state.interviewerDraft = "";
  els.interviewerState.textContent = "Interrupted";
}

function attachRemoteAudio(stream) {
  if (state.remoteAudio) state.remoteAudio.remove();
  const audio = document.createElement("audio");
  audio.autoplay = true;
  audio.playsInline = true;
  audio.srcObject = stream;
  document.body.appendChild(audio);
  state.remoteAudio = audio;
  audio.play().catch(() => {
    useFallback("Audio playback was blocked. Click the mic or use text fallback.");
  });
}

function clearRemoteAudioBuffer() {
  if (!state.remoteAudio) return;
  const stream = state.remoteStream;
  state.remoteAudio.pause();
  state.remoteAudio.srcObject = null;
  state.remoteAudio.load();
  if (stream) attachRemoteAudio(stream);
}

function setInterviewerDraft(text) {
  let draft = els.interviewerLog.querySelector("[data-draft='true']");
  if (!draft) {
    draft = document.createElement("div");
    draft.className = "message interviewer";
    draft.dataset.draft = "true";
    const label = document.createElement("span");
    label.className = "message-role";
    label.textContent = "Interviewer";
    const body = document.createElement("span");
    body.className = "message-text";
    draft.append(label, body);
    els.interviewerLog.insertBefore(draft, els.interviewerLog.firstChild);
  }
  draft.querySelector(".message-text").textContent = text;
  els.interviewerLog.scrollTop = 0;
}

function replaceInterviewerDraft(text) {
  const draft = els.interviewerLog.querySelector("[data-draft='true']");
  if (draft) {
    draft.removeAttribute("data-draft");
    draft.querySelector(".message-text").textContent = text;
  } else {
    logMessage("interviewer", text);
  }
}

function realtimeInstructions() {
  const scenario = scenarios[state.scenarioIndex];
  return `
You are a Senior Staff Product Designer and Hiring Manager interviewing the candidate for a fast-moving, high-stakes product design role.
Run a realistic collaborative Silicon Valley tech whiteboard challenge workshop, not a chat app.
Your style is highly collaborative, conversational, direct, and sharp.
Current difficulty: ${state.difficulty}.
The candidate is solving: ${scenario.prompt}
Hidden scenario facts:
- Object: ${scenario.truth.object}
- User: ${scenario.truth.who}
- Platform: ${scenario.truth.platform}
- Goal: ${scenario.truth.goal}
- Constraint: ${scenario.truth.constraint}
- Curveball: ${scenario.truth.curveball}

Rules of engagement:
- Do not solve the problem. Never give away the design solution. Your job is to push the candidate to discover it.
- Enforce a framework by asking the candidate to explicitly state their process, not by choosing the answer for them.
- The framework you are listening for: understanding the goal and constraints; defining the user persona and empathy map; outlining the core user journey or flow; ideating features and system architecture; sketching or wireframing wire-level interfaces; naming metrics, risks, and tradeoffs.
- If the candidate skips a framework step, ask a sharp question that exposes the gap. Do not tell them what to draw.
- Be a realistic stakeholder. Ask probing questions about entry points, AI uncertainty, user mistrust, technical feasibility, V1 scope, launch deadlines, business constraints, and evidence.
- Once the candidate has a direction, interject with plot twists such as missing API capability, data science showing abandonment at a specific step, legal/privacy concerns, enterprise admin constraints, or a 3-week 0-to-1 launch deadline.

Google interviewer DNA:
- Scale over everything. Push for internationalization, low-bandwidth constraints, device range, and extreme scale. Example: ask how the UI scales from a high-end Pixel device to a low-end phone on spotty 3G.
- Horizontal ecosystem integration. Ask how the design interacts with Google surfaces such as Assistant, Android notifications, Gmail, Calendar, Workspace, Google Home, Pixel Watch, and Drive.
- Data and signals over intuition. If the candidate relies on taste or feeling, ask what telemetry, A/B metrics, guardrail metrics, or qualitative signals would validate the decision.
- Accessibility first. Force screen reader behavior, keyboard navigation, high contrast, motion sensitivity, and assistive technology considerations early in UI/system decisions, not as a polish step.

Behavior:
- Listen while the candidate draws and thinks aloud.
- You may receive a structured board context summary containing Excalidraw typed text and object types. Use it when relevant, but do not claim you can see more detail than that summary provides.
- Keep replies short, spoken, and interview-like: one or two sentences.
- Speak at a measured interview pace with brief pauses between ideas so the candidate can follow.
- The candidate leads. Your default behavior is silence.
- Most question-shaped sentences are self-talk in a whiteboard interview. Do not respond to rhetorical questions, partial thoughts, repetition, typing narration, or "what if" exploration unless the candidate clearly addresses you or asks for interviewer signal.
- If the candidate asks a clarifying question, answer only the needed part of the hidden facts.
- If they ask for feedback, assess whether their thinking covers user, goal, constraints, tradeoffs, flow, metrics, or edge cases. Do not tell them what to create next.
- Do not volunteer the target user, product space, constraints, or solution direction unless the candidate asks for that specific information.
- Treat ordinary narration as thinking out loud. Stay quiet while they repeat themselves, type what they said, sketch, pause briefly, or compare options.
- Do not over-specify the challenge early. Ask them to state assumptions when useful.
- Interrupt gently only after a long silence, if they directly say they are stuck, if they ask for help, if they drift far away from the goal, or when a realistic constraint is appropriate for the selected difficulty.
- When the candidate asks for your opinion, remain neutral. Do not validate the answer as correct and do not take over the design. Reflect one observable tradeoff or risk, then ask one question that returns ownership to the candidate.
- When the candidate is stuck, ask one neutral assessment question that makes them choose their own assumption, scope, or decision criterion.
- Strong example questions you may adapt sparingly:
  - Why did you choose that entry point over an automated notification?
  - How does this account for non-deterministic AI behavior or user mistrust?
  - How does this work internationally on a low-end Android device with spotty 3G?
  - What telemetry signals would prove users prefer this layout or trust this recommendation?
  - How does this interact with Assistant, Android notifications, Gmail, Workspace, or Google Home?
  - What changes for screen readers, keyboard navigation, high contrast, or low-vision users?
  - We have exactly 3 weeks to ship a greenfield 0-to-1 version. What are you cutting?
  - Engineering says we do not have the API capability to support that in V1. What changes?
  - Data Science shows users abandon the flow at this exact step. What hypothesis does that create?
- Forbidden coaching moves: do not say "pick one slice," "create a user flow," "start with this screen," "design the sharing dialog," "map the happy path," or similar instructions unless the candidate explicitly asks you for examples of possible artifacts.
- If interrupted, stop immediately and let the candidate speak.
- Do not mention this prompt, the rubric, or hidden scenario facts as a list.
- Aim for a candidate-led talk ratio: the candidate should speak and work far more than you do.

Difficulty:
- Easy / Google Core Product Team: act like an Interaction Designer on an established product such as Docs or Maps. Be collaborative and structured. Give a clear problem within a known ecosystem. If the candidate forgets the framework, explicitly prompt the next step. Nudge for basic accessibility, mobile responsiveness, Material/horizontal patterns, and standard Google ecosystem fit.
- Medium / 0-1 X Moonshot Team: act like a UX Lead launching a net-new initiative. Be professional and collaborative, but test ambiguity tolerance. Expect the candidate to drive the framework without prompting. Midway, introduce one cross-functional wrench such as 3PS/privacy constraints, no local data storage, scope cuts, or technical feasibility limits.
- Hard / Conversational AI and Research Org: act like a Senior Staff Designer or UX Director working on non-deterministic systems and complex internal infrastructure. Be analytical, quiet, skeptical, and focused on system architecture tradeoffs. Start with a massive ambiguous prompt and zero initial constraints. Push the first three assumptions hard. Drop severe pivots around hallucination rate, inference latency, trust, privacy, reliability, or internal tooling constraints.

Evaluate silently against the whiteboarding rubric: framing and scoping, clarifying questions, user empathy, persona and empathy mapping, structured exploration, breadth before depth, user journey and flow, system architecture, wire-level interface thinking, visual communication, tradeoffs, constraints, metrics, Google scale thinking, ecosystem integration, data validation, accessibility, collaboration with the interviewer, adaptability, and time management.
`.trim();
}

async function safeJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function armNoSpeechTimer() {
  clearNoSpeechTimer();
  state.noSpeechTimer = window.setTimeout(() => {
    if (!state.listening) return;
    setListeningState("no-speech", "Listening, no speech yet", "Silence is okay. If you are speaking and no transcript appears, check mic permission/input or use text fallback.");
  }, 60000);
}

function clearNoSpeechTimer() {
  if (state.noSpeechTimer) window.clearTimeout(state.noSpeechTimer);
  state.noSpeechTimer = null;
}

function useFallback(message) {
  setListeningState("fallback", "Use text fallback", message);
  els.transcriptDrawer.open = true;
  announce(message);
}

function setListeningState(kind, title, detail) {
  document.body.dataset.listening = kind;
  els.voiceStatus.textContent = title.replace("Requesting microphone", "Requesting mic").replace("No speech detected", "No speech");
  els.listeningTitle.textContent = title;
  els.micHelp.textContent = detail;
  if (!currentTranscriptText()) {
    els.heardPreview.textContent = detail || "Your spoken questions and narration will appear here.";
  } else {
    els.heardPreview.textContent = currentTranscriptText();
  }
}

function currentTranscriptText() {
  return [state.transcriptText, state.interimText].filter(Boolean).join(" ").trim();
}

function realtimeErrorMessage(error) {
  const message = error?.message || "";
  if (message.includes("Permission") || message.includes("NotAllowedError")) return "Microphone permission was blocked. Allow mic access, or use text fallback.";
  if (message.includes("OPENAI_API_KEY")) return "Realtime voice needs OPENAI_API_KEY on the local server. Use text fallback for now.";
  if (message.includes("404")) return "Realtime server is not running. Start the local app server with OPENAI_API_KEY, or use text fallback.";
  if (message.includes("Voice start cancelled")) return "Mic paused.";
  return message || "Live voice could not start. Use text fallback.";
}

function renderLiveTranscript() {
  const text = currentTranscriptText();
  els.liveTranscript.textContent = text;
  els.heardPreview.textContent = text || els.micHelp.textContent || "Your spoken questions and narration will appear here.";
}

function answerQuestion(text) {
  const normalized = text.toLowerCase();
  if (!isQuestion(normalized)) return "";
  const scenario = scenarios[state.scenarioIndex];
  const collaborationAnswer = answerCollaborationCheckIn(normalized);
  if (collaborationAnswer) return tone(collaborationAnswer);
  const rules = [
    {
      key: "object",
      tests: ["what kind", "what type", "what is this", "what is the log", "log for", "wait for", "tip jar for", "lost", "what am i designing", "what is the space", "what space"],
      answer: scenario.truth.object
    },
    {
      key: "who",
      tests: ["who", "user", "persona", "customer", "patient", "caregiver", "audience", "for whom", "for who", "target"],
      answer: scenario.truth.who
    },
    {
      key: "goal",
      tests: ["goal", "success", "metric", "trying to", "outcome", "why", "problem", "job", "need", "solve", "why are we designing"],
      answer: scenario.truth.goal
    },
    {
      key: "platform",
      tests: ["platform", "mobile", "desktop", "device", "where", "channel", "app", "website", "screen"],
      answer: scenario.truth.platform
    },
    {
      key: "constraint",
      tests: ["constraint", "limitation", "technical", "risk", "hard", "edge", "privacy", "accessibility", "must", "cannot"],
      answer: scenario.truth.constraint
    }
  ];
  const matches = rules.filter((rule) => rule.tests.some((test) => normalized.includes(test)));
  if (matches.length === 0) return tone("I do not want to over-specify that yet. What assumption do you want to use?");
  const uniqueMatches = matches.filter((rule, index) => matches.findIndex((item) => item.key === rule.key) === index);
  uniqueMatches.slice(0, 2).forEach((rule) => state.revealed.add(rule.key));
  return tone(uniqueMatches.slice(0, 2).map((rule) => rule.answer).join(" "));
}

function answerCollaborationCheckIn(text) {
  const asksForReaction = [
    "what do you think",
    "does that make sense",
    "am i on the right track",
    "would you agree",
    "is that reasonable",
    "how does that sound",
    "any feedback",
    "should i go deeper"
  ].some((phrase) => text.includes(phrase));
  if (!asksForReaction) return "";
  state.guidanceCount += 1;
  if (!state.revealed.has("who")) return "I do not hear a clear user assumption yet. Who are you assuming the user is?";
  if (!state.revealed.has("goal")) return "I do not hear a success criterion yet. What outcome are you optimizing for?";
  if (!state.revealed.has("constraint")) return "I do not hear the messy case yet. What condition could break your current direction?";
  if (state.difficulty === "hard") return "We have exactly 3 weeks to ship a 0-to-1 version. What are you cutting, and why?";
  if (state.difficulty === "easy") return "Good. Now make the next framework step explicit: who is the user, and what do they need?";
  return "I can follow the structure. What makes this direction stronger than the alternative?";
}

function interviewerReaction(text) {
  const normalized = text.toLowerCase();
  if (normalized.includes("flow") || normalized.includes("journey") || normalized.includes("wireframe") || normalized.includes("screen")) {
    return tone("What decision is that artifact helping you evaluate?");
  }
  if (normalized.includes("ai") || normalized.includes("assistant") || normalized.includes("automated")) {
    return tone("How does that account for non-deterministic behavior or user mistrust?");
  }
  if (normalized.includes("mobile") || normalized.includes("android") || normalized.includes("watch") || normalized.includes("notification")) {
    return tone("How does this scale across device quality, low bandwidth, and international contexts?");
  }
  if (normalized.includes("gmail") || normalized.includes("workspace") || normalized.includes("calendar") || normalized.includes("home") || normalized.includes("drive")) {
    return tone("What continuity does the user expect across the broader Google ecosystem?");
  }
  if (normalized.includes("layout") || normalized.includes("prefer") || normalized.includes("feel") || normalized.includes("intuitive")) {
    return tone("What signal would prove users actually prefer or understand that choice?");
  }
  if (normalized.includes("accessibility") || normalized.includes("screen reader") || normalized.includes("keyboard") || normalized.includes("contrast")) {
    return tone("How would you verify that this works for screen reader, keyboard, and high-contrast users?");
  }
  if (normalized.includes("tradeoff") || normalized.includes("risk") || normalized.includes("constraint")) {
    return tone("What makes that tradeoff acceptable for this user?");
  }
  if (normalized.includes("assume") || normalized.includes("assumption")) {
    return tone("What evidence would make that assumption risky?");
  }
  if (normalized.includes("metric") || normalized.includes("success")) {
    return tone("What counter-metric would tell you this design is causing harm?");
  }
  if (state.strokes.length > 0) {
    return tone("What is the main decision your board is trying to make clear?");
  }
  return tone("What assumption are you making, and how will you know if it is the right one?");
}

function tick() {
  state.elapsed += 1000;
  state.phaseElapsed += 1000;
  const phases = phasePlans[state.mode];
  const phase = phases[state.phaseIndex];
  const timing = difficultyTiming();

  if (state.phaseElapsed >= phase.ms && state.phaseIndex < phases.length - 1) {
    state.phaseIndex += 1;
    state.phaseElapsed = 0;
    if (state.elapsed - state.lastInterjectionAt > timing.phaseNudgeMs) {
      interject(`We are entering ${phases[state.phaseIndex].label}. What decision are you making at this point?`);
    }
  }

  const silentFor = Date.now() - state.lastCandidateAt;
  if (state.started && silentFor > timing.silenceMs && state.elapsed - state.lastInterjectionAt > timing.cooldownMs) {
    interject(state.difficulty === "easy" ? "What assumption are you working from right now?" : "If you are stuck, what assumption or criterion would help you decide?");
  }

  const curveballPhase = state.difficulty === "hard" ? 2 : state.difficulty === "medium" ? 2 : 3;
  if (state.phaseIndex >= curveballPhase && !state.curveballUsed && state.elapsed - state.lastInterjectionAt > timing.curveballCooldownMs) {
    state.curveballUsed = true;
    interject(`${stakeholderPlotTwist()} ${scenarios[state.scenarioIndex].truth.curveball}`);
  }

  if (
    state.started &&
    state.strokes.length > 0 &&
    !state.boardPrompted &&
    Date.now() - state.lastBoardActivityAt > timing.boardNudgeMs &&
    Date.now() - state.lastCandidateAt > timing.boardNudgeMs &&
    state.elapsed - state.lastInterjectionAt > timing.cooldownMs
  ) {
    state.boardPrompted = true;
    interject(state.difficulty === "easy" ? "What is the board helping you decide?" : "What tradeoff does the board make visible?");
  }

  if (state.elapsed >= phases.reduce((sum, item) => sum + item.ms, 0)) {
    endSession();
  }
  render();
}

function difficultyTiming() {
  if (state.difficulty === "easy") {
    return { silenceMs: 120000, boardNudgeMs: 150000, cooldownMs: 180000, phaseNudgeMs: 240000, curveballCooldownMs: 300000 };
  }
  if (state.difficulty === "hard") {
    return { silenceMs: 210000, boardNudgeMs: 300000, cooldownMs: 300000, phaseNudgeMs: 360000, curveballCooldownMs: 420000 };
  }
  return { silenceMs: 240000, boardNudgeMs: 240000, cooldownMs: 300000, phaseNudgeMs: 360000, curveballCooldownMs: 900000 };
}

function stakeholderPlotTwist() {
  const twists = [
    "Engineering says we do not have the API capability to support the full version in V1.",
    "Data Science shows users abandon the flow at the highest-friction step.",
    "3PS and privacy legal say we cannot store this user data locally.",
    "Leadership says this needs a credible 3-week 0-to-1 version.",
    "The design must work on a low-end Android device in a region with spotty 3G.",
    "The LLM has a 12% hallucination rate on this task, and inference latency is peaking at 5 seconds.",
    "Accessibility review flags that the current interaction is not usable with screen readers or keyboard navigation.",
    "The feature must continue cleanly across Assistant, Android notifications, Gmail, Workspace, and Google Home."
  ];
  const index = Math.min(twists.length - 1, Math.floor(state.elapsed / 60000) % twists.length);
  return twists[index];
}

function interject(text) {
  state.lastInterjectionAt = state.elapsed;
  respond(tone(text), true);
}

function respond(text, isInterjection = false) {
  state.transcript.push({ role: "interviewer", text, at: state.elapsed, isInterjection });
  logMessage("interviewer", text);
  els.interviewerState.textContent = isInterjection ? "Interjecting" : "Answering";
  announce(`Interviewer: ${text}`);
}

function setSilent() {
  els.interviewerState.textContent = "Silent";
}

function openingLine() {
  const prompt = scenarios[state.scenarioIndex].prompt;
  if (state.difficulty === "easy") {
    return `Easy mode. ${prompt} Let's start with the goal and constraints. What do you think success should mean here?`;
  }
  if (state.difficulty === "hard") {
    return `Hard mode. ${prompt} I am not giving constraints yet. What are your initial thoughts?`;
  }
  return `Medium mode. ${prompt} What are your initial thoughts?`;
}

function tone(text) {
  if (state.difficulty === "easy") return text;
  if (state.difficulty === "hard") return text.replace("I do not have more detail on that. ", "");
  return text;
}

function isQuestion(text) {
  return text.includes("?") || /^(who|what|when|where|why|how|is|are|do|does|should|can|could)\b/.test(text.trim());
}

function logMessage(role, text) {
  const div = document.createElement("div");
  div.className = `message ${role}`;
  const label = document.createElement("span");
  label.className = "message-role";
  label.textContent = role === "candidate" ? "You" : role === "interviewer" ? "Interviewer" : "System";
  const body = document.createElement("span");
  body.className = "message-text";
  body.textContent = text;
  div.append(label, body);
  els.interviewerLog.insertBefore(div, els.interviewerLog.firstChild);
  els.interviewerLog.scrollTop = 0;
}

function showDebrief() {
  const scores = scoreSession();
  const average = Math.round(scores.reduce((sum, row) => sum + row.score, 0) / scores.length);
  const strengths = scores.filter((row) => scoreStatus(row.score).kind === "good").length;
  const focusAreas = scores.length - strengths;
  els.overallScore.textContent = `${average}/5 average`;
  els.scoreRows.innerHTML = "";
  scores.forEach((row) => {
    const status = scoreStatus(row.score);
    const div = document.createElement("div");
    div.className = `score-row ${status.kind === "good" ? "score-good" : "score-improve"}`;
    div.innerHTML = `
      <span class="score-dot" aria-hidden="true"></span>
      <div class="score-copy">
        <div class="score-title-line">
          <strong>${row.label}</strong>
          <span class="score-status">${status.label}</span>
        </div>
        <span>${row.note}</span>
      </div>
      <output aria-label="${row.label} score">${row.score}/5</output>
    `;
    els.scoreRows.appendChild(div);
  });
  els.nextNotes.innerHTML = "";
  const summary = document.createElement("div");
  summary.className = "report-summary";
  summary.innerHTML = `
    <span><span class="summary-dot good" aria-hidden="true"></span>${strengths} went well</span>
    <span><span class="summary-dot improve" aria-hidden="true"></span>${focusAreas} could improve</span>
  `;
  els.nextNotes.appendChild(summary);
  nextTimeNotes(scores).forEach((note) => {
    const div = document.createElement("div");
    div.className = "note";
    div.textContent = note;
    els.nextNotes.appendChild(div);
  });
  els.scorecard.hidden = false;
  els.scorecard.scrollIntoView({ block: "start", behavior: "smooth" });
}

function scoreStatus(score) {
  if (score >= 4) return { kind: "good", label: "Went well" };
  return { kind: "improve", label: "Could improve" };
}

function scoreSession() {
  const text = `${state.transcript.map((turn) => turn.text).join(" ")} ${state.boardText}`.toLowerCase();
  const words = getWords(text);
  const candidateTurns = state.transcript.filter((turn) => turn.role === "candidate");
  const has = (terms) => terms.some((term) => text.includes(term));
  const score = (base, yes) => Math.max(1, Math.min(5, base + yes));
  return [
    { label: "Problem framing & scoping", score: score(1, (state.revealed.has("who") ? 1 : 0) + (state.revealed.has("goal") ? 1 : 0) + (has(["scope", "problem", "success"]) ? 1 : 0)), note: "Clarified before designing." },
    { label: "User empathy", score: score(1, (state.revealed.has("who") ? 2 : 0) + (has(["pain", "caregiver", "patient", "customer", "traveler", "anxiety"]) ? 1 : 0)), note: "Grounded decisions in a user." },
    { label: "Structured thinking", score: score(1, (has(["first", "then", "flow", "journey"]) ? 2 : 0) + (candidateTurns.length >= 3 ? 1 : 0)), note: "Moved through the problem in an organized way." },
    { label: "Breadth vs. depth", score: score(1, (has(["option", "alternative", "edge", "case"]) ? 1 : 0) + (has(["deep", "detail", "screen", "flow"]) ? 1 : 0) + (state.strokes.length > 2 ? 1 : 0)), note: "Explored, then chose where to go deeper." },
    { label: "Interviewer collaboration", score: score(1, (state.revealed.size >= 2 ? 1 : 0) + (has(["what do you think", "does that make sense", "feedback", "right track"]) ? 1 : 0) + (state.transcript.some((turn) => turn.role === "interviewer" && !turn.isInterjection) ? 1 : 0)), note: "Used the interviewer as a partner instead of solving alone." },
    { label: "Communication / narration", score: score(1, (words.length > 80 ? 1 : 0) + (has(["because", "tradeoff", "assume"]) ? 1 : 0) + (candidateTurns.length >= 4 ? 1 : 0)), note: "Made reasoning audible." },
    { label: "Handling ambiguity & pushback", score: score(1, (state.curveballUsed ? 1 : 0) + (has(["change", "constraint", "risk", "adapt"]) ? 1 : 0)), note: "Responded to incomplete information and changes." },
    { label: "Time management", score: score(2, state.phaseIndex >= 3 ? 1 : 0), note: "Kept moving across phases." }
  ];
}

function nextTimeNotes(scores) {
  return scores.sort((a, b) => a.score - b.score).slice(0, 3).map((row) => `Next time: improve ${row.label.toLowerCase()} by making it explicit during the session.`);
}

function setupBoard() {
  if (els.excalidrawMount) {
    window.whiteboardSession = {
      onChange(elements) {
        const liveElements = elements.filter((element) => !element.isDeleted);
        state.boardElements = liveElements.map(boardElementFromExcalidraw).filter(Boolean);
        state.boardText = state.boardElements.map((element) => element.text).filter(Boolean).join(" ");
        state.boardSummary = summarizeBoardElements(state.boardElements);
        state.strokes = state.boardElements;
        if (liveElements.length > 0) {
          state.lastBoardActivityAt = Date.now();
          if (state.started) {
            const boardStatus = state.boardText ? `Board text detected: ${truncateText(state.boardText, 96)}` : "Board activity detected. Keep narrating what you are drawing.";
            els.micHelp.textContent = state.listening ? boardStatus : "Board activity detected. Mic is not listening; use text fallback or resume the mic.";
          }
        }
      },
      onReady() {
        if (els.boardLoading) els.boardLoading.hidden = true;
      },
      onError(message) {
        if (!els.boardLoading) return;
        els.boardLoading.hidden = false;
        els.boardLoading.innerHTML = `<span class="material-symbols-rounded" aria-hidden="true">error</span><span>${message}</span>`;
      }
    };
    return;
  }
  resizeBoard();
  window.addEventListener("resize", resizeBoard);
  els.board.addEventListener("pointerdown", startDraw);
  els.board.addEventListener("pointermove", moveDraw);
  els.board.addEventListener("pointerup", stopDraw);
  els.board.addEventListener("pointerleave", stopDraw);
  els.board.addEventListener("dblclick", editBoardText);
}

function boardElementFromExcalidraw(element) {
  if (!element?.id || element.isDeleted) return null;
  const text = normalizeBoardText(element.text || element.rawText || "");
  return {
    id: element.id,
    type: element.type || "element",
    text,
    x: Math.round(element.x || 0),
    y: Math.round(element.y || 0),
    width: Math.round(element.width || 0),
    height: Math.round(element.height || 0)
  };
}

function normalizeBoardText(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

function summarizeBoardElements(elements) {
  if (!elements.length) return "";
  const counts = elements.reduce((acc, element) => {
    acc[element.type] = (acc[element.type] || 0) + 1;
    return acc;
  }, {});
  const countText = Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([type, count]) => `${count} ${type}`)
    .join(", ");
  const typedText = elements
    .filter((element) => element.text)
    .sort((a, b) => a.y - b.y || a.x - b.x)
    .slice(0, 12)
    .map((element) => `"${truncateText(element.text, 140)}"`)
    .join("; ");
  return typedText ? `${countText}. Typed text: ${typedText}.` : `${countText}. No typed text captured yet.`;
}

function boardContextForPrompt() {
  if (!state.boardSummary) {
    return "Board context: no visible Excalidraw objects or typed text have been captured yet.";
  }
  return `Board context from Excalidraw: ${state.boardSummary} Use this to understand the candidate's current framing, notes, and sketches. Do not read the board back verbatim unless the candidate asks.`;
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 3)).trim()}...`;
}

function resizeBoard() {
  if (!els.board || !ctx) return;
  const rect = els.board.parentElement.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  els.board.width = Math.max(900, Math.floor(rect.width * ratio));
  els.board.height = Math.max(600, Math.floor(rect.height * ratio));
  renderBoard();
}

function canvasScale() {
  if (!els.board) return { x: 1, y: 1 };
  const rect = els.board.getBoundingClientRect();
  return {
    x: els.board.width / rect.width,
    y: els.board.height / rect.height
  };
}

function pointFromEvent(event) {
  const rect = els.board.getBoundingClientRect();
  const scale = canvasScale();
  const x = (event.clientX - rect.left) * scale.x;
  const y = (event.clientY - rect.top) * scale.y;
  return { x: (x - state.camera.x) / state.camera.scale, y: (y - state.camera.y) / state.camera.scale };
}

function screenPointFromEvent(event) {
  const rect = els.board.getBoundingClientRect();
  const scale = canvasScale();
  return { x: (event.clientX - rect.left) * scale.x, y: (event.clientY - rect.top) * scale.y };
}

function toScreen(point) {
  return { x: point.x * state.camera.scale + state.camera.x, y: point.y * state.camera.scale + state.camera.y };
}

function startDraw(event) {
  if (state.textEditing && event.target !== els.boardTextEditor) commitBoardText();
  state.drawing = true;
  state.lastBoardActivityAt = Date.now();
  state.lastPoint = state.tool === "pan" ? screenPointFromEvent(event) : pointFromEvent(event);
  const point = pointFromEvent(event);

  if (state.tool === "text") {
    addTextAt(point);
    state.drawing = false;
    return;
  }

  if (state.tool === "select") {
    state.selectedId = hitTest(point);
    renderBoard();
    return;
  }

  if (state.tool === "erase") {
    const targetId = hitTest(point);
    if (targetId) removeItem(targetId);
    state.drawing = false;
    return;
  }

  if (state.tool === "pen") {
    state.activeStroke = { id: createId(), type: "path", points: [point] };
  } else if (state.tool !== "pan") {
    state.activeStroke = createShape(state.tool, point, point);
  }
}

function moveDraw(event) {
  if (!state.drawing) return;
  const point = state.tool === "pan" ? screenPointFromEvent(event) : pointFromEvent(event);
  if (state.tool === "pan") {
    state.camera.x += point.x - state.lastPoint.x;
    state.camera.y += point.y - state.lastPoint.y;
    state.lastPoint = point;
  } else if (state.tool === "select" && state.selectedId) {
    const dx = point.x - state.lastPoint.x;
    const dy = point.y - state.lastPoint.y;
    moveItem(state.selectedId, dx, dy);
    state.lastPoint = point;
    state.lastBoardActivityAt = Date.now();
  } else if (state.activeStroke?.type === "path") {
    state.activeStroke.points.push(point);
    state.lastBoardActivityAt = Date.now();
  } else {
    updateShape(state.activeStroke, state.lastPoint, point);
    state.lastBoardActivityAt = Date.now();
  }
  renderBoard();
}

function stopDraw() {
  if (state.activeStroke && isDrawable(state.activeStroke)) {
    state.strokes.push(state.activeStroke);
    state.redoStack = [];
  }
  state.drawing = false;
  state.activeStroke = null;
  if (state.started) {
    els.micHelp.textContent = state.listening ? "Board activity detected. Keep narrating what you are drawing." : "Board activity detected. Mic is not listening; use text fallback or resume the mic.";
  }
}

function renderBoard() {
  if (!ctx || !els.board) return;
  ctx.clearRect(0, 0, els.board.width, els.board.height);
  drawGrid();
  [...state.strokes, state.activeStroke].filter(Boolean).forEach(drawItem);
  if (state.selectedId) drawSelection(state.strokes.find((item) => item.id === state.selectedId));
  if (els.zoomLevel) els.zoomLevel.textContent = `${Math.round(state.camera.scale * 100)}%`;
  if (els.undoBoard) els.undoBoard.disabled = state.strokes.length === 0;
  if (els.redoBoard) els.redoBoard.disabled = state.redoStack.length === 0;
}

function drawGrid() {
  const step = 32;
  ctx.strokeStyle = cssColor("--md-outline-variant");
  ctx.lineWidth = 1;
  const scaledStep = step * state.camera.scale;
  for (let x = state.camera.x % scaledStep; x < els.board.width; x += scaledStep) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, els.board.height);
    ctx.stroke();
  }
  for (let y = state.camera.y % scaledStep; y < els.board.height; y += scaledStep) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(els.board.width, y);
    ctx.stroke();
  }
}

function drawItem(item) {
  ctx.save();
  ctx.strokeStyle = cssColor("--md-on-surface");
  ctx.fillStyle = cssColor("--md-on-surface");
  ctx.lineWidth = Math.max(2, 3 * state.camera.scale);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (item.type === "path") drawPath(item);
  if (item.type === "line") drawLine(item.start, item.end, false);
  if (item.type === "arrow") drawLine(item.start, item.end, true);
  if (item.type === "rect") drawRect(item);
  if (item.type === "diamond") drawDiamond(item);
  if (item.type === "ellipse") drawEllipse(item);
  if (item.type === "text") drawText(item);
  ctx.restore();
}

function drawPath(item) {
  ctx.beginPath();
  item.points.forEach((point, index) => {
    const screen = toScreen(point);
    if (index === 0) ctx.moveTo(screen.x, screen.y);
    else ctx.lineTo(screen.x, screen.y);
  });
  ctx.stroke();
}

function drawLine(start, end, arrow) {
  const a = toScreen(start);
  const b = toScreen(end);
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
  if (!arrow) return;
  const angle = Math.atan2(b.y - a.y, b.x - a.x);
  const size = 12;
  ctx.beginPath();
  ctx.moveTo(b.x, b.y);
  ctx.lineTo(b.x - size * Math.cos(angle - Math.PI / 6), b.y - size * Math.sin(angle - Math.PI / 6));
  ctx.moveTo(b.x, b.y);
  ctx.lineTo(b.x - size * Math.cos(angle + Math.PI / 6), b.y - size * Math.sin(angle + Math.PI / 6));
  ctx.stroke();
}

function drawRect(item) {
  const { x, y, w, h } = screenBounds(item);
  ctx.strokeRect(x, y, w, h);
}

function drawDiamond(item) {
  const { x, y, w, h } = screenBounds(item);
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y);
  ctx.lineTo(x + w, y + h / 2);
  ctx.lineTo(x + w / 2, y + h);
  ctx.lineTo(x, y + h / 2);
  ctx.closePath();
  ctx.stroke();
}

function drawEllipse(item) {
  const { x, y, w, h } = screenBounds(item);
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + h / 2, Math.abs(w / 2), Math.abs(h / 2), 0, 0, Math.PI * 2);
  ctx.stroke();
}

function drawText(item) {
  const screen = toScreen(item);
  const fontSize = boardFontSize();
  ctx.font = `${fontSize}px ${cssFont()}`;
  ctx.fillText(item.text, screen.x, screen.y + fontSize);
}

function drawSelection(item) {
  if (!item) return;
  const box = itemBounds(item);
  const topLeft = toScreen({ x: box.x, y: box.y });
  const bottomRight = toScreen({ x: box.x + box.w, y: box.y + box.h });
  ctx.save();
  ctx.strokeStyle = cssColor("--md-primary");
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(topLeft.x - 5, topLeft.y - 5, bottomRight.x - topLeft.x + 10, bottomRight.y - topLeft.y + 10);
  ctx.restore();
}

function createShape(type, start, end) {
  if (type === "line" || type === "arrow") return { id: createId(), type, start, end };
  const item = { id: createId(), type, x: start.x, y: start.y, w: 0, h: 0 };
  updateShape(item, start, end);
  return item;
}

function updateShape(item, start, end) {
  if (!item) return;
  if (item.type === "line" || item.type === "arrow") {
    item.start = start;
    item.end = end;
    return;
  }
  item.x = Math.min(start.x, end.x);
  item.y = Math.min(start.y, end.y);
  item.w = Math.abs(end.x - start.x);
  item.h = Math.abs(end.y - start.y);
}

function addTextAt(point) {
  beginBoardTextEdit({ item: null, point, value: "" });
}

function editBoardText(event) {
  const id = hitTest(pointFromEvent(event));
  const item = state.strokes.find((entry) => entry.id === id && entry.type === "text");
  if (!item) return;
  beginBoardTextEdit({ item, point: { x: item.x, y: item.y }, value: item.text });
}

function beginBoardTextEdit({ item, point, value }) {
  const screen = toScreen(point);
  const scale = canvasScale();
  const editor = els.boardTextEditor;
  state.textEditing = { id: item?.id || null, point };
  editor.value = value;
  editor.hidden = false;
  editor.style.left = `${screen.x / scale.x}px`;
  editor.style.top = `${Math.max(0, screen.y / scale.y)}px`;
  editor.style.minWidth = `${Math.max(160, (value.length + 4) * 9)}px`;
  editor.style.fontSize = `${boardFontSize()}px`;
  window.requestAnimationFrame(() => {
    editor.focus();
    editor.select();
  });
}

function handleBoardTextKeydown(event) {
  if (event.key === "Escape") {
    cancelBoardText();
    return;
  }
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    commitBoardText();
  }
}

function commitBoardText() {
  if (!state.textEditing) return;
  const text = els.boardTextEditor.value.trim();
  const editing = state.textEditing;
  hideBoardTextEditor();
  if (!text) return;
  const existing = state.strokes.find((entry) => entry.id === editing.id);
  if (existing) {
    existing.text = text;
  } else {
    state.strokes.push({ id: createId(), type: "text", x: editing.point.x, y: editing.point.y, text });
  }
  state.redoStack = [];
  state.lastBoardActivityAt = Date.now();
  renderBoard();
}

function cancelBoardText() {
  hideBoardTextEditor();
  renderBoard();
}

function hideBoardTextEditor() {
  els.boardTextEditor.hidden = true;
  els.boardTextEditor.value = "";
  state.textEditing = null;
}

function removeItem(id) {
  const index = state.strokes.findIndex((item) => item.id === id);
  if (index < 0) return;
  state.redoStack = [];
  state.strokes.splice(index, 1);
  state.selectedId = null;
  renderBoard();
}

function moveItem(id, dx, dy) {
  const item = state.strokes.find((entry) => entry.id === id);
  if (!item) return;
  if (item.type === "path") item.points.forEach((point) => { point.x += dx; point.y += dy; });
  if (item.type === "line" || item.type === "arrow") {
    item.start.x += dx;
    item.start.y += dy;
    item.end.x += dx;
    item.end.y += dy;
  }
  if (["rect", "diamond", "ellipse", "text"].includes(item.type)) {
    item.x += dx;
    item.y += dy;
  }
}

function undoBoard() {
  const item = state.strokes.pop();
  if (!item) return;
  state.redoStack.push(item);
  state.selectedId = null;
  renderBoard();
}

function redoBoard() {
  const item = state.redoStack.pop();
  if (!item) return;
  state.strokes.push(item);
  renderBoard();
}

function zoomBoard(multiplier) {
  state.camera.scale = Math.max(0.5, Math.min(2, state.camera.scale * multiplier));
  renderBoard();
}

function hitTest(point) {
  for (let index = state.strokes.length - 1; index >= 0; index -= 1) {
    const item = state.strokes[index];
    const box = itemBounds(item);
    const pad = 8 / state.camera.scale;
    if (point.x >= box.x - pad && point.x <= box.x + box.w + pad && point.y >= box.y - pad && point.y <= box.y + box.h + pad) {
      return item.id;
    }
  }
  return null;
}

function itemBounds(item) {
  if (item.type === "path") {
    const xs = item.points.map((point) => point.x);
    const ys = item.points.map((point) => point.y);
    return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
  }
  if (item.type === "line" || item.type === "arrow") {
    return { x: Math.min(item.start.x, item.end.x), y: Math.min(item.start.y, item.end.y), w: Math.abs(item.end.x - item.start.x), h: Math.abs(item.end.y - item.start.y) };
  }
  if (item.type === "text") {
    return { x: item.x, y: item.y, w: Math.max(80, item.text.length * 10), h: 28 };
  }
  return { x: item.x, y: item.y, w: item.w, h: item.h };
}

function screenBounds(item) {
  const box = itemBounds(item);
  const topLeft = toScreen({ x: box.x, y: box.y });
  return { x: topLeft.x, y: topLeft.y, w: box.w * state.camera.scale, h: box.h * state.camera.scale };
}

function isDrawable(item) {
  if (item.type === "path") return item.points.length > 1;
  if (item.type === "line" || item.type === "arrow") return distance(item.start, item.end) > 4;
  return item.w > 4 && item.h > 4;
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function createId() {
  return `board-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function cssFont() {
  return getComputedStyle(document.body).fontFamily;
}

function boardFontSize() {
  return Math.max(14, 18 * state.camera.scale);
}

function cssColor(name) {
  return theme.getPropertyValue(name).trim();
}

function render() {
  const scenario = scenarios[state.scenarioIndex];
  const phases = phasePlans[state.mode];
  document.body.dataset.session = state.started ? "running" : state.ended ? "ended" : "idle";
  els.promptTitle.textContent = scenario.prompt;
  els.difficultySelect.value = state.difficulty;
  els.modeSelect.value = state.mode;
  els.phaseName.textContent = state.started ? phases[state.phaseIndex].label : state.ended ? "Session ended" : "Not started";
  els.phaseHint.textContent = state.started ? phaseHint(phases[state.phaseIndex].id) : state.ended ? "Debrief is ready. Start again when you want another run." : "Start when you are ready.";
  els.sessionClock.textContent = formatTime(state.elapsed);
  els.budgetLabel.textContent = `${state.transcript.filter((turn) => turn.isInterjection).length} interruptions`;
  els.startSession.disabled = state.started;
  els.shuffleChallenge.disabled = state.started;
  els.startSession.textContent = state.started ? "In session" : state.ended ? "Start again" : "Start";
  els.endSession.disabled = !state.started;
  els.sendTurn.disabled = !state.started || state.ended;
  els.voiceToggle.disabled = !state.started || state.ended || !state.voiceAvailable;
  els.voiceToggle.setAttribute("aria-pressed", String(state.listening || state.realtimeConnecting));
  els.voiceToggle.setAttribute("aria-label", state.listening || state.realtimeConnecting ? "Pause listening" : "Resume listening");
  if (!state.started && !state.ended && state.voiceAvailable) setListeningState("idle", "Not listening yet", "Start begins listening automatically.");
  if (state.ended) {
    els.interviewerState.textContent = "Ended";
    setListeningState("ended", "Mic ended", "Session ended. The debrief is ready.");
  }
}

function phaseHint(id) {
  const hints = {
    frame: "Clarify the challenge, user, pain points, context, constraints, and success criteria.",
    explore: "Outline the user story, map the flow, generate directions, and check assumptions with the interviewer.",
    deep: "Choose one direction, sketch the critical screens, and walk the interviewer through your reasoning.",
    push: "Handle edge cases, invite pushback, and adapt to new constraints.",
    wrap: "Summarize the decision, tradeoffs, success metrics, and what you would validate next."
  };
  return hints[id] || "Keep thinking out loud while you work.";
}

function announce(text) {
  els.screenReaderStatus.textContent = text;
}

function getWords(text) {
  return text.match(/\b[\w']+\b/g) || [];
}

function formatTime(ms) {
  const total = Math.floor(ms / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

init();
