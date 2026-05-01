// ============================================================
// Rankora — Live preview renderer
// ============================================================
(function () {
  'use strict';

  const STORAGE_KEY = 'rankora_preview';
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

  if (!payload || !payload.template) {
    root.hidden = true;
    empty.hidden = false;
    hostFloat.style.display = 'none';
    return;
  }

  const { template, fields = {}, images = {} } = payload;
  document.title = `${fields.domain || fields.business || fields.brand || 'Your site'} · Live Preview`;
  ribbonDomain.textContent = fields.domain || 'yourdomain.com';
  const labels = {
    blog: 'Domain Blogger template',
    product: 'Product Autoblog template',
    business: 'Business template',
  };
  ribbonType.textContent = labels[template] || 'Template';

  // --------------------------------------------------------
  // Lorem Ipsum helpers (fallback content)
  // --------------------------------------------------------
  const LOREM_SENTENCES = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
    'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.',
    'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
    'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti.',
    'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur.',
  ];
  function lorem(count) {
    const n = count || 2;
    return LOREM_SENTENCES.slice(0, n).join(' ');
  }
  function padText(input, minLen, fallback) {
    const text = (input || '').trim();
    if (text.length >= (minLen || 80)) return text;
    if (!text) return fallback;
    return `${text} ${fallback}`;
  }

  function esc(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function bgImage(url) {
    if (!url) return '';
    // Use single quotes inside url() so we don't break the style="" attribute.
    const safe = String(url).replace(/'/g, "\\'");
    return `background-image: url('${safe}'); background-size: cover; background-position: center;`;
  }
  function brandName(fallback) {
    return esc(fields.title || fields.brand || fields.business || fallback);
  }

  function navBar(extraLinks) {
    const links = extraLinks || ['Journal', 'About', 'Contact'];
    return `
      <nav class="site-nav">
        <div class="site-nav__logo">
          <span class="site-nav__mark">✻</span>${brandName('Your Site')}
        </div>
        <div class="site-nav__links">
          <span>Home</span>
          ${links.map((l) => `<span>${esc(l)}</span>`).join('')}
        </div>
      </nav>
    `;
  }

  function footer() {
    return `
      <footer class="site-footer">
        <span><em>${brandName('Your Site')}</em> · ${esc(fields.domain || 'yourdomain.com')}</span>
        <span>© ${new Date().getFullYear()} — Preview built with AI-Smart Blog</span>
      </footer>
    `;
  }

  if (template === 'blog') renderBlog();
  else if (template === 'product') renderProduct();
  else if (template === 'business') renderBusiness();

  // =========================================================
  // BLOG TEMPLATE
  // =========================================================
  function renderBlog() {
    const heroBg = bgImage(images.heroImage);
    const niche = fields.niche || 'contemporary culture';
    const desc = padText(
      fields.description,
      120,
      'A small, considered publication on the craft, culture, and quiet economics of ' + niche + '. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    );
    const title = fields.title || brandName('The Quarterly');
    const tagline = fields.tagline || 'Notes, reviews and field dispatches — every Tuesday.';
    const posts = generateBlogPosts(niche, desc);
    const showForSale = !!fields.price;

    const featured = posts[0];
    const rest = posts.slice(1);

    root.innerHTML = `
      <section class="site">
        ${navBar(['Journal', 'Archive', 'Subscribe', 'Contact'])}

        ${showForSale ? `
          <div class="for-sale-bar">
            <div>
              <div class="for-sale-bar__label">★ Premium domain · For sale</div>
              <div class="for-sale-bar__dom">${esc(fields.domain || 'yourdomain.com')}</div>
              <div class="for-sale-bar__price">Asking ${esc(fields.price)} · or make an offer</div>
            </div>
            <button class="for-sale-bar__cta">Make an offer</button>
          </div>
        ` : ''}

        <section class="blog-hero">
          <div>
            <div class="blog-hero__eye">— Issue № 01 · ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
            <h1 class="blog-hero__title">${esc(title)}</h1>
            <p class="blog-hero__desc" style="margin-bottom: 12px;"><em>${esc(tagline)}</em></p>
            <p class="blog-hero__desc">${esc(desc)}</p>
          </div>
          <div class="blog-hero__image" style="${heroBg}"></div>
        </section>

        <!-- Featured story -->
        <section class="blog-featured">
          <div class="blog-featured__label">— Featured this week</div>
          <article class="blog-featured__card">
            <div class="blog-featured__img blog-post__img--1"></div>
            <div class="blog-featured__body">
              <div class="blog-featured__kicker">${esc(featured.kicker)} · ${featured.read} min read</div>
              <h2 class="blog-featured__title">${esc(featured.title)}</h2>
              <p class="blog-featured__excerpt">${esc(featured.body)}</p>
              <div class="blog-featured__meta">
                <span class="blog-featured__author">By the editors</span>
                <span class="blog-featured__dot">·</span>
                <span class="blog-featured__date">${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <button class="blog-featured__btn">Read the full piece →</button>
            </div>
          </article>
        </section>

        <!-- Categories -->
        <section class="blog-categories">
          <div class="blog-categories__head">
            <h3>Browse by <em>category</em></h3>
          </div>
          <div class="blog-categories__grid">
            ${['Essays', 'Guides', 'Interviews', 'Reviews', 'Field Notes', 'Case Studies'].map((c, i) => `
              <a class="blog-category">
                <span class="blog-category__num">№ ${String(i + 1).padStart(2, '0')}</span>
                <span class="blog-category__name">${c}</span>
              </a>
            `).join('')}
          </div>
        </section>

        <!-- Feed -->
        <section class="blog-feed">
          <div class="blog-feed__head">
            <h2>From <em>the journal</em></h2>
            <span>Updated weekly</span>
          </div>
          <div class="blog-feed__list">
            ${rest.map((p, i) => `
              <article class="blog-post">
                <div class="blog-post__img blog-post__img--${((i + 1) % 6) + 1}"></div>
                <div class="blog-post__kicker">${esc(p.kicker)} · ${p.read} min read</div>
                <h3 class="blog-post__title">${esc(p.title)}</h3>
                <p class="blog-post__excerpt">${esc(p.excerpt)}</p>
              </article>
            `).join('')}
          </div>
        </section>

        <!-- Pull quote -->
        <section class="blog-pullquote">
          <div class="blog-pullquote__mark">"</div>
          <blockquote>${esc(pullQuote(niche))}</blockquote>
          <div class="blog-pullquote__by">— The Editors</div>
        </section>

        <!-- Newsletter -->
        <section class="blog-newsletter">
          <div class="blog-newsletter__eye">— Subscribe</div>
          <h3 class="blog-newsletter__title">
            One quiet email,<br/><em>every Tuesday.</em>
          </h3>
          <p class="blog-newsletter__sub">Long-form notes, hand-picked links, and the occasional short interview. No spam, ever.</p>
          <form class="blog-newsletter__form" onsubmit="return false;">
            <input type="email" placeholder="you@domain.com" />
            <button type="submit">Subscribe →</button>
          </form>
          <div class="blog-newsletter__meta">Join 4,218 thoughtful readers · Unsubscribe any time</div>
        </section>

        ${footer()}
      </section>
    `;
  }

  // =========================================================
  // PRODUCT TEMPLATE
  // =========================================================
  function renderProduct() {
    const prodBg = bgImage(images.productImage);
    const features = (fields.featuresList && fields.featuresList.length)
      ? fields.featuresList
      : ['Thoughtfully designed, down to the last stitch', 'Premium, responsibly sourced materials', 'Backed by 1,000+ five-star reviews', 'Free shipping, free returns, always', 'A 30-day no-questions guarantee', 'Made to last — not to replace'];
    const articles = generateProductArticles(fields.productName || 'this product');
    const rating = parseFloat(fields.rating || '4.9');
    const stars = '★★★★★';
    const reviews = fields.reviewCount || '1,204';

    const productName = fields.productName || 'The Product';
    const brand = fields.brand || 'The Brand';
    const shortDesc = padText(
      fields.productDescription,
      80,
      'A beautifully considered product, made for the way you actually live. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    );
    const longDesc = lorem(3);

    root.innerHTML = `
      <section class="site">
        ${navBar(['Shop', 'Reviews', 'Guides', 'Contact'])}

        <section class="product-hero">
          <div class="product-hero__img" style="${prodBg}"></div>
          <div class="product-hero__body">
            <div class="product-hero__kicker">— ${esc(brand)} · Featured</div>
            <h1 class="product-hero__title">${esc(productName)}</h1>
            <p class="product-hero__desc">${esc(shortDesc)}</p>
            <div class="product-hero__rating">${stars} <span>${rating.toFixed(1)} · ${esc(reviews)} reviews</span></div>
            <div class="product-hero__price">
              <strong>${esc(fields.price || '$29')}</strong>
              ${fields.oldPrice ? `<s>${esc(fields.oldPrice)}</s>` : ''}
              ${fields.oldPrice ? `<span class="product-hero__save">save 40%</span>` : ''}
            </div>
            <div class="product-hero__ctas">
              <button class="biz-hero__btn biz-hero__btn--primary">Buy now →</button>
              <button class="biz-hero__btn" style="background:transparent;color:var(--ink);border:1.5px solid var(--ink);">Read the review</button>
            </div>
            <div class="product-trust">
              <span>✻ Free shipping</span>
              <span>✻ 30-day returns</span>
              <span>✻ 2-year warranty</span>
            </div>
          </div>
        </section>

        <!-- Stats strip -->
        <section class="product-stats">
          <div><strong>1,204</strong><span>five-star reviews</span></div>
          <div><strong>48 hrs</strong><span>average ship time</span></div>
          <div><strong>98%</strong><span>would buy again</span></div>
          <div><strong>30-day</strong><span>money-back guarantee</span></div>
        </section>

        <!-- Features -->
        <section class="product-features">
          <div class="product-features__head">
            <div class="product-features__eye">— Why people love it</div>
            <h2 class="product-features__title">Small details. <em>Big</em> difference.</h2>
          </div>
          <div class="product-features__list">
            ${features.map((f, i) => `
              <div class="product-feature">
                <div class="product-feature__num">№ ${String(i + 1).padStart(2, '0')}</div>
                <p class="product-feature__text">${esc(f)}</p>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- The story -->
        <section class="product-story">
          <div class="product-story__eye">— The story</div>
          <h2 class="product-story__title">Made for the <em>way you actually live.</em></h2>
          <div class="product-story__cols">
            <p>${esc(longDesc)}</p>
            <p>${esc(lorem(2))}</p>
          </div>
        </section>

        <!-- Review cards -->
        <section class="product-reviews">
          <div class="product-reviews__head">
            <div class="product-reviews__eye">— From real customers</div>
            <h2 class="product-reviews__title">What people <em>are saying.</em></h2>
          </div>
          <div class="product-reviews__grid">
            ${[
              { name: 'Marcus R.', meta: 'Verified buyer · Austin', text: 'Honestly the best purchase I made this year. The difference was immediate. Worth every dollar.' },
              { name: 'Dana P.', meta: 'Verified buyer · Brooklyn', text: 'I bought one for myself, then two more as gifts. The quality holds up and the details are thoughtful.' },
              { name: 'Priya S.', meta: 'Verified buyer · Toronto', text: 'Ordered on Monday, arrived Thursday, used it that night. Everything the reviews promised — and then some.' },
            ].map((r) => `
              <figure class="product-review">
                <div class="product-review__stars">★★★★★</div>
                <blockquote>"${r.text}"</blockquote>
                <figcaption><strong>${r.name}</strong><span>${r.meta}</span></figcaption>
              </figure>
            `).join('')}
          </div>
        </section>

        <!-- Related reading -->
        <section class="product-blog">
          <div class="product-blog__head">
            <h2>Related <em>reading</em></h2>
            <span>From our journal</span>
          </div>
          <div class="product-blog__list">
            ${articles.map((a, i) => `
              <div class="product-blog__item">
                <div class="product-blog__thumb blog-post__img--${(i % 6) + 1}"></div>
                <div class="product-blog__kicker">${esc(a.kicker)}</div>
                <h3 class="product-blog__title">${esc(a.title)}</h3>
                <p class="product-blog__excerpt">${esc(a.excerpt)}</p>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- FAQ -->
        <section class="product-faq">
          <div class="product-faq__head">
            <div class="product-faq__eye">— Questions</div>
            <h2 class="product-faq__title">Asked, <em>often.</em></h2>
          </div>
          <div class="product-faq__list">
            ${[
              { q: 'How long does shipping take?', a: 'Most orders ship within 48 hours. Domestic delivery lands in 2–4 business days. International 5–9 days.' },
              { q: 'What is your return policy?', a: 'Thirty days, no questions asked. Keep the packaging, and we handle the return label.' },
              { q: 'Is there a warranty?', a: 'Yes — a full two-year warranty against manufacturing defects. We repair or replace, our choice, always free.' },
              { q: 'Do you offer gift wrapping?', a: 'Every order ships in our recycled-card gift sleeve at no cost. A handwritten note can be added at checkout.' },
            ].map((f) => `
              <details class="product-faq__item">
                <summary>${esc(f.q)}</summary>
                <p>${esc(f.a)}</p>
              </details>
            `).join('')}
          </div>
        </section>

        <!-- Closing CTA -->
        <section class="product-closer">
          <h2>Ready to try <em>${esc(productName)}?</em></h2>
          <p>Free shipping. 30-day returns. Two-year warranty. The only risk is loving it.</p>
          <button class="biz-hero__btn biz-hero__btn--primary">Buy now — ${esc(fields.price || '$29')} →</button>
        </section>

        ${footer()}
      </section>
    `;
  }

  // =========================================================
  // BUSINESS TEMPLATE
  // =========================================================
  function renderBusiness() {
    const services = [1, 2, 3]
      .map((i) => ({
        name: fields[`service${i}_name`],
        desc: fields[`service${i}_desc`],
      }))
      .filter((s) => s.name);
    const allServices = services.length ? services : [
      { name: 'Service One', desc: 'A short description of what this service is and who it is for.' },
      { name: 'Service Two', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
      { name: 'Service Three', desc: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    ];

    const aboutText = padText(
      fields.about,
      150,
      'We are a small, careful team that cares about doing things right the first time. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    );
    const hasTestimonial = !!fields.testimonialQuote;
    const testimonialQuote = fields.testimonialQuote || 'They showed up on time, did exactly what they said they would, and left things cleaner than they found them. I cannot ask for more than that.';
    const testimonialAuthor = fields.testimonialAuthor || 'A very happy customer';

    const businessName = fields.business || 'Your Business';
    const tagline = fields.tagline || 'Craft, care, and a guarantee you can count on.';

    root.innerHTML = `
      <section class="site">
        ${navBar(['Services', 'About', 'Reviews', 'Contact'])}

        <section class="biz-hero">
          <div class="biz-hero__eye">— Established · Licensed &amp; insured</div>
          <h1 class="biz-hero__title">${esc(businessName)}</h1>
          <p class="biz-hero__tagline"><em>${esc(tagline)}</em></p>
          <div class="biz-hero__ctas">
            <button class="biz-hero__btn biz-hero__btn--primary">Book a service →</button>
            <button class="biz-hero__btn biz-hero__btn--ghost">Get a free quote</button>
          </div>
        </section>

        <!-- Trust numbers -->
        <section class="biz-stats">
          <div><strong>12+ yrs</strong><span>doing this</span></div>
          <div><strong>2,400+</strong><span>jobs delivered</span></div>
          <div><strong>4.9 / 5</strong><span>customer rating</span></div>
          <div><strong>24 hr</strong><span>response time</span></div>
        </section>

        <section class="biz-about">
          <div class="biz-about__label">About the business</div>
          <p class="biz-about__text">${esc(aboutText)}</p>
        </section>

        <section class="biz-services">
          <div class="biz-services__head">
            <div class="biz-services__eye">— What we do</div>
            <h2 class="biz-services__title">Our <em>services</em>.</h2>
          </div>
          <div class="biz-services__list">
            ${allServices.map((s, i) => `
              <div class="biz-service">
                <div class="biz-service__num">№ ${String(i + 1).padStart(2, '0')}</div>
                <h3 class="biz-service__name">${esc(s.name)}</h3>
                <p class="biz-service__desc">${esc(s.desc || lorem(1))}</p>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Process -->
        <section class="biz-process">
          <div class="biz-process__head">
            <div class="biz-process__eye">— How it works</div>
            <h2 class="biz-process__title">A <em>calm</em>, predictable process.</h2>
          </div>
          <div class="biz-process__list">
            ${[
              { t: 'Reach out', d: 'Tell us about the job. A quick call or form is all it takes.' },
              { t: 'Free estimate', d: 'A clear, written estimate — no surprises, no pressure.' },
              { t: 'We get to work', d: 'Booked, scheduled, and done on time. You stay informed the whole way.' },
              { t: 'Lasting guarantee', d: 'We stand behind every job with a full workmanship guarantee.' },
            ].map((s, i) => `
              <div class="biz-process-step">
                <div class="biz-process-step__num">${['I', 'II', 'III', 'IV'][i]}.</div>
                <h3>${s.t}</h3>
                <p>${s.d}</p>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Testimonial -->
        <section class="biz-testimonial">
          <div class="biz-testimonial__inner">
            <div class="biz-testimonial__mark">"</div>
            <blockquote class="biz-testimonial__quote">${esc(testimonialQuote)}</blockquote>
            <div class="biz-testimonial__author">— ${esc(testimonialAuthor)}</div>
          </div>
        </section>

        <!-- Reviews strip -->
        <section class="biz-reviews">
          <div class="biz-reviews__head">
            <div class="biz-reviews__eye">— What customers say</div>
            <h2 class="biz-reviews__title">Reviews that <em>keep us honest.</em></h2>
          </div>
          <div class="biz-reviews__grid">
            ${[
              { name: 'Dana P.', text: 'Professional, on time, and fairly priced. The job was done right the first time.' },
              { name: 'Marcus R.', text: 'These folks care about their craft. You can tell from the second they show up.' },
              { name: 'Priya S.', text: 'Honest, clear pricing, no upsell. Will use them for every job going forward.' },
            ].map((r) => `
              <figure class="biz-review">
                <div class="biz-review__stars">★★★★★</div>
                <blockquote>"${r.text}"</blockquote>
                <figcaption>— ${r.name}</figcaption>
              </figure>
            `).join('')}
          </div>
        </section>

        <!-- Contact -->
        <section class="biz-contact">
          <div class="biz-contact__left">
            <h3>Let's <em>work together.</em></h3>
            <p>Reach out below — we reply within the same business day.</p>
          </div>
          <ul class="biz-contact__list">
            ${fields.phone ? `<li><strong>Phone</strong><span>${esc(fields.phone)}</span></li>` : `<li><strong>Phone</strong><span>+1 (555) 012-3456</span></li>`}
            ${fields.email ? `<li><strong>Email</strong><span>${esc(fields.email)}</span></li>` : `<li><strong>Email</strong><span>hello@${esc((fields.domain || 'yourcompany.com').replace(/^www\./, ''))}</span></li>`}
            ${fields.address ? `<li><strong>Address</strong><span>${esc(fields.address)}</span></li>` : `<li><strong>Address</strong><span>123 Main Street · Your City</span></li>`}
            ${fields.hours ? `<li><strong>Hours</strong><span>${esc(fields.hours)}</span></li>` : `<li><strong>Hours</strong><span>Mon–Fri · 9am–6pm</span></li>`}
          </ul>
        </section>

        ${footer()}
      </section>
    `;
  }

  // =========================================================
  // Mock content generators
  // =========================================================
  function generateBlogPosts(niche, description) {
    const n = niche || 'the craft';
    const excerpt = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    const body = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
    return [
      { kicker: 'Essay', read: 6, title: `Why ${n} is quietly having a moment.`, excerpt, body },
      { kicker: 'Guide', read: 9, title: `The complete beginner's guide to ${n}.`, excerpt, body },
      { kicker: 'Case Study', read: 7, title: `Inside a breakout year for ${n}.`, excerpt, body },
      { kicker: 'Interview', read: 11, title: `The person rewriting the rules of ${n}.`, excerpt, body },
      { kicker: 'Review', read: 5, title: `Seven tools worth paying for in ${n}.`, excerpt, body },
      { kicker: 'Field Notes', read: 4, title: `What ${n} looked like this month.`, excerpt, body },
      { kicker: 'Opinion', read: 8, title: `The slow, inevitable return of ${n}.`, excerpt, body },
      { kicker: 'Analysis', read: 12, title: `Inside the unlikely economics of ${n}.`, excerpt, body },
      { kicker: 'Essay', read: 5, title: `On patience, practice, and ${n}.`, excerpt, body },
    ];
  }
  function generateProductArticles(product) {
    const p = product || 'this product';
    return [
      { kicker: 'Review', title: `Is ${p} worth the hype? A 30-day test.`, excerpt: 'We lived with it for a month. Here is what we actually think.' },
      { kicker: 'Guide', title: `How to get the most out of ${p}.`, excerpt: 'Four small habits that unlock the real value.' },
      { kicker: 'Comparison', title: `${p} vs. the alternatives — a fair read.`, excerpt: 'No sponsorships, no fluff — just an honest look at the landscape.' },
    ];
  }
  function pullQuote(niche) {
    return `The best ${niche} is often the kind you never hear shouting. It finds you slowly — and then it stays.`;
  }

  // =========================================================
  // Ribbon actions
  // =========================================================
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
