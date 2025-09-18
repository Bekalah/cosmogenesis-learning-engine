# Cosmic Helix Renderer (Offline, ND-safe)

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
