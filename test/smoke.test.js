import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadFirstDemo } from '../src/configLoader.js';
import { renderPlate } from '../src/renderPlate.js';

// Simple sanity check
test('basic arithmetic works', () => {
  assert.equal(1 + 1, 2);
});

test('loadFirstDemo returns valid config', () => {
  const config = loadFirstDemo();
  assert.equal(typeof config.layout, 'string');
  assert.equal(config.labels.length, config.mode);
});

test('renderPlate creates items for basic wheel', () => {
  const plate = renderPlate({ layout: 'wheel', mode: 3, labels: ['a', 'b', 'c'] });
  assert.equal(plate.items.length, 3);
});
