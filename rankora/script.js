// ============================================================
// Revive & Co. — motion & interaction layer
// ============================================================

(function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --------------------------------------------------------
  // 1. PAGE LOAD REVEAL
  // --------------------------------------------------------
  const pageLoad = document.getElementById('pageLoad');
  if (pageLoad && !reduce) {
    window.addEventListener('load', () => {
      setTimeout(() => pageLoad.classList.add('is-hidden'), 1100);
      setTimeout(() => pageLoad.remove(), 2100);
    });
  } else if (pageLoad) {
    pageLoad.remove();
  }

  // --------------------------------------------------------
  // 2. LENIS SMOOTH SCROLL
  // --------------------------------------------------------
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new window.Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 1,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // --------------------------------------------------------
  // 3. CUSTOM CURSOR
  // --------------------------------------------------------
  const cursor = document.getElementById('cursor');
  const cursorLabel = document.getElementById('cursorLabel');
  const isTouch = window.matchMedia('(hover: none)').matches;

  if (cursor && !isTouch && !reduce) {
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let cx = mx, cy = my;
    let rx = mx, ry = my;

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
    });

    function animateCursor() {
      cx += (mx - cx) * 0.25;
      cy += (my - cy) * 0.25;
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;

      const dot = cursor.querySelector('.cursor__dot');
      const ring = cursor.querySelector('.cursor__ring');
      const label = cursor.querySelector('.cursor__label');
      dot.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      label.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover states
    const hoverables = document.querySelectorAll('a, button, [data-magnetic], .faq__item summary, .tpl-tab, .mock, input, textarea');
    hoverables.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-hover');
        const label = el.getAttribute('data-cursor');
        if (label) {
          cursorLabel.textContent = label;
          cursor.classList.add('is-labeled');
        }
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-hover', 'is-labeled');
      });
    });

    // Hide when leaving window
    document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
    document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
  } else if (cursor) {
    cursor.remove();
  }

  // --------------------------------------------------------
  // 4. NAV SCROLL STATE + SCROLL PROGRESS
  // --------------------------------------------------------
  const nav = document.getElementById('nav');
  const progress = document.getElementById('scrollProgress');

  function onScroll() {
    const y = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = Math.min(100, (y / docH) * 100);
    if (nav) nav.classList.toggle('is-scrolled', y > 8);
    if (progress) progress.style.width = pct + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --------------------------------------------------------
  // 5. SCROLL REVEAL (data-reveal)
  // --------------------------------------------------------
  const revealTargets = document.querySelectorAll('[data-reveal]');
  const revealIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealIO.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );
  revealTargets.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 6, 5) * 60}ms`;
    revealIO.observe(el);
  });

  // --------------------------------------------------------
  // 6. SPLIT TITLE — char-by-char rise
  // --------------------------------------------------------
  const titles = document.querySelectorAll('[data-split-title]');
  titles.forEach((title) => {
    const walk = (node) => {
      if (node.nodeType === 3) {
        const text = node.textContent;
        if (!text.trim()) return;
        const frag = document.createDocumentFragment();
        text.split('').forEach((ch) => {
          if (ch === ' ') {
            frag.appendChild(document.createTextNode(' '));
          } else {
            const wrap = document.createElement('span');
            wrap.className = 'split-wrap';
            const inner = document.createElement('span');
            inner.className = 'split-char';
            inner.textContent = ch;
            wrap.appendChild(inner);
            frag.appendChild(wrap);
          }
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === 1 && !node.classList.contains('hero__ornament')) {
        Array.from(node.childNodes).forEach(walk);
      }
    };
    Array.from(title.childNodes).forEach(walk);

    const chars = title.querySelectorAll('.split-char');
    chars.forEach((c, idx) => {
      c.style.transitionDelay = `${0.4 + idx * 0.025}s`;
    });

    const titleIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            title.classList.add('is-visible');
            titleIO.unobserve(title);
          }
        });
      },
      { threshold: 0.3 }
    );
    titleIO.observe(title);
  });

  // --------------------------------------------------------
  // 7. MAGNETIC BUTTONS
  // --------------------------------------------------------
  if (!isTouch && !reduce) {
    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      const strength = 0.28;
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
        el.style.transition = 'transform .45s cubic-bezier(.22,.8,.2,1)';
        setTimeout(() => { el.style.transition = ''; }, 450);
      });
    });
  }

  // --------------------------------------------------------
  // 8. TILT CARDS
  // --------------------------------------------------------
  if (!isTouch && !reduce) {
    document.querySelectorAll('[data-tilt]').forEach((el) => {
      const max = 6;
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${x * max}deg) rotateX(${-y * max}deg) translateY(-4px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(900px) rotateY(0) rotateX(0) translateY(0)';
      });
    });
  }

  // --------------------------------------------------------
  // 9. PARALLAX (data-parallax)
  // --------------------------------------------------------
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  function updateParallax() {
    parallaxEls.forEach((el) => {
      const speed = parseFloat(el.getAttribute('data-parallax')) || 0.2;
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = `translate3d(0, ${-center * speed}px, 0)`;
    });
    requestAnimationFrame(updateParallax);
  }
  if (parallaxEls.length && !reduce) updateParallax();

  // --------------------------------------------------------
  // 10. NUMBER COUNT-UP
  // --------------------------------------------------------
  document.querySelectorAll('.number__big').forEach((el) => {
    const raw = el.textContent;
    const match = raw.match(/([^\d.]*)([\d.]+)(.*)/);
    if (!match) return;
    const [, prefix, numStr, suffix] = match;
    const final = parseFloat(numStr);
    const hasDecimal = numStr.includes('.');
    const span = el.querySelector('span');
    const spanHTML = span ? span.outerHTML : '';

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const dur = 1400;
            const start = performance.now();
            function step(now) {
              const t = Math.min(1, (now - start) / dur);
              const eased = 1 - Math.pow(1 - t, 3);
              const val = final * eased;
              const display = hasDecimal ? val.toFixed(1) : Math.round(val);
              el.innerHTML = `${prefix}${display}${spanHTML || suffix}`;
              if (t < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    io.observe(el);
  });

  // --------------------------------------------------------
  // 12. TEMPLATE TABS
  // --------------------------------------------------------
  const tabs = document.querySelectorAll('.tpl-tab');
  const panels = document.querySelectorAll('.tpl-panel');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const id = tab.dataset.tpl;
      tabs.forEach((t) => t.classList.toggle('is-active', t === tab));
      panels.forEach((p) => p.classList.toggle('is-active', p.dataset.panel === id));
    });
  });

  // --------------------------------------------------------
  // 13. ANCHOR SCROLL — via Lenis (if available)
  // --------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: -90, duration: 1.3 });
      } else {
        const y = target.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // --------------------------------------------------------
  // 14. ONBOARDING MODAL + LIVE PREVIEW GENERATION
  // --------------------------------------------------------
  const STORAGE_KEY = 'rankora_preview';
  const modal = document.getElementById('tplModal');
  const modalKicker = document.getElementById('tplModalKicker');
  const modalType = document.getElementById('tplModalType');
  const formEl = document.getElementById('tplForm');

  const TEMPLATE_SCHEMAS = {
    blog: {
      label: 'Domain Blogger',
      typeWord: 'blog',
      render: () => [
        fieldInput('domain', 'Your domain', 'yourdomain.com', true),
        fieldInput('title', 'Site title', 'The Archive', true),
        fieldInput('tagline', 'Tagline (optional)', 'Notes on X, every Tuesday'),
        fieldTextarea('description', 'What is this site about?', 'Niche, audience, what you publish...', true, true),
        fieldInput('niche', 'Primary niche / keyword', 'Vintage watches'),
        fieldInput('price', 'Asking price (if for sale)', '$8,500'),
        fieldFile('heroImage', 'Hero image (optional)'),
      ],
    },
    product: {
      label: 'Product Autoblog',
      typeWord: 'store',
      render: () => [
        sectionHeading('Store'),
        fieldInput('domain', 'Your domain', 'yourstore.com', true),
        fieldInput('brand', 'Brand / store name', 'Still & Co.', true),
        fieldFile('logo', 'Logo (optional)'),
        sectionHeading('The product'),
        fieldInput('productName', 'Product name', 'The Night Mask', true),
        fieldTextarea('productDescription', 'Short product description', 'What is it, who is it for, why is it special?', true, true),
        fieldInput('price', 'Price', '$29', true),
        fieldInput('oldPrice', 'Original price (optional)', '$49'),
        fieldFile('productImage', 'Product image (optional)'),
        fieldInput('rating', 'Rating (e.g. 4.9)', '4.9'),
        fieldInput('reviewCount', 'Review count', '1,204'),
        sectionHeading('Key features'),
        fieldFeatures('features'),
      ],
    },
    business: {
      label: 'Business Blog',
      typeWord: 'business',
      render: () => [
        sectionHeading('Business'),
        fieldInput('domain', 'Your domain', 'yourcompany.com', true),
        fieldInput('business', 'Business name', 'NorthStar HVAC', true),
        fieldInput('tagline', 'Tagline', 'Done right, the first time.'),
        fieldTextarea('about', 'About / what you do', 'Two or three sentences on the business...', true, true),
        fieldFile('logo', 'Logo (optional)'),
        sectionHeading('Services (up to 3)'),
        fieldService('service1', 'Service 1'),
        fieldService('service2', 'Service 2'),
        fieldService('service3', 'Service 3'),
        sectionHeading('Contact & hours'),
        fieldInput('phone', 'Phone', '+1 (555) 012-3456'),
        fieldInput('email', 'Email', 'hello@yourcompany.com'),
        fieldInput('address', 'Address', '123 Main St · Austin, TX'),
        fieldInput('hours', 'Working hours', 'Mon–Fri · 9am–6pm'),
        sectionHeading('Testimonial'),
        fieldTextarea('testimonialQuote', 'Testimonial quote', 'What does a happy customer say?', false, true),
        fieldInput('testimonialAuthor', 'From', 'Dana P. · Austin'),
      ],
    },
  };

  function fieldInput(name, label, placeholder, required, wide) {
    const wrap = document.createElement('label');
    wrap.className = 'field' + (wide ? ' field--wide' : '');
    wrap.innerHTML = `
      <span class="field__label">${label}${required ? ' *' : ''}</span>
      <input type="text" name="${name}" placeholder="${placeholder}" ${required ? 'required' : ''} />
    `;
    return wrap;
  }
  function fieldTextarea(name, label, placeholder, required, wide) {
    const wrap = document.createElement('label');
    wrap.className = 'field' + (wide ? ' field--wide' : '');
    wrap.innerHTML = `
      <span class="field__label">${label}${required ? ' *' : ''}</span>
      <textarea name="${name}" rows="3" placeholder="${placeholder}" ${required ? 'required' : ''}></textarea>
    `;
    return wrap;
  }
  function fieldFile(name, label) {
    const wrap = document.createElement('div');
    wrap.className = 'field field--wide';
    wrap.innerHTML = `
      <span class="field__label">${label}</span>
      <div class="tpl-form__file-wrap">
        <div class="tpl-form__file-preview" data-preview="${name}" style="display:none;"></div>
        <button type="button" class="tpl-form__file-btn" data-file-trigger="${name}">Choose image</button>
        <span class="tpl-form__file-name" data-file-name="${name}">No file chosen</span>
        <input type="file" name="${name}" accept="image/*" data-file-input="${name}" />
      </div>
    `;
    return wrap;
  }
  function fieldService(name, label) {
    const wrap = document.createElement('div');
    wrap.className = 'field field--wide';
    wrap.innerHTML = `
      <span class="field__label">${label}</span>
      <div class="tpl-form__service-row">
        <input type="text" name="${name}_name" placeholder="Service name" />
        <input type="text" name="${name}_desc" placeholder="Short one-line description" />
      </div>
    `;
    return wrap;
  }
  function fieldFeatures(name) {
    const wrap = document.createElement('div');
    wrap.className = 'field field--wide';
    wrap.dataset.features = name;
    wrap.innerHTML = `
      <span class="field__label">Features (up to 5)</span>
      <div class="tpl-form__features-list"></div>
      <button type="button" class="tpl-form__add" data-add-feature>Add another feature</button>
    `;
    const list = wrap.querySelector('.tpl-form__features-list');
    for (let i = 0; i < 3; i++) addFeatureRow(list, i);
    wrap.querySelector('[data-add-feature]').addEventListener('click', () => {
      const rows = list.querySelectorAll('.tpl-form__feature-row');
      if (rows.length < 5) addFeatureRow(list, rows.length);
    });
    return wrap;
  }
  function addFeatureRow(list, idx) {
    const row = document.createElement('div');
    row.className = 'tpl-form__feature-row';
    row.innerHTML = `
      <input type="text" name="feature_${idx}" placeholder="Feature ${idx + 1} — e.g. Made from 100% silk" />
      <button type="button" aria-label="Remove" data-remove-feature>×</button>
    `;
    row.querySelector('[data-remove-feature]').addEventListener('click', () => row.remove());
    list.appendChild(row);
  }
  function sectionHeading(label) {
    const el = document.createElement('div');
    el.className = 'tpl-form__heading';
    el.innerHTML = `<span class="tpl-form__heading-label">${label}</span><span class="tpl-form__heading-line"></span>`;
    return el;
  }
  function submitRow() {
    const row = document.createElement('div');
    row.className = 'tpl-form__submit';
    row.innerHTML = `
      <button type="submit" class="btn btn--primary" data-magnetic data-cursor="Preview →">Generate live preview →</button>
      <button type="button" class="tpl-form__cancel" data-close>Cancel</button>
      <span style="font-family:var(--serif);font-style:italic;color:var(--mute);font-size:13px;margin-left:auto;">Opens in a new tab</span>
    `;
    return row;
  }

  function openModal(type) {
    const schema = TEMPLATE_SCHEMAS[type];
    if (!schema) return;
    formEl.dataset.template = type;
    modalKicker.textContent = schema.label;
    modalType.textContent = schema.typeWord;
    formEl.innerHTML = '';
    schema.render().forEach((el) => formEl.appendChild(el));
    formEl.appendChild(submitRow());
    wireFileInputs(formEl);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (typeof lenis !== 'undefined' && lenis) lenis.stop();
    setTimeout(() => {
      const firstInput = formEl.querySelector('input[type="text"], textarea');
      if (firstInput) firstInput.focus();
    }, 280);
  }
  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (typeof lenis !== 'undefined' && lenis) lenis.start();
  }

  function wireFileInputs(root) {
    root.querySelectorAll('[data-file-input]').forEach((input) => {
      const key = input.dataset.fileInput;
      const btn = root.querySelector(`[data-file-trigger="${key}"]`);
      const nameEl = root.querySelector(`[data-file-name="${key}"]`);
      const preview = root.querySelector(`[data-preview="${key}"]`);
      if (btn) btn.addEventListener('click', () => input.click());
      input.addEventListener('change', () => {
        const file = input.files && input.files[0];
        if (!file) return;
        if (file.size > 4 * 1024 * 1024) {
          nameEl.textContent = 'Image too large (max 4MB)';
          input.value = '';
          return;
        }
        nameEl.textContent = file.name;
        const reader = new FileReader();
        reader.onload = (ev) => {
          compressImage(ev.target.result, 900, (dataUrl) => {
            input.dataset.dataUrl = dataUrl;
            if (preview) {
              preview.style.display = 'block';
              preview.style.backgroundImage = `url("${dataUrl}")`;
            }
          });
        };
        reader.readAsDataURL(file);
      });
    });
  }

  function compressImage(src, maxWidth, cb) {
    const img = new Image();
    img.onload = () => {
      const ratio = Math.min(1, maxWidth / img.width);
      const w = Math.round(img.width * ratio);
      const h = Math.round(img.height * ratio);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      cb(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = () => cb(src);
    img.src = src;
  }

  document.querySelectorAll('[data-open-tpl]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(btn.dataset.openTpl);
    });
  });
  modal.addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-close') || e.target.closest('[data-close]')) {
      closeModal();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const type = formEl.dataset.template;
    const formData = new FormData(formEl);
    const data = { template: type, createdAt: Date.now(), fields: {}, images: {} };
    for (const [k, v] of formData.entries()) {
      if (typeof v === 'string') data.fields[k] = v.trim();
    }
    if (type === 'product') {
      data.fields.featuresList = [];
      for (let i = 0; i < 5; i++) {
        const val = (data.fields[`feature_${i}`] || '').trim();
        if (val) data.fields.featuresList.push(val);
        delete data.fields[`feature_${i}`];
      }
    }
    formEl.querySelectorAll('[data-file-input]').forEach((input) => {
      if (input.dataset.dataUrl) data.images[input.dataset.fileInput] = input.dataset.dataUrl;
    });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      alert('Your image is too large for browser storage — please try a smaller one.');
      return;
    }
    closeModal();
    window.open('preview.html', '_blank');
  });

  // --------------------------------------------------------
  // 15. CONTACT FORM — fake send
  // --------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactForm.classList.add('is-sent');
      try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    });
  }
})();
