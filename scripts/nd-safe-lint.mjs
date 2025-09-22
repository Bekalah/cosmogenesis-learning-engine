#!/usr/bin/env node
/**
 * ND-safe linter
 * Ensures perm-style tokens and CSS obey "no strobe" and "motion opt-in" covenant.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CSS_FILES = [
  path.join(ROOT, 'assets', 'css', 'perm-style.css'),
  path.join(ROOT, 'stone-grimoire', 'assets', 'css', 'perm-style.css'),
  path.join(ROOT, 'public', 'c99', 'css', 'perm-style.css')
];
const TOKEN_FILES = [
  path.join(ROOT, 'assets', 'tokens', 'perm-style.json'),
  path.join(ROOT, 'stone-grimoire', 'assets', 'tokens', 'perm-style.json'),
  path.join(ROOT, 'public', 'c99', 'tokens', 'perm-style.json')
];

const issues = [];

function addIssue(message) {
  issues.push(message);
}

async function checkCss(file) {
  let content;
  try {
    content = await fs.readFile(file, 'utf8');
  } catch (error) {
    addIssue(`Unable to read ${path.relative(ROOT, file)}: ${error.message}`);
    return;
  }
  if (!content.includes('@media (prefers-reduced-motion:reduce)')) {
    addIssue(`${path.relative(ROOT, file)} is missing prefers-reduced-motion guard.`);
  }
  if (!content.includes('.allow-motion')) {
    addIssue(`${path.relative(ROOT, file)} is missing .allow-motion opt-in class.`);
  }
  const lines = content.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (/animation\s*:/i.test(line)) {
      const hasOptIn = /\.allow-motion/i.test(line);
      const disablesMotion = /animation\s*:\s*none/i.test(line);
      if (!hasOptIn && !disablesMotion) {
        addIssue(`${path.relative(ROOT, file)} line ${index + 1} has animation without .allow-motion opt-in.`);
      }
    }
  }
}

async function checkTokens(file) {
  let payload;
  try {
    const text = await fs.readFile(file, 'utf8');
    payload = JSON.parse(text);
  } catch (error) {
    addIssue(`Unable to parse ${path.relative(ROOT, file)}: ${error.message}`);
    return;
  }
  if (!payload || typeof payload !== 'object') {
    addIssue(`${path.relative(ROOT, file)} is not an object.`);
    return;
  }
  if (!payload.meta || payload.meta.nd_safe !== true) {
    addIssue(`${path.relative(ROOT, file)} meta.nd_safe must be true.`);
  }
  const a11y = payload.a11y;
  if (!a11y) {
    addIssue(`${path.relative(ROOT, file)} is missing a11y stanza.`);
    return;
  }
  if (a11y.strobe !== false) {
    addIssue(`${path.relative(ROOT, file)} must set a11y.strobe to false.`);
  }
  if (a11y.autoplay !== false) {
    addIssue(`${path.relative(ROOT, file)} must set a11y.autoplay to false.`);
  }
  if (!['reduce', 'opt-in'].includes(a11y.motion)) {
    addIssue(`${path.relative(ROOT, file)} must set a11y.motion to "reduce" or "opt-in".`);
  }
  if (typeof a11y.min_contrast !== 'number' || a11y.min_contrast < 4.5) {
    addIssue(`${path.relative(ROOT, file)} must guarantee min_contrast ≥ 4.5.`);
  }
}

async function main() {
  const seenCss = new Set();
  const seenTokens = new Set();
  for (const file of CSS_FILES) {
    if (seenCss.has(file)) continue;
    seenCss.add(file);
    await checkCss(file);
  }
  for (const file of TOKEN_FILES) {
    if (seenTokens.has(file)) continue;
    seenTokens.add(file);
    await checkTokens(file);
  }
  if (issues.length) {
    console.error('ND-safe lint failed:');
    for (const issue of issues) {
      console.error(` - ${issue}`);
    }
    process.exit(1);
  } else {
    console.log('ND-safe lint passed.');
  }
}

main().catch((error) => {
  console.error('ND-safe lint crashed:', error);
  process.exit(1);
});
