"""Placeholder module for building fusion environments."""
from pathlib import Path
import json


def generate(realm_id: str, base_path: Path) -> dict:
    """Return realm configuration for a given id."""
    with open(base_path / "data" / "realms.json", "r", encoding="utf-8") as f:
        realms = json.load(f)
    return realms.get(realm_id, {})
