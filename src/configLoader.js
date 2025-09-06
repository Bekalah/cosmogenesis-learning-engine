import { readFileSync } from 'node:fs';
import path from 'node:path';

export class ConfigError extends Error {
  constructor(file, messages) {
    super(messages.join('; '));
    this.file = file;
    this.messages = messages;
  }
}

export function loadConfig(relativePath) {
  const file = path.resolve(process.cwd(), relativePath);
  let raw;
  try {
    raw = readFileSync(file, 'utf8');
  } catch {
    throw new ConfigError(relativePath, ['Unable to read file']);
  }
  try {
    return JSON.parse(raw);
  } catch {
    throw new ConfigError(relativePath, ['Invalid JSON']);
  }
}

export function validatePlateConfig(config, source = 'config') {
  const errors = [];
  if (typeof config !== 'object' || config === null) {
    errors.push('config must be an object');
  } else {
    const layouts = ['spiral', 'twin-cone', 'wheel', 'grid'];
    if (!layouts.includes(config.layout)) {
      errors.push(`layout must be one of: ${layouts.join(', ')}`);
    }
    if (!Number.isInteger(config.mode) || config.mode <= 0) {
      errors.push('mode must be a positive integer');
    }
    if (!Array.isArray(config.labels)) {
      errors.push('labels must be an array');
    } else if (config.labels.length !== config.mode) {
      errors.push('label count must match mode');
    }
  }
  if (errors.length) {
    throw new ConfigError(source, errors);
  }
  return true;
}

export function loadFirstDemo() {
  const demos = loadConfig('data/demos.json');
  if (!Array.isArray(demos) || demos.length === 0) {
    throw new ConfigError('data/demos.json', ['Expected array']);
  }
  const config = demos[0].config;
  validatePlateConfig(config, 'data/demos.json[0].config');
  return config;
}
