const model = process.env.OPENAI_REALTIME_MODEL || "gpt-realtime-2";
const voice = process.env.OPENAI_REALTIME_VOICE || "marin";

module.exports = async function handler(request, response) {
  try {
    if (request.method !== "POST") {
      sendJson(response, 405, { error: "Use POST for /token." });
      return;
    }

    if (!process.env.OPENAI_API_KEY) {
      sendJson(response, 503, { error: "OPENAI_API_KEY is missing on the server." });
      return;
    }

    const body = readRequestBody(request);
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
          instructions: body.instructions || "You are a concise whiteboard interview simulator.",
          audio: {
            input: {
              transcription: { model: "gpt-4o-mini-transcribe" },
              turn_detection: {
                type: "server_vad",
                threshold: 0.5,
                prefix_padding_ms: 300,
                silence_duration_ms: 900,
                create_response: false,
                interrupt_response: true
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

    sendRawJson(response, 200, text);
  } catch (error) {
    console.error("Realtime token function failed:", error);
    sendJson(response, 500, { error: error && error.message ? error.message : "Realtime token request failed." });
  }
};

function readRequestBody(request) {
  if (!request.body) return {};
  if (typeof request.body === "object" && !Buffer.isBuffer(request.body)) return request.body;
  const text = Buffer.isBuffer(request.body) ? request.body.toString("utf8") : String(request.body);
  if (!text.trim()) return {};
  return JSON.parse(text);
}

function sendJson(response, status, payload) {
  sendRawJson(response, status, JSON.stringify(payload));
}

function sendRawJson(response, status, body) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(body);
}
