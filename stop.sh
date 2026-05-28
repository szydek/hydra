#!/bin/bash

PORT=${1:-5173}

EXISTING=$(lsof -ti :$PORT)
if [ -n "$EXISTING" ]; then
  echo "Stopping Hydra on port $PORT (PID $EXISTING)"
  kill $EXISTING
else
  echo "Nothing running on port $PORT"
fi
