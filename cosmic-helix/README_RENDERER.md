# Cosmic Helix Renderer

Static, offline canvas renderer encoding the layered cosmology brief. Double-click `index.html` in this folder and the 1440×900 canvas draws four calm layers with no motion:

1. **Vesica field** – intersecting circle lenses laid out with the 3/7/9/11 rhythm.
2. **Tree-of-Life scaffold** – ten sephirot connected by twenty-two paths.
3. **Fibonacci curve** – golden spiral polyline sampled 144 times for smoothness.
4. **Double-helix lattice** – two phase-shifted strands with gentle cross ties.

The renderer lives in `cosmic-helix/` so the wider canon stays intact (why: respects existing lore while cleaning duplicate debris).

## Files
- `index.html` – entry point; loads palette, sets numerology constants, calls the renderer.
- `js/helix-renderer.mjs` – pure ES module with small drawing helpers.
- `data/palette.json` – optional palette override; safe defaults engage when missing.

## ND-safe design choices
- Static draw only: no animation, autoplay, strobes, or motion scripting.
- Soft contrast palette applied to both chrome and canvas for predictable tone.
- Layer order provides depth without flashing; inline comments explain why.
- Geometry ratios reference the requested constants 3, 7, 9, 11, 22, 33, 99, 144.

## Palette fallback
When `data/palette.json` cannot be read (common over `file://`), the header status reports the fallback and a small notice appears on the canvas. Rendering still completes using bundled calm colours.

## Extending safely
Add new geometry by composing additional pure helpers inside `js/helix-renderer.mjs`. Keep code ASCII-only with LF newlines, document ND-safe intent in comments, and preserve the single render pass contract.

*Seal Motto: Per Texturas Numerorum, Spira Loquitur.*
