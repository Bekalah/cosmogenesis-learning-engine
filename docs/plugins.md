# Plugin System

The Cosmogenesis Learning Engine can be extended at runtime with small JavaScript plugins.

## Descriptor
Each plugin has an entry in `data/plugins.json`:

```json
{
  "id": "wikiSummary",
  "title": "Wikipedia Summary",
  "src": "plugins/wikiSummary.js",
  "description": "Fetch a Wikipedia summary and convert it into labels",
  "version": "1.0.0",
  "lifecycle": "manual"
}
```

`version` tracks the plugin revision and `lifecycle` hints when it should run. `manual` plugins require a user click while `startup` plugins activate automatically when the app loads.

## Plugin Module
A plugin module default‑exports an object with `id`, `activate`, and optional `deactivate` hooks.

```js
// plugins/myPlugin.js
export default {
  id: 'myPlugin',
  async activate(engine) {
    // called when the plugin is run
  },
  async deactivate(engine) {
    // optional cleanup
  }
};
```

## Using pluginManager
The engine registers plugins and controls their lifecycle through `src/pluginManager.js`:

```js
import * as pluginManager from './src/pluginManager.js';
import plugin from './plugins/myPlugin.js';

pluginManager.registerPlugin(plugin);
await pluginManager.activate(plugin.id, engine);
```

## Contributing Plugins
* Keep plugins focused and open‑source.
* Avoid network requests when possible; bundle third‑party libraries in `vendor/`.
* Provide clear `activate`/`deactivate` behavior and meaningful version numbers.
* Document usage and accessibility concerns in comments or accompanying docs.
>>>>>>>+main-upstream
ing Engine supports lightweight plugins that extend the app with open knowledge connectors or generative art modules.

## Creating a Plugin

1. Add a descriptor to `data/plugins.json` with an `id`, `title`, `src`, and short `description`.
2. Create a JavaScript module in the `plugins/` folder that exports a default function. This function receives the current `engine` instance and can modify or render as needed.
3. Plugins can be written with plain JavaScript or load external libraries (e.g., p5.js) using dynamic `import()` calls. For offli
ne use, place any third‑party scripts in the `vendor/` directory and import them locally before falling back to a CDN.

Example:

```js
// plugins/myPlugin.js
export default function(engine){
  // work with engine or create custom visuals
}
```

## Running Plugins

Open the *Plugins* tab and click **Run Plugin**. The module will load on demand and execute in the current session.

Contributors are encouraged to keep plugins open-source and mindful of accessibility.
