"""Magic Tower Elevator: open-world visionary art."""

# — Imports and sacred setup —
from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw

# — Canvas dimensions —
WIDTH, HEIGHT = 1920, 1080
CENTER = (WIDTH // 2, HEIGHT // 2)

# — Color palette inspired by Willy Wonka and Alex Grey —
PALETTE = [
    "#12002B",  # Deep Space Violet
    "#3C0D99",  # Electric Grape
    "#FFB400",  # Golden Candy
    "#FF007F",  # Magenta Dream
    "#00E5FF",  # Aqua Glow
]


def vertical_gradient(draw: ImageDraw.ImageDraw) -> None:
    """Blend the sky for endless ascent."""

    for y in range(HEIGHT):
        ratio = y / HEIGHT
        r = int(18 * (1 - ratio) + 255 * ratio)
        g = int(0 * (1 - ratio) + 183 * ratio)
        b = int(43 * (1 - ratio) + 255 * ratio)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))


def tower_grid(draw: ImageDraw.ImageDraw) -> None:
    """Stack luminous floors like an organized labyrinth."""

    floor_height = 60
    for y in range(0, HEIGHT, floor_height):
        color = PALETTE[(y // floor_height) % len(PALETTE)]
        draw.rectangle(
            [CENTER[0] - 220, y, CENTER[0] + 220, y + floor_height - 8],
            outline=color,
            width=3,
        )

    # Central elevator shaft
    draw.rectangle(
        [CENTER[0] - 25, 0, CENTER[0] + 25, HEIGHT],
        outline=PALETTE[2],
        width=5,
    )


def elevator_paths(draw: ImageDraw.ImageDraw) -> None:
    """Weave infinite elevator trajectories."""

    max_radius = min(CENTER)
    for step in range(0, 360, 6):
        angle = math.radians(step)
        for radius in range(100, max_radius, 50):
            x = CENTER[0] + radius * math.cos(angle + radius / 80)
            y = CENTER[1] + radius * math.sin(angle + radius / 80)
            color = PALETTE[(step // 6) % len(PALETTE)]
            draw.ellipse([x - 4, y - 4, x + 4, y + 4], fill=color)


def main() -> None:
    """Render the visionary tower and save."""

    image = Image.new("RGB", (WIDTH, HEIGHT), PALETTE[0])
    draw = ImageDraw.Draw(image)

    vertical_gradient(draw)
    tower_grid(draw)
    elevator_paths(draw)

    output = Path("Visionary_Dream.png")
    image.save(output)
    print(f"Art saved to {output.resolve()}")


if __name__ == "__main__":
    main()
