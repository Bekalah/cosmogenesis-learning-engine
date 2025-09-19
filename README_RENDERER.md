# Cosmic Helix Renderer

Static, offline-first canvas capsule tuned to the luminous cathedral canon. The renderer paints four still layers (vesica field, Tree-of-Life scaffold, Fibonacci curve, and a static double-helix lattice) using numerology anchors {3, 7, 9, 11, 22, 33, 99, 144}. Comments in the module explain why each choice keeps ND safety intact (no motion, soft contrast, layered depth).

## Files
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
