# Cosmic Helix Renderer

_Per Texturas Numerorum, Spira Loquitur._

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
- Static drawing only; no animation or autoplay.
- Soft contrast palette and generous spacing reduce sensory strain.
- Layer order clarifies depth without flashing.
- Geometry routines lean on numerology constants 3, 7, 9, 11, 22, 33, 99, 144.

## Design notes
- Pure ES module (`js/helix-renderer.mjs`) with small, well-commented functions.
- ASCII quotes only; UTF-8, LF newlines.
- Everything works offline by opening `index.html` directly.

## Extending
Add new draw functions in `js/helix-renderer.mjs` while preserving the calm visual hierarchy and ND-safe choices.

## Related lore
For wider cosmological context, see `docs/tesseract_spiritual.md`.

*Seal Motto: Per Texturas Numerorum, Spira Loquitur.*
