/* Shared site chrome: nav active state, mobile drawer, toasts, footer year */

function initChrome(activePage) {
  const state = LunaData.loadState();
  const name = state.settings.businessName;

  document.querySelectorAll('[data-brand-name]').forEach(el => el.textContent = name);
  document.querySelectorAll('[data-brand-sub]').forEach(el => el.textContent = state.settings.tagline);
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  // Nav active
  document.querySelectorAll('.nav a, .drawer-panel a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (activePage && href.indexOf(activePage + '.html') > -1) a.classList.add('active');
    if (activePage === 'index' && (href === 'index.html' || href === './')) a.classList.add('active');
  });

  // Mobile drawer
  const toggle = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  if (toggle && drawer) {
    toggle.addEventListener('click', () => drawer.classList.add('open'));
    drawer.querySelector('.drawer-back')?.addEventListener('click', () => drawer.classList.remove('open'));
    drawer.querySelector('.drawer-close')?.addEventListener('click', () => drawer.classList.remove('open'));
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => drawer.classList.remove('open')));
  }
}

/* ---------- Toast ---------- */
function toast(msg, type = '', ms = 3200) {
  let stack = document.querySelector('.toast-stack');
  if (!stack) {
    stack = document.createElement('div');
    stack.className = 'toast-stack';
    document.body.appendChild(stack);
  }
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  const ico = type === 'ok' ? '✅' : type === 'warn' ? '⏳' : type === 'bad' ? '✕' : 'ℹ️';
  t.innerHTML = `<span>${ico}</span><span>${msg}</span>`;
  stack.appendChild(t);
  setTimeout(() => {
    t.style.transition = 'opacity .3s, transform .3s';
    t.style.opacity = '0';
    t.style.transform = 'translateX(24px)';
    setTimeout(() => t.remove(), 320);
  }, ms);
}

/* ---------- Modal helper ---------- */
function openModal(id) { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }

document.addEventListener('click', e => {
  if (e.target.classList?.contains('modal-back')) e.target.classList.remove('open');
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.querySelectorAll('.modal-back.open').forEach(m => m.classList.remove('open'));
});

window.LunaUI = { initChrome, toast, openModal, closeModal };
