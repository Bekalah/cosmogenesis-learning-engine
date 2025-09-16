# Cosmic Helix Renderer

Static offline renderer that draws four calm layers of sacred geometry on a 1440x900 canvas. The module follows ND-safe guidelines: no motion, soft contrast, predictable layout, and clear comments that explain every safety choice.

## Files
- `index.html` -- entry point that wires the canvas and loads the palette if present.
- `js/helix-renderer.mjs` -- pure ES module with small drawing functions.
- `data/palette.json` -- optional palette override. Safe defaults load when the file is missing.

## How to use
1. Double-click `index.html` in any modern browser. No server or network access is required.
2. The status line will report whether the palette file was found. If it is missing, a fallback palette loads and the scene still renders.
3. A single render pass draws four layers:
   - Layer 1: Vesica field made from overlapping circles that suggest repeating lenses.
   - Layer 2: Tree-of-Life scaffold with ten sephirot and twenty-two linking paths.
   - Layer 3: Fibonacci curve as a golden polyline anchored at the centre.
   - Layer 4: Static double-helix lattice with cross ties for depth.

## ND-safe design choices
- Static drawing only: there is no animation, autoplay, flashing, or audio.
- Gentle contrast palette with generous whitespace and status copy for reassurance.
- Layer order is consistent so depth is readable without motion.
- Inline comments explain the ND-safe rationale to future maintainers.

## Numerology guidance
Geometry proportions reference the requested constants 3, 7, 9, 11, 22, 33, 99, and 144. The constants steer spacing (vesica grid), line widths (tree paths), Fibonacci segment count, and helix sampling density.

## Custom palette
Edit `data/palette.json` to change colors. The keys are:
- `bg` -- canvas background.
- `ink` -- reserved for future UI elements.
- `layers` -- array of six layer colors in base-to-foreground order.

If the JSON file is removed or malformed, `index.html` shows a notice and uses a bundled fallback palette so the render never fails.

## Extending safely
- Add new geometry by introducing additional pure helper functions inside `helix-renderer.mjs` and calling them after the existing layers.
- Keep new code ASCII-only with LF newlines and plain quotes.
- Preserve the static rendering contract and document any sensory considerations in comments.
