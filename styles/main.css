---+import { describe, it, expect } from 'vitest';
---+import { loadFirstDemo } from '../src/configLoader.js';
---+
---+describe('configuration loader', () => {
---+  it('loads the first demo configuration', () => {
---+    const config = loadFirstDemo();
---+    expect(config).toHaveProperty('layout');
---+    expect(Array.isArray(config.labels)).toBe(true);
---+  });
---+});
---+
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
--  
-+import { test } from 'node:test';
-+import assert from 'node:assert/strict';
-+import { loadFirstDemo } from '../src/configLoader.js';
-+
-+test('loads the first demo configuration', () => {
-+  const config = loadFirstDemo();
-+  assert.equal(typeof config.layout, 'string');
-+  assert.ok(Array.isArray(config.labels));
-+});
+import { loadConfig, validatePlateConfig } from '../src/configLoader.js';
+import { test } from 'node:test';
+import { strict as assert } from 'assert';
+import { writeFileSync, unlinkSync } from 'fs';
+
+// Ensure loadConfig surfaces invalid JSON errors
+test('loadConfig throws on invalid JSON', () => {
+  const file = 'test/fixtures/bad.json';
+  writeFileSync(file, '{');
+  assert.throws(() => loadConfig(file), /Invalid JSON/);
+  unlinkSync(file);
+});
+
+// Validate schema enforcement
+test('validatePlateConfig enforces label count', () => {
+  const good = { layout: 'spiral', mode: 1, labels: ['x'] };
+  validatePlateConfig(good);
+  const bad = { ...good, labels: [] };
+  assert.throws(() => validatePlateConfig(bad), /Label count/);
+});
