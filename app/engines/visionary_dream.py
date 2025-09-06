#!/usr/bin/env python3
"""Generate an Alex Grey-inspired mandala image for cross-app use."""

# Import numerical and imaging libraries
from pathlib import Path
import numpy as np
from PIL import Image

# Resolution for square canvas
WIDTH, HEIGHT = 1024, 1024


def main() -> None:
    """Compose layered waves and save to assets/generated."""
    # Coordinate grid for polar mapping
    x = np.linspace(-1, 1, WIDTH)
    y = np.linspace(-1, 1, HEIGHT)
    xx, yy = np.meshgrid(x, y)
    r = np.sqrt(xx ** 2 + yy ** 2)
    theta = np.arctan2(yy, xx)

    # Psychedelic interference pattern
    pattern = (
        np.sin(12 * r + 6 * theta)
        + np.sin(8 * r - 7 * theta)
        + np.sin(5 * r + 15 * theta)
    )

    # Normalize to the [0, 1] range
    pattern = (pattern - pattern.min()) / (pattern.max() - pattern.min())

    # Alex Grey-influenced palette
    palette = np.array(
        [
            [20, 24, 82],   # deep indigo
            [45, 130, 200], # electric blue
            [190, 45, 150], # magenta aura
            [255, 200, 70], # golden halo
            [255, 80, 20],  # fiery orange
            [0, 220, 130],  # healing green
        ],
        dtype=np.uint8,
    )

    # Map pattern values to palette indices
    indices = (pattern * (len(palette) - 1)).astype(int)
    img_array = palette[indices]
    img = Image.fromarray(img_array, mode="RGB")

    # Save the final image into the app's generated assets
    out_dir = Path(__file__).resolve().parents[2] / "assets" / "generated"
    out_dir.mkdir(parents=True, exist_ok=True)
    img.save(out_dir / "Visionary_Dream.png")


if __name__ == "__main__":  # pragma: no cover - script entry point
    main()
