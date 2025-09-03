import { readFileSync } from 'fs';
import path from 'path';
import * as pluginManager from './pluginManager.js';

// registry[type] -> Map(id, plugin)
const registry = new Map();

export function register(type, plugin) {
  if (!plugin || !plugin.id) throw new Error('Plugin must have an id');
  if (!registry.has(type)) registry.set(type, new Map());
  registry.get(type).set(plugin.id, plugin);
  pluginManager.registerPlugin(plugin);
}

export function getByType(type) {
  return Array.from(registry.get(type)?.values() || []);
}

export async function load(descriptorPath = 'data/plugins.json') {
  const file = path.resolve(process.cwd(), descriptorPath);
  let raw;
  try {
    raw = readFileSync(file, 'utf8');
  } catch {
    return [{ id: descriptorPath, error: 'Unable to read plugin descriptors' }];
  }
  let descriptors;
  try {
    descriptors = JSON.parse(raw);
  } catch {
    return [{ id: descriptorPath, error: 'Invalid JSON' }];
  }
  const errors = [];
  for (const desc of descriptors) {
    if (!desc.id || !desc.type || !desc.src) {
      errors.push({ id: desc.id, error: 'Missing id/type/src' });
      continue;
    }
    try {
      const mod = await import(path.resolve(process.cwd(), desc.src));
      const plugin = mod.default || mod;
      register(desc.type, plugin);
    } catch (err) {
      errors.push({ id: desc.id, error: err.message });
    }
  }
  return errors;
}
