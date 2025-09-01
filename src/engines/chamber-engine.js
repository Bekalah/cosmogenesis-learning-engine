class ChamberEngine extends EventTarget {
  constructor() {
    super();
    this.current = null;
    this.skin = null;
    this.guardian = null;
    this.payload = null;
  }

  open(id) {
    this.current = id;
    this.dispatchEvent(new CustomEvent('chamber:open', { detail: id }));
  }

  applySkin(skinId) {
    this.skin = skinId;
    this.dispatchEvent(new CustomEvent('skin:apply', { detail: skinId }));
  }

  setGuardian(name) {
    this.guardian = name;
    this.dispatchEvent(new CustomEvent('guardian:set', { detail: name }));
  }

  setPayload(payload) {
    this.payload = payload;
    this.dispatchEvent(new CustomEvent('payload:set', { detail: payload }));
  }
}

export const chamberEngine = new ChamberEngine();
export default chamberEngine;
