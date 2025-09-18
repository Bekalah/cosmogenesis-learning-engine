(function () {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  let updateParallax = null;

  initCalmMode();
  setupParallax();
  hydrateNodes();

  function initCalmMode() {
    const toggle = doc.getElementById('calmToggle');
    const prefersReduced = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      root.classList.add('reduced-motion');
      if (toggle) toggle.setAttribute('aria-pressed', 'true');
    }

    if (toggle) {
      toggle.addEventListener('click', () => {
        const active = root.classList.toggle('reduced-motion');
        toggle.setAttribute('aria-pressed', String(active));
        if (typeof updateParallax === 'function') {
          updateParallax();
        }
      });
    }
  }

  function setupParallax() {
    const field = doc.querySelector('.field');
    if (!field || typeof window.requestAnimationFrame !== 'function') return;

    updateParallax = () => {
      if (root.classList.contains('reduced-motion')) {
        field.style.transform = '';
        return;
      }
      field.style.transform = `translateY(${window.scrollY * 0.5}px)`;
    };

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        updateParallax();
        ticking = false;
      });
    }, { passive: true });

    updateParallax();
  }

  function hydrateNodes() {
    const list = doc.getElementById('node-list');
    if (!list) return;

    const configBlock = doc.getElementById('brain-config');
    const fallbackBlock = doc.getElementById('nodes-fallback');
    const fallbackData = parseJson(fallbackBlock);
    const config = parseConfig(configBlock);

    const useNetwork = location.protocol === 'http:' || location.protocol === 'https:';
    const sourceUrl = resolveSource(config);

    if (useNetwork && sourceUrl) {
      fetch(sourceUrl, { cache: 'no-store' })
        .then((response) => response.ok ? response.json() : Promise.reject(new Error('bad status')))
        .then((nodes) => Array.isArray(nodes) ? populate(nodes) : Promise.reject(new Error('nodes must be array')))
        .catch(() => {
          if (Array.isArray(fallbackData)) {
            populate(fallbackData);
          } else {
            showMessage();
          }
        });
      return;
    }

    if (Array.isArray(fallbackData)) {
      populate(fallbackData);
    } else {
      showMessage();
    }

    function populate(nodes) {
      list.textContent = '';
      nodes.forEach((node) => {
        list.appendChild(createNodeCard(node));
      });
      if (!nodes.length) {
        showMessage();
      }
    }

    function showMessage() {
      list.textContent = '';
      const fallback = doc.createElement('article');
      fallback.className = 'collection-piece';
      fallback.textContent = 'Unable to load nodes right now.';
      list.appendChild(fallback);
    }
  }

  function parseJson(block) {
    if (!block) return null;
    try {
      const raw = block.textContent.trim();
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (error) {
      console.warn('nodes-fallback parse error', error);
      return null;
    }
  }

  function parseConfig(block) {
    if (!block) return null;
    const raw = block.textContent.trim();
    if (!raw) return null;
    const substituted = raw.replace(/location\.origin/g, JSON.stringify(location.origin));
    try {
      return JSON.parse(substituted);
    } catch (error) {
      console.warn('brain-config parse error', error);
      return null;
    }
  }

  function resolveSource(config) {
    if (!config || !config.path) return null;
    const base = typeof config.origin === 'string' && config.origin !== 'null' && config.origin !== ''
      ? config.origin
      : (location.origin && location.origin !== 'null' ? location.origin : location.href);
    try {
      return new URL(config.path, base).href;
    } catch (error) {
      console.warn('Unable to resolve node source', error);
      return null;
    }
  }

  function createNodeCard(node) {
    const card = doc.createElement('article');
    card.className = 'collection-piece';

    const title = doc.createElement('h3');
    title.textContent = String(node && (node.name || node.id || 'Node'));
    card.appendChild(title);

    const metaPieces = [];
    if (node && node.type) metaPieces.push(String(node.type));
    if (node && (typeof node.numerology === 'number' || node.numerology === 0)) {
      metaPieces.push(`Numerology: ${node.numerology}`);
    }
    if (metaPieces.length) {
      const meta = doc.createElement('p');
      meta.className = 'collection-description';
      meta.textContent = metaPieces.join(' • ');
      card.appendChild(meta);
    }

    if (node && node.lore) {
      const lore = doc.createElement('p');
      lore.className = 'collection-description';
      lore.textContent = String(node.lore);
      card.appendChild(lore);
    }

    if (node && node.lab) {
      const button = doc.createElement('button');
      button.type = 'button';
      button.textContent = 'Open Lab';
      button.addEventListener('click', () => {
        openLab(node.lab);
      });
      card.appendChild(button);
    }

    return card;
  }

  function openLab(href) {
    const baseOrigin = location.origin && location.origin !== 'null' ? location.origin : null;
    const base = baseOrigin || location.href;
    try {
      const target = new URL(String(href), base);
      const sameOrigin = baseOrigin ? target.origin === baseOrigin : target.protocol === location.protocol;
      if (!sameOrigin) return;
      const win = window.open(target.href, '_blank', 'noopener,noreferrer');
      if (win) win.opener = null;
    } catch (error) {
      console.warn('Invalid lab URL', href, error);
    }
  }
})();
