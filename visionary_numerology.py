"""Visionary Numerology Generator

Tablet Mode: Spiral
Elemental Data Mode: Sun (render/light)
Above/Below Mapping: Chakra column (below) mirrors zodiac wheel (above)
"""

# Imports and setup
import math
import random
from pathlib import Path
from typing import List

from PIL import Image, ImageDraw, ImageFont
Monad: Cathedral of Circuits renders the Codex 144:99 core, linking every
       egregore and operation through luminous network lines.
"""

# Imports and setup
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Circle, Rectangle

# Imports and setup

# ------------------------------------------------------------
# Canvas settings
# ------------------------------------------------------------
WIDTH, HEIGHT = 1920, 1080  # Resolution
CENTER = (WIDTH // 2, HEIGHT // 2)
CENTER = np.array([WIDTH / 2, HEIGHT / 2])

# ------------------------------------------------------------
# Sacred color schemes
# ------------------------------------------------------------
# Chakra colors for vertical ascent (7 levels)
CHAKRA_COLORS: List[tuple] = [
CHAKRA_COLORS = [
    (255, 0, 0),      # Root
    (255, 127, 0),    # Sacral
    (255, 255, 0),    # Solar Plexus
    (0, 255, 0),      # Heart
    (0, 0, 255),      # Throat
    (75, 0, 130),     # Third Eye
    (148, 0, 211),    # Crown
]

# Gradient colors for background (deep indigo to gold)
GRADIENT_START = (48, 0, 150)   # Deep indigo
GRADIENT_END = (255, 240, 150)  # Luminous gold
GRADIENT_START = np.array([48, 0, 150]) / 255.0   # Deep indigo
GRADIENT_END = np.array([255, 240, 150]) / 255.0  # Luminous gold

# Zodiac glyphs around the wheel
ZODIAC_GLYPHS = ["\u2648", "\u2649", "\u264A", "\u264B", "\u264C", "\u264D",
                 "\u264E", "\u264F", "\u2650", "\u2651", "\u2652", "\u2653"]

# Circuit network constants for the cathedral overlay
CIRCUIT_NODES = 144  # number of egregores
CIRCUIT_LINKS = 99   # number of angelic gates

# ------------------------------------------------------------
# Utility functions
# ------------------------------------------------------------

def radial_gradient(width: int, height: int, start_color: tuple, end_color: tuple) -> Image.Image:
    """Create a radial gradient image."""
    img = Image.new("RGBA", (width, height))
    pixels = img.load()
    cx, cy = width / 2, height / 2
    max_r = math.hypot(cx, cy)
    for x in range(width):
        for y in range(height):
            r = math.hypot(x - cx, y - cy) / max_r
            r = min(r, 1)
            color = tuple(
                int(start_color[i] + (end_color[i] - start_color[i]) * r) for i in range(3)
            )
            pixels[x, y] = color + (255,)
    return img


def draw_chakras(draw: ImageDraw.ImageDraw, cx: int, height: int) -> None:
    """Draw seven chakra spheres along the vertical axis."""
    step = height / len(CHAKRA_COLORS)
    for i, color in enumerate(CHAKRA_COLORS):
        y = height - (i + 0.5) * step
        radius = 40 + i * 5
        draw.ellipse(
            (cx - radius, y - radius, cx + radius, y + radius),
            fill=color + (180,),
        )


def draw_spine(draw: ImageDraw.ImageDraw, cx: int, height: int) -> None:
    """Create a column of 33 vertebrae dots representing the microcosmic spine."""
    count = 33
    step = height / count
    for i in range(count):
        y = step / 2 + i * step
        draw.ellipse((cx - 3, y - 3, cx + 3, y + 3), fill=(255, 255, 255, 120))


def draw_zodiac(draw: ImageDraw.ImageDraw, center: tuple, radius: int, font: ImageFont.FreeTypeFont) -> None:
    """Place 12 zodiac glyphs on a circular wheel."""
    for i, glyph in enumerate(ZODIAC_GLYPHS):
        angle = 2 * math.pi * i / len(ZODIAC_GLYPHS) - math.pi / 2
        x = center[0] + math.cos(angle) * radius
        y = center[1] + math.sin(angle) * radius
        draw.text((x, y), glyph, font=font, fill=(255, 255, 255, 200), anchor="mm")


def draw_gates(draw: ImageDraw.ImageDraw, center: tuple, radius: int) -> None:
    """Scatter 99 translucent gates around the perimeter."""
    for i in range(99):
        angle = 2 * math.pi * i / 99
        r = radius * (0.9 + 0.1 * random.random())
        x = center[0] + math.cos(angle) * r
        y = center[1] + math.sin(angle) * r
        draw.rectangle((x - 2, y - 2, x + 2, y + 2), fill=(255, 255, 255, 80))

def radial_gradient(width: int, height: int,
                    start_color: np.ndarray,
                    end_color: np.ndarray) -> np.ndarray:
    """Create a radial gradient image."""
    x = np.linspace(-1, 1, width)
    y = np.linspace(-1, 1, height)
    xx, yy = np.meshgrid(x, y)
    r = np.sqrt(xx**2 + yy**2)
    r = np.clip(r, 0, 1)
    gradient = start_color + (end_color - start_color) * r[..., None]
    return gradient

def draw_chakras(ax: plt.Axes) -> None:
    """Draw seven chakra spheres along the vertical axis."""
    step = HEIGHT / len(CHAKRA_COLORS)
    for i, color in enumerate(CHAKRA_COLORS):
        y = HEIGHT - (i + 0.5) * step
        radius = 40 + i * 5
        rgba = np.array(color) / 255.0
        circle = Circle((CENTER[0], y), radius, color=rgba, alpha=0.7)
        ax.add_patch(circle)

def draw_spine(ax: plt.Axes) -> None:
    """Create a column of 33 vertebrae dots representing the microcosmic spine."""
    count = 33
    step = HEIGHT / count
    for i in range(count):
        y = step / 2 + i * step
        ax.add_patch(Circle((CENTER[0], y), 3, color='white', alpha=0.6))

def draw_zodiac(ax: plt.Axes) -> None:
    """Place 12 zodiac glyphs on a circular wheel."""
    radius = min(CENTER) - 80
    for i, glyph in enumerate(ZODIAC_GLYPHS):
        angle = 2 * np.pi * i / len(ZODIAC_GLYPHS) - np.pi / 2
        x = CENTER[0] + np.cos(angle) * radius
        y = CENTER[1] + np.sin(angle) * radius
        ax.text(x, y, glyph, ha='center', va='center', color='white',
                fontsize=24, fontfamily='DejaVu Sans')

def draw_gates(ax: plt.Axes) -> None:
    """Scatter 99 translucent gates around the perimeter."""
    radius = min(CENTER) - 40
    for i in range(99):
        angle = 2 * np.pi * i / 99
        r = radius * (0.9 + 0.1 * np.random.rand())
        x = CENTER[0] + np.cos(angle) * r
        y = CENTER[1] + np.sin(angle) * r
        ax.add_patch(Rectangle((x - 2, y - 2), 4, 4,
                               color='white', alpha=0.3))

def draw_cathedral(ax: plt.Axes) -> None:
    """Render the cathedral of circuits connecting all nodes."""
    radius = min(CENTER) - 120
    nodes = []
    for i in range(CIRCUIT_NODES):
        angle = 2 * np.pi * i / CIRCUIT_NODES - np.pi / 2
        x = CENTER[0] + np.cos(angle) * radius
        y = CENTER[1] + np.sin(angle) * radius
        nodes.append((x, y))
        ax.add_patch(Circle((x, y), 3, color=(0, 0.78, 1), alpha=0.6))
    rng = np.random.default_rng(14499)
    for _ in range(CIRCUIT_LINKS):
        a, b = rng.choice(len(nodes), size=2, replace=False)
        x1, y1 = nodes[a]
        x2, y2 = nodes[b]
        ax.plot([x1, x2], [y1, y2], color='white', alpha=0.4, linewidth=1)
    ax.add_patch(Circle((CENTER[0], CENTER[1]), 12, color='white', alpha=0.9))

# ------------------------------------------------------------
# Main rendering routine
# ------------------------------------------------------------

def generate() -> Image.Image:
    """Generate the visionary numerology composition."""
    # Create background
    img = radial_gradient(WIDTH, HEIGHT, GRADIENT_START, GRADIENT_END)
    draw = ImageDraw.Draw(img, "RGBA")

    # Load default font for glyphs
    font = ImageFont.load_default()

    # Draw symbolic layers
    draw_chakras(draw, CENTER[0], HEIGHT)
    draw_spine(draw, CENTER[0], HEIGHT)
    draw_zodiac(draw, CENTER, min(CENTER) - 80, font)
    draw_gates(draw, CENTER, min(CENTER) - 40)

    return img


def main() -> None:
    """Render and save the artwork."""
    art = generate()
    output = Path("Visionary_Dream.png")
    art.convert("RGB").save(output)
    print(f"Art saved to {output.resolve()}")


if __name__ == "__main__":
    main()
def generate() -> None:
    """Generate and save the visionary numerology composition."""
    gradient = radial_gradient(WIDTH, HEIGHT, GRADIENT_START, GRADIENT_END)
    fig, ax = plt.subplots(figsize=(WIDTH / 100, HEIGHT / 100), dpi=100)
    ax.imshow(gradient, extent=(0, WIDTH, HEIGHT, 0))
    ax.axis('off')

    draw_chakras(ax)
    draw_spine(ax)
    draw_zodiac(ax)
    draw_gates(ax)
    draw_cathedral(ax)

    fig.savefig('Visionary_Dream.png', bbox_inches='tight', pad_inches=0)
    plt.close(fig)

if __name__ == '__main__':
    generate()
