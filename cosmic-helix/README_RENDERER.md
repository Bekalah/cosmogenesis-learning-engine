# Cosmic Helix Renderer

Per Texturas Numerorum, Spira Loquitur.

Offline, ND-safe canvas sketch for layered sacred geometry. The renderer is pure HTML and Canvas, so opening `index.html` directly is enough. No bundlers, no workflows, no animation.

## Quick start
1. Double-click `index.html` in any modern browser (no server needed).
2. A 1440x900 canvas appears with four calm layers:
   - **Layer 1 — Vesica field:** intersecting circles forming a quiet womb of forms.
   - **Layer 2 — Tree-of-Life scaffold:** ten sephirot linked by twenty-two gentle paths.
   - **Layer 3 — Fibonacci curve:** golden spiral polyline anchored to the centre.
   - **Layer 4 — Double-helix lattice:** two phase-shifted sine tracks with static crossbars.
3. Palette colours live in `data/palette.json`. If the file is missing or incomplete the renderer falls back to a safe default and updates the status line in the header.

## Palette notes
- Colours are merged through `preparePalette` so missing entries never break rendering.
- `bg` and `ink` set the document background and text colour for comfortable contrast.
- Six layer colours drive the drawing order from vesica to helix. Provide exactly six shades for best results.

## ND-safe design choices
- Static drawing only; there is no motion, autoplay, or flashing content.
- Soft contrast palette and generous spacing reduce sensory strain.
- Layer ordering builds depth without depending on animation.
- Canvas background is filled once, and every draw routine saves and restores context state to avoid lingering effects.

## Geometry constants
The renderer leans on numerology values to keep proportions symbolic:
- `3` shapes vesica circle size and the outer Tree pillars.
- `7` governs vesica spacing and helix rung cadence.
- `9` defines vertical breathing room and node radius.
- `11` and `22` set Tree path thickness, Fibonacci sequence length, and helix frequency.
- `33`, `99`, and `144` tune helix turns, amplitude, and curve sampling density.

## File map
- `index.html` — offline entry point with status banner and palette loading logic.
- `js/helix-renderer.mjs` — ES module with small, well-commented pure drawing functions.
- `data/palette.json` — editable colours; safe fallback is baked into the renderer.
- `README_RENDERER.md` — this document.

## Extending the lattice
Add new draw helpers inside `js/helix-renderer.mjs` while honouring the ND-safe covenant: avoid motion, keep functions pure, and explain every geometric choice. Additional layers can slot in after the helix call in `renderHelix` to preserve the depth stack.
