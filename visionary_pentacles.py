#!/usr/bin/env python3
"""Visionary Pentacles Generator.

Produce a museum-quality piece of visionary art in verdant greens and
golds, echoing the earthbound mysticism of the Pentacles suit and the
luminous palettes of Alex Grey. The final image is rendered at
2048x2048 resolution and saved as ``Visionary_Dream.png``.
"""

# Imports and setup ---------------------------------------------------------
from __future__ import annotations

import argparse
import math
import random
from pathlib import Path
from typing import List, Tuple

from PIL import Image, ImageColor, ImageDraw


# Color palette inspired by Alex Grey's emerald and golden hues -------------
PALETTE: List[str] = [
    "#012110",  # Deep forest
    "#0f5e3d",  # Pine green
    "#38b000",  # Vibrant emerald
    "#f0e130",  # Solar gold
    "#ffa500",  # Amber highlight
    "#ffffff",  # Pure light
]


def hex_to_rgb(color: str) -> Tuple[int, int, int]:
    """Convert a hex color string to an RGB tuple."""

    return ImageColor.getrgb(color)


# Gradient background -------------------------------------------------------
def draw_gradient(draw: ImageDraw.ImageDraw, width: int, height: int) -> None:
    """Render a vertical gradient from deep green to luminous gold."""

    top = hex_to_rgb(PALETTE[0])
    bottom = hex_to_rgb(PALETTE[3])
    for y in range(height):
        blend = y / (height - 1)
        r = int(top[0] + (bottom[0] - top[0]) * blend)
        g = int(top[1] + (bottom[1] - top[1]) * blend)
        b = int(top[2] + (bottom[2] - top[2]) * blend)
        draw.line([(0, y), (width, y)], fill=(r, g, b))


# Labyrinth geometry --------------------------------------------------------
def draw_labyrinth(draw: ImageDraw.ImageDraw, width: int, height: int) -> None:
    """Compose concentric pentagonal rings forming an earth labyrinth."""

    cx, cy = width // 2, height // 2
    radius = min(cx, cy) * 0.9
    rings = 12
    for i in range(rings):
        angle_offset = math.radians((i % 2) * 36)
        r = radius * (1 - i / rings)
        points = []
        for j in range(5):
            angle = angle_offset + j * math.tau / 5
            x = cx + r * math.cos(angle)
            y = cy + r * math.sin(angle)
            points.append((x, y))
        color = hex_to_rgb(PALETTE[i % len(PALETTE)])
        draw.polygon(points, outline=color)


# Root network --------------------------------------------------------------
def draw_roots(draw: ImageDraw.ImageDraw, width: int, height: int) -> None:
    """Grow organic root tendrils radiating from the center."""

    cx, cy = width // 2, height // 2
    branches = 60
    for i in range(branches):
        angle = math.tau * i / branches
        length = random.uniform(height * 0.25, height * 0.45)
        steps = 100
        pts = []
        for s in range(steps):
            t = s / steps
            r = length * t + random.uniform(-5, 5)
            wobble = math.sin(t * math.pi * random.randint(1, 5)) * 15
            x = cx + math.cos(angle) * r + math.cos(angle + math.pi / 2) * wobble
            y = cy + math.sin(angle) * r + math.sin(angle + math.pi / 2) * wobble
            pts.append((x, y))
        shade = hex_to_rgb(PALETTE[2 if i % 2 == 0 else 1])
        draw.line(pts, fill=shade, width=2)


# Core rendering ------------------------------------------------------------
def generate_art(width: int, height: int) -> Image.Image:
    """Create the layered visionary composition."""

    image = Image.new("RGB", (width, height), "black")
    draw = ImageDraw.Draw(image)

    # Layer 1: gradient soil and sun
    draw_gradient(draw, width, height)

    # Layer 2: sacred labyrinth geometry
    draw_labyrinth(draw, width, height)

    # Layer 3: living root network
    draw_roots(draw, width, height)

    return image


# CLI ----------------------------------------------------------------------
def main() -> None:
    """Parse CLI arguments and render the artwork."""

    parser = argparse.ArgumentParser(description="Generate visionary pentacles art")
    parser.add_argument("--width", type=int, default=2048, help="image width")
    parser.add_argument("--height", type=int, default=2048, help="image height")
    parser.add_argument(
        "--output", type=Path, default=Path("Visionary_Dream.png"), help="output path"
    )
    args = parser.parse_args()

    art = generate_art(args.width, args.height)
    art.save(args.output)
    print(f"Art saved to {args.output.resolve()}")


if __name__ == "__main__":
    main()
