# Cosmic Helix Renderer (Offline, ND-safe)

Static HTML + Canvas capsule that paints the layered cosmology exactly once when `index.html` is opened. The module honours the covenant: ND-safe colours, no motion, and sacred geometry rendered in four calm passes.

## Files
- `index.html` — offline entry point that applies the palette (or sealed fallback) and calls the renderer.
- `js/helix-renderer.mjs` — ES module of pure drawing helpers sequenced in the ND-safe layer order.
- `data/palette.json` — optional palette override. Missing data triggers the sealed palette and a gentle inline notice.
- `README_RENDERER.md` — this guide.

## Usage (offline)
1. Double-click `cosmic-helix/index.html` in any modern browser. No server or build step required.
2. The header status reports whether `data/palette.json` loaded. If browsers block the fetch on the `file://` protocol, the sealed palette activates automatically.
3. The canvas renders the vesica field, Tree-of-Life scaffold, Fibonacci curve, and static double-helix lattice once. There is no animation, autoplay, or timers.

## Layer order (back to front)
1. **Vesica field** — a 9×11 lattice of intersecting circles (3, 9, 11 ratios) plus a central vesica pair for womb-of-forms depth.
2. **Tree-of-Life scaffold** — ten sephirot positioned by calm 33-based margins with twenty-two steady connective paths.
3. **Fibonacci curve** — a logarithmic spiral sampled over 144 golden-ratio steps to evoke organic growth without motion.
4. **Double-helix lattice** — two phase-shifted strands with thirty-three rungs, rendered as still polylines to preserve layered geometry.

## ND-safe and trauma-informed choices
- Pure functions render once; there are no timers, autoplay, or strobe effects.
- Palette fallbacks and status messaging keep surprises minimal and explain why fallbacks appear.
- Calm hex colours meet WCAG-friendly contrast against the #0b0b12 background.
- Layer separation keeps the sacred geometry volumetric instead of flattening it into a single outline.

## Customising safely
- Update `data/palette.json` with `bg`, `ink`, `muted`, and a six-colour `layers` array to tune hues. Invalid or missing values fall back silently to the sealed palette.
- Pass a `geometry` object into `renderHelix` (when embedding the module elsewhere) to adjust counts or spacing. Every override is validated to keep ratios positive and ND-safe.
- Keep additions static, well-commented, and grounded in the numerology constants (3, 7, 9, 11, 22, 33, 99, 144).
