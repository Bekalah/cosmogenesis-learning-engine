# Cosmic Helix Renderer

Static offline HTML+Canvas renderer for layered sacred geometry.

## Usage

1. Open `index.html` directly in a modern browser (no server needed).
2. A 1440×900 canvas draws four calm layers:
   - **Vesica field** – intersecting circle grid.
   - **Tree-of-Life scaffold** – ten sephirot linked by twenty-two paths.
   - **Fibonacci curve** – golden spiral polyline.
   - **Double-helix lattice** – two phase-shifted sine tracks.

Palette values live in `data/palette.json`. If the file is missing, the renderer falls back to safe defaults and displays a small status notice.

## ND-safe notes

- Static render; no animation, autoplay, or flashing.
- Soft contrast palette and generous spacing improve readability.
- Layer order clarifies depth without motion.
- Geometry parameters reference numerology constants 3, 7, 9, 11, 22, 33, 99, 144.

## Design notes

- Pure ES module `js/helix-renderer.mjs` with small, well-commented functions.
- ASCII quotes only, UTF-8, LF newlines.
- Works entirely offline.
