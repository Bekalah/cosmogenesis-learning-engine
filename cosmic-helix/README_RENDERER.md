# Cosmic Helix Research Atlas (Offline, ND-safe)

Static HTML + Canvas renderer that now pulls geometry, navigation, and module datasets from JSON files. The canvas still draws the requested four-layer cosmology on a fixed 1440×900 stage, while the surrounding interface renders the nodal modules, pattern cards, healing palette, and journal copy.

## Files
- `index.html` – offline entry point with calm chrome, dataset status messaging, and interface population helpers.
- `js/helix-renderer.mjs` – ES module of pure drawing helpers; now parameterised by the geometry dataset.
- `data/palette.json` – optional palette override; safe defaults are bundled when the file is missing.
- `data/geometry.json` – vesica lattice counts, sephirot layout, Fibonacci curve parameters, and helix lattice settings.
- `data/modules.json` – Tree-of-Life navigation data, research module cards, pattern board, healing palette, and journal entry.

## Usage (offline)
1. Double-click `index.html` in any modern browser. No server or network connection is required.
2. The header status reports whether each dataset loaded (`palette`, `geometry`, and `module` data). Missing files trigger calm fallbacks and add a notice string to the canvas corner.
3. The canvas renders the four layers exactly once:
   - **Layer 1 — Vesica field:** intersecting circle lattice spaced with the numerology constants 3/7/9/11 (rows/columns come from `geometry.json`).
   - **Layer 2 — Tree-of-Life scaffold:** ten sephirot linked by twenty-two calm paths. Node positions, labels, and edges are read from `geometry.json` so you can remap the pillars without editing JS.
   - **Layer 3 — Fibonacci curve:** golden spiral polyline sampled across 144 points for smooth, static growth. The `phi`, `turns`, and `baseRadiusDivisor` live in the dataset for easy tuning.
   - **Layer 4 — Double-helix lattice:** two phase-shifted strands with thirty-three cross ties. Amplitude, phase offset, and cross-tie density are dataset-driven.

If any JSON cannot be fetched (common under `file://`), the renderer automatically falls back to bundled data, updates the status line, and prints a gentle notice on the canvas.

## ND-safe + trauma-informed choices
- Single render pass only — there are no animations, timers, or autoplay hooks.
- Muted palette and generous spacing keep contrast comfortable for neurodivergent viewers.
- Layered depth is preserved without flattening geometry; comments explain why each layer draws in that order.
- Geometry routines reference numerology constants (3, 7, 9, 11, 22, 33, 99, 144) and accept dataset overrides so symbolism stays explicit and editable.

## Customising datasets
- Update `data/palette.json` to swap colours. Keys remain `bg`, `ink`, `muted`, and `layers` (array of six hex codes).
- Adjust `data/geometry.json` to move sephirot nodes, alter vesica spacing, or tweak helix density. All numbers are plain integers/floats so they can be versioned easily.
- Edit `data/modules.json` to add or remove modules, patterns, healing swatches, or journal entries. The UI auto-renders any additional entries.

Removing or renaming any dataset is safe — the renderer displays a small fallback notice and keeps drawing with the bundled defaults.

## Extending safely
When adding new geometry, compose additional pure helper functions inside `js/helix-renderer.mjs` and call them after the existing layers. Keep the ND-safe covenant in place: static rendering, ASCII quotes, UTF-8 with LF newlines, and inline comments that explain any lore additions or accessibility decisions. New datasets should follow the same calm fallback approach: load if present, otherwise fall back quietly and inform the status banner.
