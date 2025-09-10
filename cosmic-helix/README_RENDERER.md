Per Texturas Numerorum, Spira Loquitur.  //

# Cosmic Helix Renderer

Offline, ND-safe canvas sketch for layered sacred geometry.

## Usage
1. Open `index.html` in any modern browser (no server needed).
2. A 1440×900 canvas renders four static layers, in order:
   - **Vesica field** — intersecting circles forming the womb of forms.
   - **Tree-of-Life scaffold** — ten sephirot with twenty-two paths.
   - **Fibonacci curve** — golden spiral polyline anchored to centre.
   - **Double-helix lattice** — two phase-shifted sine tracks.
3. Palette can be customized in `data/palette.json`. Missing data triggers a gentle inline notice with safe defaults.

## ND-safe notes
- Static drawing; no animation or autoplay.
- Calm contrast palette reduces sensory strain.
- Layer order clarifies depth without flashing.
- Geometry parameters lean on numerology constants 3, 7, 9, 11, 22, 33, 99, 144.

## Design Notes
- Static HTML and Canvas keep rendering local and deterministic.
- Geometry routines live in `js/helix-renderer.mjs` with small pure functions and ASCII quotes only.
- Numerology constants live in `index.html` and are passed to the renderer so the symbolic values remain explicit and easy to tweak.

## Extending
The renderer is intentionally minimal. Future layers or overlays can be added by extending `renderHelix` with new draw functions while preserving the calm visual hierarchy.

## Related Lore
For a meditation on the tesseract as symbol of higher consciousness and non-linear learning, see [`docs/tesseract_spiritual.md`](../docs/tesseract_spiritual.md). This companion note situates the helix within a wider cosmological frame.

