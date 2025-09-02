"""Dark Academia Vision Generator
=================================

Generate a museum-quality visionary piece with a dark academia vibe
while preserving the luminous fractal palette and planetary hour
light settings.
"""

# Imports and setup
import argparse
import math
from datetime import datetime
from pathlib import Path
from PIL import Image, ImageDraw

# Vibrant palette inspired by Alex Grey (kept bright)
PALETTE = [
    "#460082",  # Electric Violet
    "#0080FF",  # Luminous Blue
    "#00FF80",  # Auric Green
    "#FFC800",  # Golden Amber
    "#FFFFFF",  # Pure Light
    "#B7410E",  # Crimson Rose
]


def hex_to_rgb(hex_color: str) -> tuple:
    """Convert hex color to RGB tuple."""
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))


# Environment gradients for soft planetary lighting
ENV_GRADIENTS = {
    "sunrise": (hex_to_rgb("#0080FF"), hex_to_rgb("#FFC800")),
    "noon": (hex_to_rgb("#00FF80"), hex_to_rgb("#FFFFFF")),
    "sunset": (hex_to_rgb("#460082"), hex_to_rgb("#B7410E")),
    "midnight": (hex_to_rgb("#280050"), hex_to_rgb("#4B0082")),
}

# Planetary correspondences (unchanged brightness)
PLANETS = ["Sun", "Venus", "Mercury", "Moon", "Saturn", "Jupiter", "Mars"]
PLANET_COLORS = {
    "Sun": hex_to_rgb("#FFC800"),
    "Venus": hex_to_rgb("#FFD700"),
    "Mercury": hex_to_rgb("#C0C0C0"),
    "Moon": hex_to_rgb("#87CEFA"),
    "Saturn": hex_to_rgb("#2E2E2E"),
    "Jupiter": hex_to_rgb("#00FF80"),
    "Mars": hex_to_rgb("#B7410E"),
}


def get_environment(hour: int) -> str:
    """Determine environment phase based on hour."""
    if 5 <= hour < 9:
        return "sunrise"
    if 9 <= hour < 17:
        return "noon"
    if 17 <= hour < 21:
        return "sunset"
    return "midnight"


def get_planet_color(hour: int) -> tuple:
    """Retrieve planetary color for the current hour."""
    planet = PLANETS[hour % len(PLANETS)]
    return PLANET_COLORS[planet]


def draw_gradient(draw: ImageDraw.ImageDraw, width: int, height: int,
                  top: tuple, bottom: tuple) -> None:
    """Render vertical gradient representing fractal light."""
    for y in range(height):
        t = y / height
        r = int(top[0] * (1 - t) + bottom[0] * t)
        g = int(top[1] * (1 - t) + bottom[1] * t)
        b = int(top[2] * (1 - t) + bottom[2] * t)
        draw.line([(0, y), (width, y)], fill=(r, g, b))


def draw_spiral(draw: ImageDraw.ImageDraw, center: tuple, max_radius: float) -> None:
    """Compose luminous spiral using the bright palette."""
    for i in range(720):
        angle = math.radians(i)
        r = max_radius * i / 720
        x = center[0] + math.cos(angle) * r
        y = center[1] + math.sin(angle) * r
        color = hex_to_rgb(PALETTE[i % len(PALETTE)])
        size = 6
        draw.ellipse([x - size, y - size, x + size, y + size], fill=color)


def main() -> None:
    """Parse arguments and generate the artwork."""
    parser = argparse.ArgumentParser(
        description="Dark academia visionary art with radiant fractal lights."
    )
    parser.add_argument("--width", type=int, default=1920, help="Image width in pixels")
    parser.add_argument("--height", type=int, default=1080, help="Image height in pixels")
    args = parser.parse_args()

    now = datetime.now()
    env = get_environment(now.hour)
    planet_color = get_planet_color(now.hour)

    # Create canvas
    image = Image.new("RGB", (args.width, args.height))
    draw = ImageDraw.Draw(image)

    # Layer environment gradient without darkening
    top, bottom = ENV_GRADIENTS[env]
    draw_gradient(draw, args.width, args.height, top, bottom)

    # Overlay fractal spiral
    center = (args.width / 2, args.height / 2)
    max_radius = min(center) * 0.9
    draw_spiral(draw, center, max_radius)

    # Emphasize planetary hour ring
    ring_r = max_radius * 0.15
    draw.ellipse(
        [center[0] - ring_r, center[1] - ring_r, center[0] + ring_r, center[1] + ring_r],
        outline=planet_color,
        width=8,
    )

    # Save image
    output = Path("Visionary_Dream.png")
    image.save(output)


if __name__ == "__main__":
    main()
