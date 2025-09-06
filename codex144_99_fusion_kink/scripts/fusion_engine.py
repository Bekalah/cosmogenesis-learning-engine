"""Fusion engine mapping codex nodes into narrative realms."""
import json
from pathlib import Path


def load_data(base_path: Path):
    """Load canonical nodes along with fusion matrix and realms."""
    # Pull the full codex node definitions from the main dataset
    nodes_path = base_path.parent / "codex-144-99" / "data" / "codex_nodes_full.json"
    with open(nodes_path, "r", encoding="utf-8") as f:
        node_list = json.load(f)
    nodes = {str(n.get("node_id")): n for n in node_list}

    with open(base_path / "data" / "fusion_matrix.json", "r", encoding="utf-8") as f:
        fusion = json.load(f)
    with open(base_path / "data" / "realms.json", "r", encoding="utf-8") as f:
        realms = json.load(f)
    return nodes, fusion, realms


def fuse_nodes(node_a: str, node_b: str, base_path: Path) -> str:
    """Fuse two nodes and return a short narrative string."""
    nodes, fusion_matrix, realms = load_data(base_path)
    key = f"{node_a}-{node_b}"
    realm_id = fusion_matrix.get(key)
    if not realm_id:
        return "The nodes refuse to merge."
    realm = realms.get(realm_id, {})
    a = nodes.get(node_a, {}).get("name", node_a)
    b = nodes.get(node_b, {}).get("name", node_b)
    name = realm.get("name", "Unknown Realm")
    desc = realm.get("description", "Mysteries unfold.")
    return f"{a} dances with {b} in the {name}. {desc}"
