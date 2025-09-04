"""Visionary Swords Generator

Creates a museum-quality piece of visionary art representing the
Minor Arcana Swords suit using indigo-silver storm palettes.
The image is rendered at 2048x2048 and saved as ``Visionary_Dream.png``.
"""

#!/usr/bin/env python3

# Imports and setup ---------------------------------------------------------
from __future__ import annotations

import random
import math
from pathlib import Path

from PIL import Image, ImageDraw


# Configuration --------------------------------------------------------------
WIDTH, HEIGHT = 2048, 2048
OUTPUT = Path("Visionary_Dream.png")

# Indigo-silver storm palette inspired by Splendor Solis --------------------
PALETTE = {
    "indigo": (37, 0, 90),       # deep indigo
    "silver": (192, 192, 192),   # metallic silver
    "storm": (70, 70, 90),       # stormy grey-blue
    "cloud": (230, 230, 240),    # soft cloud white
    "raven": (20, 20, 20),       # raven black
    "lightning": (220, 220, 255) # bright lightning
}


def draw_background(draw: ImageDraw.ImageDraw) -> None:
    """Paint a radial gradient background."""
    cx, cy = WIDTH // 2, HEIGHT // 2
    max_radius = math.hypot(cx, cy)
    for r in range(int(max_radius), 0, -1):
        t = r / max_radius
        # interpolate between indigo and storm grey
        color = tuple(
            int(PALETTE["storm"][i] * (1 - t) + PALETTE["indigo"][i] * t)
            for i in range(3)
        )
        draw.ellipse(
            [cx - r, cy - r, cx + r, cy + r],
            fill=color
        )


def draw_clouds(image: Image.Image) -> None:
    """Add semi-transparent cloud forms."""
    for _ in range(120):
        x = random.randint(0, WIDTH)
        y = random.randint(0, HEIGHT // 2)
        radius = random.randint(80, 240)
        alpha = random.randint(40, 90)
        cloud = Image.new("RGBA", (radius * 2, radius * 2), (0, 0, 0, 0))
        cdraw = ImageDraw.Draw(cloud)
        cdraw.ellipse(
            [0, 0, radius * 2, radius * 2],
            fill=PALETTE["cloud"] + (alpha,)
        )
        image.alpha_composite(cloud, (x - radius, y - radius))


def draw_lightning(draw: ImageDraw.ImageDraw) -> None:
    """Draw branching lightning from clouds to ground."""
    for _ in range(5):
        x = random.randint(0, WIDTH)
        y = 0
        segments = []
        for step in range(12):
            nx = x + random.randint(-80, 80)
            ny = y + random.randint(120, 200)
            segments.append((x, y, nx, ny))
            x, y = nx, ny
            if y > HEIGHT:
                break
        for seg in segments:
            draw.line(seg, fill=PALETTE["lightning"], width=4)


def draw_sword(draw: ImageDraw.ImageDraw, center: tuple[int, int], length: int) -> None:
    """Render a simplified sword acting as a lightning rod."""
    cx, cy = center
    blade_color = PALETTE["silver"]
    # Blade
    draw.line([(cx, cy - length // 2), (cx, cy + length // 2)], fill=blade_color, width=8)
    # Crossguard
    draw.line([(cx - length // 6, cy), (cx + length // 6, cy)], fill=blade_color, width=8)
    # Pommel
    draw.ellipse([(cx - 12, cy + length // 2 - 12), (cx + 12, cy + length // 2 + 12)], fill=blade_color)


def draw_swords(draw: ImageDraw.ImageDraw) -> None:
    """Place multiple swords along the canvas."""
    for _ in range(9):
        x = random.randint(200, WIDTH - 200)
        length = random.randint(600, 1000)
        draw_sword(draw, (x, HEIGHT - 200), length)


def draw_ravens(draw: ImageDraw.ImageDraw) -> None:
    """Sketch raven silhouettes in flight."""
    for _ in range(7):
        x = random.randint(100, WIDTH - 100)
        y = random.randint(200, HEIGHT // 2)
        size = random.randint(60, 120)
        # Body
        draw.ellipse([x - size // 6, y - size // 6, x + size // 6, y + size // 6], fill=PALETTE["raven"])
        # Wings
        wing_span = size
        draw.polygon([
            (x - wing_span, y),
            (x, y - size // 2),
            (x + wing_span, y),
            (x, y + size // 2)
        ], fill=PALETTE["raven"])


def main() -> None:
    """Generate the visionary Swords artwork."""
    image = Image.new("RGBA", (WIDTH, HEIGHT), PALETTE["indigo"])
    draw = ImageDraw.Draw(image, "RGBA")

    draw_background(draw)
    draw_clouds(image)
    draw_lightning(draw)
    draw_swords(draw)
    draw_ravens(draw)

    # Save final image
    image.save(OUTPUT)
    print(f"Saved {OUTPUT.resolve()}")


if __name__ == "__main__":
    main()
