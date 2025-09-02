import test from 'node:test';
import assert from 'node:assert/strict';
import { loadFirstDemo } from '../src/configLoader.js';
import { renderPlate } from '../src/renderPlate.js';

test('renderPlate renders first demo without error', () => {
  const cfg = loadFirstDemo();
  const plate = renderPlate(cfg);
  assert.equal(plate.layout, cfg.layout);
  assert.equal(plate.items.length, cfg.mode);
});
