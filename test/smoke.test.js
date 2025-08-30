--+import { describe, it, expect } from 'vitest';
--+import { readFileSync } from 'fs';
--+import { fileURLToPath } from 'url';
--+import path from 'path';
--+import { renderPlate } from '../src/renderPlate.js';
--+
--+const __filename = fileURLToPath(import.meta.url);
--+const __dirname = path.dirname(__filename);
--+
--+function loadFirstDemo() {
--+  const file = path.join(__dirname, '..', 'data', 'demos.json');
--+  const raw = readFileSync(file, 'utf8');
--+  const clean = raw.replace(/^\+/gm, '').trim();
--+  const demos = JSON.parse(clean);
--+  return demos[0].config;
--+}
--+
--+describe('renderPlate', () => {
--+  it('renders first demo plate without throwing', () => {
--+    const config = loadFirstDemo();
--+    const plate = renderPlate(config);
--+    expect(plate).toHaveProperty('layout', config.layout);
--+    expect(plate.labels.length).toBe(config.mode);
--+  });
--+});
-- 
-+import { test } from 'node:test';
-+import assert from 'node:assert/strict';
-+import { renderPlate } from '../src/renderPlate.js';
-+import { loadFirstDemo } from '../src/configLoader.js';
-+
-+test('renderPlate produces matching output', () => {
-+  const config = loadFirstDemo();
-+  const plate = renderPlate(config);
-+  assert.equal(plate.layout, config.layout);
-+  assert.equal(plate.labels.length, config.mode);
-+});
+import { test } from 'node:test';
+import assert from 'node:assert/strict';
+import { renderPlate } from '../src/renderPlate.js';
+import { loadFirstDemo } from '../src/configLoader.js';
+
+test('renderPlate produces matching output', () => {
+  const config = loadFirstDemo();
+  const plate = renderPlate(config);
+  assert.equal(plate.layout, config.layout);
+  assert.equal(plate.labels.length, config.mode);
+});
