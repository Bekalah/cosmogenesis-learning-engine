import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chamberEngine } from '../src/engines/chamber-engine.js';

function reset() {
  chamberEngine.closeAll();
}

test('openMultiple registers chambers and sets current', () => {
  reset();
  chamberEngine.openMultiple(['crypt', 'nave', 'garden']);
  assert.equal(chamberEngine.current(), 'garden');
  assert.ok(chamberEngine.openChambers.has('crypt'));
  assert.ok(chamberEngine.openChambers.has('nave'));
  assert.ok(chamberEngine.openChambers.has('garden'));
});

test('payload set/get and closeAll clears state', () => {
  reset();
  chamberEngine.setPayload('crypt', { tone: 'C' });
  assert.deepEqual(chamberEngine.getPayload('crypt'), { tone: 'C' });
  chamberEngine.closeAll();
  assert.equal(chamberEngine.current(), null);
  assert.equal(chamberEngine.getPayload('crypt'), null);
});

test('copyPayload duplicates existing payload', () => {
  reset();
  chamberEngine.openMultiple(['alpha', 'beta']);
  chamberEngine.setPayload('alpha', 'source');
  chamberEngine.copyPayload('alpha', 'beta');
  assert.equal(chamberEngine.getPayload('beta'), 'source');
});
