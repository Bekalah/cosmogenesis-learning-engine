# Cosmic Helix Renderer (Offline, ND-safe)

Static offline renderer that draws the requested four-layer cosmology on a 1440x900 canvas. The module stays inside `cosmic-helix/` so the main project index keeps its lore focus (why: preserves the existing entry point while adding this research tool).

## Files
- `index.html` – entry point that loads the palette (with fallback) and invokes the renderer.
- `js/helix-renderer.mjs` – pure drawing routines for the four calm layers.
- `data/palette.json` – optional colour overrides. Missing data triggers a safe fallback.

## Usage
1. Double-click `index.html` in any modern browser. No server or network requests are required.
2. The status line reports whether the palette file loaded or if the fallback colours were applied.
3. The canvas renders these static layers in order:
   - **L1 Vesica field** – intersecting circles arranged with 3/7/9/11 spacing to evoke the vesica womb.
   - **L2 Tree-of-Life scaffold** – ten sephirot linked by twenty-two paths, sized from 99/144 ratios for readability.
   - **L3 Fibonacci curve** – a golden spiral polyline sampled across 144 points for smooth calm arcs.
   - **L4 Double-helix lattice** – two phase-shifted sine strands with thirty-three cross ties.

## ND-safe design notes
- Single render pass only; there is no animation, autoplay, or flashing.
- Muted palette with readable contrast and transparent strokes reduces sensory strain.
- Inline comments explain how numerology constants guide spacing so future stewards understand the symbolism.
- If the palette file is absent, both the header and the canvas receive a gentle notice instead of failing silently.

## Customising colour
Edit `data/palette.json` to tune colours. Keep the keys:
- `bg` – background colour for both page and canvas.
- `ink` – text colour used for notices.
- `muted` – optional accent used by the status line.
- `layers` – array of six hex values applied to the four geometry layers plus helix rungs.

If the JSON is missing or malformed, the renderer loads bundled safe colours and reports the fallback.

## Extending safely
Add new geometry by composing additional pure helper functions inside `js/helix-renderer.mjs`. Maintain the ND-safe covenant: static rendering, layered depth (never flattened into a single outline), calm palette, ASCII quotes, UTF-8, and detailed comments on why choices were made.
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
Static, offline HTML + Canvas renderer that draws four calm layers of sacred geometry for the Cosmogenesis Learning Engine. The code is ND-safe: no animation, soft contrast, and every helper is a small pure function with comments explaining the safety choices.

## Files
- `index.html` — entry point. Double-click to render the canvas with no server or network access.
- `js/helix-renderer.mjs` — ES module with layered drawing helpers.
- `data/palette.json` — optional palette override; the renderer falls back gracefully when the file is absent.

## Usage
1. Open `index.html` directly in any modern browser.
2. A 1440×900 canvas renders four ordered layers once: Vesica field, Tree-of-Life scaffold, Fibonacci curve, and a double-helix lattice.
3. The header status text reports whether the palette file loaded or if the safe fallback is active. When the palette is missing, a quiet note also appears on the canvas itself.

## ND-safe design choices
- **No motion:** every layer draws in a single pass; no animation hooks or timers.
- **Calm contrast:** muted defaults and palette validation prevent harsh colour spikes.
- **Layered depth:** each layer draws in order so the geometry reads with depth without relying on motion.
- **Commented intent:** in-code comments explain why each safety choice exists for future stewards.

## Geometry & numerology
- Vesica field spacing references constants 3, 7, 9, 11, 22, and 33 to echo the requested ratios.
- Tree-of-Life layout uses the canonical ten sephirot with twenty-two connecting paths.
- Fibonacci curve is a static golden spiral polyline sampled with 99 points.
- Double-helix lattice samples 144 points across three sine cycles to keep the numerology visible.

## Custom palette
Edit `data/palette.json` to supply your own colours. Required keys:

```json
{
  "bg": "#0b0b12",
  "ink": "#e8e8f0",
  "muted": "#a6a6c1",
  "layers": ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
}
```

If the file is missing or malformed, the renderer keeps drawing with the bundled palette, records the fallback in the status line, and prints a small note on the canvas.

## Extension guidance
Add new geometry by introducing additional pure helper functions in `js/helix-renderer.mjs` and calling them after the existing layers. Maintain ASCII quotes, UTF-8 encoding, LF newlines, and explain any lore additions with comments so ND-safe intent stays intact.
Static, offline HTML + Canvas renderer that layers vesica field, Tree-of-Life scaffold, Fibonacci curve, and a fixed double-helix lattice. Designed for ND-safe viewing with calm contrast and zero motion.

## Files
- `index.html` - entry point; double-click to run offline.
- `js/helix-renderer.mjs` - pure drawing routines composed as ES module.
- `data/palette.json` - optional palette override; a fallback palette is bundled.

## Usage
1. Open `index.html` in any modern browser (no server required).
2. A 1440x900 canvas renders four static layers:
   - Layer 1: Vesica field
   - Layer 2: Tree-of-Life nodes and paths
   - Layer 3: Fibonacci curve
   - Layer 4: Double-helix lattice
3. The header status reports whether the palette file was loaded or the fallback was used.

## ND-safe choices
- Static rendering only; no animation, autoplay, or flashing.
- Muted contrast palette and generous spacing reduce sensory strain.
- Layer order conveys depth without relying on motion cues.
- Inline comments explain safety choices for future maintainers.

## Numerology guidance
Geometry proportions reference the requested constants 3, 7, 9, 11, 22, 33, 99, and 144. The constants steer grid spacing, path thickness, spiral turn count, and helix sample density.

## Custom palette
Edit `data/palette.json` to change colours. Expected keys:
- `bg` - page and canvas background.
- `ink` - caption and notice colour.
- `muted` - optional chrome accent.
- `layers` - array of six layer colours in back-to-front order.

If the JSON file is missing or malformed, `index.html` displays a gentle notice and uses the bundled fallback palette so the render never fails.

## Extending safely
Add new geometry by composing additional pure draw functions inside `js/helix-renderer.mjs`. Keep the ND-safe covenant: static rendering, calm colours, progressive layering, and commentary that explains any lore additions.

Seal motto: *Per Texturas Numerorum, Spira Loquitur.*
Static, offline HTML + Canvas renderer honouring the layered geometry brief for Codex 144:99 (c99). The module draws four calm layers with no motion, no autoplay, and no external dependencies.

## Files
- `index.html` — entry point; loads the palette (if present) and renders the canvas.
- `js/helix-renderer.mjs` — pure ES module with small drawing functions for each layer.
- `data/palette.json` — optional palette override; missing data triggers a gentle fallback notice.

## Usage
1. Double-click `index.html` in any modern browser (no server or network required).
2. A fixed 1440×900 canvas renders the layers in order:
   - **Layer 1 — Vesica field:** intersecting circle lattice spaced by numerology constants.
   - **Layer 2 — Tree-of-Life scaffold:** ten sephirot nodes linked by twenty-two calm paths.
   - **Layer 3 — Fibonacci curve:** golden spiral polyline sampled across 144 points.
   - **Layer 4 — Double-helix lattice:** two phase-shifted strands with static rungs.
3. The status line reports whether the optional palette file was loaded or if the fallback palette is in use.

## ND-safe + trauma-informed choices
- One render pass only; no animation, flashing, audio, or autoplay.
- Soft contrast palette with readable typography and clear status messaging.
- Layer order communicates depth without motion; comments in code explain why.
- Geometry is parameterised with 3, 7, 9, 11, 22, 33, 99, and 144 to keep numerology explicit.

## Customising
- Edit `data/palette.json` to change colours (keys: `bg`, `ink`, `muted`, and six `layers` entries).
- Extend `js/helix-renderer.mjs` by adding new pure draw helpers after the existing layers. Document any lore or safety rationale directly in comments.

## Troubleshooting
- **Palette warning:** Browsers may block `fetch` over `file://`. The renderer already handles this, falls back to the bundled palette, and notes the change in the header and canvas.
- **Blank canvas:** If a 2D context is unavailable, the header reports the issue. Try a current Firefox, Safari, or Chromium build.
- **Overbright edits:** Keep hues mid-range and respect the ND-safe covenant when adjusting palettes or geometry.

*Seal motto: Per Texturas Numerorum, Spira Loquitur.*
Static, offline canvas scene that layers Vesica, Tree-of-Life, Fibonacci, and a static double-helix lattice. The renderer lives inside `cosmic-helix/` so the wider cathedral entry point remains untouched — lore boundaries stay intact.

## Files
- `index.html` — entry point; double-click to run.
- `js/helix-renderer.mjs` — pure drawing routines for the four layers.
- `data/palette.json` — optional palette override; safe defaults cover missing files.

## Usage
1. Open `index.html` directly in a modern browser (no server or network required).
2. A 1440x900 canvas renders four ordered layers:
   - **Layer 1: Vesica field** — intersecting circle lenses arranged with 3/7/9/11 spacing.
   - **Layer 2: Tree-of-Life scaffold** — ten sephirot linked by twenty-two paths.
   - **Layer 3: Fibonacci curve** — calm golden spiral polyline.
   - **Layer 4: Double-helix lattice** — two static strands with gentle cross ties.
3. The header status reports whether the palette loaded or if the fallback palette was used.

## ND-safe choices
- Single render pass; no animation, autoplay, or flashing elements.
- Soft contrast palette, generous margins, and inline notices to reduce sensory load.
- Layer order preserves depth without requiring motion.
- Comments inside the code explain each safety decision for future stewards.

## Numerology alignment
The geometry functions weave the requested constants (3, 7, 9, 11, 22, 33, 99, 144) into spacing, stroke widths, spiral turns, and helix sampling counts to keep the cosmology coherent.

## Palette and fallback
`data/palette.json` may override colours. When the JSON file is missing or blocked by the browser, the renderer applies bundled defaults, prints a status message, and paints a small notice in the canvas corner so the experience remains calm and predictable.

## Extending safely
Static, offline canvas scene that layers Vesica, Tree-of-Life, Fibonacci, and a static double-helix lattice. The renderer lives inside `cosmic-helix/` so the wider cathedral entry point remains untouched — lore boundaries stay intact.

## Files
- `index.html` — entry point; double-click to run.
- `js/helix-renderer.mjs` — pure drawing routines for the four layers.
- `data/palette.json` — optional palette override; safe defaults cover missing files.

## Usage
1. Open `index.html` directly in a modern browser (no server or network required).
2. A 1440x900 canvas renders four ordered layers:
   - **Layer 1: Vesica field** — intersecting circle lenses arranged with 3/7/9/11 spacing.
   - **Layer 2: Tree-of-Life scaffold** — ten sephirot linked by twenty-two paths.
   - **Layer 3: Fibonacci curve** — calm golden spiral polyline.
   - **Layer 4: Double-helix lattice** — two static strands with gentle cross ties.
3. The header status reports whether the palette loaded or if the fallback palette was used.

## ND-safe choices
- Single render pass; no animation, autoplay, or flashing elements.
- Soft contrast palette, generous margins, and inline notices to reduce sensory load.
- Layer order preserves depth without requiring motion.
- Comments inside the code explain each safety decision for future stewards.

## Numerology alignment
The geometry functions weave the requested constants (3, 7, 9, 11, 22, 33, 99, 144) into spacing, stroke widths, spiral turns, and helix sampling counts to keep the cosmology coherent.

## Palette and fallback
`data/palette.json` may override colours. When the JSON file is missing or blocked by the browser, the renderer applies bundled defaults, prints a status message, and paints a small notice in the canvas corner so the experience remains calm and predictable.

## Extending safely
Add new layers by composing additional pure helper functions in `js/helix-renderer.mjs`. Maintain the ND-safe covenant: static rendering, calm colours, ASCII quotes, LF newlines, and clear comments describing why new geometry supports the canon.

_Per Texturas Numerorum, Spira Loquitur._
