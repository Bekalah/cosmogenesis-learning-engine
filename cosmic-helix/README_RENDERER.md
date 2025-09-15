# Cosmic Helix Renderer

Offline, ND-safe canvas sketch for layered sacred geometry.

## Usage
1. Double-click `index.html` in any modern browser (no server needed).
2. A 1440x900 canvas renders four static layers:
   - Vesica field — intersecting circle grid.
   - Tree-of-Life scaffold — ten sephirot with twenty-two paths.
   - Fibonacci curve — golden spiral polyline.
   - Double-helix lattice — two phase-shifted sine tracks.
3. Palette colours live in `data/palette.json`. Missing file triggers a gentle notice and safe defaults.

## ND-safe choices
- Static drawing; no motion, audio, or autoplay.
- Soft contrast palette and generous spacing for readability.
- Layer order clarifies depth without flashing.
- Geometry parameters use numerology constants 3, 7, 9, 11, 22, 33, 99, 144.

## Design notes
- Pure ES module `js/helix-renderer.mjs` with small, well-commented functions.
- ASCII quotes only, UTF-8, LF newlines.
- Works fully offline by double-clicking `index.html`.
