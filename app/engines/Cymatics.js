# ✦ Codex 144:99 -- Visionary geometry with Alex Grey inspired palette

import numpy as np
from PIL import Image

# ✦ Set the canvas resolution
WIDTH, HEIGHT = 1024, 1024

# ✦ Define luminous, psychedelic palette (Alex Grey inspiration)
palette = np.array([
    [40, 0, 80],      # deep indigo
    [70, 0, 130],     # electric violet
    [0, 128, 255],    # luminous blue
    [0, 255, 128],    # auric green
    [255, 200, 0],    # golden amber
    [255, 255, 255]   # pure light
], dtype=np.float32) / 255.0

# ✦ Forge coordinate grid for the visionary field
x = np.linspace(-1, 1, WIDTH)
y = np.linspace(-1, 1, HEIGHT)
xx, yy = np.meshgrid(x, y)

# ✦ Convert to polar space for kaleidoscopic symmetry
r = np.sqrt(xx**2 + yy**2)
theta = np.arctan2(yy, xx)
symmetry = 6  # six-fold spiritual mirror
theta = (theta % (2 * np.pi / symmetry)) * symmetry

# ✦ Generate layered wave interference across the living spine
z = np.sin(10 * r + 5 * theta) + np.cos(8 * r - 4 * theta)

# ✦ Normalize to sacred range 0–1
z = (z - z.min()) / (z.max() - z.min())

# ✦ Map the visionary field onto the radiant palette
indices = z * (len(palette) - 1)
lower = np.floor(indices).astype(int)
upper = np.clip(lower + 1, 0, len(palette) - 1)
t = indices - lower
img_array = palette[lower] * (1 - t)[..., None] + palette[upper] * t[..., None]

# ✦ Seal the artwork in the archive
Image.fromarray(np.uint8(img_array * 255)).save("Visionary_Dream.png")