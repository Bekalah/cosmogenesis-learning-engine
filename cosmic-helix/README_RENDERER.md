Per Texturas Numerorum, Spira Loquitur.  //

# Cosmic Helix Renderer

Offline, ND-safe canvas sketch for layered sacred geometry.

## Usage
1. Open `index.html` in any modern browser (no server needed).
2. A 1440×900 canvas renders four static layers:
   - **Vesica field** – intersecting circles forming a calm grid.
   - **Tree-of-Life scaffold** – ten sephirot linked by twenty-two paths.
   - **Fibonacci curve** – golden spiral polyline anchored to centre.
   - **Double-helix lattice** – two phase-shifted sine tracks.
3. Palette colours live in `data/palette.json`. Missing data triggers a gentle notice and safe defaults.

## ND-safe notes
- Static draw; no animation or autoplay.
- Muted contrast palette reduces sensory strain.
- Layer order clarifies depth without flashing.
- Geometry parameters lean on constants 3, 7, 9, 11, 22, 33, 99, 144.

## Design notes
- All geometry functions are pure and modular in `js/helix-renderer.mjs`.
- ASCII quotes only; UTF-8 LF newlines for portability.

## Related lore
See [`docs/tesseract_spiritual.md`](../docs/tesseract_spiritual.md) for the wider cosmological frame.

