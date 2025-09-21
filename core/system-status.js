import { loadRegistry } from "../engines/registry-loader.js";
import { loadFromRepo } from "../engines/cross-fetch.js";

let registryCache = null;

// Embedded ND-safe fallback: three calm nodes keep the spiral app responsive offline.
const FALLBACK_NODES = [
  {
    node_id: 1,
    name: "Crown of First Light",
    locked: true,
    egregore_id: "prime_auric_seed",
    geometry: "Prime Spiral Halo",
    fusion_tags: ["Crown", "Light", "Initiation"],
    summary: "Initiates the spiral and opens sovereign light."
  },
  {
    node_id: 2,
    name: "Gate of Silent Depth",
    locked: true,
    egregore_id: "abyssal_listening",
    geometry: "Silent Torus",
    fusion_tags: ["Silence", "Void", "Witness"],
    summary: "Establishes inner stillness for safe study."
  },
  {
    node_id: 3,
    name: "Serpent of Breath",
    locked: true,
    egregore_id: "prana_wind_serpent",
    geometry: "Breath Spiral",
    fusion_tags: ["Breath", "Glyph", "Wind"],
    summary: "Animates speech and patterns the wind of mind."
  }
];

function cloneFallback() {
  return JSON.parse(JSON.stringify(FALLBACK_NODES));
}

async function getRegistry() {
  if (!registryCache) {
    registryCache = await loadRegistry();
  }
  return registryCache;
}

export async function fetchCodexNodes() {
  const registry = await getRegistry();
  try {
    const nodes = await loadFromRepo(
      registry,
      "codex-14499",
      "dist/codex.min.json"
    );
    if (Array.isArray(nodes) && nodes.length > 0) {
      return {
        ok: true,
        nodes,
        message: `Loaded ${nodes.length} nodes from codex-14499.`
      };
    }
    return {
      ok: false,
      nodes: cloneFallback(),
      message: "Codex dataset empty; using embedded fallback."
    };
  } catch (error) {
    return {
      ok: false,
      nodes: cloneFallback(),
      message: `Codex fetch failed (${error.message}); using embedded fallback.`
    };
  }
}

export async function fetchRealmLinks() {
  try {
    const res = await fetch("../registry/realm_links.json", { cache: "no-store" });
    if (!res.ok) {
      throw new Error(String(res.status));
    }
    const data = await res.json();
    const links = Array.isArray(data.links) ? data.links : [];
    if (links.length === 0) {
      return {
        ok: false,
        links,
        message: "Realm links file present but empty."
      };
    }
    return {
      ok: true,
      links,
      message: `Loaded ${links.length} realm links.`
    };
  } catch (error) {
    return {
      ok: false,
      links: [],
      message: `Realm links offline (${error.message}).`
    };
  }
}

function serviceWorkersSupported() {
  return typeof window !== "undefined" && "serviceWorker" in navigator;
}

function waitForController(timeoutMs = 1500) {
  if (!serviceWorkersSupported()) {
    return Promise.resolve(false);
  }
  if (navigator.serviceWorker.controller) {
    return Promise.resolve(true);
  }
  return new Promise((resolve) => {
    const start = Date.now();
    const id = window.setInterval(() => {
      if (navigator.serviceWorker.controller) {
        window.clearInterval(id);
        resolve(true);
      } else if (Date.now() - start > timeoutMs) {
        window.clearInterval(id);
        resolve(false);
      }
    }, 50);
  });
}

function queryServiceWorkerVersion() {
  if (!serviceWorkersSupported()) {
    return Promise.resolve(null);
  }
  const controller = navigator.serviceWorker.controller;
  if (!controller) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    const timer = window.setTimeout(() => {
      resolve(null);
    }, 1500);
    channel.port1.onmessage = (event) => {
      window.clearTimeout(timer);
      const payload = event.data && typeof event.data.version === "string"
        ? event.data.version
        : null;
      resolve(payload);
    };
    controller.postMessage({ type: "SW_VERSION_REQUEST" }, [channel.port2]);
  });
}

export async function ensureServiceWorker() {
  if (!serviceWorkersSupported()) {
    return {
      ok: false,
      reason: "Service workers unsupported in this browser."
    };
  }
  if (window.location.protocol === "file:") {
    return {
      ok: false,
      reason: "Service worker blocked while running from file://."
    };
  }
  try {
    await navigator.serviceWorker.register("./service-worker.js", { scope: "./" });
    await navigator.serviceWorker.ready;
    await waitForController();
    const version = await queryServiceWorkerVersion();
    return {
      ok: true,
      version: version || "unknown"
    };
  } catch (error) {
    return {
      ok: false,
      reason: error.message
    };
  }
}
