export default class ThemeEngine {
  constructor(stylepacks) {
    this.packs = stylepacks;
  }
  getPalette(id) {
    return this.packs.find(p => p.id === id)?.palette;
  }
  applyToElement(el, id) {
    const pal = this.getPalette(id);
    if (!pal) return;
    el.style.setProperty('--ink', pal.ink);
    el.style.setProperty('--wash', pal.wash);
    el.style.setProperty('--accent', pal.accent);
    el.style.setProperty('--gold', pal.gold);
    document.dispatchEvent(new CustomEvent('theme:change', { detail: { id } }));
  }
}
