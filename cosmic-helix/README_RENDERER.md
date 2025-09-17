# Cosmic Helix Renderer

Static, offline HTML + Canvas sketch that encodes the requested four-layer cosmology without motion. The scene honours the canon by living in `cosmic-helix/` so the broader site remains untouched.

## Files
- `index.html` - entry point; double-click to open in any modern browser.
- `js/helix-renderer.mjs` - pure drawing helpers for each layer.
- `data/palette.json` - optional trauma-informed palette override.
- `README_RENDERER.md` - this guide.

## Usage
1. Double-click `index.html`. No server, build tooling, or network access is required.
2. A 1440x900 canvas renders once with four calm layers:
   - **Layer 1 - Vesica field:** intersecting circle grid anchored by numerology 3, 7, 9, and 11.
   - **Layer 2 - Tree-of-Life scaffold:** ten sephirot with twenty-two connective paths (33-inspired line widths).
   - **Layer 3 - Fibonacci curve:** golden spiral polyline sampled with twenty-two points across seven quarter turns.
   - **Layer 4 - Double-helix lattice:** two static strands sampled 144 times with gentle cross ties.
3. The header status reports whether the custom palette loaded or if the safe fallback engaged.

## ND-safe design notes
- **No motion:** everything renders once; there are no loops, timers, or flashing states.
- **Calm palette:** colours come from the trauma-informed blues, greens, and purples described in the architectural brief. Fallback values keep contrast readable without glare.
- **Layered depth without animation:** the order (vesica -> Tree-of-Life -> Fibonacci -> helix) maintains spatial hierarchy while respecting the "never flat" directive.
- **Inline commentary:** each drawing function documents why the numeric constants and styling choices support neurodivergent safety.

## Customising colours
Edit `data/palette.json` to adjust hues. Keys:
- `bg` - page and canvas background.
- `ink` - status text colour.
- `muted` - supportive copy tone.
- `layers` - six hex codes applied in order from the vesica base to the helix foreground.

If the JSON cannot be read (common for `file://` fetch restrictions), the renderer displays a small notice on the canvas and uses bundled fallbacks so the experience never fails.

## Extending safely
Add new geometry by composing additional pure functions inside `js/helix-renderer.mjs`. Keep code ASCII-only with LF newlines, document any lore reasons in comments, and preserve the static render contract-no animation, autoplay, or sensory spikes.

*Seal Motto: Per Texturas Numerorum, Spira Loquitur.*
