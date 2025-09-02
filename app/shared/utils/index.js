import fs from 'node:fs';
import path from 'node:path';

/**
 * Load a JSON dataset relative to the project root.
 * @param {string} relPath - Path to the file.
 * @param {string} [baseDir=process.cwd()] - Base directory to resolve from.
 * @returns {any} Parsed JSON object.
 */
export function loadJSON(relPath, baseDir = process.cwd()) {
  const abs = path.resolve(baseDir, relPath);
  const data = fs.readFileSync(abs, 'utf8');
  return JSON.parse(data);
}

/**
 * Load a text file relative to the project root.
 * @param {string} relPath - Path to the file.
 * @param {string} [baseDir=process.cwd()] - Base directory to resolve from.
 * @returns {string} File contents as string.
 */
export function loadText(relPath, baseDir = process.cwd()) {
  const abs = path.resolve(baseDir, relPath);
  return fs.readFileSync(abs, 'utf8');
}

/**
 * Join style class names while ignoring falsy values.
 * @param {...string} names - Class names to join.
 * @returns {string} Joined class string.
 */
export function classes(...names) {
  return names.filter(Boolean).join(' ');
}

export default {
  loadJSON,
  loadText,
  classes,
};
