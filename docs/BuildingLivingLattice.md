# Building the Living Lattice

The living lattice links Tarot arcana, planetary hour portals, angels, demons, Taras, and reference texts. Each node can optionally bloom into an RPG-style profile with stats, skills, and backstory so that visitors may enter the story as gently guided characters.

## Protocol

1. Load palette from `data/palettes/tara_21.json`. If unavailable, fall back to `data/palette.json` and display a notice.
2. Fetch `schemas/octagram_tesseract.schema.json` and validate `data/octagram_tesseract_nodes.json`. Any violation triggers a calm inline warning and avoids activation.
3. Determine the current planetary hour (approximated offline) to decide which nodes can activate.
4. Call `activate(id,{nd_safe:true})` for each candidate. Activations are logged and surfaced in the renderer status text.
5. Render Vesica, Tree-of-Life, Fibonacci curve, octagram cage, and helix bridge with fog, coloured light, and transparent materials — all static.
6. Overlay active node markers using the node geometry coordinates. Clicking (future work) can open lore, art, planetary links, and optional generative art prompts.

## Future Hooks

- `cosmogenesis/registry/octagram_tesseracts.json` maintains cross-repo bindings.
- `liber-arcanae/cards/_links/octagram_index.json` aligns Tarot cards with activated nodes.
- `circuitum99/hooks/onArcanaSwitch.js` handles arcana switching events.
- `registry/antahkarana_bridge.json` centralises the ND-safe intensity slider defaults.

This document keeps contributors aligned with trauma-informed, ND-safe, offline-first values.
