# Cosmic Helix Renderer

*Per Texturas Numerorum, Spira Loquitur.*
Per Texturas Numerorum, Spira Loquitur.

Offline, ND-safe canvas sketch for layered sacred geometry.

## Usage
1. Open `index.html` in any modern browser (no server needed).
2. A 1440×900 canvas renders four static layers:
   - **Vesica field** — intersecting circles forming a calm grid.
   - **Tree-of-Life scaffold** — ten sephirot linked by twenty-two paths.
   - **Fibonacci curve** — golden spiral polyline anchored to centre.
   - **Double-helix lattice** — two phase-shifted sine tracks.
3. Palette colours live in `data/palette.json`. If the file is missing, the renderer falls back to a safe default and shows a gentle notice.

## ND-safe notes
- Static drawing only; no animation or autoplay.
- Soft contrast palette reduces sensory strain.
- Layer order clarifies depth without flashing.
- Geometry routines lean on constants 3, 7, 9, 11, 22, 33, 99, 144.

## Design notes
- Pure ES module in `js/helix-renderer.mjs` with small, well-commented functions.
- ASCII quotes only, UTF-8 encoding, LF newlines.
   - **Vesica field** — intersecting circle grid.
   - **Tree-of-Life scaffold** — ten sephirot with twenty-two paths.
   - **Fibonacci curve** — golden spiral polyline.
   - **Double-helix lattice** — two phase-shifted sine tracks.

## Customizing
- Colors live in `data/palette.json`. If the file is missing, a status note appears and safe defaults load.

## ND-safe notes
- Static render; no animation or audio.
- Soft contrast palette and generous spacing reduce sensory load.
- Geometry parameters reference numerology constants 3, 7, 9, 11, 22, 33, 99, 144.

## Design notes
- Pure ES module in `js/helix-renderer.mjs` with small functions and ASCII quotes.
- Works offline; no network requests or external libraries.
   - Vesica field — intersecting circles forming a calm grid.
   - Tree-of-Life scaffold — ten sephirot with twenty-two paths.
   - Fibonacci curve — golden spiral polyline anchored to centre.
   - Double-helix lattice — two phase-shifted sine tracks.
3. Palette colours live in `data/palette.json`. If the file is missing, the renderer falls back to a safe default and shows a notice.

## ND-safe notes
- Static drawing; no animation or autoplay.
- Muted contrast palette reduces sensory strain.
- Layer order clarifies depth without flashing.
- Geometry routines use numerology constants 3, 7, 9, 11, 22, 33, 99, 144.

## Design notes
- Pure ES module `js/helix-renderer.mjs` with small, well-commented functions.
- ASCII quotes only, UTF-8, LF newlines.

## Extending
Add new draw functions in `js/helix-renderer.mjs` while preserving the calm layer order.

