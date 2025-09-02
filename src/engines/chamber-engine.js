export const chamberEngine = (() => {
  const openChambers = new Set();
  const payloads = new Map();
  let current = null;

  function openMultiple(ids = []) {
    ids.forEach(id => { openChambers.add(id); current = id; });
  }
  function closeAll() {
    openChambers.clear(); payloads.clear(); current = null;
  }
  function setPayload(id, data) { payloads.set(id, data); }
  function getPayload(id) { return payloads.get(id) ?? null; }

  return { openMultiple, closeAll, openChambers, payloads, current: () => current, setPayload, getPayload };
})();
