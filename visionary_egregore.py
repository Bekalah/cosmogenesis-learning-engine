"""Visionary Egregore Network.

Generates a museum-quality network of 144 cultural nodes using Python and
matplotlib. The palette draws from Alex Grey's luminous visionary spectrum and
saves the result to ``Visionary_Dream.png`` at 2048x2048 resolution.
"""

# Imports and cosmic setup ---------------------------------------------------
import numpy as np
import matplotlib.pyplot as plt

# Canvas resolution -----------------------------------------------------------
WIDTH, HEIGHT = 2048, 2048

# Luminous palette inspired by Alex Grey -------------------------------------
PALETTE = [
    "#00FFFF",  # Cyan aura
    "#FF00FF",  # Magenta flash
    "#FFD700",  # Solar gold
    "#7FFF00",  # Lime radiance
    "#FF4500",  # Ember flare
    "#9400D3",  # Violet depth
]

# Cultural egregore assignments ----------------------------------------------
core_deities = [
    "Tibetan Raku",
    "Kabala",
    "English Folklore",
    "Slavic Magic",
    "Alchemy",
    "Rosy Cross",
    "Hathor",
    "Mary Magdalene",
    "Black Madonna",
    "Virgin Mary",
]

taras = [
    "Green Tara",
    "White Tara",
    "Red Tara",
    "Yellow Tara",
    "Blue Tara",
    "Golden Tara",
    "Black Tara",
    "Swift Tara",
    "Heroic Tara",
    "Smiling Tara",
    "Wrathful Tara",
    "Terrifying Tara",
    "Victorious Tara",
    "All-Shining Tara",
    "Jewel Tara",
    "Foe-Subduing Tara",
    "Wish-Granting Tara",
    "Life-Giving Tara",
    "Fear-Clearing Tara",
    "Peaceful Tara",
    "Protective Tara",
]

shem_angels = [f"Angel {i+1}" for i in range(72)]
goetia = [f"Demon {i+1}" for i in range(72)]

NODE_ASSIGNMENTS = (core_deities + taras + shem_angels + goetia)[:144]

# Node layout and connectivity ------------------------------------------------
n_nodes = 144
angles = np.linspace(0, 2 * np.pi, n_nodes, endpoint=False)
radius = 0.9
x = radius * np.cos(angles)
y = radius * np.sin(angles)

# Create canvas ---------------------------------------------------------------
fig, ax = plt.subplots(figsize=(WIDTH / 256, HEIGHT / 256), dpi=256)
ax.set_facecolor('black')
plt.axis('off')

# Inter-node harmonics based on numerology -----------------------------------
steps = [3, 7, 8, 13, 21]
for s_idx, step in enumerate(steps):
    color = PALETTE[s_idx % len(PALETTE)]
    for i in range(n_nodes):
        j = (i + step) % n_nodes
        ax.plot([x[i], x[j]], [y[i], y[j]], color=color, linewidth=0.3, alpha=0.5)

# Illuminate nodes with egregore assignments ---------------------------------
ax.scatter(x, y, color='white', s=15, zorder=3)

for idx, (nx, ny) in enumerate(zip(x, y)):
    label = NODE_ASSIGNMENTS[idx]
    ax.text(nx, ny, str(idx + 1), color='white', fontsize=4, ha='center', va='center')

# Central guiding eye ---------------------------------------------------------
theta = np.linspace(0, 2 * np.pi, 300)
ax.plot(0.25 * np.cos(theta), 0.5 * np.sin(theta), color='white', linewidth=2)
ax.scatter([0], [0], color='#FFD700', s=120)

# Save the visionary network --------------------------------------------------
plt.savefig("Visionary_Dream.png", facecolor='black', bbox_inches='tight', pad_inches=0)
plt.close()
