import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadFirstDemo } from '../src/configLoader.js';
import { renderPlate } from '../src/renderPlate.js';

test('smoke: renderPlate yields points', () => {
  const cfg = loadFirstDemo();
  const { points } = renderPlate(cfg);
  assert.ok(Array.isArray(points) && points.length > 0, 'points generated');
});
