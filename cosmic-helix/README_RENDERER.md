# Cosmic Helix Renderer (Offline, ND-safe)

Static HTML + Canvas renderer that paints the requested four-layer cosmology on a fixed 1440x900 stage. Open `index.html` directly in any modern browser and the canvas renders once without motion.

## Files
- `index.html` - offline entry that loads the optional palette and geometry files, applies sealed fallbacks, and calls the renderer.
- `js/helix-renderer.mjs` - ES module of small pure helpers. Each helper documents the ND-safe layer order.
- `data/palette.json` - optional colour overrides. Missing data triggers the sealed palette, a status note, and a canvas notice.
- `data/geometry.json` - optional geometry overrides for spacing, node layout, and helix pacing.

## Usage (offline)
1. Double-click `cosmic-helix/index.html`. No server, build step, or network connection is required.
2. The header status confirms whether the palette and geometry files loaded. Missing files fall back gracefully and keep the canvas ND-safe.
3. The renderer draws the vesica field, Tree-of-Life scaffold, Fibonacci curve, and double-helix lattice exactly once.

## Layer order (back to front)
1. **Vesica field** - intersecting circle lattice spaced with 3/7/9/11 ratios to seed the womb-of-forms grid.
2. **Tree-of-Life scaffold** - ten sephirot nodes joined by twenty-two calm paths derived from numerology constants.
3. **Fibonacci curve** - logarithmic spiral polyline sampled over 144 points for gentle golden-ratio growth.
4. **Double-helix lattice** - two still strands with thirty-three cross ties and no motion.

## ND-safe and trauma-informed choices
- No animation, autoplay, or timers. Rendering completes in a single pass.
- Calm palette defaults with explicit status messaging so fallbacks never surprise viewers.
- Layered geometry keeps sacred forms three-dimensional instead of flattening them into a single outline.
- ASCII quotes, UTF-8, and LF newlines preserve portability for offline review.

## Customising safely
- Adjust `data/palette.json` to supply custom colours. Provide `bg`, `ink`, `muted`, and a six colour `layers` array.
- Tune spacing by editing `data/geometry.json` or by passing a `geometry` object to `renderHelix`. The module validates every override to keep ND-safe bounds.
- Compose new layers by following the pure helper pattern inside `js/helix-renderer.mjs`. Keep additions static and well-commented to honour the covenant.
