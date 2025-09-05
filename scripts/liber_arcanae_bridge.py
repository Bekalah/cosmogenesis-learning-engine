#!/usr/bin/env python3
"""Liber Arcanae bridge: export Codex 144:99 nodes mapped to Major Arcana."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List

# Base directories
BASE_DIR = Path(__file__).resolve().parent.parent
CODEX_PATH = BASE_DIR / "codex-144-99" / "data" / "codex_nodes_full.json"
TAROT_PATH = BASE_DIR / "data" / "tarot.majors.json"
OUT_PATH = BASE_DIR / "exports" / "liber_arcanae_tarot_bridge.json"


def load_json(path: Path) -> Any:
    """Return parsed JSON content from ``path``."""
    with path.open() as f:
        return json.load(f)


def build_bridge() -> List[Dict[str, Any]]:
    """Assemble Tarot ↔ Codex mapping for the first 22 nodes."""
    nodes = load_json(CODEX_PATH)
    majors = load_json(TAROT_PATH)
    bridge: List[Dict[str, Any]] = []
    for card, node in zip(majors, nodes):
        bridge.append(
            {
                "card_id": card["id"],
                "card_name": card["name"],
                "meaning": card["meaning"],
                "node_id": node["node_id"],
                "node_name": node["name"],
                "shem_angel": node.get("shem_angel"),
                "goetic_demon": node.get("goetic_demon"),
            }
        )
    return bridge


def main() -> None:
    """Write the bridge file into ``exports`` directory."""
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    bridge = build_bridge()
    with OUT_PATH.open("w") as f:
        json.dump(bridge, f, indent=2)
    print(f"Bridge written to {OUT_PATH}")


if __name__ == "__main__":  # pragma: no cover - script entry point
    main()
