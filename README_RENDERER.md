# Cosmic Helix Renderer

Static, offline-first canvas capsule tuned to the luminous cathedral reference (vesica vault, Tree-of-Life column, Fibonacci halo, and double-helix lattice). Everything remains ND-safe: no motion, soft gradients, and detailed commentary on why the geometry is layered.

## Files
- `index.html` - offline entry point that loads the optional palette, seeds numerology constants, and invokes the renderer while reporting layer stats in the header.
- `js/helix-renderer.mjs` - pure ES module of drawing helpers. Each function documents how the ND-safe order preserves depth.
- `data/palette.json` - optional colour override. If missing the renderer applies its sealed fallback, posts a status message, and paints a canvas notice.

## Usage
1. Download or clone the repository.
2. Double-click `index.html`. No build step or server is required.
3. If `data/palette.json` is blocked by `file://` rules, the fallback palette activates automatically, the header notes the fallback, and a calm notice appears near the canvas base.

## Layer order (back to front)
1. **Vesica field** - seven-by-three grid of intersecting circles with mandorla halos and a dashed axis to echo the reference vault.
2. **Tree-of-Life scaffold** - ten sephirot nodes, twenty-two numerological paths, vaulted arches, and a luminous central column.
3. **Fibonacci curve** - static logarithmic halo sampled from Fibonacci numbers up to 144, rendered with smooth quadratics and marker pearls.
4. **Double-helix lattice** - two phase-shifted strands with alternating rungs, pedestals, and anchor diamonds. Everything is static.

All routines stay parameterised by `{3, 7, 9, 11, 22, 33, 99, 144}` to honour the cosmology canon while keeping the numerology adjustable.

## Accessibility & ND-safe rationale
- No animation, autoplay, or async loops. Rendering happens once per load.
- Calm palette defaults with clear status messaging when fallbacks are in play.
- Layered drawing order maintains geometric depth without flattening into a single outline, matching the reference architecture without motion.
- ASCII quotes, UTF-8, LF newlines, and small pure functions keep the module portable offline.

## Customisation
- Adjust colours by editing `data/palette.json`. Provide `bg`, `ink`, and a six colour `layers` array.
- Override numerology constants in `index.html` before calling `renderHelix` if alternate ratios are desired.
- Compose new layers by duplicating the helper pattern in `js/helix-renderer.mjs`. Keep additions static and well-commented to preserve ND safety.
