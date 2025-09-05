#!/usr/bin/env python3
"""Generate lossless Solfeggio tone assets for all 144 nodes.

This script reads the Codex node registry and synthesizes a pure sine wave
for each node's Solfeggio frequency. The resulting files are written as
48 kHz, 16-bit mono WAV assets under ``assets/generated/audio``.

Usage:
    python scripts/generate_solfeggio_assets.py
"""

from __future__ import annotations

import argparse
import json
import math
from pathlib import Path
import wave

import numpy as np

# ---------------------------------------------------------------------------
# Synthesis utilities
# ---------------------------------------------------------------------------

def synthesize_tone(freq: float, duration: float, sample_rate: int) -> np.ndarray:
    """Return a normalized sine wave for ``freq`` Hz."""
    t = np.linspace(0, duration, int(sample_rate * duration), False)
    waveform = 0.5 * np.sin(2 * math.pi * freq * t)
    return np.int16(waveform * 32767)


# ---------------------------------------------------------------------------
# Main generation routine
# ---------------------------------------------------------------------------

def generate_assets(nodes_file: Path, out_dir: Path, duration: float, sample_rate: int) -> None:
    """Create one WAV file per node based on its Solfeggio frequency."""
    nodes = json.loads(nodes_file.read_text())
    out_dir.mkdir(parents=True, exist_ok=True)

    for entry in nodes:
        node_id = entry["node_id"]
        freq_str = entry["solfeggio_freq"]  # e.g., "963 Hz"
        freq = float(freq_str.split()[0])
        data = synthesize_tone(freq, duration, sample_rate)
        filename = out_dir / f"node_{node_id:03d}_{int(freq)}Hz.wav"
        with wave.open(str(filename), "w") as wf:
            wf.setnchannels(1)  # mono
            wf.setsampwidth(2)  # 16-bit PCM
            wf.setframerate(sample_rate)
            wf.writeframes(data.tobytes())


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main() -> None:
    """Parse arguments and generate assets."""
    parser = argparse.ArgumentParser(description="Generate Solfeggio tone assets")
    parser.add_argument(
        "--nodes-file",
        type=Path,
        default=Path("codex-144-99/data/codex_nodes_full.json"),
        help="Path to Codex node data",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path("assets/generated/audio"),
        help="Directory for WAV files",
    )
    parser.add_argument("--duration", type=float, default=5.0, help="Tone length in seconds")
    parser.add_argument(
        "--sample-rate", type=int, default=48000, help="Sampling rate in Hz"
    )
    args = parser.parse_args()

    generate_assets(args.nodes_file, args.output_dir, args.duration, args.sample_rate)


if __name__ == "__main__":  # pragma: no cover - script entry point
    main()

