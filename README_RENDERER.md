# Cosmic Helix Renderer

Static, offline-first canvas capsule aligned with the luminous cosmology canon. Rendering happens once when `index.html` loads, painting four calm layers (vesica field, Tree-of-Life scaffold, Fibonacci curve, and a static double-helix lattice). All geometry is parameterised by numerology anchors `{3, 7, 9, 11, 22, 33, 99, 144}` and every helper is a small, well-commented pure function so the composition stays ND-safe.

## Files delivered
- `index.html` - Offline entry point. Loads the optional palette JSON using a local `fetch` attempt, reports fallback status in the header, seeds the numerology constants, and invokes the renderer with a calm notice when data is missing.
- `js/helix-renderer.mjs` - Pure ES module containing the layered drawing helpers. Each layer explains how the numerology keeps depth without motion.
- `data/palette.json` - Optional colour override. When absent the renderer uses its sealed fallback and paints a footer notice for reassurance.
- `README_RENDERER.md` - This guide.
Static, offline-first canvas capsule aligned with the layered cosmology canon. Rendering happens once when `index.html` loads, painting four calm layers (vesica field, Tree-of-Life scaffold, Fibonacci curve, and a static double-helix lattice). Geometry constants stay anchored to `{3, 7, 9, 11, 22, 33, 99, 144}` and every helper is a small, well-commented pure function so the composition stays ND-safe.

## Files delivered
- `index.html` -- Offline entry point. Loads the optional palette JSON without remote requests, reports fallback status in the header, seeds the numerology constants, and invokes the renderer with a calm notice when data is missing.
- `js/helix-renderer.mjs` -- Pure ES module containing the layered drawing helpers. Each layer explains how numerology keeps depth without motion.
- `data/palette.json` -- Optional colour override. When absent the renderer uses its sealed fallback and paints a footer notice for reassurance.
- `README_RENDERER.md` -- This guide.

## Offline use
1. Download or clone this repository.
2. Double-click `index.html` in any modern browser. No build steps, bundlers, or servers are required.
3. The palette loader issues a single local `fetch` for `data/palette.json`. Hardened `file://` environments may block that request; when it fails the fallback palette activates automatically, the header reports the change, and the canvas prints `Palette fallback active` near the base.

## Layer order (back to front)
1. **Vesica field** - Intersecting circle grid arranged by a `3 x 7` cadence. A central mandorla glow reinforces the vesica without motion.
2. **Tree-of-Life scaffold** - Ten sephirot plus hidden Daath, linked by twenty-two calm paths. Pillar spacing and vertical placement derive from `33`, `99`, and `144` ratios, forming a vaulted arch.
3. **Fibonacci curve** - Logarithmic spiral seeded by the golden ratio. Quarter-turn markers align to the Fibonacci sequence up to `144` and receive pearl markers for clarity.
4. **Double-helix lattice** - Two phase-shifted strands sampled at `22` stations, alternating rungs to imply twist. A quiet base walkway anchors the lattice without animation.
3. The palette loader issues a local `fetch` for `data/palette.json`. Hardened `file://` environments may block that request; when it fails the fallback palette activates automatically, the header reports the change, and the canvas prints `Palette fallback active (data/palette.json unavailable).` near the base.

## Layer order (back to front)
1. **Vesica field** -- Intersecting circle grid arranged by a `{3 x 7}` cadence. A central mandorla glow reinforces the vesica without motion.
2. **Tree-of-Life scaffold** -- Ten sephirot plus hidden Daath, linked by twenty-two calm paths. Pillar spacing and vertical placement derive from `{33, 99, 144}` ratios, forming a vaulted arch.
3. **Fibonacci curve** -- Logarithmic spiral seeded by the golden ratio. Quarter-turn markers align to the Fibonacci sequence up to `144` and receive pearl markers for clarity.
4. **Double-helix lattice** -- Two phase-shifted strands sampled at `22` stations, alternating rungs to imply twist. A quiet base walkway anchors the lattice without animation.

## Numerology anchors
- Vertical placement steps through the 144-unit ladder so Malkuth rests at `144` while the supernal triad seats `33 / 3 = 11` units below the crown.
- Daath bridges triads at `22 + 7`, Chesed and Geburah sit at `33 + 9`, Tiphareth at `33 + 22`, Netzach and Hod at `99 - 3`, Yesod at `144 - 3`.
- The helix rails oscillate with a sine phase scaled by `3`, `11`, and `22`, while rungs appear every other station to honour the `33` anchor.
- The helix rails oscillate with a sine phase scaled by `{3, 11, 22}`, while rungs appear every other station to honour `33` anchors.
- The Fibonacci spiral grows by `phi` so each quarter-turn multiplies the radius, matching the canonical progression up to `144`.

## Palette customisation
Update `data/palette.json` with your preferred ND-safe palette:

```json
{
  "bg": "#0a0c16",
  "ink": "#f8e8ca",
  "muted": "#655c80",
  "layers": ["#213963", "#2b5f7a", "#d8a159", "#f7d78e", "#cc8add", "#324766"]
}
```

The loader never performs remote fetches; it only attempts to read this local JSON file. Missing or malformed palette data never stops rendering, because the fallback palette keeps contrast calm and emits the inline notice.

## ND-safe guardrails
- No animation loops or timers -- everything renders once.
- Layered drawing order avoids flattening geometry, preserving depth through overlaid transparencies.
- Comments explain why each choice is present so future curators understand the trauma-informed guardrails.
- ASCII quotes, UTF-8 encoding, and LF newlines keep the files portable and offline friendly.
