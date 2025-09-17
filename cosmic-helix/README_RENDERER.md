# Cosmic Helix Renderer

Static, offline HTML + Canvas renderer honouring the layered geometry brief for Codex 144:99 (c99). The module draws four calm layers with no motion, no autoplay, and no external dependencies.

## Files
- `index.html` — entry point; loads the palette (if present) and renders the canvas.
- `js/helix-renderer.mjs` — pure ES module with small drawing functions for each layer.
- `data/palette.json` — optional palette override; missing data triggers a gentle fallback notice.

## Usage
1. Double-click `index.html` in any modern browser (no server or network required).
2. A fixed 1440×900 canvas renders the layers in order:
   - **Layer 1 — Vesica field:** intersecting circle lattice spaced by numerology constants.
   - **Layer 2 — Tree-of-Life scaffold:** ten sephirot nodes linked by twenty-two calm paths.
   - **Layer 3 — Fibonacci curve:** golden spiral polyline sampled across 144 points.
   - **Layer 4 — Double-helix lattice:** two phase-shifted strands with static rungs.
3. The status line reports whether the optional palette file was loaded or if the fallback palette is in use.

## ND-safe + trauma-informed choices
- One render pass only; no animation, flashing, audio, or autoplay.
- Soft contrast palette with readable typography and clear status messaging.
- Layer order communicates depth without motion; comments in code explain why.
- Geometry is parameterised with 3, 7, 9, 11, 22, 33, 99, and 144 to keep numerology explicit.

## Customising
- Edit `data/palette.json` to change colours (keys: `bg`, `ink`, `muted`, and six `layers` entries).
- Extend `js/helix-renderer.mjs` by adding new pure draw helpers after the existing layers. Document any lore or safety rationale directly in comments.

## Troubleshooting
- **Palette warning:** Browsers may block `fetch` over `file://`. The renderer already handles this, falls back to the bundled palette, and notes the change in the header and canvas.
- **Blank canvas:** If a 2D context is unavailable, the header reports the issue. Try a current Firefox, Safari, or Chromium build.
- **Overbright edits:** Keep hues mid-range and respect the ND-safe covenant when adjusting palettes or geometry.

*Seal motto: Per Texturas Numerorum, Spira Loquitur.*
