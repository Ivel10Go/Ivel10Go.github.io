// Einfache Navigation (Toggle) und smooth scroll
document.addEventListener('DOMContentLoaded', function () {
  const themeToggle = document.querySelector('.theme-toggle');
  const root = document.documentElement;

  // Initiales Thema aus localStorage oder Systempräferenz (dark standardmäßig aktivieren)
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') root.classList.add('dark');
  else if (savedTheme === 'light') root.classList.remove('dark');
  else {
    // keine Einstellung: dark als Default setzen
    root.classList.add('dark');
  }

  function updateLogo() {
    const logo = document.getElementById('site-logo');
    if (!logo) return;
    logo.src = root.classList.contains('dark') ? 'assets/logoWhite.png' : 'assets/logo.png';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const isDark = root.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      themeToggle.textContent = isDark ? '☀️' : '🌙';
      updateLogo();
    });
    // Set initial icon and logo
    themeToggle.textContent = root.classList.contains('dark') ? '☀️' : '🌙';
    updateLogo();
  }

  // Scroll Reveal Animation
  const revealElements = document.querySelectorAll('section, .card, .about-content, .contact-card');
  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));

  // Mouse Parallax for BG Glow
  const bgGlow = document.querySelector('.bg-glow');
  if (bgGlow) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth) * 20;
      const y = (e.clientY / window.innerHeight) * 20;
      bgGlow.style.transform = `translate(${x}px, ${y}px)`;
    });
  }


  // Smooth scroll für interne Links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (navList && navList.classList.contains('open')) {
          navList.classList.remove('open');
        }
      }
    });
  });

  // Lightbox: open clicked project images in overlay
  function createLightbox() {
    let overlay = document.querySelector('.lightbox-overlay');
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';

    const img = document.createElement('img');
    overlay.appendChild(img);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerHTML = '✕';
    overlay.appendChild(closeBtn);

    // Close handlers
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target === closeBtn) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });

    document.body.appendChild(overlay);
    return overlay;
  }

  function openLightbox(src, alt) {
    const overlay = createLightbox();
    const img = overlay.querySelector('img');
    img.src = src;
    img.alt = alt || '';
    requestAnimationFrame(() => overlay.classList.add('open'));
  }

  function closeLightbox() {
    const overlay = document.querySelector('.lightbox-overlay');
    if (!overlay) return;
    overlay.classList.remove('open');
    // remove after transition to clean DOM
    setTimeout(() => overlay.remove(), 250);
  }

  document.querySelectorAll('.card .media img').forEach(function (img) {
    img.addEventListener('click', function () {
      // if a higher-res version is available in data-full use it
      const full = img.dataset.full || img.src;
      openLightbox(full, img.alt);
    });
  });
});
