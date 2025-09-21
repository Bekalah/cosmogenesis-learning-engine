import paletteData from '../../palettes/thelemic_letters.json' assert { type: 'json' };

const pathIndex = new Map((paletteData.paths || []).map((p) => [p.letter, p]));
const fallbackNodes = Array.isArray(paletteData.chapels) ? paletteData.chapels : [];
let labEventsBound = false;

function createResourceGroup(label, items) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }
  const group = document.createElement('div');
  group.className = 'resource-group';

  const heading = document.createElement('h3');
  heading.textContent = label;
  group.appendChild(heading);

  const list = document.createElement('ul');
  list.className = 'resource-list';

  for (const entry of items) {
    const li = document.createElement('li');
    if (entry && typeof entry === 'object') {
      const title = typeof entry.title === 'string' && entry.title.trim().length > 0
        ? entry.title.trim()
        : (entry.href || 'Untitled resource');
      if (entry.href) {
        const anchor = document.createElement('a');
        anchor.href = entry.href;
        anchor.textContent = title;
        anchor.rel = 'noopener noreferrer';
        li.appendChild(anchor);
      } else {
        li.textContent = title;
      }
    } else {
      li.textContent = String(entry);
    }
    list.appendChild(li);
  }

  group.appendChild(list);
  return group;
}

export function paintChapel(el, thelemicPath) {
  const p = pathIndex.get(thelemicPath);
  if (!p) {
    return;
  }
  el.style.setProperty('--path-primary', p.primary);
  el.style.setProperty('--path-secondary', p.secondary);
  el.style.setProperty('--vesica-a', (p.accents && p.accents[0]) ? p.accents[0] : `${p.primary}20`);
  el.style.setProperty('--vesica-b', (p.accents && p.accents[1]) ? p.accents[1] : `${p.secondary}20`);
  el.classList.add('vesica-bg', 'tarot-overlay', 'aurora');
}

function createChapel(node) {
  const card = document.createElement('section');
  card.className = 'chapel';
  card.setAttribute('role', 'listitem');

  const header = document.createElement('header');
  const title = document.createElement('h2');
  title.textContent = node.name || node.id || 'Unnamed Chapel';
  header.appendChild(title);

  if (node.thelemicPath) {
    const pathLabel = document.createElement('p');
    pathLabel.className = 'path-label';
    pathLabel.textContent = `Path ${node.thelemicPath}`;
    header.appendChild(pathLabel);
  }

  card.appendChild(header);

  if (node.lore) {
    const lore = document.createElement('p');
    lore.className = 'lore';
    lore.textContent = node.lore;
    card.appendChild(lore);
  }

  const curriculum = createResourceGroup('Curriculum', node.curriculum);
  if (curriculum) {
    card.appendChild(curriculum);
  }

  const protocol = createResourceGroup('Lab Protocol', node.labProtocol);
  if (protocol) {
    card.appendChild(protocol);
  }

  const assets = createResourceGroup('Assets', node.assets);
  if (assets) {
    card.appendChild(assets);
  }

  if (node.lab) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'open-lab';
    btn.dataset.lab = node.lab;
    btn.textContent = 'Enter Lab';
    card.appendChild(btn);
  }

  paintChapel(card, node.thelemicPath);
  return card;
}

function handleLabClick(event) {
  const button = event.target.closest('.open-lab');
  if (!button) {
    return;
  }
  const href = button.getAttribute('data-lab') || '';
  if (!href) {
    return;
  }
  try {
    const base = document.baseURI || window.location.href;
    const target = new URL(href, base);
    const origin = window.location.origin;
    const allow = origin && origin !== 'null'
      ? target.origin === origin
      : target.protocol === 'file:';
    if (!allow) {
      return;
    }
    // ND-safe: open in new tab without opener to avoid navigation surprises.
    const win = window.open(target.href, '_blank', 'noopener,noreferrer');
    if (win) {
      win.opener = null;
    }
  } catch (err) {
    console.error('Unable to open lab', err);
  }
}

export async function hydrateNodes() {
  const root = document.getElementById('node-list');
  if (!root) {
    return;
  }

  let nodes = fallbackNodes;

  try {
    const response = await fetch('data/nodes.json', { cache: 'no-store' });
    if (response.ok) {
      const payload = await response.json();
      if (Array.isArray(payload) && payload.length > 0) {
        nodes = payload;
      }
    }
  } catch (err) {
    console.warn('Using embedded chapel dataset because nodes.json is offline.', err);
  }

  root.textContent = '';

  if (!Array.isArray(nodes) || nodes.length === 0) {
    const note = document.createElement('p');
    note.className = 'loading-note';
    note.textContent = 'Node data offline. Chapel index will sync when the Codex is connected.';
    root.appendChild(note);
    return;
  }

  const list = document.createDocumentFragment();
  for (const node of nodes) {
    list.appendChild(createChapel(node));
  }
  root.appendChild(list);

  if (!labEventsBound) {
    root.addEventListener('click', handleLabClick);
    labEventsBound = true;
  }
}

function setupCalmModeToggle() {
  const toggle = document.getElementById('calmToggle');
  if (!toggle) {
    return;
  }
  let active = false;

  const apply = (state) => {
    const body = document.body;
    body.classList.toggle('is-calm', state);
    body.classList.toggle('reduced-motion', state);
    toggle.setAttribute('aria-pressed', state ? 'true' : 'false');
    toggle.textContent = state ? 'Calm Mode: On' : 'Calm Mode';
  };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) {
    active = true;
    apply(active);
  }

  const motionHandler = (event) => {
    if (event.matches) {
      active = true;
      apply(active);
    }
  };

  if (typeof prefersReducedMotion.addEventListener === 'function') {
    prefersReducedMotion.addEventListener('change', motionHandler);
  } else if (typeof prefersReducedMotion.addListener === 'function') {
    prefersReducedMotion.addListener(motionHandler);
  }

  toggle.addEventListener('click', () => {
    active = !active;
    apply(active);
  });
}

function init() {
  hydrateNodes();
  setupCalmModeToggle();
}

document.addEventListener('DOMContentLoaded', init);
