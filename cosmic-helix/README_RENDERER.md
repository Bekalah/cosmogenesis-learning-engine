# Cosmic Helix Renderer

Static, offline canvas that layers vesica field, Tree-of-Life scaffold, Fibonacci curve, and a fixed double-helix lattice. Designed for ND-safe viewing with calm contrast and zero motion.

## Files
- `index.html` – entry point; double-click to run.
- `js/helix-renderer.mjs` – pure drawing routines.
- `data/palette.json` – optional colors; missing file triggers a gentle fallback notice.

## Usage
1. Open `index.html` in any modern browser. No server or network requests.
2. A 1440x900 canvas renders four ordered layers:
   - Vesica field
   - Tree-of-Life nodes and paths
   - Fibonacci curve
   - Double-helix lattice
3. The status line reports palette load or fallback.

## ND-safe choices
- Static draw only; no animation, autoplay, or flashing.
- Soft contrast palette for readability.
- Layer order conveys depth without motion.
- Geometry constants weave numerology: 3, 7, 9, 11, 22, 33, 99, 144.

## Customizing
Adjust `data/palette.json` or extend `js/helix-renderer.mjs` with new pure functions while preserving calm layer order.

