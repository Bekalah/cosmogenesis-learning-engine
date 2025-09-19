# Cosmic Helix Renderer

Static, offline-first canvas capsule that renders four calm layers: the vesica lattice, Tree-of-Life scaffold, Fibonacci spiral, and a static double-helix lattice. Everything is ND-safe - no motion, soft contrast, and clear commentary.

## Files
- `index.html` - offline entry point that loads the optional palette, syncs the chrome colours, seeds numerology constants, and invokes the renderer.
- `js/helix-renderer.mjs` - pure ES module of drawing helpers. Each function documents why the ND-safe order matters and references the covenant numbers.
- `data/palette.json` - optional colour override. If missing the renderer applies its sealed fallback, posts a status message, and paints a canvas notice.

## Usage
1. Download or clone the repository.
2. Double-click `index.html`. No build step or server is required.
3. If `data/palette.json` is blocked by `file://` rules, the fallback palette activates automatically, the page chrome updates to the safe defaults, and a notice appears on the canvas footer.

## Layer order (back to front)
1. **Vesica field** - seven by three grid of intersecting circles, softened alpha to avoid glare.
2. **Tree-of-Life scaffold** - ten sephirot nodes tied by twenty-two calm paths. Vertical placement uses combinations of {3, 7, 9, 11, 22, 33, 99, 144} so the descent honours the numerology covenant.
3. **Fibonacci curve** - static logarithmic spiral sampled from Fibonacci numbers up to 144.
4. **Double-helix lattice** - two phase-shifted strands with alternating rungs; entirely static.

All routines stay parameterised by `{3, 7, 9, 11, 22, 33, 99, 144}` to honour the cosmology canon.

## Accessibility & ND-safe rationale
- No animation, autoplay, or async loops. Rendering happens once per load.
- Calm palette defaults with clear status messaging when fallbacks are in play, including an inline canvas caption for assurance.
- Layered drawing order maintains geometric depth without flattening into a single outline.
- ASCII quotes, UTF-8, LF newlines, and small pure functions keep the module portable offline.

## Customisation
- Adjust colours by editing `data/palette.json`. Provide `bg`, `ink`, and a six colour `layers` array.
- Override numerology constants in `index.html` before calling `renderHelix` if alternate ratios are desired.
- Compose new layers by duplicating the helper pattern in `js/helix-renderer.mjs`. Keep additions static and well-commented to preserve ND safety.
- The loader prefers JSON module imports when opened via `file://` to avoid network access. Browsers without JSON module support fall back to the bundled palette safely.
