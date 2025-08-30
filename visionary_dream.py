# Museum-quality visionary art generator using Python + Pillow
import numpy as np
from PIL import Image, ImageDraw

# Canvas dimensions
WIDTH, HEIGHT = 1920, 1080

# Radiant gradient background (Alex Grey–inspired psychedelia)
gradient = np.zeros((HEIGHT, WIDTH, 3), dtype=np.uint8)
for y in range(HEIGHT):
    for x in range(WIDTH):
        r = int(128 + 127 * np.sin(2 * np.pi * x / WIDTH + np.pi / 3))
        g = int(128 + 127 * np.sin(2 * np.pi * y / HEIGHT + np.pi / 2))
        b = int(128 + 127 * np.sin(2 * np.pi * (x + y) / (WIDTH + HEIGHT)))
        gradient[y, x] = (r, g, b)
img = Image.fromarray(gradient, 'RGB')

# Matrix-style digital rain overlay
draw = ImageDraw.Draw(img)
symbols = "01"
for col in range(0, WIDTH, 25):
    offset = np.random.randint(-HEIGHT, 0)
    for row in range(offset, HEIGHT, 20):
        draw.text((col, row), np.random.choice(list(symbols)), fill=(0, 255, 70))

# Wonderland spiral path (psychedelic geometry)
for theta in np.linspace(0, 12 * np.pi, 900):
    radius = theta * 12
    x = WIDTH / 2 + radius * np.cos(theta)
    y = HEIGHT / 2 + radius * np.sin(theta)
    draw.ellipse((x - 3, y - 3, x + 3, y + 3), fill=(255, 0, 255))

# Final cryptic invitation
draw.text((WIDTH * 0.33, HEIGHT * 0.9), "Follow the White Rabbit", fill=(255, 255, 255))

# Save the visionary artifact
img.save("Visionary_Dream.png")
