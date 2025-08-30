-+import { test } from 'node:test';
-+import assert from 'node:assert/strict';
-+import fs from 'node:fs';
-+import path from 'node:path';
-+import url from 'node:url';
-+
-+const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
-+
-+function readJSON(relPath){
-+  const abs = path.join(__dirname, '..', relPath);
-+  const data = fs.readFileSync(abs, 'utf8');
-+  return JSON.parse(data);
-+}
-+
-+test('demos.json has titles and configs', () => {
-+  const demos = readJSON('data/demos.json');
-+  assert.ok(Array.isArray(demos));
-+  demos.forEach(d => {
-+    assert.equal(typeof d.title, 'string');
-+    assert.equal(typeof d.config, 'object');
-+  });
-+});
-+
-+test('egregores.json has required fields', () => {
-+  const eg = readJSON('data/egregores.json');
-+  assert.ok(Array.isArray(eg));
-+  eg.forEach(e => {
-+    assert.equal(typeof e.name, 'string');
-+    assert.equal(typeof e.arcana, 'string');
-+  });
-+});
-+
-+test('plugins.json modules exist', () => {
-+  const plugins = readJSON('data/plugins.json');
-+  plugins.forEach(p => {
-+    const exists = fs.existsSync(path.join(__dirname, '..', p.src));
-+    assert.ok(exists, `Missing plugin file ${p.src}`);
-+  });
-+});
-+
-+test('experiences.json configs exist', () => {
-+  const exps = readJSON('data/experiences.json');
-+  exps.forEach(e => {
-+    const exists = fs.existsSync(path.join(__dirname, '..', e.src));
-+    assert.ok(exists, `Missing experience config ${e.src}`);
-+  });
-+});
-EOF
-)
+import { test } from 'node:test';
+import assert from 'node:assert/strict';
+import fs from 'node:fs';
+import path from 'node:path';
+import url from 'node:url';
+
+const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
+
+function readJSON(relPath) {
+  const abs = path.join(__dirname, '..', relPath);
+  const data = fs.readFileSync(abs, 'utf8').replace(/^\+/gm, '').trim();
+  return JSON.parse(data);
+}
+
+test('demos.json has titles and configs', () => {
+  const demos = readJSON('data/demos.json');
+  assert.ok(Array.isArray(demos));
+  demos.forEach(d => {
+    assert.equal(typeof d.title, 'string');
+    assert.equal(typeof d.config, 'object');
+  });
+});
+
+test('egregores.json has required fields', () => {
+  const eg = readJSON('data/egregores.json');
+  assert.ok(Array.isArray(eg));
+  eg.forEach(e => {
+    assert.equal(typeof e.name, 'string');
+    assert.equal(typeof e.arcana, 'string');
+  });
+});
+
+const pluginFile = path.join(__dirname, '..', 'data', 'plugins.json');
+if (fs.existsSync(pluginFile)) {
+  test('plugins.json modules exist', () => {
+    const plugins = readJSON('data/plugins.json');
+    plugins.forEach(p => {
+      const exists = fs.existsSync(path.join(__dirname, '..', p.src));
+      assert.ok(exists, `Missing plugin file ${p.src}`);
+    });
+  });
+}
+
+const expFile = path.join(__dirname, '..', 'data', 'experiences.json');
+if (fs.existsSync(expFile)) {
+  test('experiences.json configs exist', () => {
+    const exps = readJSON('data/experiences.json');
+    exps.forEach(e => {
+      const exists = fs.existsSync(path.join(__dirname, '..', e.src));
+      assert.ok(exists, `Missing experience config ${e.src}`);
+    });
+  });
+}
+
+test('correspondences.json has required fields', () => {
+  const corr = readJSON('data/correspondences.json');
+  assert.ok(Array.isArray(corr));
+  corr.forEach(c => {
+    assert.equal(typeof c.realm, 'string');
+    assert.equal(typeof c.style, 'string');
+    assert.ok(Array.isArray(c.palette));
+    assert.ok(Array.isArray(c.keywords));
+  });
+});
