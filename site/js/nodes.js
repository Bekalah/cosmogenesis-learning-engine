(function(){
  const list = document.getElementById('node-list');
  if (!list) return;

  function createNodeCard(node){
    const card = document.createElement('article');
    card.className = 'card';
    const h = document.createElement('h3'); h.textContent = String(node.name ?? node.id ?? '');
    const p = document.createElement('p'); p.textContent = `${node.type ?? ''} • Numerology: ${node.numerology ?? ''}`;
    const lore = document.createElement('p'); lore.textContent = String(node.lore ?? '');
    card.append(h,p,lore);
    if (node.lab){
      const btn = document.createElement('button');
      btn.type = 'button'; btn.textContent = 'Open Lab'; btn.dataset.lab = String(node.lab);
      btn.addEventListener('click', () => {
        const href = btn.getAttribute('data-lab') || '';
        try {
          const u = new URL(href, location.origin);
          if (u.origin !== location.origin) return; // same-origin only
          const w = window.open(u.href, '_blank', 'noopener,noreferrer');
          if (w) w.opener = null;
        } catch(e){ console.warn('Invalid lab URL:', href); }
      });
      card.appendChild(btn);
    }
    return card;
  }

  function populate(nodes){
    list.textContent = '';
    nodes.forEach(n => list.appendChild(createNodeCard(n)));
  }

  // Try HTTP(S) fetch; otherwise use inline <script type="application/json" id="nodes-data">
  const onHttp = location.protocol === 'http:' || location.protocol === 'https:';
  if (onHttp){
    fetch('./data/nodes.json', { cache:'no-store' })
      .then(r => r.ok ? r.json() : Promise.reject(new Error('bad status')))
      .then(nodes => Array.isArray(nodes) ? populate(nodes) : Promise.reject(new Error('nodes.json must be an array')))
      .catch(err => { console.error(err); fallback(); });
  } else {
    fallback();
  }

  function fallback(){
    const block = document.getElementById('nodes-data');
    if (!block) { list.className='card'; list.textContent='Unable to load nodes right now.'; return; }
    try {
      const data = JSON.parse(block.textContent || '[]');
      if (Array.isArray(data)) populate(data); else throw new Error('inline nodes must be array');
    } catch(err){
      console.error(err);
      list.className='card';
      list.textContent='Unable to load nodes right now.';
    }
  }
})();
