import crypto from 'node:crypto';

let session = null;

function getStorage() {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

/**
 * Retrieve the current session. If none exists, an anonymous session is
 * created with a persistent ID when possible.
 * @returns {{id: string, anonymous: boolean}}
 */
export function getSession() {
  if (session) return session;
  const storage = getStorage();
  const storedId = storage?.getItem('sessionId');
  const id = storedId || crypto.randomUUID();
  session = { id, anonymous: true };
  storage?.setItem('sessionId', id);
  return session;
}

/**
 * Replace the current session with the provided user object.
 * @param {{id: string, anonymous?: boolean}} user
 * @returns {object}
 */
export function setSession(user) {
  const storage = getStorage();
  session = { ...user, anonymous: user?.anonymous ?? false };
  if (session?.id) storage?.setItem('sessionId', session.id);
  return session;
}

/**
 * Clear the existing session, including any persisted identifier.
 */
export function clearSession() {
  const storage = getStorage();
  storage?.removeItem('sessionId');
  session = null;
}

export default {
  getSession,
  setSession,
  clearSession,
};
