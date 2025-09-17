# Cosmic Helix Renderer

Static, offline canvas scene that layers Vesica, Tree-of-Life, Fibonacci, and a static double-helix lattice. The renderer lives inside `cosmic-helix/` so the wider cathedral entry point remains untouched — lore boundaries stay intact.

## Files
- `index.html` — entry point; double-click to run.
- `js/helix-renderer.mjs` — pure drawing routines for the four layers.
- `data/palette.json` — optional palette override; safe defaults cover missing files.

## Usage
1. Open `index.html` directly in a modern browser (no server or network required).
2. A 1440x900 canvas renders four ordered layers:
   - **Layer 1: Vesica field** — intersecting circle lenses arranged with 3/7/9/11 spacing.
   - **Layer 2: Tree-of-Life scaffold** — ten sephirot linked by twenty-two paths.
   - **Layer 3: Fibonacci curve** — calm golden spiral polyline.
   - **Layer 4: Double-helix lattice** — two static strands with gentle cross ties.
3. The header status reports whether the palette loaded or if the fallback palette was used.

## ND-safe choices
- Single render pass; no animation, autoplay, or flashing elements.
- Soft contrast palette, generous margins, and inline notices to reduce sensory load.
- Layer order preserves depth without requiring motion.
- Comments inside the code explain each safety decision for future stewards.

## Numerology alignment
The geometry functions weave the requested constants (3, 7, 9, 11, 22, 33, 99, 144) into spacing, stroke widths, spiral turns, and helix sampling counts to keep the cosmology coherent.

## Palette and fallback
`data/palette.json` may override colours. When the JSON file is missing or blocked by the browser, the renderer applies bundled defaults, prints a status message, and paints a small notice in the canvas corner so the experience remains calm and predictable.

## Extending safely
Add new layers by composing additional pure helper functions in `js/helix-renderer.mjs`. Maintain the ND-safe covenant: static rendering, calm colours, ASCII quotes, LF newlines, and clear comments describing why new geometry supports the canon.

_Per Texturas Numerorum, Spira Loquitur._
