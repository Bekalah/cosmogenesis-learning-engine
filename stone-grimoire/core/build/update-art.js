#!/usr/bin/env node
/**
 * update-art.js
 * Static ingest for Stone Grimoire art assets.
 * Moves inbox files into processed folders, generates optional thumbs/webp (if sharp is present),
 * builds the shared bridge manifest, and mirrors ND-safe tokens/CSS into cosmogenesis/public/c99/.
 * The routines avoid motion, enforce gentle naming, and keep geometry metadata aligned with perm-style tokens.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const REPO_ROOT = path.resolve(ROOT, '..');
const ART_ROOT = path.join(ROOT, 'assets', 'art');
const DIR_INBOX = path.join(ART_ROOT, 'inbox');
const DIR_ORIGINALS = path.join(ART_ROOT, 'originals');
const DIR_PROCESSED = path.join(ART_ROOT, 'processed');
const DIR_THUMBS = path.join(ART_ROOT, 'thumbs');
const DIR_WEBP = path.join(ART_ROOT, 'webp');
const BRIDGE_PATH = path.join(REPO_ROOT, 'bridge', 'c99-bridge.json');
const PUBLIC_C99 = path.join(REPO_ROOT, 'public', 'c99');
const TOKENS_SRC = path.join(ROOT, 'assets', 'tokens', 'perm-style.json');
const CSS_SRC = path.join(ROOT, 'assets', 'css', 'perm-style.css');
const REPO_TOKENS = path.join(REPO_ROOT, 'assets', 'tokens', 'perm-style.json');
const REPO_CSS = path.join(REPO_ROOT, 'assets', 'css', 'perm-style.css');

const ALLOWED_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg']);
const RASTER_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp']);

async function ensureDirectories() {
  const dirs = [ART_ROOT, DIR_ORIGINALS, DIR_PROCESSED, DIR_THUMBS, DIR_WEBP, path.dirname(BRIDGE_PATH), path.join(PUBLIC_C99, 'tokens'), path.join(PUBLIC_C99, 'css'), path.dirname(REPO_TOKENS), path.dirname(REPO_CSS)];
  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true });
  }
}

function sanitizeBaseName(file) {
  const lowered = file.toLowerCase();
  const safe = lowered.replace(/\s+/g, '-').replace(/[^a-z0-9._-]/g, '').replace(/-+/g, '-');
  const ext = path.extname(safe);
  return { base: safe.slice(0, safe.length - ext.length), ext };
}

async function uniqueName(dir, base, ext) {
  let attempt = `${base}${ext}`;
  let counter = 1;
  while (await fileExists(path.join(dir, attempt))) {
    attempt = `${base}-${counter}${ext}`;
    counter += 1;
  }
  return attempt;
}

async function fileExists(target) {
  try {
    await fs.stat(target);
    return true;
  } catch {
    return false;
  }
}

async function loadSharp() {
  try {
    const mod = await import('sharp');
    const sharp = mod.default ?? mod;
    console.log('sharp detected — generating thumbs/webp.');
    return sharp;
  } catch {
    console.log('sharp not found — skipping thumbs/webp (ND-safe fallback).');
    return null;
  }
}

async function generateDerivatives(sharp, originalPath, baseName, ext) {
  if (!sharp || !RASTER_EXT.has(ext)) {
    return { thumb: '', webp: '' };
  }
  const thumbName = `${baseName}-512.jpg`;
  const webpName = `${baseName}.webp`;
  const thumbPath = path.join(DIR_THUMBS, thumbName);
  const webpPath = path.join(DIR_WEBP, webpName);
  try {
    await sharp(originalPath).removeAlpha().resize({ width: 512, withoutEnlargement: true }).jpeg({ quality: 82 }).toFile(thumbPath);
  } catch {
    // Keep calm if generation fails; ND-safe fallback is empty string.
  }
  try {
    await sharp(originalPath).webp({ quality: 82 }).toFile(webpPath);
  } catch {
    // same as above.
  }
  return {
    thumb: await fileExists(thumbPath) ? `assets/art/thumbs/${thumbName}` : '',
    webp: await fileExists(webpPath) ? `assets/art/webp/${webpName}` : ''
  };
}

async function ingestInbox(sharp) {
  const hasInbox = await fileExists(DIR_INBOX);
  if (!hasInbox) return;
  const items = await fs.readdir(DIR_INBOX);
  for (const name of items) {
    const sourcePath = path.join(DIR_INBOX, name);
    const info = await fs.stat(sourcePath);
    if (!info.isFile()) continue;
    const ext = path.extname(name).toLowerCase();
    if (!ALLOWED_EXT.has(ext)) continue;
    const { base } = sanitizeBaseName(name);
    const finalName = await uniqueName(DIR_ORIGINALS, base, ext);
    const originalPath = path.join(DIR_ORIGINALS, finalName);
    await fs.rename(sourcePath, originalPath);
    const processedPath = path.join(DIR_PROCESSED, finalName);
    await fs.copyFile(originalPath, processedPath);
    await generateDerivatives(sharp, originalPath, path.basename(finalName, ext), ext);
  }
}

async function collectAssets() {
  const assets = [];
  const files = await fs.readdir(DIR_PROCESSED);
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!ALLOWED_EXT.has(ext)) continue;
    const base = file.slice(0, file.length - ext.length);
    const originalCandidate = path.join(DIR_ORIGINALS, file);
    const thumbCandidate = path.join(DIR_THUMBS, `${base}-512.jpg`);
    const webpCandidate = path.join(DIR_WEBP, `${base}.webp`);
    assets.push({
      name: file,
      type: ext.slice(1),
      original: (await fileExists(originalCandidate)) ? `assets/art/originals/${file}` : '',
      src: `assets/art/processed/${file}`,
      thumb: (await fileExists(thumbCandidate)) ? `assets/art/thumbs/${base}-512.jpg` : '',
      webp: (await fileExists(webpCandidate)) ? `assets/art/webp/${base}.webp` : '',
      nd_safe: true
    });
  }
  assets.sort((a, b) => a.name.localeCompare(b.name));
  return assets;
}

function baseId(name) {
  return name.replace(/\.[^.]+$/, '');
}

function classifyRoom(name) {
  if (/crypt/i.test(name)) return 'crypt';
  if (/nave/i.test(name)) return 'nave';
  if (/apprentice|pillar/i.test(name)) return 'apprentice_pillar';
  if (/respawn|gate/i.test(name)) return 'respawn_gate';
  return 'misc';
}

async function safeReadJSON(target) {
  try {
    const raw = await fs.readFile(target, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function buildRooms(assets, customRooms) {
  const defaults = [
    { id: 'crypt', title: 'The Crypt', element: 'earth', stylepack: 'Rosicrucian Black', tone: 110, geometry: 'vesica' },
    { id: 'nave', title: 'The Nave', element: 'air', stylepack: 'Angelic Chorus', tone: 222, geometry: 'rose-window' },
    { id: 'apprentice_pillar', title: 'Apprentice Pillar', element: 'water', stylepack: 'Hilma Spiral', tone: 333, geometry: 'fibonacci' },
    { id: 'respawn_gate', title: 'Respawn Gate', element: 'fire', stylepack: 'Alchemical Bloom', tone: 432, geometry: 'merkaba' }
  ];
  const rooms = Array.isArray(customRooms) && customRooms.length ? customRooms : defaults;
  const grouped = {};
  for (const asset of assets) {
    const tag = classifyRoom(asset.name);
    if (!grouped[tag]) grouped[tag] = [];
    grouped[tag].push(asset);
  }
  return rooms.map((room) => ({
    id: room.id,
    title: room.title,
    element: room.element,
    tone: room.tone,
    geometry: room.geometry,
    stylepack: room.stylepack,
    assets: (grouped[room.id] || []).map((asset) => ({ name: asset.name, src: `/${asset.src}`, thumb: asset.thumb ? `/${asset.thumb}` : '', webp: asset.webp ? `/${asset.webp}` : '', type: asset.type }))
  }));
}

function collectCreatures(assets) {
  const dragons = [];
  const daimons = [];
  for (const asset of assets) {
    if (/dragon/i.test(asset.name)) {
      dragons.push({ id: baseId(asset.name), title: 'Dragon', css: 'lava-brim obsidian-sculpt obsidian-glint obsidian-facets visionary-grid', art: asset });
    }
    if (/daimon/i.test(asset.name)) {
      daimons.push({ id: baseId(asset.name), title: 'Daimon', css: 'raku-seal obsidian-sculpt visionary-grid', art: asset });
    }
  }
  return { dragons, daimons };
}

function collectVisionary(assets) {
  const overlays = assets.filter((asset) => /alex[-_ ]?grey|visionary|sacred|grid/i.test(asset.name)).map((asset) => ({
    name: asset.name,
    src: `/${asset.src}`,
    thumb: asset.thumb ? `/${asset.thumb}` : '',
    webp: asset.webp ? `/${asset.webp}` : ''
  }));
  return { overlays };
}

function collectAngels(assets, angelsDataset) {
  if (!Array.isArray(angelsDataset) || angelsDataset.length === 0) return [];
  const limited = angelsDataset.slice(0, 12);
  return limited.map((entry, index) => {
    const pad = String(index + 1).padStart(2, '0');
    const linked = assets.find((asset) => asset.name.includes(pad));
    return {
      id: entry.id || `angel-${index + 1}`,
      name: entry.name || entry.shem || `Shem-${index + 1}`,
      virtue: entry.virtue || entry.keyword || '',
      seal: linked ? `/${linked.src}` : '',
      gate: entry.gate || null
    };
  });
}

function copyTokenSlices(tokens) {
  return {
    palette: tokens.palette || {},
    secondary: tokens.secondary || {},
    layers: tokens.layers || {},
    line: tokens.line || {},
    typography: tokens.typography || {},
    geometry: tokens.geometry || {},
    effects: tokens.effects || {},
    a11y: tokens.a11y || {}
  };
}

async function buildManifest(assets, tokens, customRooms, angelsDataset) {
  const manifest = {
    meta: {
      project: 'Circuitum99 × Stone Grimoire',
      updated: new Date().toISOString(),
      nd_safe: true,
      generator: 'update-art.js'
    },
    tokens: Object.assign({ css: '/assets/css/perm-style.css', json: '/assets/tokens/perm-style.json' }, copyTokenSlices(tokens)),
    routes: {
      stone_grimoire: { base: '/', chapels: '/chapels/', assets: '/assets/', bridge: '/bridge/c99-bridge.json' },
      cosmogenesis: { tokens: '/c99/tokens/perm-style.json', css: '/c99/css/perm-style.css', public: '/c99/', bridge: '/bridge/c99-bridge.json' }
    },
    rooms: buildRooms(assets, customRooms),
    creatures: collectCreatures(assets),
    visionary: collectVisionary(assets),
    angels: collectAngels(assets, angelsDataset),
    assets: assets.map((asset) => ({ name: asset.name, src: `/${asset.src}`, thumb: asset.thumb ? `/${asset.thumb}` : '', webp: asset.webp ? `/${asset.webp}` : '', type: asset.type, nd_safe: true }))
  };

  const optionalFields = {
    adventure: tokens.adventure_modes,
    avalon: tokens.avalon,
    between_realm: tokens.between_realm,
    healing: tokens.healing,
    trinity: tokens.trinity,
    rituals: tokens.rituals,
    pillars: tokens.pillars,
    egregores: tokens.egregores,
    tarot: tokens.tarot
  };
  for (const [key, value] of Object.entries(optionalFields)) {
    if (value) manifest[key] = value;
  }
  return manifest;
}

async function mirrorTokensAndCss() {
  const payload = await fs.readFile(TOKENS_SRC, 'utf8');
  await fs.writeFile(REPO_TOKENS, payload);
  await fs.writeFile(path.join(PUBLIC_C99, 'tokens', 'perm-style.json'), payload);
  const css = await fs.readFile(CSS_SRC, 'utf8');
  await fs.writeFile(REPO_CSS, css);
  await fs.writeFile(path.join(PUBLIC_C99, 'css', 'perm-style.css'), css);
}

async function main() {
  await ensureDirectories();
  const sharp = await loadSharp();
  await ingestInbox(sharp);
  const assets = await collectAssets();
  const tokens = (await safeReadJSON(TOKENS_SRC)) || {};
  const structure = (await safeReadJSON(path.join(ROOT, 'structure.json'))) || (await safeReadJSON(path.join(REPO_ROOT, 'structure.json')));
  const angelsDataset = (await safeReadJSON(path.join(REPO_ROOT, 'assets', 'data', 'angels72.json'))) || [];
  const manifest = await buildManifest(assets, tokens, structure?.rooms, angelsDataset);
  await fs.writeFile(BRIDGE_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  await mirrorTokensAndCss();
  console.log('Bridge manifest written to bridge/c99-bridge.json');
  console.log('Tokens and CSS mirrored to assets/ and public/c99/. ND-safe ✓');
}

main().catch((error) => {
  console.error('update-art.js failed:', error);
  process.exit(1);
});
