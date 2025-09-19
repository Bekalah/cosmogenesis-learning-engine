# Octagram Tesseract Renderer

Static, offline-first canvas capsule tuned to the Bridge-of-Eight requirements. The renderer replaces the retired helix module and now loads the octagram tesseract system with ND-safe guarantees.

## Files

- `index.html` — Offline entry point. Loads palette, schema, and node registry, reports status, and invokes the renderer once.
- `js/octagram-tesseract.mjs` — Pure ES module containing geometry routines, palette resolution, schema validation, planetary hour activation, and rendering helpers.
- `js/helix-renderer.mjs` — Compatibility shim that re-exports the octagram module for legacy imports.
- `js/tesseract-toggle.js` — Disables the helix renderer and exposes intensity slider defaults.
- `data/palette.json` — Fallback ND-safe palette; canonical colours live in `data/palettes/tara_21.json`.
- `data/octagram_tesseract_nodes.json` — Registry of Tarot, angel, demon, Tara, planetary-hour nodes.
- `schemas/octagram_tesseract.schema.json` — Validation schema enforcing the C144N pattern and ND-safe requirements.

## Usage

1. Download or clone the repository.
2. Double-click `index.html`. No server or build step required.
3. The loader attempts `data/palettes/tara_21.json` first, falls back to `data/palette.json`, then to a sealed default, reporting status in the header.
4. If the schema or node registry is missing, the renderer surfaces an inline notice and continues with geometry-only output.

## Layer Order (Back to Front)

1. **Vesica Field** — Seven-by-three grid of vesica pairs, dashed axis, soft halo.
2. **Tree-of-Life Scaffold** — Ten sephirot, twenty-two paths, numerology-aligned levels based on CLAUDE-CODEX144-99.
3. **Fibonacci Arc** — Golden-ratio spiral traced with pearlescent markers (no animation).
4. **Octagram Tesseract Lattice** — Three nested octagrams plus a static double helix bridge.
5. **Active Node Overlay** — Optional markers showing which octagram nodes align with the current planetary hour.

## Accessibility & ND-Safe Rationale

- No animation, autoplay, or procedural flicker.
- Palette pulled from Tara references with calm saturation.
- Safe-stop and intensity slider documented in `js/tesseract-toggle.js`.
- Schema validation ensures only ND-safe nodes activate via `activate(id,{nd_safe:true})`.

## Cross-References

- `registry/antahkarana_bridge.json`
- `cosmogenesis/registry/octagram_tesseracts.json`
- `liber-arcanae/cards/_links/octagram_index.json`
- `stone-cathedral/chapels/bridge-of-eight/index.md`
