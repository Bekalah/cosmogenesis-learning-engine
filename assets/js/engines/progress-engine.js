(() => {
  "use strict";
  const STORAGE_KEY = "roomsProgress";

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { rooms: {} };
    } catch {
      return { rooms: {} };
    }
  }

  function save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  const state = load();

  function markRoomEnter(id) {
    state.rooms[id] = state.rooms[id] || { quests: {} };
    state.rooms[id].entered = true;
    save(state);
  }

  function markQuestComplete(roomId, quest) {
    state.rooms[roomId] = state.rooms[roomId] || { quests: {} };
    state.rooms[roomId].quests[quest] = true;
    save(state);
  }

  function reset() {
    state.rooms = {};
    save(state);
  }

  document.addEventListener("room:enter", (e) => markRoomEnter(e.detail.id));
  document.addEventListener("quest:complete", (e) =>
    markQuestComplete(e.detail.roomId, e.detail.quest),
  );

  window.roomsProgress = { state, markRoomEnter, markQuestComplete, reset };
})();
