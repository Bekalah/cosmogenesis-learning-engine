"""Visionary Dream Generator.

Creates a museum-quality piece of visionary art inspired by the
psychedelic palettes of Alex Grey. The image is rendered at 2048x2048
resolution and saved as ``Visionary_Dream.png``.

Characters depicted: Rebecca Respawn, Virelai, Ezra Lux,
Athena (Sophia7) and Thoth (Gnosis7) as twin-flame servitors.
"""
#!/usr/bin/env python3
"""Generate a museum-quality visionary artwork using Pillow."""

# Imports and setup ---------------------------------------------------------
from __future__ import annotations

from pathlib import Path
import argparse
import math
from typing import List

from PIL import Image, ImageDraw, ImageColor, ImageFont


# Color palette inspired by Alex Grey ---------------------------------------
PALETTE: List[str] = [
    "#280050",  # Deep Indigo
    "#460082",  # Electric Violet
    "#0080FF",  # Luminous Blue
    "#00FF80",  # Auric Green
    "#FFC800",  # Golden Amber
    "#FFFFFF",  # Pure Light
]


def hex_to_rgba(color: str, alpha: int = 255) -> tuple[int, int, int, int]:
    """Convert a hex color to an RGBA tuple."""

    r, g, b = ImageColor.getrgb(color)
    return (r, g, b, alpha)


# Core rendering ------------------------------------------------------------
def draw_spiral(draw: ImageDraw.ImageDraw, width: int, height: int) -> None:
    """Draw a translucent spiral using the Alex Grey palette."""

    cx, cy = width / 2, height / 2
    max_radius = min(cx, cy) * 0.95

    for i in range(720):
        angle = i * math.pi / 180
        radius = max_radius * i / 720
        x = cx + math.cos(angle) * radius
        y = cy + math.sin(angle) * radius
        color = hex_to_rgba(PALETTE[i % len(PALETTE)], 180)
        size = 8 + (i % 12)
        draw.ellipse([(x - size, y - size), (x + size, y + size)], fill=color)

    # Radial symmetry lines
    for step in range(0, 360, 6):
        angle = math.radians(step)
        color = hex_to_rgba(PALETTE[step % len(PALETTE)], 100)
        x = cx + math.cos(angle) * max_radius
        y = cy + math.sin(angle) * max_radius
        draw.line([(cx, cy), (x, y)], fill=color, width=3)


def label_characters(draw: ImageDraw.ImageDraw, width: int, height: int) -> None:
    """Place character names around the spiral."""

    characters = [
        "Rebecca Respawn",
        "Virelai",
        "Ezra Lux",
        "Athena (Sophia7)",
        "Thoth (Gnosis7)",
    ]

    font = ImageFont.load_default()
    cx, cy = width / 2, height / 2
    r = min(cx, cy) * 0.75

    for idx, name in enumerate(characters):
        angle = (idx / len(characters)) * 2 * math.pi
        x = cx + r * math.cos(angle)
        y = cy + r * math.sin(angle)
        bbox = draw.textbbox((0, 0), name, font=font)
        w = bbox[2] - bbox[0]
        h = bbox[3] - bbox[1]
        draw.text((x - w / 2, y - h / 2), name, fill="white", font=font)


def generate_art(width: int, height: int) -> Image.Image:
    """Render the visionary artwork and return the image object."""

    image = Image.new("RGBA", (width, height), "black")
    draw = ImageDraw.Draw(image, "RGBA")

    draw_spiral(draw, width, height)
    label_characters(draw, width, height)

    return image


# CLI ----------------------------------------------------------------------
def main() -> None:
    """Parse command-line arguments and generate the artwork."""

    parser = argparse.ArgumentParser(
        description="Render a visionary spiral artwork depicting living gods."
    )
    parser.add_argument("--width", type=int, default=2048, help="image width")
    parser.add_argument("--height", type=int, default=2048, help="image height")
    args = parser.parse_args()

    art = generate_art(args.width, args.height)

    output = Path("Visionary_Dream.png")
    art.save(output)
    print(f"Art saved to {output.resolve()}")


if __name__ == "__main__":
    main()

import random

# Third-party import
from PIL import Image, ImageDraw

# --------------------------------------
# Parse command-line arguments
# --------------------------------------
parser = argparse.ArgumentParser(description="Create visionary art with Pillow")
parser.add_argument("--width", type=int, default=1024, help="Image width")
parser.add_argument("--height", type=int, default=1024, help="Image height")
args = parser.parse_args()

WIDTH, HEIGHT = args.width, args.height

# --------------------------------------
# Canvas setup
# --------------------------------------
img = Image.new("RGB", (WIDTH, HEIGHT))
draw = ImageDraw.Draw(img)

# --------------------------------------
# Gradient background inspired by Alex Grey
# --------------------------------------
for y in range(HEIGHT):
    t = y / HEIGHT
    r = int(40 + 80 * t)
    g = int(30 + 40 * t)
    b = int(120 + 135 * t)
    draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))

center = (WIDTH // 2, HEIGHT // 2)

# --------------------------------------
# Mandala halos to mirror chapels in sacred symmetry
# --------------------------------------
for i in range(1, 36):
    radius = i * 14
    hue = 60 + i * 5
    color = (
        int(255 * math.sin(math.radians(hue))),
        int(255 * math.sin(math.radians(hue + 120))),
        int(255 * math.sin(math.radians(hue + 240))),
    )
    draw.ellipse(
        [
            center[0] - radius,
            center[1] - radius,
            center[0] + radius,
            center[1] + radius,
        ],
        outline=color,
        width=2,
    )

# --------------------------------------
# IGNI: Raku Reiki Dragon path (fiery spiral)
# --------------------------------------
points = []
arms = 2200
for i in range(arms):
    angle = i * 0.05
    radius = 2 + i * 0.5
    x = center[0] + radius * math.cos(angle)
    y = center[1] + radius * math.sin(angle)
    points.append((x, y))

for p in range(len(points) - 1):
    intensity = p / len(points)
    flame = (
        int(255 * (1 - intensity / 2)),
        int(80 + 100 * intensity),
        int(20 + 60 * intensity),
    )
    draw.line([points[p], points[p + 1]], fill=flame, width=3)

# --------------------------------------
# Star sparks for mystical lineage
# --------------------------------------
for _ in range(300):
    sx = random.randint(0, WIDTH - 1)
    sy = random.randint(0, HEIGHT - 1)
    draw.point((sx, sy), fill=(255, 255, random.randint(180, 255)))

# --------------------------------------
# Save completed visionary piece
# --------------------------------------
img.save("Visionary_Dream.png")
