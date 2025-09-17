# Cosmic Helix Renderer

Static offline renderer that draws the requested four-layer cosmology on a 1440x900 canvas. The module stays inside `cosmic-helix/` so the main project index keeps its lore focus (why: preserves the existing entry point while adding this research tool).

## Files
- `index.html` – entry point that loads the palette (with fallback) and invokes the renderer.
- `js/helix-renderer.mjs` – pure drawing routines for the four calm layers.
- `data/palette.json` – optional colour overrides. Missing data triggers a safe fallback.

## Usage
1. Double-click `index.html` in any modern browser. No server or network requests are required.
2. The status line reports whether the palette file loaded or if the fallback colours were applied.
3. The canvas renders these static layers in order:
   - **L1 Vesica field** – intersecting circles arranged with 3/7/9/11 spacing to evoke the vesica womb.
   - **L2 Tree-of-Life scaffold** – ten sephirot linked by twenty-two paths, sized from 99/144 ratios for readability.
   - **L3 Fibonacci curve** – a golden spiral polyline sampled across 144 points for smooth calm arcs.
   - **L4 Double-helix lattice** – two phase-shifted sine strands with thirty-three cross ties.

## ND-safe design notes
- Single render pass only; there is no animation, autoplay, or flashing.
- Muted palette with readable contrast and transparent strokes reduces sensory strain.
- Inline comments explain how numerology constants guide spacing so future stewards understand the symbolism.
- If the palette file is absent, both the header and the canvas receive a gentle notice instead of failing silently.

## Customising colour
Edit `data/palette.json` to tune colours. Keep the keys:
- `bg` – background colour for both page and canvas.
- `ink` – text colour used for notices.
- `muted` – optional accent used by the status line.
- `layers` – array of six hex values applied to the four geometry layers plus helix rungs.

If the JSON is missing or malformed, the renderer loads bundled safe colours and reports the fallback.

## Extending safely
Add new geometry by composing additional pure helper functions inside `js/helix-renderer.mjs`. Maintain the ND-safe covenant: static rendering, layered depth (never flattened into a single outline), calm palette, ASCII quotes, UTF-8, and detailed comments on why choices were made.
