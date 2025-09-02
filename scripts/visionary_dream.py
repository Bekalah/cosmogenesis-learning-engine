#!/usr/bin/env python3
"""Visionary mandala using Fuchs-like palette and cathedral motifs.

Generates a piece reminiscent of Ernst Fuchs and esoteric cathedral motifs.
The image is saved as ``Visionary_Dream.png``.
"""

from math import cos, sin, pi, exp
from pathlib import Path
import json
from PIL import Image, ImageDraw

# Canvas resolution (portrait tarot ratio)
WIDTH, HEIGHT = 1024, 1536

# Load Fuchs-inspired palette from data/palette.json
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
ASSETS_DIR = BASE_DIR / "assets" / "generated"
with (DATA_DIR / "palette.json").open() as f:
    _pal = json.load(f)["fuchs_palette"]
PALETTE = [tuple(_pal[name]) for name in ("gold", "violet", "turquoise", "sapphire")]

def gradient_background(draw: ImageDraw.ImageDraw) -> None:
    """Lay down a vertical gradient bridging gold and violet."""
    for y in range(HEIGHT):
        t = y / HEIGHT
        r = int(PALETTE[0][0] * (1 - t) + PALETTE[1][0] * t)
        g = int(PALETTE[0][1] * (1 - t) + PALETTE[1][1] * t)
        b = int(PALETTE[0][2] * (1 - t) + PALETTE[1][2] * t)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))

def draw_tesseract(draw: ImageDraw.ImageDraw) -> None:
    """Render nested, rotated squares evoking a tesseract portal."""
    cx, cy = WIDTH // 2, HEIGHT // 2
    base = min(WIDTH, HEIGHT) * 0.35
    for i in range(5):
        scale = base * (1 - i * 0.15)
        angle = pi / 4 * i
        points = []
        for j in range(4):
            theta = angle + j * pi / 2
            x = cx + scale * cos(theta)
            y = cy + scale * sin(theta)
            points.append((x, y))
        draw.polygon(points, outline=PALETTE[2])

def draw_spiral(draw: ImageDraw.ImageDraw) -> None:
    """Trace a logarithmic spiral echoing cathedral arches."""
    cx, cy = WIDTH // 2, HEIGHT // 2
    a, b = 2, 0.20
    theta = 0.0
    last = (cx, cy)
    while theta < 12 * pi:
        r = a * exp(b * theta)
        x = cx + r * cos(theta)
        y = cy + r * sin(theta)
        draw.line([last, (x, y)], fill=PALETTE[3], width=2)
        last = (x, y)
        theta += pi / 32

def main() -> None:
    """Compose the visionary dream and save it to disk."""
    img = Image.new("RGB", (WIDTH, HEIGHT), "black")
    draw = ImageDraw.Draw(img)
    gradient_background(draw)
    draw_tesseract(draw)
    draw_spiral(draw)
    ASSETS_DIR.mkdir(parents=True, exist_ok=True)
    img.save(ASSETS_DIR / "Visionary_Dream.png")

if __name__ == "__main__":  # pragma: no cover - script entry point
    main()
