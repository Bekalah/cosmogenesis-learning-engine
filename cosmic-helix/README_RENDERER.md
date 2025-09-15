# Cosmic Helix Renderer

Static, offline canvas renderer for layered sacred geometry.

## Usage
1. Open `index.html` in any modern browser (double-click, no server needed).
2. A 1440×900 canvas draws four static layers:
   - **Vesica field** – intersecting circle grid.
   - **Tree-of-Life scaffold** – ten sephirot linked by twenty-two paths.
   - **Fibonacci curve** – golden spiral polyline anchored to centre.
   - **Double-helix lattice** – two phase-shifted sine tracks.
3. Palette colours live in `data/palette.json`. Missing data triggers a gentle notice and safe defaults.

## ND-safe design
- Static drawing; no animation, autoplay, or flashing.
- Soft contrast palette and generous spacing reduce sensory load.
- Layer order clarifies depth without motion.
- Geometry parameters reference numerology constants 3, 7, 9, 11, 22, 33, 99, 144.

## Code notes
- Pure ES module `js/helix-renderer.mjs` with small, well-commented functions.
- ASCII quotes only, UTF-8 encoding, LF newlines.
- Works fully offline; no network requests or external libraries.

## Extending
Add new draw functions in `js/helix-renderer.mjs` while preserving the calm visual hierarchy and ND-safe choices.
