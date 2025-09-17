# Cosmic Helix Renderer

Static, offline canvas renderer that layers vesica geometry, the Tree-of-Life scaffold, a Fibonacci arc, and a calm double-helix lattice. The module follows the ND-safe covenant: no motion, soft contrast, predictable hierarchy, and comments that explain every safety choice.

## Files
- `index.html` - entry point; wires the canvas, loads the palette if present, and calls the renderer.
- `js/helix-renderer.mjs` - pure ES module with small drawing functions for each layer.
- `data/palette.json` - optional palette override. Safe defaults load automatically when the file is missing or blocked.

## Usage
1. Double-click `index.html` in any modern browser. No server or network access is required.
2. The header status reports whether the palette file was read. If it is missing, a fallback palette loads and the canvas prints a gentle notice.
3. A single render pass draws four ordered layers on a 1440x900 canvas.

## Layer order
1. **Vesica field** - intersecting circle lenses spaced with 3/7/9/11 rhythms.
2. **Tree-of-Life scaffold** - ten sephirot nodes linked by twenty-two paths.
3. **Fibonacci curve** - golden logarithmic spiral drawn as one calm polyline.
4. **Double-helix lattice** - two phase-shifted sine strands with soft cross ties.

## ND-safe design notes
- Static rendering only: no animation, autoplay, flashing, or audio.
- Gentle contrast palette with generous spacing keeps the composition readable.
- Comments document why each layer uses specific numerology and opacity choices.
- Offline-first: everything runs by opening `index.html` directly.

## Numerology alignment
Geometry parameters reference 3, 7, 9, 11, 22, 33, 99, and 144:
- Vesica grid uses 11 columns x 9 rows with circle offsets driven by 3.
- Tree-of-Life stroke width is 22 / 11, nodes sized from 9.
- Fibonacci spiral renders seven quarter-turns and scales from 33.
- Helix sampling takes 144 steps, amplitude uses 99 and 11, and turns equal 33 / 11.

## Palette customisation
Edit `data/palette.json` to change colours. Keys:
- `bg` - background colour shared by the chrome and canvas.
- `ink` - text colour for notices.
- `muted` - optional softer text for the header.
- `layers` - six hex colours applied to the four layers (two hues are reused for foreground depth).

If the JSON file cannot be loaded (common on strict `file://` contexts) the renderer falls back to bundled colours, updates the header status, and writes a short notice on the canvas.

## Troubleshooting
- **Status says fallback palette** - browsers sometimes block local fetch calls; the renderer already falls back safely.
- **Blank canvas** - older browsers may not provide a 2D context. The status line reports this; try a current Firefox, Safari, or Chromium build.
- **Harsh edits after palette tweaks** - keep hues mid-range and avoid high-contrast combos to honour the trauma-informed design goal.

*Seal Motto: Per Texturas Numerorum, Spira Loquitur.*
