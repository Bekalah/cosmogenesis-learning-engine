"""Visionary Dream Generator.

Render a spiral artwork using real-world case studies. The script offers
multiple color palettes (vivid, calm, contrast) inspired by Alex Grey,
surrealism, and accessible design. Output is saved as "Visionary_Dream.png".
"""

import argparse
import json
import math
import random
from pathlib import Path
from PIL import Image, ImageDraw

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
