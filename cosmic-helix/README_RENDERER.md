# Cosmic Helix Renderer
*Seal Motto: Per Texturas Numerorum, Spira Loquitur.*

Offline, ND-safe canvas sketch for layered sacred geometry.

## Usage
1. Open `index.html` in any modern browser (no server needed).
2. A 1440×900 canvas renders four static layers:
   - **Vesica field** — intersecting circles forming the womb of forms.
   - **Tree-of-Life scaffold** — ten sephirot with twenty-two paths.
   - **Fibonacci curve** — golden spiral polyline anchored to centre.
   - **Double-helix lattice** — two phase-shifted sine tracks.
3. Palette colours live in `data/palette.json`. Missing file triggers a gentle notice and safe defaults.

## ND-safe notes
- Static drawing only; no animation or autoplay.
- Calm contrast palette reduces sensory strain.
- Layer order clarifies depth without flashing.
- Geometry routines lean on numerology constants 3, 7, 9, 11, 22, 33, 99, 144.

## Design notes
- Pure ES module `js/helix-renderer.mjs`; small, well-commented functions.
- ASCII quotes only, UTF-8, LF newlines.
- Everything works offline; no network requests.

## Extending
Add more layers by extending `renderHelix` with additional draw functions while keeping ND-safe order and contrast.

## Related lore
See `../docs/tesseract_spiritual.md` for broader cosmological context.
