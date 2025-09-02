import assert from 'node:assert/strict';
import { test } from 'node:test';
import { chamberEngine } from '../src/engines/chamber-engine.js';

const resetEngine = () => {
  chamberEngine.openChambers.clear();
  chamberEngine.payloads.clear();
  chamberEngine.current = null;
};

test('openMultiple opens all chambers and sets current', () => {
  resetEngine();
  chamberEngine.openMultiple(['alpha', 'beta']);
  assert.deepEqual([...chamberEngine.openChambers], ['alpha', 'beta']);
  assert.equal(chamberEngine.current, 'beta');
});

test('copyPayload duplicates payload between chambers', () => {
  resetEngine();
  chamberEngine.openMultiple(['alpha', 'beta']);
  chamberEngine.setPayload('source data', 'alpha');
  chamberEngine.copyPayload('alpha', 'beta');
  assert.equal(chamberEngine.getPayload('beta'), 'source data');
});
