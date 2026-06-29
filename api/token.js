const model = process.env.OPENAI_REALTIME_MODEL || "gpt-realtime-2";
const voice = process.env.OPENAI_REALTIME_VOICE || "marin";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.status(405).json({ error: "Use POST for /token." });
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    response.status(503).json({ error: "OPENAI_API_KEY is missing on the server." });
    return;
  }

  try {
    const body = typeof request.body === "string" ? JSON.parse(request.body || "{}") : request.body || {};
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
      response.status(apiResponse.status).json({ error: text });
      return;
    }

    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.status(200).send(text);
  } catch (error) {
    response.status(500).json({ error: error.message || "Realtime token request failed." });
  }
}
