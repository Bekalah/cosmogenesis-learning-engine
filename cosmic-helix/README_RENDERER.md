# Cosmic Helix Renderer (Offline, ND-safe)

Static HTML + Canvas capsule that paints the layered cosmology once on load. Double-clicking `index.html` opens a 1440×900 stage that renders four calm layers: Vesica field, Tree-of-Life scaffold, Fibonacci curve, and a static double-helix lattice. Everything runs offline with zero dependencies so the lore stays portable.

## Files
- `index.html` - offline entry point. Loads the optional palette, seeds numerology constants, and invokes the renderer.
- `js/helix-renderer.mjs` - ES module of small pure helpers. Comments explain why the ND-safe layer order stays intact.
- `data/palette.json` - optional colour overrides. Missing data keeps the sealed fallback and prints a gentle canvas notice.

## Usage (offline)
1. Open `cosmic-helix/index.html` directly in any modern browser (no server required).
2. The header status reports whether `data/palette.json` loaded. File-system security may block the fetch, so the fallback palette activates without error.
3. Rendering happens once per load using the numerology constants (3, 7, 9, 11, 22, 33, 99, 144) embedded in the geometry helpers.
4. If the palette file is missing, the canvas prints a small notice while keeping the ND-safe colours.

## Layer order (back to front)
1. **Vesica field** - intersecting circle lattice spaced with 9×11 divisions to honour the womb-of-forms geometry.
2. **Tree-of-Life scaffold** - ten sephirot joined by twenty-two paths scaled by 33/99 ratios for clear lineage lines.
3. **Fibonacci curve** - logarithmic spiral sampled over 144 points so golden growth remains gentle and readable.
4. **Double-helix lattice** - two phase-shifted strands with thirty-three cross ties and no motion.

## ND-safe and trauma-informed choices
- No animation, autoplay, or timers; the canvas draws once to avoid sensory spikes.
- Calm palette defaults with explicit status messaging so fallbacks never surprise the viewer.
- Layered geometry preserves depth instead of flattening sacred forms into a single outline.
- ASCII quotes, UTF-8 text, and LF newlines keep the module portable for offline caretakers.

## Customising safely
- Update `data/palette.json` to supply custom colours. Provide `bg`, `ink`, `muted`, and a six colour `layers` array.
- Pass a `geometry` object into `renderHelix` when embedding the module elsewhere; the helpers validate overrides before drawing.
- Extend new layers by following the pure helper pattern in `js/helix-renderer.mjs`. Keep additions static and well-commented to honour the covenant.
