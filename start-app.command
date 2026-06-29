#!/bin/bash

cd "$(dirname "$0")" || exit 1

if [ -z "$OPENAI_API_KEY" ]; then
  printf "Paste your OpenAI API key, then press Enter: "
  read -r OPENAI_API_KEY
  export OPENAI_API_KEY
fi

if [ -z "$OPENAI_API_KEY" ]; then
  echo "No API key entered. The app can still open, but voice will use fallback."
fi

if command -v node >/dev/null 2>&1; then
  NODE_BIN="$(command -v node)"
else
  NODE_BIN="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
fi

if [ ! -x "$NODE_BIN" ]; then
  echo "Node was not found."
  echo "Install Node from https://nodejs.org, then run this file again."
  exit 1
fi

export PORT="${PORT:-4174}"

echo "Starting Whiteboard Interview Simulator..."
echo "Open http://127.0.0.1:$PORT/"
"$NODE_BIN" server.mjs
