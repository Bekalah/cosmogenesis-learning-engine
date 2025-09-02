"""Visionary Codex Template: museum-quality psychedelic mandala."""

# —— Imports and alchemical setup ——
import math
import random
from pathlib import Path

from PIL import Image, ImageDraw

# —— Canvas dimensions (1920x1080) ——
WIDTH, HEIGHT = 1920, 1080
CENTER = (WIDTH // 2, HEIGHT // 2)

# —— Color palette inspired by Alex Grey ——
PALETTE = [
    "#280050",  # Deep Indigo
    "#460082",  # Electric Violet
    "#0080FF",  # Luminous Blue
    "#00FF80",  # Auric Green
    "#FFC800",  # Golden Amber
    "#FFFFFF",  # Pure Light
]

# —— Birth the canvas and base gradient ——
image = Image.new("RGB", (WIDTH, HEIGHT), PALETTE[0])
draw = ImageDraw.Draw(image)
for y in range(HEIGHT):
    ratio = y / HEIGHT
    r = int(40 * (1 - ratio) + 255 * ratio)
    g = int(0 * (1 - ratio) + 200 * ratio)
    b = int(80 * (1 - ratio) + 255 * ratio)
    draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))

# —— Spiral the mandala with luminous dots ——
max_radius = min(CENTER)
for step in range(720):
    angle = math.radians(step)
    radius = (step / 720) * max_radius
    x = CENTER[0] + radius * math.cos(angle * 6)
    y = CENTER[1] + radius * math.sin(angle * 6)
    color = random.choice(PALETTE)
    draw.ellipse([x - 2, y - 2, x + 2, y + 2], fill=color)

# —— Encircle with concentric orbits ——
for r in range(60, max_radius, 80):
    bbox = [CENTER[0] - r, CENTER[1] - r, CENTER[0] + r, CENTER[1] + r]
    draw.ellipse(bbox, outline=random.choice(PALETTE), width=3)

# —— Radiate a four-fold cross of light ——
for axis in range(4):
    angle = math.pi / 2 * axis
    x = CENTER[0] + max_radius * math.cos(angle)
    y = CENTER[1] + max_radius * math.sin(angle)
    draw.line([CENTER, (x, y)], fill=random.choice(PALETTE), width=6)

# —— Save the visionary dream ——
image.save(Path("Visionary_Dream.png"))

