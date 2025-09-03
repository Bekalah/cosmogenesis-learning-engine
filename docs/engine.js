const STYLEPACKS = {
  light: {
    palette: {
      '--bg-color': '#ffffff',
      '--text-color': '#000000'
    },
    typography: {
      '--font-family': 'sans-serif'
    }
  },
  dark: {
    palette: {
      '--bg-color': '#111111',
      '--text-color': '#eeeeee'
    },
    typography: {
      '--font-family': 'monospace'
    }
  },
  cosmic: {
    palette: {
      '--bg-color': '#001014',
      '--text-color': '#7ef9ff'
    },
    typography: {
      '--font-family': '"Courier New", monospace'
    }
  }
};

function setStyle(styleName) {
  const pack = STYLEPACKS[styleName];
  if (!pack) return;
  const root = document.documentElement;
  if (pack.palette) {
    Object.entries(pack.palette).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }
  if (pack.typography) {
    Object.entries(pack.typography).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }
  localStorage.setItem('style', styleName);
}

window.setStyle = setStyle;

async function loadRooms() {
  try {
    const res = await fetch('data/rooms.json');
    const rooms = await res.json();
    const container = document.getElementById('room-list');
    container.innerHTML = '';
    rooms.forEach(r => {
      const item = document.createElement('div');
      item.textContent = r.name;
      container.appendChild(item);
    });
  } catch (err) {
    console.error('Failed to load rooms', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadRooms();
  const stored = localStorage.getItem('style') || 'light';
  setStyle(stored);
  const selector = document.getElementById('style-selector');
  if (selector) selector.value = stored;
});

 
