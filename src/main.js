import theme from '../assets/theme.json';
import dataMap from '../codex/data.map.json';

// ND-safe medallion ring: static layout, no motion, layered numerology constants.
const NUM = { THREE: 3, SEVEN: 7, NINE: 9, ELEVEN: 11, TWENTYTWO: 22, THIRTYTHREE: 33, NINETYNINE: 99, ONEFORTYFOUR: 144 };
const palette = Array.isArray(theme?.palette) && theme.palette.length ? theme.palette : ['#1b1b2f', '#4055c8', '#63cdda', '#a0f0d0', '#f4ce74', '#f6a6d6'];
const medallions = [
  { id: 'cosmogenesis', type: 'chapel', title: 'Cosmogenesis Chapel', summary: 'Spiral registry archive.', accent: 0, src: '/chapels/cosmogenesis/index.html' },
  { id: 'rooms-atlas', type: 'chapel', title: 'Rooms Atlas', summary: 'Atlas of layered rooms.', accent: 1, src: '/chapels/rooms-atlas.html' },
  { id: 'fusion-kink', type: 'chapel', title: 'Fusion Library', summary: 'Hybrid rites reading room.', accent: 2, src: '/chapels/fusion-kink/library.html' },
  { id: 'godot', type: 'lab', title: 'Godot Lab', summary: 'Embed the Godot experiments.', accent: 3, src: '/labs/godot/index.html' },
  { id: 'monogame', type: 'lab', title: 'MonoGame Lab', summary: 'MonoGame spiral prototypes.', accent: 4, src: '/labs/monogame/index.html' },
  { id: 'save-endpoint', type: 'note', title: 'Save Sculpture Endpoint', summary: 'POST manifests to /api/save-sculpture; echoes with author stamp.', accent: 5 }
];
const state = { ring: null, outlet: null, idx: -1 };

const applyTheme = () => { const root = document.documentElement; root.style.setProperty('--cathedral-bg', palette[0]); root.style.setProperty('--cathedral-ink', '#f5f7ff'); palette.forEach((hex, idx) => root.style.setProperty(`--cathedral-accent-${idx}`, hex)); };

const ringPosition = (idx, total) => { // 144-degree inspired radius ensures gentle spacing; ring anchored around calm centre.
  const angle = (Math.PI * 2 * idx) / total - Math.PI / 2; const radius = 42; return { left: 50 + radius * Math.cos(angle), top: 50 + radius * Math.sin(angle) };
};

const buildButton = (item, idx, total) => {
  const btn = document.createElement('button'); btn.type = 'button'; btn.dataset.index = String(idx); btn.setAttribute('role', 'radio'); btn.setAttribute('aria-checked', 'false'); btn.tabIndex = idx === 0 ? 0 : -1;
  const pos = ringPosition(idx, total); btn.style.left = `${pos.left}%`; btn.style.top = `${pos.top}%`;
  btn.style.setProperty('--hue-a', palette[item.accent % palette.length]); btn.style.setProperty('--hue-b', palette[(item.accent + NUM.THREE) % palette.length]);
  btn.innerHTML = `<span>${item.title}</span><small>${item.summary}</small>`; btn.addEventListener('click', () => select(idx)); return btn;
};

const renderMedallions = () => { if (!state.ring) return; state.ring.innerHTML = ''; const total = medallions.length; medallions.forEach((item, idx) => state.ring.appendChild(buildButton(item, idx, total))); };

const renderOutlet = (item) => {
  // Outlet keeps calm textual summary plus optional iframe embed.
  if (!state.outlet || !item) return; const hasFrame = item.type === 'chapel' || item.type === 'lab';
  state.outlet.innerHTML = `<h4 id="medallion-outlet-title">${item.title}</h4><p>${item.summary}</p>${hasFrame ? `<iframe src="${item.src}" loading="lazy" title="${item.title} viewer" aria-describedby="medallion-outlet-title"></iframe>` : ''}`;
  const note = state.outlet.querySelector('p');
  if (item.type === 'chapel' && !item.loaded) fetchFromMap(`chapels/${item.id}/manifest.json`).then((manifest) => { if (manifest?.summary) { item.summary = manifest.summary; item.loaded = true; note.textContent = manifest.summary; } });
};

const select = (idx, pushRoute = true) => {
  if (!state.ring || idx === state.idx || idx < 0 || idx >= medallions.length) return;
  const prev = state.ring.querySelector('[aria-checked="true"]'); if (prev) { prev.setAttribute('aria-checked', 'false'); prev.tabIndex = -1; }
  const btn = state.ring.querySelector(`button[data-index="${idx}"]`); if (!btn) return; btn.setAttribute('aria-checked', 'true'); btn.tabIndex = 0; btn.focus({ preventScroll: true });
  state.idx = idx; renderOutlet(medallions[idx]); if (!pushRoute) return; const item = medallions[idx];
  if (item.type === 'chapel') location.hash = `#/chapels/${item.id}`; else if (item.type === 'lab') location.hash = `#/labs/${item.id}`; else location.hash = '#/medallions/save-endpoint';
};

const handleKey = (event) => {
  const moves = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }; if (event.key === 'Home') return event.preventDefault(), select(0);
  if (event.key === 'End') return event.preventDefault(), select(medallions.length - 1); if (!(event.key in moves)) return; event.preventDefault(); if (state.idx === -1) return;
  const next = (state.idx + moves[event.key] + medallions.length) % medallions.length; select(next);
};

const parseHash = () => { const parts = location.hash.slice(1).split('/').filter(Boolean); if (parts[0] === 'chapels' && parts[1]) return { type: 'chapel', id: parts[1] }; if (parts[0] === 'labs' && parts[1]) return { type: 'lab', id: parts[1] }; return null; };

const syncFromHash = () => { const info = parseHash(); if (!info) return state.idx === -1 && select(0); const idx = medallions.findIndex((m) => m.type === info.type && m.id === info.id); if (idx >= 0) select(idx, false); else renderOutlet({ title: 'Route not found', summary: 'This chamber is not wired yet.', type: 'note' }); };

const fetchFromMap = async (path) => {
  // Prefer submodule data (/cle) with fallback to in-repo /data assets.
  for (const entry of dataMap.paths || []) {
    try { const res = await fetch(`${entry.prefix}${path}`, { cache: 'no-store' }); if (res.ok) return await res.json(); } catch (err) { continue; }
  }
  return null;
};

const init = () => {
  if (state.ring) return; state.ring = document.querySelector('[data-medallion-ring]'); state.outlet = document.querySelector('[data-route-outlet]');
  if (!state.ring || !state.outlet) return; applyTheme(); state.ring.addEventListener('keydown', handleKey); renderMedallions(); syncFromHash(); window.addEventListener('hashchange', syncFromHash);
};

document.addEventListener('cathedral:ready', init);
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
