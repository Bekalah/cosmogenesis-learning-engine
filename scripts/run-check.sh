#!/usr/bin/env sh
# Format check runner with fallbacks for Node.js and Deno
set -e

if command -v node >/dev/null 2>&1; then

  npx prettier -c package.json test/plugin-registry.test.js test/progress-engine.test.js
  npx prettier -c package.json test/**/*.js
  npx prettier -c .
elif command -v deno >/dev/null 2>&1; then
  deno fmt --check README.md package.json scripts/run-tests.sh scripts/run-check.sh
else
  echo "Neither Node.js nor Deno is installed. Cannot run formatting checks." >&2
  exit 1
fi
