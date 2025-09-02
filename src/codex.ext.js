let stylepacks = [];
let angels = [];
let egregores = [];
let spiralMap = [];

async function load() {
  const [sp, an, eg, sm] = await Promise.all([
    fetch('./data/stylepacks/stylepacks.json').then(r => r.json()),
    fetch('./data/angels.json').then(r => r.json()),
    fetch('./data/egregores.json').then(r => r.json()),
    fetch('./data/spiral_map.json').then(r => r.json())
  ]);
  stylepacks = sp;
  angels = an;
  egregores = eg;
  spiralMap = sm;
  document.documentElement.dataset.nd = 'safe';
  if (!localStorage.getItem('cosmo:v1:first')) {
    const banner = document.createElement('div');
    banner.textContent = 'ND-safe data loaded';
    banner.style.position = 'fixed';
    banner.style.top = '10px';
    banner.style.right = '10px';
    banner.style.background = '#0008';
    banner.style.color = '#fff';
    banner.style.padding = '4px 8px';
    document.body.appendChild(banner);
    setTimeout(() => banner.remove(), 3000);
    localStorage.setItem('cosmo:v1:first', '1');
  }
}

await load();

export const cfg = {};
export const getStylepacks = () => stylepacks;
export const getAngels = () => angels;
export const getEgregores = () => egregores;
export const getSpiralMap = () => spiralMap;
