# Cosmic Helix Renderer
*Per Texturas Numerorum, Spira Loquitur.*

Offline, ND-safe canvas sketch for layered sacred geometry.

## Usage
1. Double-click `index.html` in any modern browser (no server needed).
2. A 1440×900 canvas renders four static layers:
   - **Vesica field** — intersecting circles forming the womb of forms.
   - **Tree-of-Life scaffold** — ten sephirot with twenty-two paths.
   - **Fibonacci curve** — golden spiral polyline anchored to centre.
   - **Double-helix lattice** — two phase-shifted sine tracks.
3. Palette colours live in `data/palette.json`. Missing data triggers a gentle notice and safe defaults.

## ND-safe notes
- Static drawing; no animation or autoplay.
- Calm contrast palette reduces sensory strain.
- Layer order clarifies depth without flashing.
- Geometry parameters lean on numerology constants 3, 7, 9, 11, 22, 33, 99, 144.

## Design notes
- Static HTML and Canvas keep rendering local and deterministic.
- Geometry routines live in `js/helix-renderer.mjs` with small pure functions and ASCII quotes only.
- Numerology constants live in `index.html` so symbolic values stay explicit and easy to tweak.

## Extending
The renderer is intentionally minimal. Future layers or overlays can extend `renderHelix` while preserving the calm visual hierarchy.

## Task List
- [ ] Weave cathedral-scale vesica grids to frame expansive worlds.
- [ ] Map Tree-of-Life nodes to sanctuaries like Avalon and mountain temples.
- [ ] Layer Fibonacci paths through oceans, rivers, and volcanic corridors.
- [ ] Cross-link double-helix lattices with rune, tarot, and reiki lore.
- [ ] Keep all additions ND-safe: no motion, calm contrast, pure functions.
