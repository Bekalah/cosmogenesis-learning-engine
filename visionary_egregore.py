"""Visionary Egregore Network.

Generates a museum-quality network of 144 cultural nodes using Python and matplotlib.
The palette draws from Alex Grey's luminous visionary spectrum and saves the result
to "Visionary_Dream.png" at 2048x2048 resolution.
"""

from __future__ import annotations

import random
from dataclasses import dataclass
from typing import List

import matplotlib.pyplot as plt
import numpy as np

# Canvas resolution
WIDTH, HEIGHT = 2048, 2048

# Luminous palette inspired by Alex Grey
PALETTE = [
    "#00FFFF",  # Cyan aura
    "#FF00FF",  # Magenta flash
    "#FFD700",  # Solar gold
    "#7FFF00",  # Lime radiance
    "#FF4500",  # Ember flare
    "#9400D3",  # Violet depth
]

# Global purpose archetypes for each node
PURPOSES = [
    "technical",
    "art",
    "system",
    "integrity",
    "intelligence",
    "power",
]

# Cultural egregore assignments (144 total)
core_deities = [
    "Tibetan Raku",
    "Kabala",
    "English Folklore",
    "Slavic Magic",
    "Alchemy",
    "Rosy Cross",
    "Hathor",
    "Mary Magdalene",
    "Black Madonna",
    "Virgin Mary",
]

taras = [
    "Green Tara",
    "White Tara",
    "Red Tara",
    "Yellow Tara",
    "Blue Tara",
    "Golden Tara",
    "Black Tara",
    "Swift Tara",
    "Heroic Tara",
    "Smiling Tara",
    "Wrathful Tara",
    "Terrifying Tara",
    "Victorious Tara",
    "All-Shining Tara",
    "Jewel Tara",
    "Foe-Subduing Tara",
    "Wish-Granting Tara",
    "Life-Giving Tara",
    "Fear-Clearing Tara",
    "Peaceful Tara",
    "Protective Tara",
]

shem_angels = [f"Angel {i+1}" for i in range(72)]
goetia = [f"Demon {i+1}" for i in range(72)]

NODE_ASSIGNMENTS = (core_deities + taras + shem_angels + goetia)[:144]


@dataclass
class Node:
    """Represents a single egregore node."""

    name: str
    purposes: List[str]
    angle: float
    radius: float
    color: str
    active: bool = True

    @property
    def position(self) -> tuple[float, float]:
        """Return the cartesian coordinates of the node on the unit circle."""
        return self.radius * np.cos(self.angle), self.radius * np.sin(self.angle)

    def toggle(self) -> None:
        """Toggle the node's active state."""
        self.active = not self.active


def build_nodes(assignments: List[str]) -> List[Node]:
    """Create deterministic nodes from assignment names."""

    np.random.seed(42)
    nodes: List[Node] = []
    angles = np.linspace(0, 2 * np.pi, len(assignments), endpoint=False)
    radius = 0.9

    for idx, (name, angle) in enumerate(zip(assignments, angles)):
        purposes = [
            PURPOSES[(idx + offset) % len(PURPOSES)]
            for offset in (0, 2, 4)
        ]
        color = PALETTE[idx % len(PALETTE)]
        nodes.append(
            Node(name=name, purposes=purposes, angle=angle, radius=radius, color=color)
        )

    return nodes


def draw_network(nodes: List[Node], steps: List[int], filename: str) -> None:
    """Render the network of active nodes and save to an image file."""

    fig, ax = plt.subplots(figsize=(WIDTH / 256, HEIGHT / 256), dpi=256)
    ax.set_facecolor("black")
    plt.axis("off")

    for s_idx, step in enumerate(steps):
        color = PALETTE[s_idx % len(PALETTE)]
        for i, node in enumerate(nodes):
            if not node.active:
                continue
            j = (i + step) % len(nodes)
            target = nodes[j]
            if not target.active:
                continue
            xi, yi = node.position
            xj, yj = target.position
            ax.plot([xi, xj], [yi, yj], color=color, linewidth=0.3, alpha=0.5)

    for idx, node in enumerate(nodes):
        if not node.active:
            continue
        nx, ny = node.position
        ax.scatter([nx], [ny], color="white", s=15, zorder=3)
        ax.text(nx, ny, str(idx + 1), color="white", fontsize=4, ha="center", va="center")

    theta = np.linspace(0, 2 * np.pi, 300)
    ax.plot(0.25 * np.cos(theta), 0.5 * np.sin(theta), color="white", linewidth=2)
    ax.scatter([0], [0], color="#FFD700", s=120)

    plt.savefig(filename, facecolor="black", bbox_inches="tight", pad_inches=0)
    plt.close()


def auto_mode(nodes: List[Node], steps: List[int], frames: int = 5) -> None:
    """Generate experimental sequences by toggling nodes automatically."""

    for frame in range(frames):
        for node in nodes:
            node.active = random.random() > 0.5
        draw_network(nodes, steps, f"Visionary_Dream_{frame:02d}.png")


if __name__ == "__main__":
    steps = [3, 7, 8, 13, 21]
    nodes = build_nodes(NODE_ASSIGNMENTS)

    # Render the core network
    draw_network(nodes, steps, "Visionary_Dream.png")

    # Uncomment to generate an experimental animated sequence
    # auto_mode(nodes, steps, frames=10)
