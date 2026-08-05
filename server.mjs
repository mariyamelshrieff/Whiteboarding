import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { evaluateSession } from "./evaluation.mjs";

const root = process.cwd();
loadLocalEnv();

const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "0.0.0.0";
const model = process.env.OPENAI_REALTIME_MODEL || "gpt-realtime-2";
const voice = process.env.OPENAI_REALTIME_VOICE || "marin";
const feedbackRateLimits = new Map();

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg"
};

createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);
    if (url.pathname === "/health") {
      sendJson(response, 200, { status: "ok" });
      return;
    }
    if (url.pathname === "/token") {
      await createRealtimeToken(request, response);
      return;
    }
    if (url.pathname === "/evaluate") {
      await createEvaluation(request, response);
      return;
    }
    if (url.pathname === "/feedback") {
      await createFeedback(request, response);
      return;
    }
    serveStatic(url.pathname, response);
  } catch (error) {
    sendJson(response, 500, { error: error.message || "Server error." });
  }
}).listen(port, host, () => {
  console.log(`Whiteboard simulator running at http://${host}:${port}/`);
});

async function createRealtimeToken(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { error: "Use POST for /token." });
    return;
  }
  if (!process.env.OPENAI_API_KEY) {
    sendJson(response, 503, { error: "OPENAI_API_KEY is missing on the local server." });
    return;
  }

  const body = await readJson(request);
  const apiResponse = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      session: {
        type: "realtime",
        model,
        instructions: body.instructions,
        audio: {
          input: {
            transcription: { model: "gpt-4o-mini-transcribe" },
            turn_detection: {
              type: "server_vad",
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 900,
              create_response: false,
              interrupt_response: false
            }
          },
          output: { voice }
        }
      }
    })
  });

  const text = await apiResponse.text();
  if (!apiResponse.ok) {
    sendJson(response, apiResponse.status, { error: text });
    return;
  }
  response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
  response.end(text);
}

async function createEvaluation(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { error: "Use POST for /evaluate." });
    return;
  }
  try {
    const body = await readJson(request, 4 * 1024 * 1024);
    const evaluation = await evaluateSession(body);
    response.setHeader("Cache-Control", "no-store");
    sendJson(response, 200, evaluation);
  } catch (error) {
    console.error("Evaluation failed:", error);
    sendJson(response, error.status || 500, { error: error.message || "The session could not be evaluated." });
  }
}

async function createFeedback(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { error: "Use POST for /feedback." });
    return;
  }
  const clientId = String(request.headers["x-forwarded-for"] || request.socket.remoteAddress || "unknown").split(",")[0].trim();
  const now = Date.now();
  const recent = (feedbackRateLimits.get(clientId) || []).filter((at) => now - at < 60 * 60 * 1000);
  if (recent.length >= 5) {
    sendJson(response, 429, { error: "Feedback limit reached. Please try again later." });
    return;
  }
  const body = await readJson(request, 12 * 1024);
  const allowed = new Set(["yes", "somewhat", "no"]);
  if (!allowed.has(body.realistic) || !allowed.has(body.helpful)) {
    sendJson(response, 400, { error: "Both feedback questions are required." });
    return;
  }
  const feedback = {
    submittedAt: new Date().toISOString(),
    realistic: body.realistic,
    helpful: body.helpful,
    comment: String(body.comment || "").trim().slice(0, 1000),
    challengeId: String(body.challengeId || "").slice(0, 100),
    company: String(body.company || "").slice(0, 40),
    difficulty: String(body.difficulty || "").slice(0, 20),
    mode: String(body.mode || "").slice(0, 20),
    elapsedMs: Math.max(0, Math.min(Number(body.elapsedMs) || 0, 2 * 60 * 60 * 1000))
  };
  if (process.env.FEEDBACK_WEBHOOK_URL) {
    const webhookResponse = await fetch(process.env.FEEDBACK_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.FEEDBACK_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.FEEDBACK_WEBHOOK_TOKEN}` } : {})
      },
      body: JSON.stringify(feedback)
    });
    if (!webhookResponse.ok) {
      sendJson(response, 502, { error: "Feedback storage is temporarily unavailable." });
      return;
    }
  } else {
    console.log("USER_FEEDBACK", JSON.stringify(feedback));
  }
  feedbackRateLimits.set(clientId, [...recent, now]);
  response.setHeader("Cache-Control", "no-store");
  sendJson(response, 201, { accepted: true });
}

function serveStatic(pathname, response) {
  const safePath = normalize(pathname === "/" ? "/index.html" : pathname).replace(/^(\.\.[/\\])+/, "");
  let filePath = join(root, safePath);
  if (!filePath.startsWith(root) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    if (extname(safePath)) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }
    filePath = join(root, "index.html");
  }
  response.writeHead(200, { "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream" });
  createReadStream(filePath).pipe(response);
}

function readJson(request, maxBytes = 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let data = "";
    request.on("data", (chunk) => {
      data += chunk;
      if (data.length > maxBytes) {
        request.destroy();
        reject(new Error("Request body is too large."));
      }
    });
    request.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new Error("Invalid JSON."));
      }
    });
    request.on("error", reject);
  });
}

function sendJson(response, status, payload) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function loadLocalEnv() {
  const envPath = join(root, ".env");
  if (!existsSync(envPath)) return;
  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex < 1) return;
    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  });
}
