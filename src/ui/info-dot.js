export default function initInfoDot() {
  const btn = document.createElement('button');
  btn.textContent = 'ⓘ';
  btn.style.position = 'fixed';
  btn.style.bottom = '10px';
  btn.style.right = '10px';
  btn.setAttribute('aria-label', 'Science References');
  btn.addEventListener('click', () => {
    window.open('./docs/SCIENCE_REFERENCES.md', '_blank');
  });
  document.body.appendChild(btn);
}
