import {
  fetchCodexNodes,
  fetchRealmLinks,
  ensureServiceWorker,
} from "./system-status.js";

const codexEl = document.getElementById("hc-codex");
const swEl = document.getElementById("hc-sw");
const realmListEl = document.getElementById("hc-links");

function setCodexStatus(result) {
  if (!codexEl) return;
  codexEl.textContent = result.message;
  codexEl.dataset.state = result.ok ? "ok" : "warn";
}

function setServiceWorkerStatus(result) {
  if (!swEl) return;
  if (result.ok) {
    const ver = result.version ? `version ${result.version}` : "online";
    swEl.textContent = `Active (${ver})`;
    swEl.dataset.state = "ok";
  } else {
    swEl.textContent = result.reason || "Service worker unavailable.";
    swEl.dataset.state = "warn";
  }
}

function setRealmLinks(result) {
  if (!realmListEl) return;
  realmListEl.textContent = "";
  if (!result.ok || !Array.isArray(result.links) || result.links.length === 0) {
    const li = document.createElement("li");
    li.textContent = result.message || "Realm links offline.";
    realmListEl.appendChild(li);
    return;
  }
  for (const link of result.links) {
    const li = document.createElement("li");
    const anchor = document.createElement("a");
    anchor.textContent = link.title || link.id || link.href || "Realm";
    if (link.href) anchor.href = link.href;
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
    realmListEl.appendChild(li);
  }
}

async function runHealthCheck() {
  const codexResult = await fetchCodexNodes();
  setCodexStatus(codexResult);

  const swResult = await ensureServiceWorker().catch((error) => ({
    ok: false,
    reason: error?.message || "Service worker check failed.",
  }));
  setServiceWorkerStatus(swResult);

  const realmResult = await fetchRealmLinks();
  setRealmLinks(realmResult);
}

runHealthCheck();
