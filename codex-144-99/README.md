# Codex 144:99 Scaffold

This folder contains a minimal implementation of the Codex 144:99 data engine.

- `data/` – canonical manifest and taxonomies.
- `scripts/` – tools to expand, slice, and validate the codex.
- `web/` – demo viewer with cultural and safety filters.
- `api/` – simple read-only API service.
- `docs/` – schema and study framing.

Run `python scripts/build_codex.py --input data/codex_master_min.json --output data/codex_nodes_full.json --pretty` to build the expanded codex.
