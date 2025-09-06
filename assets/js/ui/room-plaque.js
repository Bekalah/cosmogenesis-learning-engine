// Room Plaque component: renders museum-style plaque fields
// data: {intention, technique, lineage, evidence, reflection}
export function renderRoomPlaque(mount, data = {}) {
  const el = typeof mount === 'string' ? document.querySelector(mount) : mount;
  if (!el) return;
  el.classList.add('room-plaque');
  const fields = ['intention','technique','lineage','evidence','reflection'];
  const frag = document.createDocumentFragment();
  fields.forEach(key => {
    if (!data[key]) return;
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = key.charAt(0).toUpperCase() + key.slice(1) + ': ';
    p.appendChild(strong);
    p.append(data[key]);
    frag.appendChild(p);
  });
  el.innerHTML = '';
  el.appendChild(frag);
}

export default { renderRoomPlaque };
