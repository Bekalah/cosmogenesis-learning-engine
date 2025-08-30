# visionary_art_generator.py
# Museum-quality visionary art using Python + Pillow + NumPy

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# Canvas setup
WIDTH, HEIGHT = 1920, 1080
img = Image.new('RGB', (WIDTH, HEIGHT))
draw = ImageDraw.Draw(img)

# Gradient background (psychedelic palette)
gradient = np.zeros((HEIGHT, WIDTH, 3), dtype=np.uint8)
for y in range(HEIGHT):
    for x in range(WIDTH):
        r = int(128 + 127 * np.sin(2 * np.pi * (x + y) / (WIDTH + HEIGHT)))
        g = int(128 + 127 * np.sin(2 * np.pi * x / WIDTH + np.pi / 3))
        b = int(128 + 127 * np.sin(2 * np.pi * y / HEIGHT + np.pi / 2))
        gradient[y, x] = (r, g, b)
img = Image.fromarray(gradient)

# Matrix digital rain
symbols = "01"
for col in range(0, WIDTH, 20):
    offset = np.random.randint(-HEIGHT, 0)
    for row in range(offset, HEIGHT, 20):
        char = np.random.choice(list(symbols))
        draw.text((col, row), char, fill=(0, 255, 70))

# Wonderland spiral (glowing)
for theta in np.linspace(0, 20 * np.pi, 1200):
    radius = 10 * theta
    x = WIDTH / 2 + radius * np.cos(theta)
    y = HEIGHT / 2 + radius * np.sin(theta)
    draw.ellipse((x - 4, y - 4, x + 4, y + 4), fill=(255, 0, 255))

# Ethereal chessboard (dual realities)
tile_size = 80
for y in range(0, HEIGHT, tile_size):
    for x in range(0, WIDTH, tile_size):
        if (x // tile_size + y // tile_size) % 2 == 0:
            draw.rectangle([x, y, x + tile_size, y + tile_size], outline=(200, 200, 255))

# Circuit cathedral (fractal glyphs)
for i in range(500):
    x1, y1 = np.random.randint(0, WIDTH), np.random.randint(0, HEIGHT)
    x2, y2 = x1 + np.random.randint(-50, 50), y1 + np.random.randint(-50, 50)
    color = tuple(np.random.randint(0, 255, size=3))
    draw.line((x1, y1, x2, y2), fill=color, width=1)

# Mystical text overlay
font = ImageFont.load_default()
draw.text((WIDTH * 0.32, HEIGHT * 0.88), "Follow the White Rabbit", fill=(255, 255, 255), font=font)

# Glow effect
img = img.filter(ImageFilter.GaussianBlur(radius=1))

# Save final artifact
img.save("Visionary_Dream.png")
