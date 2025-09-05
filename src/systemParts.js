import { readFileSync } from 'fs';
import path from 'path';

let cache = null;

export function loadSystemParts(relativePath = 'data/system_parts.json') {
  if (!cache) {
    const file = path.resolve(process.cwd(), relativePath);
    const raw = readFileSync(file, 'utf8');
    cache = JSON.parse(raw);
  }
  return cache;
}
