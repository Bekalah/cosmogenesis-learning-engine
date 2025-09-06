export default function initFontSelector() {
  const select = document.getElementById('font-selector');
  if (!select) return;

  const fonts = {
    default: { name: 'Default', body: 'system-ui, sans-serif', heading: "'Cinzel', serif" },
    greek: { name: 'Greek Codex', body: "'GFS Didot', 'Times New Roman', serif", heading: "'EB Garamond', serif" },
    druid: { name: 'Druid Grove', body: "'IM Fell English', serif", heading: "'Cinzel Decorative', serif" },
    japanese: { name: 'Japanese Angelic', body: "'Noto Serif JP', serif", heading: "'Noto Serif JP', serif" }
  };

  Object.entries(fonts).forEach(([id, f]) => {
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = f.name;
    select.appendChild(opt);
  });

  function applyFont(id) {
    const f = fonts[id] || fonts.default;
    const root = document.documentElement;
    root.style.setProperty('--font-body', f.body);
    root.style.setProperty('--font-heading', f.heading);
  }

  const stored = localStorage.getItem('cosmo:v1:font') || 'default';
  select.value = stored;
  applyFont(stored);

  select.addEventListener('change', e => {
    const id = e.target.value;
    applyFont(id);
    localStorage.setItem('cosmo:v1:font', id);
  });
}
