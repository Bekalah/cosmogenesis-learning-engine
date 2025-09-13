# Cosmic Helix Renderer
*Per Texturas Numerorum, Spira Loquitur.*

Offline, ND-safe canvas sketch for layered sacred geometry.

## Usage
1. Open `index.html` in any modern browser (no server needed).
2. A 1440×900 canvas renders four static layers:
   - **Vesica field** — intersecting circles forming a calm grid.
   - **Tree-of-Life scaffold** — ten sephirot linked by twenty-two paths.
   - **Fibonacci curve** — golden spiral polyline anchored to centre.
   - **Double-helix lattice** — two phase-shifted sine tracks.
3. Palette colours live in `data/palette.json`. Missing data triggers a gentle notice and safe defaults.

## ND-safe notes
- Static drawing; no animation or autoplay.
- Soft contrast palette and generous spacing reduce sensory strain.
- Layer order clarifies depth without flashing.
- Geometry parameters lean on numerology constants 3, 7, 9, 11, 22, 33, 99, 144.

## Design notes
- Pure ES module (`js/helix-renderer.mjs`) with small, well-commented functions.
- ASCII quotes only, UTF-8, LF newlines.
- Works offline by double-clicking `index.html`; no network requests.

## Extending
Add new draw functions in `js/helix-renderer.mjs` while preserving the calm hierarchy and ND-safe choices.

