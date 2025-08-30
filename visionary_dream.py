"""
Visionary Dream Generator
-------------------------
Creates a spiral artwork using real-world case studies.
The script uses a calming color palette inspired by Alex Grey and surrealism
and saves the final image as "Visionary_Dream.png".
"""

import json
import math
import random
from pathlib import Path
from PIL import Image, ImageDraw

# --- Setup ---------------------------------------------------------------
# Canvas dimensions for high-definition output
WIDTH, HEIGHT = 1920, 1080
CENTER = (WIDTH // 2, HEIGHT // 2)

# Load case studies for reflection prompts
DATA_FILE = Path('data/real_world_examples.json')
CASES = json.loads(DATA_FILE.read_text()) if DATA_FILE.exists() else []

# Alex Grey & surrealist inspired palette
PALETTE = [
    "#0d3b66",  # deep indigo
    "#845ec2",  # radiant violet
    "#ff6f91",  # astral magenta
    "#ff9671",  # solar orange
    "#ffc75f",  # golden ray
    "#f9f871",  # ethereal glow
]

# --- Background ---------------------------------------------------------
# Create layered gradient background for visionary ambience
bg = Image.new('RGB', (WIDTH, HEIGHT), PALETTE[0])
draw = ImageDraw.Draw(bg)
for i, color in enumerate(PALETTE[1:], start=1):
    radius = int(max(WIDTH, HEIGHT) * (i / len(PALETTE)))
    draw.ellipse([
        CENTER[0] - radius,
        CENTER[1] - radius,
        CENTER[0] + radius,
        CENTER[1] + radius
    ], fill=color)

# --- Spiral Construction -------------------------------------------------
turns = 3.5
points = 500
max_radius = min(WIDTH, HEIGHT) * 0.45

spiral = []
for i in range(points):
    t = i / points
    angle = turns * 2 * math.pi * t
    radius = max_radius * t
    x = CENTER[0] + radius * math.cos(angle)
    y = CENTER[1] + radius * math.sin(angle)
    spiral.append((x, y))

# Draw spiral curve
for i in range(len(spiral) - 1):
    draw.line([spiral[i], spiral[i + 1]], fill=PALETTE[-1], width=3)

# --- Place Case Study Nodes ---------------------------------------------
font_color = 'white'
node_radius = 18
for idx, case in enumerate(CASES):
    phi = idx * (2 * math.pi / len(CASES)) if CASES else 0
    r = max_radius * 0.9
    x = CENTER[0] + r * math.cos(phi)
    y = CENTER[1] + r * math.sin(phi)
    draw.ellipse([
        x - node_radius,
        y - node_radius,
        x + node_radius,
        y + node_radius
    ], fill=PALETTE[idx % len(PALETTE)])
    text = case.get('title', '')
    w, h = draw.textsize(text)
    draw.text((x - w / 2, y - node_radius - h - 4), text, fill=font_color)

# --- Creative Fusion Prompts --------------------------------------------
random.shuffle(CASES)
prompts = [c.get('prompt', '') for c in CASES]
for i, prompt in enumerate(prompts):
    angle = (i / len(prompts)) * 2 * math.pi if prompts else 0
    r = max_radius * 0.3
    x = CENTER[0] + r * math.cos(angle)
    y = CENTER[1] + r * math.sin(angle)
    w, h = draw.textsize(prompt)
    draw.text((x - w / 2, y - h / 2), prompt, fill=font_color)

# --- Save ---------------------------------------------------------------
bg.save('Visionary_Dream.png')
