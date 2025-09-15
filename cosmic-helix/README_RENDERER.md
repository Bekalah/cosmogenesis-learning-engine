# Cosmic Helix Renderer

Static, offline HTML+Canvas renderer for layered sacred geometry.

## Usage
1. Open `index.html` in any modern browser (double-click; no server or network needed).
2. A 1440×900 canvas renders four static layers:
   - **Vesica field** — intersecting circle grid.
   - **Tree-of-Life scaffold** — ten sephirot connected by twenty-two paths.
   - **Fibonacci curve** — golden spiral polyline.
   - **Double-helix lattice** — two phase-shifted sine tracks.
3. Palette colours come from `data/palette.json`. If the file is missing, the page shows a small notice and falls back to safe defaults.

## ND-safe choices
- Static drawing only; no animation, autoplay, or flashing.
- Soft contrast palette and generous spacing ease sensory load.
- Layer order gives depth without motion.
- Geometry parameters reference numerology constants 3, 7, 9, 11, 22, 33, 99, 144.

## Design notes
- Pure ES module in `js/helix-renderer.mjs`; functions are small and well commented.
- ASCII quotes only, UTF-8, LF newlines.
- Works fully offline; no external libraries or workflows.

## Extending
Add new draw functions in `js/helix-renderer.mjs` while preserving the calm visual hierarchy and ND-safe principles.
