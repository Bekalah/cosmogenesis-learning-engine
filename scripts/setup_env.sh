#!/usr/bin/env bash
# Install Python and Node dependencies for the Cosmogenesis Learning Engine.
# Creates a virtual environment at .venv if not present.
set -e

# Create virtual environment if missing
if [ ! -d ".venv" ]; then
  python3 -m venv .venv
fi

# Activate virtual environment
source .venv/bin/activate

# Upgrade pip and install Python dependencies (including Pillow)
pip install --upgrade pip
pip install -r requirements.txt

# Install Node dependencies
npm install

echo "Environment setup complete."
