#!/bin/bash

# Hydra Performance Launcher
# Usage: ./start.sh [port]

PORT=${1:-5173}
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🎛  Hydra Performance System"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Kill any existing process on the port
EXISTING=$(lsof -ti :$PORT)
if [ -n "$EXISTING" ]; then
  echo "⚠️  Killing existing process on port $PORT (PID $EXISTING)"
  kill $EXISTING
  sleep 1
fi

# Start the dev server
echo "🚀  Starting server on http://localhost:$PORT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  0–9   load patch"
echo "  a     toggle audio meter"
echo "  c     toggle code editor"
echo ""
echo "  Press Ctrl+C to stop"
echo ""

cd "$PROJECT_DIR"
./node_modules/.bin/vite . --host --port $PORT
