# Cosmic Helix Renderer

_Per Texturas Numerorum, Spira Loquitur._

Offline, ND-safe canvas sketch for layered sacred geometry. This rewrite resolves old merge debris while preserving the ritual motto and the original four layer brief (why: the lore anchors remain intact).

## Usage
1. Double-click `index.html` in any modern browser. No server or network needed.
2. A 1440x900 canvas renders four static layers:
   - **Vesica field** - intersecting circles forming a calm grid.
   - **Tree-of-Life scaffold** - ten sephirot linked by twenty-two paths.
   - **Fibonacci curve** - golden spiral polyline anchored to centre.
   - **Double-helix lattice** - two phase-shifted sine tracks.
3. Palette colours live in `data/palette.json`. If the file is absent, the top status line and a small canvas caption note the safe fallback.

## ND-safe notes
- Static drawing only; no animation, autoplay, or motion scripting.
- Muted contrast palette and generous spacing reduce sensory strain.
- Layer order clarifies depth without flashing, sustaining the requested layered geometry.
- Geometry routines lean on numerology constants 3, 7, 9, 11, 22, 33, 99, and 144 to keep symbolism explicit.

## Design notes
- Pure ES module (`js/helix-renderer.mjs`) with small, well-commented functions; this keeps offline maintenance simple.
- ASCII quotes and UTF-8 files honour the ND-safe code rule-set.
- Numerology constants live in `index.html` for quick ritual tuning.

## Extending
Add new draw helpers to `js/helix-renderer.mjs` while preserving the calm visual hierarchy and ND-safe palette logic. Remember to explain any lore additions in comments so future stewards see why choices were made.

## Related lore
For broader cosmological context, consult [`docs/tesseract_spiritual.md`](../docs/tesseract_spiritual.md).

*Seal Motto: Per Texturas Numerorum, Spira Loquitur.*
