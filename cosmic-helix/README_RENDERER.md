# Cosmic Helix Renderer

Offline, ND-safe canvas sketch for layered sacred geometry.

## Usage
1. Open `index.html` in any modern browser (no server needed).
2. A 1440×900 canvas renders four static layers:
   - **Vesica field** — intersecting circles forming the womb of forms.
   - **Tree-of-Life scaffold** — ten sephirot linked by twenty-two paths.
   - **Fibonacci curve** — golden spiral polyline anchored to centre.
   - **Double-helix lattice** — two phase-shifted sine tracks with rungs.
3. Palette can be customised in `data/palette.json`. Missing data triggers a gentle inline notice with safe defaults.

## ND-safe notes
- Static drawing; no animation or autoplay.
- Calm contrast palette reduces sensory strain.
- Layer order clarifies depth without flashing.
- Geometry parameters rely on numerology constants (3, 7, 9, 11, 22, 33, 99, 144).

## Design notes
- Pure functions in `js/helix-renderer.mjs` (ES module, ASCII quotes, LF newlines).
- No external dependencies; open directly from the file system.
- Numerology constants live in `index.html` and are passed explicitly to the renderer.

## Extending
Add new layers by extending `renderHelix` while keeping the calm visual hierarchy.
