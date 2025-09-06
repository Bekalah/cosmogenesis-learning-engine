import { cfg, initCodex } from './codexConfig.js';

async function load() {
  const [stylepacks, angels, angels72, egregores, egregoresCore, tarotMajors, spiralMap] = await Promise.all([
let stylepacks = [];
let angels = [];
let angels72 = [];
let egregores = [];
let egregoresCore = [];
let tarotMajors = [];
let spiralMap = [];

async function load() {
  const [sp, an, an72, eg, egc, tm, sm] = await Promise.all([
    fetch('./data/stylepacks/stylepacks.json').then(r => r.json()),
    fetch('./data/angels.json').then(r => r.json()),
    fetch('./data/angels.72.json').then(r => r.json()),
    fetch('./data/egregores.json').then(r => r.json()),
    fetch('./data/egregores.core.json').then(r => r.json()),
    fetch('./data/tarot.majors.json').then(r => r.json()),
    fetch('./data/spiral_map.json').then(r => r.json())
  ]);

  initCodex({
    codex: '144:99',
    stylepacks,
    angels,
    angels72,
    egregores,
    egregoresCore,
    tarotMajors,
    spiralMap
  });

  stylepacks = sp;
  angels = an;
  angels72 = an72;
  egregores = eg;
  egregoresCore = egc;
  tarotMajors = tm;
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

export { cfg };
export const getStylepacks = () => cfg.stylepacks;
export const getAngels = () => cfg.angels;
export const getAngels72 = () => cfg.angels72;
export const getEgregores = () => cfg.egregores;
export const getEgregoresCore = () => cfg.egregoresCore;
export const getTarotMajors = () => cfg.tarotMajors;
export const getSpiralMap = () => cfg.spiralMap;
export const cfg = {};
export const getStylepacks = () => stylepacks;
export const getAngels = () => angels;
export const getAngels72 = () => angels72;
export const getEgregores = () => egregores;
export const getEgregoresCore = () => egregoresCore;
export const getTarotMajors = () => tarotMajors;
export const getSpiralMap = () => spiralMap;
