const AVATAR_SOURCES = [
  'https://unavatar.io/telegram/FuckingChoppa'
];

function loadAvatar(img, sources, fallback) {
  if (!sources.length) {
    img.src = fallback;
    return;
  }

  const [current, ...rest] = sources;
  const probe = new Image();

  probe.onload = () => { img.src = current; };
  probe.onerror = () => loadAvatar(img, rest, fallback);
  probe.src = current;
}

function revealCard() {
  const card = document.getElementById('card');
  if (!card) return;

  requestAnimationFrame(() => {
    card.classList.add('is-visible');

    const btns = card.querySelectorAll('.link-btn');
    btns.forEach((btn, i) => {
      setTimeout(() => btn.classList.add('is-visible'), 180 + i * 70);
    });
  });
}

function bindTiltEffect(card) {
  const TILT_MAX = 6;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    card.style.transform = `
      perspective(900px)
      rotateX(${-y * TILT_MAX}deg)
      rotateY(${x * TILT_MAX}deg)
      translateY(-2px)
    `;

    const glow = card.querySelector('.card__glow');
    if (glow) {
      glow.style.background = `radial-gradient(ellipse at ${50 + x * 60}% ${20 + y * 40}%, rgba(114, 137, 218, 0.1) 0%, transparent 65%)`;
    }
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    const glow = card.querySelector('.card__glow');
    if (glow) glow.style.background = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    setTimeout(() => { card.style.transition = ''; }, 500);
  });
}

function init() {
  const avatar = document.getElementById('avatar');
  if (avatar) loadAvatar(avatar, AVATAR_SOURCES);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const card = document.getElementById('card');

  if (card && !prefersReduced) bindTiltEffect(card);

  revealCard();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
