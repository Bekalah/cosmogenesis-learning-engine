# Codex 144:99 Data

This directory houses the locked minimal manifest and supporting taxonomies for the Codex.

- `codex_master_min.json` – seed nodes. Currently includes first 16 nodes.
- `taxonomies/` – shared lookup tables such as color palettes and canonical angelic and goetic names.

Run `python ../scripts/build_codex.py --input codex_master_min.json --output codex_nodes_full.json` to generate the expanded data.
