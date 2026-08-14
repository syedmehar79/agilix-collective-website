# Agilix Collective Website

Local mirror of **[agilixcollective.com](https://agilixcollective.com)** — static HTML, CSS, and JavaScript.

**Slogan:** Intend · Execute · Achieve

## Brand colors

- **Agilix Collective:** `#B20000`
- **Trace (product):** `#4E3162`

## Run locally

No install step. No `package.json`.

**Option A — open the file**

Open `index.html` in your browser (double-click or drag into a tab). Styles and scripts use relative paths (`css/...`, `js/...`), so this works without a server.

**Option B — simple static server** (avoids some `file://` limits for scripts/partials)

```bash
python -m http.server 3000
```

Then open **http://localhost:3000**

## Structure

- `index.html`, `about.html`, `products.html`, `services.html`, `careers.html`, `blogs.html`, `privacy.html`, `terms.html` — pages (URLs stay at the site root)
- `css/style.css` — site styles (single stylesheet)
- `js/` — `main.js`, `components/`, `pages/`
- `assets/` — `icons/`, `images/`, `team/`, `blogs/`
- `vendor/` — jQuery and Owl Carousel (vendored files, not npm)
- `partials/float-widget.html` — float dock markup for inner pages
- `vercel.json` — hosting redirects and headers (optional for local viewing)
