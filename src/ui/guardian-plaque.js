export default class GuardianPlaque {
  constructor() {
    this.el = document.createElement('div');
    this.el.style.position = 'fixed';
    this.el.style.top = '0';
    this.el.style.left = '0';
    this.el.style.right = '0';
    this.el.style.bottom = '0';
    this.el.style.display = 'flex';
    this.el.style.alignItems = 'center';
    this.el.style.justifyContent = 'center';
    this.el.style.background = 'rgba(0,0,0,0.8)';
    this.el.innerHTML = `<div role="dialog" aria-modal="true" style="background:#222;padding:1rem 2rem;border-radius:8px;color:#fff;max-width:90%;text-align:center"><p id="gp-msg"></p><button id="gp-close">Return</button></div>`;
    this.el.querySelector('#gp-close').addEventListener('click', () => this.close());
    this.el.addEventListener('keydown', e => { if (e.key === 'Escape') this.close(); });
  }
  open(text) {
    this.el.querySelector('#gp-msg').textContent = text;
    document.body.appendChild(this.el);
    this.el.querySelector('#gp-close').focus();
  }
  close() {
    this.el.remove();
  }
}
