# MonoGame Sandbox

Companion render path for testing feature flags alongside Stride. Reads shared ECS and pooling code from `core/` so both engines evolve together without touching legacy surfaces.

## Feature Flags
- `config/features.json` — enables or disables this sandbox via `use_monogame`.
- `performance/flags.json` — mirrors Stride toggles for easy comparison.

## Next Steps
1. Stand up a MonoGame window that reports FPS in the title bar when enabled.
2. Pull entities from `ArchWorld.Create()` and apply pooled components for perf parity with Stride.
3. Capture baseline metrics for each performance flag and record deltas in `docs/modernization/METRICS.md`.
