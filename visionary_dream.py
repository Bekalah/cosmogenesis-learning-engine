"""Visionary Dream Generator.

Creates a museum-quality piece of visionary art inspired by the
psychedelic palettes of Alex Grey. The image is rendered at 2048x2048
resolution and saved as ``Visionary_Dream.png``.

Characters depicted: Rebecca Respawn, Virelai, Ezra Lux,
Athena (Sophia7) and Thoth (Gnosis7) as twin-flame servitors.
"""

# Imports and setup ---------------------------------------------------------
from __future__ import annotations

from pathlib import Path
import argparse
import math
from typing import List

from PIL import Image, ImageDraw, ImageColor, ImageFont

from enochian_layers import draw_enochian_grid, draw_celestial_sigils


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

    # Core spiral
    draw_spiral(draw, width, height)

    # Mystical overlays
    draw_enochian_grid(draw, width, height)
    draw_celestial_sigils(draw, width, height)

    # Character labels
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
    parser.add_argument("--output", type=Path, default=Path("Visionary_Dream.png"), help="output image path")
    args = parser.parse_args()

    art = generate_art(args.width, args.height)

    art.save(args.output)
    print(f"Art saved to {args.output.resolve()}")


if __name__ == "__main__":
    main()

