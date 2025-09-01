"""Visionary Dream Generator with Egregore Scenes.

Produces museum-grade visionary art using a sacred palette.
Allows selection of environments and egregores inspired by
Alice-in-Wonderland arcana and techno mysticism.
"""

# Imports and setup
from datetime import datetime
import argparse
import math
import random
from pathlib import Path
from PIL import Image, ImageDraw

# ===== Visionary Palette inspired by Alex Grey, Hilma af Klint =====
PALETTE = {
    "Deep Indigo": "#280050",
    "Electric Violet": "#460082",
    "Luminous Blue": "#0080FF",
    "Auric Green": "#00FF80",
    "Golden Amber": "#FFC800",
    "Pure Light": "#FFFFFF",
    "Crimson Rose": "#B7410E",
    "Alchemical Gold": "#FFD700",
    "Philosopher's Slate": "#2E2E2E",
    "Transcendent Silver": "#C0C0C0",
    "Angelic Sky": "#87CEFA",
    "Shadow Violet": "#4B0082",
}


# Convert hex color to RGBA
# ------------------------------------------------------------
def hex_to_rgba(hex_color: str, alpha: int = 255) -> tuple:
    hex_color = hex_color.lstrip('#')
    r = int(hex_color[0:2], 16)
    g = int(hex_color[2:4], 16)
    b = int(hex_color[4:6], 16)
    return (r, g, b, alpha)


# Environment gradients for soft light simulations
# ------------------------------------------------------------
ENV_GRADIENTS = {
    'sunrise': (hex_to_rgba(PALETTE['Luminous Blue']),
                hex_to_rgba(PALETTE['Golden Amber'])),
    'noon': (hex_to_rgba(PALETTE['Auric Green']),
             hex_to_rgba(PALETTE['Pure Light'])),
    'sunset': (hex_to_rgba(PALETTE['Electric Violet']),
               hex_to_rgba(PALETTE['Crimson Rose'])),
    'midnight': (hex_to_rgba(PALETTE['Deep Indigo']),
                 hex_to_rgba(PALETTE['Shadow Violet'])),
}


# Planetary hour colors (cyclic 7-hour sequence)
# ------------------------------------------------------------
PLANETS = ['Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars']
PLANET_COLORS = {
    'Sun': hex_to_rgba(PALETTE['Golden Amber']),
    'Venus': hex_to_rgba(PALETTE['Alchemical Gold']),
    'Mercury': hex_to_rgba(PALETTE['Transcendent Silver']),
    'Moon': hex_to_rgba(PALETTE['Angelic Sky']),
    'Saturn': hex_to_rgba(PALETTE["Philosopher's Slate"]),
    'Jupiter': hex_to_rgba(PALETTE['Auric Green']),
    'Mars': hex_to_rgba(PALETTE['Crimson Rose']),
}


def get_environment(hour: int) -> str:
    """Determine environment phase based on hour."""
    if 5 <= hour < 9:
        return 'sunrise'
    if 9 <= hour < 17:
        return 'noon'
    if 17 <= hour < 21:
        return 'sunset'
    return 'midnight'


def get_planet_color(hour: int) -> tuple:
    """Map current hour to its planetary correspondence."""
    planet = PLANETS[hour % len(PLANETS)]
    return PLANET_COLORS[planet]


# Gradient background
# ------------------------------------------------------------
def draw_gradient(draw: ImageDraw.ImageDraw, width: int, height: int,
                  top_color: tuple, bottom_color: tuple) -> None:
    for y in range(height):
        ratio = y / height
        r = int(top_color[0] * (1 - ratio) + bottom_color[0] * ratio)
        g = int(top_color[1] * (1 - ratio) + bottom_color[1] * ratio)
        b = int(top_color[2] * (1 - ratio) + bottom_color[2] * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b, 255))


# ===== Egregore Drawing Functions =====
# ------------------------------------------------------------
def draw_wonderland_magician(draw, center, palette_colors):
    """Spiral of dots for arcane magician vibe."""
    for i in range(60):
        angle = i * 6
        radius = i * 6
        angle_rad = math.radians(angle)
        x = center[0] + radius * math.cos(angle_rad)
        y = center[1] + radius * math.sin(angle_rad)
        color = hex_to_rgba(random.choice(palette_colors), 200)
        size = max(1, i // 3)
        draw.ellipse([x - size, y - size, x + size, y + size], fill=color)


def draw_techno_rogue(draw, center, palette_colors, width, height):
    """Matrix-like grid pulses for techno rogue."""
    step = 40
    for x in range(0, width, step):
        draw.line([(x, 0), (x, height)],
                  fill=hex_to_rgba(random.choice(palette_colors), 80))
    for y in range(0, height, step):
        draw.line([(0, y), (width, y)],
                  fill=hex_to_rgba(random.choice(palette_colors), 80))
    for _ in range(100):
        px = random.randrange(0, width)
        py = random.randrange(0, height)
        size = random.randint(2, 8)
        draw.rectangle([px, py, px + size, py + size],
                       fill=hex_to_rgba(random.choice(palette_colors)))


def draw_arcane_architect(draw, center, palette_colors):
    """Radiating polygons for occult architecture."""
    for sides in range(3, 10):
        radius = sides * 40
        points = []
        for i in range(sides):
            angle = (2 * math.pi / sides) * i
            x = center[0] + radius * math.cos(angle)
            y = center[1] + radius * math.sin(angle)
            points.append((x, y))
        color = hex_to_rgba(random.choice(palette_colors), 160)
        draw.polygon(points, outline=color)


EGREGORES = {
    'WonderlandMagician': (draw_wonderland_magician,
                           [PALETTE['Electric Violet'],
                            PALETTE['Luminous Blue'],
                            PALETTE['Pure Light']]),
    'TechnoRogue': (draw_techno_rogue,
                    [PALETTE['Auric Green'],
                     PALETTE['Transcendent Silver'],
                     PALETTE['Alchemical Gold']]),
    'ArcaneArchitect': (draw_arcane_architect,
                        [PALETTE['Deep Indigo'],
                         PALETTE['Golden Amber'],
                         PALETTE['Crimson Rose']]),
}


# Main render function
# ------------------------------------------------------------
def render_scene(env_name: str, egregore_name: str,
                 width: int, height: int) -> None:
    """Compose gradient, egregore figure, and planetary halo."""
    img = Image.new('RGBA', (width, height))
    draw = ImageDraw.Draw(img, 'RGBA')

    top, bottom = ENV_GRADIENTS[env_name]
    draw_gradient(draw, width, height, top, bottom)

    current_hour = datetime.now().hour
    planet_color = get_planet_color(current_hour)

    center = (width // 2, height // 2)
    func, colors = EGREGORES[egregore_name]
    if egregore_name == 'TechnoRogue':
        func(draw, center, colors, width, height)
    else:
        func(draw, center, colors)

    halo_radius = min(width, height) // 3
    draw.ellipse([center[0] - halo_radius, center[1] - halo_radius,
                  center[0] + halo_radius, center[1] + halo_radius],
                 outline=planet_color, width=6)

    draw.rectangle([0, 0, width, height],
                   fill=hex_to_rgba(PALETTE["Philosopher's Slate"], 40))

    img.convert('RGB').save('Visionary_Dream.png')


# CLI entry
# ------------------------------------------------------------
if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='Generate visionary egregore scenes.')
    parser.add_argument('--env', choices=ENV_GRADIENTS.keys(),
                        default=random.choice(list(ENV_GRADIENTS.keys())))
    parser.add_argument('--egregore', choices=EGREGORES.keys(),
                        default=random.choice(list(EGREGORES.keys())))
    parser.add_argument('--width', type=int, default=1920)
    parser.add_argument('--height', type=int, default=1080)
    args = parser.parse_args()

    render_scene(args.env, args.egregore, args.width, args.height)
