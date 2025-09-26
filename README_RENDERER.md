# Cosmic Helix Renderer

Static, offline-first canvas capsule aligned with the layered cosmology canon. Rendering happens once when `index.html` loads, painting four calm layers (Vesica field, Tree-of-Life scaffold, Fibonacci curve, and a static double-helix lattice). Geometry constants stay anchored to `3, 7, 9, 11, 22, 33, 99, 144` and every helper is a small, well-commented pure function so the composition remains ND-safe. This folder now doubles as the copy-and-paste template for the rest of the Cathedral of Circuits repositories.

## Files delivered
- `index.html` - Offline entry point. Loads the optional palette JSON without remote requests, reports fallback status in the header, seeds the numerology constants, and invokes the renderer with a calm notice when data is missing.
- `js/helix-renderer.mjs` - Pure ES module containing the layered drawing helpers. Each layer explains how numerology keeps depth without motion, keeping trauma-informed guardrails explicit in comments.
- `data/palette.json` - Optional colour override. When absent the renderer uses its sealed fallback and paints a footer notice for reassurance.
- `_headers` - Cloudflare Pages directives applying ND-safe CORS/security headers to every request while still allowing JSON fetches from the same origin.
- `.cfignore` - Deploy filter that keeps the static capsule self-contained by excluding development folders when publishing to Cloudflare Pages.
- `README_RENDERER.md` - This guide.

## Offline use
1. Download or clone this repository.
2. Double-click `index.html` in any modern browser. No build steps, bundlers, or servers are required.
3. The palette loader issues a single local `fetch` for `data/palette.json`. Hardened `file://` environments may block that request; when it fails the fallback palette activates automatically, the header reports the change, and the canvas prints `Palette fallback active (data/palette.json unavailable).` near the base.

## Cloudflare Pages deployment
Use these steps for every Cathedral of Circuits repository so each portal deploys independently without cross-repo dependencies:

1. Commit the template files (`index.html`, `js/helix-renderer.mjs`, optional `data/*.json`, `_headers`, `.cfignore`, `README_RENDERER.md`) to the repository root.
2. Push the repository to GitHub (or another supported git host).
3. In the Cloudflare dashboard, create a new Pages project and connect the repository.
4. Set the **Build command** to empty (no build) and the **Build output directory** to `.` so Pages serves the root-level files directly.
5. Trigger the deployment. Cloudflare will honour `_headers` for security, ignore development folders listed in `.cfignore`, and serve the renderer instantly.

Later, point a Cloudflare Worker router at the deployed Pages project (for example, mapping `/cosmogenesis` to `cosmogenesis-learning-engine.pages.dev`). Because each repo ships this static bundle, the Worker can route without needing shared assets.

## Layer order (back to front)
1. **Vesica field** - Intersecting circle grid arranged by a `3 x 7` cadence. Mandorla glow, concentric portal rings, and an eight-point star echo the rose-window paintings.
2. **Tree-of-Life scaffold** - Ten sephirot plus hidden Daath, linked by twenty-two calm paths. Vaulted arches and copper pillars reference the cathedral silhouettes while keeping ND-safe contrast.
3. **Fibonacci curve** - Logarithmic spiral seeded by the golden ratio. Concentric "research chambers" drawn from Codex 144:99 schematics guide the laboratory rooms.
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
- Comments explain why each choice is present so future curators understand the trauma-informed guardrails.
- ASCII quotes, UTF-8 encoding, and LF newlines keep the files portable and offline friendly.
