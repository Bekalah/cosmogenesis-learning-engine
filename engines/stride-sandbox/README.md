# Stride Sandbox

Parallel render path placeholder for the Cosmogenesis Learning Engine modernization guide. This sandbox will host Stride experiments driven by the shared ECS world (`core/ecs/ArchWorld.cs`) and object pool (`core/memory/ObjectPool.cs`).

## Feature Flags
- `config/features.json` — toggles Stride vs. MonoGame and enables ECS wiring.
- `performance/flags.json` — flips GPU instancing, LOD, and texture streaming probes.

## Next Steps
1. Wire Stride scene bootstrap that reads `config/features.json` to decide when to initialize.
2. Duplicate entities with GPU instancing enabled when `performance/flags.json.gpu_instancing` is true.
3. Attach LOD 0/1/2 meshes according to the `lod` flag and mark large textures as streamable when `texture_streaming` is enabled.
