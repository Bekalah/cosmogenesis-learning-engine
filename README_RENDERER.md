# Cosmic Helix Atelier Renderer

Static, offline-first canvas capsule staged in `site/publish/`. The Atelier layout
wraps the Cosmic Helix canvas with Calm Mode controls, hero imagery, and textual
node summaries so neurodivergent viewers can study the geometry without motion.

## Files
- `site/publish/index.html` – Atelier landing page with Calm Mode toggle, hero asset, and
offline loader logic. Open this file directly; no server is required.
- `site/publish/js/helix-renderer.mjs` – pure ES module that draws the Vesica field, Tree of Life,
Fibonacci curve, and static double-helix lattice. Geometry, palette, and numerology inputs are
validated so fallbacks stay calm.
- `site/publish/js/calm-mode.mjs` – stores the Calm Mode preference, respects `prefers-reduced-motion`,
and applies the `is-calm` class that softens the palette.
- `site/publish/js/node-renderer.mjs` – renders sephirot and module summaries from `data/modules.json`
with sealed fallbacks so no list goes blank offline.
- `site/publish/data/` – offline JSON copies for palette, geometry, and node metadata.
- `site/publish/assets/img/helix-hero.png` – static hero gradient authored with Git LFS so Netlify
serves the calm preview without hitting bandwidth limits.

## Usage
1. Clone the repository and ensure Git LFS is installed (required for the hero PNG and future imagery).
2. Open `site/publish/index.html` directly in any modern browser. The page runs from `file://` safely.
3. Toggle Calm Mode to reduce contrast if needed. If palette or geometry JSON is missing, the canvas
adds a gentle notice and uses its internal sealed defaults.

## Layer order (back to front)
1. **Vesica field** – nine-by-eleven circle lattice referencing numerology {9, 11, 33}.
2. **Tree of Life scaffold** – ten sephirot and twenty-two paths scaled by {7, 22, 99} ratios.
3. **Fibonacci curve** – logarithmic spiral sampling 144 points of the growth sequence.
4. **Double-helix lattice** – twin sine strands with thirty-three cross ties; completely static.

## Accessibility & ND-safe rationale
- Calm Mode mirrors `prefers-reduced-motion` and persists locally so visitors keep their chosen contrast.
- Canvas renders once; no animation or looping timers.
- JSON fetches fall back gracefully when `file://` blocks fetch, keeping the canvas populated and posting a notice.
- Textual node cards echo the geometry for readers who prefer words before visuals.

## Customisation
- Adjust colours by editing `site/publish/data/palette.json`.
- Override numerology or geometry values by editing `data/geometry.json` or passing custom objects into `renderHelix`.
- Extend the layout by duplicating the small pure-function pattern in `js/node-renderer.mjs`. Keep additions static and commented to preserve ND safety.
