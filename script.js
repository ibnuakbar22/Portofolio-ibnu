/* ============================================================
   IBNU AKBAR PORTFOLIO — script.js
   ============================================================ */

'use strict';

/* ── Config ── */
const CONFIG = {
  pages: ['home', 'pengalaman', 'gallery', 'socials'],
  themes: {
    home:       'theme-home',
    pengalaman: 'theme-pengalaman',
    gallery:    'theme-gallery',
    socials:    'theme-socials',
  },
  defaultPage: 'home',
};

/* ── State ── */
let currentPage   = CONFIG.defaultPage;
let isTransitioning = false;
let particleInterval = null;

/* ── DOM ── */
const body       = document.body;
const orbs       = document.querySelectorAll('.orb');
const mobileMenu = document.getElementById('mobile-menu');
const hamburger  = document.getElementById('hamburger');

/* ══════════════════════════════════════
   BUILD OVERLAY (5 wipe panels)
   ══════════════════════════════════════ */
function buildOverlay() {
  const ov = document.createElement('div');
  ov.id = 'page-transition-overlay';
  for (let i = 0; i < 5; i++) {
    const p = document.createElement('div');
    p.className = 'wipe-panel';
    ov.appendChild(p);
  }
  document.body.appendChild(ov);
  return ov;
}
const overlay = buildOverlay();

/* ══════════════════════════════════════
   NAVIGATION  (wipe → swap → wipe out)
   ══════════════════════════════════════ */
function navigateTo(pageId) {
  if (!CONFIG.pages.includes(pageId) || pageId === currentPage || isTransitioning) return;
  isTransitioning = true;

  const prevPage = currentPage;
  const prevEl   = document.getElementById(`${prevPage}-page`);

  /* ── Step 1: apply NEXT theme early (sets wipe color) ── */
  body.className = body.className.replace(/theme-\w+/g, '').trim();
  body.classList.add(CONFIG.themes[pageId]);

  /* ── Step 2: WIPE IN ── */
  overlay.className = 'wipe-in';

  /* ── Step 3: mid-wipe swap (at ~350ms) ── */
  setTimeout(() => {
    /* hide old */
    if (prevEl) {
      prevEl.classList.remove('active');
      prevEl.style.display = 'none';
    }

    /* show new */
    const nextEl = document.getElementById(`${pageId}-page`);
    if (nextEl) {
      nextEl.style.display = 'block';
      /* force reflow */
      nextEl.offsetHeight;
      nextEl.classList.add('active');
    }

    /* update nav buttons */
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.page === pageId);
    });

    /* scroll */
    window.scrollTo({ top: 0, behavior: 'instant' });

    /* pulse orbs */
    orbs.forEach(orb => {
      orb.classList.remove('visible');
      setTimeout(() => orb.classList.add('visible'), 80);
    });

    /* close mobile menu */
    closeMobileMenu();

    /* ── Step 4: WIPE OUT ── */
    overlay.className = 'wipe-out';

    setTimeout(() => {
      overlay.className = '';
      isTransitioning = false;

      /* page-specific after-reveal */
      if (pageId === 'pengalaman') animateExpCards();
      if (pageId === 'gallery')    startGalleryParticles();
      else                          stopGalleryParticles();

    }, 420); /* wipe out duration */

  }, 380); /* wipe in duration */

  currentPage = pageId;
}

/* ══════════════════════════════════════
   MOBILE MENU
   ══════════════════════════════════════ */
function toggleMobileMenu() {
  mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
}
function openMobileMenu() {
  mobileMenu.classList.add('open');
  hamburger.classList.add('open');
}
function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
}

/* ══════════════════════════════════════
   NAV BUTTON RIPPLE
   ══════════════════════════════════════ */
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const r = document.createElement('span');
    r.className = 'nav-btn-ripple';
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px;`;
    this.appendChild(r);
    setTimeout(() => r.remove(), 600);
  });
});

/* ══════════════════════════════════════
   PENGALAMAN — cascading card reveal
   ══════════════════════════════════════ */
function animateExpCards() {
  /* Category titles */
  document.querySelectorAll('.exp-cat-title').forEach((title, i) => {
    title.classList.remove('title-visible');
    title.style.opacity = '0';
    setTimeout(() => {
      title.classList.add('title-visible');
    }, 80 + i * 150);
  });

  /* Cards staggered */
  const cards = document.querySelectorAll('.exp-card');
  cards.forEach((card, i) => {
    card.classList.remove('card-visible');
    card.style.opacity = '0';
    setTimeout(() => {
      card.classList.add('card-visible');
    }, 180 + i * 110);
  });
}

/* ══════════════════════════════════════
   GALLERY — floating particles
   ══════════════════════════════════════ */
function startGalleryParticles() {
  stopGalleryParticles();
  const container = document.getElementById('gallery-particles');
  if (!container) return;
  container.innerHTML = '';

  const colors = ['#d946ef','#a855f7','#06b6d4','#ec4899','#818cf8','#e879f9'];

  particleInterval = setInterval(() => {
    const p = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size  = 4 + Math.random() * 9;
    p.style.cssText = `
      position:absolute;
      width:${size}px; height:${size}px;
      border-radius:50%;
      left:${Math.random() * 100}%;
      bottom:-20px;
      background:${color};
      box-shadow:0 0 ${size * 2}px ${color};
      pointer-events:none;
      animation:particleRise ${3 + Math.random() * 4}s ease-out forwards;
      opacity:0.9;
    `;
    container.appendChild(p);
    setTimeout(() => p.remove(), 7000);
  }, 250);
}
function stopGalleryParticles() {
  if (particleInterval) { clearInterval(particleInterval); particleInterval = null; }
  const c = document.getElementById('gallery-particles');
  if (c) c.innerHTML = '';
}

/* ══════════════════════════════════════
   HOME — Typewriter
   ══════════════════════════════════════ */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const phrases = ['Full Stack Developer', 'UI/UX Enthusiast', 'Creative Coder', 'Digital Creator', 'Problem Solver'];
  let pIdx = 0, cIdx = 0, deleting = false;

  function type() {
    const current = phrases[pIdx];
    if (!deleting) {
      el.textContent = current.slice(0, ++cIdx);
      if (cIdx === current.length) { deleting = true; setTimeout(type, 2000); return; }
    } else {
      el.textContent = current.slice(0, --cIdx);
      if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; }
    }
    setTimeout(type, deleting ? 55 : 95);
  }
  setTimeout(type, 800);
}

/* ══════════════════════════════════════
   STACK CARD hover colors
   ══════════════════════════════════════ */
function initStackCards() {
  const colors = {
    figma:'#f24e1e', python:'#3b82f6', html:'#f97316',
    css:'#0ea5e9', javascript:'#eab308', json:'#10b981',
    mysql:'#2563eb', rstudio:'#1e40af',
  };
  document.querySelectorAll('.stack-card[data-tech]').forEach(card => {
    const color = colors[card.dataset.tech] || '#6366f1';
    card.style.setProperty('--c', color);
    card.addEventListener('mouseenter', () => { card.querySelector('i').style.color = color; });
    card.addEventListener('mouseleave', () => { card.querySelector('i').style.color = ''; });
  });
}

/* ══════════════════════════════════════
   SCROLL REVEAL
   ══════════════════════════════════════ */
function initScrollReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

/* ══════════════════════════════════════
   INJECT KEYFRAMES
   ══════════════════════════════════════ */
function injectKeyframes() {
  const s = document.createElement('style');
  s.textContent = `
    @keyframes particleRise {
      0%   { transform: translateY(0) scale(1) rotate(0deg); opacity: 0.9; }
      80%  { opacity: 0.6; }
      100% { transform: translateY(-100vh) scale(0.2) rotate(180deg); opacity: 0; }
    }
    .reveal {
      opacity: 0; transform: translateY(32px);
      transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.34,1.56,0.64,1);
    }
    .reveal.revealed { opacity: 1; transform: translateY(0); }
  `;
  document.head.appendChild(s);
}

/* ══════════════════════════════════════
   INIT
   ══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  /* initial theme & page */
  body.classList.add(CONFIG.themes[CONFIG.defaultPage]);
  const initEl = document.getElementById(`${CONFIG.defaultPage}-page`);
  if (initEl) { initEl.style.display = 'block'; initEl.classList.add('active'); }

  /* initial nav active */
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === CONFIG.defaultPage);
  });

  /* orbs */
  setTimeout(() => orbs.forEach(o => o.classList.add('visible')), 200);

  /* features */
  injectKeyframes();
  initTypewriter();
  initStackCards();
  initScrollReveal();
});

/* close mobile menu on outside click */
document.addEventListener('click', e => {
  if (mobileMenu && !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
    closeMobileMenu();
  }
});
