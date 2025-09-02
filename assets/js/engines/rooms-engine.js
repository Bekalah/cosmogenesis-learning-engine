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
// Rooms Engine: renders rooms and micro-quests

async function initRooms() {
  const res = await fetch('/data/rooms.json', { cache: 'no-store' });
  const rooms = await res.json();
  renderRooms(rooms);
}

function renderRooms(rooms) {
  const mount = document.getElementById('rooms-atlas');
  if (!mount) return;
  rooms.forEach(room => {
    const card = document.createElement('section');
    card.className = 'room-card';
    const title = document.createElement('h2');
    title.textContent = room.name;
    card.appendChild(title);
    (room.quests || []).forEach(q => {
      const btn = document.createElement('button');
      btn.textContent = q.title;
      if (q.link) {
        btn.addEventListener('click', () => window.open(q.link, '_blank'));
      }
      btn.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('room:quest', { detail: { roomId: room.id, questId: q.id } }));
        btn.disabled = true;
      });
      card.appendChild(btn);
    });
    mount.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', initRooms);
