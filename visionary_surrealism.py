"""Surreal Vision Generator.

Creates a museum-quality piece of visionary art inspired by surrealism.
The image is rendered at 1920x1080 resolution and saved as
``Visionary_Dream.png``.
"""

# Imports and setup ---------------------------------------------------------
from __future__ import annotations

import math
import random
from pathlib import Path

from PIL import Image, ImageDraw

# Canvas configuration ------------------------------------------------------
WIDTH, HEIGHT = 1920, 1080

# Color palette inspired by surrealism -------------------------------------
PALETTE = [
    "#0D1B2A",  # Deep Midnight Blue
    "#1B263B",  # Twilight Navy
    "#415A77",  # Steel Blue
    "#E0E1DD",  # Mist White
    "#F4A261",  # Desert Orange
    "#E76F51",  # Coral Dusk
]


def blend_background(draw: ImageDraw.ImageDraw) -> None:
    """Fill background with a vertical gradient."""

    for y in range(HEIGHT):
        ratio = y / HEIGHT
        r = int(13 * (1 - ratio) + 231 * ratio)
        g = int(27 * (1 - ratio) + 111 * ratio)
        b = int(42 * (1 - ratio) + 81 * ratio)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))


def surreal_forms(draw: ImageDraw.ImageDraw) -> None:
    """Render swirling forms and radial lines."""

    cx, cy = WIDTH / 2, HEIGHT / 2
    max_radius = min(cx, cy)

    # Spiral of colored orbs
    for step in range(360):
        angle = step * math.pi / 180
        radius = (step / 360) * max_radius
        x = cx + math.cos(angle * 3) * radius
        y = cy + math.sin(angle * 3) * radius
        color = random.choice(PALETTE)
        size = 4 + step % 12
        draw.ellipse([x - size, y - size, x + size, y + size], fill=color, outline=color)

    # Radiating spokes
    for step in range(0, 360, 15):
        angle = math.radians(step)
        x = cx + math.cos(angle) * max_radius
        y = cy + math.sin(angle) * max_radius
        draw.line([(cx, cy), (x, y)], fill=random.choice(PALETTE), width=2)


def main() -> None:
    """Generate the artwork and save to disk."""

    image = Image.new("RGB", (WIDTH, HEIGHT), PALETTE[0])
    draw = ImageDraw.Draw(image)

    blend_background(draw)
    surreal_forms(draw)

    output = Path("Visionary_Dream.png")
    image.save(output)
    print(f"Art saved to {output.resolve()}")


if __name__ == "__main__":
    main()
