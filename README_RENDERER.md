# Cosmic Helix Renderer

Static, offline-first canvas capsule aligned with the layered cosmology canon. Rendering happens once when `index.html` loads, painting four calm layers (Vesica field, Tree-of-Life scaffold, Fibonacci curve, and a static double-helix lattice). Geometry constants stay anchored to `3, 7, 9, 11, 22, 33, 99, 144` and every helper is a small, well-commented pure function so the composition remains ND-safe. The visuals now echo the cathedral and portal artworks while weaving in Codex 144:99 research cues.

## Files delivered
- `index.html` - Offline entry point. Loads the optional palette JSON without remote requests, reports fallback status in the header, seeds the numerology constants, and invokes the renderer with a calm notice when data is missing. The header now names the Codex 144:99 synthesis portal and points toward `codex-144-99/` and `cathedral/` for deeper study.
- `js/helix-renderer.mjs` - Pure ES module containing the layered drawing helpers. Each layer explains how numerology keeps depth without motion, and new helpers paint mandorla glows, cathedral vaults, research chambers, and the synthesizer helix column.
- `data/palette.json` - Optional colour override. When absent the renderer uses its sealed fallback and paints a footer notice for reassurance.
- `README_RENDERER.md` - This guide.

## Offline use
1. Download or clone this repository.
2. Double-click `index.html` in any modern browser. No build steps, bundlers, or servers are required.
3. The palette loader issues a single local `fetch` for `data/palette.json`. Hardened `file://` environments may block that request; when it fails the fallback palette activates automatically, the header reports the change, and the canvas prints `Palette fallback active (data/palette.json unavailable).` near the base.

## Layer order (back to front)
1. **Vesica field** - Intersecting circle grid arranged by a `3 x 7` cadence. Mandorla glow, concentric portal rings, and an eight-point star echo the rose-window paintings.
2. **Tree-of-Life scaffold** - Ten sephirot plus hidden Daath, linked by twenty-two calm paths. Vaulted arches and copper pillars mirror the `cathedral/` silhouettes while keeping ND-safe contrast.
3. **Fibonacci curve** - Logarithmic spiral seeded by the golden ratio. Concentric “research chambers” drawn from Codex 144:99 schematics guide the laboratory rooms.
4. **Double-helix lattice** - Two phase-shifted strands sampled at `22` stations, alternating rungs to honour the `33` anchor. A luminous central column references the synthesizer tower.

## Numerology anchors
- Vertical placement steps through the 144-unit ladder so Malkuth rests at `144` while the supernal triad seats `33 / 3 = 11` units below the crown.
- Daath bridges triads at `22 + 7`, Chesed and Geburah sit at `33 + 9`, Tiphareth at `33 + 22`, Netzach and Hod at `99 - 3`, Yesod at `144 - 3`.
- The helix rails oscillate with a sine phase scaled by `3`, `11`, and `22`, while rungs appear every other station to honour `33` anchors.
- The Fibonacci spiral grows by `phi` so each quarter-turn multiplies the radius, matching the canonical progression up to `144`.

## Palette customisation
Update `data/palette.json` with your preferred ND-safe palette:

```json
{
  "bg": "#130b0c",
  "ink": "#f9f1dc",
  "muted": "#6d4d4f",
  "layers": ["#b86a3d", "#2f3f72", "#f0c36e", "#d8b873", "#8b62e4", "#4a91b2"]
}
```

The loader never performs remote fetches; it only attempts to read this local JSON file. Missing or malformed palette data never stops rendering, because the fallback palette keeps contrast calm and emits the inline notice.

## ND-safe guardrails
- No animation loops or timers; everything renders once.
- Layered drawing order avoids flattening geometry, preserving depth through overlaid transparencies.
- Comments explain why each choice is present so future curators understand the trauma-informed guardrails, including where Codex 144:99 research motifs and `cathedral/` architecture surface.
- ASCII quotes, UTF-8 encoding, and LF newlines keep the files portable and offline friendly.
