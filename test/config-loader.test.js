import { loadConfig, validatePlateConfig } from '../src/configLoader.js';
import { test } from 'node:test';
import { strict as assert } from 'assert';
import { test } from 'node:test';
import { strict as assert } from 'assert';
import { loadConfig, validatePlateConfig } from '../src/configLoader.js';
import { writeFileSync, unlinkSync } from 'fs';

// Ensure loadConfig surfaces invalid JSON errors
test('loadConfig throws on invalid JSON', () => {
  const file = 'test/fixtures/bad.json';
  writeFileSync(file, '{');
  assert.throws(() => loadConfig(file), /Invalid JSON/);
  unlinkSync(file);
});

// Validate schema enforcement
test('validatePlateConfig enforces label count', () => {
  const good = { layout: 'spiral', mode: 1, labels: ['x'] };
  validatePlateConfig(good);
  const bad = { ...good, labels: [] };
  assert.throws(() => validatePlateConfig(bad), /Label count/);
});
