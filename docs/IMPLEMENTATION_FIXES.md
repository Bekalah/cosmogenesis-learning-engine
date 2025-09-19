# Cosmogenesis Learning Engine Implementation Fix

- Replaced helix renderer with the octagram tesseract system.
- Added `js/octagram-tesseract.mjs`, schema validation, planetary hour activation, and ND-safe toggles.
- Palette now sourced from `data/palettes/tara_21.json` with fallback.
- All active nodes validate against `schemas/octagram_tesseract.schema.json` and activate via `activate(id,{nd_safe:true})`.
- Bridge registries updated: `registry/antahkarana_bridge.json`, `cosmogenesis/registry/octagram_tesseracts.json`, `liber-arcanae/cards/_links/octagram_index.json`, `stone-cathedral/chapels/bridge-of-eight/index.md`.
