#!/bin/bash
# Dev server control script

case "$1" in
  start)
    echo "Starting dev server..."
    npm run dev &
    echo $! > .dev.pid
    echo "Server running at http://localhost:5173/"
    echo "Run './dev.sh stop' to stop"
    ;;
  stop)
    if [ -f .dev.pid ]; then
      kill $(cat .dev.pid) 2>/dev/null
      pkill -f "vite" 2>/dev/null
      rm .dev.pid
      echo "Dev server stopped"
    else
      pkill -f "vite" 2>/dev/null
      echo "Dev server stopped"
    fi
    ;;
  *)
    echo "Usage: ./dev.sh [start|stop]"
    ;;
esac
