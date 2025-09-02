#!/usr/bin/env python3
"""Generate visionary fractal art for the Cosmogenesis Learning Engine.

This script pays homage to transcendental artists while honoring neurodivergent
sensibilities. It renders a Julia-set variant with an Alex Grey-inspired
palette and saves the result as ``Visionary_Dream.png``.
"""

import argparse
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap


def generate_fractal(width: int, height: int, filename: str) -> None:
    """Create and save a visionary fractal image.

    Args:
        width: Width of the output image in pixels.
        height: Height of the output image in pixels.
        filename: Path to save the resulting PNG image.
    """

    # --- Forge the complex plane ---
    x = np.linspace(-1.8, 1.8, width)
    y = np.linspace(-1.0, 1.0, height)
    X, Y = np.meshgrid(x, y)
    Z = X + 1j * Y

    # --- Cast the esoteric seed constant ---
    C = np.exp(1j * np.pi / 4) * 0.7885

    # --- Iterate the alchemical map ---
    iterations = 300
    escape_radius = 12
    M = np.zeros((height, width))
    for i in range(iterations):
        Z = np.sin(Z * C) + C
        mask = (M == 0) & (np.abs(Z) > escape_radius)
        M[mask] = i

    # --- Visionary palette inspired by Alex Grey ---
    colors = [
        "#000000",  # cosmic void
        "#1a0d3a",  # deep violet
        "#3b0d66",  # indigo
        "#3454d1",  # electric cobalt
        "#845ec2",  # mystic purple
        "#ff6f91",  # rose alchemy
        "#ffc75f",  # solar gold
        "#f9f871",  # enlightenment glow
    ]
    cmap = LinearSegmentedColormap.from_list("visionary", colors, N=512)

    # --- Render and save the dreamscape ---
    plt.figure(figsize=(width / 100, height / 100), dpi=100)
    plt.imshow(M, cmap=cmap, extent=[-1.8, 1.8, -1.0, 1.0])
    plt.axis("off")
    plt.savefig(filename, bbox_inches="tight", pad_inches=0)
    plt.close()


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate visionary fractal art")
    parser.add_argument("--width", type=int, default=1920, help="image width in pixels")
    parser.add_argument("--height", type=int, default=1080, help="image height in pixels")
    parser.add_argument("--output", default="Visionary_Dream.png", help="output PNG filename")
    args = parser.parse_args()

    generate_fractal(args.width, args.height, args.output)


if __name__ == "__main__":
    main()
