module.exports = async function handler(request, response) {
  try {
    if (request.method !== "POST") {
      sendJson(response, 405, { error: "Use POST for /evaluate." });
      return;
    }
    const body = readRequestBody(request);
    const { evaluateSession } = await import("../evaluation.mjs");
    const evaluation = await evaluateSession(body);
    sendJson(response, 200, evaluation);
  } catch (error) {
    console.error("Evaluation function failed:", error);
    sendJson(response, error.status || 500, {
      error: error.message || "The session could not be evaluated."
    });
  }
};

function readRequestBody(request) {
  if (!request.body) return {};
  if (typeof request.body === "object" && !Buffer.isBuffer(request.body)) return request.body;
  const text = Buffer.isBuffer(request.body) ? request.body.toString("utf8") : String(request.body);
  return text.trim() ? JSON.parse(text) : {};
}

function sendJson(response, status, payload) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(payload));
}
