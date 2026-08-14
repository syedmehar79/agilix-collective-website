# Agilix Collective Website

Local mirror of **[agilixcollective.com](https://agilixcollective.com)** — static HTML, CSS, and JavaScript.

**Slogan:** Intend · Execute · Achieve

## Brand colors

- **Agilix Collective:** `#B20000`
- **Trace (product):** `#4E3162`

## Run locally

No install step. No `package.json`.

**Option A — open the file**

Open `index.html` in your browser. Styles and scripts use relative paths (`agilix-collective/css/...`, `agilix-collective/js/...`).

**Option B — simple static server** (needed for inner-page float widget)

```bash
python -m http.server 3000
```

Then open **http://localhost:3000**

## Structure

- HTML pages at the site root: `index.html`, `about.html`, `products.html`, `services.html`, `careers.html`, `blogs.html`, `privacy.html`, `terms.html`
- `agilix-collective/css/style.css` — site styles
- `agilix-collective/js/` — scripts
- `agilix-collective/assets/` — icons, images, team, blogs
- `agilix-collective/vendor/` — jQuery and Owl Carousel
- `agilix-collective/partials/float-widget.html` — float dock for inner pages
- `.htaccess` — Hostinger clean URLs and old-path redirects

## Deploy on Hostinger

Upload into `public_html` like this:

```
public_html/
  index.html
  about.html
  ...
  .htaccess
  agilix-collective/
    css/
    js/
    assets/
    vendor/
    partials/
```

Name the folder exactly **`agilix-collective`** (not `agillixcollective`).

1. hPanel → File Manager → `public_html`
2. Put all HTML pages and `.htaccess` in `public_html`
3. Put `css`, `js`, `assets`, `vendor`, and `partials` inside `public_html/agilix-collective/`
4. Do not upload `.git` or `.cursor`
