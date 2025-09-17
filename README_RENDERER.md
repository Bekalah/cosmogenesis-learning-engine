# Cosmic Helix Renderer

Static, offline-first canvas renderer expressing the layered cosmology brief. This module has no dependencies, no build step, and respects ND-safe requirements (calm palette, no motion, readable contrast).

## Files

- `index.html` — entry point with inline module loader and status messaging.
- `js/helix-renderer.mjs` — pure ES module that renders the four geometry layers.
- `data/palette.json` — optional palette override loaded locally; safe fallback is used when missing.

## Run Locally (Offline)

1. Ensure the three files above remain in the same relative directories.
2. Double-click `index.html` (or open via `File → Open` in any modern browser).
3. The canvas renders at 1440×900 pixels; resizing the window preserves aspect by letterboxing.

No servers, bundlers, or network connections are required.

## Geometry Layers

1. **Vesica Field** — intersecting circles and 22 translucent petals establish the vesica matrix.
2. **Tree of Life** — 10 sephirot nodes linked by 22 paths, positioned with numerology-friendly spacing.
3. **Fibonacci Curve** — static log-spiral polyline scaled with the golden ratio and numerology constants.
4. **Double Helix Lattice** — two sine-wave rails plus 22 cross-braces form a steady lattice, no animation.

The renderer uses numerology constants \(3, 7, 9, 11, 22, 33, 99, 144\) to drive proportions, segment counts, and lattice density. Comments within the module explain how each layer applies these values.

## Palette and Accessibility

- Modify `data/palette.json` to tune the palette while keeping ND-safe contrast.
- If the JSON file is missing or invalid, the inline script logs a gentle notice and falls back to a safe palette.
- All drawing functions prioritise soft gradients, moderate line weights, and static composition to avoid sensory overload.

## Extending Safely

- Add new layers by composing additional pure functions in `helix-renderer.mjs` and calling them from `renderHelix`.
- Keep any geometry static and document the intent inline so future maintainers understand the ND-safe choices.
- Avoid introducing external libraries, build tooling, or animated effects.
