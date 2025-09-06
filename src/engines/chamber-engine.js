class ChamberEngine {
  constructor() {
    this.openChambers = new Set();
    this.payloads = new Map();
    this.current = null;
  }

  openMultiple(ids = []) {
    ids.forEach((id) => {
      this.openChambers.add(id);
      this.current = id;
    });
  }

  closeAll() {
    this.openChambers.clear();
    this.payloads.clear();
    this.current = null;
  }

  setPayload(id, data) {
    this.payloads.set(id, data);
  }

  getPayload(id) {
    return this.payloads.get(id) ?? null;
  }

  copyPayload(fromId, toId) {
    const data = this.getPayload(fromId);
    if (data !== null && toId != null) {
      this.setPayload(toId, data);
    }
    return data;
  }
}

export const chamberEngine = new ChamberEngine();
