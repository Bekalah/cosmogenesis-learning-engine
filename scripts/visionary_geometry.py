"""Visionary geometry rendered with Python and Matplotlib.

Produces a museum-quality mandala using an Alex Grey-inspired palette.
"""

# Imports and setup
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap

# Canvas dimensions for a gallery-grade piece
WIDTH, HEIGHT = 1920, 1080

# Generating a radial grid to evoke psychedelic mandalas
a = np.linspace(-2 * np.pi, 2 * np.pi, WIDTH)
b = np.linspace(-2 * np.pi, 2 * np.pi, HEIGHT)
X, Y = np.meshgrid(a, b)

# Layered wave interference pattern to form visionary symmetry
Z = np.sin(X**2 + Y**2) + np.cos(3 * X) * np.sin(3 * Y)
Z_norm = (Z - Z.min()) / (Z.max() - Z.min())

# Color palette inspired by Alex Grey's luminous mysticism
colors = ["#1a237e", "#d500f9", "#ff6d00", "#00e5ff", "#76ff03"]
cmap = LinearSegmentedColormap.from_list("alex_grey_palette", colors)

# Rendering the canvas with curvature and symmetry
plt.figure(figsize=(WIDTH / 100, HEIGHT / 100), dpi=100)
plt.axis("off")
plt.imshow(Z_norm, cmap=cmap)

# Saving the final artifact
plt.tight_layout(pad=0)
plt.savefig("Visionary_Dream.png", dpi=100, bbox_inches="tight", pad_inches=0)
plt.close()
