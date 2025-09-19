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

/**
 * Render a list of sephirot items into a DOM container.
 *
 * If `records` is a non-empty array it will be rendered; otherwise the module's
 * FALLBACK_SEPHIROT data is used. If `container` is not a DOM Element the
 * function returns immediately with count 0 and `usedFallback: true`.
 *
 * @param {Element} container - Target DOM element that will receive the rendered items.
 * @param {Array<Object>} [records] - Optional array of sephirot records to render; each record
 *   may contain { id, emoji, title, meaning }.
 * @return {{count: number, usedFallback: boolean}} Object with the number of items rendered and
 *   a flag indicating whether fallback data was used.
 */
export function renderSephirotList(container, records) {
  if (!isElement(container)) {
    return { count: 0, usedFallback: true };
  }

  const nodes = Array.isArray(records) && records.length > 0 ? records : FALLBACK_SEPHIROT;
  const usedFallback = nodes === FALLBACK_SEPHIROT;

  replaceChildren(container, nodes.map(createSephirotItem));
  return { count: nodes.length, usedFallback };
}

/**
 * Render a grid of module cards into the given container element.
 *
 * If `records` is a non-empty array it is rendered; otherwise a built-in fallback
 * module list is used. The container's existing children are synchronously
 * replaced with the generated module card elements.
 *
 * @param {Element} container - Destination DOM element for the module grid. If not a DOM Element the function returns { count: 0, usedFallback: true } and makes no DOM changes.
 * @param {Array<Object>} [records] - Optional array of module records to render. Each record may include { id, symbol, title, summary, tags }.
 * @returns {{ count: number, usedFallback: boolean }} Number of rendered modules and whether the fallback dataset was used.
 */
export function renderModuleGrid(container, records) {
  if (!isElement(container)) {
    return { count: 0, usedFallback: true };
  }

  const modules = Array.isArray(records) && records.length > 0 ? records : FALLBACK_MODULES;
  const usedFallback = modules === FALLBACK_MODULES;

  replaceChildren(container, modules.map(createModuleCard));
  return { count: modules.length, usedFallback };
}

/**
 * Create a list-item DOM node representing a sephirot entry (emoji, title, meaning).
 * @param {{id?: string, emoji?: string, title?: string, meaning?: string}} record - Data for the item; `emoji` falls back to "✶", `title` falls back to `id`, and `meaning` falls back to an empty string.
 * @return {HTMLLIElement} A constructed `<li>` element with class "feature-item" containing children with classes "feature-emoji", "feature-title", and "feature-meaning".
 */
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

/**
 * Build a DOM card element representing a module record.
 *
 * The returned <article> has class "card" and role "listitem", contains an H3 title
 * (uses `record.symbol` or "✶" plus `record.title` or `record.id`), a paragraph
 * with `record.summary` (falls back to "Layered research capsule."), and — if
 * `record.tags` is a non-empty array — a UL.tag-list with each tag as an LI.
 *
 * @param {Object} record - Module data.
 * @param {string} [record.id] - Identifier used when `title` is missing.
 * @param {string} [record.symbol] - Symbol prefix for the title.
 * @param {string} [record.title] - Human-readable title.
 * @param {string} [record.summary] - Short summary shown in the card.
 * @param {string[]} [record.tags] - Optional list of tag strings; rendered as a tag list when non-empty.
 * @return {HTMLElement} The constructed article element ready to be inserted into the DOM.
 */
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

/**
 * Replace all children of a container with the provided nodes.
 *
 * Clears every existing child node from the container, then appends each node
 * from `nodes` in order. Nodes are moved into the container (not cloned).
 *
 * @param {Element} container - The DOM element whose children will be replaced.
 * @param {Iterable<Node>} nodes - Iterable of DOM nodes to append as the new children.
 */
function replaceChildren(container, nodes) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  nodes.forEach((node) => {
    container.appendChild(node);
  });
}

/**
 * Checks whether a value is a DOM Element.
 *
 * Safely returns true only if the global `Element` constructor exists and `candidate`
 * is an instance of `Element`. Returns false in non-DOM or non-browser environments.
 *
 * @param {*} candidate - Value to test.
 * @return {boolean} True if `candidate` is a DOM Element, otherwise false.
 */
function isElement(candidate) {
  return typeof Element !== "undefined" && candidate instanceof Element;
}
