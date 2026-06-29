# Whiteboarding Interview Simulator

A voice-first product design whiteboarding simulator for practicing high-stakes design interviews. The candidate works on an Excalidraw canvas while thinking out loud; the AI interviewer listens, asks realistic stakeholder questions, introduces constraints, and produces a rubric-based debrief.

The MVP is tuned for product design, UX, and interaction design whiteboard challenges, with Google-style calibration for scale, ecosystem thinking, data validation, accessibility, and AI-system tradeoffs.

## What It Does

- Runs a 45-minute whiteboard interview simulation, with a 20-minute express option.
- Starts listening automatically when the session begins.
- Uses OpenAI Realtime over WebRTC for spoken interviewer responses.
- Supports native turn detection and barge-in so the interviewer stops when the candidate speaks.
- Keeps a text fallback when voice or mic access is unavailable.
- Embeds the open-source MIT-licensed Excalidraw board.
- Captures Excalidraw typed text and board structure as context for interviewer feedback.
- Shows the newest transcript messages at the top.
- Produces a scannable report card with green dots for strengths and red dots for areas to improve.
- Supports Easy, Medium, and Hard interviewer modes.

## Interviewer Modes

### Easy: Google Core Product Team

A supportive, structured interviewer on an established product team. The interviewer gives a clear prompt, nudges the candidate through the framework, and checks for standard product craft: goals, users, journey, responsive design, accessibility, and ecosystem fit.

### Medium: 0-1 Moonshot Team

A realistic UX lead testing ambiguity tolerance. The candidate is expected to drive the framework without prompting. The interviewer challenges weak assumptions and introduces one technical, privacy, or scope constraint mid-session.

### Hard: Conversational AI and Research Org

A skeptical Senior Staff Designer or UX Director focused on systems, AI uncertainty, trust, latency, accessibility, scale, and tradeoffs. The prompt is intentionally broad, constraints are withheld at first, and severe pivots can appear mid-session.

## Whiteboarding Rubric

The report evaluates:

- Problem framing and scoping
- Clarifying questions
- User empathy and persona definition
- Journey and flow structure
- Breadth before depth
- Wire-level interface thinking
- Systems and architecture thinking
- Tradeoffs and constraints
- Data, telemetry, and success metrics
- Accessibility
- Google-scale and ecosystem thinking
- Collaboration with the interviewer
- Adaptability under pushback
- Time management

## Security

Do not put an OpenAI API key in any browser file.

The app is designed so the browser calls `/token`, and the server creates a short-lived Realtime client secret. The actual `OPENAI_API_KEY` stays server-side:

- Local development: `server.mjs`
- Vercel deployment: `api/token.js`

`.gitignore` excludes `.env`, `.env.local`, `.vercel`, `node_modules`, and local scratch/output folders.

## Local Development

Requirements:

- Node.js 20 or newer
- An OpenAI API key with Realtime API access

Run:

```sh
OPENAI_API_KEY=your_key_here node server.mjs
```

Then open:

```text
http://127.0.0.1:4173/
```

Optional environment variables:

```sh
OPENAI_REALTIME_MODEL=gpt-realtime-2
OPENAI_REALTIME_VOICE=marin
PORT=4173
```

## Deploy To Vercel

This repo deploys as a static frontend plus one serverless token endpoint.

1. Push the repo to GitHub.
2. Import it into Vercel.
3. Framework preset: `Other`.
4. Build command: leave blank or use `npm run vercel-build`.
5. Output directory: leave blank.
6. Add this environment variable in Vercel Project Settings:

```sh
OPENAI_API_KEY=your_key_here
```

Optional Vercel environment variables:

```sh
OPENAI_REALTIME_MODEL=gpt-realtime-2
OPENAI_REALTIME_VOICE=marin
```

`vercel.json` rewrites `/token` to `/api/token`, so the client code works locally and on Vercel without exposing the API key.

## Project Structure

```text
.
├── api/token.js           # Vercel serverless Realtime token endpoint
├── app.js                 # Main simulator logic and interviewer behavior
├── excalidraw-board.js    # Excalidraw mount/bridge
├── index.html             # App shell
├── server.mjs             # Local static server and /token endpoint
├── styles.css             # Material-inspired UI styles
├── vercel.json            # Vercel rewrite and permissions policy
└── package.json           # Deployment metadata
```

## MVP Boundaries

- The prompt bank is curated in `app.js`; it does not claim exhaustive coverage of every company question.
- The interviewer uses transcript, timing, and Excalidraw element context, but does not yet perform full visual image understanding of the canvas.
- Voice critique is based on transcript and interaction behavior; richer audio metrics like pace, hesitation, confidence, and interruption recovery are future work.
- Excalidraw is loaded from a browser module CDN in this MVP. A production build should bundle and self-host it.

## License Notes

Excalidraw is MIT-licensed. This simulator is an MVP prototype and is not affiliated with Google, Excalidraw, OpenAI, or any interview provider.
