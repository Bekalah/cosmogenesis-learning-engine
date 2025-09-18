# Cosmic Helix Renderer (Offline, ND-safe)

Static HTML + Canvas capsule that renders the layered cosmology with no motion. Double-clicking `index.html` paints a
1440x900 canvas in four calm passes: vesica field, Tree-of-Life scaffold, Fibonacci curve, and the static double helix.
Everything runs offline with zero dependencies so the lore remains portable.

## Files
- `index.html` - offline entry point. Loads the optional palette, seeds numerology constants, and invokes the renderer.
- `js/helix-renderer.mjs` - ES module of pure drawing helpers. Comments explain why each layer order stays ND-safe.
- `data/palette.json` - optional palette override. Missing or invalid data keeps the sealed fallback and shows a gentle
  notice in the canvas corner.

## Usage (offline)
1. Open `cosmic-helix/index.html` directly in any modern browser (no server required).
2. The header status reports whether `data/palette.json` loaded. If file:// security blocks the fetch, the fallback palette
   activates and the canvas prints a calm notice.
3. Rendering happens once per load using the numerology constants (3, 7, 9, 11, 22, 33, 99, 144) baked into the geometry.

## Layer order (back to front)
1. **Vesica field** - intersecting circle lattice spaced with 9x11 divisions (why: honours womb-of-forms geometry).
2. **Tree-of-Life scaffold** - ten sephirot joined by twenty-two paths, scaled by 33/99 ratios so lines stay readable.
3. **Fibonacci curve** - logarithmic spiral sampled over 144 points with golden ratio pacing.
4. **Double-helix lattice** - two phase-shifted strands with thirty-three cross ties and no animation.

## ND-safe and trauma-informed choices
- No timers or autoplay; the canvas draws once to avoid sensory spikes.
- Calm palette defaults with clear status messaging so fallbacks never surprise the viewer.
- Layered depth is preserved by drawing in ordered passes rather than flattening forms.
- All code sticks to ASCII quotes, UTF-8, LF newlines, and small pure helpers for ease of stewardship.

## Customising safely
Update `data/palette.json` to supply new colours:

```json
{
  "bg": "#0b0b12",
  "ink": "#e8e8f0",
  "muted": "#a6a6c1",
  "layers": ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
}
```

If the file is absent or malformed, the renderer keeps the sealed palette, updates the header status, and prints the gentle
notice in the canvas so nothing fails silently. Geometry overrides can be passed to `renderHelix` when embedding the module,
but keep the covenant: static rendering, ND-safe palettes, and comments explaining every change.
