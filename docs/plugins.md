+# Plugin System
+
+The Cosmogenesis Learning Engine supports lightweight plugins that extend the app with open knowledge connectors or generative art modules.
+
+## Creating a Plugin
+
+1. Add a descriptor to `data/plugins.json` with an `id`, `title`, `src`, and short `description`.
+2. Create a JavaScript module in the `plugins/` folder that exports a default function. This function receives the current `engine` instance and can modify or render as needed.
+3. Plugins can be written with plain JavaScript or load external libraries (e.g., p5.js) using dynamic `import()` calls. For offli
+ne use, place any third‑party scripts in the `vendor/` directory and import them locally before falling back to a CDN.
+
+Example:
+
+```js
+// plugins/myPlugin.js
+export default function(engine){
+  // work with engine or create custom visuals
+}
+```
+
+## Running Plugins
+
+Open the *Plugins* tab and click **Run Plugin**. The module will load on demand and execute in the current session.
+
+Contributors are encouraged to keep plugins open-source and mindful of accessibility.
