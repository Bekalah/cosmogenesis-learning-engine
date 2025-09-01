"""Visionary Dream Generator with Egregore Scenes.

Produces museum-grade visionary art using a sacred palette.
Allows selection of environments and egregores inspired by
Alice-in-Wonderland arcana and techno mysticism.
"""

# Imports and setup
from datetime import datetime
import argparse
"""Visionary Dream Generator.

Create a spiral-based visionary artwork with customizable color palettes
inspired by Alex Grey or surrealism. The output is saved as
"Visionary_Dream.png".
"""

# Standard library imports
import argparse
import math
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
# --- Setup ---------------------------------------------------------------
# Define accessible palettes
PALETTES = {
    "vivid": [
        "#0d3b66",  # deep indigo
        "#845ec2",  # radiant violet
        "#ff6f91",  # astral magenta
        "#ff9671",  # solar orange
        "#ffc75f",  # golden ray
        "#f9f871",  # ethereal glow
    ],
    "calm": [
        "#1d3557",  # midnight blue
        "#457b9d",  # muted azure
        "#a8dadc",  # soft aqua
        "#f1faee",  # eggshell
        "#f8edeb",  # warm mist
        "#ffffff",  # pure white
    ],
    "contrast": [
        "#000000",  # black
        "#ffffff",  # white
        "#ff0000",  # red
        "#00ff00",  # green
        "#0000ff",  # blue
        "#ffff00",  # yellow
    ],
}


def generate(width: int, height: int, palette_name: str, data_file: Path) -> None:
    """Render spiral artwork and save as Visionary_Dream.png."""
    center = (width // 2, height // 2)
    cases = json.loads(data_file.read_text()) if data_file.exists() else []
    palette = PALETTES.get(palette_name, PALETTES["vivid"])

    # --- Background ---------------------------------------------------------
    # Layered gradient background for visionary ambience
    bg = Image.new("RGB", (width, height), palette[0])
    draw = ImageDraw.Draw(bg)
    for i, color in enumerate(palette[1:], start=1):
        radius = int(max(width, height) * (i / len(palette)))
        draw.ellipse(
            [
                center[0] - radius,
                center[1] - radius,
                center[0] + radius,
                center[1] + radius,
            ],
            fill=color,
        )

    # --- Spiral Construction -------------------------------------------------
    turns = 3.5
    points = 500
    max_radius = min(width, height) * 0.45

    spiral = []
    for i in range(points):
        t = i / points
        angle = turns * 2 * math.pi * t
        radius = max_radius * t
        x = center[0] + radius * math.cos(angle)
        y = center[1] + radius * math.sin(angle)
        spiral.append((x, y))

    # Draw spiral curve
    for i in range(len(spiral) - 1):
        draw.line([spiral[i], spiral[i + 1]], fill=palette[-1], width=3)

    # --- Place Case Study Nodes ---------------------------------------------
    font_color = "white"
    node_radius = 18
    for idx, case in enumerate(cases):
        phi = idx * (2 * math.pi / len(cases)) if cases else 0
        r = max_radius * 0.9
        x = center[0] + r * math.cos(phi)
        y = center[1] + r * math.sin(phi)
        draw.ellipse(
            [
                x - node_radius,
                y - node_radius,
                x + node_radius,
                y + node_radius,
            ],
            fill=palette[idx % len(palette)],
        )
        text = case.get("title", "")
        w, h = draw.textsize(text)
        draw.text((x - w / 2, y - node_radius - h - 4), text, fill=font_color)

    # --- Creative Fusion Prompts --------------------------------------------
    random.shuffle(cases)
    prompts = [c.get("prompt", "") for c in cases]
    for i, prompt in enumerate(prompts):
        angle = (i / len(prompts)) * 2 * math.pi if prompts else 0
        r = max_radius * 0.3
        x = center[0] + r * math.cos(angle)
        y = center[1] + r * math.sin(angle)
        w, h = draw.textsize(prompt)
        draw.text((x - w / 2, y - h / 2), prompt, fill=font_color)

    # --- Save ---------------------------------------------------------------
    bg.save("Visionary_Dream.png")
    Path("Visionary_Dream.txt").write_text(
        "Visionary spiral pattern with layered gradients and reflective prompts."
    )


def parse_args() -> argparse.Namespace:
    """CLI argument parsing."""
    parser = argparse.ArgumentParser(description="Generate visionary spiral art.")
    parser.add_argument("--width", type=int, default=1920, help="image width in pixels")
    parser.add_argument("--height", type=int, default=1080, help="image height in pixels")
    parser.add_argument(
        "--palette",
        choices=PALETTES.keys(),
        default="vivid",
        help="color palette to use",
    )
    parser.add_argument(
        "--data",
        type=Path,
        default=Path("data/real_world_examples.json"),
        help="JSON file with case studies",
    )
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    generate(args.width, args.height, args.palette, args.data)
from typing import List

from PIL import Image, ImageDraw, ImageColor

# Define color palettes inspired by psychedelic and surrealist aesthetics
PALETTES = {
    "vivid": ["#ff0f7b", "#ff6f1e", "#ffd300", "#34e89e", "#00c3ff", "#8b00ff"],
    "calm": ["#1b2a49", "#476072", "#4f8a8b", "#f5f1da", "#c8d5b9"],
    "contrast": ["#000000", "#ffffff", "#ff0054", "#0aff99", "#00bbf9"]
}


def parse_size(size: str) -> tuple[int, int]:
    """Parse a WIDTHxHEIGHT string into integers."""
    width, height = size.lower().split("x")
    return int(width), int(height)


def radial_gradient(draw: ImageDraw.ImageDraw, width: int, height: int, colors: List[str]) -> None:
    """Paint a radial gradient background using the provided colors."""
    cx, cy = width // 2, height // 2
    max_radius = int(math.hypot(cx, cy))
    steps = max_radius
    palette_steps = len(colors) - 1
    for r in range(steps, 0, -1):
        t = r / steps
        idx = int(t * palette_steps)
        c1 = ImageColor.getrgb(colors[idx])
        c2 = ImageColor.getrgb(colors[min(idx + 1, palette_steps)])
        interp = tuple(int(c1[i] + (c2[i] - c1[i]) * (t * palette_steps - idx)) for i in range(3))
        bbox = [cx - r, cy - r, cx + r, cy + r]
        draw.ellipse(bbox, fill=interp)


def phyllotaxis(draw: ImageDraw.ImageDraw, width: int, height: int, palette: List[str]) -> None:
    """Render mirrored phyllotaxis pattern to evoke visionary symmetry."""
    cx, cy = width // 2, height // 2
    n_points = 1200
    golden_angle = math.pi * (3 - math.sqrt(5))
    max_radius = min(cx, cy) * 0.95
    for i in range(n_points):
        angle = i * golden_angle
        radius = max_radius * math.sqrt(i / n_points)
        x = cx + radius * math.cos(angle)
        y = cy + radius * math.sin(angle)
        color = palette[i % len(palette)]
        size = int(2 + 4 * i / n_points)
        bbox1 = [x - size, y - size, x + size, y + size]
        bbox2 = [2 * cx - x - size, y - size, 2 * cx - x + size, y + size]
        draw.ellipse(bbox1, fill=color)
        draw.ellipse(bbox2, fill=color)


def main() -> None:
    """Parse arguments and orchestrate artwork generation."""
    parser = argparse.ArgumentParser(description="Generate visionary spiral art.")
    parser.add_argument("--palette", choices=PALETTES.keys(), default="vivid",
                        help="Color palette to use")
    parser.add_argument("--size", default="1920x1080",
                        help="Resolution as WIDTHxHEIGHT")
    parser.add_argument("--output", default="Visionary_Dream.png",
                        help="Output image filename")
    args = parser.parse_args()

    width, height = parse_size(args.size)
    palette = PALETTES[args.palette]

    # Create image canvas
    image = Image.new("RGB", (width, height))
    draw = ImageDraw.Draw(image, "RGBA")

    # Apply gradient background using first and last palette colors
    gradient_colors = [palette[0], palette[-1]]
    radial_gradient(draw, width, height, gradient_colors)

    # Draw spiral pattern with symmetry
    phyllotaxis(draw, width, height, palette)

    # Save result
    output_path = Path(args.output)
    image.save(output_path)
    print(f"Artwork saved to {output_path}")

# Third-party library imports
from PIL import Image, ImageDraw, ImageColor


def hex_to_rgba(hex_color: str, alpha: int = 255) -> tuple:
    """Convert a hex color to an RGBA tuple."""
    r, g, b = ImageColor.getrgb(hex_color)
    return (r, g, b, alpha)


def generate_art(width: int, height: int, palette_name: str) -> Image.Image:
    """Render the visionary spiral artwork using the chosen palette."""
    # Define palettes inspired by Alex Grey and surrealism
    palettes = {
        "alex_grey": ["#0a0b6f", "#2300a9", "#2e44ff", "#f5a623", "#ffdd55", "#e30b5c"],
        "surrealism": ["#ff6f61", "#6b5b95", "#88b04b", "#f7cac9", "#92a8d1", "#ffef96"],
    }

    # Create a blank canvas
    image = Image.new("RGBA", (width, height), "black")
    draw = ImageDraw.Draw(image, "RGBA")

    # Establish center point and maximum radius
    cx, cy = width / 2, height / 2
    max_radius = min(cx, cy) * 0.95
    colors = palettes[palette_name]

    # Draw spiral of semi-transparent circles
    for i in range(720):
        angle = i * math.pi / 180
        radius = max_radius * i / 720
        x = cx + math.cos(angle) * radius
        y = cy + math.sin(angle) * radius
        color = hex_to_rgba(colors[i % len(colors)], 180)
        size = 8 + (i % 20)
        draw.ellipse([(x - size, y - size), (x + size, y + size)], fill=color)

    # Overlay radial symmetry lines
    for step in range(0, 360, 5):
        angle = math.radians(step)
        color = hex_to_rgba(colors[step % len(colors)], 100)
        x = cx + math.cos(angle) * max_radius
        y = cy + math.sin(angle) * max_radius
        draw.line([(cx, cy), (x, y)], fill=color, width=3)

    return image


def main() -> None:
    """Parse arguments and generate the artwork."""
    parser = argparse.ArgumentParser(description="Render a visionary spiral artwork.")
    parser.add_argument("--width", type=int, default=2048, help="Image width in pixels")
    parser.add_argument("--height", type=int, default=2048, help="Image height in pixels")
    parser.add_argument(
        "--palette",
        choices=["alex_grey", "surrealism"],
        default="alex_grey",
        help="Color palette to use for the artwork",
    )
    args = parser.parse_args()

    # Generate the artwork
    art = generate_art(args.width, args.height, args.palette)

    # Save output image
    output_path = Path("Visionary_Dream.png")
    art.save(output_path)
    print(f"Art saved to {output_path.resolve()}")

Produce a museum-quality spiral composition inspired by Alex Grey and surrealism.
The image is saved as "Visionary_Dream.png".
"""

# Import required libraries
import math
from pathlib import Path
from random import random
from PIL import Image, ImageDraw

# Canvas resolution
WIDTH, HEIGHT = 1920, 1080

# Color palette inspired by Alex Grey
PALETTE = [
    (10, 15, 37),     # midnight blue
    (42, 31, 114),    # deep indigo
    (104, 68, 197),   # violet
    (194, 124, 245),  # lavender
    (255, 221, 0),    # golden yellow
    (255, 82, 0),     # orange
]

def blend(c1, c2, t):
    """Linearly blend two RGB colors."""
    return tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))

def gradient_background(img, top, bottom):
    """Fill the canvas with a vertical gradient."""
    draw = ImageDraw.Draw(img)
    for y in range(HEIGHT):
        t = y / HEIGHT
        color = blend(top, bottom, t)
        draw.line([(0, y), (WIDTH, y)], fill=color)

def draw_spiral(draw, center, turns, step):
    """Render mirrored spiral dots radiating from the center."""
    max_radius = min(WIDTH, HEIGHT) * 0.5
    theta = 0.0
    while theta < 2 * math.pi * turns:
        radius = theta / (2 * math.pi * turns) * max_radius
        x = center[0] + radius * math.cos(theta)
        y = center[1] + radius * math.sin(theta)
        idx = int((theta / (2 * math.pi)) * len(PALETTE)) % len(PALETTE)
        color = PALETTE[idx]
        draw.ellipse([(x-3, y-3), (x+3, y+3)], fill=color)
        draw.ellipse([(WIDTH - x -3, y-3), (WIDTH - x +3, y+3)], fill=color)
        theta += step

def draw_circles(draw, center, count):
    """Add concentric circles for a cymatic effect."""
    max_radius = min(WIDTH, HEIGHT) * 0.4
    for i in range(count):
        t = i / count
        radius = max_radius * t
        color = PALETTE[i % len(PALETTE)]
        bbox = [
            center[0] - radius,
            center[1] - radius,
            center[0] + radius,
            center[1] + radius,
        ]
        draw.ellipse(bbox, outline=color, width=2)

def main():
    """Generate and save the visionary artwork."""
    # Create image and gradient background
    img = Image.new("RGB", (WIDTH, HEIGHT))
    gradient_background(img, PALETTE[0], PALETTE[3])

    draw = ImageDraw.Draw(img)

    # Draw concentric circles
    draw_circles(draw, (WIDTH/2, HEIGHT/2), 20)

    # Overlay mirrored spirals
    draw_spiral(draw, (WIDTH/2, HEIGHT/2), turns=7, step=0.1)

    # Save output
    img.save("Visionary_Dream.png")

if __name__ == "__main__":
    main()
