import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadSystemParts } from '../src/systemParts.js';

test('loadSystemParts exposes repository trinity', () => {
  const parts = loadSystemParts();
  assert.equal(parts.mind.repo, 'cosmogenesis-learning-engine');
  assert.equal(parts.soul.repo, 'circuitum99');
  assert.equal(parts.body.repo, 'stone-cathedral');
  assert.equal(parts.companion.repo, 'liber-arcanae');
});
