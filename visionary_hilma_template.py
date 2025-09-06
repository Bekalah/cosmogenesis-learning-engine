"""Visionary Hilma Template: generate museum-quality art."""

# — Imports and alchemical setup —
import math
import random
from pathlib import Path

from PIL import Image, ImageDraw

# — Canvas dimensions (1920x1080) —
WIDTH, HEIGHT = 1920, 1080
CENTER = (WIDTH // 2, HEIGHT // 2)

# — Color palette inspired by Hilma af Klint —
PALETTE = [
    "#F6E3B4",  # Soft Beige
    "#E3B4F6",  # Lilac
    "#B4E3F6",  # Pale Blue
    "#F6B4D8",  # Rose
    "#D8F6B4",  # Light Green
]

# — Birth the canvas and pastel gradient —
image = Image.new("RGB", (WIDTH, HEIGHT), PALETTE[0])
draw = ImageDraw.Draw(image)
for y in range(HEIGHT):
    t = y / HEIGHT
    r = int(246 * (1 - t) + 180 * t)
    g = int(227 * (1 - t) + 200 * t)
    b = int(180 * (1 - t) + 246 * t)
    draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))

# — Spiral the lattice with pastel orbs —
max_radius = min(CENTER)
for step in range(720):
    angle = math.radians(step)
    radius = (step / 720) * max_radius
    x = CENTER[0] + radius * math.cos(angle * 4)
    y = CENTER[1] + radius * math.sin(angle * 4)
    color = random.choice(PALETTE[1:])
    draw.ellipse([x - 3, y - 3, x + 3, y + 3], fill=color)

# — Encircle with concentric veils —
for r in range(60, max_radius, 80):
    bbox = [CENTER[0] - r, CENTER[1] - r, CENTER[0] + r, CENTER[1] + r]
    draw.ellipse(bbox, outline=random.choice(PALETTE[1:]), width=4)

# — Save the visionary dream —
image.save(Path("Visionary_Dream.png"))
