"""Visionary Codex: museum-quality kaleidoscopic mandala with Enochian overlays."""

from __future__ import annotations

import argparse
import math
import random
from pathlib import Path
from typing import List

from PIL import Image, ImageDraw, ImageColor

from enochian_layers import draw_enochian_grid, draw_celestial_sigils

# Color palette inspired by Alex Grey
PALETTE: List[str] = [
"""Visionary Codex: museum-quality kaleidoscopic mandala."""

# — Imports and sacred setup —
import math
import random
from pathlib import Path

from PIL import Image, ImageDraw

# — Canvas dimensions and center —
WIDTH, HEIGHT = 1920, 1080
CENTER = (WIDTH // 2, HEIGHT // 2)
MAX_RADIUS = min(CENTER)

# — Color palette inspired by Alex Grey —
PALETTE = [
    "#280050",  # Deep Indigo
    "#460082",  # Electric Violet
    "#0080FF",  # Luminous Blue
    "#00FF80",  # Auric Green
    "#FFC800",  # Golden Amber
    "#FFFFFF",  # Pure Light
    "#B7410E",  # Crimson Rose
    "#FFD700",  # Alchemical Gold
]


def generate_art(width: int, height: int) -> Image.Image:
    """Render the codex mandala and return the image."""

    random.seed(108)
    image = Image.new("RGBA", (width, height), PALETTE[0])
    draw = ImageDraw.Draw(image, "RGBA")

    # Vertical gradient background
    top = (40, 0, 80)
    bottom = (255, 200, 255)
    for y in range(height):
        ratio = y / height
        r = int(top[0] * (1 - ratio) + bottom[0] * ratio)
        g = int(top[1] * (1 - ratio) + bottom[1] * ratio)
        b = int(top[2] * (1 - ratio) + bottom[2] * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))

    cx, cy = width / 2, height / 2
    max_radius = min(cx, cy)

    # Radiate spiral constellations
    for step in range(720):
        angle = math.radians(step * 5)
        radius = (step / 720) * max_radius
        x = cx + radius * math.cos(angle)
        y = cy + radius * math.sin(angle)
        color = ImageColor.getrgb(random.choice(PALETTE)) + (255,)
        draw.ellipse([x - 3, y - 3, x + 3, y + 3], fill=color)

    # Enfold concentric auric rings
    for r in range(80, int(max_radius), 100):
        bbox = [cx - r, cy - r, cx + r, cy + r]
        draw.ellipse(bbox, outline=random.choice(PALETTE), width=4)

    # Imprint sacred star polygons
    for sides in range(5, 10):
        radius = max_radius * (sides / 12)
        points: List[tuple[float, float]] = []
        for i in range(sides * 2):
            angle = (math.pi * 2 / (sides * 2)) * i
            rad = radius if i % 2 == 0 else radius * 0.4
            x = cx + rad * math.cos(angle)
            y = cy + rad * math.sin(angle)
            points.append((x, y))
        draw.polygon(points, outline=random.choice(PALETTE), width=2)

    # Cast cross-quarter light beams
    for axis in range(8):
        angle = math.pi / 4 * axis
        x = cx + max_radius * math.cos(angle)
        y = cy + max_radius * math.sin(angle)
        draw.line([(cx, cy), (x, y)], fill=random.choice(PALETTE), width=3)

    # Mystical overlays
    draw_enochian_grid(draw, width, height)
    draw_celestial_sigils(draw, width, height)

    return image


def main() -> None:
    """CLI entry point for rendering the codex art."""

    parser = argparse.ArgumentParser(
        description="Render Codex 144:99 mandala with Enochian overlays."
    )
    parser.add_argument("--width", type=int, default=1920, help="image width")
    parser.add_argument("--height", type=int, default=1080, help="image height")
    parser.add_argument(
        "--output", type=Path, default=Path("Visionary_Dream.png"), help="output image path"
    )
    args = parser.parse_args()

    art = generate_art(args.width, args.height)
    art.save(args.output)
    print(f"Art saved to {args.output.resolve()}")


if __name__ == "__main__":
    main()
# — Seed the randomness for repeatable dreams —
random.seed(108)

# — Birth the canvas with a vertical gradient —
image = Image.new("RGB", (WIDTH, HEIGHT), PALETTE[0])
draw = ImageDraw.Draw(image)
for y in range(HEIGHT):
    ratio = y / HEIGHT
    top = (40, 0, 80)
    bottom = (255, 200, 255)
    r = int(top[0] * (1 - ratio) + bottom[0] * ratio)
    g = int(top[1] * (1 - ratio) + bottom[1] * ratio)
    b = int(top[2] * (1 - ratio) + bottom[2] * ratio)
    draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))

# — Radiate spiral constellations —
for step in range(720):
    angle = math.radians(step * 5)
    radius = (step / 720) * MAX_RADIUS
    x = CENTER[0] + radius * math.cos(angle)
    y = CENTER[1] + radius * math.sin(angle)
    color = random.choice(PALETTE)
    draw.ellipse([x - 3, y - 3, x + 3, y + 3], fill=color)

# — Enfold concentric auric rings —
for r in range(80, MAX_RADIUS, 100):
    bbox = [CENTER[0] - r, CENTER[1] - r, CENTER[0] + r, CENTER[1] + r]
    draw.ellipse(bbox, outline=random.choice(PALETTE), width=4)

# — Imprint sacred star polygons —
for sides in range(5, 10):
    radius = MAX_RADIUS * (sides / 12)
    points = []
    for i in range(sides * 2):
        angle = (math.pi * 2 / (sides * 2)) * i
        rad = radius if i % 2 == 0 else radius * 0.4
        x = CENTER[0] + rad * math.cos(angle)
        y = CENTER[1] + rad * math.sin(angle)
        points.append((x, y))
    draw.polygon(points, outline=random.choice(PALETTE), width=2)

# — Cast cross-quarter light beams —
for axis in range(8):
    angle = math.pi / 4 * axis
    x = CENTER[0] + MAX_RADIUS * math.cos(angle)
    y = CENTER[1] + MAX_RADIUS * math.sin(angle)
    draw.line([CENTER, (x, y)], fill=random.choice(PALETTE), width=3)

# — Save the visionary dream —
image.save(Path("Visionary_Dream.png"))

