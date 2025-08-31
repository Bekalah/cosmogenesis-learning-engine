export default function mount(el) {
  let sigils = 0;
  const btn = document.createElement('button');
  btn.textContent = `Agrippa sigils: ${sigils}`;
  btn.addEventListener('click', () => {
    sigils++;
    btn.textContent = `Agrippa sigils: ${sigils}`;
  });
  el.appendChild(btn);
}
