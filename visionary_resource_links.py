"""Create visionary art influenced by open resource links.

This script reads a JSON file of quests containing resource links and
renders a spiral-based collage where each link is represented by a glowing orb.
A pastel palette inspired by Hilma af Klint colors the scene. The final
composition is saved as ``Visionary_Dream.png``.
"""

from __future__ import annotations

# Imports and setup ---------------------------------------------------------
import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Iterable, List

from PIL import Image, ImageColor, ImageDraw

# Color palette inspired by Hilma af Klint ---------------------------------
PALETTE: List[str] = [
    "#F6C5D0",  # Soft Pink
    "#F9ED69",  # Pale Yellow
    "#A8E6CF",  # Mint Green
    "#84B1ED",  # Sky Blue
    "#FFD8BE",  # Peach
    "#FFFFFF",  # Pure Light
]


def collect_links(node: object) -> Iterable[str]:
    """Recursively yield all ``link`` values from a JSON structure."""

    if isinstance(node, dict):
        for key, value in node.items():
            if key == "link" and isinstance(value, str):
                yield value
            else:
                yield from collect_links(value)
    elif isinstance(node, list):
        for item in node:
            yield from collect_links(item)


def hash_color(url: str) -> tuple[int, int, int]:
    """Map a URL to a color from the palette using a hash."""

    digest = hashlib.sha256(url.encode()).digest()
    idx = digest[0] % len(PALETTE)
    return ImageColor.getrgb(PALETTE[idx])


def paint_gradient(draw: ImageDraw.ImageDraw, width: int, height: int) -> None:
    """Fill the background with a vertical gradient across the palette."""

    segments = len(PALETTE) - 1
    for y in range(height):
        pos = y / (height - 1)
        idx = min(int(pos * segments), segments - 1)
        t = pos * segments - idx
        start = ImageColor.getrgb(PALETTE[idx])
        end = ImageColor.getrgb(PALETTE[idx + 1])
        r = int(start[0] + (end[0] - start[0]) * t)
        g = int(start[1] + (end[1] - start[1]) * t)
        b = int(start[2] + (end[2] - start[2]) * t)
        draw.line([(0, y), (width, y)], fill=(r, g, b))


def draw_links(draw: ImageDraw.ImageDraw, links: List[str], width: int, height: int) -> None:
    """Render each link as an orb along a spiral path."""

    cx, cy = width / 2, height / 2
    max_radius = min(cx, cy) * 0.9
    total = max(len(links), 1)

    for i, link in enumerate(links):
        angle = math.radians(i * 15)
        radius = max_radius * (i + 1) / total
        x = cx + math.cos(angle) * radius
        y = cy + math.sin(angle) * radius
        color = hash_color(link)
        size = 8 + (i % 7)
        draw.ellipse([(x - size, y - size), (x + size, y + size)], fill=color + (200,))


def generate_art(source: Path, width: int, height: int) -> Image.Image:
    """Create the visionary artwork based on links from ``source``."""

    with source.open("r", encoding="utf-8") as fh:
        data = json.load(fh)
    links = list(collect_links(data))

    image = Image.new("RGBA", (width, height))
    draw = ImageDraw.Draw(image, "RGBA")

    # Background gradient
    paint_gradient(draw, width, height)

    # Spiraling link orbs
    draw_links(draw, links, width, height)

    return image


# CLI ----------------------------------------------------------------------
def main() -> None:
    """Parse command-line arguments and render the artwork."""

    parser = argparse.ArgumentParser(description="Visualize resource links as visionary art")
    parser.add_argument(
        "--source",
        type=Path,
        default=Path("data/rooms.json"),
        help="JSON file containing resource links",
    )
    parser.add_argument("--width", type=int, default=1920, help="Image width")
    parser.add_argument("--height", type=int, default=1080, help="Image height")
    parser.add_argument(
        "--output", type=Path, default=Path("Visionary_Dream.png"), help="Output file"
    )
    args = parser.parse_args()

    art = generate_art(args.source, args.width, args.height)
    art.save(args.output)
    print(f"Art saved to {args.output.resolve()}")


if __name__ == "__main__":
    main()
