#!/usr/bin/env python3
"""Generate a museum-quality visionary artwork using Pillow."""

# Standard library imports
import argparse
import math
import random

# Third-party import
from PIL import Image, ImageDraw

# --------------------------------------
# Parse command-line arguments
# --------------------------------------
parser = argparse.ArgumentParser(description="Create visionary art with Pillow")
parser.add_argument("--width", type=int, default=1024, help="Image width")
parser.add_argument("--height", type=int, default=1024, help="Image height")
args = parser.parse_args()

WIDTH, HEIGHT = args.width, args.height

# --------------------------------------
# Canvas setup
# --------------------------------------
img = Image.new("RGB", (WIDTH, HEIGHT))
draw = ImageDraw.Draw(img)

# --------------------------------------
# Gradient background inspired by Alex Grey
# --------------------------------------
for y in range(HEIGHT):
    t = y / HEIGHT
    r = int(40 + 80 * t)
    g = int(30 + 40 * t)
    b = int(120 + 135 * t)
    draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))

center = (WIDTH // 2, HEIGHT // 2)

# --------------------------------------
# Mandala halos to mirror chapels in sacred symmetry
# --------------------------------------
for i in range(1, 36):
    radius = i * 14
    hue = 60 + i * 5
    color = (
        int(255 * math.sin(math.radians(hue))),
        int(255 * math.sin(math.radians(hue + 120))),
        int(255 * math.sin(math.radians(hue + 240))),
    )
    draw.ellipse(
        [
            center[0] - radius,
            center[1] - radius,
            center[0] + radius,
            center[1] + radius,
        ],
        outline=color,
        width=2,
    )

# --------------------------------------
# IGNI: Raku Reiki Dragon path (fiery spiral)
# --------------------------------------
points = []
arms = 2200
for i in range(arms):
    angle = i * 0.05
    radius = 2 + i * 0.5
    x = center[0] + radius * math.cos(angle)
    y = center[1] + radius * math.sin(angle)
    points.append((x, y))

for p in range(len(points) - 1):
    intensity = p / len(points)
    flame = (
        int(255 * (1 - intensity / 2)),
        int(80 + 100 * intensity),
        int(20 + 60 * intensity),
    )
    draw.line([points[p], points[p + 1]], fill=flame, width=3)

# --------------------------------------
# Star sparks for mystical lineage
# --------------------------------------
for _ in range(300):
    sx = random.randint(0, WIDTH - 1)
    sy = random.randint(0, HEIGHT - 1)
    draw.point((sx, sy), fill=(255, 255, random.randint(180, 255)))

# --------------------------------------
# Save completed visionary piece
# --------------------------------------
img.save("Visionary_Dream.png")
