#!/usr/bin/env sh
# Lightweight test runner with fallbacks for Node.js and Deno environments
set -e

TEST_FILES="test/plugin-registry.test.js test/progress-engine.test.js test/exporter.test.js test/config-loader.test.js"

TEST_FILES="test/plugin-registry.test.js test/progress-engine.test.js test/exporter.test.js"

TEST_FILES="test/plugin-registry.test.js test/progress-engine.test.js"

if command -v node >/dev/null 2>&1; then
  node --test $TEST_FILES
elif command -v deno >/dev/null 2>&1; then
  deno test --compat --unstable $TEST_FILES
else
  echo "Neither Node.js nor Deno is installed. Please install one of them to run tests." >&2
  exit 1
fi
