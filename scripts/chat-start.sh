#!/bin/zsh
# Desktop launcher: opens the live playsheet in Comet with the chat server up.
# Starts the server only if it isn't already running, so double-clicking twice
# is harmless. Closing the Terminal window stops the server.

export PATH="/opt/homebrew/bin:$HOME/.local/bin:$PATH"
cd "${0:A:h}/.." || exit 1

# A fresh query string skips the 10-minute page cache, so the icon always loads
# the panel that matches the server it just started.
URL="https://nnnsightnnn.github.io/gameday-playsheet/?chat=$(date +%s)"
ORIGIN="https://nnnsightnnn.github.io"
up() { curl -fs -o /dev/null -H "Origin: $ORIGIN" http://127.0.0.1:5199/health; }

if up; then
  open -a Comet "$URL"
  exit 0
fi

# Open the page once the server answers, while this window runs the server.
( for _ in {1..40}; do up && { open -a Comet "$URL"; exit 0; }; sleep 0.25; done ) &
exec npm run chat
