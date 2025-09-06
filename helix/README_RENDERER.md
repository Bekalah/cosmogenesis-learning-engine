# Cosmic Helix Renderer

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

## Develop
No tooling required. Files:
- `index.html`
- `js/helix-renderer.mjs`
- `data/palette.json`

Modify `palette.json` to adjust colors. Missing data triggers a gentle inline notice with safe defaults.
