export default function mount(el) {
  let count = 0;
  const btn = document.createElement('button');
  btn.textContent = `Hypatia clicks: ${count}`;
  btn.addEventListener('click', () => {
    count++;
    btn.textContent = `Hypatia clicks: ${count}`;
  });
  el.appendChild(btn);
}
