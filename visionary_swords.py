
#!/usr/bin/env python3
"""Visionary Swords Generator.

Creates a museum-quality piece of visionary art inspired by the Swords suit of the
Minor Arcana using an indigo-silver storm palette. The image is rendered at
1920x1080 resolution and saved as "Visionary_Dream.png".
=======
"""Swords Suit Visionary Art Generator.

Creates a museum-quality piece inspired by the Swords suit of the Minor Arcana.
Rendered at 1920x1080 and saved as "Visionary_Dream.png".


from __future__ import annotations

"""

from __future__ import annotations


import math


import random
from pathlib import Path

from PIL import Image, ImageDraw

WIDTH, HEIGHT = 1920, 1080
OUTPUT = Path("Visionary_Dream.png")

PALETTE = [
    "#1A237E",  # Deep Indigo
    "#283593",  # Storm Blue
    "#B0BEC5",  # Cloud Gray
    "#C0C0C0",  # Bright Silver
    "#000000",  # Raven Black
]

def blend_background(draw: ImageDraw.ImageDraw) -> None:
    """Fill background with a vertical indigo-to-silver gradient."""
    for y in range(HEIGHT):
        t = y / HEIGHT
        r = int(26 * (1 - t) + 192 * t)
        g = int(35 * (1 - t) + 192 * t)
        b = int(126 * (1 - t) + 192 * t)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))

def draw_lightning(draw: ImageDraw.ImageDraw, bolts: int = 5) -> None:
    """Render jagged lightning bolts as shining swords."""
    for _ in range(bolts):
        x = random.randint(0, WIDTH)
        y = 0
        points = [(x, y)]
        while y < HEIGHT:
            x += random.randint(-20, 20)
            y += random.randint(20, 40)
            points.append((x, y))
        draw.line(points, fill=PALETTE[3], width=3)

def draw_swords(draw: ImageDraw.ImageDraw) -> None:
    """Draw central crossed swords."""
    cx, cy = WIDTH // 2, HEIGHT // 2
    length = 300

    draw.line([(cx - 60, cy + length), (cx - 60, cy - length)], fill=PALETTE[3], width=4)
    draw.rectangle([(cx - 80, cy - 20), (cx - 40, cy)], fill=PALETTE[3])


    draw.line([(cx - 60, cy + length), (cx - 60, cy - length)], fill=PALETTE[3], width=4)
    draw.rectangle([(cx - 80, cy - 20), (cx - 40, cy)], fill=PALETTE[3])

    draw.line([(cx - 60, cy + length), (cx - 60, cy - length)], fill=PALETTE[3], width=4)
    draw.rectangle([(cx - 80, cy - 20), (cx - 40, cy)], fill=PALETTE[3])

    draw.line([(cx + 60, cy + length), (cx + 60, cy - length)], fill=PALETTE[3], width=4)
    draw.rectangle([(cx + 40, cy - 20), (cx + 80, cy)], fill=PALETTE[3])

def draw_ravens(draw: ImageDraw.ImageDraw, count: int = 7) -> None:
    """Scatter raven silhouettes across the sky."""
    for _ in range(count):
        x = random.randint(0, WIDTH)
        y = random.randint(0, HEIGHT // 2)
        size = random.randint(10, 20)
        draw.line([(x - size, y), (x, y - size)], fill=PALETTE[4], width=2)
        draw.line([(x, y - size), (x + size, y)], fill=PALETTE[4], width=2)

def main() -> None:
    """Generate the artwork and save to disk."""
    image = Image.new("RGB", (WIDTH, HEIGHT), PALETTE[0])
    draw = ImageDraw.Draw(image)
    blend_background(draw)
    draw_lightning(draw)
    draw_swords(draw)
    draw_ravens(draw)


    image.save(OUTPUT)

    output = Path("Visionary_Dream.png")
    image.save(output)
    print(f"Art saved to {output.resolve()}")

if __name__ == "__main__":
    main()
