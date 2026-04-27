// ============================================================
// MONARQUE — interactivity
// Smooth scroll · custom cursor · reveal · magnetic · count-up
// ============================================================
(function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --------------------------------------------------------
  // 1. Page-load reveal
  // --------------------------------------------------------
  const pageLoad = document.getElementById('pageLoad');
  setTimeout(() => {
    if (pageLoad) pageLoad.style.display = 'none';
  }, 2200);

  // --------------------------------------------------------
  // 2. Lenis smooth scroll
  // --------------------------------------------------------
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new window.Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // --------------------------------------------------------
  // 3. Nav scroll state
  // --------------------------------------------------------
  const nav = document.getElementById('nav');
  const scrollProgress = document.getElementById('scrollProgress');
  function onScroll() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('is-scrolled', y > 12);
    if (scrollProgress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? (y / h) * 100 : 0;
      scrollProgress.style.width = pct + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --------------------------------------------------------
  // 4. Custom cursor
  // --------------------------------------------------------
  const cursor = document.getElementById('cursor');
  const cursorLabel = document.getElementById('cursorLabel');
  if (cursor && !('ontouchstart' in window)) {
    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    let tx = cx, ty = cy;

    window.addEventListener('mousemove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
    });

    function tick() {
      cx += (tx - cx) * 0.22;
      cy += (ty - cy) * 0.22;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(tick);
    }
    tick();

    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
    });
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
    });

    const hoverables = 'a, button, [data-cursor], summary, input, select, textarea, .glass-card, .hero__panel-item';
    document.addEventListener('mouseover', (e) => {
      const el = e.target.closest(hoverables);
      if (!el) return;
      cursor.classList.add('is-hover');
      const label = el.getAttribute('data-cursor');
      if (label) {
        cursorLabel.textContent = label;
        cursor.classList.add('is-label');
      }
    });
    document.addEventListener('mouseout', (e) => {
      const el = e.target.closest(hoverables);
      if (!el) return;
      cursor.classList.remove('is-hover');
      cursor.classList.remove('is-label');
    });
  }

  // --------------------------------------------------------
  // 5. Smooth-scroll for anchor links
  // --------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: -90, duration: 1.4 });
      } else {
        const y = target.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // --------------------------------------------------------
  // 6. Reveal on scroll
  // --------------------------------------------------------
  const reveals = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  reveals.forEach((el) => io.observe(el));

  // --------------------------------------------------------
  // 7. Split word animation (word-level rise)
  // --------------------------------------------------------
  const splitEls = document.querySelectorAll('[data-split-word]');
  splitEls.forEach((el) => {
    const lines = el.querySelectorAll('.line');
    const sources = lines.length ? Array.from(lines) : [el];
    sources.forEach((line) => {
      const nodes = Array.from(line.childNodes);
      line.innerHTML = '';
      nodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const words = node.textContent.split(/(\s+)/);
          words.forEach((w) => {
            if (!w.trim()) {
              line.appendChild(document.createTextNode(w));
              return;
            }
            const wrap = document.createElement('span');
            wrap.className = 'word-wrap';
            const inner = document.createElement('span');
            inner.textContent = w;
            wrap.appendChild(inner);
            line.appendChild(wrap);
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // Wrap the existing element (e.g. <em>, <span class="gold">, <span class="hero__title-strike">)
          const wrap = document.createElement('span');
          wrap.className = 'word-wrap';
          wrap.appendChild(node);
          line.appendChild(wrap);
        }
      });
    });

    const tio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const innerSpans = entry.target.querySelectorAll('.word-wrap > *');
          innerSpans.forEach((s, i) => {
            s.style.transitionDelay = (i * 0.04) + 's';
          });
          entry.target.classList.add('is-in');
          tio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    tio.observe(el);
  });

  // --------------------------------------------------------
  // 8. Magnetic buttons
  // --------------------------------------------------------
  const magnets = document.querySelectorAll('[data-magnetic]');
  magnets.forEach((btn) => {
    let isIn = false;
    btn.addEventListener('mouseenter', () => { isIn = true; });
    btn.addEventListener('mouseleave', () => {
      isIn = false;
      btn.style.transform = '';
    });
    btn.addEventListener('mousemove', (e) => {
      if (!isIn) return;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
    });
  });

  // --------------------------------------------------------
  // 9. Tilt on glass cards
  // --------------------------------------------------------
  const tiltEls = document.querySelectorAll('[data-tilt]');
  tiltEls.forEach((el) => {
    el.style.transformStyle = 'preserve-3d';
    el.style.transition = 'transform .4s var(--ease)';
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });

  // --------------------------------------------------------
  // 10. Ambient orb parallax
  // --------------------------------------------------------
  const orbs = document.querySelectorAll('.ambient__orb');
  window.addEventListener('mousemove', (e) => {
    const mx = (e.clientX / window.innerWidth) - 0.5;
    const my = (e.clientY / window.innerHeight) - 0.5;
    orbs.forEach((o, i) => {
      const depth = (i + 1) * 15;
      o.style.transform = `translate3d(${mx * depth}px, ${my * depth}px, 0)`;
    });
  });

  // --------------------------------------------------------
  // 11. Number count-up
  // --------------------------------------------------------
  const counters = document.querySelectorAll('[data-count]');
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.getAttribute('data-count');
      const isFloat = raw.includes('.');
      const target = parseFloat(raw);
      const prefix = (el.textContent.match(/^[^\d\-\.]*/) || [''])[0];
      const duration = 1400;
      const start = performance.now();

      function step(now) {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const current = target * eased;
        el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.floor(current));
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = prefix + (isFloat ? target.toFixed(1) : Math.floor(target));
      }
      requestAnimationFrame(step);
      cio.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach((c) => cio.observe(c));

  // --------------------------------------------------------
  // 12. Mobile nav toggle
  // --------------------------------------------------------
  const navToggle = document.getElementById('navToggle');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const links = document.querySelector('.nav__links');
      if (!links) return;
      if (links.style.display === 'flex') {
        links.style.display = '';
      } else {
        links.style.display = 'flex';
        links.style.position = 'fixed';
        links.style.top = '80px';
        links.style.left = '0';
        links.style.right = '0';
        links.style.flexDirection = 'column';
        links.style.padding = '32px';
        links.style.background = 'rgba(7,8,10,0.97)';
        links.style.borderBottom = '1px solid var(--line)';
        links.style.gap = '20px';
        links.style.zIndex = '99';
      }
    });
  }
})();
