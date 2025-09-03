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

# Upgrade pip
pip install --upgrade pip >/dev/null 2>&1 || true

# Ensure Pillow is available without depending on PyPI
if ! python -c "import PIL" >/dev/null 2>&1; then
  echo "Attempting to install Pillow..."
  if ! pip install pillow >/dev/null 2>&1; then
    echo "Pillow could not be installed via pip."
    if command -v apt-get >/dev/null 2>&1; then
      echo "Trying system package python3-pil..."
      sudo apt-get update && sudo apt-get install -y python3-pil || echo "System package install failed."
    else
      echo "Install Pillow manually (e.g., download a wheel and run 'pip install <file>')."
    fi
  fi
else
  echo "Pillow already installed."
fi

# Install remaining Python dependencies (ignore Pillow entry if present)
if [ -f requirements.txt ]; then
  grep -v '^Pillow' requirements.txt > /tmp/reqs.txt
  pip install -r /tmp/reqs.txt >/dev/null 2>&1 || echo "Some Python deps failed to install."
fi

# Install Node dependencies if available
command -v npm >/dev/null 2>&1 && npm install >/dev/null 2>&1 || echo "npm not available or install failed."

echo "Environment setup complete."
