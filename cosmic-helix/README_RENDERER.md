# Cosmic Helix Renderer

Offline, ND-safe canvas sketch for layered sacred geometry.

## Usage
1. Open `index.html` in any modern browser (no server needed).
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
- Geometry constants 3, 7, 9, 11, 22, 33, 99, and 144 encode project numerology.

## Design notes
- Static HTML and Canvas keep rendering local and deterministic.
- Geometry routines live in `js/helix-renderer.mjs` as small pure functions with ASCII quotes.
- Comments explain ND-safe choices and number bindings.

## Extending
Extend `renderHelix` with additional draw functions while preserving the calm visual hierarchy.

## Related lore
For a meditation on the tesseract as symbol of higher consciousness and non-linear learning, see [docs/tesseract_spiritual.md](../docs/tesseract_spiritual.md).

