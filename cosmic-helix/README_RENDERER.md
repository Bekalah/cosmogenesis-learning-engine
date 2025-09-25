# Cosmic Helix Renderer (Offline, ND-safe)

Static HTML + Canvas capsule that paints the layered cosmology exactly once when `index.html` is opened. The module honours the
covenant: ND-safe colours, no motion, and sacred geometry rendered in four calm passes.

## Files
- `index.html` — offline entry point that applies the palette, loads optional geometry overrides, and calls the renderer.
- `js/helix-renderer.mjs` — ES module of small pure helpers sequenced in the ND-safe layer order.
- `data/palette.json` — optional colour overrides. Missing data triggers the sealed palette and a gentle inline notice.
- `data/geometry.json` — optional geometry overrides that respect numerology ratios. Missing data keeps the sealed layout.
- `README_RENDERER.md` — this guide.

## Usage (offline)
1. Double-click `cosmic-helix/index.html` in any modern browser. No server, build step, or network connection is required.
2. The header status confirms whether the palette and geometry files loaded. If a browser blocks `file://` fetches, the sealed
   fallbacks stay active and the notice appears in the canvas corner.
3. The canvas draws the four-layer cosmology exactly once: vesica grid, Tree-of-Life scaffold, Fibonacci curve, and static
   double-helix lattice.

## Layer order (back to front)
1. **Vesica field** — a 3/7/9/11 grid of intersecting circles that opens with a central vesica pair for womb-of-forms depth.
2. **Tree-of-Life scaffold** — ten sephirot nodes with twenty-two calm paths spaced on gentle 33-based margins.
3. **Fibonacci curve** — logarithmic spiral sampled over 144 points to suggest growth without motion.
4. **Double-helix lattice** — two still strands with thirty-three cross ties, rendered as layered polylines to preserve depth.

## ND-safe and trauma-informed choices
- No animation, autoplay, or timers; every helper is pure and runs once on load.
- Calm palette defaults and status messaging reduce surprises, with sealed fallbacks when data is unavailable.
- Layered geometry keeps sacred forms three-dimensional instead of flattening them.
- ASCII quotes, UTF-8 encoding, and LF newlines maintain compatibility across offline environments.

## Customising safely
- Update `data/palette.json` with `bg`, `ink`, `muted`, and a six colour `layers` array to tune hues. Invalid or missing values
  fall back silently to the sealed palette.
- Edit `data/geometry.json` to change counts, spacing, or offsets, or pass a `geometry` object to `renderHelix` directly. The
  renderer validates every override to ensure ratios stay positive and ND-safe.
- Keep additions static, well-commented, and grounded in the numerology constants (3, 7, 9, 11, 22, 33, 99, 144).
