# Cosmic Helix Renderer

Offline, ND-safe canvas sketch for layered sacred geometry.

## Usage
1. Open `index.html` in any modern browser; no server or network required.
2. A 1440×900 canvas renders four static layers:
   - **Vesica field** — intersecting circles forming a calm grid.
   - **Tree-of-Life scaffold** — ten sephirot connected by twenty-two paths.
   - **Fibonacci curve** — golden spiral polyline anchored to centre.
   - **Double-helix lattice** — two phase‑shifted sine tracks.
3. Palette can be customized in `data/palette.json`. If the file is missing, the renderer falls back to a safe default and shows a gentle notice.

## ND-safe notes
- Static drawing; no animation, autoplay, or flashing.
- Soft contrast palette and generous spacing improve readability.
- Layer order clarifies depth without motion.
- Geometry routines lean on numerology constants 3, 7, 9, 11, 22, 33, 99, 144.

## Design notes
- Pure ES modules with ASCII quotes only.
- Code lives in `js/helix-renderer.mjs`; geometry functions are small and well commented.
- Everything works offline by double‑clicking `index.html`.

## Extending
The renderer is intentionally minimal. New layers or overlays can be added by extending `renderHelix` while preserving the calm visual hierarchy and ND‑safe choices.

## Related lore
For cosmological context, see [`docs/tesseract_spiritual.md`](../docs/tesseract_spiritual.md).
