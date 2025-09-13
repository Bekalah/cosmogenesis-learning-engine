# Cosmic Helix Renderer

Offline, ND-safe canvas sketch for layered sacred geometry.

## Usage
1. Open `index.html` in any modern browser (no server needed).
2. A 1440×900 canvas renders four static layers:
   - **Vesica field** — intersecting circles forming a calm grid.
   - **Tree-of-Life scaffold** — ten sephirot linked by twenty-two paths.
   - **Fibonacci curve** — golden spiral polyline anchored to the centre.
   - **Double-helix lattice** — two phase-shifted sine tracks.
3. Palette colours live in `data/palette.json`. Missing data triggers a gentle notice and safe defaults.

## ND-safe notes
- Static draw; no animation, autoplay, or network calls.
- Muted contrast palette and generous spacing reduce sensory strain.
- Layer order clarifies depth without motion.
- Geometry parameters lean on numerology constants 3, 7, 9, 11, 22, 33, 99, 144.

## Design notes
- Pure ES module (`js/helix-renderer.mjs`) with small, well-commented functions.
- ASCII quotes only; UTF-8, LF newlines for portability.
- Everything works offline by double-clicking `index.html`.

## Extending
Add additional layers by extending `renderHelix` with more draw functions while preserving the calm visual hierarchy and ND-safe choices.
