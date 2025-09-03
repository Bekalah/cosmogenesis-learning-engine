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
  } catch (err) {
    throw new ConfigError(relativePath, [`Unable to read file: ${err.message}`]);
  }

  } catch {
    throw new Error(`Config file not found: ${relativePath}`);
  }
  try {
    return JSON.parse(raw);
  } catch {
    throw new ConfigError(relativePath, ['Invalid JSON']);
  }
}

// Validate a plate config and surface all structural issues
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

// Convenience helper to grab the first demo configuration
export function loadFirstDemo() {
  const demos = loadConfig('data/demos.json');
  if (!Array.isArray(demos) || demos.length === 0 || typeof demos[0].config !== 'object') {
    throw new ConfigError('data/demos.json', ['Expected array with a config object']);
  }
  const config = demos[0].config;
  validatePlateConfig(config, 'data/demos.json[0].config');
  return config;
}
