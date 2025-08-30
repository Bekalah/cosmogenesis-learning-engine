+import { test } from 'node:test';
+import assert from 'node:assert/strict';
+import { loadJSON, classes } from '../app/shared/utils/index.js';
+
+// dataset loader
+
+test('loadJSON reads JSON file', () => {
+  const data = loadJSON('test/fixtures/sample.json');
+  assert.equal(data.name, 'sample');
+});
+
+// style helper
+
+test('classes joins class names', () => {
+  const result = classes('a', null, undefined, 'b');
+  assert.equal(result, 'a b');
+});
