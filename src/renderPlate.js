+export function renderPlate(config) {
+  if (!config || typeof config.layout !== 'string' || typeof config.mode !== 'number' || !Array.isArray(config.labels)) {
+    throw new Error('Invalid plate configuration');
+  }
+  if (config.labels.length !== config.mode) {
+    throw new Error('Label count must match mode');
+  }
+  return { ...config, rendered: true };
+}
 
