# Cosmic Helix Renderer

_Per Texturas Numerorum, Spira Loquitur._

```text
0101010101010101010101010101010101010101
\\    COSMIC HELIX RENDERER MATRIX     //
0101010101010101010101010101010101010101
        /\        /\        /\
       /  \      /  \      /  \
      / /\ \    / /\ \    / /\ \
     /_/  \_\  /_/  \_\  /_/  \_\
      \ \  / /  \ \  / /  \ \  / /
       \ \/ /    \ \/ /    \ \/ /
        \  /      \  /      \  /
         \/        \/        \/
```

Offline, ND-safe canvas sketch for layered sacred geometry.

## Usage
1. Double-click `index.html` in any modern browser; no server or network required.
2. A 1440x900 canvas renders four static layers:
   - Vesica field -- intersecting circles forming a calm grid.
   - Tree-of-Life scaffold -- ten sephirot linked by twenty-two paths.
   - Fibonacci curve -- golden spiral polyline anchored to centre.
   - Double-helix lattice -- two phase-shifted sine tracks.
3. Palette colours live in `data/palette.json`. If the file is missing, the renderer falls back to a safe default and shows a gentle notice. why: honors offline-first expectations.

## Files
- `index.html` -- entry point with palette loader and inline status message. why: keeps ND-safe assurances in view when launching the canvas.
- `js/helix-renderer.mjs` -- pure ES module with four draw routines anchored to numerology constants.
- `data/palette.json` -- optional palette overrides; defaults apply automatically when absent.

## Numerology anchors
- 3 controls the vesica radius ratio.
- 7 softens the vesica grid spacing.
- 9 defines sephirot radius and Fibonacci series length.
- 11 and 22 balance Tree-of-Life stroke weights and path counts.
- 33 shapes helix oscillation count.
- 99 tempers helix amplitude.
- 144 scales both the Fibonacci spiral and helix step size.

## ND-safe design choices
- Static render only; no motion, autoplay, or flashing.
- Soft contrast palette and generous margins support sensory safety.
- Layer order preserves depth without flattening the geometry.
- Works entirely offline; no external libraries or requests.

## Troubleshooting
- Status reads "Palette missing; using safe fallback." -- the renderer loaded defaults; this is expected when running from file URLs without additional palette data.
- Canvas looks blank -- confirm the browser supports `<canvas>` and that JavaScript is enabled.
- Lines appear faint on certain displays -- adjust palette colours locally to suit your monitor; values live in `data/palette.json`.

## Extending
- Add new draw functions to `js/helix-renderer.mjs` and call them from `renderHelix`, keeping the background-to-foreground order. why: preserves layered geometry without introducing motion.
- Maintain small pure functions with clear comments so contributors can reason about sacred math quickly.
- When adding palettes or layers, continue using ND-safe colours and numerology constants to respect project lore.
