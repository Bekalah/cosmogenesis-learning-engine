*Seal Motto: Per Texturas Numerorum, Spira Loquitur.*

Offline, ND-safe canvas sketch for layered sacred geometry.

## Usage
1. Open `index.html` in any modern browser (no server needed).
2. A 1440×900 canvas renders four static layers:
   - **Vesica field** — intersecting circles forming a calm grid.
   - **Tree-of-Life scaffold** — ten sephirot linked by twenty-two paths.
   - **Fibonacci curve** — golden spiral polyline anchored to centre.
   - **Double-helix lattice** — two phase-shifted sine tracks.
3. Palette can be customised in `data/palette.json`. If the file is missing, a gentle fallback palette loads and a notice appears.

## ND-safe notes
- Static drawing; no animation, autoplay, or flashing.
- Muted contrast palette reduces sensory strain.
- Layer order clarifies depth without motion.
- Geometry routines use numerology constants 3, 7, 9, 11, 22, 33, 99, 144.

## Design notes
- Pure ES module `js/helix-renderer.mjs` with small, well-commented functions.
- ASCII quotes only; UTF-8 with LF newlines.

## Extending
Add new layers by extending `renderHelix` while preserving the calm visual hierarchy.
