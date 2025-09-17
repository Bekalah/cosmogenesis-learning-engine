# Modernization Metrics — Parallel Engine Test Launcher

| Metric | Stride (use_stride=true) | MonoGame (use_monogame=false) | Notes |
| --- | --- | --- | --- |
| Average FPS | _pending_ | _pending_ | Enable <code>perf.gpu_instancing</code> to capture instancing delta. |
| Peak Draw Calls | _pending_ | _pending_ | Compare with and without LOD toggles. |
| Scene Load Time | _pending_ | _pending_ | Toggle texture streaming for large assets. |

## Toggle Checklist

- [x] GPU Instancing (`performance/flags.json`)
- [x] Level of Detail (`performance/flags.json`)
- [x] Texture Streaming (`performance/flags.json`)
- [x] ECS Bootstrap (`config/features.json`)

## Observation Template

1. Record baseline metrics with default flags.
2. Flip one flag at a time to capture delta.
3. Update this table with FPS, draw calls, and load time per engine.

> _Why:_ Aligns with the modernization guide’s recommendation to stage upgrades via feature flags before touching legacy render paths.

