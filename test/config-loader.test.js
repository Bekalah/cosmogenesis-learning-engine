--+import { describe, it, expect } from 'vitest';
--+import { loadFirstDemo } from '../src/configLoader.js';
--+
--+describe('configuration loader', () => {
--+  it('loads the first demo configuration', () => {
--+    const config = loadFirstDemo();
--+    expect(config).toHaveProperty('layout');
--+    expect(Array.isArray(config.labels)).toBe(true);
--+  });
--+});
--+
-+import { describe, it, expect } from 'vitest';
-+import { loadFirstDemo } from '../src/configLoader.js';
-+
-+describe('configuration loader', () => {
-+  it('loads the first demo configuration', () => {
-+    const config = loadFirstDemo();
-+    expect(config).toHaveProperty('layout');
-+    expect(Array.isArray(config.labels)).toBe(true);
-+  });
-+});
-  
+import { test } from 'node:test';
+import assert from 'node:assert/strict';
+import { loadFirstDemo } from '../src/configLoader.js';
+
+test('loads the first demo configuration', () => {
+  const config = loadFirstDemo();
+  assert.equal(typeof config.layout, 'string');
+  assert.ok(Array.isArray(config.labels));
+});
