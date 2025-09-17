# Cosmic Helix Renderer

Static, offline canvas renderer that draws four calm layers of sacred geometry on a 1440x900 stage. The module follows the ND-safe covenant: no motion, soft contrast, predictable layout, and inline comments that explain every safety choice so future lore stays intact.

## Quickstart
1. Double-click `index.html` in any modern browser. No server or network access is required.
2. The header status line reports whether the optional palette file loaded. Missing data triggers a gentle notice and safe fallback colors.
3. A single render pass draws four layers:
   - **Layer 1: Vesica field** -- intersecting circle lenses arranged with 3/7/9/11 spacing to suggest the womb of forms without overwhelming repetition.
   - **Layer 2: Tree-of-Life scaffold** -- ten sephirot linked by twenty-two paths, scaled with 3/7/33 geometry so the structure reads clearly at 1440x900.
   - **Layer 3: Fibonacci curve** -- a calm logarithmic spiral sampled 99 times to keep the golden ratio presence gentle.
   - **Layer 4: Double-helix lattice** -- two static sine strands with 144 samples and soft rungs, nodding to DNA without introducing motion.

## ND-safe design notes
- Static drawing only; there is no animation, autoplay, flashing, or audio.
- Muted contrast palette with generous whitespace reduces sensory strain.
- Layer order preserves depth without any motion effects.
- Code uses ASCII quotes, LF newlines, and small pure functions so maintenance stays approachable.

## Numerology alignment
Geometry parameters use the requested constants 3, 7, 9, 11, 22, 33, 99, and 144. These values steer circle spacing, Tree-of-Life proportions, spiral growth, and helix sampling density, keeping the renderer faithful to Codex 144:99.

## Palette and fallbacks
- Colors live in `data/palette.json` with keys `bg`, `ink`, `muted`, and a `layers` array of six hex values.
- When the JSON cannot be loaded (common when running over `file://`), `index.html` reports the issue and uses bundled fallback colors while still rendering the geometry.

## File structure
```
index.html               # Entry point; loads palette, sets constants, calls renderer (commented with the lore reason why).
js/helix-renderer.mjs    # Pure drawing functions for the four layers.
data/palette.json        # Optional palette override; safe defaults mirror ND-safe tones.
```

## Extending safely
Add new geometry by composing additional pure helpers in `js/helix-renderer.mjs`. Keep the ND-safe guardrails (static rendering, calm colors, clear comments that explain why choices serve trauma-informed viewing) so the Cosmogenesis Learning Engine canon remains coherent.
