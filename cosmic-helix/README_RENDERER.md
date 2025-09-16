# Cosmic Helix Renderer

Static, offline HTML+Canvas renderer that layers the requested cosmology: vesica grid, Tree-of-Life scaffold, Fibonacci spiral, and a static double-helix lattice. Everything runs by double-clicking `index.html`; no build tools or network calls are required.

## Files
- `index.html` - entry document that wires the canvas, loads the optional palette, and reports status.
- `js/helix-renderer.mjs` - pure ES module with four small drawing routines.
- `data/palette.json` - optional colour overrides (safe defaults render when missing).

## Usage
1. Open `index.html` directly in a modern browser (file protocol is fine; no server).
2. A 1440x900 canvas renders once. The header status line tells you whether the palette file loaded or a fallback palette was used.
3. Explore the layered geometry. There is no animation, audio, or motion scripting.

## Layer order
1. **Vesica field** - 11x9 circle lattice (99 lenses) referencing constants 3, 7, 9, 11.
2. **Tree-of-Life scaffold** - ten sephirot with twenty-two paths, strokes softened for ND-safe contrast.
3. **Fibonacci curve** - golden spiral polyline sampled in 144 steps with phi growth.
4. **Double-helix lattice** - two phase-shifted strands plus ninth-step cross ties to suggest the lattice without motion.

## ND-safe design choices
- One-time render: no animation, autoplay, flashing, or rapid colour changes.
- Muted palette with readable contrast; CSS variables mirror the canvas background so the chrome stays calm.
- Inline comments explain why each safety choice exists for future caretakers.

## Numerology anchors
The drawing functions weave the requested constants (3, 7, 9, 11, 22, 33, 99, 144) into grid counts, stroke weights, spiral turns, and helix sampling so the geometry honours Codex 144:99 symbolism.

## Custom palette
Edit `data/palette.json` to adjust colours. Provide `bg`, `ink`, `muted`, and a six-value `layers` array (back-to-front). If the file is absent or malformed, the renderer logs a gentle notice and uses the bundled fallback palette.

## Troubleshooting
- **Palette notice appears** - Browsers often block `fetch` over `file://`; the fallback palette still renders safely.
- **Blank canvas** - The status line reports when a 2D context is unavailable; try an up-to-date Firefox, Safari, or Chromium build.
- **Harsh edits** - Keep hues mid-range and strokes thin to respect the trauma-informed covenant.

*Seal Motto: Per Texturas Numerorum, Spira Loquitur.*
