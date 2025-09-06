#!/usr/bin/env python3
"""Generate a bridge mapping Tarot Major Arcana to Codex 144:99 nodes.

Reads the MAJOR_ARCANA_REGISTRY.md for card metadata and matches cards to
Codex nodes via angels, demons, or deity names. The resulting mapping is written
as JSON alongside this script.
Reads TAROT_SYSTEM.md for card metadata and matches cards to Codex nodes via
angels, demons, or deity names. Crystal information is merged with
`assets/crystal_artifacts.json` to provide art and sound assets. The resulting
mapping is written as JSON alongside this script.
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
TAROT_REGISTRY = ROOT / "TAROT_SYSTEM.md"
CRYSTAL_ARTIFACTS = ROOT / "assets" / "crystal_artifacts.json"
CODEX_NODES = ROOT / "codex-144-99" / "data" / "codex_nodes_full.json"
OUTPUT_JSON = Path(__file__).with_name("tarot-codex-bridge.json")

def load_tarot(path: Path) -> Dict[str, Dict[str, List[str] | str]]:
    """Parse the Tarot system into a dict keyed by card name."""
    text = path.read_text(encoding="utf-8")
    cards: Dict[str, Dict[str, List[str] | str]] = {}
    current: str | None = None

    for raw in text.splitlines():
        line = raw.strip()
        if line.startswith("## "):
            left = line[3:].split("—")[0].strip()
        if re.match(r"^[IVXLCDM0-9]+\. ", line):
            left = line.split("—", 1)[0].strip()
            if ". " in left:
                _, name = left.split(". ", 1)
            else:
                name = left
            current = name
            cards[current] = {"angel": "", "demon": "", "deities": []}
        elif current and line.startswith("- Angel/Demon:"):
            cards[current] = {
                "angel": "",
                "demon": "",
                "deities": [],
                "crystal": "",
            }
        elif current and (
            line.startswith("• Angel/Demon:") or line.startswith("- Angel/Demon:")
        ):
            m = re.search(r"Angel/Demon:\s*([^↔]+)↔\s*([^.\n]+)", line)
            if m:
                cards[current]["angel"] = m.group(1).strip()
                cards[current]["demon"] = m.group(2).strip()
        elif current and line.startswith("- Deities:"):
            deities_part = line.split(":", 1)[1].strip().rstrip(".")
            deities = [d.strip() for d in deities_part.split(",")]
            cards[current]["deities"] = deities
    return cards

        elif current and (line.startswith("• Deities:") or line.startswith("- Deities:")):
            deities_part = line.split(":", 1)[1].strip().rstrip(".")
            deities = [d.strip() for d in deities_part.split(",")]
            cards[current]["deities"] = deities
        elif current and (line.startswith("• Crystal:") or line.startswith("- Crystal:")):
            crystal = line.split(":", 1)[1].split("(")[0].strip()
            cards[current]["crystal"] = crystal
    return cards

def load_artifacts(path: Path) -> Dict[str, dict]:
    """Return mapping of crystal name to artifact metadata."""
    with path.open(encoding="utf-8") as f:
        items = json.load(f)
    return {item["name"]: item for item in items}

def load_codex(path: Path) -> List[dict]:
    """Load Codex nodes from JSON."""
    with path.open(encoding="utf-8") as f:
        return json.load(f)

def build_bridge(cards: Dict[str, Dict[str, List[str] | str]], nodes: List[dict]) -> Dict[str, List[int]]:
    """Return mapping of card name to list of matching node IDs."""
    bridge: Dict[str, List[int]] = {}
def build_bridge(
    cards: Dict[str, Dict[str, List[str] | str]],
    nodes: List[dict],
    artifacts: Dict[str, dict],
) -> Dict[str, dict]:
    """Return mapping of card name to Codex IDs and crystal art."""
    bridge: Dict[str, dict] = {}

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

        crystal = info.get("crystal", "")
        artifact = artifacts.get(crystal, {})
        if matches:
            bridge[card_name] = {
                "codex_ids": sorted(matches),
                "crystal": crystal,
                "artifact": artifact,
            }

    return bridge

def main() -> None:
    cards = load_tarot(TAROT_REGISTRY)
    nodes = load_codex(CODEX_NODES)
    bridge = build_bridge(cards, nodes)
    artifacts = load_artifacts(CRYSTAL_ARTIFACTS)
    bridge = build_bridge(cards, nodes, artifacts)
    with OUTPUT_JSON.open("w", encoding="utf-8") as f:
        json.dump(bridge, f, indent=2, ensure_ascii=False)
    print(f"Saved bridge with {len(bridge)} cards to {OUTPUT_JSON}")

if __name__ == "__main__":
    main()
