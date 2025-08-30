@@ -0,0 +1,11 @@
+import { describe, it, expect } from 'vitest';
+import { loadFirstDemo } from '../src/configLoader.js';
+
+describe('configuration loader', () => {
+  it('loads the first demo configuration', () => {
+    const config = loadFirstDemo();
+    expect(config).toHaveProperty('layout');
+    expect(Array.isArray(config.labels)).toBe(true);
+  });
+});
+
 
