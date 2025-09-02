import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig, validatePlateConfig } from '../src/configLoader.js';
import { strict as assert } from 'assert';
import { writeFileSync, unlinkSync } from 'fs';
import { loadConfig, validatePlateConfig } from '../src/configLoader.js';

// Ensure loadConfig surfaces invalid JSON errors
test('loadConfig throws on invalid JSON', () => {
  const file = 'test/fixtures/bad.json';
  writeFileSync(file, '{');
  assert.throws(() => loadConfig(file), /Invalid JSON/);
  unlinkSync(file);
});

test('validatePlateConfig enforces label count', () => {
  const good = { layout: 'spiral', mode: 1, labels: ['x'] };
  validatePlateConfig(good);
  const bad = { ...good, labels: [] };
  assert.throws(() => validatePlateConfig(bad), /Label count/);
});
