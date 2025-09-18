/*
  node-renderer.mjs
  Renders calm, text-first summaries of sephirot nodes and atelier modules.
  Keeps DOM updates deterministic so offline viewing never flashes.
*/

export const FALLBACK_SEPHIROT = [
  { id: "kether", emoji: "👑", title: "Kether", meaning: "Crown" },
  { id: "chokmah", emoji: "🔮", title: "Chokmah", meaning: "Wisdom" },
  { id: "binah", emoji: "🌙", title: "Binah", meaning: "Understanding" },
  { id: "chesed", emoji: "💙", title: "Chesed", meaning: "Mercy" },
  { id: "geburah", emoji: "🔥", title: "Geburah", meaning: "Severity" },
  { id: "tiphareth", emoji: "☀️", title: "Tiphareth", meaning: "Beauty" },
  { id: "netzach", emoji: "🌿", title: "Netzach", meaning: "Victory" },
  { id: "hod", emoji: "📖", title: "Hod", meaning: "Glory" },
  { id: "yesod", emoji: "🌛", title: "Yesod", meaning: "Foundation" },
  { id: "malkuth", emoji: "🌍", title: "Malkuth", meaning: "Kingdom" }
];

export const FALLBACK_MODULES = [
  {
    id: "cosmogenesis",
    symbol: "🌌",
    title: "Cosmogenesis Patterns",
    summary: "Sacred geometry and cosmology research briefs tuned for ND cognition.",
    tags: ["Geometry", "Myth", "ND-safe"]
  },
  {
    id: "harmonic-research",
    symbol: "🎵",
    title: "Harmonic Resonance Lab",
    summary: "Solfeggio, Schumann, and planetary frequency experiments with calm audio loops.",
    tags: ["Frequency", "432 Hz", "Healing"]
  }
];

export function renderSephirotList(container, records) {
  if (!isElement(container)) {
    return { count: 0, usedFallback: true };
  }

  const nodes = Array.isArray(records) && records.length > 0 ? records : FALLBACK_SEPHIROT;
  const usedFallback = nodes === FALLBACK_SEPHIROT;

  replaceChildren(container, nodes.map(createSephirotItem));
  return { count: nodes.length, usedFallback };
}

export function renderModuleGrid(container, records) {
  if (!isElement(container)) {
    return { count: 0, usedFallback: true };
  }

  const modules = Array.isArray(records) && records.length > 0 ? records : FALLBACK_MODULES;
  const usedFallback = modules === FALLBACK_MODULES;

  replaceChildren(container, modules.map(createModuleCard));
  return { count: modules.length, usedFallback };
}

function createSephirotItem(record) {
  const item = document.createElement("li");
  item.className = "feature-item";

  const badge = document.createElement("span");
  badge.className = "feature-emoji";
  badge.textContent = record.emoji || "✶";

  const title = document.createElement("strong");
  title.className = "feature-title";
  title.textContent = record.title || record.id;

  const meaning = document.createElement("span");
  meaning.className = "feature-meaning";
  meaning.textContent = record.meaning || "";

  item.append(badge, title, meaning);
  return item;
}

function createModuleCard(record) {
  const article = document.createElement("article");
  article.className = "card";
  article.setAttribute("role", "listitem");

  const title = document.createElement("h3");
  title.textContent = `${record.symbol || "✶"} ${record.title || record.id}`;

  const summary = document.createElement("p");
  summary.textContent = record.summary || "Layered research capsule.";

  article.append(title, summary);

  if (Array.isArray(record.tags) && record.tags.length > 0) {
    const tagList = document.createElement("ul");
    tagList.className = "tag-list";
    record.tags.forEach((tag) => {
      const li = document.createElement("li");
      li.textContent = tag;
      tagList.appendChild(li);
    });
    article.appendChild(tagList);
  }

  return article;
}

function replaceChildren(container, nodes) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  nodes.forEach((node) => {
    container.appendChild(node);
  });
}

function isElement(candidate) {
  return typeof Element !== "undefined" && candidate instanceof Element;
}
