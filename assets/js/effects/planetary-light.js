// Planetary Light effect: tint vitrail overlays with planetary colors
export function applyPlanetaryLight({ selector = '.overlay-vitrail', colors } = {}) {
  const el = document.querySelector(selector);
  if (!el) return;
  const palette = colors || ['#f9d71c','#c0c0c0','#f4a460','#fdd017','#6a0dad','#ff4500','#00bfff'];
  const day = new Date().getDay();
  const color = palette[day % palette.length];
  el.style.mixBlendMode = 'overlay';
  el.style.pointerEvents = 'none';
  el.style.background = `radial-gradient(circle at center, ${color}, transparent)`;
}

document.addEventListener('DOMContentLoaded', () => applyPlanetaryLight());

export default { applyPlanetaryLight };
