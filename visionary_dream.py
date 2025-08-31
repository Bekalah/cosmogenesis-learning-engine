"""Visionary Dream Generator.

Produce a museum-quality spiral composition inspired by Alex Grey and surrealism.
The image is saved as "Visionary_Dream.png".
"""

# Import required libraries
import math
from pathlib import Path
from random import random
from PIL import Image, ImageDraw

# Canvas resolution
WIDTH, HEIGHT = 1920, 1080

# Color palette inspired by Alex Grey
PALETTE = [
    (10, 15, 37),     # midnight blue
    (42, 31, 114),    # deep indigo
    (104, 68, 197),   # violet
    (194, 124, 245),  # lavender
    (255, 221, 0),    # golden yellow
    (255, 82, 0),     # orange
]

def blend(c1, c2, t):
    """Linearly blend two RGB colors."""
    return tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))

def gradient_background(img, top, bottom):
    """Fill the canvas with a vertical gradient."""
    draw = ImageDraw.Draw(img)
    for y in range(HEIGHT):
        t = y / HEIGHT
        color = blend(top, bottom, t)
        draw.line([(0, y), (WIDTH, y)], fill=color)

def draw_spiral(draw, center, turns, step):
    """Render mirrored spiral dots radiating from the center."""
    max_radius = min(WIDTH, HEIGHT) * 0.5
    theta = 0.0
    while theta < 2 * math.pi * turns:
        radius = theta / (2 * math.pi * turns) * max_radius
        x = center[0] + radius * math.cos(theta)
        y = center[1] + radius * math.sin(theta)
        idx = int((theta / (2 * math.pi)) * len(PALETTE)) % len(PALETTE)
        color = PALETTE[idx]
        draw.ellipse([(x-3, y-3), (x+3, y+3)], fill=color)
        draw.ellipse([(WIDTH - x -3, y-3), (WIDTH - x +3, y+3)], fill=color)
        theta += step

def draw_circles(draw, center, count):
    """Add concentric circles for a cymatic effect."""
    max_radius = min(WIDTH, HEIGHT) * 0.4
    for i in range(count):
        t = i / count
        radius = max_radius * t
        color = PALETTE[i % len(PALETTE)]
        bbox = [
            center[0] - radius,
            center[1] - radius,
            center[0] + radius,
            center[1] + radius,
        ]
        draw.ellipse(bbox, outline=color, width=2)

def main():
    """Generate and save the visionary artwork."""
    # Create image and gradient background
    img = Image.new("RGB", (WIDTH, HEIGHT))
    gradient_background(img, PALETTE[0], PALETTE[3])

    draw = ImageDraw.Draw(img)

    # Draw concentric circles
    draw_circles(draw, (WIDTH/2, HEIGHT/2), 20)

    # Overlay mirrored spirals
    draw_spiral(draw, (WIDTH/2, HEIGHT/2), turns=7, step=0.1)

    # Save output
    img.save("Visionary_Dream.png")

if __name__ == "__main__":
    main()
