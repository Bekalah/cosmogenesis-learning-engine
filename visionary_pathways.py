#!/usr/bin/env python3
"""Visionary Pathways Generator

Creates a museum-quality piece of visionary art inspired by Alex Grey's
palette. The image is rendered at 2048x2048 resolution and saved as
``Visionary_Dream.png``.
"""

from __future__ import annotations

# Imports and setup ---------------------------------------------------------
from pathlib import Path
import math
from typing import List, Tuple

from PIL import Image, ImageDraw, ImageFont

# Color palette inspired by Alex Grey ---------------------------------------
PALETTE: List[str] = [
    "#280050",  # Deep Indigo
    "#460082",  # Electric Violet
    "#0080FF",  # Luminous Blue
    "#00FF80",  # Auric Green
    "#FFC800",  # Golden Amber
    "#FFFFFF",  # Pure Light
]

# Path labels sourced from esoteric traditions ------------------------------
PATHS: List[Tuple[str, str]] = [
    ("73", "Harmonic Compass"),
    ("124", "Geometric Gnosis"),
    ("101", "Shadowfire"),
    ("106", "Inner Forge"),
    ("84", "Temple Dreamer"),
    ("136", "Infinity Crown"),
    ("139", "Living Codex"),
    ("90", "Soul Fractal"),
    ("105", "Coiled Serpent"),
    ("142", "Spiral Eternity"),
    ("133", "Infinite Integration"),
    ("144", "Codex Crown"),
]

WIDTH, HEIGHT = 2048, 2048


def hex_to_rgba(color: str, alpha: int = 255) -> Tuple[int, int, int, int]:
    """Convert hex color to RGBA."""
    r = int(color[1:3], 16)
    g = int(color[3:5], 16)
    b = int(color[5:7], 16)
    return (r, g, b, alpha)


# Gradient background -------------------------------------------------------
def draw_gradient(draw: ImageDraw.ImageDraw, width: int, height: int) -> None:
    """Render radial gradient using the Alex Grey palette."""
    cx, cy = width / 2, height / 2
    max_r = math.hypot(cx, cy)
    for y in range(height):
        for x in range(width):
            r = math.hypot(x - cx, y - cy)
            t = r / max_r
            idx = int(t * (len(PALETTE) - 1))
            color = hex_to_rgba(PALETTE[idx])
            draw.point((x, y), fill=color)


# Spiral rendering ----------------------------------------------------------
def draw_spiral(draw: ImageDraw.ImageDraw, width: int, height: int) -> None:
    """Draw luminous spiral with path markers."""
    cx, cy = width / 2, height / 2
    max_radius = min(cx, cy) * 0.9
    turns = 12
    total_steps = turns * 360
    for i in range(total_steps):
        angle = math.radians(i)
        radius = max_radius * i / total_steps
        x = cx + math.cos(angle) * radius
        y = cy + math.sin(angle) * radius
        color = hex_to_rgba(PALETTE[i % len(PALETTE)], 180)
        draw.ellipse([(x - 6, y - 6), (x + 6, y + 6)], fill=color)

    # Label each path along the spiral
    try:
        font = ImageFont.truetype("DejaVuSans.ttf", 36)
    except OSError:
        font = ImageFont.load_default()

    step_per_label = total_steps // len(PATHS)
    for idx, (num, title) in enumerate(PATHS):
        angle = math.radians(idx * step_per_label)
        radius = max_radius * (idx * step_per_label) / total_steps
        x = cx + math.cos(angle) * radius
        y = cy + math.sin(angle) * radius
        label = f"{num} {title}"
        bbox = draw.textbbox((0, 0), label, font=font)
        w = bbox[2] - bbox[0]
        h = bbox[3] - bbox[1]
        draw.text((x - w / 2, y - h / 2), label, fill="white", font=font)


# Main generation -----------------------------------------------------------
def generate_art(width: int, height: int) -> Image.Image:
    """Generate the visionary artwork."""
    image = Image.new("RGBA", (width, height))
    draw = ImageDraw.Draw(image, "RGBA")
    draw_gradient(draw, width, height)
    draw_spiral(draw, width, height)
    return image


def main() -> None:
    """Create and save the visionary artwork."""
    art = generate_art(WIDTH, HEIGHT)
    output = Path("Visionary_Dream.png")
    art.save(output)
    print(f"Art saved to {output.resolve()}")


if __name__ == "__main__":
    main()
