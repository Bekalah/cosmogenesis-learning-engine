export const chamberEngine = (() => {
  const openChambers = new Set();
  const payloads = new Map();
  let current = null;

  function openMultiple(ids = []) {
    ids.forEach(id => { openChambers.add(id); current = id; });
  }
  function closeAll() {
    openChambers.clear(); payloads.clear(); current = null;
class ChamberEngine extends EventTarget {
  constructor() {
    super();
    this.current = null;
    this.skin = null;
    this.guardian = null;
    this.payloads = new Map();
    this.openChambers = new Set();
  }

  open(id) {
    this.current = id;
    this.openChambers.add(id);
    this.dispatchEvent(new CustomEvent('chamber:open', { detail: id }));
  }

  openMultiple(ids = []) {
    ids.forEach((id) => {
      this.openChambers.add(id);
      this.dispatchEvent(new CustomEvent('chamber:open', { detail: id }));
    });
    this.current = ids.at(-1) ?? this.current;
  }

  close(id) {
    this.openChambers.delete(id);
    if (this.current === id) {
      this.current = null;
    }
    this.dispatchEvent(new CustomEvent('chamber:close', { detail: id }));
  }

  applySkin(skinId) {
    this.skin = skinId;
    this.dispatchEvent(new CustomEvent('skin:apply', { detail: skinId }));
  }

  setGuardian(name) {
    this.guardian = name;
    this.dispatchEvent(new CustomEvent('guardian:set', { detail: name }));
  }

  setPayload(payload, id = this.current) {
    if (id == null) return;
    this.payloads.set(id, payload);
    this.dispatchEvent(
      new CustomEvent('payload:set', { detail: { id, payload } })
    );
  }

  getPayload(id = this.current) {
    return id == null ? undefined : this.payloads.get(id);
  }

  copyPayload(fromId, toId = this.current) {
    const payload = this.getPayload(fromId);
    if (payload !== undefined && toId != null) {
      this.setPayload(payload, toId);
    }
    return payload;
  }
  function setPayload(id, data) { payloads.set(id, data); }
  function getPayload(id) { return payloads.get(id) ?? null; }

  return { openMultiple, closeAll, openChambers, payloads, current: () => current, setPayload, getPayload };
})();
