"""Interactive Codex 144:99 adventure explorer.

This CLI tool lets users traverse codex nodes with optional cultural
flavors while generating simple art and music prompts for each node.
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List

from PIL import Image, ImageDraw

# Path to the codex dataset
DATA_PATH = (
    Path(__file__).resolve().parent.parent / "codex-144-99" / "data" / "codex_nodes_full.json"
)


def load_nodes() -> Dict[int, Dict[str, Any]]:
    """Load all nodes indexed by their id."""
    with DATA_PATH.open() as f:
        nodes: List[Dict[str, Any]] = json.load(f)
    return {n["node_id"]: n for n in nodes}


def filter_entries(entries: List[Dict[str, str]], culture: str) -> List[str]:
    """Return names matching the chosen culture (case insensitive)."""
    culture = culture.lower()
    return [e["name"] for e in entries if culture in e["culture"].lower()]


def describe_node(node: Dict[str, Any], culture: str) -> None:
    """Print a textual description of the node honoring cultural flavor."""
    print(f"\n== Node {node['node_id']}: {node['name']} ==")
    print(node.get("function", ""))
    print(f"Element: {node.get('element')} | Chakra: {node.get('chakra')} | Planet: {node.get('planet')}")

    gods = filter_entries(node.get("gods", []), culture)
    goddesses = filter_entries(node.get("goddesses", []), culture)
    if not gods and not goddesses:
        gods = [g["name"] for g in node.get("gods", [])]
        goddesses = [g["name"] for g in node.get("goddesses", [])]

    if gods:
        print("Gods:", ", ".join(gods))
    if goddesses:
        print("Goddesses:", ", ".join(goddesses))

    color = node.get("color_scheme", {})
    print(
        "Palette:",
        color.get("primary", "?"),
        color.get("secondary", "?"),
        color.get("accent", "?"),
    )

    music = node.get("music_profile", {})
    instruments = ", ".join(music.get("instruments", []))
    print(
        f"Music: {music.get('root_note')} {music.get('scale')} @ {music.get('bpm')} BPM | instruments: {instruments}"
    )
    print(f"Solfeggio: {node.get('solfeggio_freq')}")


def generate_node_art(node: Dict[str, Any], output: Path = Path("Visionary_Dream.png")) -> None:
    """Create a simple gradient image using the node's color scheme."""
    width, height = 800, 800
    colors = node.get("color_scheme", {})
    primary = colors.get("primary", "#000000")
    secondary = colors.get("secondary", "#111111")
    accent = colors.get("accent", "#FFFFFF")

    img = Image.new("RGB", (width, height), primary)
    draw = ImageDraw.Draw(img)
    draw.rectangle([0, height // 2, width, height], fill=secondary)
    draw.ellipse(
        [width // 4, height // 4, width * 3 // 4, height * 3 // 4],
        outline=accent,
        width=12,
    )
    img.save(output)
    print(f"Art saved to {output.resolve()}")


def play_node_music(node: Dict[str, Any]) -> None:
    """Print a placeholder for the node's musical profile."""
    music = node.get("music_profile", {})
    instruments = ", ".join(music.get("instruments", []))
    print(
        f"Imagined soundscape: {music.get('root_note')} {music.get('scale')} at {music.get('bpm')} BPM with {instruments}."
    )
    print(f"Solfeggio frequency {node.get('solfeggio_freq')} resonates in the background.")


def main() -> None:
    nodes = load_nodes()
    culture = input(
        "Choose cultural flavor (English, Christian, Alchemy, Druid, Egyptian, etc.): "
    ).strip().lower()

    current = 1
    while True:
        node = nodes.get(current)
        if not node:
            print("Unknown node; resetting to 1.")
            current = 1
            continue

        describe_node(node, culture)
        cmd = input("[n]ext node, [g]enerate art, [m]usic, [q]uit: ").strip().lower()
        if cmd == "q":
            break
        if cmd == "g":
            generate_node_art(node)
        elif cmd == "m":
            play_node_music(node)
        elif cmd == "n":
            try:
                nxt = int(input("Enter next node id (1-144): "))
                if nxt in nodes:
                    current = nxt
                else:
                    print("Invalid node id")
            except ValueError:
                print("Please enter a valid number")
        else:
            print("Unknown command")


if __name__ == "__main__":
    main()
