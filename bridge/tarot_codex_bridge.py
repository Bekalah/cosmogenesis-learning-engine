#!/usr/bin/env python3
"""Generate a bridge mapping Tarot Major Arcana to Codex 144:99 nodes.

Reads the MAJOR_ARCANA_REGISTRY.md for card metadata and matches cards to
Codex nodes via angels, demons, or deity names. The resulting mapping is written
as JSON alongside this script.
"""
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Dict, List

ROOT = Path(__file__).resolve().parents[1]
TAROT_REGISTRY = ROOT / "MAJOR_ARCANA_REGISTRY.md"
CODEX_NODES = ROOT / "codex-144-99" / "data" / "codex_nodes_full.json"
OUTPUT_JSON = Path(__file__).with_name("tarot-codex-bridge.json")

def load_tarot(path: Path) -> Dict[str, Dict[str, List[str]]]:
    """Parse the Tarot registry into a dict keyed by card name."""
    text = path.read_text(encoding="utf-8")
    cards: Dict[str, Dict[str, List[str] | str]] = {}
    current: str | None = None

    for raw in text.splitlines():
        line = raw.strip()
        if line.startswith("## "):
            left = line[3:].split("—")[0].strip()
            if ". " in left:
                _, name = left.split(". ", 1)
            else:
                name = left
            current = name
            cards[current] = {"angel": "", "demon": "", "deities": []}
        elif current and line.startswith("- Angel/Demon:"):
            m = re.search(r"Angel/Demon:\s*([^↔]+)↔\s*([^.\n]+)", line)
            if m:
                cards[current]["angel"] = m.group(1).strip()
                cards[current]["demon"] = m.group(2).strip()
        elif current and line.startswith("- Deities:"):
            deities_part = line.split(":", 1)[1].strip().rstrip(".")
            deities = [d.strip() for d in deities_part.split(",")]
            cards[current]["deities"] = deities
    return cards

def load_codex(path: Path) -> List[dict]:
    """Load Codex nodes from JSON."""
    with path.open(encoding="utf-8") as f:
        return json.load(f)

def build_bridge(cards: Dict[str, Dict[str, List[str] | str]], nodes: List[dict]) -> Dict[str, List[int]]:
    """Return mapping of card name to list of matching node IDs."""
    bridge: Dict[str, List[int]] = {}

    for card_name, info in cards.items():
        angel = str(info.get("angel", "")).lower()
        demon = str(info.get("demon", "")).lower()
        deities = {d.lower() for d in info.get("deities", [])}
        matches: List[int] = []

        for node in nodes:
            n_angel = str(node.get("shem_angel", "")).lower()
            n_demon = str(node.get("goetic_demon", "")).lower()
            node_deities = {
                g["name"].lower() for g in node.get("gods", []) + node.get("goddesses", [])
            }
            if (
                (angel and n_angel == angel)
                or (demon and n_demon == demon)
                or (deities & node_deities)
            ):
                matches.append(int(node["node_id"]))
        if matches:
            bridge[card_name] = sorted(matches)

    return bridge

def main() -> None:
    cards = load_tarot(TAROT_REGISTRY)
    nodes = load_codex(CODEX_NODES)
    bridge = build_bridge(cards, nodes)
    with OUTPUT_JSON.open("w", encoding="utf-8") as f:
        json.dump(bridge, f, indent=2, ensure_ascii=False)
    print(f"Saved bridge with {len(bridge)} cards to {OUTPUT_JSON}")

if __name__ == "__main__":
    main()
