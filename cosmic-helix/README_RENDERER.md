# Cosmic Helix Renderer (Offline, ND-safe)

Static HTML + Canvas renderer that draws four calm geometry layers: Vesica field, Tree-of-Life scaffold, Fibonacci spiral, and a static double-helix lattice. Everything runs by double-clicking `index.html`; no build tools, no motion.

## Why this sits in `cosmic-helix/`
Keeping the renderer inside this folder protects the root `index.html` lore while fulfilling the layered cosmology brief. Comments in the HTML and module explain that decision for future stewards.

## Files
- `index.html` – entry point with status line, numerology constants, and palette loading.
- `js/helix-renderer.mjs` – pure ES module of small drawing functions (one per layer plus helpers).
- `data/palette.json` – optional colour overrides; removal triggers a gentle fallback notice.

## Usage (offline)
1. Open `index.html` directly in a modern browser (no server required).
2. The header status reports whether the palette JSON was loaded or if the safe fallback colours were used.
3. A 1440×900 canvas renders the four layers in order:
   - **Layer 1** Vesica field – intersecting lenses spaced with 3/7/11 numerology.
   - **Layer 2** Tree-of-Life – ten sephirot and twenty-two linking paths.
   - **Layer 3** Fibonacci spiral – golden-ratio polyline sampling 33 segments.
   - **Layer 4** Double-helix lattice – two sine strands with 22 static cross ties.
4. If the palette file cannot be fetched (common under `file://`), the canvas draws a small notice in the corner and keeps the default colours.

## ND-safe design choices
- One render pass, no animation, no autoplay, no flashing.
- Muted palette and soft line widths protect sensory comfort.
- Comments in code describe each safety decision for transparency.
- Geometry proportions lean on the requested numerology constants: 3, 7, 9, 11, 22, 33, 99, and 144.

## Customising safely
- Adjust colours in `data/palette.json`; the file expects keys `bg`, `ink`, `muted`, and a six-entry `layers` array.
- Add new geometry by creating additional pure helper functions in `js/helix-renderer.mjs` and calling them after the existing layers.
- Keep new work static, ASCII-only, and well commented so the ND-safe covenant remains intact.
