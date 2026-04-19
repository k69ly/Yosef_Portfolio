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

  /* === 3b. PORTFOLIO CAROUSEL === */
  const carouselGrid = document.querySelector('.projects__grid');
  const dotsContainer = document.querySelector('.projects__dots');
  const prevBtn = document.querySelector('.projects__nav--prev');
  const nextBtn = document.querySelector('.projects__nav--next');
  let originalCards = [...projectCards];

  function scrollToCard(index) {
    if (!carouselGrid) return;
    const cards = Array.from(carouselGrid.children);
    if (!cards[index]) return;
    // Calculate precise center position of the targeted card
    const targetPos = cards[index].offsetLeft - carouselGrid.offsetLeft - (carouselGrid.clientWidth / 2) + (cards[index].clientWidth / 2);
    carouselGrid.scrollTo({ left: targetPos, behavior: 'smooth' });
  }

  function getCurrentIndex() {
    if (!carouselGrid) return 0;
    const cards = Array.from(carouselGrid.children);
    const center = carouselGrid.scrollLeft + carouselGrid.clientWidth / 2;
    let closest = 0; let minDist = Infinity;
    cards.forEach((card, i) => {
      const cardCenter = (card.offsetLeft - carouselGrid.offsetLeft) + card.clientWidth / 2;
      const dist = Math.abs(cardCenter - center);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    return closest;
  }

  function buildCarousel() {
    if (!carouselGrid) return;
    carouselGrid.innerHTML = '';
    const activeTab = document.querySelector('.projects__tab.active');
    const filter = activeTab ? activeTab.getAttribute('data-filter') : 'all';
    
    const filtered = originalCards.filter(card => {
      const cat = card.getAttribute('data-category');
      return filter === 'all' || cat === filter;
    });

    filtered.forEach(c => {
      c.classList.remove('clone');
      carouselGrid.appendChild(c);
    });

    carouselGrid.scrollTo({ left: 0 });
    buildDots(filtered.length);
    updateActiveDot();
  }

  function buildDots(count) {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    for(let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.className = 'projects__dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => scrollToCard(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateActiveDot() {
    if (!dotsContainer) return;
    const activeIndex = getCurrentIndex();
    const dots = dotsContainer.querySelectorAll('.projects__dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === activeIndex));
  }

  if (carouselGrid) {
    carouselGrid.addEventListener('scroll', updateActiveDot, { passive: true });
  }
  
  if (prevBtn && carouselGrid) {
    prevBtn.addEventListener('click', () => {
      const total = carouselGrid.children.length;
      let nextIdx = getCurrentIndex() + 1;
      if (nextIdx >= total) nextIdx = 0; // loop back to start
      scrollToCard(nextIdx);
    });
  }
  
  if (nextBtn && carouselGrid) {
    nextBtn.addEventListener('click', () => {
      const total = carouselGrid.children.length;
      let prevIdx = getCurrentIndex() - 1;
      if (prevIdx < 0) prevIdx = total - 1; // loop back to end
      scrollToCard(prevIdx);
    });
  }

  projectTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      projectTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      buildCarousel();
    });
  });

  buildCarousel();

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

  /* === 8. TYPING & FLIP EFFECT (Arabic) === */
  const isArabic = document.documentElement.lang === 'ar';
  const titles = isArabic ? ['مهندس برمجيات', 'مطور تطبيقات ومواقع الكترونية', 'مهندس شبكات مصرفية'] : ['Software Engineer', 'Web & App Developer', 'Banking Network Engineer'];
  let tIdx = 0, cIdx = 0;
  const typingCursor = document.querySelector('.hero__cursor');

  function typeEffect() {
    const cur = titles[0];
    typingText.textContent = cur.substring(0, ++cIdx);
    
    if (cIdx < cur.length) {
      setTimeout(typeEffect, 80);
    } else {
      setTimeout(() => {
        if (typingCursor) typingCursor.classList.add('hide');
        startFlipLoop();
      }, 1500); // Wait 1.5s after typing finishes
    }
  }

  function startFlipLoop() {
    tIdx = 1; 
    const triggerFlip = () => {
      typingText.classList.add('flip-out');
      
      setTimeout(() => {
        typingText.textContent = titles[tIdx];
        tIdx = (tIdx + 1) % titles.length;
        
        typingText.classList.remove('flip-out');
        typingText.classList.add('flip-in');
        
        void typingText.offsetWidth;
        typingText.classList.remove('flip-in');
      }, 600);
    };

    // Start flipping every 3 seconds
    setInterval(triggerFlip, 3000);
    
    // Trigger the first flip after a very short delay
    setTimeout(triggerFlip, 500); 
  }
  typeEffect();

  /* === 9. FORM VALIDATION (Arabic) === */
  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const msgInput = document.getElementById('contactMessage');
  const phoneInput = document.getElementById('contactPhone');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const msgError = document.getElementById('messageError');
  const phoneError = document.getElementById('phoneError');
  const formSuccess = document.getElementById('formSuccess');
  const formError = document.getElementById('formError');

  function vName() {
    const v = nameInput.value.trim();
    if (!v) { nameError.textContent = isArabic ? 'الاسم مطلوب' : 'Name is required'; nameInput.classList.add('error'); return false; }
    if (v.length < 2) { nameError.textContent = isArabic ? 'يجب أن يكون الاسم حرفين على الأقل' : 'Name must be at least 2 characters'; nameInput.classList.add('error'); return false; }
    nameError.textContent = ''; nameInput.classList.remove('error'); return true;
  }
  function vEmail() {
    const v = emailInput.value.trim();
    if (!v) { emailError.textContent = isArabic ? 'البريد الإلكتروني مطلوب' : 'Email is required'; emailInput.classList.add('error'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { emailError.textContent = isArabic ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email'; emailInput.classList.add('error'); return false; }
    emailError.textContent = ''; emailInput.classList.remove('error'); return true;
  }
  function vMsg() {
    const v = msgInput.value.trim();
    if (!v) { msgError.textContent = isArabic ? 'الرسالة مطلوبة' : 'Message is required'; msgInput.classList.add('error'); return false; }
    if (v.length < 10) { msgError.textContent = isArabic ? 'يجب أن تكون الرسالة 10 أحرف على الأقل' : 'Message must be at least 10 characters'; msgInput.classList.add('error'); return false; }
    msgError.textContent = ''; msgInput.classList.remove('error'); return true;
  }
  function vPhone() {
    const v = phoneInput.value.trim();
    if (!v) { phoneError.textContent = isArabic ? 'رقم الهاتف مطلوب' : 'Phone number is required'; phoneInput.classList.add('error'); return false; }
    if (!/^\d{10,15}$/.test(v.replace(/\+/g, ''))) { phoneError.textContent = isArabic ? 'يرجى إدخال رقم هاتف صحيح' : 'Please enter a valid phone number'; phoneInput.classList.add('error'); return false; }
    phoneError.textContent = ''; phoneInput.classList.remove('error'); return true;
  }

  nameInput.addEventListener('input', () => { vName(); formError.classList.remove('show'); });
  emailInput.addEventListener('input', () => { vEmail(); formError.classList.remove('show'); });
  msgInput.addEventListener('input', () => { vMsg(); formError.classList.remove('show'); });
  phoneInput.addEventListener('input', () => { vPhone(); formError.classList.remove('show'); });

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formError.classList.remove('show');
    if (!(vName() && vEmail() && vPhone() && vMsg())) return;

    const btnText = submitBtn.querySelector('span');
    const sendIcon = document.getElementById('sendIcon');
    const spinnerIcon = document.getElementById('spinnerIcon');
    const origText = btnText.textContent;
    submitBtn.disabled = true;
    btnText.textContent = isArabic ? 'جاري الإرسال...' : 'Sending...';
    sendIcon.style.display = 'none';
    spinnerIcon.style.display = 'inline-block';

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
      sendIcon.style.display = 'inline-block';
      spinnerIcon.style.display = 'none';
    }
  });

  /* === 9b. COPY TO CLIPBOARD === */
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-copy');
      const icon = btn.querySelector('i');
      try {
        await navigator.clipboard.writeText(text);
        btn.classList.add('copied', 'show-tooltip');
        btn.setAttribute('data-tooltip', isArabic ? 'تم النسخ!' : 'Copied!');
        icon.classList.replace('bx-copy', 'bx-check');
        setTimeout(() => {
          btn.classList.remove('copied', 'show-tooltip');
          btn.removeAttribute('data-tooltip');
          icon.classList.replace('bx-check', 'bx-copy');
        }, 2000);
      } catch {
        btn.classList.add('show-tooltip');
        btn.setAttribute('data-tooltip', isArabic ? 'فشل النسخ' : 'Copy failed');
        setTimeout(() => {
          btn.classList.remove('show-tooltip');
          btn.removeAttribute('data-tooltip');
        }, 2000);
      }
    });
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
