import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chamberEngine } from '../src/engines/chamber-engine.js';

test('openMultiple opens all chambers and tracks current', () => {
  chamberEngine.closeAll();
  chamberEngine.openMultiple(['alpha', 'beta']);
  assert.equal(chamberEngine.current, 'beta');
  assert.ok(chamberEngine.openChambers.has('alpha'));
  assert.ok(chamberEngine.openChambers.has('beta'));
});

test('payload set/get and clear', () => {
  chamberEngine.setPayload('alpha', 42);
  assert.equal(chamberEngine.getPayload('alpha'), 42);
  chamberEngine.closeAll();
  assert.equal(chamberEngine.getPayload('alpha'), null);
});

test('copyPayload duplicates data', () => {
  chamberEngine.closeAll();
  chamberEngine.openMultiple(['a', 'b']);
  chamberEngine.setPayload('a', 'foo');
  chamberEngine.copyPayload('a', 'b');
  assert.equal(chamberEngine.getPayload('b'), 'foo');
});
