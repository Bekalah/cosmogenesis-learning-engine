# Cosmic Helix Renderer


Static, offline renderer that layers Vesica geometry, Tree-of-Life scaffolding, a Fibonacci-inspired curve, and a static double-helix lattice. Designed for ND-safe review: calm palette, no animation, generous spacing, and comments that explain numerology-driven decisions.

## Files

- `index.html` — entry point. Open directly in any modern browser (double-click). Loads palette data when available and falls back safely if the JSON cannot be read.
- `js/helix-renderer.mjs` — pure ES module with the drawing routines. Accepts a canvas 2D context plus palette and numerology constants.
- `data/palette.json` — optional local palette override. Edit colors to suit the atelier; renderer falls back to built-in hues if this file is missing or blocked by the browser.

## Usage

1. Download or clone the repository.
2. Double-click `index.html` (no server, no build step).
3. If you edit `data/palette.json`, refresh the page. Browsers that restrict `fetch` over the `file://` protocol will automatically use the fallback palette and display a notice in the header.

## Layer order

1. **Vesica field** — Seven by three lattice of intersecting circles, softened alpha to avoid visual overload.
2. **Tree-of-Life scaffold** — Ten sephirot nodes with twenty-two paths mapped to numerology constants.
3. **Fibonacci curve** — Static polyline grown from Fibonacci numbers up to 144, preserving a harmonic spiral without motion.
4. **Double-helix lattice** — Two offset strands with lattice rungs rendered at regular intervals; no animation.

Each routine uses the constants `{3, 7, 9, 11, 22, 33, 99, 144}` so the geometry remains parameterized by the numerology canon.

## Accessibility & ND-safe rationale

- No animation or flashing elements.
- High-contrast typography and background colors with calm tones.
- Layered drawing order keeps geometry legible without flattening depth into a single outline.
- All code is pure ES modules using ASCII quotes and LF newlines.

## Customisation

- Change the palette by editing `data/palette.json` (hex strings). All colors cascade through the four layers.
- Adjust numerology constants in `index.html` before calling `renderHelix` if alternative sacred ratios are needed.
- Geometry logic is modular; duplicate and adapt the helper functions in `js/helix-renderer.mjs` to compose new scenes while keeping layers discrete.
=======
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

