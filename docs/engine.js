+const STYLEPACKS = {
+  light: {
+    palette: {
+      '--bg-color': '#ffffff',
+      '--text-color': '#000000'
+    },
+    typography: {
+      '--font-family': 'sans-serif'
+    }
+  },
+  dark: {
+    palette: {
+      '--bg-color': '#111111',
+      '--text-color': '#eeeeee'
+    },
+    typography: {
+      '--font-family': 'monospace'
+    }
+  },
+  cosmic: {
+    palette: {
+      '--bg-color': '#001014',
+      '--text-color': '#7ef9ff'
+    },
+    typography: {
+      '--font-family': '"Courier New", monospace'
+    }
+  }
+};
+
+function setStyle(styleName) {
+  const pack = STYLEPACKS[styleName];
+  if (!pack) return;
+  const root = document.documentElement;
+  if (pack.palette) {
+    Object.entries(pack.palette).forEach(([key, value]) => {
+      root.style.setProperty(key, value);
+    });
+  }
+  if (pack.typography) {
+    Object.entries(pack.typography).forEach(([key, value]) => {
+      root.style.setProperty(key, value);
+    });
+  }
+  localStorage.setItem('style', styleName);
+}
+
+window.setStyle = setStyle;
+
+async function loadDemos() {
+  try {
+    const res = await fetch('data/demos.json');
+    const demos = await res.json();
+    const container = document.getElementById('demo-list');
+    container.innerHTML = '';
+    demos.forEach(d => {
+      const item = document.createElement('div');
+      item.textContent = d.title || JSON.stringify(d);
+      container.appendChild(item);
+    });
+  } catch (err) {
+    console.error('Failed to load demos', err);
+  }
+}
+
+document.addEventListener('DOMContentLoaded', () => {
+  loadDemos();
+  const stored = localStorage.getItem('style') || 'light';
+  setStyle(stored);
+  const selector = document.getElementById('style-selector');
+  if (selector) selector.value = stored;
+});
+
 
EOF
)
