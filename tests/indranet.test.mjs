import { IndraNet } from "../app/engines/IndraNet.js";

// Minimal DOM stub so IndraNet can mount and render in Node
function createElementNS(ns, tag) {
  return {
    tagName: tag,
    attrs: {},
    children: [],
    style: {},
    setAttribute(key, value) { this.attrs[key] = value; },
    appendChild(child) { this.children.push(child); },
    removeChild(child) {
      const i = this.children.indexOf(child);
      if (i >= 0) this.children.splice(i, 1);
    },
    get firstChild() { return this.children[0] || null; }
  };
}

globalThis.document = { createElementNS };

const container = {
  children: [],
  innerHTML: "",
  appendChild(el) { this.children.push(el); }
};

const lattice = { rings: 2, nodes_per_ring: 3 };
const net = new IndraNet({ showLinks: false, palette: { bg: "#123", node: "#fff", link: "#000" }, radius: 60, nodeSize: 5 });
net.network = { lattice };

net.mount(container).render();

if (container.children.length !== 1) {
  throw new Error("SVG container not mounted");
}
const svg = container.children[0];
if (svg.style.background !== "#123") {
  throw new Error("Palette background not applied");
}
if (svg.children.length !== lattice.rings * lattice.nodes_per_ring) {
  throw new Error("Graph node count mismatch");
}

console.log("IndraNet graph construction OK");
