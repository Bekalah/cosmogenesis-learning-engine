(() => {
  "use strict";
  function bridgeRoomEnter(e) {
    const id = e.detail.id;
    document.dispatchEvent(new CustomEvent("tesseract:unlockNode", { detail: { id } }));
    document.dispatchEvent(new CustomEvent("tesseract:unlockEdge", { detail: { from: "home", to: id } }));
  }
  document.addEventListener("room:enter", bridgeRoomEnter);
})();

    document.dispatchEvent(
      new CustomEvent("tesseract:unlockNode", { detail: { id } }),
    );
    document.dispatchEvent(
      new CustomEvent("tesseract:unlockEdge", {
        detail: { from: "home", to: id },
      }),
    );
  }
  document.addEventListener("room:enter", bridgeRoomEnter);
})();
// Tesseract Bridge: links room quests to tesseract map
import { createTesseractLab } from '../../../app/shared/tesseract-lab.js';

const seenRooms = new Set();
let lab = null;
let nodeData = null;

async function initBridge() {
  const stage = document.getElementById('tesseract-stage');
  if (!stage) return;
  nodeData = await fetch('/data/tesseract-nodes.json', { cache: 'no-store' }).then(r => r.json());
  lab = await createTesseractLab(stage, {
    count: nodeData.nodes.length,
    labels: nodeData.nodes.map(n => n.label)
  });
}

document.addEventListener('DOMContentLoaded', initBridge);

// When a room quest fires, notify hooks to unlock nodes

document.addEventListener('room:quest', ev => {
  const { roomId } = ev.detail || {};
  if (roomId && !seenRooms.has(roomId)) {
    seenRooms.add(roomId);
    document.dispatchEvent(new CustomEvent('tesseract:unlock', { detail: { nodeId: roomId } }));
  }
});

// Listen for hook updates to refresh labels

document.addEventListener('tesseract:nodesUpdated', ev => {
  if (!lab || !nodeData) return;
  const unlocked = ev.detail?.unlocked || [];
  const labels = nodeData.nodes.map(n => unlocked.includes(n.id) ? `★ ${n.label}` : n.label);
  lab.update({ labels });
});
(() => {
  "use strict";
  function bridgeRoomEnter(e) {
    const id = e.detail.id;
    document.dispatchEvent(
      new CustomEvent("tesseract:unlockNode", { detail: { id } }),
    );
    document.dispatchEvent(
      new CustomEvent("tesseract:unlockEdge", {
        detail: { from: "home", to: id },
      }),
    );
  }
  document.addEventListener("room:enter", bridgeRoomEnter);
})();
=====
(() => {
  "use strict";
  function bridgeRoomEnter(e) {
    const id = e.detail.id;
    document.dispatchEvent(
      new CustomEvent("tesseract:unlockNode", { detail: { id } }),
    );
    document.dispatchEvent(
      new CustomEvent("tesseract:unlockEdge", {
        detail: { from: "home", to: id },
      }),
    );
  }
  document.addEventListener("room:enter", bridgeRoomEnter);
})();
>>>>>>> Stashed changes
// Tesseract Bridge: links room quests to tesseract map
import { createTesseractLab } from '../../../app/shared/tesseract-lab.js';

const seenRooms = new Set();
let lab = null;
let nodeData = null;

async function initBridge() {
  const stage = document.getElementById('tesseract-stage');
  if (!stage) return;
  nodeData = await fetch('/data/tesseract-nodes.json', { cache: 'no-store' }).then(r => r.json());
  lab = await createTesseractLab(stage, {
    count: nodeData.nodes.length,
    labels: nodeData.nodes.map(n => n.label)
  });
}

document.addEventListener('DOMContentLoaded', initBridge);

<<<<<<< Updated upstream
// When a room quest fires, notify hooks to unlock nodes

document.addEventListener('room:quest', ev => {
  const { roomId } = ev.detail || {};
  if (roomId && !seenRooms.has(roomId)) {
    seenRooms.add(roomId);
    document.dispatchEvent(new CustomEvent('tesseract:unlock', { detail: { nodeId: roomId } }));
  }
});

// Listen for hook updates to refresh labels

document.addEventListener('tesseract:nodesUpdated', ev => {
  if (!lab || !nodeData) return;
  const unlocked = ev.detail?.unlocked || [];
  const labels = nodeData.nodes.map(n => unlocked.includes(n.id) ? `★ ${n.label}` : n.label);
  lab.update({ labels });
});
(() => {
  "use strict";
  function bridgeRoomEnter(e) {
    const id = e.detail.id;
    document.dispatchEvent(
      new CustomEvent("tesseract:unlockNode", { detail: { id } }),
    );
    document.dispatchEvent(
      new CustomEvent("tesseract:unlockEdge", {
        detail: { from: "home", to: id },
      }),
    );
  }
  document.addEventListener("room:enter", bridgeRoomEnter);
})();
=====
>>>>>>> Stashed changes
