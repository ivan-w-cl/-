#!/bin/sh
# Liverpool Student Map: run the student website, the booking expert console and the server on this computer.
# Needs Node.js 18 or newer (https://nodejs.org). Student site: http://localhost:8765/  Expert console: http://localhost:8765/adviser.html
cd "$(dirname "$0")" || exit 1
command -v node >/dev/null 2>&1 || { echo "Please install Node.js 18 or newer from https://nodejs.org"; exit 1; }
export SITE_DIR="${SITE_DIR:-web-live}"
echo "Student website:        http://localhost:${PORT:-8765}/"
echo "Booking expert console: http://localhost:${PORT:-8765}/adviser.html  (password: ${ADMIN_PASSWORD:-123456})"
[ -n "$ANTHROPIC_API_KEY" ] && echo "Snap-read: live AI recognition on" || echo "Snap-read: demo (set ANTHROPIC_API_KEY and run npm install in web-original/consult-server for live AI)"
echo "Phones on the same Wi-Fi: use this computer's IP address instead of localhost. Press Ctrl+C to stop."
exec node web-original/consult-server/server.js
