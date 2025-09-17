# Cosmic Helix Renderer

Static, offline HTML + Canvas renderer that layers vesica field, Tree-of-Life scaffold, Fibonacci curve, and a fixed double-helix lattice. Designed for ND-safe viewing with calm contrast and zero motion.

## Files
- `index.html` - entry point; double-click to run offline.
- `js/helix-renderer.mjs` - pure drawing routines composed as ES module.
- `data/palette.json` - optional palette override; a fallback palette is bundled.

## Usage
1. Open `index.html` in any modern browser (no server required).
2. A 1440x900 canvas renders four static layers:
   - Layer 1: Vesica field
   - Layer 2: Tree-of-Life nodes and paths
   - Layer 3: Fibonacci curve
   - Layer 4: Double-helix lattice
3. The header status reports whether the palette file was loaded or the fallback was used.

## ND-safe choices
- Static rendering only; no animation, autoplay, or flashing.
- Muted contrast palette and generous spacing reduce sensory strain.
- Layer order conveys depth without relying on motion cues.
- Inline comments explain safety choices for future maintainers.

## Numerology guidance
Geometry proportions reference the requested constants 3, 7, 9, 11, 22, 33, 99, and 144. The constants steer grid spacing, path thickness, spiral turn count, and helix sample density.

## Custom palette
Edit `data/palette.json` to change colours. Expected keys:
- `bg` - page and canvas background.
- `ink` - caption and notice colour.
- `muted` - optional chrome accent.
- `layers` - array of six layer colours in back-to-front order.

If the JSON file is missing or malformed, `index.html` displays a gentle notice and uses the bundled fallback palette so the render never fails.

## Extending safely
Add new geometry by composing additional pure draw functions inside `js/helix-renderer.mjs`. Keep the ND-safe covenant: static rendering, calm colours, progressive layering, and commentary that explains any lore additions.

Seal motto: *Per Texturas Numerorum, Spira Loquitur.*
