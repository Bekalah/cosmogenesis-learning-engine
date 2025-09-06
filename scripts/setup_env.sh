#!/usr/bin/env bash
# Install Python and Node dependencies for the Cosmogenesis Learning Engine.
set -e

# Create virtual environment if missing
if [ ! -d ".venv" ]; then
  python3 -m venv .venv
fi

# Activate virtual environment
source .venv/bin/activate

# Upgrade pip and install Python dependencies
pip install --upgrade pip
if [ -f requirements.txt ]; then
  pip install -r requirements.txt
fi

# Install Node dependencies if available
if command -v npm >/dev/null 2>&1; then
  npm install
fi

echo "Environment setup complete."
