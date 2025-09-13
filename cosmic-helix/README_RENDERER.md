# Cosmic Helix Renderer

Per Texturas Numerorum, Spira Loquitur.

Offline, ND-safe canvas sketch for layered sacred geometry.

## Usage
1. Open `index.html` in any modern browser (no server needed).
2. A 1440×900 canvas renders four static layers:
   - Vesica field — intersecting circles forming a calm grid.
   - Tree-of-Life scaffold — ten sephirot with twenty-two paths.
   - Fibonacci curve — golden spiral polyline anchored to centre.
   - Double-helix lattice — two phase-shifted sine tracks.
3. Palette colours live in `data/palette.json`. If the file is missing, the renderer falls back to a safe default and shows a notice.

## ND-safe notes
- Static drawing; no animation or autoplay.
- Muted contrast palette reduces sensory strain.
- Layer order clarifies depth without flashing.
- Geometry routines use numerology constants 3, 7, 9, 11, 22, 33, 99, 144.

## Design notes
- Pure ES module `js/helix-renderer.mjs` with small, well-commented functions.
- ASCII quotes only, UTF-8, LF newlines.

## Extending
Add new draw functions in `js/helix-renderer.mjs` while preserving the calm layer order.

