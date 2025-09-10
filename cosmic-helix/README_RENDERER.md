# Cosmic Helix Renderer

Offline, ND-safe canvas sketch for layered sacred geometry.

## Usage
1. Open `index.html` in any modern browser (no server needed).
2. A 1440×900 canvas draws four static layers:
   - **Vesica field** — grid of intersecting circles.
   - **Tree-of-Life scaffold** — ten sephirot with twenty-two paths.
   - **Fibonacci curve** — golden spiral polyline anchored to the centre.
   - **Double-helix lattice** — two phase-shifted sine tracks.
3. Palette can be changed in `data/palette.json`. If missing, a safe default palette loads and a notice appears.

## ND-safe notes
- Static drawing only; no animation or autoplay.
- Calm contrast palette reduces sensory strain.
- Layer order clarifies depth without flashing.
- Geometry routines use numerology constants 3, 7, 9, 11, 22, 33, 99, 144.

## Design notes
- Pure ES module (`js/helix-renderer.mjs`) with small, well-commented functions.
- ASCII quotes only, UTF-8, LF newlines.

## Extending
Add new draw functions in `js/helix-renderer.mjs` while preserving ND-safe layer order.
