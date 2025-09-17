# Cosmic Helix Renderer

Static, offline HTML+Canvas sketch that layers vesica geometry, the Tree-of-Life scaffold, a Fibonacci curve, and a static double-helix lattice. The scene stays ND-safe: calm colours, zero motion, and a predictable 1440×900 frame. All geometry constants echo the Codex 144:99 (c99) lattice numerology.

## Files
- `index.html` — Entry point; open directly with no server.
- `js/helix-renderer.mjs` — Pure drawing routines (no dependencies).
- `data/palette.json` — Optional palette override; missing file triggers a gentle fallback notice.

## Usage
1. Double-click `index.html` in any modern browser (offline works fine).
2. The header status reports whether the palette file loaded or the fallback palette rendered instead.
3. The canvas draws four ordered layers:
   - **Vesica field** — Interlocking circles set by 3/7/9/11 spacing.
   - **Tree-of-Life scaffold** — Ten sephirot nodes linked by twenty-two paths.
   - **Fibonacci curve** — Golden spiral polyline sampled at 144 points.
   - **Double-helix lattice** — Two sine strands with gentle cross ties.

## ND-safe design choices
- Static render only; no animation, autoplay, or flashing.
- Muted palette and comments explain safety rationales for future maintainers.
- Layer order is consistent so depth reads without motion.
- ASCII quotes, UTF-8 encoding, and LF newlines honour the coding covenant.

## Numerology anchors
- Grid counts, stroke widths, and sampling density reference constants 3, 7, 9, 11, 22, 33, 99, and 144.
- The Fibonacci curve walks seven quarter-turns to balance the vesica field.
- The helix takes three rotations with 144 samples for smooth strands.

## Palette behaviour
- Edit `data/palette.json` to adjust colours. Keys: `bg`, `ink`, optional `muted`, and a six-value `layers` array.
- If the JSON is missing or unreadable (common when file:// fetch is blocked), the renderer applies a bundled fallback palette and prints a reassuring notice on the canvas and in the header.

## Extending safely
Add new pure draw helpers inside `js/helix-renderer.mjs` and call them after the existing layers. Document any lore additions in comments so future stewards understand why geometry choices support the Codex 144:99 tapestry.
