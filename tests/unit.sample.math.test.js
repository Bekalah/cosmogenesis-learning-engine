// Framework: Node.js built-in test runner
import test from 'node:test';
import assert from 'node:assert/strict';
import { sum, clamp } from '../src/math.js';

test('sum: adds integers', () => {
  assert.equal(sum(1, 2), 3);
  assert.equal(sum(-1, 1), 0);
});

test('sum: adds floats with precision considerations', () => {
  assert.ok(Math.abs(sum(0.1, 0.2) - 0.3) < 1e-12);
});

test('sum: throws on non-numeric inputs', () => {
  assert.throws(() => sum('a', 1), { name: 'TypeError' });
  assert.throws(() => sum(NaN, 1), { name: 'TypeError' });
});

test('clamp: returns value within range', () => {
  assert.equal(clamp(5, 0, 10), 5);
});

test('clamp: clamps below min', () => {
  assert.equal(clamp(-1, 0, 10), 0);
});

test('clamp: clamps above max', () => {
  assert.equal(clamp(99, 0, 10), 10);
});

test('clamp: handles swapped bounds', () => {
  assert.equal(clamp(5, 10, 0), 5);
  assert.equal(clamp(-1, 10, 0), 0);
  assert.equal(clamp(99, 10, 0), 10);
});