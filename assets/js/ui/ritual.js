// Ritual component: renders a simple ordered list of steps
// exportable for any realm page
export function initRitual(mount, steps = []) {
  const el = typeof mount === 'string' ? document.querySelector(mount) : mount;
  if (!el) return;
  el.innerHTML = '';
  const list = document.createElement('ol');
  list.className = 'ritual-steps';
  steps.forEach((step, i) => {
    const li = document.createElement('li');
    li.textContent = step;
    list.appendChild(li);
  });
  el.appendChild(list);
}

export default { initRitual };
