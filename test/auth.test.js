+import { test } from 'node:test';
+import assert from 'node:assert/strict';
+import { getSession, setSession, clearSession } from '../app/shared/auth/index.js';
+
+// Ensure a clean session before tests
+clearSession();
+
+test('getSession provides anonymous identity', () => {
+  const session = getSession();
+  assert.equal(typeof session.id, 'string');
+  assert.equal(session.anonymous, true);
+});
+
+test('setSession stores provided user', () => {
+  setSession({ id: 'user1', anonymous: false, name: 'Tester' });
+  const session = getSession();
+  assert.equal(session.id, 'user1');
+  assert.equal(session.anonymous, false);
+});
+
+test('clearSession resets to anonymous', () => {
+  clearSession();
+  const session = getSession();
+  assert.equal(session.anonymous, true);
+});
