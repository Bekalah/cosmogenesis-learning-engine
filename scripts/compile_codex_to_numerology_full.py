#!/usr/bin/env python3
"""Compile Codex 144:99 nodes into the numerology registry."""

from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
CODEX_PATH = REPO_ROOT / "codex-144-99" / "data" / "codex_master_min.json"
OUTPUT_PATH = REPO_ROOT / "registry" / "numerology_full.json"

CONSTANT_RECORDS = [
    {
        "type": "constant",
        "value": 3,
        "name": "Triadic Seed",
        "principles": ["creation", "body-mind-spirit", "vesica layering"],
        "applications": "Used for Recognition stage prompts and Vesica lens compositions.",
        "citations": [
            "docs/codex-14499-research.md · Architecture",
            "docs/manifesto.md · Guiding principles",
        ],
    },
    {
        "type": "constant",
        "value": 7,
        "name": "Seven Rays",
        "principles": ["auric rays", "initiation steps", "tone ladder"],
        "applications": "Maps to ray-based palettes and pedagogical pacing.",
        "citations": [
            "docs/codex-14499-research.md · Tradition Currents",
            "MAJOR_ARCANA_REGISTRY.md · Ray & Angel notes",
        ],
    },
    {
        "type": "constant",
        "value": 9,
        "name": "Completion Spiral",
        "principles": ["cycles", "angelic chorus", "Indra net closure"],
        "applications": "Frames Integration prompts and Solfeggio harmonics.",
        "citations": [
            "docs/codex-14499-research.md · Core Identity",
            "registry/registry.json · ATEL-001 layer annotations",
        ],
    },
    {
        "type": "constant",
        "value": 11,
        "name": "Twin Pillar Gate",
        "principles": ["threshold", "mirror guardians", "Aleph-Path"],
        "applications": "Highlights double-column layouts in Study mode.",
        "citations": [
            "MAJOR_ARCANA_REGISTRY.md · The Fool",
            "docs/codex-14499-research.md · Tradition Currents",
        ],
    },
    {
        "type": "constant",
        "value": 22,
        "name": "Path Matrix",
        "principles": ["tarot major arcana", "letter-path bridges"],
        "applications": "Aligns Play mode story beats with major arcana guardians.",
        "citations": [
            "TAROT_SYSTEM.md · Major arcana registry",
            "docs/codex-14499-research.md · Dataset Anatomy",
        ],
    },
    {
        "type": "constant",
        "value": 33,
        "name": "Spinal Ladder",
        "principles": ["vertebrae", "cathedral spine", "initiation climbs"],
        "applications": "Controls Study exports and cathedral navigation rails.",
        "citations": [
            "docs/codex-14499-research.md · Lore Directive",
            "registry/main_registry.md · INNER_BOOK section",
        ],
    },
    {
        "type": "constant",
        "value": 99,
        "name": "Resonant Choir",
        "principles": ["angelic cadence", "node resonance"],
        "applications": "Sets cadence for atlas pagination and soundbed selections.",
        "citations": [
            "docs/codex-14499-research.md · Core Identity",
            "registry/registry.json · metadata block",
        ],
    },
    {
        "type": "constant",
        "value": 144,
        "name": "Codex Grid",
        "principles": ["12x12 lattice", "Indra net", "node locking"],
        "applications": "Primary address space for the world-building generator.",
        "citations": [
            "docs/codex-14499-research.md · Architecture",
            "registry/registry.json · version header",
        ],
    },
]


def digital_root(value: int) -> int:
    digits = value
    while digits > 9:
        digits = sum(int(char) for char in str(digits))
    return digits


def load_codex_records() -> list[dict]:
    data = json.loads(CODEX_PATH.read_text())
    records: list[dict] = []
    for node in data:
        node_id = int(node.get("node_id", 0))
        records.append(
            {
                "type": "node",
                "id": node_id,
                "name": node.get("name"),
                "angel": node.get("shem_angel"),
                "daemon": node.get("goetic_demon"),
                "reduction": digital_root(node_id),
                "citations": [
                    "codex-144-99/data/codex_master_min.json",
                    "docs/codex-14499-research.md · Dataset Anatomy",
                ],
            }
        )
    return records


def main() -> None:
    if not CODEX_PATH.exists():
        raise SystemExit(f"Missing codex dataset at {CODEX_PATH}")
    records = CONSTANT_RECORDS + load_codex_records()
    payload = {
        "generatedAt": datetime.utcnow().isoformat(timespec="seconds") + "Z",
        "records": records,
    }
    OUTPUT_PATH.write_text(json.dumps(payload, indent=2))
    print(f"Wrote {len(records)} numerology records to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
