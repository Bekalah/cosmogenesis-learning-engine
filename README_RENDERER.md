# Cosmic Helix Renderer (Offline, ND-safe)

This capsule paints a layered cosmology onto a single 1440×900 canvas the moment `index.html` loads. No animation, no motion opt-ins, and no network calls—just calm geometry that honours the numerology anchors `{3, 7, 9, 11, 22, 33, 99, 144}`.

## Delivered files
- `index.html` — Offline entry point. Seeds numerology constants, loads the optional palette, relays fallback status in the header, and invokes the renderer once.
- `js/helix-renderer.mjs` — Pure ES module with well-commented helpers for each layer (vesica field, Tree-of-Life scaffold, Fibonacci curve, and static double helix lattice).
- `data/palette.json` — Optional ND-safe palette override. When absent, the renderer applies a sealed fallback and prints a small canvas notice.
- `README_RENDERER.md` — This guide with offline instructions and rationale.

## Using the renderer
1. Clone or download this repository.
2. Double-click `index.html` in any modern browser. No build steps, bundlers, or servers are required.
3. If your browser blocks `file://` fetches, the renderer will report the fallback palette in the header and draw a gentle notice near the canvas base—rendering still completes.

## Layer order (back to front)
1. **Vesica field** — Intersecting circle lattice sampled on a `{9 × 11}` grid. Padding and radius ratios follow `{7, 33, 99}` to preserve depth without animation.
2. **Tree-of-Life scaffold** — Ten sephirot and twenty-two paths laid out with `{11, 33, 99}` divisors. Node halos and labels explain pillar balance while keeping contrast above AA 4.5.
3. **Fibonacci curve** — Logarithmic spiral sampled at `144` points. Golden-ratio growth and marker intervals of `11` maintain numerology alignment.
4. **Double helix lattice** — Two phase-shifted strands with `33` cross-ties. Amplitude and separation respect `{9, 22, 33}` divisors for a still, layered helix.

## Palette customisation
Update `data/palette.json` with ND-safe colours:

```json
{
  "bg": "#0a0c16",
  "ink": "#f8e8ca",
  "layers": [
    "#213963",
    "#2b5f7a",
    "#d8a159",
    "#f7d78e",
    "#cc8add",
    "#324766"
  ]
}
```

The loader only attempts this local JSON file and falls back gracefully when it is missing or malformed. The canvas notice confirms the fallback so caretakers know why colours shifted.

## ND-safe choices
- **No motion.** Everything renders once; no intervals, requestAnimationFrame, or autoplay.
- **Layered geometry.** Each drawing helper preserves depth with translucency instead of flattening into a single SVG layer.
- **Readable contrast.** Default and sample palettes respect AA 4.5+ contrast for text and guides.
- **Pure helpers.** Every geometry function is a small, well-commented pure routine to ease trauma-informed audits.

## Troubleshooting
- If the header reports "Palette missing", confirm the file name is `data/palette.json`. Rendering still succeeds thanks to the fallback palette.
- Browsers that forbid `file://` fetch calls (notably Chromium with strict flags) require launching via `--allow-file-access-from-files` or using the bundled fallback palette.
