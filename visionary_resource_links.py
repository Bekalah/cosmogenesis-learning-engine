"""Create visionary art influenced by open resource links.

This script reads a JSON file of quests containing resource links and
renders a spiral-based collage where each link is represented by a glowing
orb. A palette drawn from :mod:`data/palette.json` colors the scene to honor
Cosmogenesis style guidelines. The final composition is saved as
``Visionary_Dream.png``.
"""

from __future__ import annotations

# Imports and setup ---------------------------------------------------------
import argparse
import hashlib
import json
import math
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw

# Palette loading -----------------------------------------------------------
def load_palette(path: Path) -> list[tuple[int, int, int]]:
    """Load an RGB palette from ``path``.

    The file is expected to match the structure of ``data/palette.json``.
    All color values are returned in the order provided.
    """

    with path.open("r", encoding="utf-8") as fh:
        data = json.load(fh)
    palette: list[tuple[int, int, int]] = []
    for palette_dict in data.values():
        palette.extend(tuple(color) for color in palette_dict.values())
    return palette


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


def hash_color(url: str, palette: list[tuple[int, int, int]]) -> tuple[int, int, int]:
    """Map a URL to a color from ``palette`` using a hash."""

    digest = hashlib.sha256(url.encode()).digest()
    idx = digest[0] % len(palette)
    return palette[idx]


def paint_gradient(
    draw: ImageDraw.ImageDraw, width: int, height: int, palette: list[tuple[int, int, int]]
) -> None:
    """Fill the background with a vertical gradient across ``palette``."""

    segments = len(palette) - 1
    for y in range(height):
        pos = y / (height - 1)
        idx = min(int(pos * segments), segments - 1)
        t = pos * segments - idx
        start = palette[idx]
        end = palette[idx + 1]
        r = int(start[0] + (end[0] - start[0]) * t)
        g = int(start[1] + (end[1] - start[1]) * t)
        b = int(start[2] + (end[2] - start[2]) * t)
        draw.line([(0, y), (width, y)], fill=(r, g, b))


def draw_links(
    draw: ImageDraw.ImageDraw,
    links: list[str],
    width: int,
    height: int,
    palette: list[tuple[int, int, int]],
) -> None:
    """Render each link as an orb along a spiral path."""

    cx, cy = width / 2, height / 2
    max_radius = min(cx, cy) * 0.9
    total = max(len(links), 1)

    for i, link in enumerate(links):
        angle = math.radians(i * 15)
        radius = max_radius * (i + 1) / total
        x = cx + math.cos(angle) * radius
        y = cy + math.sin(angle) * radius
        color = hash_color(link, palette)
        size = 8 + (i % 7)
        draw.ellipse([(x - size, y - size), (x + size, y + size)], fill=color + (200,))


def generate_art(
    source: Path, width: int, height: int, palette: list[tuple[int, int, int]]
) -> Image.Image:
    """Create the visionary artwork based on links from ``source``."""

    with source.open("r", encoding="utf-8") as fh:
        data = json.load(fh)
    links = list(collect_links(data))

    image = Image.new("RGBA", (width, height))
    draw = ImageDraw.Draw(image, "RGBA")

    # Background gradient
    paint_gradient(draw, width, height, palette)

    # Spiraling link orbs
    draw_links(draw, links, width, height, palette)

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
    parser.add_argument(
        "--palette",
        type=Path,
        default=Path("data/palette.json"),
        help="Palette JSON file to define scene colors",
    )
    args = parser.parse_args()

    palette = load_palette(args.palette)
    art = generate_art(args.source, args.width, args.height, palette)
    art.save(args.output)
    print(f"Art saved to {args.output.resolve()}")


if __name__ == "__main__":
    main()
