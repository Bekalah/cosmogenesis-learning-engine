(() => {
  "use strict";
  async function fetchRooms() {
    const res = await fetch("/data/rooms.json", { cache: "no-store" });
    return res.json();
  }
  const progress =
    (window.roomsProgress && window.roomsProgress.state) || { rooms: {} };
  function emit(name, detail) {
    document.dispatchEvent(new CustomEvent(name, { detail }));
  }
  function renderRooms(rooms) {
    const container = document.getElementById("rooms");
    if (!container) return;
    rooms.forEach((room) => {
      const section = document.createElement("section");
      section.className = "room";
      const roomState = progress.rooms[room.id];
      if (roomState && roomState.entered) section.classList.add("visited");
      const title = document.createElement("h2");
      title.textContent = room.name;
      const enter = document.createElement("button");
      enter.textContent = "Enter";
      enter.addEventListener("click", () => {
        emit("room:enter", { id: room.id });
      });
      section.appendChild(title);
      section.appendChild(enter);
      const list = document.createElement("ul");
      Object.entries(room.quests || {}).forEach(([q, url]) => {
        const li = document.createElement("li");
        if (roomState && roomState.quests && roomState.quests[q])
          li.classList.add("completed");
        const a = document.createElement("a");
        a.textContent = q;
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener";
        a.addEventListener("click", () => {
          emit("quest:complete", { roomId: room.id, quest: q });
        });
        li.appendChild(a);
        list.appendChild(li);
      });
      section.appendChild(list);
      container.appendChild(section);
    });
  }
  document.addEventListener("DOMContentLoaded", async () => {
    const rooms = await fetchRooms();
    renderRooms(rooms);
  });
})();
