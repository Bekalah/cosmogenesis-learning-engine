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
