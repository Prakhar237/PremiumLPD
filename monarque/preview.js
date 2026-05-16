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

  // ── Helpers & Premium Copywriting ──
  function esc(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }

  const defaultTagline = 'An irreplaceable digital asset. The definitive foundation for category dominance.';
  
  const defaultDesc1 = `In the modern digital economy, the right domain is more than just an address—it is a competitive moat. ${esc(domain)} offers immediate brand authority, inherent trust, and an unassailable market position. It is a rare opportunity to acquire a pristine, highly-brandable domain that signals absolute leadership to customers, investors, and competitors alike.`;
  
  const defaultDesc2 = `Owning the definitive name in your industry isn't merely an SEO advantage—it is a paradigm shift in perception. When a prospect sees this domain, credibility is established instantly. No marketing budget can simulate the trust inherently commanded by a truly premium asset. We are presenting this exclusive property to discerning buyers who understand that market dominance begins with the ultimate digital foundation.`;

  const desc = (fields.description || '').trim();
  const heroDesc = desc || defaultDesc1;
  const aboutDesc = desc ? desc + ' ' + defaultDesc2 : defaultDesc2;

  // Build features
  const featureNames = [
    'Immediate Authority', 'Defensible Moat', 'Compounding Value',
    'Frictionless Trust', 'SEO Supremacy', 'Global Recognition'
  ];
  const featureDescs = [
    'A mature digital asset with established authority and trust signals that new domains simply cannot replicate.',
    'Strategic positioning in a high-value vertical with undeniable competitive advantages that protect your market share.',
    'Premium domains act as digital real estate, appreciating in value while simultaneously reducing your long-term customer acquisition costs.',
    'A memorable, commanding name that communicates professionalism and unshakeable credibility from the very first interaction.',
    'Pre-existing search engine relationships and topical relevance that accelerate and amplify any organic growth campaign from day one.',
    'A universal asset that transcends borders, providing a unified, elite brand presence across all international markets.'
  ];

  // ── Premium Image Fallbacks ──
  // If user didn't upload images, use high-end luxury/architectural placeholders instead of blank gradients.
  const fallbackHero = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop';
  const fallbackAbout = 'https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?q=80&w=1200&auto=format&fit=crop';
  
  const logoImg = images.image1 ? `<img src="${images.image1}" alt="Logo" />` : `<span class="lp-nav__brand-mark">◆</span>`;
  const heroImg = images.image2 || images.image1 || fallbackHero;
  const aboutImg = images.image3 || images.image2 || fallbackAbout;

  // ── Blog / Insight articles ──
  const articles = [
    { kicker: 'Market Analysis', title: `Why ${esc(domain)} represents a generational acquisition opportunity.`, excerpt: 'An inside look at the metrics, the market scarcity, and the undeniable leverage of owning a category-defining name.' },
    { kicker: 'Valuation', title: `The hidden multipliers that make premium properties like ${esc(domain)} appreciate.`, excerpt: 'Understanding the intrinsic value of digital real estate in an increasingly crowded and competitive online ecosystem.' },
    { kicker: 'Case Study', title: `How a single premium domain generated $8.4M in attributed organic revenue.`, excerpt: 'A breakdown of the ROI timeline when a brand pivots from a compromised domain to a definitive, exact-match asset.' },
    { kicker: 'Strategy', title: `Building an empire on a premium domain: The definitive executive playbook.`, excerpt: 'Step-by-step strategic deployment of a high-ticket domain to maximize immediate impact and long-term equity.' },
    { kicker: 'Industry Report', title: `The flight to quality: What enterprise buyers are looking for this quarter.`, excerpt: 'Why venture capital and private equity firms are mandating premium domain acquisitions for their portfolio companies.' },
    { kicker: 'Investment', title: `Premium domains as digital gold: Why the asset class continues to outpace equities.`, excerpt: 'Analyzing the risk-adjusted returns and capital preservation characteristics of top-tier internet properties.' },
  ];

  // ── Render ──
  root.innerHTML = `
    <section class="lp">
      <!-- Nav -->
      <nav class="lp-nav">
        <div class="lp-nav__brand">
          ${logoImg}
          <span>${esc(brandName)}</span>
        </div>
        <div class="lp-nav__links">
          <span>About</span>
          <span>Value</span>
          <span>Insights</span>
          <span>Contact</span>
        </div>
        <button class="lp-nav__cta">Make an Offer →</button>
      </nav>

      <!-- Hero -->
      <section class="lp-hero">
        <div class="lp-hero__eye">
          <span class="lp-hero__eye-dot"></span>
          Premium Domain · Available for Acquisition
        </div>
        <h1 class="lp-hero__domain">${esc(domain)}</h1>
        <p class="lp-hero__tagline">${esc(fields.tagline || defaultTagline)}</p>
        <p class="lp-hero__desc">${esc(heroDesc)}</p>
        <div class="lp-hero__cta-row">
          <button class="btn btn--gold btn--xl">Make an Offer →</button>
          <button class="btn btn--ghost btn--xl">View Valuation ↓</button>
        </div>
        <div class="lp-hero__img">
          <img src="${heroImg}" alt="${esc(domain)} overview" />
        </div>
      </section>

      <!-- Stats -->
      <section class="lp-stats">
        <div class="lp-stats__item"><div class="lp-stats__num">Top 1%</div><div class="lp-stats__lbl">Brandability Score</div></div>
        <div class="lp-stats__item"><div class="lp-stats__num">9 yrs</div><div class="lp-stats__lbl">Asset Age</div></div>
        <div class="lp-stats__item"><div class="lp-stats__num">Exclusive</div><div class="lp-stats__lbl">Market Position</div></div>
        <div class="lp-stats__item"><div class="lp-stats__num">Global</div><div class="lp-stats__lbl">Reach Potential</div></div>
      </section>

      <!-- About / Value -->
      <section class="lp-about">
        <div>
          <div class="lp-about__eye">— The Opportunity</div>
          <h2 class="lp-about__title">Absolute authority.<br/><em>An unfair advantage.</em></h2>
          <p class="lp-about__text" style="font-size: 18px; color: var(--ink);">${esc(heroDesc)}</p>
          <br/>
          <p class="lp-about__text">${esc(aboutDesc)}</p>
        </div>
        <div class="lp-about__img">
          <img src="${aboutImg}" alt="Value of ${esc(domain)}" />
        </div>
      </section>

      <!-- Features -->
      <section class="lp-features">
        <div class="lp-features__head">
          <div class="lp-features__eye">— Value Factors</div>
          <h2 class="lp-features__title">What makes this asset <em>invaluable.</em></h2>
        </div>
        <div class="lp-features__grid">
          ${featureNames.map((f, i) => `
            <div class="lp-feature">
              <div class="lp-feature__num">${String(i + 1).padStart(2, '0')}</div>
              <h3 class="lp-feature__name">${f}</h3>
              <p class="lp-feature__desc">${featureDescs[i]}</p>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Testimonial -->
      <section class="lp-testimonial">
        <div class="lp-testimonial__mark">"</div>
        <blockquote class="lp-testimonial__quote">
          Premium domains are the quiet infrastructure of category leadership. The brands that own them don't talk about the advantage — they simply compound it, year after year.
        </blockquote>
        <div class="lp-testimonial__by">— MoneyTrainDomains Advisory</div>
      </section>

      <!-- CTA -->
      <section class="lp-cta">
        <h2 class="lp-cta__title">Ready to secure <em>${esc(domain)}?</em></h2>
        <p class="lp-cta__sub">We facilitate seamless, secure transfers for high-value digital assets. Serious inquiries only. We respond within one business day with full valuation details and acquisition terms.</p>
        <button class="btn btn--gold btn--xl">Submit Inquiry →</button>
      </section>

      <!-- Blog / SEO articles -->
      <section class="lp-blog">
        <div class="lp-blog__head">
          <h2>Insights & <em>Intelligence</em></h2>
          <span>From the advisory desk</span>
        </div>
        <div class="lp-blog__grid">
          ${articles.map((a, i) => `
            <article class="lp-article">
              <div class="lp-article__thumb lp-article__thumb--${(i % 6) + 1}"></div>
              <div class="lp-article__body">
                <div class="lp-article__kicker">${esc(a.kicker)} · ${3 + (i * 2)} min read</div>
                <h3 class="lp-article__title">${esc(a.title)}</h3>
                <p class="lp-article__excerpt">${esc(a.excerpt)}</p>
              </div>
            </article>
          `).join('')}
        </div>
      </section>

      <!-- Footer -->
      <footer class="lp-footer">
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
