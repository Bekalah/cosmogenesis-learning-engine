#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Indra Net Vision Generator (Angel Tech Layers)

Produces a dark-academia inspired visionary artwork that links spiral
learning patterns with a network motif reminiscent of Indra's net. The
image is suitable for inclusion in research-grade exploratory studies or
creative coding workshops.

Usage:
    python3 scripts/indra_net_vision.py --width 1920 --height 1080
"""

from __future__ import annotations

import argparse
import math
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageColor

# ---------------------------------------------------------------------------
# Color palettes inspired by esoteric dark academia and visionary art
# ---------------------------------------------------------------------------
PALETTE = {
    "ink": "#0d0c1d",       # deep academic ink
    "wine": "#3b0d11",      # aged manuscript stain
    "parchment": "#f4f3ea", # archival parchment
    "sage": "#4a5d23",      # library moss
    "gold": "#c19a6b",     # antique gilding
}


def hex_to_rgb(value: str) -> tuple[int, int, int]:
    """Convert hex string to RGB tuple."""
    return ImageColor.getrgb(value)


def vertical_gradient(draw: ImageDraw.ImageDraw, width: int, height: int,
                      top: str, bottom: str) -> None:
    """Render a vertical gradient background."""
    top_rgb = hex_to_rgb(top)
    bottom_rgb = hex_to_rgb(bottom)
    for y in range(height):
        t = y / height
        r = int(top_rgb[0] * (1 - t) + bottom_rgb[0] * t)
        g = int(top_rgb[1] * (1 - t) + bottom_rgb[1] * t)
        b = int(top_rgb[2] * (1 - t) + bottom_rgb[2] * t)
        draw.line([(0, y), (width, y)], fill=(r, g, b))


def indra_net(draw: ImageDraw.ImageDraw, width: int, height: int,
              nodes: int = 24) -> None:
    """Draw a reflective network reminiscent of Indra's net."""
    cx, cy = width // 2, height // 2
    radius = min(cx, cy) * 0.7
    positions: list[tuple[float, float]] = []
    for i in range(nodes):
        angle = 2 * math.pi * i / nodes
        x = cx + radius * math.cos(angle)
        y = cy + radius * math.sin(angle)
        positions.append((x, y))

    # Connect every node to every other (dense net)
    line_color = hex_to_rgb(PALETTE["sage"])
    for i in range(nodes):
        for j in range(i + 1, nodes):
            draw.line([positions[i], positions[j]], fill=line_color, width=1)

    # Draw nodes as mirrored jewels
    node_color = hex_to_rgb(PALETTE["gold"])
    for x, y in positions:
        draw.ellipse([(x - 6, y - 6), (x + 6, y + 6)], fill=node_color)


def phyllotaxis(draw: ImageDraw.ImageDraw, width: int, height: int,
                points: int = 600, turns: float = 5.0) -> None:
    """Overlay a phyllotactic spiral for spiral learning symbolism."""
    cx, cy = width // 2, height // 2
    max_radius = min(cx, cy) * 0.75
    golden_angle = math.pi * (3 - math.sqrt(5))
    colors = [PALETTE["wine"], PALETTE["gold"], PALETTE["sage"]]
    for i in range(points):
        t = i / points
        angle = turns * 2 * math.pi * t
        radius = max_radius * t
        x = cx + radius * math.cos(angle)
        y = cy + radius * math.sin(angle)
        color = hex_to_rgb(colors[i % len(colors)])
        size = 2 + int(4 * t)
        draw.ellipse([(x - size, y - size), (x + size, y + size)], fill=color)


def generate(width: int, height: int, output: Path) -> None:
    """Compose the final artwork and save to disk."""
    img = Image.new("RGB", (width, height))
    draw = ImageDraw.Draw(img, "RGBA")

    # Layer 1: parchment-to-ink gradient
    vertical_gradient(draw, width, height, PALETTE["parchment"], PALETTE["ink"])

    # Layer 2: Indra net lattice
    indra_net(draw, width, height)

    # Layer 3: phyllotactic spiral overlay
    phyllotaxis(draw, width, height)

    img.save(output)


def parse_args(args: Iterable[str] | None = None) -> argparse.Namespace:
    """Parse CLI arguments."""
    parser = argparse.ArgumentParser(description="Generate Indra net visionary art.")
    parser.add_argument("--width", type=int, default=1920, help="image width in pixels")
    parser.add_argument("--height", type=int, default=1080, help="image height in pixels")
    parser.add_argument("--output", type=Path, default=Path("Visionary_Dream.png"),
                        help="output image file")
    return parser.parse_args(args)


def main() -> None:
    """Entry point."""
    args = parse_args()
    generate(args.width, args.height, args.output)
    print(f"Artwork saved to {args.output}")


if __name__ == "__main__":
    main()
