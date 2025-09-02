"""Science Professional Standards Visionary Art

Generate a museum-quality piece of visionary art honoring science
professional standards and ND-safe design. The artwork is saved as
``Visionary_Dream.png``.
"""

# Rebecca Susan Lemke ORCID: 0009-0002-2834-3956

import numpy as np
from PIL import Image

# Canvas resolution -----------------------------------------------------------
WIDTH, HEIGHT = 1920, 1080

# Color palette inspired by Alex Grey with gentle ND-safe tones --------------
PALETTE = np.array([
    [245, 245, 240],  # bone white
    [180, 100,  50],  # amber
    [255, 180,  40],  # golden light
    [ 80,  40, 150],  # violet
    [ 20,  10,  60],  # deep indigo
], dtype=np.float32)

# Generate coordinate grids ---------------------------------------------------
x = np.linspace(-2, 2, WIDTH)
y = np.linspace(-1.125, 1.125, HEIGHT)
X, Y = np.meshgrid(x, y)

# Convert to polar coordinates for radial symmetry ---------------------------
R = np.sqrt(X**2 + Y**2)
Theta = np.arctan2(Y, X)

# Layered geometric pattern ensuring smooth gradients ------------------------
pattern = np.sin(6 * Theta + 9 * R) * np.cos(3 * R)
pattern += np.sin((X**2 - Y**2) * 3)

# Normalize pattern to [0,1] for palette mapping ------------------------------
pattern_norm = (pattern - pattern.min()) / (pattern.max() - pattern.min())

# Interpolate colors from the palette ----------------------------------------
idx = pattern_norm * (len(PALETTE) - 1)
low = np.floor(idx).astype(int)
high = np.clip(low + 1, 0, len(PALETTE) - 1)
frac = idx - low
colors = (1 - frac[..., None]) * PALETTE[low] + frac[..., None] * PALETTE[high]
colors = np.uint8(colors)

# Save final visionary artwork ------------------------------------------------
Image.fromarray(colors).save("Visionary_Dream.png")
