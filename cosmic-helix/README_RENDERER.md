# Cosmic Helix Renderer
Per Texturas Numerorum, Spira Loquitur.

Offline, ND-safe canvas sketch for layered sacred geometry.

## Usage
1. Open `index.html` in any modern browser (no server needed).
2. A 1440×900 canvas renders four static layers:
   - **Vesica field** — intersecting circles forming the womb of forms.
   - **Tree-of-Life scaffold** — ten sephirot linked by twenty-two paths.
   - **Fibonacci curve** — golden spiral polyline anchored to centre.
   - **Double-helix lattice** — two phase-shifted sine tracks.
3. Palette can be customised in `data/palette.json`. Missing file triggers a safe internal palette and a notice.

## ND-safe notes
- Static drawing; no animation or autoplay.
- Calm contrast palette reduces sensory strain.
- Layer order clarifies depth without flashing.
- Geometry uses numerology constants 3, 7, 9, 11, 22, 33, 99, 144.

## Design notes
- Pure ES module (`js/helix-renderer.mjs`) with small, well-commented functions.
- ASCII quotes only; UTF-8 LF newlines.
- Works fully offline by double-clicking `index.html`.

## Extending
Add new draw functions in `js/helix-renderer.mjs` while preserving ND-safe layer order and calm contrast.
