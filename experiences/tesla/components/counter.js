export default function mount(el) {
  let volts = 0;
  const btn = document.createElement('button');
  btn.textContent = `Tesla volts: ${volts}`;
  btn.addEventListener('click', () => {
    volts++;
    btn.textContent = `Tesla volts: ${volts}`;
  });
  el.appendChild(btn);
}
