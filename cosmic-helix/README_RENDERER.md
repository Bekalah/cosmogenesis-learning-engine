# Cosmic Helix Renderer

Offline, ND-safe canvas sketch for layered sacred geometry.

## Usage
1. Open `index.html` in any modern browser (no server needed).
2. A 1440×900 canvas renders four static layers:
   - **Vesica field** — intersecting circle grid.
   - **Tree-of-Life scaffold** — ten sephirot with twenty-two paths.
   - **Fibonacci curve** — golden spiral polyline.
   - **Double-helix lattice** — two phase-shifted sine tracks.

## Customizing
- Colors live in `data/palette.json`. If the file is missing, a status note appears and safe defaults load.

## ND-safe notes
- Static render; no animation or audio.
- Soft contrast palette and generous spacing reduce sensory load.
- Geometry parameters reference numerology constants 3, 7, 9, 11, 22, 33, 99, 144.

## Design notes
- Pure ES module in `js/helix-renderer.mjs` with small functions and ASCII quotes.
- Works offline; no network requests or external libraries.
