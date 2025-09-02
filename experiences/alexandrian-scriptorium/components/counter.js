export default function mount(el) {
  let scrolls = 0;
  const btn = document.createElement('button');
  btn.textContent = `Scriptorium scrolls: ${scrolls}`;
  btn.addEventListener('click', () => {
    scrolls++;
    btn.textContent = `Scriptorium scrolls: ${scrolls}`;
  });
  el.appendChild(btn);
}
