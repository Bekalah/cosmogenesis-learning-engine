# World Building & Multi-Game Integration

This document tracks the current state of the Cosmogenesis Learning Engine
and outlines next steps for using it across multiple games and complex
creative environments.

## Completed Foundations
- Cosmic Helix renderer: offline, ND-safe canvas sketch providing layered
  geometry (vesica, Tree-of-Life, Fibonacci, helix).
- Module loader (`src/remoteExperienceLoader.js`) can pull experiences from
  external repositories.
- Bridge configuration (`bridge/c99-bridge.json`) links this engine with the
  **circuitum99** soul repository.
- Plugin registry stubs exist under `plugins/` and `tests/` proving the engine
  can discover optional features.

## Current Repository Links
- `circuitum99/` and `stone-grimoire/` directories mirror the soul and body
  projects, allowing shared data and lore.
- `bridge/` exposes JSON descriptors for cross-repo hand‑off.
- `docs/repo_integration.md` describes how modules are discovered at runtime.

## Multi‑Game Expansion Ideas
- Treat each game world as a self‑contained module with its own schema and
  assets; load modules dynamically via the existing registry system.
- Use numerology constants (3,7,9,11,22,33,99,144) to keep geometry and lore
  consistent across realms.
- Provide a world‑building API so games can request canvas layers, NPC data,
  or narrative seeds from this engine.
- Store palettes, node maps, and quest templates in `/data` so other repos can
  reuse them without network calls.

## Outstanding Tasks
- [ ] Finish schema files for style packs and provenance to validate incoming
  modules.
- [ ] Replace failing tests and convert remaining CommonJS tests to ESM.
- [ ] Implement base engines (`spiral`, `chamber`, `art`, `sound`) as
  documented in `TASKS.md`.
- [ ] Create example world module demonstrating multi‑game hand‑off.
- [ ] Document a minimal world‑building API in `docs/`.

