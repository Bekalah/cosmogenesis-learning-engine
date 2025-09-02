import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chamberEngine } from '../src/engines/chamber-engine.js';

test('chamber opens multiple and tracks current', () => {
  chamberEngine.closeAll();
  chamberEngine.openMultiple(['crypt','nave','garden']);
  assert.equal(chamberEngine.current(), 'garden');
  assert.ok(chamberEngine.openChambers.has('crypt'));
  assert.ok(chamberEngine.openChambers.has('nave'));
  assert.ok(chamberEngine.openChambers.has('garden'));
});

test('chamber payloads set/get and closeAll clears', () => {
  chamberEngine.setPayload('crypt', { tone: 'C' });
  assert.deepEqual(chamberEngine.getPayload('crypt'), { tone: 'C' });
  chamberEngine.closeAll();
  assert.equal(chamberEngine.current(), null);
  assert.equal(chamberEngine.getPayload('crypt'), null);
});
