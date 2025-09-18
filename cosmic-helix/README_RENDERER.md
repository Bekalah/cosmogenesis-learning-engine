# Cosmic Helix Renderer (Offline, ND-safe)

Static HTML + Canvas capsule that renders the layered cosmology without motion. Double-clicking `index.html` paints a 1440x900
canvas with four calm layers: vesica grid, Tree-of-Life scaffold, Fibonacci curve, and a double-helix lattice. Everything runs
offline with no build tools or external libraries.

## Files
- `index.html` - offline entry point that loads the palette (with fallback), seeds numerology constants, and invokes the
  renderer.
- `js/helix-renderer.mjs` - ES module of small pure drawing helpers. Each helper documents why the ND-safe order matters.
- `data/palette.json` - optional palette override. If missing, the renderer keeps a safe fallback and paints a notice on the
  canvas.

## Usage (offline)
1. Open `cosmic-helix/index.html` directly in any modern browser. No server or network connection is required.
2. The header status reports whether the palette loaded. Missing data keeps the fallback colours and adds a gentle notice to the
   canvas corner.
3. The canvas renders the four layers once using the numerology constants (3, 7, 9, 11, 22, 33, 99, 144) baked into the helper
   functions.

## Layer order (back to front)
1. **Vesica field** - intersecting circle lattice spaced with 9x11 divisions to honour womb-of-forms geometry.
2. **Tree-of-Life scaffold** - ten sephirot nodes joined by twenty-two steady paths, scaled by the numerology denominators for
   clarity.
3. **Fibonacci curve** - static logarithmic spiral sampled over 144 points with golden ratio pacing.
4. **Double-helix lattice** - two phase-shifted strands with thirty-three cross ties and no motion.

## ND-safe and trauma-informed choices
- No animation or timers; everything draws once per load to avoid sensory spikes.
- Calm palette defaults with status messaging explain fallbacks so nothing fails silently.
- Comments explain why each layer order and spacing choice preserves depth without flattening geometry.
- ASCII quotes, UTF-8, and LF newlines keep the module portable across offline environments.

## Customising safely
- Adjust `data/palette.json` to change colours. Keys remain `bg`, `ink`, `muted`, and `layers` (array of six hex strings).
- Pass a custom geometry object when calling `renderHelix` if deeper tuning is required; the function validates numbers and
  keeps the ND-safe structure intact.

