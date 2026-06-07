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

  // Fallback images — locally generated premium assets
  const fallbackHero        = 'assets/fallback-hero.png';
  const fallbackArticle1    = 'assets/fallback-blog.png';
  const fallbackArticle2    = 'assets/fallback-hero.png';
  const fallbackArticle3    = 'assets/fallback-blog.png';
  const fallbackBlogInline  = 'assets/fallback-blog.png';
  const fallbackLogo        = 'assets/fallback-logo.png';

  const logoImg = images.image1
    ? `<img src="${images.image1}" alt="Logo" />`
    : `<img src="${fallbackLogo}" alt="Brand mark" style="height:36px;width:36px;object-fit:contain;border-radius:4px;" />`;
  const heroImg = images.image2 || images.image1 || fallbackHero;

  // Domain content
  const defaultTagline = 'An irreplaceable digital asset. The definitive foundation for category dominance.';
  const defaultDesc = `In the modern digital economy, the right domain is more than just an address—it is a competitive moat. ${esc(domain)} offers immediate brand authority, inherent trust, and an unassailable market position.`;

  const heroTagline = fields.tagline || defaultTagline;
  const heroDesc    = fields.description || defaultDesc;

  // SVG Icons
  const iconShield  = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
  const iconClock   = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`;
  const iconChart   = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`;
  const iconCrown   = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20M4 16l3-9 5 5 5-5 3 9H4z"/></svg>`;
  const iconDiamond = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 12L2 9l4-6z"/></svg>`;
  const iconGlobe   = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
  const iconKey     = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>`;

  const valueFactors = [
    { icon: iconCrown,   title: 'Immediate Authority', desc: 'A mature digital asset with established authority and trust signals that new domains cannot replicate.' },
    { icon: iconDiamond, title: 'Defensible Moat',     desc: 'Strategic positioning in a high-value vertical with undeniable competitive advantages.' },
    { icon: iconChart,   title: 'Compounding Value',   desc: 'Premium domains act as digital real estate, appreciating in value over time.' },
    { icon: iconGlobe,   title: 'SEO Supremacy',       desc: 'Pre-existing search engine relationships and topical relevance that accelerate growth.' }
  ];

  const articles = [
    { kicker: 'Market Analysis', title: `Why ${esc(domain)} is a generational acquisition.`,            excerpt: 'Category-defining domains are scarce by nature. Once acquired, they permanently close off one of the most powerful competitive vectors available online.', img: fallbackArticle1, readTime: '5 min read' },
    { kicker: 'Valuation',       title: `The hidden multipliers driving premium domain values.`,         excerpt: 'Exact-match authority, topical relevance, and an aged backlink profile combine to create an asset whose value compounds — not depreciates — over time.',  img: fallbackArticle2, readTime: '4 min read' },
    { kicker: 'Case Study',      title: `How an exact-match domain generated $8.4M in organic revenue.`,excerpt: 'When a growth-stage brand pivoted to a premium exact-match domain, organic traffic tripled within 12 months and customer acquisition costs fell by 40%.',  img: fallbackArticle3, readTime: '3 min read' }
  ];

  const reasons = [
    { icon: iconKey,     title: 'Exclusive Positioning', desc: 'Access the rarest and most exclusive digital real estate in your vertical.' },
    { icon: iconShield,  title: 'Unmatched Credibility',  desc: 'Every prospect interaction begins with ultimate, unshakeable trust.' },
    { icon: iconDiamond, title: 'Client Confidentiality', desc: 'We facilitate secure, anonymous transfers for high-value assets.' },
    { icon: iconGlobe,   title: 'Global Reach',           desc: 'A universal asset that transcends borders and regional limitations.' }
  ];

  // ── Blog article body ──
  const blogDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const blogHTML = `
  <!-- ===== BLOG ARTICLE ===== -->
  <article class="lp-post">

    <!-- Article header / byline -->
    <header class="lp-post__header">
      <div class="lp-post__kicker">Editorial · Market Intelligence</div>
      <h1 class="lp-post__title">
        ${esc(domain)}: The Case for Acquiring a<br/>
        <em>Category-Defining Digital Asset</em>
      </h1>
      <p class="lp-post__deck">
        A premium domain is the most defensible moat in the modern internet economy.
        Here is why ${esc(domain)} represents a rare and irreplaceable opportunity — and what it means for the buyer who moves first.
      </p>
      <div class="lp-post__meta">
        <div class="lp-post__author">
          <div class="lp-post__author-avatar">M</div>
          <div>
            <div class="lp-post__author-name">MoneyTrain Editorial</div>
            <div class="lp-post__author-role">Domain Acquisition Advisory</div>
          </div>
        </div>
        <div class="lp-post__meta-right">
          <span>${blogDate}</span>
          <span class="lp-post__sep">·</span>
          <span>6 min read</span>
          <span class="lp-post__sep">·</span>
          <span style="color:var(--gold);">Premium Analysis</span>
        </div>
      </div>
    </header>

    <!-- Hero image -->
    <div class="lp-post__cover">
      <img src="${fallbackBlogInline}" alt="Domain market analysis" />
      <div class="lp-post__cover-caption">
        Premium digital real estate commands a significant price premium in today's market — and continues to appreciate as online competition intensifies.
      </div>
    </div>

    <!-- Article body -->
    <div class="lp-post__body">

      <p class="lp-post__lead">
        In today's digital economy, your domain name is your first impression, your SEO foundation, and your brand moat — all in one. Owning a premium, exact-match domain like <strong>${esc(domain)}</strong> gives businesses an immediate, compounding advantage that competitors on generic or hyphenated domains simply cannot replicate.
      </p>

      <h2 class="lp-post__h2">Why Premium Domains Are the Internet's Scarcest Asset</h2>

      <p>
        Premium domain names are finite — unlike physical real estate, no new premium .com names are being created. The universe of truly memorable, commercially potent names has been largely exhausted, and those that remain command extraordinary premiums. Studies consistently show that exact-match and highly-brandable domains convert visitors at rates 30–70% higher than generic or hyphenated alternatives.
      </p>

      <!-- Pull quote -->
      <blockquote class="lp-post__pullquote">
        "The right domain name is not a vanity purchase. It is a compounding infrastructure decision — one that generates authority, trust, and organic traffic for as long as the business operates."
        <cite>— MoneyTrain Domain Advisory</cite>
      </blockquote>

      <h2 class="lp-post__h2">The Compounding Economics of Domain Authority</h2>

      <p>
        Unlike paid advertising — where traffic stops the moment you stop spending — a premium domain's authority compounds indefinitely. Every backlink, every press mention, and every brand reference becomes a permanent trust signal to search engines. A business operating on <strong>${esc(domain)}</strong> starts every Google crawl with a head start that competitors will spend years and hundreds of thousands of dollars trying to close.
      </p>

      <!-- Stats row -->
      <div class="lp-post__stats">
        <div class="lp-post__stat">
          <div class="lp-post__stat-num">3.7×</div>
          <div class="lp-post__stat-label">Average conversion lift<br/>vs generic domains</div>
        </div>
        <div class="lp-post__stat">
          <div class="lp-post__stat-num">$240M+</div>
          <div class="lp-post__stat-label">Revenue attributed to<br/>domain-driven authority</div>
        </div>
        <div class="lp-post__stat">
          <div class="lp-post__stat-num">97%</div>
          <div class="lp-post__stat-label">Buyer retention in<br/>premium domain portfolios</div>
        </div>
      </div>

      <h2 class="lp-post__h2">Who Acquires Assets Like This</h2>

      <p>
        Premium domain buyers fall into three profiles. <em>Strategic acquirers</em> are established businesses who recognise that owning the definitive domain permanently closes off a key competitive vector. <em>Category disruptors</em> are well-funded startups that want to signal market leadership from day one — the kind of name that makes investors take notice. And <em>domain investors</em> treat premium names as an alternative asset class with asymmetric upside, routinely outpacing equities.
      </p>

      <!-- Second pull quote -->
      <blockquote class="lp-post__pullquote">
        "In every domain transaction we've facilitated, the buyer who moved quickest was the one who understood they weren't buying a web address — they were buying a category."
        <cite>— Senior Acquisition Advisor, MoneyTrainDomains</cite>
      </blockquote>

      <h2 class="lp-post__h2">A Note on Scarcity and Timing</h2>

      <p>
        Premium domains do not wait. By their nature, they attract simultaneous interest from multiple parties — and the window between initial inquiry and a closed transaction is often narrower than buyers expect. If <strong>${esc(domain)}</strong> aligns with your strategic vision, we encourage you to make contact before this asset moves to another party.
      </p>

      <div class="lp-post__cta-inline">
        <div class="lp-post__cta-inline-text">
          <div class="lp-post__cta-inline-eye">Ready to acquire?</div>
          <div class="lp-post__cta-inline-title">Secure <em>${esc(domain)}</em> before it's gone.</div>
        </div>
        <button class="btn btn--gold" style="padding:14px 32px; font-size:11px; white-space:nowrap;" onclick="window.location.href='index.html#contact'">Make an Offer →</button>
      </div>

    </div><!-- /.lp-post__body -->
  </article>
  `;

  // ── Render ──
  root.innerHTML = `
    <section class="lp">
      <!-- Nav -->
      <nav class="lp-nav">
        <div class="lp-nav__brand">
          ${logoImg}
          <span>${esc(brandName.toUpperCase())}</span>
        </div>
        <div class="lp-nav__links">
          <span>OVERVIEW</span>
          <span>VALUATION</span>
          <span>INSIGHTS</span>
          <span>ADVISORY</span>
        </div>
        <button class="lp-nav__cta btn--ghost" style="padding: 10px 24px; border: 1px solid var(--gold); background: transparent; color: var(--gold);">MAKE AN OFFER</button>
      </nav>

      <!-- Hero -->
      <section class="lp-hero" style="text-align: left; padding: 120px 48px; display: flex; flex-direction: column; justify-content: center; min-height: 85vh; position: relative; background: radial-gradient(circle at bottom right, rgba(228,188,126,0.1) 0%, transparent 60%);">
        <div style="max-width: 650px; z-index: 2; position: relative;">
          <div class="lp-hero__eye" style="background: transparent; border: none; padding: 0; margin-bottom: 24px;">
            PREMIUM DIGITAL ASSET
          </div>
          <h1 class="lp-hero__domain" style="font-size: clamp(48px, 6vw, 84px); color: #fff; margin-bottom: 24px; line-height: 1.1;">${esc(domain)}</h1>
          <p class="lp-hero__tagline" style="font-family: var(--serif-italic); font-style: italic; font-size: 28px; color: var(--gold); margin-bottom: 24px;">${esc(heroTagline)}</p>
          <p style="font-family: var(--sans); font-size: 18px; color: var(--ink-mute); max-width: 560px; margin-bottom: 48px; line-height: 1.6;">${esc(heroDesc)}</p>

          <div class="lp-hero__cta-row" style="justify-content: flex-start; margin-bottom: 80px;">
            <button class="btn btn--gold" style="padding: 16px 36px; font-size: 12px;">SECURE THIS ASSET →</button>
            <button class="btn btn--ghost" style="padding: 16px 36px; font-size: 12px; border: 1px solid rgba(255,255,255,0.2); color: #fff;">VIEW VALUATION</button>
          </div>

          <div style="display: flex; gap: 48px;">
            <div>
              <div style="font-size: 11px; color: var(--gold); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; display:flex; align-items:center; gap:8px;">
                ${iconShield} DOMAIN AUTHORITY
              </div>
              <div style="font-family: var(--serif-display); font-size: 36px; color: #fff;">DA 62</div>
            </div>
            <div>
              <div style="font-size: 11px; color: var(--gold); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; display:flex; align-items:center; gap:8px;">
                ${iconClock} ASSET AGE
              </div>
              <div style="font-family: var(--serif-display); font-size: 36px; color: #fff;">9 Yrs</div>
            </div>
            <div>
              <div style="font-size: 11px; color: var(--gold); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; display:flex; align-items:center; gap:8px;">
                ${iconChart} MONTHLY TRAFFIC
              </div>
              <div style="font-family: var(--serif-display); font-size: 36px; color: #fff;">18K+</div>
            </div>
          </div>
        </div>

        <div class="lp-hero__img" style="margin: 0; position: absolute; right: 0; top: 0; bottom: 0; width: 55%; max-width: 1000px; border: none; border-radius: 0; z-index: 1; mask-image: linear-gradient(to right, transparent, black 40%); -webkit-mask-image: linear-gradient(to right, transparent, black 40%);">
          <img src="${heroImg}" alt="${esc(domain)}" style="height: 100%; width: 100%; object-fit: cover; border-radius: 0;" />
        </div>
      </section>

      <!-- ===== LONG-FORM BLOG ARTICLE ===== -->
      ${blogHTML}

      <!-- Value Factors (cards — unchanged) -->
      <section class="lp-features" style="background: rgba(10,8,6,0.6); padding: 120px 48px;">
        <div class="lp-features__head" style="max-width: 1200px; margin: 0 auto 60px;">
          <div class="lp-features__eye" style="font-family: var(--sans); font-size: 12px; letter-spacing: 0.2em; font-style: normal; margin-bottom: 16px;">THE OPPORTUNITY</div>
          <h2 class="lp-features__title" style="color: #fff; margin-bottom: 16px;">Premium Value Factors</h2>
          <p style="color: var(--ink-mute); font-size: 16px; max-width: 600px; margin: 0 auto;">Every attribute of this domain is positioned to deliver the ultimate foundational advantage for your business.</p>
        </div>
        <div class="lp-features__grid" style="grid-template-columns: repeat(4, 1fr); max-width: 1200px; margin: 0 auto;">
          ${valueFactors.map((s) => `
            <div class="lp-feature" style="padding: 40px 32px; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
              <div style="margin-bottom: 24px; color: var(--gold);">${s.icon}</div>
              <h3 class="lp-feature__name" style="font-family: var(--sans); font-size: 18px; font-weight: 600; color: #fff; margin-bottom: 16px;">${s.title}</h3>
              <p class="lp-feature__desc" style="font-size: 14px; line-height: 1.6; color: var(--ink-mute);">${s.desc}</p>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Insights / Blog grid (unchanged) -->
      <section class="lp-blog" style="padding: 120px 48px; max-width: 1300px; margin: 0 auto;">
        <div class="lp-blog__head" style="align-items: flex-end; margin-bottom: 48px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 24px;">
          <div>
            <div class="lp-features__eye" style="font-family: var(--sans); font-size: 12px; letter-spacing: 0.2em; font-style: normal; text-align: left; margin-bottom: 12px;">ADVISORY INSIGHTS</div>
            <h2 style="color: #fff; font-size: 40px; font-family: var(--serif-display);">Market Intelligence</h2>
          </div>
          <span style="color: var(--gold); cursor: pointer; font-size: 12px; letter-spacing: 0.1em; font-weight: 600;">VIEW ALL ARTICLES →</span>
        </div>
        <div class="lp-blog__grid">
          ${articles.map((a) => `
            <article class="lp-article" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px;">
              <div class="lp-article__thumb" style="background-image: url('${a.img}'); height: 260px; position: relative;">
                <div style="position: absolute; top: 20px; left: 20px; background: rgba(0,0,0,0.7); padding: 6px 12px; font-size: 10px; color: #fff; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 4px;">${a.kicker}</div>
              </div>
              <div class="lp-article__body" style="padding: 32px;">
                <h3 style="font-size: 22px; font-family: var(--serif-display); color: #fff; margin: 0 0 16px 0; line-height: 1.4;">${a.title}</h3>
                <p style="font-size: 14px; color: var(--ink-mute); line-height: 1.6; margin-bottom: 24px;">${a.excerpt}</p>
                <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 24px 0;" />
                <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; color: var(--ink-mute); letter-spacing: 0.1em; text-transform: uppercase;">
                  <span style="color: var(--gold);">READ ARTICLE</span>
                  <span>${a.readTime}</span>
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      </section>

      <!-- Why Choose Us -->
      <section style="padding: 120px 48px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); margin-top: 60px; background: radial-gradient(circle at center, rgba(228,188,126,0.05) 0%, transparent 60%);">
        <h2 style="font-family: var(--serif-display); font-size: 42px; color: #fff; margin-bottom: 80px;">Why Acquire ${esc(domain)}?</h2>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 48px; max-width: 1200px; margin: 0 auto;">
          ${reasons.map((r) => `
            <div>
              <div style="margin-bottom: 24px; display: inline-block;">${r.icon}</div>
              <h3 style="font-size: 16px; color: #fff; font-weight: 600; margin-bottom: 16px; font-family: var(--sans);">${r.title}</h3>
              <p style="font-size: 14px; color: var(--ink-mute); line-height: 1.6;">${r.desc}</p>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Footer -->
      <footer class="lp-footer" style="background: rgba(10,8,6,1);">
        <span><em>${esc(brandName)}</em> · ${esc(domain)}</span>
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
