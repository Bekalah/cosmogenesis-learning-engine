# Cosmic Helix Renderer

Offline-only canvas demo encoding a four-layer cosmology without motion.

## Usage
1. Double-click `index.html` in this folder (no server required).
2. A 1440×900 canvas renders four static layers:
   - **Vesica field** – intersecting circle grid.
   - **Tree-of-Life scaffold** – ten sephirot linked by twenty-two paths.
   - **Fibonacci curve** – golden spiral polyline.
   - **Double-helix lattice** – two phase-shifted sine tracks.
3. Palette colours live in `data/palette.json`. Missing data triggers a gentle notice and safe defaults.

## ND-safe choices
- Static drawing; no animation, audio, or network requests.
- Calm contrast palette and generous spacing for readability.
- Layer order clarifies depth without flashing.
- Geometry parameters use numerology constants 3, 7, 9, 11, 22, 33, 99, 144.

## Development
The renderer has no build step and no dependencies.

Files:
- `index.html`
- `js/helix-renderer.mjs`
- `data/palette.json`

Modify `palette.json` to adjust colours. All code uses ASCII quotes, UTF-8, LF newlines, and small pure functions.
