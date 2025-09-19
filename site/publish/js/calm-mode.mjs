/*
  calm-mode.mjs
  ND-safe toggle for the Atelier layout. Applies the `is-calm` class so
  gradients soften, and stores the visitor preference offline-friendly.
*/

const DEFAULT_STORAGE_KEY = "cosmic-helix-calm";

/**
 * Initialize and wire a ND-safe "Calm Mode" toggle for the page.
 *
 * Applies or removes the visual calm state on a root element (toggles `is-calm` and `reduced-motion` classes),
 * updates an optional toggle button's ARIA state and label, persists the user's preference to localStorage
 * (when available), and respects the user's system `prefers-reduced-motion` setting when no stored preference exists.
 *
 * This function is safe to call in environments missing window, localStorage, or matchMedia: it will no-op where APIs are unavailable.
 *
 * @param {HTMLElement|null} button - Optional toggle control. When provided, the control's click handler will toggle calm mode,
 *                                     the control's `aria-pressed` will be updated, and its text set to "Calm Mode: On" / "Calm Mode: Off".
 * @param {Object} [options] - Optional configuration.
 * @param {Element} [options.root] - Element to receive/remove calm-mode classes. If omitted or invalid, `document.body` is used.
 * @param {string} [options.storageKey] - LocalStorage key to persist the preference. Defaults to `DEFAULT_STORAGE_KEY`.
 */
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

/**
 * Apply or remove "calm mode" presentation on a root element and update an optional toggle button.
 *
 * If `root` is falsy the function returns immediately. When `state` is truthy this adds
 * the `is-calm` and `reduced-motion` classes to `root`; otherwise it removes them.
 * If a `button` is provided the function sets its `aria-pressed` to `"true"`/`"false"`
 * and updates its visible label to `"Calm Mode: On"` or `"Calm Mode: Off"`.
 *
 * @param {HTMLElement|null|undefined} root - The element to apply calm-mode classes to (often `document.body`).
 * @param {HTMLElement|HTMLButtonElement|null|undefined} button - Optional toggle control to update ARIA state and label.
 * @param {boolean} state - True to enable calm mode (add classes and mark button pressed); false to disable.
 */
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

/**
 * Safely obtains a MediaQueryList for the given media query, or null if not available.
 *
 * @param {string} query - A media query string (e.g., "(prefers-reduced-motion: reduce)").
 * @return {MediaQueryList|null} The MediaQueryList if matchMedia is available and call succeeds; otherwise null.
 */
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

/**
 * Read a boolean calm-mode preference from localStorage.
 *
 * Returns true if the stored value is the string "true", false if "false", and null if no valid value is found
 * or if access to storage fails (e.g., disabled or unavailable).
 *
 * @param {string} key - localStorage key to read.
 * @return {boolean|null} The stored preference or null when absent/invalid/unreadable.
 */
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

/**
 * Persist a boolean preference to localStorage as the string "true" or "false".
 * If localStorage is unavailable or an error occurs (e.g., private browsing), this function fails silently.
 * @param {string} key - The localStorage key under which to save the preference.
 * @param {boolean} state - The preference value to persist.
 */
function writeStoredPreference(key, state) {
  try {
    window.localStorage.setItem(key, state ? "true" : "false");
  } catch (error) {
    // Offline or private mode may block storage; fail silently per ND-safe spec.
  }
}
