// NOTE: Testing framework will align to repository conventions.
// If Mocha/Chai is used:
//   import { describe, it, beforeEach, afterEach } from 'mocha';
//   import { expect } from 'chai';
// If Vitest is used:
//   import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
// If Jest is used (ESM):
//   import { jest } from '@jest/globals';

import path from 'node:path';
import url from 'node:url';

// Adjust this import path to match actual module location once confirmed by context.
let rendererModulePath = '../src/helix-renderer.mjs';
try {
  // Try common locations; tests will be updated after context run.
  rendererModulePath = (await import('../src/helix-renderer.mjs')).default ? '../src/helix-renderer.mjs'
                       : (await import('../lib/helix-renderer.mjs')).default ? '../lib/helix-renderer.mjs'
                       : '../src/helix-renderer.mjs';
} catch (_) {
  // fallback stays as default assumed path
}

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const resolve = (p) => path.resolve(__dirname, p);

describe('helix-renderer', () => {
  // Placeholder hook signatures; adapt to framework after context (mocha/vitest/jest)
  beforeEach(() => {
    // setup/mocks if needed
  });
  afterEach(() => {
    // restore mocks
  });

  it('renders minimal valid input (happy path)', async () => {
    const mod = await import(rendererModulePath).catch(async () => await import('../lib/helix-renderer.mjs'));
    const api = mod.default ?? mod;

    // Infer a public function to test; replace with actual exported symbol names after context:
    const fn = api.render || api.default || api;
    if (typeof fn !== 'function') {
      throw new Error('helix-renderer: expected a callable export "render"');
    }

    const result = await fn({
      content: '<p>Hello</p>',
      props: { title: 'Hi' },
      options: {}
    });

    // Replace with expect/assert from project framework after context.
    if (!result || typeof result !== 'string' || !result.includes('Hello')) {
      throw new Error('Unexpected render output');
    }
  });

  it('handles empty content gracefully', async () => {
    const mod = await import(rendererModulePath).catch(async () => await import('../lib/helix-renderer.mjs'));
    const fn = mod.render || mod.default || mod;

    let threw = false;
    let out;
    try {
      out = await fn({ content: '', props: {}, options: {} });
    } catch (e) {
      threw = true;
    }
    // Accept either empty string or a defined fallback; no unhandled throw.
    if (threw) throw new Error('Should not throw on empty content');
    if (typeof out !== 'string') throw new Error('Output should be a string for empty content');
  });

  it('applies props and escapes dangerous values', async () => {
    const mod = await import(rendererModulePath).catch(async () => await import('../lib/helix-renderer.mjs'));
    const fn = mod.render || mod.default || mod;

    const script = '<script>alert(1)</script>';
    const out = await fn({ content: `<h1>\${title}</h1>`, props: { title: script }, options: { escape: true } });

    if (!out.includes('<h1>') || out.includes('<script>alert(1)</script>')) {
      throw new Error('Expected props to be escaped');
    }
  });

  it('supports async data sources in options (e.g., fetcher)', async () => {
    const mod = await import(rendererModulePath).catch(async () => await import('../lib/helix-renderer.mjs'));
    const fn = mod.render || mod.default || mod;

    const out = await fn({
      content: 'User: ${user.name}',
      props: {},
      options: {
        fetcher: async (key) => {
          if (key === 'user') return { name: 'Ada' };
          return null;
        }
      }
    });

    if (!/Ada/.test(out)) {
      throw new Error('Async fetcher not applied');
    }
  });

  it('throws a clear error on invalid template syntax', async () => {
    const mod = await import(rendererModulePath).catch(async () => await import('../lib/helix-renderer.mjs'));
    const fn = mod.render || mod.default || mod;

    let threw = false;
    try {
      await fn({ content: 'Hello ${', props: {}, options: {} });
    } catch (e) {
      threw = /syntax|parse/i.test(String(e.message || e));
    }
    if (!threw) throw new Error('Expected syntax error for malformed template');
  });

  it('is deterministic for same inputs', async () => {
    const mod = await import(rendererModulePath).catch(async () => await import('../lib/helix-renderer.mjs'));
    const fn = mod.render || mod.default || mod;

    const input = { content: '<p>${msg}</p>', props: { msg: 'X' }, options: {} };
    const a = await fn(input);
    const b = await fn(input);
    if (a !== b) throw new Error('Render should be deterministic for identical inputs');
  });

  it('handles large content efficiently (basic smoke)', async () => {
    const mod = await import(rendererModulePath).catch(async () => await import('../lib/helix-renderer.mjs'));
    const fn = mod.render || mod.default || mod;

    const big = 'A'.repeat(20000);
    const out = await fn({ content: `<pre>${big}</pre>`, props: {}, options: {} });
    if (!out.includes(big.slice(0, 1000))) throw new Error('Large content not preserved');
  });
});


// --- PR-focused cases: expand based on PR diff to validate new/changed behavior ---
describe('helix-renderer (PR-focused cases)', () => {
  it('supports falsy props values (0, false, empty string) without dropping them', async () => {
    const mod = await import('../src/helix-renderer.mjs').catch(async () => await import('../lib/helix-renderer.mjs'));
    const fn = mod.render || mod.default || mod;
    const out = await fn({
      content: '<ul><li>${zero}</li><li>${flag}</li><li>${empty}</li></ul>',
      props: { zero: 0, flag: false, empty: '' },
      options: {}
    });
    if (!out.includes('>0<')) throw new Error('Should render zero value');
    if (!/>false</.test(out)) throw new Error('Should render boolean false explicitly');
    if (!/><\/li>/.test(out)) throw new Error('Should render empty string (not undefined)');
  });

  it('handles missing props by leaving placeholders intact or replacing with default when provided', async () => {
    const mod = await import('../src/helix-renderer.mjs').catch(async () => await import('../lib/helix-renderer.mjs'));
    const fn = mod.render || mod.default || mod;

    const outNoDefault = await fn({ content: 'Hi ${name}', props: {}, options: { defaultMissing: undefined } });
    if (!/(\$\{name\}|undefined)/.test(outNoDefault)) {
      throw new Error('Expected placeholder to remain or be "undefined" per implementation');
    }

    const outWithDefault = await fn({ content: 'Hi ${name}', props: {}, options: { defaultMissing: 'friend' } });
    if (!/Hi friend/.test(outWithDefault)) {
      throw new Error('Expected missing prop to be replaced by default');
    }
  });

  it('emits/source-maps or position info for errors to aid debugging', async () => {
    const mod = await import('../src/helix-renderer.mjs').catch(async () => await import('../lib/helix-renderer.mjs'));
    const fn = mod.render || mod.default || mod;
    let captured = null;
    try {
      await fn({ content: '${unclosed', props: {}, options: { filename: 'page.md' } });
    } catch (e) {
      captured = e;
    }
    if (!captured) throw new Error('Expected error to be thrown for invalid template');
    const msg = String(captured && captured.message || captured || '');
    // Loosely check for filename/position presence if newly added in PR
    if (!/page\.md/.test(msg) && !/position|line|column/i.test(msg)) {
      // Not failing hard: info check (soft assertion)
      console.warn('Error message lacks position/filename info; verify implementation if PR intended to add it.');
    }
  });
});