"""Visionary Asset Collage

Combines provided art assets into a surreal mandala. The piece uses a
color palette inspired by Alex Grey and surrealism. The final image is
rendered at 4096x4096 resolution and saved as ``Visionary_Dream.png``.
"""

# Imports and setup ---------------------------------------------------------
from __future__ import annotations

from pathlib import Path
from typing import List

from PIL import Image, ImageOps, ImageEnhance, ImageDraw

# Color palette inspired by Alex Grey & surrealism -------------------------
PALETTE: List[str] = [
    "#2B0A3D",  # Deep Violet
    "#45207D",  # Electric Indigo
    "#3384FF",  # Luminous Azure
    "#00FFA3",  # Neon Turquoise
    "#FFD452",  # Radiant Gold
    "#FFF8E7",  # Ethereal White
]

# Art asset file paths ------------------------------------------------------
ASSET_FILES: List[str] = [
    "assets/sacred_sphere.png",
    "assets/alchemical_table.png",
    "assets/visionary_body.png",
    "assets/dragon_circle.png",
    "assets/rose_venus.png",
]

WIDTH, HEIGHT = 4096, 4096


def load_assets() -> List[Image.Image]:
    """Load all existing asset images."""

    images: List[Image.Image] = []
    for file in ASSET_FILES:
        path = Path(file)
        if path.exists():
            img = Image.open(path).convert("RGBA")
            images.append(img)
    return images


def composite_assets(canvas: Image.Image, assets: List[Image.Image]) -> None:
    """Layer assets with rotational symmetry."""

    for index, img in enumerate(assets):
        # Fit asset within the canvas
        img = ImageOps.contain(img, (WIDTH, HEIGHT))

        # Rotate for radial symmetry
        img = img.rotate(index * (360 / max(len(assets), 1)), expand=True)

        # Boost color intensity for visionary glow
        img = ImageEnhance.Color(img).enhance(1.4)

        # Center and merge
        x = (WIDTH - img.width) // 2
        y = (HEIGHT - img.height) // 2
        canvas.alpha_composite(img, (x, y))


def add_geometric_overlay(canvas: Image.Image) -> None:
    """Overlay concentric circles using the palette."""

    draw = ImageDraw.Draw(canvas, "RGBA")
    cx, cy = WIDTH // 2, HEIGHT // 2
    max_radius = min(cx, cy)

    for i in range(0, max_radius, 40):
        color = PALETTE[i // 40 % len(PALETTE)] + "40"  # add alpha
        draw.ellipse([(cx - i, cy - i), (cx + i, cy + i)], outline=color, width=3)


def main() -> None:
    """Generate the visionary collage."""

    canvas = Image.new("RGBA", (WIDTH, HEIGHT), "black")
    assets = load_assets()
    composite_assets(canvas, assets)
    add_geometric_overlay(canvas)
    canvas.save("Visionary_Dream.png")
    print("Art saved to Visionary_Dream.png")


if __name__ == "__main__":
    main()
