(() => {
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) document.documentElement.classList.add('reduced-motion');

  const calmBtn = document.getElementById('calmToggle');
  calmBtn?.addEventListener('click', () => {
    const active = document.documentElement.classList.toggle('reduced-motion');
    calmBtn.setAttribute('aria-pressed', String(active));
  });

  // Gentle parallax, disabled when Calm Mode is on
  const field = document.querySelector('.field');
  if (!field) return;
  let ticking = false;
  function update() {
    if (document.documentElement.classList.contains('reduced-motion')) { field.style.transform = ''; ticking = false; return; }
    field.style.transform = `translateY(${window.scrollY * 0.5}px)`;
    ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
})();
