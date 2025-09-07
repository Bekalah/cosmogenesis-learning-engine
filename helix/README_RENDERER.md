# Cosmic Helix Renderer

Offline-only canvas demo. Encodes a four-layer cosmology without motion.

## Usage
1. Open `index.html` in any modern browser (no server needed).
2. A 1440×900 canvas will render four static layers:
   - **Vesica field** — intersecting circles forming the womb of forms.
   - **Tree-of-Life scaffold** — ten sephirot with simple straight paths.
   - **Fibonacci curve** — golden spiral polyline anchored to centre.
   - **Double-helix lattice** — two phase-shifted sine tracks.
3. Palette can be customized in `data/palette.json`. If missing, a calm fallback palette is used and a notice appears in the header.

## Why ND-safe?
- Static drawing; no animation or flicker.
- Calm contrast palette to reduce sensory strain.
- Layer order clarifies depth without flashing.
- Double-click `index.html` – no network, no build tools.

## Layers
1. Vesica field (intersecting circles)
2. Tree-of-Life scaffold (10 sephirot, 22 paths)
3. Fibonacci curve (log spiral)
4. Double-helix lattice (phase-shifted sine waves)

Geometry parameters lean on symbolic numbers:
3, 7, 9, 11, 22, 33, 99, and 144.

## Extending
The renderer is intentionally minimal. Future layers or overlays can be added by extending `renderHelix` with new draw functions while preserving the calm visual hierarchy.

## Develop
No tooling required. Files:
- `index.html`
- `js/helix-renderer.mjs`
- `data/palette.json`

Modify `palette.json` to adjust colors. Missing data triggers a gentle inline notice with safe defaults.
