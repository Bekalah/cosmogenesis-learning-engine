# Cosmic Helix Renderer

Static, offline-first canvas capsule tuned to the luminous cathedral reference (vesica vault, Tree-of-Life column, Fibonacci halo, and double-helix lattice). Everything remains ND-safe: no motion, soft gradients, and detailed commentary on why the geometry is layered.

## Files

- `index.html` - offline entry point that loads the optional palette, seeds numerology constants, and invokes the renderer while reporting layer stats in the header.
- `js/helix-renderer.mjs` - pure ES module of drawing helpers. Each function documents how the ND-safe order preserves depth.

- `index.html` - offline entry point that loads the optional palette, syncs the resolved colours with the shell chrome, seeds numerology constants, gathers the render summary, and stays calm if a 2D context is denied.
- `js/helix-renderer.mjs` - pure ES module of drawing helpers. Each function documents why the ND-safe order matters and references the covenant numbers.

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


3. When opened via `file://`, the loader first attempts a JSON module import of `data/palette.json`. If the browser declines JSON modules, it falls back to a fetch attempt and ultimately the sealed palette with a notice when none are available.


3. When opened via `file://`, the loader first attempts a JSON module import of `data/palette.json`. If the browser declines JSON modules, it falls back to a fetch attempt and ultimately the sealed palette with a notice when none are available.

3. If `data/palette.json` is blocked by `file://` rules, the fallback palette activates automatically, the page chrome updates to the safe defaults, and a notice appears on the canvas footer.
4. The status line reiterates whether the fallback is active, reports the render summary, and confirms when geometry is skipped because the browser withholds a 2D context.



## Layer order (back to front)
1. **Vesica field** - seven by three grid of intersecting circles, softened alpha to avoid glare.
2. **Tree-of-Life scaffold** - ten sephirot nodes tied by twenty-two calm paths. Horizontal pillar spacing and vertical placement both use combinations of {3, 7, 9, 11, 22, 33, 99, 144} so the descent honours the numerology covenant.
3. **Fibonacci curve** - static logarithmic spiral sampled from Fibonacci numbers up to 144.
4. **Double-helix lattice** - two phase-shifted strands with alternating rungs; entirely static.


All routines stay parameterised by `{3, 7, 9, 11, 22, 33, 99, 144}` to honour the cosmology canon while keeping the numerology adjustable.

### Numerology grounding cheatsheet
- **Tree columns** shift by 33 of the 144 horizontal units so each pillar leans on the covenant pair (33, 144).
- **Supernal triad** rests on 33 divided by 3, placing Chokmah and Binah 11 steps below Kether.
- **Hidden gate** (Daath) descends by 22 + 7 units, bridging the upper triad with the ethical triad.
- **Middle triad** aligns to 33 + 9 (Chesed/Geburah) and 33 + 22 (Tiphareth) to keep balance between mercy, strength, and heart.
- **Lower triad** drops to 99 - 3 for Netzach/Hod and 144 - 3 for Yesod, keeping the emotional/intellectual pair and the foundation within the harmonic ladder.
- **Malkuth** completes the run at 144, mirroring the full descent mapped across the canvas height.

## Accessibility & ND-safe rationale
- No animation, autoplay, or async loops. Rendering happens once per load.

- Calm palette defaults with clear status messaging when fallbacks are in play.
- Layered drawing order maintains geometric depth without flattening into a single outline, matching the reference architecture without motion.

- Calm palette defaults with clear status messaging when fallbacks are in play, including an inline canvas caption for assurance.
- Layered drawing order maintains geometric depth without flattening into a single outline.

- ASCII quotes, UTF-8, LF newlines, and small pure functions keep the module portable offline.

## Customisation
- Adjust colours by editing `data/palette.json`. Provide `bg`, `ink`, and a six colour `layers` array.
- Override numerology constants in `index.html` before calling `renderHelix` if alternate ratios are desired.
- Compose new layers by duplicating the helper pattern in `js/helix-renderer.mjs`. Keep additions static and well-commented to preserve ND safety.
- On `file://` origins the loader prefers JSON module imports to keep everything offline-first. If JSON modules are unavailable the fetch path takes over, and if that also fails the bundled palette and notice keep rendering safe.
