"""Create a visionary collage of Kabbalah and Hermetic symbols.

The script renders a Tree of Life surrounded by hermetic geometry using a
color palette inspired by Alex Grey. The output is saved as
``Visionary_Dream.png``.
"""

#!/usr/bin/env python3

from __future__ import annotations

# Imports and setup ---------------------------------------------------------
import math
from pathlib import Path
from typing import List, Tuple

from PIL import Image, ImageDraw, ImageColor

# Color palette inspired by Alex Grey ---------------------------------------
PALETTE: List[str] = [
    "#260046",  # Deep Cosmic Violet
    "#4B0082",  # Electric Indigo
    "#0080FF",  # Luminous Blue
    "#00FF99",  # Neon Green
    "#FFD700",  # Radiant Gold
    "#FFFFFF",  # Pure White
]

WIDTH, HEIGHT = 1920, 1080


def linear_gradient(start: str, end: str, t: float) -> Tuple[int, int, int]:
    """Interpolate between two hex colors."""

    r1, g1, b1 = ImageColor.getrgb(start)
    r2, g2, b2 = ImageColor.getrgb(end)
    r = int(r1 + (r2 - r1) * t)
    g = int(g1 + (g2 - g1) * t)
    b = int(b1 + (b2 - b1) * t)
    return r, g, b


def paint_gradient(draw: ImageDraw.ImageDraw) -> None:
    """Fill background with vertical gradient across the palette."""

    segments = len(PALETTE) - 1
    for y in range(HEIGHT):
        pos = y / (HEIGHT - 1)
        idx = min(int(pos * segments), segments - 1)
        t = pos * segments - idx
        color = linear_gradient(PALETTE[idx], PALETTE[idx + 1], t)
        draw.line([(0, y), (WIDTH, y)], fill=color)


def draw_tree_of_life(draw: ImageDraw.ImageDraw) -> None:
    """Render the ten sefirot and the twenty-two connecting paths."""

    # Predefined positions for sefirot as relative coordinates
    positions = [
        (0.5, 0.05),  # Keter
        (0.35, 0.15), (0.65, 0.15),  # Chokhmah, Binah
        (0.2, 0.35), (0.5, 0.30), (0.8, 0.35),  # Chesed, Tiferet, Gevurah
        (0.2, 0.55), (0.5, 0.60), (0.8, 0.55),  # Netzach, Yesod, Hod
        (0.5, 0.85),  # Malkuth
    ]

    # Convert to pixel coordinates
    coords = [(int(x * WIDTH), int(y * HEIGHT)) for x, y in positions]

    # Draw connecting paths
    path_pairs = [
        (0, 1), (0, 2), (1, 4), (2, 4),
        (1, 3), (2, 5), (3, 4), (4, 5),
        (3, 6), (4, 7), (5, 8),
        (6, 7), (7, 8), (6, 9), (8, 9),
    ]
    for a, b in path_pairs:
        draw.line([coords[a], coords[b]], fill=PALETTE[3], width=4)

    # Draw sefirot
    for cx, cy in coords:
        r = 30
        draw.ellipse([(cx - r, cy - r), (cx + r, cy + r)], outline=PALETTE[4], width=4)
        draw.ellipse([(cx - r + 8, cy - r + 8), (cx + r - 8, cy + r - 8)], fill=PALETTE[5])


def draw_hermetic_star(draw: ImageDraw.ImageDraw) -> None:
    """Overlay a radiant hermetic star (hexagram within a circle)."""

    cx, cy = WIDTH // 2, HEIGHT // 2
    radius = min(cx, cy) * 0.9

    # Outer circle
    draw.ellipse([(cx - radius, cy - radius), (cx + radius, cy + radius)], outline=PALETTE[4], width=3)

    # Hexagram
    angles = [math.radians(60 * i - 30) for i in range(6)]
    points = [(cx + math.cos(a) * radius * 0.8, cy + math.sin(a) * radius * 0.8) for a in angles]
    for i in range(6):
        draw.line([points[i], points[(i + 2) % 6]], fill=PALETTE[1], width=3)


def generate_art() -> Image.Image:
    """Create the visionary artwork and return the image."""

    image = Image.new("RGB", (WIDTH, HEIGHT), "black")
    draw = ImageDraw.Draw(image)

    # Background gradient
    paint_gradient(draw)

    # Tree of Life centerpiece
    draw_tree_of_life(draw)

    # Hermetic geometry overlay
    draw_hermetic_star(draw)

    return image


def main() -> None:
    """Render the artwork and save the image."""

    output = Path("Visionary_Dream.png")
    art = generate_art()
    art.save(output)
    print(f"Art saved to {output.resolve()}")


if __name__ == "__main__":
    main()
