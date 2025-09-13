# Cosmic Helix Renderer

*Seal Motto: Per Texturas Numerorum, Spira Loquitur.*

Offline, ND-safe canvas sketch for layered sacred geometry.

Static HTML and Canvas were chosen so the geometry renders locally without
network calls or heavy libraries, keeping the experience deterministic and
motion-free.

## Usage
1. Open `index.html` directly in any modern browser; no server or network needed.
2. A 1440×900 canvas draws four static layers:

   - **Vesica field** — intersecting circles forming a calm grid.
   - **Tree-of-Life scaffold** — ten sephirot linked by twenty-two paths.
   - **Fibonacci curve** — golden spiral polyline anchored to centre.
   - **Double-helix lattice** — two phase-shifted sine tracks.

Palette values live in `data/palette.json`. Missing data triggers a gentle
notice and safe defaults.

## ND-safe notes
- Static drawing only; no animation, autoplay, or flashing.
- Muted contrast palette and generous spacing ease sensory load.
- Layer order clarifies depth without motion.
- Geometry routines lean on numerology constants 3, 7, 9, 11, 22, 33, 99, 144.

## Design notes
- Pure ES module (`js/helix-renderer.mjs`) with small, well-commented functions.
- ASCII quotes, UTF-8, LF newlines.
- Works entirely offline by double-clicking `index.html`.

## Extending
Add new draw functions in `js/helix-renderer.mjs` while preserving the ND-safe
layer order.

