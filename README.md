# PremiumLPD — Rankora &amp; Monarque

A single deployable repo that serves two landing pages from one origin, picked at runtime based on the visiting hostname.

```
.
├── index.html           # Hostname-based router (entry point)
├── rankora/             # Rankora — editorial cream/red landing page
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   ├── preview.html     # Live template preview (blog/business/product)
│   ├── preview.css
│   └── preview.js
└── monarque/            # Monarque — premium dark/gold high-ticket landing page
    ├── index.html
    ├── styles.css
    └── script.js
```

## How routing works

When a visitor hits the root, [`index.html`](./index.html) runs a tiny client-side router:

1. Reads `window.location.hostname`
2. Compares it against the `ROUTES` map (see top of the script)
3. Redirects to either `rankora/index.html` or `monarque/index.html`
4. A `?site=rankora` or `?site=monarque` query param overrides the host check (handy for testing)
5. Falls back to **Rankora** if nothing matches (e.g. localhost or GitHub Pages preview)

## Connecting your domains

Open [`index.html`](./index.html) and edit the `ROUTES` map at the top of the inline script. Add your real domains as substrings:

```js
var ROUTES = {
  rankora:  ['rankora.com', 'www.rankora.com'],
  monarque: ['monarque.com', 'www.monarque.com']
};
```

That's it. Point both domains at this deploy (e.g. via the same Netlify / Vercel / Cloudflare Pages site, or via a single GitHub Pages site with two custom-domain CNAMEs) and each domain will load its respective landing page.

## Local preview

```bash
python3 -m http.server 8080
# http://localhost:8080/                 → Rankora (default fallback)
# http://localhost:8080/?site=monarque   → Monarque
# http://localhost:8080/rankora/         → Rankora directly
# http://localhost:8080/monarque/        → Monarque directly
```

## Deploy

Any static host works:

- **GitHub Pages** — enable in repo settings, point each domain via CNAME (note: GitHub Pages only serves one CNAME per repo, so use Netlify/Vercel/Cloudflare for two domains).
- **Netlify / Vercel / Cloudflare Pages** — connect this repo, then add both custom domains to the same project. The router handles the rest.
