export default function mount(el) {
  let threads = 0;
  const btn = document.createElement("button");
  btn.textContent = `Threads of healing: ${threads}`;
  btn.addEventListener("click", () => {
    threads++;
    btn.textContent = `Threads of healing: ${threads}`;
  });
  el.appendChild(btn);
}
