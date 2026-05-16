// ============================================================
// MONARQUE — Marquee Domain Preview renderer
// ============================================================
(function () {
  'use strict';

  const STORAGE_KEY = 'monarque_preview';
  const root = document.getElementById('previewRoot');
  const empty = document.getElementById('previewEmpty');
  const ribbonDomain = document.getElementById('ribbonDomain');
  const ribbonType = document.getElementById('ribbonType');
  const hostBtn = document.getElementById('hostBtn');
  const discardBtn = document.getElementById('discardBtn');
  const hostFloat = document.getElementById('hostFloat');
  const hostFloatBtn = document.getElementById('hostFloatBtn');

  let payload = null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) payload = JSON.parse(raw);
  } catch (err) {
    payload = null;
  }

  if (!payload || !payload.fields) {
    root.hidden = true;
    empty.hidden = false;
    hostFloat.style.display = 'none';
    return;
  }

  const { fields = {}, images = {} } = payload;
  const domain = fields.domain || 'yourdomain.com';
  const brandName = fields.brandName || domain.replace(/\.(com|io|co|net|org)$/i, '');

  document.title = `${domain} · Marquee Domain Preview`;
  ribbonDomain.textContent = domain;
  ribbonType.textContent = 'Marquee Domain Sales Page';

  // ── Helpers ──
  function esc(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }

  // Fallbacks based on user image prompt
  const fallbackHero = 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?q=80&w=2000&auto=format&fit=crop';
  const fallbackCar1 = 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=800&auto=format&fit=crop';
  const fallbackCar2 = 'https://images.unsplash.com/photo-1631269666993-3d077b941589?q=80&w=800&auto=format&fit=crop';
  const fallbackCar3 = 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=800&auto=format&fit=crop';

  const logoImg = images.image1 ? `<img src="${images.image1}" alt="Logo" />` : `<span class="lp-nav__brand-mark">◆</span>`;
  const heroImg = images.image2 || images.image1 || fallbackHero;

  // Luxora specific content
  const heroTagline = fields.tagline || 'Discover elite performance, unmatched comfort, and timeless design. Your dream car awaits.';
  const displayBrand = brandName === 'yourdomain' ? 'Luxora Motors' : brandName;

  const services = [
    { title: 'Premium Collection', desc: 'Handpicked luxury cars from the world\'s most prestigious brands.' },
    { title: 'Certified Quality', desc: 'All vehicles undergo a rigorous inspection for uncompromised quality.' },
    { title: 'Concierge Service', desc: 'Personalized assistance for a seamless and luxurious journey.' },
    { title: 'Aftercare Support', desc: 'Reliable maintenance and support long after you drive away.' }
  ];

  const cars = [
    { name: 'Aston Martin DB11', price: '$214,000', engine: '5.2L V12', hp: '606 HP', seats: '4 Seats', img: fallbackCar1 },
    { name: 'Rolls-Royce Ghost', price: '$332,000', engine: '6.75L V12', hp: '563 HP', seats: '5 Seats', img: fallbackCar2 },
    { name: 'Ferrari 812 Superfast', price: '$412,000', engine: '6.5L V12', hp: '789 HP', seats: '2 Seats', img: fallbackCar3 }
  ];

  const reasons = [
    { title: 'Exclusive Selection', desc: 'Access the rarest and most exclusive luxury vehicles.' },
    { title: 'Unmatched Quality', desc: 'Every car meets our highest standards of excellence.' },
    { title: 'Client First', desc: 'Your satisfaction and privacy are our top priorities.' },
    { title: 'Worldwide Delivery', desc: 'Delivering luxury cars to your doorstep.' }
  ];

  // ── Render ──
  root.innerHTML = `
    <section class="lp">
      <!-- Nav -->
      <nav class="lp-nav">
        <div class="lp-nav__brand">
          ${logoImg}
          <span>${esc(displayBrand.toUpperCase())}</span>
        </div>
        <div class="lp-nav__links">
          <span>HOME</span>
          <span>INVENTORY</span>
          <span>SERVICES</span>
          <span>ABOUT US</span>
          <span>CONTACT</span>
        </div>
        <button class="lp-nav__cta btn--ghost" style="padding: 10px 24px; border: 1px solid var(--gold); background: transparent; color: var(--gold);">BOOK A TEST DRIVE</button>
      </nav>

      <!-- Hero -->
      <section class="lp-hero" style="text-align: left; padding: 80px 48px 0; display: flex; flex-direction: column; position: relative;">
        <div style="max-width: 600px; z-index: 2;">
          <div class="lp-hero__eye" style="background: transparent; border: none; padding: 0; margin-bottom: 24px;">
            DRIVE THE EXTRAORDINARY
          </div>
          <h1 class="lp-hero__domain" style="font-size: clamp(52px, 6vw, 84px); color: #fff; margin-bottom: 24px; line-height: 1.1;">Luxury<br/>Redefined.</h1>
          <p class="lp-hero__tagline" style="font-family: var(--sans); font-style: normal; font-size: 16px; color: var(--ink-mute); max-width: 440px; margin-bottom: 36px; line-height: 1.6;">${esc(heroTagline)}</p>
          
          <div class="lp-hero__cta-row" style="justify-content: flex-start; margin-bottom: 60px;">
            <button class="btn btn--gold" style="padding: 12px 28px; font-size: 11px;">EXPLORE INVENTORY →</button>
            <button class="btn btn--ghost" style="padding: 12px 28px; font-size: 11px; border: 1px solid rgba(255,255,255,0.2); color: #fff;">▶ WATCH VIDEO</button>
          </div>

          <div style="display: flex; gap: 40px; margin-bottom: 40px;">
            <div>
              <div style="font-size: 10px; color: var(--gold); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px; display:flex; align-items:center; gap:6px;">
                <span style="font-size:14px;">♕</span> PREMIUM BRANDS
              </div>
              <div style="font-family: var(--serif-display); font-size: 32px; color: #fff;">50+</div>
            </div>
            <div>
              <div style="font-size: 10px; color: var(--gold); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px; display:flex; align-items:center; gap:6px;">
                <span style="font-size:14px;">♔</span> LUXURY MODELS
              </div>
              <div style="font-family: var(--serif-display); font-size: 32px; color: #fff;">100+</div>
            </div>
            <div>
              <div style="font-size: 10px; color: var(--gold); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px; display:flex; align-items:center; gap:6px;">
                <span style="font-size:14px;">웃</span> HAPPY CLIENTS
              </div>
              <div style="font-family: var(--serif-display); font-size: 32px; color: #fff;">10K+</div>
            </div>
          </div>
        </div>

        <div class="lp-hero__img" style="margin: 0; position: absolute; right: 0; bottom: 0; width: 65%; max-width: 900px; border: none; border-radius: 0; z-index: 1; mask-image: linear-gradient(to right, transparent, black 30%); -webkit-mask-image: linear-gradient(to right, transparent, black 30%);">
          <img src="${heroImg}" alt="Luxury Car" style="height: 100%; width: 100%; object-fit: cover; border-radius: 0;" />
        </div>
      </section>

      <!-- Services -->
      <section class="lp-features" style="background: rgba(10,8,6,0.6); padding-top: 100px;">
        <div class="lp-features__head">
          <div class="lp-features__eye" style="font-family: var(--sans); font-size: 10px; letter-spacing: 0.2em; font-style: normal; margin-bottom: 16px;">EXPERIENCE EXCELLENCE</div>
          <h2 class="lp-features__title" style="color: #fff; margin-bottom: 16px;">Premium Services</h2>
          <p style="color: var(--ink-mute); font-size: 14px; max-width: 400px; margin: 0 auto;">Every detail is crafted to deliver the ultimate luxury car ownership experience.</p>
        </div>
        <div class="lp-features__grid" style="grid-template-columns: repeat(4, 1fr);">
          ${services.map((s) => `
            <div class="lp-feature" style="padding: 32px 24px; background: rgba(255,255,255,0.02);">
              <div style="font-size: 32px; color: var(--gold); margin-bottom: 20px;">✧</div>
              <h3 class="lp-feature__name" style="font-family: var(--sans); font-size: 16px; font-weight: 600; color: #fff;">${s.title}</h3>
              <p class="lp-feature__desc">${s.desc}</p>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Collection -->
      <section class="lp-blog" style="padding-top: 80px;">
        <div class="lp-blog__head" style="align-items: flex-end; margin-bottom: 32px; border-bottom: none; padding-bottom: 0;">
          <div>
            <div class="lp-features__eye" style="font-family: var(--sans); font-size: 10px; letter-spacing: 0.2em; font-style: normal; text-align: left; margin-bottom: 12px;">OUR COLLECTION</div>
            <h2 style="color: #fff;">Featured Luxury Cars</h2>
          </div>
          <span style="color: var(--gold); cursor: pointer;">VIEW ALL INVENTORY →</span>
        </div>
        <div class="lp-blog__grid">
          ${cars.map((c) => `
            <article class="lp-article" style="background: rgba(255,255,255,0.03); border: none;">
              <div class="lp-article__thumb" style="background-image: url('${c.img}'); height: 220px; position: relative;">
                <div style="position: absolute; top: 16px; right: 16px; color: #fff;">♡</div>
              </div>
              <div class="lp-article__body" style="padding: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                  <h3 style="font-size: 16px; font-weight: 600; color: #fff; margin: 0;">${c.name}</h3>
                  <div style="color: var(--gold); font-family: var(--sans); font-weight: 600; font-size: 16px;">${c.price}</div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--ink-mute); text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em;">
                  <span>⚙ ${c.engine}</span>
                  <span>⚡ ${c.hp}</span>
                  <span>💺 ${c.seats}</span>
                </div>
                <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;" />
                <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 700; color: var(--ink-mute); letter-spacing: 0.1em; text-transform: uppercase;">
                  <span>VIEW DETAILS</span>
                  <span>→</span>
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      </section>

      <!-- Why Choose Us -->
      <section style="padding: 100px 48px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); margin-top: 40px; background: radial-gradient(circle at center, rgba(228,188,126,0.05) 0%, transparent 60%);">
        <h2 style="font-family: var(--serif-display); font-size: 36px; color: #fff; margin-bottom: 60px;">Why Choose ${esc(displayBrand)}?</h2>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px; max-width: 1200px; margin: 0 auto;">
          ${reasons.map((r) => `
            <div>
              <div style="font-size: 28px; color: var(--gold); margin-bottom: 20px;">✧</div>
              <h3 style="font-size: 14px; color: #fff; font-weight: 600; margin-bottom: 12px; font-family: var(--sans);">${r.title}</h3>
              <p style="font-size: 13px; color: var(--ink-mute); line-height: 1.5;">${r.desc}</p>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Footer -->
      <footer class="lp-footer" style="background: rgba(10,8,6,1);">
        <span><em>${esc(displayBrand)}</em> · ${esc(domain)}</span>
        <span>© ${new Date().getFullYear()} — Premium digital asset managed by MoneyTrain</span>
      </footer>
    </section>
  `;

  // ── Ribbon actions ──
  function goHost() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    window.location.href = 'index.html#contact';
  }
  function discard() {
    const ok = confirm('Discard this preview and return to the homepage?');
    if (!ok) return;
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    window.location.href = 'index.html';
  }
  hostBtn.addEventListener('click', goHost);
  hostFloatBtn.addEventListener('click', goHost);
  discardBtn.addEventListener('click', discard);
})();
