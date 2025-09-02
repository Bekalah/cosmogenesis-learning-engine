import { readFileSync } from 'fs';
import path from 'path';

// Load a JSON configuration file with basic error handling
export function loadConfig(relativePath) {
  const file = path.resolve(process.cwd(), relativePath);
  let raw;
  try {
    raw = readFileSync(file, 'utf8');
  } catch {
    throw new Error(`Config file not found: ${relativePath}`);
  }

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error(`Invalid JSON in ${relativePath}`);
  }
}

// Ensure a plate config adheres to the minimal schema used by renderPlate
export function validatePlateConfig(config) {
  if (typeof config !== 'object' || config === null) {
    throw new Error('Config must be an object');
  }
  const layouts = ['spiral', 'twin-cone', 'wheel', 'grid'];
  if (!layouts.includes(config.layout)) {
    throw new Error('Unknown layout');
  }
  if (typeof config.mode !== 'number' || config.mode <= 0) {
    throw new Error('Mode must be a positive number');
  }
  if (!Array.isArray(config.labels)) {
    throw new Error('Labels must be an array');
  }
  if (config.labels.length !== config.mode) {
    throw new Error('Label count must match mode');
  }
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
}
