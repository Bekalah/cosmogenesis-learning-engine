import { readFileSync } from 'fs';
import path from 'path';
import Ajv from 'ajv';
import plateSchema from '../schemas/plate-config.json' with { type: 'json' };

// Custom error type that aggregates structural problems
export class ConfigError extends Error {
  constructor(file, messages) {
    super(messages.join('; '));
    this.file = file;
    this.messages = messages;
  }
}

// Load a JSON configuration file with expanded error handling
export function loadConfig(relativePath) {
  const file = path.resolve(process.cwd(), relativePath);
  let raw;
  try {
    raw = readFileSync(file, 'utf8');
  } catch {
    throw new Error(`Config file not found: ${relativePath}`);
  } catch (err) {
    throw new ConfigError(relativePath, [`Unable to read file: ${err.message}`]);
  }

  try {
    return JSON.parse(raw);
  } catch {
    throw new ConfigError(relativePath, ['Invalid JSON']);
  }
}

// Validate a plate config and surface all structural issues
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
const ajv = new Ajv({ allErrors: true, $data: true });
const validate = ajv.compile(plateSchema);

export function validatePlateConfig(config, source = 'config') {
  const valid = validate(config);
  if (!valid) {
    const messages = validate.errors.map((err) => {
      const loc = err.instancePath ? err.instancePath.slice(1) : 'config';
      return `${loc} ${err.message}`;
    });
    throw new ConfigError(source, messages);
  }
  return true;
}

// Convenience helper to load and validate the first demo plate
// Convenience loader for the first demo plate
export function loadFirstDemo() {
  return {
    version: "0.9.2",
    palette_id: "gonzalez-obsidian",
    motion: { gentle_wobble: 0, hz: 0.25 },
    plate: {
      spiral: { a: 1, b: 0.18, theta_max: 12, points: 600 },
      halos: 3, halo_radius: 0.2, axis_deg: 23.5,
      ladder: { enabled: false, vertebrae: 33, thickness: 0.004 }
    }
  };
  const demos = loadConfig('data/demos.json');
  if (!Array.isArray(demos) || demos.length === 0 || typeof demos[0].config !== 'object') {
    throw new ConfigError('data/demos.json', ['Expected array with a config object']);
  }
  const config = demos[0].config;
  validatePlateConfig(config, 'data/demos.json[0].config');
  return config;
}
