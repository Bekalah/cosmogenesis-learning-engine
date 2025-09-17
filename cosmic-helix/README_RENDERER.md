# Cosmic Helix Renderer

Static, offline HTML + Canvas renderer that encodes the requested four-layer cosmology without motion.
This rewrite clears prior merge debris while preserving the lore motto so future stewards know why each choice exists.

## Files
- `index.html` – offline entry point; loads palette data and calls the renderer.
- `js/helix-renderer.mjs` – pure drawing functions for Vesica, Tree, Fibonacci, and helix layers.
- `data/palette.json` – optional palette override; missing file triggers a calm fallback notice.

## Usage
1. Double-click `index.html` in any modern browser. No server or network access is needed.
2. A 1440×900 canvas renders four static layers:
   - **Vesica field** – intersecting circles aligned to 3/7/9/11 spacing.
   - **Tree-of-Life scaffold** – ten sephirot with twenty-two connecting paths.
   - **Fibonacci curve** – golden spiral polyline sampled in 144 steps.
   - **Double-helix lattice** – two phase-shifted strands with 22 rungs.
3. The header status reports whether the palette file loaded or if the safe fallback rendered instead.

## ND-safe commitments (why)
- Single render pass; no animation, autoplay, or flashing.
- Calm palette and layered ordering provide depth without motion.
- Inline comments call out safety decisions so future maintainers uphold the trauma-informed covenant.

## Numerology weave
Geometry constants 3, 7, 9, 11, 22, 33, 99, and 144 steer grid density, path widths, spiral sampling, and helix phase counts.
Keeping the numbers explicit maintains the Cosmogenesis 144:99 symbolism.

## Custom palette
Edit `data/palette.json` to change colours.
The renderer expects keys `bg`, `ink`, `muted`, and a `layers` array with at least six hex values.
If the file is absent or malformed the header and canvas caption explain the fallback so ND-safe reassurance remains intact.

## Extending safely
Add new geometry by composing more pure helpers inside `js/helix-renderer.mjs`.
Document any new lore choices inline and keep renders static to honour the covenant.
