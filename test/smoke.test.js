import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadFirstDemo } from '../src/configLoader.js';
import { renderPlate } from '../src/renderPlate.js';

test('loadFirstDemo returns valid config', () => {
  const config = loadFirstDemo();
  assert.equal(typeof config.layout, 'string');
import { loadConfig, validatePlateConfig } from '../src/configLoader.js';
import { renderPlate } from '../src/renderPlate.js';

test('loadConfig returns valid plate config', () => {
  const config = loadConfig('test/fixtures/wheel.json');
  validatePlateConfig(config);
  assert.equal(config.labels.length, config.mode);
});

test('renderPlate creates items for basic wheel', () => {
  const plate = renderPlate({ layout: 'wheel', mode: 3, labels: ['a', 'b', 'c'] });
  assert.equal(plate.items.length, 3);
});
