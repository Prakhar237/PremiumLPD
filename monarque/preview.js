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
  const LOREM = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
    'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
    'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet consectetur.',
  ];
  function lorem(n) { return LOREM.slice(0, n || 2).join(' '); }
  function esc(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }

  const desc = (fields.description || '').trim();
  const fullDesc = desc.length > 80 ? desc : (desc ? desc + ' ' + lorem(2) : lorem(3));

  // Build features from description
  const featureNames = [
    'Premium Digital Presence', 'Authority & Trust', 'Revenue Potential',
    'Brand Recognition', 'SEO Foundation', 'Market Position'
  ];
  const featureDescs = [
    'A mature digital asset with established authority, aged trust signals, and organic search equity that new domains simply cannot replicate.',
    'Years of indexing history, natural backlink profiles, and domain authority that search engines reward with preferential ranking treatment.',
    'Immediate monetisation pathways through organic traffic, affiliate placement, lead generation, and direct brand value appreciation.',
    'A memorable, brandable name that communicates professionalism and credibility from the very first interaction with your audience.',
    'Pre-existing search engine relationships, crawl history, and topical relevance that accelerate any SEO campaign from day one.',
    'Strategic positioning in a high-value vertical with defensible competitive advantages that compound over time.'
  ];

  // ── Logo image ──
  const logoImg = images.image1 ? `<img src="${images.image1}" alt="Logo" />` : `<span class="lp-nav__brand-mark">◆</span>`;
  const heroImg = images.image2 || images.image1 || '';
  const aboutImg = images.image3 || images.image2 || '';

  // ── Blog articles ──
  const articles = [
    { kicker: 'Market Analysis', title: `Why ${esc(domain)} represents a rare acquisition opportunity in ${new Date().getFullYear()}.`, excerpt: lorem(1) },
    { kicker: 'Valuation', title: `The hidden value factors that make premium domains like ${esc(domain)} appreciate.`, excerpt: lorem(1) },
    { kicker: 'Case Study', title: `How a single premium domain generated $2.4M in attributed revenue.`, excerpt: lorem(1) },
    { kicker: 'Strategy', title: `Building a category-defining brand on a premium domain: a playbook.`, excerpt: lorem(1) },
    { kicker: 'Industry Report', title: `Domain aftermarket trends: what serious buyers are looking for in ${new Date().getFullYear()}.`, excerpt: lorem(1) },
    { kicker: 'Investment', title: `Premium domains as digital real estate: why the asset class is compounding.`, excerpt: lorem(1) },
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
        <p class="lp-hero__tagline">${esc(fields.tagline || 'A premium digital asset, positioned for its next chapter.')}</p>
        <p class="lp-hero__desc">${esc(fullDesc)}</p>
        <div class="lp-hero__cta-row">
          <button class="btn btn--gold btn--xl">Make an Offer →</button>
          <button class="btn btn--ghost btn--xl">View Valuation ↓</button>
        </div>
        ${heroImg ? `
        <div class="lp-hero__img">
          <img src="${heroImg}" alt="${esc(domain)} preview" />
        </div>` : ''}
      </section>

      <!-- Stats -->
      <section class="lp-stats">
        <div class="lp-stats__item"><div class="lp-stats__num">DA 62</div><div class="lp-stats__lbl">Domain Authority</div></div>
        <div class="lp-stats__item"><div class="lp-stats__num">9 yrs</div><div class="lp-stats__lbl">Domain Age</div></div>
        <div class="lp-stats__item"><div class="lp-stats__num">2.1k</div><div class="lp-stats__lbl">Referring Domains</div></div>
        <div class="lp-stats__item"><div class="lp-stats__num">18k</div><div class="lp-stats__lbl">Monthly Traffic</div></div>
      </section>

      <!-- About / Value -->
      <section class="lp-about">
        <div>
          <div class="lp-about__eye">— The Opportunity</div>
          <h2 class="lp-about__title">A premium name.<br/><em>An unfair advantage.</em></h2>
          <p class="lp-about__text">${esc(fullDesc)}</p>
          <br/>
          <p class="lp-about__text">${esc(lorem(2))}</p>
        </div>
        ${aboutImg ? `
        <div class="lp-about__img">
          <img src="${aboutImg}" alt="About ${esc(domain)}" />
        </div>` : `
        <div class="lp-about__img" style="background: linear-gradient(135deg, rgba(228,188,126,0.08) 0%, rgba(10,8,6,1) 100%); display:flex; align-items:center; justify-content:center;">
          <span style="font-family:var(--serif-display);font-size:64px;color:var(--gold);opacity:0.3;">◆</span>
        </div>`}
      </section>

      <!-- Features -->
      <section class="lp-features">
        <div class="lp-features__head">
          <div class="lp-features__eye">— Value Factors</div>
          <h2 class="lp-features__title">What makes this domain <em>worth it.</em></h2>
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
          Premium domains are the quiet infrastructure of category leadership. The brands that own them don't talk about it — they just compound.
        </blockquote>
        <div class="lp-testimonial__by">— MoneyTrainDomains Advisory</div>
      </section>

      <!-- CTA -->
      <section class="lp-cta">
        <h2 class="lp-cta__title">Ready to own <em>${esc(domain)}?</em></h2>
        <p class="lp-cta__sub">Serious inquiries only. We respond within one business day with full valuation details and acquisition terms.</p>
        <button class="btn btn--gold btn--xl">Make an Offer →</button>
      </section>

      <!-- Blog / SEO articles -->
      <section class="lp-blog">
        <div class="lp-blog__head">
          <h2>Insights & <em>Articles</em></h2>
          <span>From the journal</span>
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
        <span>© ${new Date().getFullYear()} — Preview built with MoneyTrainDomains</span>
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
