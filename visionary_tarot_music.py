"""Tarot-infused art and music generator.

Create a museum-quality piece of visionary art and an accompanying soundscape.
The artwork uses a color palette inspired by surrealism and is saved as
``Visionary_Dream.png``. A simple music track derived from image colors and
Tarot card aspects is stored as ``Visionary_Music.wav``.
"""

#!/usr/bin/env python3

from __future__ import annotations

# Imports and setup ---------------------------------------------------------
import argparse
import math
import struct
import wave
from pathlib import Path
from typing import Dict

import numpy as np
from PIL import Image, ImageColor, ImageDraw

# Tarot influences ----------------------------------------------------------
TAROT_PALETTES: Dict[str, str] = {
    "Fool": "#FFD700",  # Golden optimism
    "Magician": "#00FFFF",  # Electric inspiration
    "High Priestess": "#8000FF",  # Mystic violet
}

# Color palette inspired by surrealism -------------------------------------
BASE_PALETTE = [
    "#0D1B2A",  # Deep Midnight Blue
    "#1B263B",  # Twilight Navy
    "#415A77",  # Steel Blue
    "#E0E1DD",  # Mist White
]


def gradient_background(draw: ImageDraw.ImageDraw, width: int, height: int, card: str) -> None:
    """Paint a vertical gradient blending tarot color with base palette."""

    tarot_color = TAROT_PALETTES.get(card, "#F4A261")
    start_rgb = ImageColor.getrgb(tarot_color)
    end_rgb = ImageColor.getrgb(BASE_PALETTE[-1])

    for y in range(height):
        t = y / (height - 1)
        r = int(start_rgb[0] * (1 - t) + end_rgb[0] * t)
        g = int(start_rgb[1] * (1 - t) + end_rgb[1] * t)
        b = int(start_rgb[2] * (1 - t) + end_rgb[2] * t)
        draw.line([(0, y), (width, y)], fill=(r, g, b))


def spiral(draw: ImageDraw.ImageDraw, width: int, height: int) -> None:
    """Render a translucent spiral as a focal point."""

    cx, cy = width / 2, height / 2
    max_radius = min(cx, cy) * 0.9
    for i in range(720):
        angle = math.radians(i)
        radius = max_radius * i / 720
        x = cx + math.cos(angle) * radius
        y = cy + math.sin(angle) * radius
        color = ImageColor.getrgb(BASE_PALETTE[i % len(BASE_PALETTE)])
        draw.ellipse([(x - 4, y - 4), (x + 4, y + 4)], fill=color + (180,))


def image_to_freqs(image: Image.Image, count: int = 8) -> np.ndarray:
    """Map average row brightness to audio frequencies."""

    gray = image.convert("L")
    arr = np.array(gray)
    row_avgs = arr.mean(axis=1)
    indices = np.linspace(0, len(row_avgs) - 1, count).astype(int)
    brightness = row_avgs[indices] / 255.0
    return 220 + brightness * 880  # Map to 220-1100 Hz


def synthesize(freqs: np.ndarray, out_file: Path) -> None:
    """Generate a simple sine-wave melody from frequencies."""

    sample_rate = 44100
    duration = 0.4  # seconds per tone
    frames = []
    for f in freqs:
        t = np.linspace(0, duration, int(sample_rate * duration), False)
        wave_data = 0.5 * np.sin(2 * np.pi * f * t)
        frames.extend(wave_data)
    audio = np.array(frames)
    max_amp = np.max(np.abs(audio))
    scaled = (audio / max_amp * 32767).astype(np.int16)

    with wave.open(str(out_file), "w") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(scaled.tobytes())


def generate_art(width: int, height: int, card: str) -> Image.Image:
    """Create visionary artwork influenced by a tarot card."""

    image = Image.new("RGBA", (width, height))
    draw = ImageDraw.Draw(image, "RGBA")

    gradient_background(draw, width, height, card)
    spiral(draw, width, height)

    return image


# CLI ----------------------------------------------------------------------
def main() -> None:
    """Parse args, render art, and compose music."""

    parser = argparse.ArgumentParser(description="Tarot art and music generator")
    parser.add_argument("--card", type=str, default="Fool", help="Tarot card name")
    parser.add_argument("--width", type=int, default=1920, help="Image width")
    parser.add_argument("--height", type=int, default=1080, help="Image height")
    parser.add_argument(
        "--output", type=Path, default=Path("Visionary_Dream.png"), help="Art output file"
    )
    parser.add_argument(
        "--audio", type=Path, default=Path("Visionary_Music.wav"), help="Audio output file"
    )
    args = parser.parse_args()

    art = generate_art(args.width, args.height, args.card)
    art.save(args.output)

    freqs = image_to_freqs(art)
    synthesize(freqs, args.audio)

    print(f"Art saved to {args.output.resolve()}")
    print(f"Music saved to {args.audio.resolve()}")


if __name__ == "__main__":
    main()
