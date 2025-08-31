import json
import math
import random
from pathlib import Path

import matplotlib.pyplot as plt
from matplotlib.patches import Circle


# --- Setup ---------------------------------------------------------------
# High-definition canvas dimensions
WIDTH, HEIGHT = 1920, 1080
CENTER = (WIDTH / 2, HEIGHT / 2)

# Load real-world case studies to anchor spiral levels
DATA_FILE = Path("data/real_world_examples.json")
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

# Create figure and axis
fig = plt.figure(figsize=(WIDTH / 100, HEIGHT / 100), dpi=100)
ax = fig.add_axes([0, 0, 1, 1])
ax.set_xlim(0, WIDTH)
ax.set_ylim(0, HEIGHT)
ax.axis("off")

# --- Background ----------------------------------------------------------
max_dim = max(WIDTH, HEIGHT)
for i, color in enumerate(PALETTE):
    radius = max_dim * (i + 1) / len(PALETTE)
    ax.add_patch(Circle(CENTER, radius, color=color, zorder=i))

# --- Spiral Construction -------------------------------------------------
turns = 3.5
points = 500
max_radius = min(WIDTH, HEIGHT) * 0.45

spiral_x, spiral_y = [], []
for i in range(points):
    t = i / points
    angle = turns * 2 * math.pi * t
    radius = max_radius * t
    spiral_x.append(CENTER[0] + radius * math.cos(angle))
    spiral_y.append(CENTER[1] + radius * math.sin(angle))

ax.plot(spiral_x, spiral_y, color=PALETTE[-1], linewidth=3, zorder=len(PALETTE))

# --- Place Case Study Nodes ---------------------------------------------
font_color = "white"
node_radius = 18
for idx, case in enumerate(CASES):
    phi = idx * (2 * math.pi / len(CASES))
    r = max_radius * 0.9
    x = CENTER[0] + r * math.cos(phi)
    y = CENTER[1] + r * math.sin(phi)
    ax.add_patch(
        Circle((x, y), node_radius, color=PALETTE[idx % len(PALETTE)], zorder=len(PALETTE) + 1)
    )
    ax.text(x, y - node_radius - 10, case["title"], ha="center", va="top", color=font_color)

# --- Creative Fusion Prompts --------------------------------------------
random.shuffle(CASES)
prompts = [c["prompt"] for c in CASES]
for i, prompt in enumerate(prompts):
    angle = (i / len(prompts)) * 2 * math.pi
    r = max_radius * 0.3
    x = CENTER[0] + r * math.cos(angle)
    y = CENTER[1] + r * math.sin(angle)
    ax.text(x, y, prompt, ha="center", va="center", color=font_color)

# Save visionary artwork
plt.savefig("Visionary_Dream.png", dpi=100, bbox_inches="tight", pad_inches=0)
plt.close()

