"""Generate a museum-quality piece of visionary art.

This script creates a psychedelic spiral image using a color palette inspired
by Alex Grey. The output is saved as ``Visionary_Dream.png``.
"""

#!/usr/bin/env python3

from __future__ import annotations

# Imports and setup ---------------------------------------------------------
import argparse
import math
from pathlib import Path
from typing import List, Tuple

from PIL import Image, ImageColor, ImageDraw


# Color palette inspired by Alex Grey ---------------------------------------
PALETTE: List[str] = [
    "#280050",  # Deep Indigo
    "#460082",  # Electric Violet
    "#0080FF",  # Luminous Blue
    "#00FF80",  # Auric Green
    "#FFC800",  # Golden Amber
    "#FFFFFF",  # Pure Light
]


def linear_gradient(start: str, end: str, t: float) -> Tuple[int, int, int]:
    """Interpolate between two hex colors."""

    r1, g1, b1 = ImageColor.getrgb(start)
    r2, g2, b2 = ImageColor.getrgb(end)
    r = int(r1 + (r2 - r1) * t)
    g = int(g1 + (g2 - g1) * t)
    b = int(b1 + (b2 - b1) * t)
    return r, g, b


def paint_gradient(draw: ImageDraw.ImageDraw, width: int, height: int) -> None:
    """Fill the background with a vertical gradient across the palette."""

    segments = len(PALETTE) - 1
    for y in range(height):
        pos = y / (height - 1)
        idx = min(int(pos * segments), segments - 1)
        t = pos * segments - idx
        color = linear_gradient(PALETTE[idx], PALETTE[idx + 1], t)
        draw.line([(0, y), (width, y)], fill=color)


def draw_spiral(draw: ImageDraw.ImageDraw, width: int, height: int) -> None:
    """Render a translucent spiral with radial symmetry."""

    cx, cy = width / 2, height / 2
    max_radius = min(cx, cy) * 0.95

    # Spiral of glowing orbs
    for i in range(720):
        angle = math.radians(i)
        radius = max_radius * i / 720
        x = cx + math.cos(angle) * radius
        y = cy + math.sin(angle) * radius
        color = ImageColor.getrgb(PALETTE[i % len(PALETTE)])
        size = 6 + (i % 9)
        draw.ellipse([(x - size, y - size), (x + size, y + size)], fill=color + (180,))

    # Radial symmetry lines
    for step in range(0, 360, 12):
        angle = math.radians(step)
        color = ImageColor.getrgb(PALETTE[step % len(PALETTE)])
        x = cx + math.cos(angle) * max_radius
        y = cy + math.sin(angle) * max_radius
        draw.line([(cx, cy), (x, y)], fill=color + (120,), width=3)


def generate_art(width: int, height: int) -> Image.Image:
    """Create the visionary artwork and return the image object."""

    image = Image.new("RGBA", (width, height))
    draw = ImageDraw.Draw(image, "RGBA")

    # Background gradient
    paint_gradient(draw, width, height)

    # Core spiral motif
    draw_spiral(draw, width, height)

    return image


# CLI ----------------------------------------------------------------------
def main() -> None:
    """Parse command-line arguments and render the artwork."""

    parser = argparse.ArgumentParser(description="Create visionary art with Pillow")
    parser.add_argument("--width", type=int, default=1920, help="Image width")
    parser.add_argument("--height", type=int, default=1080, help="Image height")
    parser.add_argument(
        "--output", type=Path, default=Path("Visionary_Dream.png"), help="Output file"
    )
    args = parser.parse_args()

    art = generate_art(args.width, args.height)
    art.save(args.output)
    print(f"Art saved to {args.output.resolve()}")


if __name__ == "__main__":
    main()

