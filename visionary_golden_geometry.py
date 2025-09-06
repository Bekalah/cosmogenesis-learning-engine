"""Golden Geometry Visionary Art Generator.

Creates museum-quality visionary art using the golden ratio,
sacred geometry, and elemental glyphs. Palette draws
inspiration from Andrew Gonzalez and Emma Kunz.
"""

import argparse
import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageColor

from enochian_layers import draw_enochian_grid, draw_celestial_sigils

# Color palette inspired by visionary artists
PALETTE = {
    "background": "#0e0d0d",
    "spiral": "#d4af37",  # alchemical gold
    "fire": "#ff4500",    # fire glyph
    "water": "#1e90ff",   # water glyph
    "air": "#f5f5f5",     # air glyph
    "earth": "#228b22",   # earth glyph
    "aether": "#9370db",  # spirit glyph
}

PHI = (1 + math.sqrt(5)) / 2  # golden ratio


# ---------------------------------------------------------------------------
# Gradient background
# ---------------------------------------------------------------------------
def radial_gradient(img: Image.Image, inner: str, outer: str) -> None:
    """Fill the image with a radial gradient."""
    width, height = img.size
    cx, cy = width / 2, height / 2
    max_radius = math.hypot(cx, cy)
    inner_rgb = ImageColor.getrgb(inner)
    outer_rgb = ImageColor.getrgb(outer)
    draw = ImageDraw.Draw(img)
    for r in range(int(max_radius), 0, -1):
        t = r / max_radius
        color = tuple(
            int(inner_rgb[i] * t + outer_rgb[i] * (1 - t)) for i in range(3)
        )
        bbox = [cx - r, cy - r, cx + r, cy + r]
        draw.ellipse(bbox, fill=color)


# ---------------------------------------------------------------------------
# Golden spiral rendering
# ---------------------------------------------------------------------------
def draw_golden_spiral(draw: ImageDraw.ImageDraw, center: tuple[int, int], color: str) -> None:
    """Render a golden spiral seeded at the canvas center."""
    theta = 0.0
    radius = 2.0
    max_dim = max(draw.im.size)
    color_rgba = ImageColor.getrgb(color) + (255,)
    while radius < max_dim:
        x = center[0] + radius * math.cos(theta)
        y = center[1] + radius * math.sin(theta)
        draw.ellipse((x - 2, y - 2, x + 2, y + 2), fill=color_rgba)
        theta += 0.05
        radius *= PHI ** (0.05 / (2 * math.pi))


# ---------------------------------------------------------------------------
# Elemental glyphs (classical alchemical symbols)
# ---------------------------------------------------------------------------
def draw_elemental_glyphs(draw: ImageDraw.ImageDraw, center: tuple[int, int], size: int) -> None:
    """Place elemental glyphs around the center using golden spacing."""
    half = size / 2
    # Fire – upward triangle
    fire = [
        (center[0], center[1] - size),
        (center[0] - half, center[1] - half),
        (center[0] + half, center[1] - half),
    ]
    draw.polygon(fire, outline=PALETTE["fire"], width=3)

    # Water – downward triangle
    water = [
        (center[0], center[1] + size),
        (center[0] - half, center[1] + half),
        (center[0] + half, center[1] + half),
    ]
    draw.polygon(water, outline=PALETTE["water"], width=3)

    # Air – upward triangle with a horizontal line
    air = [
        (center[0] + size, center[1]),
        (center[0] + half, center[1] + half),
        (center[0] + half, center[1] - half),
    ]
    draw.polygon(air, outline=PALETTE["air"], width=3)
    draw.line(
        [(center[0] + half, center[1]), (center[0] + size, center[1])],
        fill=PALETTE["air"],
        width=3,
    )

    # Earth – downward triangle with a horizontal line
    earth_center = (center[0] - size, center[1])
    earth = [
        (earth_center[0], earth_center[1] + size),
        (earth_center[0] - half, earth_center[1] + half),
        (earth_center[0] + half, earth_center[1] + half),
    ]
    draw.polygon(earth, outline=PALETTE["earth"], width=3)
    draw.line(
        [
            (earth_center[0] - half, earth_center[1] + half),
            (earth_center[0] + half, earth_center[1] + half),
        ],
        fill=PALETTE["earth"],
        width=3,
    )

    # Earth – square with a cross
    left = center[0] - size
    top = center[1] - half
    right = center[0] - half
    bottom = center[1] + half
    draw.rectangle([left, top, right, bottom], outline=PALETTE["earth"], width=3)
    draw.line([(left, center[1]), (right, center[1])], fill=PALETTE["earth"], width=3)
    draw.line(
        [(center[0] - 0.75 * size, top), (center[0] - 0.75 * size, bottom)],
        fill=PALETTE["earth"],
        width=3,
    )

    # Aether – circle at the center
    r = half
    draw.ellipse(
        [center[0] - r, center[1] - r, center[0] + r, center[1] + r],
        outline=PALETTE["aether"],
        width=3,
    )


# ---------------------------------------------------------------------------
# Main orchestration
# ---------------------------------------------------------------------------
def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate golden ratio visionary art with elemental glyphs."
    )
    parser.add_argument("--width", type=int, default=1920)
    parser.add_argument("--height", type=int, default=1080)
    parser.add_argument("--output", default="Visionary_Dream.png")
    args = parser.parse_args()

    img = Image.new("RGB", (args.width, args.height), PALETTE["background"])
    radial_gradient(img, PALETTE["background"], "#1c1b1b")

    draw = ImageDraw.Draw(img, "RGBA")
    center = (args.width // 2, args.height // 2)

    draw_golden_spiral(draw, center, PALETTE["spiral"])
    glyph_size = int(min(args.width, args.height) / (PHI * 3))
    draw_elemental_glyphs(draw, center, glyph_size)

    # Mystical overlays reused across Python generators
    draw_enochian_grid(draw, args.width, args.height)
    draw_celestial_sigils(draw, args.width, args.height)

    img.save(args.output)
    print(f"Artwork saved to {Path(args.output).resolve()}")


if __name__ == "__main__":
    main()
