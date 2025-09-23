import { validateInterface } from "../engines/interface-guard.js";
import { composeView } from "../engines/merge-view.js";
import { Safety } from "../ui/safety.js";
import {
  fetchCodexNodes,
  fetchRealmLinks,
  ensureServiceWorker,
} from "./system-status.js";

const statusEl = document.getElementById("status");
const motionSel = document.getElementById("motion");
const autoChk = document.getElementById("autoplay");
const contrastSel = document.getElementById("contrast");
const aboutBtn = document.getElementById("about-btn");
const aboutDialog = document.getElementById("about-dialog");
const aboutClose = document.getElementById("about-close");
const codexStatusEl = document.getElementById("codex-status");
const swStatusEl = document.getElementById("sw-status");
const realmLinksEl = document.getElementById("realm-links");
const appsGridEl = document.getElementById("apps-grid");
const appsSummaryEl = document.getElementById("apps-summary");

const appCardIndex = new Map();
let currentApps = [];

const DEFAULT_APPS = [
  {
    id: "cosmogenesis-learning-engine",
    title: "Cosmogenesis Learning Engine",
    role: "Hub / Mind Registry",
    summary: "Master hub with ND-safe toggles and codex sync.",
    url: "https://cosmogenesis-learning-engine.fly.dev/",
    health: "https://cosmogenesis-learning-engine.fly.dev/core/health-check.html",
    links: [
      { label: "Open hub", href: "https://cosmogenesis-learning-engine.fly.dev/" },
      { label: "Health", href: "https://cosmogenesis-learning-engine.fly.dev/core/health-check.html" },
    ],
  },
  {
    id: "circuitum99",
    title: "Circuitum 99",
    role: "Story Spine / Guardians",
    summary: "Interactive spine with guardians and ND-safe rituals.",
    url: "https://circuitum99.fly.dev/",
    health: "https://circuitum99.fly.dev/core/health-check.html",
    links: [
      { label: "Launch", href: "https://circuitum99.fly.dev/" },
      { label: "Health", href: "https://circuitum99.fly.dev/core/health-check.html" },
    ],
  },
  {
    id: "stone-cathedral",
    title: "Stone Cathedral",
    role: "Rooms Atlas / Museum",
    summary: "Cathedral atlas with provenance-safe walkthroughs.",
    url: "https://stone-cathedral.fly.dev/",
    health: "https://stone-cathedral.fly.dev/core/health-check.html",
    links: [
      { label: "Open atlas", href: "https://stone-cathedral.fly.dev/" },
      { label: "Health", href: "https://stone-cathedral.fly.dev/core/health-check.html" },
    ],
  },
  {
    id: "liber-arcanae",
    title: "Liber Arcanae",
    role: "Tarot Companions",
    summary: "Tarot compendium with ND-safe overlays.",
    url: "https://liber-arcanae.fly.dev/",
    health: "https://liber-arcanae.fly.dev/core/health-check.html",
    links: [
      { label: "Visit", href: "https://liber-arcanae.fly.dev/" },
      { label: "Health", href: "https://liber-arcanae.fly.dev/core/health-check.html" },
    ],
  },
  {
    id: "cosmic-helix",
    title: "Cosmic Helix",
    role: "Static Renderer",
    summary: "Offline vesica + helix canvas for palette study.",
    url: "https://cosmic-helix.fly.dev/",
    health: "https://cosmic-helix.fly.dev/core/health-check.html",
    links: [
      { label: "Renderer", href: "https://cosmic-helix.fly.dev/" },
      { label: "Health", href: "https://cosmic-helix.fly.dev/core/health-check.html" },
    ],
  },
];

function applySafety() {
  Safety.state.motion = motionSel.value;
  Safety.state.autoplay = autoChk.checked;
  Safety.state.contrast = contrastSel.value;
  Safety.apply();
}

[motionSel, autoChk, contrastSel].forEach((el) =>
  el.addEventListener("input", applySafety),
);
applySafety();

const dialogSupported =
  typeof aboutDialog?.showModal === "function" &&
  typeof aboutDialog?.close === "function";

function openAbout() {
  if (!aboutDialog) return;
  if (dialogSupported) {
    aboutDialog.showModal();
  } else {
    aboutDialog.setAttribute("open", "");
  }
}

function closeAbout() {
  if (!aboutDialog) return;
  if (dialogSupported && aboutDialog.hasAttribute("open")) {
    aboutDialog.close();
  } else {
    aboutDialog.removeAttribute("open");
  }
}

aboutBtn?.addEventListener("click", openAbout);
aboutClose?.addEventListener("click", closeAbout);
aboutDialog?.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeAbout();
});

function updateCodexStatus(result) {
  if (!codexStatusEl) return;
  codexStatusEl.textContent = result.message;
  if (result.ok) {
    codexStatusEl.removeAttribute("data-state");
  } else {
    codexStatusEl.dataset.state = "warn";
  }
}

function updateServiceWorkerStatus(result) {
  if (!swStatusEl) return;
  if (result.ok) {
    const ver = result.version ? `version ${result.version}` : "online";
    swStatusEl.textContent = `Active (${ver})`;
    swStatusEl.removeAttribute("data-state");
  } else {
    swStatusEl.textContent = result.reason || "Service worker unavailable.";
    swStatusEl.dataset.state = "warn";
  }
}

function paintRealmLinks(result) {
  if (!realmLinksEl) return;
  realmLinksEl.textContent = "";
  if (!result.ok || !Array.isArray(result.links) || result.links.length === 0) {
    const li = document.createElement("li");
    li.textContent = result.message || "Realm links offline.";
    realmLinksEl.appendChild(li);
    return;
  }
  for (const link of result.links) {
    const li = document.createElement("li");
    const title = link.title || link.id || link.href || "Realm";
    const anchor = document.createElement("a");
    if (link.href) anchor.href = link.href;
    anchor.textContent = title;
    if (link.href && /^https?:/i.test(link.href)) {
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
    }
    li.appendChild(anchor);
    if (link.summary) {
      const summary = document.createElement("p");
      summary.textContent = link.summary;
      summary.style.margin = "4px 0 0";
      summary.style.fontSize = "12px";
      summary.style.color = "var(--muted)";
      li.appendChild(summary);
    }
    realmLinksEl.appendChild(li);
  }
}

function normalizeApp(entry) {
  if (!entry || typeof entry !== "object") return null;
  const links = Array.isArray(entry.links) ? [...entry.links] : [];
  if (links.length === 0 && entry.url) {
    links.push({ label: "Open", href: String(entry.url) });
  }
  if (entry.health && !links.some((link) => link && link.href === entry.health)) {
    links.push({ label: "Health", href: String(entry.health) });
  }
  const normalizedLinks = links
    .map((link) => {
      if (!link || !link.href) return null;
      return {
        label: link.label ? String(link.label) : "Open",
        href: String(link.href),
      };
    })
    .filter((link) => Boolean(link));
  const app = {
    id: String(entry.id || entry.title || "service"),
    title: String(entry.title || entry.id || "Service"),
    role: String(entry.role || "Service"),
    summary: entry.summary ? String(entry.summary) : "",
    health: String(entry.health || ""),
    links: normalizedLinks,
  };
  if (!app.health) return null;
  return app;
}

async function loadConfiguredApps() {
  if (!appsGridEl) return [];
  try {
    const res = await fetch("./core/apps.json", { cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    const payload = await res.json();
    if (payload && Array.isArray(payload.apps)) {
      const apps = payload.apps
        .map((raw) => normalizeApp(raw))
        .filter((app) => Boolean(app));
      if (apps.length > 0) {
        return apps;
      }
    }
  } catch (error) {
    console.warn("App config fallback engaged", error);
  }
  return DEFAULT_APPS.map((app) => ({ ...app }));
}

function buildAppCard(app) {
  const article = document.createElement("article");
  article.className = "app-card";
  article.dataset.state = "loading";

  const header = document.createElement("div");
  header.className = "app-card__header";

  const title = document.createElement("span");
  title.className = "app-card__title";
  title.textContent = app.title;

  const statusWrap = document.createElement("span");
  statusWrap.className = "app-card__status";

  const dot = document.createElement("span");
  dot.className = "app-card__dot";

  const statusText = document.createElement("span");
  statusText.textContent = "probing…";

  statusWrap.append(dot, statusText);
  header.append(title, statusWrap);
  article.append(header);

  const role = document.createElement("p");
  role.className = "app-card__meta";
  role.textContent = app.role;
  article.append(role);

  if (app.summary) {
    const summary = document.createElement("p");
    summary.className = "app-card__meta";
    summary.textContent = app.summary;
    article.append(summary);
  }

  if (Array.isArray(app.links) && app.links.length > 0) {
    const linksWrap = document.createElement("div");
    linksWrap.className = "app-card__links";
    for (const link of app.links) {
      if (!link || !link.href) continue;
      const anchor = document.createElement("a");
      anchor.href = link.href;
      anchor.textContent = link.label || "Open";
      if (/^https?:/i.test(link.href)) {
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
      }
      linksWrap.append(anchor);
    }
    article.append(linksWrap);
  }

  return { node: article, statusText };
}

function renderAppGrid(apps) {
  if (!appsGridEl) return;
  appsGridEl.textContent = "";
  appCardIndex.clear();

  if (!Array.isArray(apps) || apps.length === 0) {
    const fallbackCard = document.createElement("article");
    fallbackCard.className = "app-card";
    fallbackCard.dataset.state = "warn";
    const info = document.createElement("p");
    info.className = "app-card__meta";
    info.textContent = "No services configured. Edit public/core/apps.json to add entries.";
    fallbackCard.append(info);
    appsGridEl.append(fallbackCard);
    return;
  }

  for (const app of apps) {
    const card = buildAppCard(app);
    appCardIndex.set(app.id, card);
    appsGridEl.append(card.node);
  }
}

function setAppStatus(appId, state, message) {
  const entry = appCardIndex.get(appId);
  if (!entry) return;
  entry.node.dataset.state = state;
  entry.statusText.textContent = message;
}

async function probeApp(app) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 4000);
  try {
    const res = await fetch(app.health, { signal: controller.signal, cache: "no-store" });
    window.clearTimeout(timer);
    if (res.ok) {
      return { id: app.id, state: "ok", message: "online" };
    }
    return {
      id: app.id,
      state: "warn",
      message: `http ${res.status}`,
    };
  } catch (error) {
    window.clearTimeout(timer);
    const reason = error?.name === "AbortError" ? "timeout" : error?.message || "offline";
    return { id: app.id, state: "offline", message: reason };
  }
}

function updateAppsSummary(results) {
  if (!appsSummaryEl) return;
  if (!results || results.length === 0) {
    appsSummaryEl.textContent = "No services configured.";
    return;
  }
  const tally = { ok: 0, warn: 0, offline: 0 };
  for (const item of results) {
    if (item.state && tally[item.state] !== undefined) {
      tally[item.state] += 1;
    }
  }
  const parts = [];
  if (tally.ok) parts.push(`${tally.ok} online`);
  if (tally.warn) parts.push(`${tally.warn} attention`);
  if (tally.offline) parts.push(`${tally.offline} offline`);
  const stamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  appsSummaryEl.textContent = parts.length > 0
    ? `${parts.join(" · ")} — checked ${stamp}`
    : `Checked ${stamp}`;
}

async function refreshAppStatuses(apps) {
  if (!Array.isArray(apps) || apps.length === 0) {
    updateAppsSummary([]);
    return;
  }
  if (appsSummaryEl) {
    appsSummaryEl.textContent = "Checking statuses…";
  }
  for (const app of apps) {
    setAppStatus(app.id, "loading", "probing…");
  }
  const results = await Promise.all(apps.map((app) => probeApp(app)));
  for (const result of results) {
    setAppStatus(result.id, result.state, result.message);
  }
  updateAppsSummary(results);
}

async function initHub() {
  if (!appsGridEl) return;
  currentApps = await loadConfiguredApps();
  renderAppGrid(currentApps);
  await refreshAppStatuses(currentApps);
}

async function boot() {
  let codexResult;
  let swResult;
  let realmResult;
  try {
    [codexResult, swResult, realmResult] = await Promise.all([
      fetchCodexNodes(),
      ensureServiceWorker().catch((error) => ({
        ok: false,
        reason: error?.message || "Service worker check failed.",
      })),
      fetchRealmLinks(),
    ]);
    updateCodexStatus(codexResult);
    updateServiceWorkerStatus(swResult);
    paintRealmLinks(realmResult);
    const shared = {
      version: "1.0.0",
      palettes: [],
      geometry_layers: [],
      narrative_nodes: [...codexResult.nodes],
    };
    const guard = await validateInterface(shared);
    if (!guard.valid) {
      console.warn("Interface warnings:", guard.errors);
    }
    const view = composeView(shared, {});
    window.__CATHEDRAL_VIEW__ = view;
    statusEl.textContent = codexResult.ok
      ? "ready — codex synced"
      : "ready — codex fallback active";
  } catch (e) {
    console.warn(e);
    statusEl.textContent = "failed";
    if (codexResult) updateCodexStatus(codexResult);
    if (swResult) updateServiceWorkerStatus(swResult);
    if (realmResult) paintRealmLinks(realmResult);
  }
}
initHub().catch((error) => {
  console.warn("Hub grid init failed", error);
});
boot();
