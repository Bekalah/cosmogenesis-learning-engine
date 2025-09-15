# Cosmic Helix Renderer

_Per Texturas Numerorum, Spira Loquitur._

Offline, ND-safe canvas sketch for layered sacred geometry inside the Cosmogenesis Learning Engine canon. The renderer works entirely by opening `index.html` and draws four calm layers with no motion or autoplay.

## Quickstart
1. Double-click `index.html` in any modern browser. No server or network is required.
2. A 1440x900 canvas appears with status text in the header. If `data/palette.json` is missing or blocked, the status reports the fallback palette and rendering still completes.
3. Study the four static layers, then edit `data/palette.json` to tune colours or fork the draw functions for new overlays.

## Layer overview
- **L1 Vesica field** - Intersecting circle lenses arranged with 3/7/9/11 spacing to evoke the womb of forms without overwhelming repetition.
- **L2 Tree-of-Life scaffold** - Ten sephirot nodes with twenty-two connecting paths, scaled to the canvas proportions so the structure remains readable at 1440x900.
- **L3 Fibonacci curve** - A golden-ratio logarithmic spiral drawn as a single polyline; it arcs through the centre to harmonise the other geometries.
- **L4 Double-helix lattice** - Two phase-shifted sine strands with gentle rungs, forming a static lattice that nods to DNA without introducing motion.

## Palette and customisation
- Colours live in `data/palette.json` with keys `bg`, `ink`, `muted`, and a `layers` array of six hex values (one per draw layer).
- When the JSON cannot be loaded (for example when running from the `file://` protocol), `index.html` falls back to a safe palette and updates the status line so you know which path was taken.
- The HTML page applies the palette colours to CSS custom properties (`--bg`, `--ink`, `--muted`) before drawing so the chrome and canvas stay in sync.

## Numerology alignment
Geometry parameters are tied to the requested constants: 3, 7, 9, 11, 22, 33, 99, and 144. Examples include the vesica grid counts (11 columns x 9 rows), Fibonacci arc quarter-turns (7), Tree-of-Life stroke widths (22/11), helix rotations (33/11), and helix sample density (144 steps). This keeps the visual language coherent with Codex 144:99.

## ND-safe design choices
- No animation, flashing, or autoplay; each layer renders once on load.
- Muted contrast palette with generous spacing reduces sensory strain.
- Thin strokes and rounded joins avoid harsh edges while preserving clarity.
- Canvas size is fixed at 1440x900 for predictable composition when opened offline.

## File structure
```
index.html               # Entry point; loads palette, sets constants, calls renderer.
js/helix-renderer.mjs    # Pure drawing functions for the four layers.
data/palette.json        # Editable colour palette; safe defaults bundled.
```

## Extending safely
Add new layers by composing pure draw functions in `js/helix-renderer.mjs`. Keep the ND-safe covenant: static rendering, calm colours, and respectful pacing. Document any new numerological correspondences so future collaborators understand the symbolism.

## Troubleshooting
- **Status reports fallback palette** - Browsers often block `fetch` over `file://`; the renderer already handles this and still draws with bundled colours.
- **Blank canvas** - Older browsers may not provide a 2D context. The header status will mention this; try a current Firefox, Safari, or Chromium build.
- **Harsh colours after editing** - Use softer, mid-range hues and keep contrast gentle to honour the trauma-informed design goal.
