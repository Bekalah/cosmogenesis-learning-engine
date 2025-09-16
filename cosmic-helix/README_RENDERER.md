# Cosmic Helix Renderer

Static, offline canvas renderer that honours the spiral cosmology brief without touching the primary site entrypoint. Open `index.html` in this folder to see the four calm layers.

## Files
- `index.html` - offline shell that loads the palette (if present) and calls the renderer.
- `js/helix-renderer.mjs` - pure ES module with well-commented drawing helpers.
- `data/palette.json` - optional colour overrides. Safe defaults keep rendering steady when the file is absent.

## Usage
1. Double-click `index.html` in this directory. No server or network access is required.
2. A fixed 1440x900 canvas draws four ordered layers:
   - **L1 Vesica field** - intersecting circles arranged with 3/7/9/11 spacing.
   - **L2 Tree-of-Life** - ten sephirot nodes connected by twenty-two paths.
   - **L3 Fibonacci curve** - golden spiral polyline sampled over 144 segments.
   - **L4 Double-helix lattice** - two static strands with calm cross ties.
3. The status line reports whether the palette file loaded or the fallback palette activated. A small canvas caption repeats the notice when a fallback occurs.

## ND-safe choices
- Single render pass - no animation, autoplay, or flashing elements.
- Muted contrast palette and generous spacing reduce sensory strain.
- Layer order preserves depth without resorting to motion cues.
- Comments explain ND-safe rationales so future maintainers know why the guardrails exist.

## Numerology alignment
Geometry parameters reference the requested constants 3, 7, 9, 11, 22, 33, 99, and 144. Examples: the vesica grid uses 11 columns x 9 rows, tree path widths are 22/11, the Fibonacci spiral samples 144 segments, and the helix spacing leans on 33 and 99 ratios.

## Custom palette
Edit `data/palette.json` to tune colours. Keys:
- `bg` - canvas and page background.
- `ink` - text and fallback stroke colour.
- `muted` - subtle UI copy.
- `layers` - six hex colours applied to the four geometry layers (extras support future overlays).

If the JSON cannot be read (for example when browsers block `file://` fetches), the renderer switches to the bundled palette, updates the status text, and prints "Palette fallback active." on the canvas corner so the change is transparent.

## Extending safely
Add new layers by composing additional pure draw helpers in `helix-renderer.mjs`. Keep code ASCII-only with LF newlines, respect the ND-safe visual constraints, and annotate any lore additions with comments explaining why they belong in the canon.
