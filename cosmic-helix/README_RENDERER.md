# Cosmic Helix Renderer

Offline, ND-safe canvas sketch for layered sacred geometry.

## Usage
1. Open `index.html` in any modern browser; no server or network required.
2. A 1440×900 canvas renders four static layers:
   - **Vesica field** — intersecting circles forming a calm grid.
   - **Tree-of-Life scaffold** — ten sephirot linked by twenty-two paths.
   - **Fibonacci curve** — golden spiral polyline anchored to centre.
   - **Double-helix lattice** — two phase-shifted sine tracks.
3. Palette colours live in `data/palette.json`. If the file is missing, a gentle notice appears and a safe default palette is used.

## ND-safe notes
- Static drawing only; no animation or autoplay.
- Soft contrast palette reduces sensory strain.
- Layer order clarifies depth without flashing.
- Geometry constants lean on 3, 7, 9, 11, 22, 33, 99, 144.

## Design notes
- Pure ES module `js/helix-renderer.mjs` with small, well-commented functions.
- ASCII quotes only, UTF-8, LF newlines.

## Extending
Add new draw functions in `js/helix-renderer.mjs` while preserving the calm hierarchy and ND-safe choices.
