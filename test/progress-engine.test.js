import { test } from 'node:test';
import assert from 'node:assert/strict';
import { exportJSON } from '../src/engines/exporter.js';

test('progress export JSON writes a file', () => {
  const path = exportJSON({ ok: true }, 'progress.json');
  assert.ok(typeof path === 'string' && path.endsWith('progress.json'));
});
