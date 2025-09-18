/*
  calm-mode.mjs
  ND-safe toggle for the Atelier layout. Applies the `is-calm` class so
  gradients soften, and stores the visitor preference offline-friendly.
*/

const DEFAULT_STORAGE_KEY = "cosmic-helix-calm";

export function initCalmMode(button, options = {}) {
  const candidate = options.root;
  const root = typeof Element !== "undefined" && candidate instanceof Element ? candidate : document.body;
  const storageKey = typeof options.storageKey === "string" && options.storageKey.length > 0
    ? options.storageKey
    : DEFAULT_STORAGE_KEY;
  const mediaQuery = safeMatchMedia("(prefers-reduced-motion: reduce)");

  const storedPreference = readStoredPreference(storageKey);
  let calmState = storedPreference !== null ? storedPreference : mediaQuery?.matches || false;

  applyCalmState(root, button, calmState);

  if (button) {
    button.addEventListener("click", () => {
      calmState = !calmState;
      applyCalmState(root, button, calmState);
      writeStoredPreference(storageKey, calmState);
    });
  }

  if (mediaQuery && typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", (event) => {
      if (readStoredPreference(storageKey) === null) {
        calmState = event.matches;
        applyCalmState(root, button, calmState);
      }
    });
  }
}

function applyCalmState(root, button, state) {
  if (!root) {
    return;
  }
  root.classList.toggle("is-calm", state);
  root.classList.toggle("reduced-motion", state);

  if (button) {
    button.setAttribute("aria-pressed", state ? "true" : "false");
    button.textContent = state ? "Calm Mode: On" : "Calm Mode: Off";
  }
}

function safeMatchMedia(query) {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return null;
  }
  try {
    return window.matchMedia(query);
  } catch (error) {
    return null;
  }
}

function readStoredPreference(key) {
  try {
    const value = window.localStorage.getItem(key);
    if (value === "true") {
      return true;
    }
    if (value === "false") {
      return false;
    }
    return null;
  } catch (error) {
    return null;
  }
}

function writeStoredPreference(key, state) {
  try {
    window.localStorage.setItem(key, state ? "true" : "false");
  } catch (error) {
    // Offline or private mode may block storage; fail silently per ND-safe spec.
  }
}
