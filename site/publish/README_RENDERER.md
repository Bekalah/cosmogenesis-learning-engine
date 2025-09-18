# Cosmic Helix Atelier Renderer

This directory hosts the offline-first Cosmic Helix renderer used by the Atelier
site build. See `../../README_RENDERER.md` for the full breakdown of files,
usage notes, and ND-safe rationale.

Key entry points:
- `index.html` – double-click to launch the Atelier layout with Calm Mode and hero asset.
- `js/helix-renderer.mjs` – layered canvas renderer (vesica, Tree of Life, Fibonacci, helix).
- `data/` – offline JSON copies for palette, geometry, and node metadata.
- `assets/img/helix-hero.png` – calm gradient hero (tracked with Git LFS).
