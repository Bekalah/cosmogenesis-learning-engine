"""Reusable Enochian grid and planetary sigil overlays."""

from __future__ import annotations

from typing import List, Tuple
from PIL import ImageDraw, ImageFont, ImageColor
import math

# Planetary symbols and their angelic counterparts
PLANETARY_SIGILS: List[Tuple[str, str]] = [
    ("\u2609", "Michael"),  # Sun
    ("\u263D", "Gabriel"),  # Moon
    ("\u263F", "Raphael"),  # Mercury
    ("\u2640", "Anael"),    # Venus
    ("\u2642", "Samael"),   # Mars
    ("\u2643", "Zadkiel"),  # Jupiter
    ("\u2644", "Cassiel"),  # Saturn
]


def hex_to_rgba(color: str, alpha: int = 255) -> tuple[int, int, int, int]:
    """Convert a hex color to an RGBA tuple."""

    r, g, b = ImageColor.getrgb(color)
    return (r, g, b, alpha)


def draw_enochian_grid(draw: ImageDraw.ImageDraw, width: int, height: int) -> None:
    """Overlay a translucent Enochian magic square."""

    grid_size = min(width, height) * 0.6
    cx, cy = width / 2, height / 2
    top_left = (cx - grid_size / 2, cy - grid_size / 2)
    cell = grid_size / 4
    grid_color = hex_to_rgba("#FFFFFF", 40)

    # Draw 4x4 grid
    for i in range(5):
        x = top_left[0] + i * cell
        y = top_left[1] + i * cell
        draw.line([(x, top_left[1]), (x, top_left[1] + grid_size)], fill=grid_color, width=2)
        draw.line([(top_left[0], y), (top_left[0] + grid_size, y)], fill=grid_color, width=2)

    # Populate with Enochian letters (Unicode range U+1F700)
    try:
        font = ImageFont.truetype("DejaVuSans.ttf", int(cell * 0.5))
    except OSError:
        font = ImageFont.load_default()

    letters = [chr(cp) for cp in range(0x1F700, 0x1F700 + 16)]
    idx = 0
    for row in range(4):
        for col in range(4):
            x = top_left[0] + col * cell + cell / 2
            y = top_left[1] + row * cell + cell / 2
            glyph = letters[idx % len(letters)]
            bbox = draw.textbbox((0, 0), glyph, font=font)
            w = bbox[2] - bbox[0]
            h = bbox[3] - bbox[1]
            draw.text((x - w / 2, y - h / 2), glyph, fill=grid_color, font=font)
            idx += 1


def draw_celestial_sigils(draw: ImageDraw.ImageDraw, width: int, height: int) -> None:
    """Draw planetary symbols with their angelic counterparts."""

    try:
        planet_font = ImageFont.truetype("DejaVuSans.ttf", 80)
        angel_font = ImageFont.truetype("DejaVuSans.ttf", 32)
    except OSError:
        planet_font = ImageFont.load_default()
        angel_font = ImageFont.load_default()

    cx, cy = width / 2, height / 2
    radius = min(cx, cy) * 0.65

    for idx, (symbol, angel) in enumerate(PLANETARY_SIGILS):
        angle = (idx / len(PLANETARY_SIGILS)) * 2 * math.pi - math.pi / 2
        sx = cx + math.cos(angle) * radius
        sy = cy + math.sin(angle) * radius

        # Draw planetary symbol
        bbox = draw.textbbox((0, 0), symbol, font=planet_font)
        w = bbox[2] - bbox[0]
        h = bbox[3] - bbox[1]
        draw.text((sx - w / 2, sy - h / 2), symbol, fill="white", font=planet_font)

        # Label with angelic name slightly outward
        ax = cx + math.cos(angle) * (radius + h)
        ay = cy + math.sin(angle) * (radius + h)
        bbox = draw.textbbox((0, 0), angel, font=angel_font)
        w = bbox[2] - bbox[0]
        h = bbox[3] - bbox[1]
        draw.text((ax - w / 2, ay - h / 2), angel, fill="white", font=angel_font)

