# Cosmic Helix Renderer

Per Texturas Numerorum, Spira Loquitur.

Offline, ND-safe canvas sketch for layered sacred geometry.

## Usage
1. Double-click `index.html` in any modern browser; no server or network required.
2. A 1440×900 canvas renders four static layers:
   - **Vesica field** — intersecting circles forming a calm grid.
   - **Tree-of-Life scaffold** — ten sephirot linked by twenty-two paths.
   - **Fibonacci curve** — golden spiral polyline anchored to centre.
   - **Double-helix lattice** — two phase-shifted sine tracks.
3. Palette colours live in `data/palette.json`. Missing data triggers a gentle notice and safe defaults.

## ND-safe notes
- Static drawing; no animation, autoplay, or flashing.
- Soft contrast palette and generous spacing improve readability.
- Layer order clarifies depth without motion.
- Geometry routines lean on numerology constants 3, 7, 9, 11, 22, 33, 99, 144.

## Design notes
- Pure ES modules with ASCII quotes and UTF-8 LF newlines.
- Code lives in `js/helix-renderer.mjs`; geometry functions are small and well commented.
- Everything works offline by double-clicking `index.html`.

## Extending
Add new draw functions in `js/helix-renderer.mjs` while keeping the calm visual hierarchy and ND-safe choices.
