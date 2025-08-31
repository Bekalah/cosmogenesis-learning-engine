"""Visionary Dream Generator.

Create a spiral-based visionary artwork with customizable color palettes
inspired by Alex Grey or surrealism. The output is saved as
"Visionary_Dream.png".
"""

# Standard library imports
import argparse
import math
import random
from pathlib import Path

# Third-party library imports
from PIL import Image, ImageDraw, ImageColor


def hex_to_rgba(hex_color: str, alpha: int = 255) -> tuple:
    """Convert a hex color to an RGBA tuple."""
    r, g, b = ImageColor.getrgb(hex_color)
    return (r, g, b, alpha)


def generate_art(width: int, height: int, palette_name: str) -> Image.Image:
    """Render the visionary spiral artwork using the chosen palette."""
    # Define palettes inspired by Alex Grey and surrealism
    palettes = {
        "alex_grey": ["#0a0b6f", "#2300a9", "#2e44ff", "#f5a623", "#ffdd55", "#e30b5c"],
        "surrealism": ["#ff6f61", "#6b5b95", "#88b04b", "#f7cac9", "#92a8d1", "#ffef96"],
    }

    # Create a blank canvas
    image = Image.new("RGBA", (width, height), "black")
    draw = ImageDraw.Draw(image, "RGBA")

    # Establish center point and maximum radius
    cx, cy = width / 2, height / 2
    max_radius = min(cx, cy) * 0.95
    colors = palettes[palette_name]

    # Draw spiral of semi-transparent circles
    for i in range(720):
        angle = i * math.pi / 180
        radius = max_radius * i / 720
        x = cx + math.cos(angle) * radius
        y = cy + math.sin(angle) * radius
        color = hex_to_rgba(colors[i % len(colors)], 180)
        size = 8 + (i % 20)
        draw.ellipse([(x - size, y - size), (x + size, y + size)], fill=color)

    # Overlay radial symmetry lines
    for step in range(0, 360, 5):
        angle = math.radians(step)
        color = hex_to_rgba(colors[step % len(colors)], 100)
        x = cx + math.cos(angle) * max_radius
        y = cy + math.sin(angle) * max_radius
        draw.line([(cx, cy), (x, y)], fill=color, width=3)

    return image


def main() -> None:
    """Parse arguments and generate the artwork."""
    parser = argparse.ArgumentParser(description="Render a visionary spiral artwork.")
    parser.add_argument("--width", type=int, default=2048, help="Image width in pixels")
    parser.add_argument("--height", type=int, default=2048, help="Image height in pixels")
    parser.add_argument(
        "--palette",
        choices=["alex_grey", "surrealism"],
        default="alex_grey",
        help="Color palette to use for the artwork",
    )
    args = parser.parse_args()

    # Generate the artwork
    art = generate_art(args.width, args.height, args.palette)

    # Save output image
    output_path = Path("Visionary_Dream.png")
    art.save(output_path)
    print(f"Art saved to {output_path.resolve()}")


if __name__ == "__main__":
    main()
