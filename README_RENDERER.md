# Cosmic Helix Renderer

Static, offline-first canvas capsule tuned to the luminous cathedral canon. The renderer paints four still layers (vesica field,
Tree-of-Life scaffold, Fibonacci curve, and a static double-helix lattice) using the numerology anchors {3, 7, 9, 11, 22, 33, 99,
144}. Comments in the module explain how each choice keeps ND safety intact (no motion, soft contrast, layered depth).

## Files
- `index.html` – Offline entry point that loads the optional palette, applies the resolved colours to the shell chrome, and calls the renderer.
- `js/helix-renderer.mjs` – Pure ES module of drawing helpers. Each function is small, well-commented, and preserves the layered order.
- `data/palette.json` – Optional colour override. If absent the renderer applies a sealed fallback, updates the header status, and shows a canvas notice.
- `README_RENDERER.md` – This guide.

## Usage
1. Download or clone the repository.
2. Double-click `index.html`. No build step or server is required; the module runs entirely offline.
3. If the palette JSON is blocked (common on hardened `file://` contexts) the fallback palette activates automatically, the header notes the change, and the canvas prints "Palette fallback active" for reassurance.

## Layer order (back to front)
1. **Vesica field** – Seven-by-three grid of intersecting vesica pairs with a mandorla halo and central axis. Soft alpha keeps the base calm while preserving depth.
2. **Tree-of-Life scaffold** – Sephirot nodes, twenty-two paths, vaulted arch, and central column. Positions rely on the covenant ladder so each descent honours {33, 99, 144} spans.
3. **Fibonacci curve** – Static logarithmic-style spiral built from Fibonacci numbers up to 144, rendered once with rounded joints and pearl markers.
4. **Double-helix lattice** – Two phase-shifted rails with alternating rungs, base walkway, and diamond anchors. Everything is static; no animation or flashing.

All routines stay parameterised by `{3, 7, 9, 11, 22, 33, 99, 144}` to honour the cosmology canon while keeping the numerology adjustable.

## Numerology grounding cheatsheet
- **Tree columns** shift by 33 of the 144 horizontal units so each pillar leans on the covenant pair (33, 144).
- **Supernal triad** sets Chokmah and Binah 11 steps below Kether.
- **Hidden gate** (Daath) descends by 22 + 7 units, bridging the upper triad with the ethical triad.
- **Middle triad** aligns to 33 + 9 (Chesed/Geburah) and 33 + 22 (Tiphareth) to keep balance between mercy, strength, and heart.
- **Lower triad** drops to 99 - 3 for Netzach/Hod and 144 - 3 for Yesod, keeping the emotional/intellectual pair and the foundation within the harmonic ladder.
- **Malkuth** completes the run at 144, mirroring the full descent mapped across the canvas height.

## Accessibility & ND-safe rationale
- No animation, autoplay, or async loops. Rendering happens once per load.
- Calm palette defaults with clear status messaging when fallbacks are active, including an inline canvas caption for assurance.
- Layered drawing order maintains geometric depth without flattening into a single outline.
- Pure functions, ASCII quotes, UTF-8, and LF newlines keep the module portable for offline review.

## Customisation
- Adjust colours by editing `data/palette.json`. Provide `bg`, `ink`, and a six colour `layers` array.
- Override numerology constants in `index.html` before calling `renderHelix` if alternate ratios are desired.
- Compose new layers by duplicating the helper pattern in `js/helix-renderer.mjs`. Keep additions static and well-commented to preserve ND safety.
