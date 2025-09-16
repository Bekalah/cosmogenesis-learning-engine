# Cosmic Helix Renderer

Static, offline canvas renderer that honours the requested four-layer cosmology with ND-safe choices and calm contrast.

## Why this lives in `cosmic-helix/`
Keeping the renderer in its own folder preserves the primary `index.html` at the project root (lore remains untouched) while delivering the requested standalone double-click experience.

## Files
- `index.html` - entry point; loads the palette if present and reports fallback status.
- `js/helix-renderer.mjs` - pure drawing helpers for each geometric layer.
- `data/palette.json` - optional palette override. Safe defaults render when the file is missing or blocked.

## Usage
1. Double-click `index.html` in any modern browser. No server, bundler, or network access is required.
2. A 1440x900 canvas appears with a status line describing whether the palette loaded or fell back.
3. The renderer draws four static layers in order:
   - **L1 Vesica field** - overlapping circle lattice using 11x9 spacing.
   - **L2 Tree-of-Life scaffold** - ten sephirot nodes with twenty-two linking paths.
   - **L3 Fibonacci curve** - golden log spiral composed from 144 sample points.
   - **L4 Double-helix lattice** - two phase-shifted sine strands with 22 rungs.

## ND-safe design choices
- No animation, autoplay, or flashing; everything renders once on load.
- Gentle palette defaults and inline comments explaining the sensory rationale.
- Layered depth achieved through geometry order rather than motion.
- ASCII-only, UTF-8 files with LF newlines and well-commented, small pure functions.

## Palette data
Edit `data/palette.json` to tune colours. Expected keys:
```json
{
  "bg": "#0b0b12",
  "ink": "#e8e8f0",
  "muted": "#a6a6c1",
  "layers": ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
}
```
When this file is missing or cannot be fetched over `file://`, the renderer displays a small inline notice and uses the safe fallback palette so the ritual never fails.

## Numerology mapping
- Grid columns/rows reference 11, 9, and 3 for the vesica rhythm.
- Tree-of-Life paths follow the full set of 22 connections, with node radius set by the calming 9.
- Fibonacci spiral advances through 7 quarter turns sampled 144 times.
- Helix strands span 3 full rotations with amplitude set by 7 and rung count anchored to 22.

## Extending safely
Introduce new layers by adding pure helper functions in `js/helix-renderer.mjs` after the existing calls. Document "why" for any lore changes and keep the ND-safe covenant: static rendering, gentle palette, no motion.
