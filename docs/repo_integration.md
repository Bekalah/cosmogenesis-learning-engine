# Cross-Repository Integration

The Cosmogenesis engine can grow alongside other creative projects. Treat each external realm or "egregore" as its own module and let the core app discover them at runtime.

## Modular Integration
- Keep companion projects in separate repositories and expose them via APIs or Git submodules.
- Each module should ship its own `config.json`, assets, and optional plugins so the engine can load it dynamically.

## Dynamic Growth
- Design modules to be discoverable: the engine can scan a registry or URL list to pull in new realms without code changes.
- Use a plugin loader to import JavaScript from other repos on demand.

## Cross-Reactive Learning
- Optional webhooks or message queues can notify the engine when linked repos change, enabling "spiral" feedback loops across experiences.

## Documentation & Interfaces
- Define clear data schemas and communication protocols so external repos remain interoperable.
- Document each module's API and expected events in its own repository for easier maintenance.

These practices let the Learning Engine evolve with your other projects while staying cohesive and open to community contributions.

## Remote Experience Loader

Use `src/remoteExperienceLoader.js` to pull experience definitions straight from a public GitHub repository. This lets the engine run modules without cloning their repos.

```html
<script type="module">
import { fetchRemoteExperiences } from '../src/remoteExperienceLoader.js';

const experiences = await fetchRemoteExperiences('user/other-repo');
console.log(experiences);
</script>
```

Each loaded experience resolves its components and optional prologue pages using raw GitHub URLs.
