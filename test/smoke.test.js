import { test } from 'node:test';
import assert from 'node:assert/strict';

test('basic arithmetic works', () => {
  assert.equal(1 + 1, 2);
import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { loadConfig } from '../src/configLoader.js';
import { renderPlate } from '../src/renderPlate.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

test('renderPlate renders first demo plate without throwing', () => {
  const demos = loadConfig(join(__dirname, '..', 'data', 'demos.json'));
  const config = demos[0].config;
  const plate = renderPlate(config);
  assert.equal(plate.layout, config.layout);
  assert.equal(plate.labels.length, config.mode);
import { strict as assert } from 'assert';
import { loadFirstDemo } from '../src/configLoader.js';

test('loadFirstDemo returns valid config', () => {
  const config = loadFirstDemo();
  assert.equal(typeof config.layout, 'string');
  assert.equal(config.labels.length, config.mode);
});
import { strict as assert } from 'assert';
import { renderPlate } from '../src/renderPlate.js';

test('renderPlate creates items for basic wheel', () => {
  const plate = renderPlate({ layout: 'wheel', mode: 3, labels: ['a', 'b', 'c'] });
  assert.equal(plate.items.length, 3);
});

