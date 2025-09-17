# Cosmic Helix Renderer

Static, offline HTML + Canvas renderer that draws four calm layers of sacred geometry for the Cosmogenesis Learning Engine. The code is ND-safe: no animation, soft contrast, and every helper is a small pure function with comments explaining the safety choices.

## Files
- `index.html` — entry point. Double-click to render the canvas with no server or network access.
- `js/helix-renderer.mjs` — ES module with layered drawing helpers.
- `data/palette.json` — optional palette override; the renderer falls back gracefully when the file is absent.

## Usage
1. Open `index.html` directly in any modern browser.
2. A 1440×900 canvas renders four ordered layers once: Vesica field, Tree-of-Life scaffold, Fibonacci curve, and a double-helix lattice.
3. The header status text reports whether the palette file loaded or if the safe fallback is active. When the palette is missing, a quiet note also appears on the canvas itself.

## ND-safe design choices
- **No motion:** every layer draws in a single pass; no animation hooks or timers.
- **Calm contrast:** muted defaults and palette validation prevent harsh colour spikes.
- **Layered depth:** each layer draws in order so the geometry reads with depth without relying on motion.
- **Commented intent:** in-code comments explain why each safety choice exists for future stewards.

## Geometry & numerology
- Vesica field spacing references constants 3, 7, 9, 11, 22, and 33 to echo the requested ratios.
- Tree-of-Life layout uses the canonical ten sephirot with twenty-two connecting paths.
- Fibonacci curve is a static golden spiral polyline sampled with 99 points.
- Double-helix lattice samples 144 points across three sine cycles to keep the numerology visible.

## Custom palette
Edit `data/palette.json` to supply your own colours. Required keys:

```json
{
  "bg": "#0b0b12",
  "ink": "#e8e8f0",
  "muted": "#a6a6c1",
  "layers": ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
}
```

If the file is missing or malformed, the renderer keeps drawing with the bundled palette, records the fallback in the status line, and prints a small note on the canvas.

## Extension guidance
Add new geometry by introducing additional pure helper functions in `js/helix-renderer.mjs` and calling them after the existing layers. Maintain ASCII quotes, UTF-8 encoding, LF newlines, and explain any lore additions with comments so ND-safe intent stays intact.
