// Minimal chamber engine for tracking open rooms and payloads.
// ND-safe: no animation, pure state container with soft defaults.
export const chamberEngine = (() => {
  const openChambers = new Set();
  const payloads = new Map();
  let current = null;

  function openMultiple(ids = []) {
    ids.forEach(id => {
      openChambers.add(id);
      current = id; // last opened becomes current
    });
  }

  function closeAll() {
    openChambers.clear();
    payloads.clear();
    current = null;
  }

  function setPayload(id, data) {
    payloads.set(id, data);
  }

  function getPayload(id) {
    return payloads.get(id) ?? null;
  }

  function copyPayload(fromId, toId) {
    if (payloads.has(fromId)) {
      payloads.set(toId, payloads.get(fromId));
    }
  }

  function currentChamber() {
    return current;
  }

  return {
    openMultiple,
    closeAll,
    setPayload,
    getPayload,
    copyPayload,
    openChambers,
    payloads,
    current: currentChamber,
  };
})();
