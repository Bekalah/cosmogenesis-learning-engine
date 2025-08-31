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
});
