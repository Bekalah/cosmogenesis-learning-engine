import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap

# Initialize canvas dimensions for high-definition output
WIDTH, HEIGHT = 1920, 1080

# Generate complex plane grid for fractal calculation
x = np.linspace(-1.8, 1.8, WIDTH)
y = np.linspace(-1.0, 1.0, HEIGHT)
X, Y = np.meshgrid(x, y)
Z = X + 1j * Y

# Seed constant shaping the Julia set's visionary geometry
C = complex(-0.70176, -0.3842)

# Iterate fractal equation with escape-time algorithm
iterations = 300
escape_radius = 10
M = np.zeros((HEIGHT, WIDTH))
for i in range(iterations):
    mask = np.abs(Z) <= escape_radius
    Z[mask] = Z[mask] ** 2 + C
    M[mask] = i

# Define Alex Grey-inspired spectral palette for transcendental hues
colors = [
    "#000000",  # cosmic void
    "#0d3b66",  # deep indigo
    "#0336ff",  # electric blue
    "#845ec2",  # radiant violet
    "#ff6f91",  # astral magenta
    "#ff9671",  # solar orange
    "#ffc75f",  # golden ray
    "#f9f871"   # ethereal glow
]
cmap = LinearSegmentedColormap.from_list("alex_grey", colors, N=256)

# Render fractal with palette and save as visionary artwork
plt.figure(figsize=(WIDTH / 100, HEIGHT / 100), dpi=100)
plt.imshow(M, cmap=cmap, extent=[-1.8, 1.8, -1.0, 1.0])
plt.axis("off")
plt.savefig("Visionary_Dream.png", bbox_inches="tight", pad_inches=0)
plt.close()
