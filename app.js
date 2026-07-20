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
    { id: "prompt", label: "Prompt", ms: 1 * 60 * 1000 },
    { id: "clarify", label: "Clarify", ms: 3 * 60 * 1000 },
    { id: "framing", label: "Framing", ms: 4 * 60 * 1000 },
    { id: "explore", label: "Explore / deep dive", ms: 8 * 60 * 1000 },
    { id: "wrap", label: "Wrap-up", ms: 4 * 60 * 1000 }
  ],
  full: [
    { id: "prompt", label: "Prompt", ms: 2 * 60 * 1000 },
    { id: "clarify", label: "Clarify", ms: 6 * 60 * 1000 },
    { id: "framing", label: "Framing", ms: 7 * 60 * 1000 },
    { id: "explore", label: "Explore / deep dive", ms: 20 * 60 * 1000 },
    { id: "wrap", label: "Wrap-up", ms: 10 * 60 * 1000 }
  ]
};

const frameworkSteps = [
  { id: "frame", label: "Goals & constraints" },
  { id: "user", label: "User & empathy" },
  { id: "flow", label: "Journey / flow" },
  { id: "system", label: "System tradeoffs" },
  { id: "wire", label: "Wire-level sketch" },
  { id: "validate", label: "Metrics & risks" }
];

const challengeFamilies = {
  "google-data-center-anomaly-dashboard": "systems",
  "google-travel-flight-delay-remediation": "systems",
  "appeal-policy": "constraint-led",
  "hacked-account": "constraint-led",
  "ai-agent-dashboard": "systems",
  "enterprise-admin-onboarding": "blue-sky",
  "gmail-search": "improve-x",
  "calendar-scheduling": "improve-x",
  "drive-permissions": "improve-x",
  "workspace-collaboration": "systems",
  "notification-priority": "systems",
  "ai-email-prioritization": "blue-sky",
  "ai-research-assistant": "blue-sky",
  "crm-meeting-prep": "blue-sky",
  "crm-follow-up": "blue-sky",
  "permission-model": "systems",
  "ai-explanations": "systems"
};

scenarios.push(
  {
    id: "meta-content-moderation-appeals",
    prompt: "Design a better appeal and resolution experience for creators whose content was removed incorrectly.",
    truth: {
      object: "A creator-facing appeal workflow with reviewer handoff, status clarity, and trust repair.",
      who: "Creators, small businesses, policy reviewers, and support operations teams.",
      platform: "Mobile-first creator tools with web support and notification surfaces.",
      goal: "Help creators understand decisions, provide useful evidence, and recover trust without exposing abuse-detection details.",
      constraint: "The system must handle high volume, adversarial misuse, and global policy differences.",
      curveball: "Policy Ops says reviewer capacity is cut by 40% this quarter."
    }
  },
  {
    id: "meta-family-privacy-sharing",
    prompt: "Design privacy controls for sharing family photos across a social graph.",
    truth: {
      object: "A privacy and sharing model for sensitive family content across overlapping audiences.",
      who: "Parents, relatives, close friends, teens, and people tagged in shared media.",
      platform: "Mobile social app with feed, messaging, albums, and notification surfaces.",
      goal: "Make sharing feel fast while preventing accidental exposure to the wrong audience.",
      constraint: "Audience models are hard to understand and mistakes can cause real harm.",
      curveball: "Research shows users misunderstand one key audience label in 30% of tests."
    }
  },
  {
    id: "netflix-household-travel-access",
    prompt: "Design account access for Netflix members who travel frequently or split time across households.",
    truth: {
      object: "A household access and verification experience that balances paid sharing policy with member empathy.",
      who: "Primary account owners, family members, travelers, students, and customer support agents.",
      platform: "TV, mobile, web account settings, email, and support flows.",
      goal: "Reduce unfair lockouts while preserving business rules around account sharing.",
      constraint: "TV input is slow, support contacts are expensive, and fraud patterns are adversarial.",
      curveball: "Data shows legitimate travelers and password-sharing abusers look identical in telemetry."
    }
  },
  {
    id: "netflix-content-discovery-confidence",
    prompt: "Improve content discovery when a Netflix member is unsure what they want to watch.",
    truth: {
      object: "A discovery and decision-support experience for choosing what to watch under uncertainty.",
      who: "Members browsing alone, couples/groups choosing together, and returning users with partial watch history.",
      platform: "TV-first browsing with mobile companion support.",
      goal: "Reduce browsing fatigue and increase confident starts without making the service feel repetitive.",
      constraint: "Recommendations can be accurate but still feel stale or over-personalized.",
      curveball: "A/B testing shows faster starts increase short-term plays but reduce satisfaction later."
    }
  },
  {
    id: "apple-health-medication-routine",
    prompt: "Design a medication routine experience for Apple Health that helps people stay adherent without feeling nagged.",
    truth: {
      object: "A medication tracking and reminder system that supports routines, exceptions, and caregiver trust.",
      who: "People managing recurring medication, caregivers, clinicians, and family supporters.",
      platform: "iPhone, Apple Watch, Health app, notifications, and optional caregiver sharing.",
      goal: "Help users take medication safely and consistently while preserving privacy and dignity.",
      constraint: "Health data is sensitive, reminders can create alarm fatigue, and missed doses need careful escalation.",
      curveball: "Clinical advisors say the app must distinguish skipped, delayed, and unknown doses."
    }
  },
  {
    id: "apple-cross-device-continuity",
    prompt: "Design cross-device continuity for starting a focused task on iPhone and finishing it on Mac.",
    truth: {
      object: "A continuity model that preserves task state, privacy, and user intent across Apple devices.",
      who: "People moving between phone, tablet, watch, and desktop during work or personal tasks.",
      platform: "iOS, macOS, iPadOS, notifications, widgets, handoff, and system settings.",
      goal: "Make task continuation feel obvious and trustworthy without surprising users.",
      constraint: "Some tasks involve private content, locked devices, or shared family devices.",
      curveball: "Privacy review says previews cannot reveal sensitive task content on locked screens."
    }
  }
);

const challengeCompanies = {
  "google-data-center-anomaly-dashboard": ["Google"],
  "google-travel-flight-delay-remediation": ["Google"],
  "appeal-policy": ["Google", "Meta"],
  "hacked-account": ["Google", "Meta", "Apple"],
  "ai-agent-dashboard": ["Google", "Meta"],
  "enterprise-admin-onboarding": ["Google", "Meta", "Apple"],
  "gmail-search": ["Google"],
  "calendar-scheduling": ["Google"],
  "drive-permissions": ["Google"],
  "workspace-collaboration": ["Google"],
  "notification-priority": ["Google", "Apple"],
  "ai-email-prioritization": ["Google", "Apple"],
  "ai-research-assistant": ["Google", "Meta", "Apple"],
  "crm-meeting-prep": ["Google", "Meta"],
  "crm-follow-up": ["Google", "Meta"],
  "permission-model": ["Google", "Meta", "Apple"],
  "ai-explanations": ["Google", "Meta", "Apple"],
  "meta-content-moderation-appeals": ["Meta"],
  "meta-family-privacy-sharing": ["Meta"],
  "netflix-household-travel-access": ["Netflix"],
  "netflix-content-discovery-confidence": ["Netflix"],
  "apple-health-medication-routine": ["Apple"],
  "apple-cross-device-continuity": ["Apple"]
};

const publicChallengePrompts = {
  "google-data-center-anomaly-dashboard": "Design a way for data-center staff to catch hardware problems before they spread.",
  "google-travel-flight-delay-remediation": "Design a way to help travelers recover from a flight delay.",
  "appeal-policy": "Design a way for people to challenge a decision they think is wrong.",
  "hacked-account": "Design a way for people to get back into an account they no longer control.",
  "ai-agent-dashboard": "Design a way to monitor automated work before it causes harm.",
  "enterprise-admin-onboarding": "Design a way for a new administrator to set up a complex product.",
  "gmail-search": "Design a better way to find something buried in messages.",
  "calendar-scheduling": "Design a better way to schedule time with other people.",
  "drive-permissions": "Design a better way to understand and change access.",
  "workspace-collaboration": "Design a way for teams to keep context as work moves between tools.",
  "notification-priority": "Design a way to help people notice what matters.",
  "ai-email-prioritization": "Design a way for AI to help people decide what needs attention.",
  "ai-research-assistant": "Design a way for AI to help someone research a topic.",
  "crm-meeting-prep": "Design a way to help someone prepare for an important customer conversation.",
  "crm-follow-up": "Design a way to follow up after a customer conversation.",
  "permission-model": "Design a reusable way to manage who can do what.",
  "ai-explanations": "Design a reusable way to explain an AI suggestion.",
  "meta-content-moderation-appeals": "Design a way for creators to recover when something was removed incorrectly.",
  "meta-family-privacy-sharing": "Design a safer way to share sensitive photos.",
  "netflix-household-travel-access": "Design a way for members to keep access when their situation changes.",
  "netflix-content-discovery-confidence": "Design a way to help someone choose what to watch.",
  "apple-health-medication-routine": "Design a way to support a recurring health routine.",
  "apple-cross-device-continuity": "Design a way to continue a task across devices."
};

const defaultConstraintDeck = [
  "Cut the V1 scope in half. What survives?",
  "Assume the user is on mobile, one-handed, with spotty connectivity.",
  "Legal says the team cannot store sensitive history locally.",
  "Engineering says the real-time API is not available for launch.",
  "Accessibility review says the current flow must work fully by keyboard and screen reader."
];

const familyHiddenContext = {
  systems: ["The team cares more about durable system behavior than a single polished screen.", "Success depends on how the experience behaves across surfaces and failure states."],
  "improve-x": ["The existing product is widely used, so migration and user trust matter.", "The team needs evidence that the change improves behavior without breaking learned workflows."],
  "constraint-led": ["The riskiest part of the problem is misuse, privacy, or account safety.", "The business wants speed, but trust and abuse prevention cannot regress."],
  "blue-sky": ["The team expects you to define the first valuable wedge.", "A good answer narrows ambiguity without pretending the whole product can ship at once."]
};

scenarios.forEach((scenario) => {
  const family = challengeFamilies[scenario.id] || "blue-sky";
  scenario.fullPrompt = scenario.prompt;
  scenario.prompt = publicChallengePrompts[scenario.id] || scenario.prompt;
  scenario.family = family;
  scenario.companies = challengeCompanies[scenario.id] || ["Google"];
  scenario.hiddenContext = [
    { key: "object", text: scenario.truth.object },
    { key: "who", text: scenario.truth.who },
    { key: "platform", text: scenario.truth.platform },
    { key: "goal", text: scenario.truth.goal },
    { key: "constraint", text: scenario.truth.constraint },
    { key: "success", text: scenario.truth.successMetric || familyHiddenContext[family][1] }
  ];
  scenario.constraints = [
    scenario.truth.curveball,
    ...defaultConstraintDeck,
    ...familyHiddenContext[family]
  ].slice(0, 5);
});

const state = {
  scenarioIndex: 0,
  difficulty: "hard",
  companies: ["Google"],
  mode: "full",
  started: false,
  ended: false,
  transcript: [],
  runningSummary: "",
  realtimeItems: [],
  revealed: new Set(),
  constraints: [],
  assumptions: [],
  usedConstraintTexts: new Set(),
  curveballUsed: false,
  phaseIndex: 0,
  phaseElapsed: 0,
  phaseHistory: [],
  lastPhaseChangeAt: 0,
  endedAtText: "",
  elapsed: 0,
  lastInterjectionAt: 0,
  lastCandidateAt: 0,
  lastCandidateQuestionAt: 0,
  directQuestionUntil: 0,
  clarifyNudgeUsed: false,
  wrapMetricsPrompted: false,
  wrapMoreTimePrompted: false,
  wrapSummaryPrompted: false,
  timeCalled: false,
  quietUntil: 0,
  canvasActive: false,
  typingActive: false,
  lastCanvasActivityAt: 0,
  sceneCaptureTimer: null,
  autosaveTimer: null,
  transcriptAutoScroll: true,
  modelCallCount: 0,
  modelCallLimit: 12,
  pendingOpening: false,
  skipNextInterviewerTranscript: false,
  tabId: globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `tab-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  queuedRealtimeInstructions: "",
  queuedRealtimeOptions: null,
  lastClarificationKey: "",
  lastClarificationAnswer: "",
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
  sceneElementsRaw: [],
  boardText: "",
  boardSummary: "",
  lastSentSceneSignature: "",
  lastBoardActivityAt: 0,
  boardPrompted: false,
  firstBoardNudgeAt: 0,
  voiceRunId: 0,
  realtime: null,
  realtimeReady: false,
  realtimeConnecting: false,
  realtimeResponseActive: false,
  realtimeResponseRequested: false,
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
  stickyChallenge: document.querySelector("#stickyChallenge"),
  stickyPrompt: document.querySelector("#stickyPrompt"),
  shuffleChallenge: document.querySelector("#shuffleChallenge"),
  difficultySelect: document.querySelector("#difficultySelect"),
  companyPicker: document.querySelector("#companyPicker"),
  companyPickerLabel: document.querySelector("#companyPickerLabel"),
  companyCheckboxes: document.querySelectorAll("input[name='company']"),
  modeSelect: document.querySelector("#modeSelect"),
  startSession: document.querySelector("#startSession"),
  endSession: document.querySelector("#endSession"),
  phaseName: document.querySelector("#phaseName"),
  phaseHint: document.querySelector("#phaseHint"),
  frameworkTracker: document.querySelector("#frameworkTracker"),
  frameworkSteps: document.querySelector("#frameworkSteps"),
  frameworkModeLabel: document.querySelector("#frameworkModeLabel"),
  constraintLedger: document.querySelector("#constraintLedger"),
  constraintCount: document.querySelector("#constraintCount"),
  constraintList: document.querySelector("#constraintList"),
  sessionClock: document.querySelector("#sessionClock"),
  callCounter: document.querySelector("#callCounter"),
  interviewerState: document.querySelector("#interviewerState"),
  budgetLabel: document.querySelector("#budgetLabel"),
  interviewerLog: document.querySelector("#interviewerLog"),
  candidateInput: document.querySelector("#candidateInput"),
  sendTurn: document.querySelector("#sendTurn"),
  voiceToggle: document.querySelector("#voiceToggle"),
  askInterviewer: document.querySelector("#askInterviewer"),
  askInterviewerLabel: document.querySelector("#askInterviewerLabel"),
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
const voiceOwnerKey = "whiteboard-sim-active-voice-tab";
let voiceChannel = null;
let microphoneResumeTimer = null;

function init() {
  window.speechSynthesis?.cancel();
  setupVoice();
  setupVoiceOwnership();
  offerResumeIfAvailable();
  bindEvents();
  setupStickyChallenge();
  setupBoard();
  render();
}

function setupStickyChallenge() {
  if (!els.stickyChallenge || !els.promptTitle) return;
  if (!("IntersectionObserver" in window)) {
    els.stickyChallenge.hidden = false;
    return;
  }
  const observer = new IntersectionObserver(([entry]) => {
    els.stickyChallenge.hidden = entry.isIntersecting;
  }, { threshold: 0.05 });
  observer.observe(els.promptTitle);
}

function bindEvents() {
  els.shuffleChallenge.addEventListener("click", shuffleChallenge);
  els.difficultySelect.addEventListener("change", () => {
    state.difficulty = els.difficultySelect.value;
    render();
  });
  els.companyCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", updateCompanyFilter);
  });
  els.modeSelect.addEventListener("change", () => {
    state.mode = els.modeSelect.value;
    resetSession();
  });
  els.startSession.addEventListener("click", startSession);
  els.endSession.addEventListener("click", endSession);
  els.sendTurn.addEventListener("click", submitCandidateTurn);
  els.voiceToggle.addEventListener("click", (event) => {
    event.preventDefault();
    if (state.started && !state.ended && !state.listening && !state.realtimeConnecting) startListening();
  });
  els.askInterviewer.addEventListener("click", armDirectQuestion);
  els.undoBoard?.addEventListener("click", undoBoard);
  els.redoBoard?.addEventListener("click", redoBoard);
  els.zoomOut?.addEventListener("click", () => zoomBoard(0.88));
  els.zoomIn?.addEventListener("click", () => zoomBoard(1.14));
  els.boardTextEditor?.addEventListener("blur", commitBoardText);
  els.boardTextEditor?.addEventListener("keydown", handleBoardTextKeydown);
  els.candidateInput.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") submitCandidateTurn();
  });
  els.interviewerLog.addEventListener("scroll", () => {
    const remaining = els.interviewerLog.scrollHeight - els.interviewerLog.clientHeight - els.interviewerLog.scrollTop;
    state.transcriptAutoScroll = remaining < 24;
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
  state.lastPhaseChangeAt = 0;
  state.phaseHistory = [{ id: currentPhase().id, label: currentPhase().label, startedAt: 0, endedAt: null }];
  state.lastCandidateAt = Date.now();
  state.lastCanvasActivityAt = Date.now();
  state.lastInterjectionAt = 0;
  const prompt = openingLine();
  logMessage("interviewer", prompt);
  announce(`Interviewer: ${prompt}`);
  state.pendingOpening = true;
  setListeningState("requesting", "Connecting interviewer", "The interviewer is joining and will listen while you work.");
  startListening();
  state.timer = setInterval(tick, 1000);
  state.autosaveTimer = setInterval(saveSessionSnapshot, 10000);
  saveSessionSnapshot();
  render();
}

function endSession() {
  if (!state.started) return;
  finalizePhaseHistory();
  state.ended = true;
  state.started = false;
  state.endedAtText = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  clearInterval(state.timer);
  clearInterval(state.autosaveTimer);
  state.timer = null;
  state.autosaveTimer = null;
  stopListening();
  showDebrief();
  clearSessionSnapshot();
  render();
}

function resetSession() {
  clearInterval(state.timer);
  clearInterval(state.autosaveTimer);
  clearSceneCaptureTimer();
  stopListening();
  Object.assign(state, {
    started: false,
    ended: false,
    transcript: [],
    runningSummary: "",
    realtimeItems: [],
    revealed: new Set(),
    constraints: [],
    assumptions: [],
    usedConstraintTexts: new Set(),
    curveballUsed: false,
    phaseIndex: 0,
    phaseElapsed: 0,
    phaseHistory: [],
    lastPhaseChangeAt: 0,
    endedAtText: "",
    elapsed: 0,
    lastInterjectionAt: 0,
    lastCandidateAt: 0,
    lastCandidateQuestionAt: 0,
    directQuestionUntil: 0,
    clarifyNudgeUsed: false,
    wrapMetricsPrompted: false,
    wrapMoreTimePrompted: false,
    wrapSummaryPrompted: false,
    timeCalled: false,
    quietUntil: 0,
    canvasActive: false,
    typingActive: false,
    lastCanvasActivityAt: 0,
    autosaveTimer: null,
    transcriptAutoScroll: true,
    modelCallCount: 0,
    pendingOpening: false,
    skipNextInterviewerTranscript: false,
    queuedRealtimeInstructions: "",
    queuedRealtimeOptions: null,
    lastClarificationKey: "",
    lastClarificationAnswer: "",
    timer: null,
    strokes: [],
    redoStack: [],
    activeStroke: null,
    boardElements: [],
    sceneElementsRaw: [],
    boardText: "",
    boardSummary: "",
    lastSentSceneSignature: "",
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
    realtimeResponseRequested: false,
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
  const candidates = scenarios
    .map((scenario, index) => ({ scenario, index }))
    .filter((item) => scenarioMatchesSelectedCompanies(item.scenario))
    .filter((item) => item.index !== state.scenarioIndex);
  const next = candidates[Math.floor(Math.random() * candidates.length)] || { index: (state.scenarioIndex + 1) % scenarios.length };
  state.scenarioIndex = next.index;
  resetSession();
  announce(`New design challenge: ${scenarios[state.scenarioIndex].prompt}`);
}

function updateCompanyFilter() {
  const selected = [...els.companyCheckboxes].filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value);
  state.companies = selected.length ? selected : ["Google"];
  if (!selected.length) {
    const google = [...els.companyCheckboxes].find((checkbox) => checkbox.value === "Google");
    if (google) google.checked = true;
  }
  renderCompanyPickerLabel();
  if (!scenarioMatchesSelectedCompanies(scenarios[state.scenarioIndex])) shuffleChallenge();
  else render();
}

function scenarioMatchesSelectedCompanies(scenario) {
  return (scenario.companies || ["Google"]).some((company) => state.companies.includes(company));
}

function renderCompanyPickerLabel() {
  if (!els.companyPickerLabel) return;
  els.companyCheckboxes.forEach((checkbox) => {
    checkbox.checked = state.companies.includes(checkbox.value);
  });
  els.companyPickerLabel.textContent = state.companies.length === 1 ? state.companies[0] : `${state.companies.length} companies`;
  els.companyPickerLabel.setAttribute("aria-label", `Companies: ${state.companies.join(", ")}`);
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
  recordTranscriptTurn("candidate", text);
  announce(`Candidate: ${text}`);

  if (requestQuietTime(text)) {
    state.quietUntil = Date.now() + 120000;
    respond("Of course, take your time.", false, { force: true });
    render();
    return;
  }

  const answer = answerQuestion(text);
  if (answer) {
    respond(answer, false, { force: true });
  } else if (options.forceResponse && shouldInterviewerRespondTo(text)) {
    respond(interviewerReaction(text), false, { force: true });
  } else {
    setSilent();
  }
}

function setupVoice() {
  state.voiceAvailable = Boolean(window.RTCPeerConnection && navigator.mediaDevices?.getUserMedia);
  if (!state.voiceAvailable) {
    useFallback("Voice unavailable — continuing without live voice. Your board is safe.");
    els.voiceToggle.disabled = true;
  }
}

function setupVoiceOwnership() {
  window.addEventListener("storage", (event) => {
    if (event.key !== voiceOwnerKey || !event.newValue) return;
    try {
      const owner = JSON.parse(event.newValue);
      handleExternalVoiceClaim(owner.id);
    } catch {
      // Ignore malformed ownership records from older builds.
    }
  });
  if ("BroadcastChannel" in window) {
    voiceChannel = new BroadcastChannel("whiteboard-sim-voice");
    voiceChannel.addEventListener("message", (event) => {
      if (event.data?.type === "voice-claimed") handleExternalVoiceClaim(event.data.id);
    });
  }
}

function claimVoiceOwnership() {
  const owner = { id: state.tabId, at: Date.now() };
  try {
    localStorage.setItem(voiceOwnerKey, JSON.stringify(owner));
  } catch {
    // Private browsing can block storage; BroadcastChannel still covers modern tabs.
  }
  voiceChannel?.postMessage({ type: "voice-claimed", id: state.tabId });
}

function handleExternalVoiceClaim(ownerId) {
  if (!ownerId || ownerId === state.tabId) return;
  if (!state.listening && !state.realtimeConnecting && !state.realtimeReady && !state.realtimeResponseActive) return;
  state.voiceRunId += 1;
  state.listening = false;
  clearNoSpeechTimer();
  disconnectRealtime();
  setListeningState("idle", "Voice moved to another tab", "Only one interviewer voice can run at a time.");
  els.voiceToggle.classList.remove("listening");
}

function toggleVoice() {
  if (state.listening || state.realtimeConnecting) stopListening();
  else startListening();
}

function armDirectQuestion() {
  if (!state.started || state.ended) return;
  const alreadyArmed = state.directQuestionUntil > Date.now();
  state.directQuestionUntil = alreadyArmed ? 0 : Date.now() + 30000;
  if (!alreadyArmed) {
    announce("Ask interviewer armed. Your next spoken turn will receive an answer.");
    setListeningState("listening", "Ask the interviewer", "Speak your question now. The next turn is directed to the interviewer.");
  }
  renderAskInterviewer();
}

function hasDirectQuestionIntent(text = "") {
  if (state.directQuestionUntil > Date.now()) return true;
  const normalized = String(text).toLowerCase();
  return [
    "interviewer",
    "hey interviewer",
    "question for you",
    "i have a question",
    "can you answer",
    "could you answer",
    "can you clarify",
    "could you clarify",
    "can you tell me",
    "could you tell me"
  ].some((phrase) => normalized.includes(phrase));
}

function consumeDirectQuestionIntent(text) {
  const directed = hasDirectQuestionIntent(text);
  if (directed) state.directQuestionUntil = 0;
  renderAskInterviewer();
  return directed;
}

function renderAskInterviewer() {
  if (!els.askInterviewer) return;
  const armed = state.directQuestionUntil > Date.now();
  els.askInterviewer.classList.toggle("armed", armed);
  els.askInterviewer.setAttribute("aria-pressed", String(armed));
  els.askInterviewerLabel.textContent = armed ? "Ask now…" : "Ask interviewer";
}

function handlePushToTalkKeydown(event) {
  if (event.code !== "Space" || event.repeat || !state.started || state.ended) return;
  const target = event.target;
  const isTyping = ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName) || target?.isContentEditable;
  const isCanvasWork = target?.closest?.(".excalidraw");
  if (isTyping || isCanvasWork) return;
  event.preventDefault();
  if (!state.listening && !state.realtimeConnecting) startListening();
}

function handlePushToTalkKeyup(event) {
  if (event.code !== "Space" || !state.started || state.ended) return;
  const target = event.target;
  if (target?.closest?.(".excalidraw")) return;
  if (state.listening || state.realtimeConnecting) stopListening();
}

async function startListening() {
  if (!state.voiceAvailable || state.listening || state.realtimeConnecting || !state.started || state.ended) return;
  claimVoiceOwnership();
  const runId = state.voiceRunId + 1;
  state.voiceRunId = runId;
  state.listening = true;
  setListeningState("requesting", "Requesting microphone", "Allow microphone access if your browser asks.");
  els.voiceToggle.classList.add("listening");
  try {
    await connectRealtime(runId);
    if (!isActiveVoiceRun(runId)) return;
    setListeningState("listening", "Interviewer listening", "Think out loud. The interviewer will answer direct questions and otherwise observe.");
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
  setListeningState(
    state.ended ? "ended" : "Interviewer disconnected",
    state.ended ? "Session complete" : "Start again to reconnect the interviewer."
  );
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
  const localStream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      channelCount: 1
    }
  });
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
      useFallback("Voice unavailable — continuing without live voice. Your board is safe. Press the mic to retry.");
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
    setListeningState("listening", "Interviewer listening", "Think out loud. The interviewer will answer when you ask them directly.");
    if (state.pendingOpening) {
      state.pendingOpening = false;
      createRealtimeOpening();
    }
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
  clearTimeout(microphoneResumeTimer);
  microphoneResumeTimer = null;
  cancelRealtimeResponse();
  state.realtimeReady = false;
  state.realtimeConnecting = false;
  state.realtimeResponseActive = false;
  state.realtimeResponseRequested = false;
  state.queuedRealtimeInstructions = "";
  state.queuedRealtimeOptions = null;
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
    // Ignore echo/noise detected while the interviewer is answering. The mic
    // is paused for responses, but a buffered VAD event can still arrive.
    if (state.realtimeResponseActive || state.realtimeResponseRequested) return;
    clearNoSpeechTimer();
    state.lastCandidateAt = Date.now();
    state.interimText = "Listening...";
    setListeningState("receiving", "Hearing you", "I am hearing you. Keep thinking out loud.");
    renderLiveTranscript();
    return;
  }
  if (event.type === "input_audio_buffer.speech_stopped") {
    if (state.realtimeResponseActive || state.realtimeResponseRequested) return;
    state.interimText = "";
    setListeningState("listening", "Interviewer listening", "I heard you. I will stay quiet unless you ask the interviewer directly.");
    renderLiveTranscript();
    return;
  }
  if (event.type === "conversation.item.input_audio_transcription.completed") {
    if (state.realtimeResponseActive || state.realtimeResponseRequested) return;
    const text = event.transcript?.trim();
    state.interimText = "";
    if (text && shouldKeepTranscription(text, event) && !state.loggedCandidateItems.has(event.item_id || text)) {
      const directQuestion = consumeDirectQuestionIntent(text);
      state.loggedCandidateItems.add(event.item_id || text);
      state.transcriptText = `${state.transcriptText} ${text}`.trim();
      recordTranscriptTurn("candidate", text, { realtimeItemId: event.item_id || "" });
      logMessage("candidate", text);
      announce(`Candidate: ${text}`);
      if (requestQuietTime(text)) {
        state.quietUntil = Date.now() + 120000;
        requestRealtimeResponse('Say exactly: "Of course, take your time." Then stop speaking.', { force: true });
      } else {
        const clarifyingAnswer = answerQuestion(text);
        if (clarifyingAnswer) {
          state.lastCandidateQuestionAt = Date.now();
          requestRealtimeResponse(clarificationResponseInstruction(text, clarifyingAnswer), { force: true });
        } else if ((directQuestion || shouldInterviewerRespondTo(text)) && canInterviewerSpeak({ direct: true }).allowed) {
          state.lastCandidateQuestionAt = Date.now();
          requestRealtimeResponse(responseInstructionFor(text, { directQuestion }));
        } else {
          els.interviewerState.textContent = "Listening";
        }
      }
    }
    renderLiveTranscript();
    return;
  }
  if (event.type === "conversation.item.created" && event.item?.id) {
    rememberRealtimeItem(event.item.id, event.item.role || "unknown");
    return;
  }
  if (event.type === "response.created") {
    state.realtimeResponseActive = true;
    state.interviewerDraft = "";
    setMicrophoneCapture(false);
    updateInterviewerState();
    return;
  }
  if (isRealtimeTextDelta(event)) {
    state.interviewerDraft += event.delta || "";
    // The opening challenge is already rendered synchronously in startSession().
    // Keep collecting its audio transcript for bookkeeping, but do not render a
    // second live draft card while the interviewer reads the same text aloud.
    if (!state.skipNextInterviewerTranscript) setInterviewerDraft(state.interviewerDraft);
    return;
  }
  if (isRealtimeTextDone(event)) {
    state.interviewerDraft = event.transcript || event.text || event.output_text || state.interviewerDraft;
    if (!state.skipNextInterviewerTranscript) setInterviewerDraft(state.interviewerDraft);
    return;
  }
  if (event.type === "response.done") {
    state.realtimeResponseActive = false;
    state.realtimeResponseRequested = false;
    const finalText = extractRealtimeResponseText(event) || state.interviewerDraft;
    if (finalText.trim()) {
      const text = sanitizeInterviewerText(finalText.trim());
      if (state.skipNextInterviewerTranscript) {
        state.skipNextInterviewerTranscript = false;
        const draft = els.interviewerLog.querySelector("[data-draft='true']");
        if (draft) draft.remove();
      } else {
        recordTranscriptTurn("interviewer", text, { realtimeItemIds: responseOutputItemIds(event) });
        maybePinConstraint(text);
        replaceInterviewerDraft(text);
        announce(`Interviewer: ${text}`);
      }
    }
    state.interviewerDraft = "";
    resumeMicrophoneAfterResponse();
    updateInterviewerState();
    flushQueuedRealtimeResponse();
    return;
  }
  if (event.type === "error") {
    const message = event.error?.message || "";
    state.realtimeResponseActive = false;
    state.realtimeResponseRequested = false;
    state.interviewerDraft = "";
    resumeMicrophoneAfterResponse();
    if (/cancel|no active response/i.test(message)) {
      setSilent();
      flushQueuedRealtimeResponse();
      return;
    }
    useFallback("Give me a moment to look at your board.");
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

function responseOutputItemIds(event) {
  return (event.response?.output || []).map((item) => item.id).filter(Boolean);
}

function recordTranscriptTurn(role, text, extra = {}) {
  const turn = { role, text, at: state.elapsed, ...extra };
  state.transcript.push(turn);
  if (role === "candidate") trackCandidateAssumptions(text);
  updateRunningSummary();
  if (extra.realtimeItemId) rememberRealtimeItem(extra.realtimeItemId, role);
  if (extra.realtimeItemIds) extra.realtimeItemIds.forEach((id) => rememberRealtimeItem(id, role));
  pruneRealtimeConversationWindow();
  return turn;
}

function updateRunningSummary() {
  const candidateText = state.transcript
    .filter((turn) => turn.role === "candidate")
    .map((turn) => turn.text)
    .join(" ");
  const facts = [];
  if (state.revealed.has("who")) facts.push("user/context clarified");
  if (state.revealed.has("goal")) facts.push("goal clarified");
  if (state.revealed.has("constraint")) facts.push("constraint clarified");
  if (frameworkStepHasEvidence("frame")) facts.push("candidate framed the problem");
  if (frameworkStepHasEvidence("user")) facts.push("candidate named users or context");
  if (frameworkStepHasEvidence("flow")) facts.push("candidate discussed flow/journey");
  if (frameworkStepHasEvidence("wire")) facts.push("candidate has board structure or wire-level sketching");
  if (frameworkStepHasEvidence("validate")) facts.push("candidate mentioned metrics/validation");
  const assumptionPhrases = extractSummaryPhrases(candidateText, ["assume", "assuming", "scope", "goal", "user", "because"]).slice(-3);
  const constraints = state.constraints.slice(0, 3).map((item) => item.text);
  const assumptions = state.assumptions.slice(0, 3).map((item) => item.invalidated ? `${item.text} (invalidated)` : item.text);
  const parts = [
    facts.length ? `Progress: ${dedupe(facts).join(", ")}.` : "Progress: no durable framing signal yet.",
    assumptionPhrases.length || assumptions.length ? `Recent assumptions/rationale: ${[...assumptionPhrases, ...assumptions].slice(-3).join(" / ")}.` : "",
    constraints.length ? `Pinned constraints: ${constraints.join(" / ")}.` : ""
  ].filter(Boolean);
  state.runningSummary = truncateText(parts.join(" "), 700);
}

function trackCandidateAssumptions(text) {
  const normalized = String(text || "").replace(/\s+/g, " ").trim();
  if (!normalized) return;
  const patterns = [
    /\b(?:i(?:'ll| will)? assume|i am assuming|i'm assuming|let'?s assume|my assumption is|assuming that)\b([^.!?]{4,140})/i,
    /\b(?:for v1|for now|i'll scope|i will scope)\b([^.!?]{4,140})/i
  ];
  patterns.forEach((pattern) => {
    const match = normalized.match(pattern);
    if (!match?.[0]) return;
    const assumption = truncateText(match[0].trim(), 170);
    if (state.assumptions.some((item) => item.text.toLowerCase() === assumption.toLowerCase())) return;
    state.assumptions.unshift({ text: assumption, at: state.elapsed, invalidated: false });
  });
  if (state.assumptions.length > 8) state.assumptions.length = 8;
  renderConstraintLedger();
}

function extractSummaryPhrases(text, markers) {
  const sentences = String(text || "").split(/[.!?]+/).map((item) => item.trim()).filter(Boolean);
  return sentences
    .filter((sentence) => markers.some((marker) => sentence.toLowerCase().includes(marker)))
    .map((sentence) => truncateText(sentence, 150));
}

function dedupe(items) {
  return [...new Set(items)];
}

function recentTranscriptWindow(windowMs = 2 * 60 * 1000) {
  const cutoff = Math.max(0, state.elapsed - windowMs);
  return state.transcript
    .filter((turn) => turn.at >= cutoff)
    .slice(-12)
    .map((turn) => `${turn.role}: ${turn.text}`)
    .join(" / ");
}

function rememberRealtimeItem(itemId, role) {
  if (!itemId || state.realtimeItems.some((item) => item.id === itemId)) return;
  state.realtimeItems.push({ id: itemId, role, at: state.elapsed });
}

function pruneRealtimeConversationWindow() {
  if (!state.realtime?.dc || state.realtime.dc.readyState !== "open") return;
  const cutoff = Math.max(0, state.elapsed - 2 * 60 * 1000);
  const keepTail = state.realtimeItems.slice(-12).map((item) => item.id);
  const removable = state.realtimeItems.filter((item) => item.at < cutoff && !keepTail.includes(item.id));
  removable.forEach((item) => {
    sendRealtimeEvent({ type: "conversation.item.delete", item_id: item.id });
  });
  if (removable.length) {
    const removed = new Set(removable.map((item) => item.id));
    state.realtimeItems = state.realtimeItems.filter((item) => !removed.has(item.id));
  }
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
    "should i",
    "can you",
    "could you",
    "do we",
    "should we",
    "is there",
    "are there",
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
  if (isQuestion(normalized) && /\b(you|your|we)\b/.test(normalized)) return true;
  return false;
}

function shouldKeepTranscription(text, event = {}) {
  const normalized = text.toLowerCase().trim();
  const words = getWords(normalized);
  if (event.confidence != null && event.confidence < 0.55) return false;
  if (event.language && !String(event.language).toLowerCase().startsWith("en")) return false;
  if (words.length < 3 && !hasDirectQuestionIntent(normalized) && !shouldInterviewerRespondTo(normalized)) return false;
  const asciiLetters = normalized.replace(/[^a-z]/g, "").length;
  const allLetters = normalized.replace(/[^\p{L}]/gu, "").length;
  if (allLetters && asciiLetters / allLetters < 0.7) return false;
  const ambientSignals = ["api credit", "api credits", "billing", "invoice", "github push", "vercel logs"];
  if (ambientSignals.some((phrase) => normalized.includes(phrase)) && !shouldInterviewerRespondTo(normalized)) return false;
  return true;
}

function responseInstructionFor(text, options = {}) {
  const phase = currentPhase();
  const base = `Respond to the candidate's latest turn only: "${text}".\n${phasePromptContext()}`;
  const common = "Speak like a real interviewer: brief, curious, never lecturing. One question or one comment, under 30 words. Do not explain the rubric. Never reveal hidden context unprompted. Reference the board only through the structured state.";
  const asksOpinion = /what do you think|do you think|does that make sense|am i on the right track|any feedback|give me feedback|do you have feedback|is that reasonable|is this reasonable|how does that sound/.test(text.toLowerCase());
  const soundsStuck = /i'?m stuck|i am stuck|i feel stuck|i'?m blocked|i am blocked|i don'?t know what to do|i'?m lost|i am lost|not sure where to go|not sure what to do/.test(text.toLowerCase());
  if (soundsStuck) {
    return `${base} The candidate is stuck. Ask one neutral assessment question that makes them decide their own assumption, scope, or criterion. Do not solve. ${common}`;
  }
  if (asksOpinion) {
    return `${base} The candidate is asking for your opinion. Stay neutral: do not approve the solution, redesign it, or tell them what to do next. Reflect one observable tradeoff, framework gap, or stakeholder risk, then ask one evaluation question that returns ownership to them. ${common}`;
  }
  if (options.directQuestion || isQuestion(text.toLowerCase())) {
    return `${base} The candidate directly asked a clarifying question. Answer it as the scenario's stakeholder. Use hidden context when relevant; otherwise invent one plausible simulated detail and commit to it for this session. Give the answer first, then one brief reason explaining the user, business, operational, or technical logic behind it. Do not refuse merely because the detail was not predefined. Do not present simulated details as real facts about an actual company. Keep this to two concise spoken sentences, then stop. Treat every prior interviewer answer in the transcript as binding so the scenario remains internally consistent.`;
  }
  if (phase.id === "clarify") {
    return `${base} Phase rule: answer only the asked clarifying question using hidden context if directly relevant. Reveal at most one fact. Do not ask framing questions. ${common}`;
  }
  if (phase.id === "wrap") {
    return `${base} Phase rule: help the candidate summarize, measure success, and state next steps. Do not inject new constraints. ${common}`;
  }
  if (state.difficulty === "easy") {
    return `${base} Easy mode: be friendly, structured, and patient. If they forgot the framework, explicitly prompt the next framework step without giving the answer. Agree with valid assumptions unless they conflict with the scenario. ${common}`;
  }
  if (state.difficulty === "hard") {
    return `${base} Hard mode: be analytical, skeptical, time-conscious, and focused on system tradeoffs. Push weak assumptions, especially early assumptions, but do not solve. If giving pushback, make it about logic, evidence, scope, feasibility, or resilience under a severe pivot. ${common}`;
  }
  return `${base} Medium mode: be professional, collaborative, and sharp. Expect the candidate to drive the framework without prompting. If they ask for feedback, challenge one assumption only when it lacks data or logic. ${common}`;
}

function clarificationResponseInstruction(question, seededAnswer) {
  return `The candidate asked this clarifying question: "${question}".
Answer as the scenario's stakeholder. Use this established scenario fact as the core answer: "${seededAnswer}"
Give the answer first, then add one concise sentence explaining why it is true from a user, business, operational, or technical perspective. You may invent one plausible supporting detail when useful, but frame the entire exchange as simulated interview context—not a real claim about an actual company. Commit to the answer and keep it internally consistent in later turns. Do not ask a question back. Stop after two short spoken sentences.`;
}

function createRealtimeOpening() {
  state.skipNextInterviewerTranscript = true;
  requestRealtimeResponse(`Read this challenge aloud exactly, then stop: "${openingLine()}"`, { force: true });
}

function phasePromptContext() {
  const scenario = scenarios[state.scenarioIndex];
  return `
Session phase: ${currentPhase().label}. Difficulty: ${state.difficulty}. Time remaining: ${formatTime(Math.max(0, totalSessionMs() - state.elapsed))}.
Challenge: ${scenario.prompt}
Hidden context, reveal only if asked: ${(scenario.hiddenContext || []).map((fact) => `${fact.key}: ${fact.text}`).join(" | ")}
Board state: ${boardContextForPrompt()}
Running summary: ${state.runningSummary || "No durable summary yet."}
Recent transcript window, last ~2 minutes only: ${recentTranscriptWindow() || "No recent transcript."}
Rules for this phase: ${phaseRulesForPrompt(currentPhase().id)}
`.trim();
}

function phaseRulesForPrompt(id) {
  const rules = {
    prompt: "Read or restate the challenge only. Volunteer nothing beyond the prompt text.",
    clarify: "Answer clarifying questions directly. Use hidden context first; when it does not contain the answer, invent one plausible simulated stakeholder detail, briefly explain why, and keep it consistent for the session. Never ask framing questions instead of answering.",
    framing: "Stay mostly silent. If truly needed, ask at most one guiding question after a long stall.",
    explore: "Observe active work. Do not interrupt drawing or typing. Use at most one natural constraint injection if allowed by difficulty.",
    wrap: "Become active around success metrics, summary, and what the candidate would do with more time. Never introduce new constraints."
  };
  return rules[id] || "Stay brief and candidate-led.";
}

function sendRealtimeText(text) {
  state.lastCandidateAt = Date.now();
  recordTranscriptTurn("candidate", text);
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
  if (requestQuietTime(text)) {
    state.quietUntil = Date.now() + 120000;
    requestRealtimeResponse('Say exactly: "Of course, take your time." Then stop speaking.', { force: true });
  } else {
    const clarifyingAnswer = answerQuestion(text);
    if (clarifyingAnswer) {
      requestRealtimeResponse(clarificationResponseInstruction(text, clarifyingAnswer), { force: true });
    } else if (shouldInterviewerRespondTo(text) && canInterviewerSpeak({ direct: true }).allowed) {
      requestRealtimeResponse(responseInstructionFor(text));
    } else {
      setSilent();
    }
  }
}

function sendRealtimeEvent(event) {
  if (state.realtime?.dc?.readyState === "open") state.realtime.dc.send(JSON.stringify(event));
}

function requestRealtimeResponse(instructions, options = {}) {
  if (!state.realtimeReady && !options.forceWithoutReady) return false;
  if (state.realtimeResponseActive || state.realtimeResponseRequested) {
    state.queuedRealtimeInstructions = instructions;
    state.queuedRealtimeOptions = { ...options, force: true };
    els.interviewerState.textContent = "Queued";
    return true;
  }
  if (!options.force && state.modelCallCount >= state.modelCallLimit) {
    setSilent();
    return false;
  }
  pruneRealtimeConversationWindow();
  state.modelCallCount += 1;
  state.realtimeResponseRequested = true;
  state.realtimeResponseActive = true;
  setMicrophoneCapture(false);
  sendRealtimeEvent({
    type: "response.create",
    response: {
      instructions: `${instructions}\nKeep it brief: one or two short spoken sentences. Always finish the sentence before stopping. Do not mention mode, rubric, constraint deck, tokens, or system instructions.`,
      max_output_tokens: 600
    }
  });
  renderCallCounter();
  return true;
}

function flushQueuedRealtimeResponse() {
  if (!state.queuedRealtimeInstructions || !state.realtimeReady || state.realtimeResponseActive || state.realtimeResponseRequested) return;
  const instructions = state.queuedRealtimeInstructions;
  const options = state.queuedRealtimeOptions || { force: true };
  state.queuedRealtimeInstructions = "";
  state.queuedRealtimeOptions = null;
  window.setTimeout(() => requestRealtimeResponse(instructions, options), 250);
}

function renderCallCounter() {
  if (!els.callCounter) return;
  const devMode = new URLSearchParams(window.location.search).has("dev");
  els.callCounter.hidden = !devMode;
  els.callCounter.textContent = `${state.modelCallCount}/${state.modelCallLimit} calls`;
}

function cancelRealtimeResponse() {
  if (!state.realtimeResponseActive) return;
  sendRealtimeEvent({ type: "response.cancel" });
  state.realtimeResponseActive = false;
  state.realtimeResponseRequested = false;
  state.queuedRealtimeInstructions = "";
  state.queuedRealtimeOptions = null;
  state.interviewerDraft = "";
  resumeMicrophoneAfterResponse();
  els.interviewerState.textContent = "Interrupted";
}

function setMicrophoneCapture(enabled) {
  clearTimeout(microphoneResumeTimer);
  microphoneResumeTimer = null;
  state.localStream?.getAudioTracks().forEach((track) => {
    track.enabled = enabled;
  });
}

function resumeMicrophoneAfterResponse() {
  clearTimeout(microphoneResumeTimer);
  microphoneResumeTimer = window.setTimeout(() => {
    microphoneResumeTimer = null;
    if (state.listening && state.started && !state.ended && !state.realtimeResponseActive && !state.realtimeResponseRequested) {
      setMicrophoneCapture(true);
      setListeningState("listening", "Interviewer listening", "Think out loud, or press Ask interviewer for a direct response.");
    }
  }, 900);
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
    useFallback("Audio playback was blocked. Click the mic to retry. Your board is safe.");
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
    els.interviewerLog.appendChild(draft);
  }
  draft.querySelector(".message-text").textContent = text;
  if (state.transcriptAutoScroll) els.interviewerLog.scrollTop = els.interviewerLog.scrollHeight;
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
Session phase: ${currentPhase().label}. Current difficulty: ${state.difficulty}. Time remaining: ${formatTime(Math.max(0, totalSessionMs() - state.elapsed))}.
The candidate is solving: ${scenario.prompt}
Hidden context. Reveal ONLY if asked a relevant clarifying question, one fact at a time:
${(scenario.hiddenContext || []).map((fact) => `- ${fact.key}: ${fact.text}`).join("\n")}

Constraint deck. Use only when difficulty and phase rules allow it:
${(scenario.constraints || []).map((constraint) => `- ${constraint}`).join("\n")}

${boardContextForPrompt()}

Rules of engagement:
- Do not solve the problem. Never give away the design solution. Your job is to push the candidate to discover it.
- Enforce a framework by asking the candidate to explicitly state their process, not by choosing the answer for them.
- The framework you are listening for: understanding the goal and constraints; defining the user persona and empathy map; outlining the core user journey or flow; ideating features and system architecture; sketching or wireframing wire-level interfaces; naming metrics, risks, and tradeoffs.
- If the candidate skips a framework step, ask a sharp question that exposes the gap. Do not tell them what to draw.
- Be a realistic stakeholder. Ask probing questions about entry points, AI uncertainty, user mistrust, technical feasibility, V1 scope, launch deadlines, business constraints, and evidence.
- Once the candidate has a direction, interject with plot twists such as missing API capability, data science showing abandonment at a specific step, legal/privacy concerns, enterprise admin constraints, or a 3-week 0-to-1 launch deadline.
- When introducing a new constraint or plot twist, state it in one concrete sentence so it can be pinned in the constraint ledger.

Google interviewer DNA:
- Scale over everything. Push for internationalization, low-bandwidth constraints, device range, and extreme scale. Example: ask how the UI scales from a high-end Pixel device to a low-end phone on spotty 3G.
- Horizontal ecosystem integration. Ask how the design interacts with Google surfaces such as Assistant, Android notifications, Gmail, Calendar, Workspace, Google Home, Pixel Watch, and Drive.
- Data and signals over intuition. If the candidate relies on taste or feeling, ask what telemetry, A/B metrics, guardrail metrics, or qualitative signals would validate the decision.
- Accessibility first. Force screen reader behavior, keyboard navigation, high contrast, motion sensitivity, and assistive technology considerations early in UI/system decisions, not as a polish step.

Behavior:
- Listen while the candidate draws and thinks aloud.
- You may receive a structured board context summary containing Excalidraw typed text and object types. Use it when relevant, but do not claim you can see more detail than that summary provides.
- Keep replies short, spoken, and interview-like: one or two sentences.
- Prefer a single short question. Do not exceed 35 words unless the candidate explicitly asks you to repeat or clarify something factual.
- Speak at a measured interview pace with brief pauses between ideas so the candidate can follow.
- The candidate leads. Your default behavior is silence.
- Most question-shaped sentences are self-talk in a whiteboard interview. Do not respond to rhetorical questions, partial thoughts, repetition, typing narration, or "what if" exploration unless the candidate clearly addresses you or asks for interviewer signal.
- If the candidate asks a clarifying question, answer it directly as the scenario's stakeholder. Use hidden facts when they apply. If no hidden fact answers it, invent one plausible simulated detail, decision, number, constraint, or user behavior that gives the candidate something concrete to design against.
- Give the direct answer first and then one brief sentence of reasoning. The reasoning should explain the user need, business goal, operational reality, or technical tradeoff behind the answer—not reveal chain-of-thought.
- Treat invented details as fictional interview context, never as verified facts about Google or another real company. Once stated, they are binding scenario facts: remain consistent with them in every later answer unless you explicitly introduce a realistic changed constraint.
- Never evade a reasonable clarifying question by only telling the candidate to make an assumption. You are allowed to make the stakeholder decision for the simulation while leaving the product solution to the candidate.
- If they ask for feedback, assess whether their thinking covers user, goal, constraints, tradeoffs, flow, metrics, or edge cases. Do not tell them what to create next.
- Do not volunteer the target user, product space, constraints, or solution direction unless the candidate asks for that specific information.
- Treat ordinary narration as thinking out loud. Stay quiet while they repeat themselves, type what they said, sketch, pause briefly, or compare options.
- Do not over-specify the challenge early. Ask them to state assumptions when useful.
- Interrupt gently only after a long silence, if they directly say they are stuck, if they ask for help, if they drift far away from the goal, or when a realistic constraint is appropriate for the selected difficulty.
- Phase rules: ${phaseRulesForPrompt(currentPhase().id)}
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
- Always complete both concise sentences of a requested answer. Do not interpret echo, background noise, or partial audio captured during your own playback as an interruption or a new candidate turn.
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
    setListeningState("no-speech", "Interviewer listening", "Silence is okay. If you are speaking and no transcript appears, check mic permission.");
  }, 60000);
}

function clearNoSpeechTimer() {
  if (state.noSpeechTimer) window.clearTimeout(state.noSpeechTimer);
  state.noSpeechTimer = null;
}

function useFallback(message) {
  setListeningState("fallback", "Voice setup needed", message);
  els.transcriptDrawer.hidden = true;
  els.transcriptDrawer.open = false;
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
  if (message.includes("Permission") || message.includes("NotAllowedError")) return "Microphone permission was blocked. Allow mic access, then restart the session.";
  if (message.includes("OPENAI_API_KEY")) return "Add OPENAI_API_KEY to a local .env file, then restart the server. The key stays server-side.";
  if (message.includes("404")) return "Voice server is not running. Start the local app server with OPENAI_API_KEY.";
  if (message.includes("Voice start cancelled")) return "Mic paused.";
  if (/cancel|no active response/i.test(message)) return "Mic paused.";
  return "Voice unavailable — continuing without live voice. Your board is safe.";
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
  const hidden = Object.fromEntries((scenario.hiddenContext || []).map((fact) => [fact.key, fact.text]));
  if (isWhyFollowUp(normalized)) {
    const followUp = answerWhyFollowUp(hidden, scenario);
    if (followUp) return tone(followUp);
  }
  const rules = [
    {
      key: "object",
      tests: ["what kind", "what type", "what is this", "what is the log", "log for", "wait for", "tip jar for", "lost", "what am i designing", "what is the space", "what space"],
      answer: hidden.object || scenario.truth.object
    },
    {
      key: "who",
      tests: ["who", "user", "persona", "customer", "patient", "caregiver", "audience", "for whom", "for who", "target", "staff", "data center staff", "data-center staff", "technician", "role", "what do they do"],
      answer: hidden.who || scenario.truth.who
    },
    {
      key: "goal",
      tests: ["goal", "success", "metric", "trying to", "outcome", "why", "problem", "job", "need", "solve", "why are we designing"],
      answer: hidden.goal || scenario.truth.goal
    },
    {
      key: "platform",
      tests: ["platform", "mobile", "desktop", "device", "where", "channel", "app", "website", "screen"],
      answer: hidden.platform || scenario.truth.platform
    },
    {
      key: "constraint",
      tests: ["constraint", "limitation", "technical", "risk", "hard", "edge", "privacy", "accessibility", "must", "cannot"],
      answer: hidden.constraint || scenario.truth.constraint
    },
    {
      key: "success",
      tests: ["measure", "metric", "success", "validate", "telemetry", "signal"],
      answer: hidden.success || "Use a mix of user-task success, quality guardrails, and operational metrics."
    }
  ];
  const matches = rules.filter((rule) => rule.tests.some((test) => normalized.includes(test)));
  // Let the voice model role-play a stakeholder answer for clarifying questions
  // that are not covered by the curated scenario facts.
  if (matches.length === 0) return "";
  const uniqueMatches = matches.filter((rule, index) => matches.findIndex((item) => item.key === rule.key) === index);
  uniqueMatches.slice(0, 1).forEach((rule) => state.revealed.add(rule.key));
  uniqueMatches
    .filter((rule) => rule.key === "constraint")
    .forEach((rule) => addConstraint(rule.answer, "Clarified"));
  const selectedRule = uniqueMatches[0];
  const selectedAnswer = selectedRule.answer;
  const repeated = state.lastClarificationKey === selectedRule.key && state.lastClarificationAnswer === selectedAnswer;
  state.lastClarificationKey = selectedRule.key;
  state.lastClarificationAnswer = selectedAnswer;
  if (repeated) {
    return tone(answerWhyFollowUp(hidden, scenario) || `Said differently: ${selectedAnswer}`);
  }
  return tone(selectedAnswer);
}

function isWhyFollowUp(text) {
  return /^(why|but why|why though|why is that|why does that matter|why do they need that|why are we doing this)\??$/i.test(text.trim());
}

function answerWhyFollowUp(hidden, scenario) {
  const key = state.lastClarificationKey;
  if (!key) {
    return hidden.goal || scenario.truth.goal;
  }
  if (key === "who") {
    return `They matter because they are closest to the operational risk. The design needs to help them notice the issue, understand impact, and act before it spreads.`;
  }
  if (key === "object") {
    return `Because the prompt is asking for a system response, not just a screen. The important part is how people detect, understand, and safely act on the problem.`;
  }
  if (key === "goal") {
    return `Because the risk is not just missing information; it is delayed action under pressure. Your design should make the right next step clear without hiding uncertainty.`;
  }
  if (key === "platform") {
    return `Because the context changes how people work: dense desktop views support investigation, while mobile or pager surfaces support urgent handoff and escalation.`;
  }
  if (key === "constraint") {
    return `Because constraints are what make the whiteboard realistic. They force you to make tradeoffs instead of designing the ideal version in isolation.`;
  }
  if (key === "success") {
    return `Because success needs evidence. The interview is looking for how you would know the design actually helped, not just whether it sounds useful.`;
  }
  return hidden.goal || scenario.truth.goal;
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
  const total = totalSessionMs();
  const remaining = Math.max(0, total - state.elapsed);

  updateCanvasIdleState();
  maybeAdvancePhase();
  const phase = currentPhase();

  if (phase.id === "clarify") maybeClarifyNudge();
  if (phase.id === "framing") maybeFramingGuidance();
  if (phase.id === "explore") maybeConstraintInjection();
  if (phase.id === "wrap") maybeWrapPrompts(remaining);

  if (remaining <= 0 && !state.timeCalled) {
    state.timeCalled = true;
    interject("That's time — thanks for walking me through this.", { force: true, timer: true });
    window.setTimeout(() => {
      if (state.started) endSession();
    }, 1200);
  }
  render();
}

function currentPhase() {
  return phasePlans[state.mode][state.phaseIndex] || phasePlans[state.mode][0];
}

function totalSessionMs() {
  return phasePlans[state.mode].reduce((sum, item) => sum + item.ms, 0);
}

function maybeAdvancePhase() {
  const phases = phasePlans[state.mode];
  const phase = phases[state.phaseIndex];
  if (!phase || state.phaseElapsed < phase.ms || state.phaseIndex >= phases.length - 1) return;
  if (state.phaseHistory[state.phaseHistory.length - 1]) state.phaseHistory[state.phaseHistory.length - 1].endedAt = state.elapsed;
  state.phaseIndex += 1;
  state.phaseElapsed = 0;
  state.lastPhaseChangeAt = state.elapsed;
  state.phaseHistory.push({ id: currentPhase().id, label: currentPhase().label, startedAt: state.elapsed, endedAt: null });
  saveSessionSnapshot();
}

function finalizePhaseHistory() {
  if (state.phaseHistory[state.phaseHistory.length - 1]) state.phaseHistory[state.phaseHistory.length - 1].endedAt = state.elapsed;
}

function canInterviewerSpeak(options = {}) {
  if (!state.started || state.ended) return { allowed: false, reason: "ended" };
  if (options.timer) return { allowed: true, reason: "timer" };
  if (options.direct) return { allowed: true, reason: "direct" };
  if (Date.now() < state.quietUntil) return { allowed: false, reason: "quiet" };
  updateCanvasIdleState();
  const silentEnough = Date.now() - state.lastCandidateAt >= 8000;
  const canvasIdleEnough = Date.now() - state.lastCanvasActivityAt >= 8000 && !state.canvasActive && !state.typingActive;
  if (state.canvasActive || state.typingActive || !canvasIdleEnough) return { allowed: false, reason: "observing" };
  if (silentEnough && canvasIdleEnough) return { allowed: true, reason: "idle" };
  return { allowed: false, reason: "listening" };
}

function updateCanvasIdleState() {
  if (state.canvasActive && Date.now() - state.lastCanvasActivityAt > 1200) state.canvasActive = false;
  if (state.typingActive && Date.now() - state.lastCanvasActivityAt > 1200) state.typingActive = false;
}

function maybeClarifyNudge() {
  if (state.clarifyNudgeUsed) return;
  if (!state.boardElements.length && !state.boardText) return;
  if (state.revealed.size > 0 || state.transcript.some((turn) => turn.role === "candidate" && isQuestion(turn.text.toLowerCase()))) return;
  if (interject("Before you dive in, is there anything you want to ask me about the problem?")) state.clarifyNudgeUsed = true;
}

function maybeFramingGuidance() {
  if (state.boardPrompted) return;
  if (Date.now() - state.lastCandidateAt < 60000 || Date.now() - state.lastCanvasActivityAt < 60000) return;
  const question = state.difficulty === "easy" ? "Who is this for?" : "Who do you imagine the primary user is?";
  if (interject(question)) state.boardPrompted = true;
}

function maybeConstraintInjection() {
  if (state.difficulty === "easy") return;
  const limit = state.difficulty === "hard" ? 2 : 1;
  if (state.usedConstraintTexts.size >= limit) return;
  if (state.difficulty === "medium" && !candidateIsCruising()) return;
  const noFraming = currentPhase().id === "explore" && !frameworkStepHasEvidence("frame") && !frameworkStepHasEvidence("user");
  if (noFraming) {
    interject("Pause there: what user and goal are you optimizing around?");
    return;
  }
  const assumptionConstraint = maybeInvalidateAssumption();
  if (assumptionConstraint) {
    if (interject(assumptionConstraint)) {
      state.curveballUsed = true;
      addConstraint(assumptionConstraint, "Interviewer");
    }
    return;
  }
  const constraint = stakeholderPlotTwist();
  if (!constraint) return;
  if (interject(constraint)) {
    state.curveballUsed = true;
    state.usedConstraintTexts.add(constraint);
    addConstraint(constraint, "Interviewer");
  }
}

function maybeInvalidateAssumption() {
  if (state.difficulty !== "hard") return "";
  const assumption = state.assumptions.find((item) => !item.invalidated);
  if (!assumption || state.usedConstraintTexts.has(`invalidate:${assumption.text}`)) return "";
  assumption.invalidated = true;
  state.usedConstraintTexts.add(`invalidate:${assumption.text}`);
  renderConstraintLedger();
  return `You assumed ${stripAssumptionPrefix(assumption.text)}. Now assume that is not true — how does your approach change?`;
}

function stripAssumptionPrefix(text) {
  return String(text)
    .replace(/^(i('| wi)?ll assume|i will assume|i am assuming|i'm assuming|let'?s assume|my assumption is|assuming that)\s*/i, "")
    .trim();
}

function maybeWrapPrompts(remaining) {
  if (!state.wrapMetricsPrompted && interject("How would you measure success?")) {
    state.wrapMetricsPrompted = true;
    return;
  }
  if (state.wrapMetricsPrompted && !state.wrapMoreTimePrompted && state.phaseElapsed > 90 * 1000 && interject("What would you do with more time?")) {
    state.wrapMoreTimePrompted = true;
    return;
  }
  if (!state.wrapSummaryPrompted && remaining <= 2 * 60 * 1000) {
    if (interject("We have about two minutes — can you walk me through a summary?", { force: true, timer: true })) {
      state.wrapSummaryPrompted = true;
    }
  }
}

function candidateIsCruising() {
  return frameworkStepHasEvidence("frame") && frameworkStepHasEvidence("user") && (frameworkStepHasEvidence("flow") || state.boardElements.length >= 3);
}

function stakeholderPlotTwist() {
  const deck = scenarios[state.scenarioIndex].constraints || defaultConstraintDeck;
  const next = deck.find((item) => !state.usedConstraintTexts.has(item));
  return next || deck[0];
}

function interject(text, options = {}) {
  if (!options.force && !canInterviewerSpeak({ timer: options.timer }).allowed) return false;
  state.lastInterjectionAt = state.elapsed;
  respond(tone(text), true, { force: options.force });
  return true;
}

function respond(text, isInterjection = false, options = {}) {
  if (!text) return;
  if (!options.force && !canInterviewerSpeak({ direct: true }).allowed) return;
  if (!state.canvasActive && !state.typingActive && state.sceneElementsRaw?.length) captureSceneElements(state.sceneElementsRaw);
  text = sanitizeInterviewerText(text);
  recordTranscriptTurn("interviewer", text, { isInterjection });
  if (isInterjection) maybePinConstraint(text);
  logMessage("interviewer", text);
  els.interviewerState.textContent = "Speaking";
  announce(`Interviewer: ${text}`);
  const realtimeIsAvailable = state.listening || state.realtimeConnecting || state.realtimeReady || state.realtimeResponseActive || state.realtimeResponseRequested;
  if (!realtimeIsAvailable) speakInterviewerText(text);
}

function speakInterviewerText(text) {
  if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.92;
  utterance.pitch = 1;
  utterance.volume = 1;
  utterance.onend = updateInterviewerState;
  utterance.onerror = updateInterviewerState;
  els.interviewerState.textContent = "Speaking";
  window.speechSynthesis.speak(utterance);
}

function sanitizeInterviewerText(text) {
  const mechanics = /\b(mode|constraint deck|rubric|token|system prompt|hidden context|phase rule)\b/i;
  if (!mechanics.test(text)) return text;
  return "Let’s keep this grounded in the problem. What assumption are you making right now?";
}

function setSilent() {
  updateInterviewerState();
}

function openingLine() {
  return scenarios[state.scenarioIndex].prompt;
}

function tone(text) {
  if (state.difficulty === "easy") return text;
  if (state.difficulty === "hard") return text.replace("I do not have more detail on that. ", "");
  return text;
}

function isQuestion(text) {
  return text.includes("?") || /^(who|what|when|where|why|how|is|are|do|does|should|can|could)\b/.test(text.trim());
}

function requestQuietTime(text) {
  const normalized = text.toLowerCase();
  return [
    "give me a minute",
    "give me two minutes",
    "let me think",
    "i need some time",
    "i need a minute",
    "i need two minutes",
    "need some time to structure",
    "time to structure",
    "let me structure",
    "give me a moment"
  ].some((phrase) => normalized.includes(phrase));
}

function logMessage(role, text) {
  const div = document.createElement("div");
  div.className = `message ${role}`;
  const label = document.createElement("span");
  label.className = "message-role";
  label.textContent = `${role === "candidate" ? "You" : role === "interviewer" ? "Interviewer" : "System"} · ${formatTime(state.elapsed)}`;
  const body = document.createElement("span");
  body.className = "message-text";
  body.textContent = text;
  div.append(label, body);
  els.interviewerLog.appendChild(div);
  if (state.transcriptAutoScroll) els.interviewerLog.scrollTop = els.interviewerLog.scrollHeight;
}

function showDebrief() {
  els.scorecard.hidden = false;
  els.scoreRows.innerHTML = `<div class="debrief-loading">Building debrief from transcript, board, and timing...</div>`;
  els.nextNotes.innerHTML = "";
  window.setTimeout(renderDebrief, 250);
}

function renderDebrief() {
  const scores = scoreSession();
  const average = Math.round(scores.reduce((sum, row) => sum + row.score, 0) / scores.length);
  const strengths = scores.filter((row) => scoreStatus(row.score).kind === "good").length;
  const focusAreas = scores.length - strengths;
  const leaning = overallLeaning(average, scores);
  els.overallScore.textContent = leaning.label;
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
        <span class="score-evidence">Evidence: ${row.evidence}</span>
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
  [
    `Overall leaning: ${leaning.label}. ${leaning.reason}`,
    `Strongest moment: ${strongestMoment(scores)}`,
    `This would have cost you the round: ${roundRisk(scores)}`,
    "Practice signal, not a prediction."
  ].forEach((note) => appendDebriefNote(note));
  renderTimelineBar();
  els.scorecard.hidden = false;
  els.scorecard.scrollIntoView({ block: "start", behavior: "smooth" });
}

function appendDebriefNote(note) {
  const div = document.createElement("div");
  div.className = "note";
  div.textContent = note;
  els.nextNotes.appendChild(div);
}

function addConstraint(text, source = "Constraint") {
  const cleanText = truncateText(String(text || "").replace(/\s+/g, " ").trim(), 220);
  if (!cleanText) return;
  const duplicate = state.constraints.some((item) => item.text === cleanText);
  if (duplicate) return;
  state.constraints.unshift({ text: cleanText, source, at: state.elapsed });
  renderConstraintLedger();
}

function saveSessionSnapshot() {
  if (!state.started || state.ended) return;
  const snapshot = {
    version: 2,
    savedAt: Date.now(),
    scenarioIndex: state.scenarioIndex,
    difficulty: state.difficulty,
    companies: state.companies,
    mode: state.mode,
    started: state.started,
    elapsed: state.elapsed,
    phaseIndex: state.phaseIndex,
    phaseElapsed: state.phaseElapsed,
    phaseHistory: normalizedPhaseHistory(),
    transcript: state.transcript,
    runningSummary: state.runningSummary,
    realtimeItems: state.realtimeItems,
    revealed: [...state.revealed],
    constraints: state.constraints,
    assumptions: state.assumptions,
    usedConstraintTexts: [...state.usedConstraintTexts],
    boardElements: state.boardElements,
    boardText: state.boardText,
    boardSummary: state.boardSummary,
    sceneElementsRaw: state.sceneElementsRaw
  };
  localStorage.setItem("whiteboard-sim-autosave", JSON.stringify(snapshot));
}

function clearSessionSnapshot() {
  localStorage.removeItem("whiteboard-sim-autosave");
}

function offerResumeIfAvailable() {
  const raw = localStorage.getItem("whiteboard-sim-autosave");
  if (!raw) return;
  let snapshot;
  try {
    snapshot = JSON.parse(raw);
  } catch {
    clearSessionSnapshot();
    return;
  }
  if (!snapshot?.started) return;
  const shouldResume = window.confirm("Resume your session?");
  if (!shouldResume) {
    clearSessionSnapshot();
    return;
  }
  Object.assign(state, {
    scenarioIndex: snapshot.scenarioIndex ?? state.scenarioIndex,
    difficulty: snapshot.difficulty || state.difficulty,
    companies: snapshot.companies || state.companies,
    mode: snapshot.mode || state.mode,
    started: true,
    ended: false,
    elapsed: snapshot.elapsed || 0,
    phaseIndex: snapshot.phaseIndex || 0,
    phaseElapsed: snapshot.phaseElapsed || 0,
    phaseHistory: snapshot.phaseHistory || [],
    transcript: snapshot.transcript || [],
    runningSummary: snapshot.runningSummary || "",
    realtimeItems: snapshot.realtimeItems || [],
    revealed: new Set(snapshot.revealed || []),
    constraints: snapshot.constraints || [],
    assumptions: snapshot.assumptions || [],
    usedConstraintTexts: new Set(snapshot.usedConstraintTexts || []),
    boardElements: snapshot.boardElements || [],
    boardText: snapshot.boardText || "",
    boardSummary: snapshot.boardSummary || "",
    sceneElementsRaw: snapshot.sceneElementsRaw || [],
    lastCandidateAt: Date.now(),
    lastCanvasActivityAt: Date.now()
  });
  window.__WHITEBOARD_RESTORE_SCENE__ = snapshot.sceneElementsRaw || [];
  state.timer = setInterval(tick, 1000);
  state.autosaveTimer = setInterval(saveSessionSnapshot, 10000);
  window.requestAnimationFrame(() => {
    els.interviewerLog.innerHTML = "";
    state.transcript.forEach((turn) => logMessage(turn.role, turn.text));
    render();
    if (state.voiceAvailable) {
      setListeningState("requesting", "Connecting interviewer", "The interviewer is rejoining and will listen while you work.");
      startListening();
    }
  });
}

function maybePinConstraint(text) {
  const normalized = String(text || "").toLowerCase();
  const constraintSignals = [
    "engineering says",
    "data science shows",
    "privacy",
    "legal",
    "cannot",
    "can’t",
    "can't",
    "must",
    "constraint",
    "latency",
    "low-end",
    "3g",
    "screen reader",
    "keyboard",
    "3 weeks",
    "hallucination",
    "api capability"
  ];
  if (constraintSignals.some((signal) => normalized.includes(signal))) {
    addConstraint(text, normalized.includes("engineering") || normalized.includes("data science") ? "Plot twist" : "Constraint");
  }
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
  const evidence = (terms, fallback) => evidenceFor(terms) || fallback;
  return [
    { label: "Problem framing & clarifying questions", score: score(1, (state.revealed.has("who") ? 1 : 0) + (state.revealed.has("goal") ? 1 : 0) + (has(["scope", "problem", "success"]) ? 1 : 0)), note: "Clarified before designing.", evidence: evidence(["scope", "problem", "success", "who", "goal"], "No explicit framing evidence captured.") },
    { label: "Users & context", score: score(1, (state.revealed.has("who") ? 2 : 0) + (has(["pain", "customer", "traveler", "admin", "technician", "persona"]) ? 1 : 0)), note: "Grounded choices in a user and context.", evidence: evidence(["user", "persona", "customer", "traveler", "admin", "technician", "pain"], "No explicit user evidence captured.") },
    { label: "Structure before UI", score: score(1, (has(["first", "then", "flow", "journey"]) ? 2 : 0) + (candidateTurns.length >= 3 ? 1 : 0)), note: "Moved through the problem before jumping to screens.", evidence: evidence(["first", "then", "flow", "journey", "step"], "No explicit structure evidence captured.") },
    { label: "Trade-offs & rationale", score: score(1, (has(["because", "tradeoff", "risk", "constraint", "alternative"]) ? 2 : 0) + (state.constraints.length ? 1 : 0)), note: "Explained why choices beat alternatives.", evidence: evidence(["because", "tradeoff", "risk", "constraint", "alternative"], "No explicit tradeoff evidence captured.") },
    { label: "Communication & narration", score: score(1, (words.length > 80 ? 1 : 0) + (has(["assume", "because", "i'm thinking", "i am thinking"]) ? 1 : 0) + (candidateTurns.length >= 4 ? 1 : 0)), note: "Made reasoning audible while working.", evidence: candidateTurns[0] ? quoteEvidence(candidateTurns[0].text) : "No candidate narration captured." },
    { label: "Time management & wrap-up", score: score(1, (state.wrapSummaryPrompted ? 1 : 0) + (state.phaseIndex >= 4 ? 1 : 0) + (has(["measure", "metric", "more time", "summary"]) ? 1 : 0)), note: "Reached summary, metrics, and next steps.", evidence: evidence(["measure", "metric", "more time", "summary"], "No wrap-up evidence captured.") }
  ];
}

function evidenceFor(terms) {
  const turn = state.transcript.find((item) => item.role === "candidate" && terms.some((term) => item.text.toLowerCase().includes(term)));
  if (turn) return quoteEvidence(turn.text);
  const board = state.boardElements.find((item) => item.text && terms.some((term) => item.text.toLowerCase().includes(term)));
  if (board) return `Board note "${truncateText(board.text, 90)}"`;
  return "";
}

function quoteEvidence(text) {
  return `"${truncateText(String(text).replace(/\s+/g, " ").trim(), 110)}"`;
}

function strongestMoment(scores) {
  const best = [...scores].sort((a, b) => b.score - a.score)[0];
  return `${best.label} stood out. ${best.evidence}`;
}

function roundRisk(scores) {
  const weakest = [...scores].sort((a, b) => a.score - b.score)[0];
  return `${weakest.label} was the biggest risk. ${weakest.evidence}`;
}

function overallLeaning(average, scores) {
  const minScore = Math.min(...scores.map((row) => row.score));
  if (average >= 4 && minScore >= 3) return { label: "Hire", reason: "The session showed consistent signal across core dimensions." };
  if (average >= 3) return { label: "Lean hire", reason: "There is useful signal, with a few gaps to tighten." };
  if (average >= 2) return { label: "Lean no-hire", reason: "The session needs stronger framing, evidence, or wrap-up." };
  return { label: "No hire", reason: "Too many core signals were missing from this practice run." };
}

function renderTimelineBar() {
  const total = Math.max(1, state.elapsed);
  const items = normalizedPhaseHistory();
  const bar = document.createElement("div");
  bar.className = "timeline-bar";
  bar.innerHTML = items.map((item) => {
    const pct = Math.round(((item.endedAt - item.startedAt) / total) * 100);
    return `<span style="width:${pct}%;" title="${item.label}: ${pct}%"></span>`;
  }).join("");
  const labels = document.createElement("div");
  labels.className = "timeline-labels";
  labels.textContent = items.map((item) => `${item.label} ${Math.round(((item.endedAt - item.startedAt) / total) * 100)}%`).join(" · ");
  els.nextNotes.append(bar, labels);
}

function normalizedPhaseHistory() {
  const history = state.phaseHistory.length ? state.phaseHistory : [{ id: currentPhase().id, label: currentPhase().label, startedAt: 0, endedAt: state.elapsed }];
  return history.map((item) => ({ ...item, endedAt: item.endedAt ?? state.elapsed }));
}

function setupBoard() {
  if (els.excalidrawMount) {
    window.whiteboardSession = {
      onChange(elements) {
        const liveElements = elements.filter((element) => !element.isDeleted);
        state.sceneElementsRaw = liveElements;
        markCanvasActivity("change");
        scheduleSceneCapture(liveElements);
        renderFrameworkTracker();
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
    els.excalidrawMount.addEventListener("pointerdown", () => markCanvasActivity("pointer"), true);
    els.excalidrawMount.addEventListener("pointermove", () => markCanvasActivity("pointer"), true);
    els.excalidrawMount.addEventListener("pointerup", () => { state.canvasActive = false; state.lastCanvasActivityAt = Date.now(); }, true);
    els.excalidrawMount.addEventListener("keydown", () => markCanvasActivity("typing"), true);
    els.excalidrawMount.addEventListener("input", () => markCanvasActivity("typing"), true);
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

function markCanvasActivity(kind = "change") {
  state.lastCanvasActivityAt = Date.now();
  state.canvasActive = true;
  state.typingActive = kind === "typing";
  updateInterviewerState();
}

function scheduleSceneCapture(elements = state.sceneElementsRaw) {
  clearSceneCaptureTimer();
  state.sceneCaptureTimer = window.setTimeout(() => {
    updateCanvasIdleState();
    if (state.canvasActive || state.typingActive) {
      scheduleSceneCapture(elements);
      return;
    }
    captureSceneElements(elements);
  }, 2000);
}

function clearSceneCaptureTimer() {
  if (state.sceneCaptureTimer) window.clearTimeout(state.sceneCaptureTimer);
  state.sceneCaptureTimer = null;
}

function captureSceneElements(elements = state.sceneElementsRaw) {
  const structured = elements.map(boardElementFromExcalidraw).filter(Boolean);
  state.boardElements = structured;
  state.boardText = structured.map((element) => element.text).filter(Boolean).join(" ");
  state.boardSummary = summarizeBoardElements(structured);
  state.strokes = structured;
  renderFrameworkTracker();
  saveSessionSnapshot();
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
    height: Math.round(element.height || 0),
    startBinding: element.startBinding?.elementId || "",
    endBinding: element.endBinding?.elementId || "",
    boundElements: (element.boundElements || []).map((item) => item.id).filter(Boolean)
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
  const structure = elements
    .filter((element) => element.type !== "text")
    .sort((a, b) => a.y - b.y || a.x - b.x)
    .slice(0, 12)
    .map((element) => `${element.type} at ${boardRegion(element)}`)
    .join("; ");
  const textSummary = typedText ? `Typed labels/notes: ${typedText}.` : "No typed labels captured yet.";
  const structureSummary = structure ? `Visible structure: ${structure}.` : "No visible shapes captured yet.";
  return `${countText}. ${textSummary} ${structureSummary}`;
}

function boardContextForPrompt() {
  if (!state.boardSummary) {
    return "Board context: no visible Excalidraw objects or typed text have been captured yet.";
  }
  return `Board context from Excalidraw: ${state.boardSummary} You can use typed labels, arrows, shapes, and rough positions to infer structure, but do not pretend to see semantic details that are not in this summary. Ask a clarifying question if the drawing intent is ambiguous.`;
}

function boardRegion(element) {
  const x = element.x < -200 ? "far left" : element.x < 300 ? "left" : element.x < 900 ? "center" : "right";
  const y = element.y < -100 ? "top" : element.y < 350 ? "upper" : element.y < 850 ? "middle" : "lower";
  return `${y} ${x}`;
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

function renderFrameworkTracker() {
  if (!els.frameworkTracker || !els.frameworkSteps) return;
  els.frameworkTracker.hidden = true;
  return;

  els.frameworkModeLabel.textContent = state.difficulty === "easy" ? "Guided" : "Self-led";
  const activeId = state.difficulty === "easy" ? currentFrameworkStepId() : "";
  els.frameworkSteps.innerHTML = "";
  frameworkSteps.forEach((step) => {
    const complete = frameworkStepHasEvidence(step.id);
    const active = activeId === step.id && state.started;
    const li = document.createElement("li");
    li.className = `${complete ? "complete" : ""} ${active ? "active" : ""}`.trim();
    li.innerHTML = `
      <span class="framework-dot" aria-hidden="true">${complete ? "check" : active ? "radio_button_checked" : "radio_button_unchecked"}</span>
      <span>${step.label}</span>
    `;
    els.frameworkSteps.appendChild(li);
  });
}

function currentFrameworkStepId() {
  const phase = phasePlans[state.mode][state.phaseIndex]?.id;
  const mapping = {
    prompt: "frame",
    clarify: "frame",
    framing: frameworkStepHasEvidence("user") ? "flow" : "user",
    explore: frameworkStepHasEvidence("wire") ? "system" : "wire",
    wrap: "validate"
  };
  return mapping[phase] || "frame";
}

function frameworkStepHasEvidence(id) {
  const text = `${state.transcript.map((turn) => turn.text).join(" ")} ${state.boardText}`.toLowerCase();
  const has = (terms) => terms.some((term) => text.includes(term));
  const shapeCount = state.boardElements.filter((element) => element.type !== "text").length;
  const checks = {
    frame: state.revealed.has("goal") || state.revealed.has("constraint") || has(["goal", "success", "constraint", "scope", "problem"]),
    user: state.revealed.has("who") || has(["user", "persona", "customer", "traveler", "admin", "technician", "empathy", "pain"]),
    flow: has(["flow", "journey", "path", "entry point", "step", "handoff", "recover", "onboarding"]),
    system: has(["system", "architecture", "tradeoff", "risk", "api", "latency", "permission", "scale", "trust"]),
    wire: shapeCount >= 2 || has(["wireframe", "screen", "sketch", "layout", "component", "dashboard"]),
    validate: has(["metric", "measure", "telemetry", "a/b", "experiment", "validate", "guardrail"])
  };
  return Boolean(checks[id]);
}

function renderConstraintLedger() {
  if (!els.constraintList || !els.constraintCount) return;
  const total = state.constraints.length + state.assumptions.length;
  if (els.constraintLedger) els.constraintLedger.hidden = total === 0;
  els.constraintCount.textContent = `${total} pinned`;
  els.constraintList.innerHTML = "";
  if (!total) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "Constraints and assumptions will appear here when they matter.";
    els.constraintList.appendChild(empty);
    return;
  }
  if (state.constraints.length) {
    appendLedgerGroup("Interviewer constraints");
  }
  state.constraints.slice(0, 5).forEach((constraint) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="constraint-source">${constraint.source}</span>
      <span>${constraint.text}</span>
    `;
    els.constraintList.appendChild(li);
  });
  if (state.assumptions.length) {
    appendLedgerGroup("Your assumptions");
  }
  state.assumptions.slice(0, 5).forEach((assumption) => {
    const li = document.createElement("li");
    li.className = assumption.invalidated ? "invalidated" : "";
    li.innerHTML = `
      <span class="constraint-source">${assumption.invalidated ? "Invalidated" : "Yours"}</span>
      <span>${assumption.text}</span>
    `;
    els.constraintList.appendChild(li);
  });
}

function appendLedgerGroup(label) {
  const li = document.createElement("li");
  li.className = "ledger-group";
  li.textContent = label;
  els.constraintList.appendChild(li);
}

function render() {
  const scenario = scenarios[state.scenarioIndex];
  const phases = phasePlans[state.mode];
  document.body.dataset.session = state.started ? "running" : state.ended ? "ended" : "idle";
  document.body.dataset.phase = state.started ? currentPhase().id : "idle";
  els.promptTitle.textContent = scenario.prompt;
  els.stickyPrompt.textContent = scenario.prompt;
  els.difficultySelect.value = state.difficulty;
  renderCompanyPickerLabel();
  els.modeSelect.value = state.mode;
  els.phaseName.textContent = state.started ? phases[state.phaseIndex].label : state.ended ? "Session complete" : "Not started";
  els.phaseHint.textContent = state.started ? phaseHint(phases[state.phaseIndex].id) : state.ended ? `Ended at ${state.endedAtText || "session end"}. Challenge: ${scenario.prompt}` : "Start when you are ready.";
  els.sessionClock.textContent = state.started ? formatTime(Math.max(0, totalSessionMs() - state.elapsed)) : formatTime(totalSessionMs());
  els.budgetLabel.textContent = "";
  els.startSession.disabled = state.started;
  els.shuffleChallenge.disabled = state.started;
  els.startSession.textContent = state.started ? "In session" : state.ended ? "Start again" : "Start";
  els.endSession.disabled = !state.started;
  els.sendTurn.disabled = !state.started || state.ended;
  els.askInterviewer.disabled = !state.started || state.ended || !state.voiceAvailable;
  els.voiceToggle.disabled = !state.started || state.ended || !state.voiceAvailable;
  els.voiceToggle.setAttribute("aria-pressed", String(state.listening || state.realtimeConnecting));
  els.voiceToggle.setAttribute("aria-label", state.listening || state.realtimeConnecting ? "Interviewer is listening" : "Reconnect interviewer voice");
  if (state.directQuestionUntil && state.directQuestionUntil <= Date.now()) state.directQuestionUntil = 0;
  renderAskInterviewer();
  renderFrameworkTracker();
  renderConstraintLedger();
  renderCallCounter();
  updateInterviewerState();
  if (!state.started && !state.ended && state.voiceAvailable) setListeningState("idle", "Ready", "Start connects the interviewer automatically.");
  if (state.ended) {
    els.interviewerState.textContent = "Ended";
  }
}

function updateInterviewerState() {
  if (!state.started || state.ended) return;
  updateCanvasIdleState();
  if (Date.now() < state.quietUntil) {
    els.interviewerState.textContent = "Quiet time — interviewer waiting";
    return;
  }
  if (state.canvasActive || state.typingActive || Date.now() - state.lastCanvasActivityAt < 8000) {
    els.interviewerState.textContent = "Observing your board";
    return;
  }
  if (state.realtimeResponseActive) {
    els.interviewerState.textContent = "Speaking";
    return;
  }
  if (state.listening) {
    els.interviewerState.textContent = "Listening";
    return;
  }
  els.interviewerState.textContent = "Silent";
}

function phaseHint(id) {
  const hints = {
    prompt: "Listen to the challenge. The interviewer will not add extra context unless you ask.",
    clarify: "Ask only the clarifying questions you need before committing to assumptions.",
    framing: "State your understanding, user, problem, success criteria, and scope.",
    explore: "Think out loud while you map, sketch, compare directions, and make tradeoffs.",
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
