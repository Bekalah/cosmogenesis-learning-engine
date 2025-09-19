# Cosmic Helix Renderer

Static, offline-first canvas capsule tuned to the luminous cathedral canon. The renderer paints four still layers (vesica field, Tree-of-Life scaffold, Fibonacci curve, and a static double-helix lattice) using numerology anchors {3, 7, 9, 11, 22, 33, 99, 144}. Comments in the module explain why each choice keeps ND safety intact (no motion, soft contrast, layered depth).

## Files

- `index.html` - offline entry point that loads the optional palette, seeds numerology constants, and invokes the renderer while reporting layer stats in the header.
- `js/helix-renderer.mjs` - pure ES module of drawing helpers. Each function documents how the ND-safe order preserves depth.

- `index.html` - offline entry point that loads the optional palette, syncs the resolved colours with the shell chrome, seeds numerology constants, gathers the render summary, and stays calm if a 2D context is denied.
- `js/helix-renderer.mjs` - pure ES module of drawing helpers. Each function documents why the ND-safe order matters and references the covenant numbers.

- `data/palette.json` - optional colour override. If missing the renderer applies its sealed fallback, posts a status message, and paints a canvas notice.
- `data/cosmic-nodes.json` - optional registry of arcana, sephirot, and paths. Labels and helix markers draw from this list; when absent the defaults embedded in `index.html` keep the canvas layered and annotated.
- `index.html` — offline entry point. Loads the optional palette JSON, applies chrome colours, seeds the numerology constants, and reports render status without animation.
- `js/helix-renderer.mjs` — pure ES module of drawing helpers. Each function is small, well-commented, and preserves the layered order.
- `data/palette.json` — optional override palette. If absent or blocked the renderer falls back to sealed colours and displays a calm notice.
- `README_RENDERER.md` — this guide.

## Usage
1. Download or clone the repository.
2. Double-click `index.html`. No build step or server is required; the module runs offline.
3. If the palette JSON is blocked (common on hardened `file://` contexts) the fallback palette activates automatically, the header notes the change, and the canvas prints "Palette fallback active" near the base for reassurance.

## Layer order (back to front)
1. **Vesica field** — seven by three grid of intersecting vesica pairs with a mandorla halo and central axis. Soft alpha keeps the base calm while preserving depth.
2. **Tree-of-Life scaffold** — sephirot nodes, 22 paths, vaulted arch, and central column. Positions rely on the covenant ladder so each descent honours {33, 99, 144} spans.
3. **Fibonacci curve** — static logarithmic spiral built from Fibonacci numbers up to 144, rendered once with rounded joints and pearl markers.
4. **Double-helix lattice** — two phase-shifted rails with alternating rungs, base walkway, and diamond anchors. Everything is static; no animation or flashing.


## Layer order (back to front)
1. **Vesica field** - seven by three grid of intersecting circles, softened alpha to avoid glare.
2. **Tree-of-Life scaffold** - ten sephirot nodes tied by twenty-two calm paths. Horizontal pillar spacing and vertical placement both use combinations of {3, 7, 9, 11, 22, 33, 99, 144} so the descent honours the numerology covenant.
3. If either JSON file is blocked by `file://` rules, the sealed fallbacks activate automatically, the page chrome updates to the safe defaults, and a notice appears on the canvas footer.

## Layer order (back to front)
1. **Vesica field** - seven by three grid of intersecting circles, softened alpha to avoid glare.
2. **Tree-of-Life scaffold** - ten sephirot nodes tied by twenty-two calm paths. Vertical placement uses combinations of {3, 7, 9, 11, 22, 33, 99, 144} so the descent honours the numerology covenant, and each node receives a registry-driven label plus optional lab subtitle.
3. **Fibonacci curve** - static logarithmic spiral sampled from Fibonacci numbers up to 144.
4. **Double-helix lattice** - two phase-shifted strands with alternating rungs; entirely static. Arcana markers ride the rails, numbered by their numerology, with lab entries encircled for quick orientation.


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
- Adjust labels and helix markers by editing `data/cosmic-nodes.json`. Each record may carry `name`, `numerology`, and an optional `lab` tag for emphasis.
- Override numerology constants in `index.html` before calling `renderHelix` if alternate ratios are desired.
- Compose new layers by duplicating the helper pattern in `js/helix-renderer.mjs`. Keep additions static and well-commented to preserve ND safety.
- On `file://` origins the loader prefers JSON module imports to keep everything offline-first. If JSON modules are unavailable the fetch path takes over, and if that also fails the bundled palette and notice keep rendering safe.
## Numerology grounding
- Vertical placement maps the 144-step ladder so Malkuth rests at 144 units and pillar offsets use 33-unit shifts.
- Supernal descent seats Chokmah/Binah 11 units below Kether (33 ÷ 3), Daath bridges the triads at 22 + 7, and the middle triad steps through 33 + 9 and 33 + 22.
- Lower triad uses 99 − 3 for Netzach/Hod, 144 − 3 for Yesod, and closes at 144 for Malkuth.
- Fibonacci sampling stops at 144 while helix rails step through 22 stations with a phase offset governed by 3 and 11.

## Accessibility & ND-safe rationale
- No animation, autoplay, or async redraw loops; rendering happens once per load.
- Calm palette defaults with clear status messaging when fallbacks are active (header text plus optional canvas notice).
- Layered drawing order preserves depth without flattening geometry into a single outline.
- Pure functions, ASCII quotes, UTF-8, and LF newlines keep the module portable for offline review.

## Palette override
Update `data/palette.json` with your preferred colours:

```json
{
  "bg": "#101018",
  "ink": "#f0e6d2",
  "layers": ["#6ca0ff", "#6cd7d8", "#9ce69a", "#ffd28c", "#f8a3ff", "#d7d7f0"]
}
```

Missing or malformed palettes never stop rendering; the fallback palette maintains ND safety and emits a calm notice.
