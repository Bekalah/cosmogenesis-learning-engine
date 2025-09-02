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
