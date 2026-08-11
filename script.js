(function () {
  'use strict';

  /* Custom cursor: J-C image resized to 32x32 (browser size limit) */
  const CURSOR_SIZE = 32;
  const cursorImg = new Image();
  cursorImg.onload = function () {
    const canvas = document.createElement('canvas');
    canvas.width = CURSOR_SIZE;
    canvas.height = CURSOR_SIZE;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(cursorImg, 0, 0, CURSOR_SIZE, CURSOR_SIZE);
    let dataUrl;
    try {
      dataUrl = canvas.toDataURL('image/png');
    } catch (e) {
      /* Canvas tainted (e.g. file:// or CORS); use path fallback */
      const style = document.createElement('style');
      style.textContent = 'html, body, body * { cursor: url("assets/J-C.png") 0 0, auto !important; }';
      document.head.appendChild(style);
      return;
    }
    const escaped = dataUrl.replace(/"/g, '\\"');
    const style = document.createElement('style');
    style.textContent = 'html, body, body * { cursor: url("' + escaped + '") 0 0, auto !important; } a, button, [type="submit"], .btn, .nav a, .nav-toggle { cursor: url("' + escaped + '") 0 0, pointer !important; }';
    document.head.appendChild(style);
  };
  cursorImg.onerror = function () {
    /* Fallback: use image path directly (may not work if image > 32px) */
    const style = document.createElement('style');
    style.textContent = 'html, body, body * { cursor: url("assets/J-C.png") 0 0, auto !important; }';
    document.head.appendChild(style);
  };
  cursorImg.src = 'assets/J-C.png';

  const header = document.querySelector('.header');
  const heroScroll = document.querySelector('.hero-scroll');
  const productSection = document.getElementById('trace');
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelectorAll('.nav a');
  const contactForm = document.querySelector('.contact-form');
  const themeToggle = document.querySelector('.theme-toggle');

  /* Theme: light (default, matches live site) / dark with localStorage */
  const THEME_KEY = 'agilix-theme';
  function getTheme() {
    try {
      return localStorage.getItem(THEME_KEY) || 'light';
    } catch (e) {
      return 'light';
    }
  }
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {}
  }
  setTheme(getTheme());
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const next = getTheme() === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }

  /* Dissolve-in for hero and sections */
  const dissolveTargets = document.querySelectorAll('.hero, .section');
  if (dissolveTargets.length && 'IntersectionObserver' in window) {
    document.body.classList.add('js-dissolve');
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('dissolve-in');
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );
    dissolveTargets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* Hide scroll hint when Product section enters viewport */
  if (heroScroll && productSection && 'IntersectionObserver' in window) {
    const productObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          heroScroll.classList.toggle('is-hidden', entry.isIntersecting);
        });
      },
      { threshold: 0 }
    );
    productObserver.observe(productSection);
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', nav.classList.contains('is-open'));
    });

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  if (header) {
    let lastScroll = 0;
    window.addEventListener('scroll', function () {
      const current = window.scrollY;
      if (current > 80) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
      lastScroll = current;
    }, { passive: true });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var form = e.target;
      var data = new FormData(form);
      var message = 'Message sent (form is demo – connect to your backend).';
      alert(message);
      form.reset();
    });
  }
})();
