"""Generate an ethereal visionary art mandala.

This script crafts a luminous, fractal mandala using a color palette inspired
by Hilma af Klint and Andrew Gonzalez. The rendered piece is saved as
``Visionary_Dream.png``.
"""

#!/usr/bin/env python3

from __future__ import annotations

# Imports and setup ---------------------------------------------------------
import argparse
from pathlib import Path

import numpy as np
from PIL import Image


# Ethereal color palette ----------------------------------------------------
# Palette draws from white light oracle tones and visionary art masters
PALETTE = np.array(
    [
        [255, 255, 255],  # Pure Light
        [245, 230, 170],  # Golden Halo
        [200, 170, 255],  # Violet Spirit
        [160, 210, 230],  # Aqua Dream
        [255, 190, 220],  # Rose Quartz Glow
    ],
    dtype=np.float32,
)


def radial_palette(r: np.ndarray) -> np.ndarray:
    """Interpolate the ethereal palette based on radial distance."""

    idx = r * (len(PALETTE) - 1)
    i = np.clip(idx.astype(int), 0, len(PALETTE) - 2)
    t = (idx - i)[..., None]
    return PALETTE[i] * (1 - t) + PALETTE[i + 1] * t


def generate_art(width: int, height: int) -> Image.Image:
    """Compose the visionary artwork and return the image."""

    # Coordinate grid normalized to [-1, 1]
    x = np.linspace(-1, 1, width)
    y = np.linspace(-1, 1, height)
    X, Y = np.meshgrid(x, y)
    r = np.sqrt(X**2 + Y**2)
    theta = np.arctan2(Y, X)

    # Fractal harmonic wave -------------------------------------------------
    wave = np.sin(6 * theta + np.cos(12 * r)) + np.cos(4 * theta)

    # Mandala symmetry ------------------------------------------------------
    wave = (wave + wave[:, ::-1] + wave[::-1, :] + wave[::-1, ::-1]) / 4
    wave = (wave - wave.min()) / (wave.max() - wave.min())

    # Radial gradient background -------------------------------------------
    base = radial_palette(np.clip(r, 0, 1))

    # Blend harmonic wave into base palette --------------------------------
    img = np.clip(base + wave[..., None] * 80, 0, 255).astype(np.uint8)

    return Image.fromarray(img)


# CLI ----------------------------------------------------------------------
def main() -> None:
    """Parse command-line arguments and render the artwork."""

    parser = argparse.ArgumentParser(description="Create ethereal visionary art")
    parser.add_argument("--width", type=int, default=1920, help="Image width")
    parser.add_argument("--height", type=int, default=1080, help="Image height")
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("Visionary_Dream.png"),
        help="Output image file",
    )
    args = parser.parse_args()

    art = generate_art(args.width, args.height)
    art.save(args.output)
    print(f"Artwork saved to {args.output.resolve()}")


if __name__ == "__main__":
    main()
