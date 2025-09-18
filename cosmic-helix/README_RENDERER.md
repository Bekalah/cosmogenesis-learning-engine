# Cosmic Helix Renderer (Offline, ND-safe)

Static HTML + Canvas renderer that draws the requested four-layer cosmology on a fixed 1440x900 stage. It lives in `cosmic-helix/` so the wider site keeps its lore-first entry point.

## Files
- `index.html` - offline entry point that loads the optional palette, seeds numerology constants, and invokes the renderer.
- `js/helix-renderer.mjs` - ES module of small pure drawing helpers (one layer per function plus shared utilities).
- `data/palette.json` - optional colour overrides. Missing data triggers a calm fallback and a gentle notice.

## Usage (offline)
1. Open `cosmic-helix/index.html` directly in any modern browser (no server required).
2. The header status reports whether `data/palette.json` loaded successfully.
3. The canvas renders the four layers once. If the palette file is missing under `file://` rules, the renderer prints a small notice while using the sealed fallback palette.

## Layer order (back to front)
1. **Vesica field** - intersecting circle lattice spaced with 3/7/9/11 ratios to set the womb-of-forms foundation.
2. **Tree-of-Life scaffold** - ten sephirot nodes linked by twenty-two paths, scaled by 33/99/144 denominators for clarity.
3. **Fibonacci curve** - logarithmic spiral polyline sampled over 144 points with golden-ratio pacing.
4. **Double-helix lattice** - two static sine strands with cross ties drawn across 33 anchor points.

## ND-safe and trauma-informed choices
- **No motion:** the renderer draws once per load with no timers or autoplay hooks.
- **Calm palette:** palette validation keeps contrast comfortable and applies sealed fallbacks when JSON is absent.
- **Layered depth:** geometry is rendered as separate layers instead of flattening sacred forms into one outline.
- **Commented intent:** inline comments explain why safety choices exist for future stewards.

## Customising safely
Update `data/palette.json` to supply custom colours:

```json
{
  "bg": "#0b0b12",
  "ink": "#e8e8f0",
  "muted": "#a6a6c1",
  "layers": ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
}
```

If the file is missing or malformed the renderer keeps the sealed palette, updates the status line, and posts the gentle notice on the canvas so nothing fails silently.

Add new geometry by composing additional pure helpers inside `js/helix-renderer.mjs`. Maintain the covenant: ASCII quotes, UTF-8 with LF newlines, static rendering, and inline comments describing lore or safety rationale.
