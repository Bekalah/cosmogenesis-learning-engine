#!/usr/bin/env python3
"""Visionary Dream Generator.

Creates a museum-quality piece of visionary art with elemental textures
and an Alex Grey–inspired palette. The final image is saved as
"Visionary_Dream.png".
"""

# Imports and setup ---------------------------------------------------------
import argparse
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter


# Element color palette: fire, water, earth, air -----------------------------
PALETTE = np.array(
    [
        [255, 80, 0],    # Fiery reds
        [30, 144, 255],  # Aquatic blues
        [34, 139, 34],   # Verdant greens
        [224, 255, 255], # Ethereal whites
    ],
    dtype=np.float32,
)


def smooth_noise(width: int, height: int, seed: np.random.SeedSequence) -> np.ndarray:
    """Generate a blurred noise layer for organic textures."""

    rng = np.random.default_rng(seed)
    arr = rng.random((height, width), dtype=np.float32)
    img = Image.fromarray((arr * 255).astype(np.uint8))
    img = img.filter(ImageFilter.GaussianBlur(radius=8))
    return np.array(img, dtype=np.float32) / 255.0


def generate_layers(width: int, height: int) -> np.ndarray:
    """Create normalized noise layers for each element."""

    seeds = np.random.SeedSequence().spawn(4)
    layers = [smooth_noise(width, height, s) for s in seeds]
    stack = np.stack(layers)
    norm = stack.sum(axis=0, keepdims=True)
    norm[norm == 0] = 1
    return stack / norm


def compose_image(width: int, height: int) -> Image.Image:
    """Blend elemental layers and overlay mandala rings."""

    weights = generate_layers(width, height)
    pixels = (
        weights[..., None] * PALETTE[:, None, None, :]
    ).sum(axis=0).astype(np.uint8)
    image = Image.fromarray(pixels, "RGB")
    draw = ImageDraw.Draw(image, "RGBA")

    # Mandala symmetry rings
    cx, cy = width // 2, height // 2
    max_r = min(cx, cy)
    for r in range(60, max_r, 60):
        alpha = int(120 * (1 - r / max_r))
        draw.ellipse((cx - r, cy - r, cx + r, cy + r),
                     outline=(255, 255, 255, alpha), width=3)

    return image


def main() -> None:
    """Parse CLI arguments and render the artwork."""

    parser = argparse.ArgumentParser(
        description="Create elemental visionary art with Pillow."
    )
    parser.add_argument("--width", type=int, default=1024, help="Image width")
    parser.add_argument("--height", type=int, default=1024, help="Image height")
    parser.add_argument(
        "--output", type=Path, default=Path("Visionary_Dream.png"),
        help="Output image path",
    )
    args = parser.parse_args()

    art = compose_image(args.width, args.height)
    art.save(args.output)
    print(f"Art saved to {args.output.resolve()}")


if __name__ == "__main__":
    main()

