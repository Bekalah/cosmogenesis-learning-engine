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
boot();
