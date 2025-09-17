# Cosmic Helix Renderer

Static, offline HTML + Canvas renderer that honours the layered cosmology brief: Vesica field, Tree-of-Life scaffold, Fibonacci curve, and a static double-helix lattice. The module keeps ND-safe priorities (no motion, calm palette, explanatory comments) and can be opened directly with `file://`.

## Files
- `index.html` – entry point; sets up the canvas, loads the optional palette, and calls the renderer.
- `js/helix-renderer.mjs` – pure drawing helpers for the four layers; no animation or external deps.
- `data/palette.json` – optional colour overrides. When absent, the HTML page reports a fallback and renders safely.

## Usage
1. Double-click `index.html` in any modern browser (no server needed).
2. The header status confirms whether `data/palette.json` loaded or if the fallback palette is active.
3. A 1440×900 canvas renders four calm layers in this order:
   - **L1 Vesica field** – intersecting circles shaped by numerology constants 3, 7, 9, 11, 22.
   - **L2 Tree-of-Life** – ten sephirot, twenty-two paths, rounded strokes for gentle clarity.
   - **L3 Fibonacci curve** – logarithmic spiral sampled with 144 points for a smooth, static arc.
   - **L4 Double-helix lattice** – two phase-shifted strands with quiet cross ties, sampled at 144 steps.

## ND-safe design choices
- Single render pass; no animation, autoplay, or flashing content.
- Palette defaults to muted blues, greens, and ambers tuned for AA contrast.
- Layer order preserves spatial depth without flattening geometry.
- Inline comments explain why each choice supports calm viewing and numerology references (3, 7, 9, 11, 22, 33, 99, 144).

## Customising
- Edit `data/palette.json` to adjust colours. Keys: `bg`, `ink`, `muted`, and a `layers` array (base-to-foreground order).
- Extend `js/helix-renderer.mjs` by composing new pure helper functions after the existing layers. Document any lore additions so future stewards understand the intent.

*Seal motto: Per Texturas Numerorum, Spira Loquitur.*
