# Cosmic Helix Renderer

Static, offline canvas renderer encoding the requested layered cosmology. The module draws four calm layers without motion so this chapel remains ND-safe.

## Files
- `index.html` -- entry point; double-click to open offline.
- `js/helix-renderer.mjs` -- pure ES module with small drawing helpers.
- `data/palette.json` -- optional palette override (six layer colours plus chrome values).

## Usage
1. Double-click `index.html` in a modern browser. No server or network is required.
2. The header status reports whether the palette file loaded or if the fallback palette was applied.
3. A 1440x900 canvas renders once with four ordered layers:
   - **Vesica field** -- intersecting circle lenses with 3/7/9/11 spacing.
   - **Tree-of-Life scaffold** -- ten sephirot linked by twenty-two calm paths.
   - **Fibonacci curve** -- golden spiral polyline guided by seven quarter turns.
   - **Double-helix lattice** -- two sine strands with gentle cross ties sampled at 144 points.

## ND-safe design choices
- Static render; there is no animation, autoplay, audio, or flashing elements.
- Palette stays in a soft contrast range; comments explain where ND safety choices are applied.
- Layer ordering preserves depth without motion, matching the layered cosmology brief.
- Numerology constants 3, 7, 9, 11, 22, 33, 99, and 144 steer spacing, line widths, and sampling density.

## Palette customisation
Edit `data/palette.json` to suit another ritual palette. If the file is missing or blocked, the renderer posts a small inline notice and uses bundled safe colours so the scene still draws.

## Extending safely
Add new layers by composing additional pure functions inside `js/helix-renderer.mjs`. Keep files ASCII-only with LF newlines, do
cument any sensory considerations, and maintain the static render contract so the chapel remains calm.
