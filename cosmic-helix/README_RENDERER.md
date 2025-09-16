# Cosmic Helix Renderer

_Per Texturas Numerorum, Spira Loquitur._

Offline, ND-safe canvas sketch for layered sacred geometry. This rewrite resolves old merge debris while preserving the ritual motto and the original four layer brief (why: the lore anchors remain intact).

## Usage
1. Double-click `index.html` in any modern browser. No server or network needed.
2. A 1440x900 canvas renders four static layers:
   - **Vesica field** - intersecting circles forming a calm grid.
   - **Tree-of-Life scaffold** - ten sephirot linked by twenty-two paths.
   - **Fibonacci curve** - golden spiral polyline anchored to centre.
   - **Double-helix lattice** - two phase-shifted sine tracks.
3. Palette colours live in `data/palette.json`. If the file is absent, the top status line and a small canvas caption note the safe fallback.

## ND-safe notes
- Static drawing only; no animation, autoplay, or motion scripting.
- Muted contrast palette and generous spacing reduce sensory strain.
- Layer order clarifies depth without flashing, sustaining the requested layered geometry.
- Geometry routines lean on numerology constants 3, 7, 9, 11, 22, 33, 99, and 144 to keep symbolism explicit.

## Design notes
- Pure ES module (`js/helix-renderer.mjs`) with small, well-commented functions; this keeps offline maintenance simple.
- ASCII quotes and UTF-8 files honour the ND-safe code rule-set.
- Numerology constants live in `index.html` for quick ritual tuning.

## Extending
Add new draw helpers to `js/helix-renderer.mjs` while preserving the calm visual hierarchy and ND-safe palette logic. Remember to explain any lore additions in comments so future stewards see why choices were made.

## Related lore
For broader cosmological context, consult [`docs/tesseract_spiritual.md`](../docs/tesseract_spiritual.md).

*Seal Motto: Per Texturas Numerorum, Spira Loquitur.*
Static offline renderer that draws four calm layers of sacred geometry on a 1440x900 canvas. The module follows ND-safe guidelines: no motion, soft contrast, predictable layout, and clear comments that explain every safety choice.

## Files
- `index.html` -- entry point that wires the canvas and loads the palette if present.
- `js/helix-renderer.mjs` -- pure ES module with small drawing functions.
- `data/palette.json` -- optional palette override. Safe defaults load when the file is missing.

## How to use
1. Double-click `index.html` in any modern browser. No server or network access is required.
2. The status line will report whether the palette file was found. If it is missing, a fallback palette loads and the scene still renders.
3. A single render pass draws four layers:
   - Layer 1: Vesica field made from overlapping circles that suggest repeating lenses.
   - Layer 2: Tree-of-Life scaffold with ten sephirot and twenty-two linking paths.
   - Layer 3: Fibonacci curve as a golden polyline anchored at the centre.
   - Layer 4: Static double-helix lattice with cross ties for depth.

## ND-safe design choices
- Static drawing only: there is no animation, autoplay, flashing, or audio.
- Gentle contrast palette with generous whitespace and status copy for reassurance.
- Layer order is consistent so depth is readable without motion.
- Inline comments explain the ND-safe rationale to future maintainers.

## Numerology guidance
Geometry proportions reference the requested constants 3, 7, 9, 11, 22, 33, 99, and 144. The constants steer spacing (vesica grid), line widths (tree paths), Fibonacci segment count, and helix sampling density.

## Custom palette
Edit `data/palette.json` to change colors. The keys are:
- `bg` -- canvas background.
- `ink` -- reserved for future UI elements.
- `layers` -- array of six layer colors in base-to-foreground order.

If the JSON file is removed or malformed, `index.html` shows a notice and uses a bundled fallback palette so the render never fails.

## Extending safely
- Add new geometry by introducing additional pure helper functions inside `helix-renderer.mjs` and calling them after the existing layers.
- Keep new code ASCII-only with LF newlines and plain quotes.
- Preserve the static rendering contract and document any sensory considerations in comments.
Offline, ND-safe canvas sketch for layered sacred geometry inside the Cosmogenesis Learning Engine canon. The renderer works entirely by opening `index.html` and draws four calm layers with no motion or autoplay.

## Quickstart
1. Double-click `index.html` in any modern browser. No server or network is required.
2. A 1440x900 canvas appears with status text in the header. If `data/palette.json` is missing or blocked, the status reports the fallback palette and rendering still completes.
3. Study the four static layers, then edit `data/palette.json` to tune colours or fork the draw functions for new overlays.

## Layer overview
- **L1 Vesica field** - Intersecting circle lenses arranged with 3/7/9/11 spacing to evoke the womb of forms without overwhelming repetition.
- **L2 Tree-of-Life scaffold** - Ten sephirot nodes with twenty-two connecting paths, scaled to the canvas proportions so the structure remains readable at 1440x900.
- **L3 Fibonacci curve** - A golden-ratio logarithmic spiral drawn as a single polyline; it arcs through the centre to harmonise the other geometries.
- **L4 Double-helix lattice** - Two phase-shifted sine strands with gentle rungs, forming a static lattice that nods to DNA without introducing motion.

## Palette and customisation
- Colours live in `data/palette.json` with keys `bg`, `ink`, `muted`, and a `layers` array of six hex values (one per draw layer).
- When the JSON cannot be loaded (for example when running from the `file://` protocol), `index.html` falls back to a safe palette and updates the status line so you know which path was taken.
- The HTML page applies the palette colours to CSS custom properties (`--bg`, `--ink`, `--muted`) before drawing so the chrome and canvas stay in sync.

## Numerology alignment
Geometry parameters are tied to the requested constants: 3, 7, 9, 11, 22, 33, 99, and 144. Examples include the vesica grid counts (11 columns x 9 rows), Fibonacci arc quarter-turns (7), Tree-of-Life stroke widths (22/11), helix rotations (33/11), and helix sample density (144 steps). This keeps the visual language coherent with Codex 144:99.

## ND-safe design choices
- No animation, flashing, or autoplay; each layer renders once on load.
- Muted contrast palette with generous spacing reduces sensory strain.
- Thin strokes and rounded joins avoid harsh edges while preserving clarity.
- Canvas size is fixed at 1440x900 for predictable composition when opened offline.

## File structure
```
index.html               # Entry point; loads palette, sets constants, calls renderer.
js/helix-renderer.mjs    # Pure drawing functions for the four layers.
data/palette.json        # Editable colour palette; safe defaults bundled.
```

## Extending safely
Add new layers by composing pure draw functions in `js/helix-renderer.mjs`. Keep the ND-safe covenant: static rendering, calm colours, and respectful pacing. Document any new numerological correspondences so future collaborators understand the symbolism.

## Troubleshooting
- **Status reports fallback palette** - Browsers often block `fetch` over `file://`; the renderer already handles this and still draws with bundled colours.
- **Blank canvas** - Older browsers may not provide a 2D context. The header status will mention this; try a current Firefox, Safari, or Chromium build.
- **Harsh colours after editing** - Use softer, mid-range hues and keep contrast gentle to honour the trauma-informed design goal.
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
```text
0101010101010101010101010101010101010101
\\    COSMIC HELIX RENDERER MATRIX     //
0101010101010101010101010101010101010101
        /\        /\        /\
       /  \      /  \      /  \
      / /\ \    / /\ \    / /\ \
     /_/  \_\  /_/  \_\  /_/  \_\
      \ \  / /  \ \  / /  \ \  / /
       \ \/ /    \ \/ /    \ \/ /
        \  /      \  /      \  /
         \/        \/        \/
```

Offline, ND-safe canvas sketch for layered sacred geometry.

## Usage
1. Double-click `index.html` in any modern browser; no server or network required.
2. A 1440×900 canvas renders four static layers:
   - **Vesica field** — intersecting circles forming a calm grid.
   - **Tree-of-Life scaffold** — ten sephirot linked by twenty-two paths.
   - **Fibonacci curve** — golden spiral polyline anchored to centre.
   - **Double-helix lattice** — two phase-shifted sine tracks.
3. Palette colours live in `data/palette.json`. Missing file triggers a gentle notice and safe fallback.

## ND-safe notes
- Static drawing; no animation or autoplay.
- Soft contrast palette and generous spacing improve readability.
- Layer order clarifies depth without motion.
- Geometry parameters reference numerology constants 3, 7, 9, 11, 22, 33, 99, 144.

## Design notes
- Pure ES module `js/helix-renderer.mjs` with small, well-commented functions.
- ASCII quotes only; UTF-8, LF newlines.
- Works entirely offline by double-clicking `index.html`.

## Extending
Add new draw functions in `js/helix-renderer.mjs` while preserving the calm visual hierarchy and ND-safe choices.
