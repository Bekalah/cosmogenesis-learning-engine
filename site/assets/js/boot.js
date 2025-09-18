const docEl = document.documentElement;

async function loadNodes() {
  try {
    const res = await fetch('/data/nodes.json', { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('netfail');
    }
    const nodes = await res.json();
    if (Array.isArray(nodes)) {
      return nodes;
    }
    throw new Error('shape');
  } catch (error) {
    const fallback = document.getElementById('nodes-fallback');
    if (!fallback) {
      return [];
    }
    try {
      return JSON.parse(fallback.textContent || '[]');
    } catch (parseError) {
      return [];
    }
  }
}

function clearChildren(el) {
  if (!el) {
    return;
  }
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

function createNodeCard(node) {
  const item = document.createElement('li');
  item.className = 'node-card';

  const title = document.createElement('h3');
  title.className = 'node-card-title';
  title.textContent = node && node.name ? String(node.name) : 'Unnamed Node';
  item.appendChild(title);

  const meta = document.createElement('p');
  meta.className = 'node-card-meta';
  const metaParts = [];
  if (node && node.id) {
    metaParts.push(`#${String(node.id)}`);
  }
  if (node && node.type) {
    metaParts.push(String(node.type));
  }
  if (node && typeof node.numerology !== 'undefined') {
    metaParts.push(`No.${node.numerology}`);
  }
  meta.textContent = metaParts.join(' • ');
  item.appendChild(meta);

  if (node && node.lore) {
    const lore = document.createElement('p');
    lore.className = 'node-card-lore';
    lore.textContent = String(node.lore);
    item.appendChild(lore);
  }

  if (node && node.lab) {
    const actions = document.createElement('div');
    actions.className = 'node-card-actions';
    const link = document.createElement('a');
    link.className = 'node-card-link';
    link.textContent = 'Open Lab';
    try {
      const labUrl = new URL(String(node.lab), window.location.origin);
      link.href = labUrl.href;
      if (labUrl.origin !== window.location.origin) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
    } catch (urlError) {
      link.href = String(node.lab);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
    actions.appendChild(link);
    item.appendChild(actions);
  }

  return item;
}

function renderNodes(nodes, listEl, loaderEl) {
  if (!listEl) {
    return;
  }
  clearChildren(listEl);

  if (!Array.isArray(nodes) || nodes.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'node-empty';
    empty.textContent = 'Node atlas offline. Using safe fallback.';
    listEl.appendChild(empty);
    if (loaderEl) {
      loaderEl.setAttribute('hidden', '');
    }
    return;
  }

  nodes.forEach((node) => {
    listEl.appendChild(createNodeCard(node));
  });

  if (loaderEl) {
    loaderEl.setAttribute('hidden', '');
  }
}

function initCalmMode(calmBtn) {
  const prefersReduced = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;

  const setState = (active) => {
    docEl.classList.toggle('reduced-motion', active);
    if (calmBtn) {
      calmBtn.setAttribute('aria-pressed', String(active));
    }
    try {
      const detail = { active };
      document.dispatchEvent(new CustomEvent('calm-mode-change', { detail }));
    } catch (eventError) {
      // CustomEvent may not exist in very old browsers; ignore gracefully.
    }
  };

  if (prefersReduced && prefersReduced.matches) {
    setState(true);
  } else {
    setState(docEl.classList.contains('reduced-motion'));
  }

  const handlePreferenceChange = (event) => {
    setState(event.matches);
  };

  if (prefersReduced) {
    if (typeof prefersReduced.addEventListener === 'function') {
      prefersReduced.addEventListener('change', handlePreferenceChange);
    } else if (typeof prefersReduced.addListener === 'function') {
      prefersReduced.addListener(handlePreferenceChange);
    }
  }

  calmBtn?.addEventListener('click', () => {
    const next = !docEl.classList.contains('reduced-motion');
    setState(next);
  });
}

function initRouting() {
  const links = document.querySelectorAll('a[data-route]');
  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href.charAt(0) !== '#') {
        return;
      }
      const target = document.querySelector(href);
      if (!target) {
        return;
      }
      event.preventDefault();
      target.scrollIntoView({
        behavior: docEl.classList.contains('reduced-motion') ? 'auto' : 'smooth',
        block: 'start'
      });
    });
  });
}

function initParallax() {
  const canvas = document.querySelector('.geometric-canvas');
  if (!canvas) {
    return;
  }
  let ticking = false;
  const update = () => {
    if (docEl.classList.contains('reduced-motion')) {
      canvas.style.transform = '';
      ticking = false;
      return;
    }
    const offset = window.scrollY * 0.5;
    canvas.style.transform = `translateY(${offset}px)`;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
  document.addEventListener('calm-mode-change', update);
  update();
}

function initPalette() {
  const palette = document.getElementById('palette');
  const readout = document.getElementById('freqReadout');
  if (!palette || !readout) {
    return;
  }
  palette.addEventListener('click', (event) => {
    const swatch = event.target.closest('.color-swatch');
    if (!swatch) {
      return;
    }
    const hz = swatch.getAttribute('data-freq') || '432';
    readout.textContent = `${hz} Hz`;
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const calmBtn = document.getElementById('calmToggle');
  const nodeList = document.getElementById('node-list');
  const loader = document.getElementById('node-loader');

  initCalmMode(calmBtn);
  initRouting();
  initParallax();
  initPalette();

  try {
    const nodes = await loadNodes();
    renderNodes(nodes, nodeList, loader);
  } catch (error) {
    renderNodes([], nodeList, loader);
  }
});
