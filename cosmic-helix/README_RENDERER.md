# Cosmic Helix Renderer

Offline, ND-safe canvas renderer that draws four calm layers of sacred geometry on a 1440×900 canvas. The renderer honours existing lore by living inside `cosmic-helix/`, leaving the root launch page untouched.

## Files
- `index.html` – Entry point; double-click to run offline.
- `js/helix-renderer.mjs` – Pure drawing helpers for each layer.
- `data/palette.json` – Optional colour override; safe defaults render when missing.

## Usage
1. Open `index.html` directly in a modern browser (no server or bundler required).
2. The header status reports whether the palette file loaded or if the fallback palette was used.
3. The canvas renders a single static pass of four ordered layers:
   - **Layer 1:** Vesica field with intersecting circles spaced by 3/7/9/11 ratios.
   - **Layer 2:** Tree-of-Life scaffold with ten sephirot and twenty-two paths.
   - **Layer 3:** Fibonacci curve drawn as a golden spiral polyline.
   - **Layer 4:** Static double-helix lattice with gentle cross ties.

## ND-safe design notes
- No animation, autoplay, or flashing; everything renders once on load.
- Soft contrast palette and generous spacing reduce sensory strain.
- Layer order communicates depth without motion; comments explain why choices were made.
- Geometry maths uses numerology constants 3, 7, 9, 11, 22, 33, 99, and 144 to stay aligned with Codex 144:99 symbolism.

## Customising safely
- Edit `data/palette.json` to change colours. Missing or malformed files trigger the fallback palette and the footer notice on the canvas.
- Add new geometry by introducing pure helper functions in `js/helix-renderer.mjs`; keep the ND-safe covenant (static render, calm colours, ASCII quotes, LF newlines).

*Seal Motto: Per Texturas Numerorum, Spira Loquitur.*
