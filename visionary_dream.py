"""Visionary Dream Generator.

Render a spiral artwork using real-world case studies. The script offers
multiple color palettes (vivid, calm, contrast) inspired by Alex Grey,
surrealism, and accessible design. Output is saved as "Visionary_Dream.png".
"""

import argparse
import math
from pathlib import Path
from typing import List

from PIL import Image, ImageDraw, ImageColor

# Define color palettes inspired by psychedelic and surrealist aesthetics
PALETTES = {
    "vivid": ["#ff0f7b", "#ff6f1e", "#ffd300", "#34e89e", "#00c3ff", "#8b00ff"],
    "calm": ["#1b2a49", "#476072", "#4f8a8b", "#f5f1da", "#c8d5b9"],
    "contrast": ["#000000", "#ffffff", "#ff0054", "#0aff99", "#00bbf9"]
}


def parse_size(size: str) -> tuple[int, int]:
    """Parse a WIDTHxHEIGHT string into integers."""
    width, height = size.lower().split("x")
    return int(width), int(height)


def radial_gradient(draw: ImageDraw.ImageDraw, width: int, height: int, colors: List[str]) -> None:
    """Paint a radial gradient background using the provided colors."""
    cx, cy = width // 2, height // 2
    max_radius = int(math.hypot(cx, cy))
    steps = max_radius
    palette_steps = len(colors) - 1
    for r in range(steps, 0, -1):
        t = r / steps
        idx = int(t * palette_steps)
        c1 = ImageColor.getrgb(colors[idx])
        c2 = ImageColor.getrgb(colors[min(idx + 1, palette_steps)])
        interp = tuple(int(c1[i] + (c2[i] - c1[i]) * (t * palette_steps - idx)) for i in range(3))
        bbox = [cx - r, cy - r, cx + r, cy + r]
        draw.ellipse(bbox, fill=interp)


def phyllotaxis(draw: ImageDraw.ImageDraw, width: int, height: int, palette: List[str]) -> None:
    """Render mirrored phyllotaxis pattern to evoke visionary symmetry."""
    cx, cy = width // 2, height // 2
    n_points = 1200
    golden_angle = math.pi * (3 - math.sqrt(5))
    max_radius = min(cx, cy) * 0.95
    for i in range(n_points):
        angle = i * golden_angle
        radius = max_radius * math.sqrt(i / n_points)
        x = cx + radius * math.cos(angle)
        y = cy + radius * math.sin(angle)
        color = palette[i % len(palette)]
        size = int(2 + 4 * i / n_points)
        bbox1 = [x - size, y - size, x + size, y + size]
        bbox2 = [2 * cx - x - size, y - size, 2 * cx - x + size, y + size]
        draw.ellipse(bbox1, fill=color)
        draw.ellipse(bbox2, fill=color)


def main() -> None:
    """Parse arguments and orchestrate artwork generation."""
    parser = argparse.ArgumentParser(description="Generate visionary spiral art.")
    parser.add_argument("--palette", choices=PALETTES.keys(), default="vivid",
                        help="Color palette to use")
    parser.add_argument("--size", default="1920x1080",
                        help="Resolution as WIDTHxHEIGHT")
    parser.add_argument("--output", default="Visionary_Dream.png",
                        help="Output image filename")
    args = parser.parse_args()

    width, height = parse_size(args.size)
    palette = PALETTES[args.palette]

    # Create image canvas
    image = Image.new("RGB", (width, height))
    draw = ImageDraw.Draw(image, "RGBA")

    # Apply gradient background using first and last palette colors
    gradient_colors = [palette[0], palette[-1]]
    radial_gradient(draw, width, height, gradient_colors)

    # Draw spiral pattern with symmetry
    phyllotaxis(draw, width, height, palette)

    # Save result
    output_path = Path(args.output)
    image.save(output_path)
    print(f"Artwork saved to {output_path}")


if __name__ == "__main__":
    main()
