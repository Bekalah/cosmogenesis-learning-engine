"""Monad Vision Generator.

Creates a museum-quality piece of visionary art inspired by Alex Grey.
The image is rendered at 2048x2048 resolution and saved to a
timestamped "Visionary_Dream_YYYYMMDD_HHMMSS.png" file.

The image is rendered at 2048x2048 resolution and saved as
"Visionary_Dream.png".
"""

# Imports and setup ---------------------------------------------------------
from __future__ import annotations

import math
import random
from pathlib import Path
from datetime import datetime


from PIL import Image, ImageDraw

# Canvas configuration ------------------------------------------------------
WIDTH, HEIGHT = 2048, 2048

# Color palette inspired by Alex Grey --------------------------------------
PALETTE = [
    "#002b36",  # Deep space
    "#073642",  # Dark teal
    "#268bd2",  # Electric blue
    "#b58900",  # Solar amber
    "#cb4b16",  # Vermilion
    "#6c71c4",  # Spirit purple
    "#dc322f",  # Cosmic red
]


def background_gradient(draw: ImageDraw.ImageDraw) -> None:
    """Create radial gradient background."""

    cx, cy = WIDTH / 2, HEIGHT / 2
    max_radius = math.hypot(cx, cy)
    for r in range(int(max_radius), 0, -1):
        ratio = r / max_radius
        red = int(0 * ratio + 7 * (1 - ratio))
        green = int(43 * ratio + 54 * (1 - ratio))
        blue = int(54 * ratio + 66 * (1 - ratio))
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(red, green, blue))


def monad_patterns(draw: ImageDraw.ImageDraw) -> None:
    """Render concentric circles and mirrored arcs."""

    cx, cy = WIDTH / 2, HEIGHT / 2

    # Concentric circles
    for i in range(32):
        radius = (i + 1) * (WIDTH / 64)
        color = PALETTE[i % len(PALETTE)]
        draw.ellipse(
            [cx - radius, cy - radius, cx + radius, cy + radius],
            outline=color,
            width=3,
        )

    # Mirrored arcs for nodal connections
    for i in range(64):
        angle = math.radians(i * 5)
        radius = WIDTH / 3 + i * 5
        x = cx + math.cos(angle) * radius
        y = cy + math.sin(angle) * radius
        size = 20 + (i % 7) * 5
        color = random.choice(PALETTE)
        draw.arc([x - size, y - size, x + size, y + size], 0, 360, fill=color, width=2)
        draw.arc(
            [2 * cx - x - size, 2 * cy - y - size, 2 * cx - x + size, 2 * cy - y + size],
            0,
            360,
            fill=color,
            width=2,
        )


def main() -> None:
    """Generate the artwork and save to disk."""

    image = Image.new("RGB", (WIDTH, HEIGHT), PALETTE[0])
    draw = ImageDraw.Draw(image)

    background_gradient(draw)
    monad_patterns(draw)

    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output = Path(f"Visionary_Dream_{stamp}.png")

    image.save(output)
    print(f"Art saved to {output.resolve()}")


if __name__ == "__main__":
    main()
