import { playTone } from "../helpers/cathedral-helper.ts";

// Simple plaque showing glyph and playing a tone on click.
export class CathedralPlaque extends HTMLElement {
  glyph = "";
  toneHz = 440;

  connectedCallback() {
    this.glyph = this.getAttribute("glyph") || "";
    this.toneHz = Number(this.getAttribute("tone-hz")) || 440;
    this.setAttribute("role", "button");
    this.setAttribute("tabindex", "0");
    this.innerHTML = `<div class="plaque">${this.glyph}</div>`;
    this.addEventListener("click", () => playTone(this.toneHz));
    this.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") playTone(this.toneHz);
    });
  }
}

customElements.define("cathedral-plaque", CathedralPlaque);
