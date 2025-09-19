# Cosmic Helix Renderer (Offline, ND-safe)

Static HTML + Canvas capsule that paints the layered cosmology once on load. Double-clicking
`index.html` renders a 1440×900 stage with four calm passes: Vesica field, Tree-of-Life scaffold,
Fibonacci curve, and a static double-helix lattice. Everything runs offline with no dependencies,
no animation, and clear fallback messaging.

## Files
- `index.html` — offline entry point that syncs the palette with the shell, loads optional data,
  and invokes the renderer while reporting status in the header.
- `js/helix-renderer.mjs` — ES module of small pure helpers. Comments explain why the ND-safe order
  and numerology constants matter for each layer.
- `data/palette.json` — optional palette override. If blocked or missing, the renderer falls back
to the sealed palette, posts a header notice, and paints a gentle caption on the canvas.
- `README_RENDERER.md` — this guide.

## Usage (offline)
1. Open `index.html` directly in any modern browser. No server or build step is required.
2. The header first reports "Preparing canvas…" then either "Palette loaded" or "Fallback palette
   active" followed by a summary of rendered layer counts.
3. When `data/palette.json` cannot be read (common on strict `file://` sandboxes) the sealed palette
   activates automatically. A calm inline notice appears near the canvas footer so nothing fails
   silently.

## Layer order (back to front)
1. **Vesica field** — nine-by-eleven lattice of intersecting circles. Axis guides echo the mandorla
   symmetry without animation.
2. **Tree-of-Life scaffold** — ten sephirot nodes and twenty-two proportional paths. Labels are drawn
   calmly below each sphere to honour lineage references.
3. **Fibonacci curve** — logarithmic spiral sampled over 144 points with golden-ratio pacing and soft
   marker pearls every eleven steps.
4. **Double-helix lattice** — two still strands, phase shifted and separated, joined by thirty-three
   cross ties. Everything remains static to keep the helix contemplative.

## Numerology anchors
- Grid counts (9×11), path totals (22), and cross ties (33) keep the canonical ratios alive.
- Spiral sampling uses 144 points so the golden curve breathes with the same covenant numbers.
- Node radii and margins divide the canvas using {3, 7, 9, 11, 22, 33, 99, 144} so each layer shares a
  common numeric backbone.

## ND-safe and trauma-informed choices
- No animation, timers, or autoplay. Rendering occurs in one deterministic pass.
- Calm palette defaults with explicit status messages and on-canvas captions when fallbacks activate.
- Layered drawing order preserves depth instead of flattening geometry into a single outline.
- ASCII quotes, UTF-8, LF newlines, and pure helpers keep the module portable for offline review.

## Customising safely
- Adjust colours by editing `data/palette.json`. Provide `bg`, `ink`, `muted`, and six `layers`
  entries. Missing keys fall back to the sealed defaults.
- Override numerology constants or geometry by passing options to `renderHelix`. Every helper clamps
  inputs to ND-safe ranges and documents why ratios matter.
- Compose new static layers by following the helper pattern inside `js/helix-renderer.mjs`. Preserve
  the calm sequencing and comment "why" for each sacred adjustment.
