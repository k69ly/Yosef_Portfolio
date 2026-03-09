/* ============================================
   PORTFOLIO — SCRIPT (Arabic)
   ============================================ */
/* غيّر YOUR_FORM_ID بمعرّف نموذجك من https://formspree.io */
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xzdjdgoa';

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const navbar = document.getElementById('navbar');
  const navMenu = document.getElementById('navMenu');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelectorAll('.navbar__link');
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const scrollTopBtn = document.getElementById('scrollTop');
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const typingText = document.getElementById('typingText');
  const sections = document.querySelectorAll('section[id]');
  const projectCards = document.querySelectorAll('.project-card');
  const projectTabs = document.querySelectorAll('.projects__tab');

  /* === 1. DARK / LIGHT MODE === */
  const THEME_KEY = 'portfolio-theme';
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    themeIcon.classList.toggle('bx-sun', theme === 'dark');
    themeIcon.classList.toggle('bx-moon', theme !== 'dark');
  }
  const saved = localStorage.getItem(THEME_KEY);
  setTheme(saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  themeToggle.addEventListener('click', () => {
    setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  /* === 2. NAVBAR SCROLL === */
  function handleNavbarScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }

  /* === 3. MOBILE MENU === */
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = navToggle.querySelector('i');
    icon.classList.toggle('bx-menu', !navMenu.classList.contains('active'));
    icon.classList.toggle('bx-x', navMenu.classList.contains('active'));
  });
  navLinks.forEach(link => link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    const icon = navToggle.querySelector('i');
    icon.classList.remove('bx-x');
    icon.classList.add('bx-menu');
  }));
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      navMenu.classList.remove('active');
      const icon = navToggle.querySelector('i');
      icon.classList.remove('bx-x');
      icon.classList.add('bx-menu');
    }
  });

  /* === 3b. PROJECT FILTER (سوفتوير / شبكات) === */
  projectTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      projectTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.getAttribute('data-filter');
      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        const show = filter === 'all' || cat === filter;
        card.classList.toggle('hidden', !show);
        if (show) card.classList.add('active');
      });
    });
  });

  /* === 4. ACTIVE SECTION HIGHLIGHT === */
  function highlightActiveSection() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('active-link', link.getAttribute('data-section') === id);
        });
      }
    });
  }

  /* === 5. SCROLL TO TOP === */
  function handleScrollTopVisibility() {
    scrollTopBtn.classList.toggle('show', window.scrollY > 400);
  }
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* === 6. SCROLL REVEAL === */
  const revealElements = document.querySelectorAll('.reveal');
  function revealOnScroll() {
    const wh = window.innerHeight;
    revealElements.forEach(el => {
      if (el.getBoundingClientRect().top < wh - 80) el.classList.add('active');
    });
  }

  /* === 7. STATS COUNTER === */
  const statsNumbers = document.querySelectorAll('.stats__number');
  let statsAnimated = false;
  function animateStats() {
    if (statsAnimated) return;
    const s = document.getElementById('stats');
    if (!s || s.getBoundingClientRect().top >= window.innerHeight - 80) return;
    statsAnimated = true;
    statsNumbers.forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const duration = 2000;
      const start = performance.now();
      (function update(now) {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
        if (p < 1) requestAnimationFrame(update); else el.textContent = target;
      })(start);
    });
  }

  /* === 8. TYPING EFFECT (Arabic — 2 titles only) === */
  const titles = ['مهندس برمجيات', 'مطور تطبيقات ومواقع الكترونية', 'مهندس شبكات مصرفية'];
  let tIdx = 0, cIdx = 0, deleting = false, speed = 100;

  function typeEffect() {
    const cur = titles[tIdx];
    if (deleting) {
      typingText.textContent = cur.substring(0, --cIdx);
      speed = 40;
    } else {
      typingText.textContent = cur.substring(0, ++cIdx);
      speed = 80;
    }
    if (!deleting && cIdx === cur.length) { speed = 2000; deleting = true; }
    else if (deleting && cIdx === 0) { deleting = false; tIdx = (tIdx + 1) % titles.length; speed = 300; }
    setTimeout(typeEffect, speed);
  }
  typeEffect();

  /* === 9. FORM VALIDATION (Arabic) === */
  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const msgInput = document.getElementById('contactMessage');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const msgError = document.getElementById('messageError');
  const formSuccess = document.getElementById('formSuccess');
  const formError = document.getElementById('formError');

  function vName() {
    const v = nameInput.value.trim();
    if (!v) { nameError.textContent = 'الاسم مطلوب'; nameInput.classList.add('error'); return false; }
    if (v.length < 2) { nameError.textContent = 'يجب أن يكون الاسم حرفين على الأقل'; nameInput.classList.add('error'); return false; }
    nameError.textContent = ''; nameInput.classList.remove('error'); return true;
  }
  function vEmail() {
    const v = emailInput.value.trim();
    if (!v) { emailError.textContent = 'البريد الإلكتروني مطلوب'; emailInput.classList.add('error'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { emailError.textContent = 'يرجى إدخال بريد إلكتروني صحيح'; emailInput.classList.add('error'); return false; }
    emailError.textContent = ''; emailInput.classList.remove('error'); return true;
  }
  function vMsg() {
    const v = msgInput.value.trim();
    if (!v) { msgError.textContent = 'الرسالة مطلوبة'; msgInput.classList.add('error'); return false; }
    if (v.length < 10) { msgError.textContent = 'يجب أن تكون الرسالة 10 أحرف على الأقل'; msgInput.classList.add('error'); return false; }
    msgError.textContent = ''; msgInput.classList.remove('error'); return true;
  }

  nameInput.addEventListener('input', () => { vName(); formError.classList.remove('show'); });
  emailInput.addEventListener('input', () => { vEmail(); formError.classList.remove('show'); });
  msgInput.addEventListener('input', () => { vMsg(); formError.classList.remove('show'); });

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formError.classList.remove('show');
    if (!(vName() && vEmail() && vMsg())) return;

    const btnText = submitBtn.querySelector('span');
    const origText = btnText.textContent;
    submitBtn.disabled = true;
    btnText.textContent = 'جاري الإرسال...';

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        formSuccess.classList.add('show');
        contactForm.reset();
        setTimeout(() => formSuccess.classList.remove('show'), 4000);
      } else {
        formError.classList.add('show');
      }
    } catch {
      formError.classList.add('show');
    } finally {
      submitBtn.disabled = false;
      btnText.textContent = origText;
    }
  });

  /* === 10. SCROLL HANDLER === */
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleNavbarScroll();
        highlightActiveSection();
        handleScrollTopVisibility();
        revealOnScroll();
        animateStats();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll);
  handleNavbarScroll(); revealOnScroll(); animateStats();
});
