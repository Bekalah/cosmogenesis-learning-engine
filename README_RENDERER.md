# Cosmic Helix Renderer

Static, offline-first canvas renderer that layers Vesica geometry, the Tree-of-Life scaffold, a Fibonacci-inspired curve, and a static double-helix lattice. Designed for ND-safe review: calm palette, no motion, generous spacing, and inline comments that explain the numerology-driven proportions.

## Files

- `index.html` - entry point. Open directly in any modern browser (double-click). Loads palette data when available and falls back safely if the JSON cannot be read.
- `js/helix-renderer.mjs` - pure ES module with the drawing routines. Accepts a canvas 2D context plus palette and numerology constants.
- `data/palette.json` - optional local palette override. Edit colors to suit the atelier; the renderer falls back to built-in hues if this file is missing or blocked by the browser.

## Usage

1. Download or clone the repository.
2. Double-click `index.html` (no server, no build step).
3. If you edit `data/palette.json`, refresh the page. Browsers that restrict `fetch` over the `file://` protocol automatically use the fallback palette and display a notice in the header.

## Layer order

1. **Vesica field** - seven by three lattice of intersecting circles, softened alpha to avoid visual overload.
2. **Tree-of-Life scaffold** - ten sephirot nodes with twenty-two paths mapped to numerology constants.
3. **Fibonacci curve** - static polyline grown from Fibonacci numbers up to 144, preserving a harmonic spiral without motion.
4. **Double-helix lattice** - two offset strands with lattice rungs rendered at regular intervals; no animation.

Each routine uses the constants {3, 7, 9, 11, 22, 33, 99, 144} so the geometry remains parameterised by the numerology canon.

## Accessibility & ND-safe rationale

- No animation or flashing elements.
- High-contrast typography and background colors with calm tones.
- Layered drawing order keeps geometry legible without flattening depth into a single outline.
- All code is pure ES modules using ASCII quotes and LF newlines.

## Customisation

- Change the palette by editing `data/palette.json` (hex strings). All colors cascade through the four layers.
- Adjust numerology constants in `index.html` before calling `renderHelix` if alternative sacred ratios are needed.
- Geometry logic is modular; duplicate and adapt the helper functions in `js/helix-renderer.mjs` to compose new scenes while keeping layers discrete.
Static HTML + Canvas capsule that renders the layered cosmology without motion. Double-click `index.html` to paint a 1440x900 canvas with four calm layers: the vesica field, Tree-of-Life scaffold, Fibonacci curve, and a static double-helix lattice. No build step, no dependencies, and no network access required.

## Files
- `index.html` — offline entry point that loads the optional palette, seeds numerology constants, and invokes the renderer.
- `js/helix-renderer.mjs` — pure ES module of drawing helpers. Each function documents why the ND-safe order matters.
- `data/palette.json` — optional colour override. If missing, the renderer keeps a sealed fallback and posts a gentle notice.

## Usage
1. Open `cosmic-helix/index.html` directly in any modern browser (double-click is fine).
2. The header status reports whether `data/palette.json` loaded. When file access is blocked (e.g. strict `file://` rules) the fallback palette activates and the canvas prints a notice.
3. The geometry draws once using numerology constants `{3, 7, 9, 11, 22, 33, 99, 144}`. There are no loops, timers, or animation frames after the initial paint.

## Layer order (back to front)
1. **Vesica field** — intersecting circle lattice spaced with 9x11 divisions for the womb-of-forms motif.
2. **Tree-of-Life scaffold** — ten sephirot nodes linked by twenty-two calm paths with labels offset for readability.
3. **Fibonacci curve** — static logarithmic spiral sampled over 144 points and scaled by the golden ratio.
4. **Double-helix lattice** — two phase-shifted strands with thirty-three cross ties; everything remains motionless.

## ND-safe and trauma-informed choices
- No animation, autoplay, or timers. The renderer runs once per load.
- Calm palette defaults with explicit status messaging so fallbacks never surprise the visitor.
- Layered drawing order keeps sacred geometry from flattening into a single outline.
- ASCII quotes, UTF-8, and LF newlines keep the module portable across offline systems.

## Customising safely
- Edit `data/palette.json` to change colours. Keys remain `bg`, `ink`, `muted`, and `layers` (array of six hex strings).
- Pass an optional `geometry` object to `renderHelix` for deeper tuning; the module validates numbers and preserves ND-safe bounds.
- When adding new layers, compose additional pure helpers in `js/helix-renderer.mjs` and call them from `renderHelix` without introducing motion or external libraries.
