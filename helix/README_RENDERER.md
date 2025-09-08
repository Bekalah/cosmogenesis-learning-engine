# Cosmic Helix Renderer
Per Texturas Numerorum, Spira Loquitur.

Offline-only canvas demo. Encodes a four-layer cosmology without motion.

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
`index.html` defines these as `NUM` and passes them to the renderer.

## Develop
No tooling required. Files:
- `index.html`
- `js/helix-renderer.mjs`
- `data/palette.json`

Modify `palette.json` to adjust colors. Missing data triggers a gentle inline notice with safe defaults.
