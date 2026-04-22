// ImóvelPrime — main.js

// Nav scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60));

// Mobile nav
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

function lockScroll() {
  const y = window.scrollY;
  document.body.dataset.scrollY = y;
  document.body.style.cssText = `position:fixed;top:-${y}px;left:0;right:0;overflow-y:scroll`;
}
function unlockScroll() {
  const y = +(document.body.dataset.scrollY || 0);
  document.body.style.cssText = '';
  window.scrollTo(0, y);
}

function openMenu() {
  navLinks?.classList.add('open');
  navToggle?.classList.add('open');
  nav.classList.add('menu-open');
  lockScroll();
}
function closeMenu() {
  navLinks?.classList.remove('open');
  navToggle?.classList.remove('open');
  nav.classList.remove('menu-open');
  unlockScroll();
}

navToggle?.addEventListener('click', () => {
  navLinks.classList.contains('open') ? closeMenu() : openMenu();
});
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('click', e => {
  if (navLinks?.classList.contains('open') && !navLinks.contains(e.target) && !navToggle.contains(e.target)) closeMenu();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
    navLinks?.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Counter animation
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.target;
    const step = target / (1600 / 16);
    let current = 0;
    const update = () => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current).toLocaleString('pt-BR');
      if (current < target) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

// Reveal on scroll
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = entry.target.parentElement.querySelectorAll('.reveal');
    let delay = 0;
    siblings.forEach((s, i) => { if (s === entry.target) delay = i * 90; });
    setTimeout(() => entry.target.classList.add('visible'), Math.min(delay, 350));
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(r => revealObserver.observe(r));

// Property filter
const filterBtns = document.querySelectorAll('.filter-btn');
const imovelCards = document.querySelectorAll('.imovel-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    imovelCards.forEach(card => {
      const show = filter === 'all' || card.dataset.type === filter;
      card.style.opacity = show ? '1' : '0';
      card.style.transform = show ? 'scale(1)' : 'scale(.95)';
      card.style.display = show ? '' : 'none';
    });
  });
});

// Favorite toggle
document.querySelectorAll('.imovel-card__fav').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    btn.textContent = btn.classList.contains('active') ? '♥' : '♡';
  });
});

// Search tabs
document.querySelectorAll('.search-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// Search form
document.getElementById('searchForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent = '🔍 Buscando imóveis...';
  setTimeout(() => {
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg> Buscar Imóveis';
    // Scroll to listings
    document.getElementById('imoveis')?.scrollIntoView({ behavior: 'smooth' });
  }, 1000);
});

// Contact form
document.getElementById('contatoForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = '✓ Solicitação recebida! Entraremos em contato em breve.';
  btn.style.background = '#2d6a4f';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Solicitar Atendimento Gratuito';
    btn.style.background = '';
    btn.disabled = false;
    e.target.reset();
  }, 5000);
});

// Phone mask
const tel = document.getElementById('telefoneContato');
tel?.addEventListener('input', e => {
  let v = e.target.value.replace(/\D/g, '').slice(0, 11);
  if (v.length >= 7) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
  else if (v.length >= 3) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
  else if (v.length > 0) v = `(${v}`;
  e.target.value = v;
});
