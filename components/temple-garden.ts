// Placeholder garden component; could render crystals or plants later.
export class TempleGarden extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<div class="garden" aria-label="Temple garden">🜃 Garden</div>`;
  }
}

customElements.define("temple-garden", TempleGarden);
