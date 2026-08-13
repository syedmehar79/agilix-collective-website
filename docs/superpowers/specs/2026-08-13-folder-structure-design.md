# Folder structure refactor — design

Date: 2026-08-13  
Status: approved  
Stack: static HTML, CSS, and JavaScript. No React, no bundler, no static generator.

## Goal

Reorganize the live Agilix Collective site into a standard vanilla-web layout. The site must look and behave the same. Page URLs stay `/`, `/about`, `/services`, `/products`, `/careers`, `/blogs`, `/privacy`, `/terms`.

## Constraints

- HTML pages stay at the repo root so Vercel `cleanUrls` keep current routes.
- No build step. Browsers load CSS and JS as separate files.
- Nav and footer stay duplicated in each HTML file (vanilla standard).
- Do not restyle, rewrite copy, or convert hardcoded colors to CSS variables in this pass.
- Do not change JavaScript behavior except path strings and combining files that already no-op when their DOM is missing.

## Target tree

```
/
  index.html
  about.html
  products.html
  services.html
  careers.html
  blogs.html
  privacy.html
  terms.html

  css/
    base.css
    layout.css
    components.css
    pages/
      home.css
      about.css
      services.css
      careers.css
      blogs.css
      products.css
      legal.css

  js/
    main.js
    components/
      faq.js
      form-modals.js
      site-widget.js
      float-dock.js
      footer-reviews.js
    pages/
      about.js
      blogs.js
      blogs-data.js
      blogs-carousel.js
      careers.js
      services.js
      team.js

  assets/
    images/
    team/
    blogs/
    reviews/
    icons/

  vendor/
    jquery/
      jquery.min.js
    owl-carousel/
      owl.carousel.min.js
      owl.carousel.min.css
      owl.theme.default.min.css

  partials/
    float-widget.html
```

`partials/` is required. `site-widget.js` fetches the float dock HTML on pages that do not already inline it.

## Path mapping

Replace every `/agilix-collective/...` and `./agilix-collective/...` site asset with the new root-absolute path. Do not change external URLs (LinkedIn, WhatsApp, Trace product site).

| From | To |
|---|---|
| `/agilix-collective/style.css` | split files under `/css/` (see CSS load order) |
| `/agilix-collective/main.js` | `/js/main.js` |
| `/agilix-collective/faq.js` | `/js/components/faq.js` |
| `/agilix-collective/form-modals.js` | `/js/components/form-modals.js` |
| `/agilix-collective/site-widget.js` | `/js/components/site-widget.js` |
| `/agilix-collective/float-dock.js` | `/js/components/float-dock.js` |
| `/agilix-collective/footer-reviews.js` | `/js/components/footer-reviews.js` |
| `/agilix-collective/about-visual.js` | `/js/pages/about.js` |
| `/agilix-collective/blogs-data.js` | `/js/pages/blogs-data.js` |
| `/agilix-collective/blogs-page.js` | `/js/pages/blogs.js` |
| `/agilix-collective/blogs-carousel.js` | `/js/pages/blogs-carousel.js` |
| `/agilix-collective/careers-board.js` + `careers-openings.js` | `/js/pages/careers.js` (concatenate in that order) |
| `/agilix-collective/services-reveal.js` | `/js/pages/services.js` |
| `/agilix-collective/team.js` | `/js/pages/team.js` |
| `/agilix-collective/partials/float-widget.html` | `/partials/float-widget.html` |
| `/agilix-collective/jQuery/jquery.min.js` | `/vendor/jquery/jquery.min.js` |
| `/agilix-collective/OwlCarousel2-2.3.4/dist/owl.carousel.min.js` | `/vendor/owl-carousel/owl.carousel.min.js` |
| `/agilix-collective/OwlCarousel2-2.3.4/dist/assets/owl.carousel.min.css` | `/vendor/owl-carousel/owl.carousel.min.css` |
| `/agilix-collective/OwlCarousel2-2.3.4/dist/assets/owl.theme.default.min.css` | `/vendor/owl-carousel/owl.theme.default.min.css` |

### Images

| From | To |
|---|---|
| `agilix-logo.svg`, `favicon.svg`, `trace-logo.svg`, `trace-favicon.ico`, `trace-favicon.png`, `trace-nav-icon.svg` | `/assets/icons/` |
| All other files in `agilix-collective/assets/` root (hero, process, product, about shots) | `/assets/images/` |
| `agilix-collective/assets/team/` | `/assets/team/` |
| `agilix-collective/assets/blogs/` | `/assets/blogs/` |
| `agilix-collective/assets/reviews/` | `/assets/reviews/` |

Normalize `team.js` photo paths from `./agilix-collective/assets/team/...` to `/assets/team/...`.

Update `og:image` on `index.html` to `https://agilixcollective.com/assets/images/hero-illustration.png`.

## CSS split

Source: `agilix-collective/style.css` (~7,100 lines). Walk it top to bottom. Assign each comment-delimited block to exactly one destination file using the ownership table. Keep blocks in original order inside each destination file.

### Ownership

| Destination | Owns |
|---|---|
| `css/base.css` | `*`, `html`, `body`, skip-link, shared type/box defaults |
| `css/layout.css` | `.gradient-background` shell, primary nav, mobile nav, back-to-top, footer, page chrome |
| `css/components.css` | Buttons, cards used on 2+ pages, FAQ, forms, modals, float dock, team reel, testimonials |
| `css/pages/home.css` | Home-only hero, about-on-home, process, slogan, home section blends |
| `css/pages/about.css` | `.about-page` rules |
| `css/pages/services.css` | `.services-page` rules and “Services page — extra sections” |
| `css/pages/careers.css` | Careers section and jobs board |
| `css/pages/blogs.css` | Home blogs strip extras that are blogs-page-only, plus `.blogs` page rules |
| `css/pages/products.css` | Product grid (used on home and products page) and `.products-page` / inner-page product rules |
| `css/pages/legal.css` | Privacy and terms article layout |

### Hard rules

1. Do not reorder CSS relative to today’s cascade except by placing a block into its owner file.
2. If a single `@media` or `html[data-theme="dark"]` block contains mixed selectors, keep the **entire** block in `components.css`. Do not split one at-rule across files.
3. The large `/* Dark theme */` block that starts near line 5356 stays together in `components.css`.
4. If ownership is unclear, put the block in `components.css`. Do not guess.
5. Do not introduce CSS variables or rewrite hex colors.

### CSS load order

Every page:

```html
<link rel="stylesheet" href="/css/base.css">
<link rel="stylesheet" href="/css/layout.css">
<link rel="stylesheet" href="/css/components.css">
```

Then page sheets:

| Page | Extra CSS |
|---|---|
| `index.html` | `pages/home.css`, `pages/products.css`, `pages/blogs.css`, vendor Owl CSS |
| `about.html` | `pages/about.css` |
| `products.html` | `pages/products.css` |
| `services.html` | `pages/services.css` |
| `careers.html` | `pages/careers.css` |
| `blogs.html` | `pages/blogs.css` |
| `privacy.html`, `terms.html` | `pages/legal.css` |

## JavaScript

Move files; update only path strings. Combine careers scripts into one file because both already exit when their nodes are missing.

`site-widget.js` must load:

- partial: `/partials/float-widget.html`
- `/js/components/faq.js`
- `/js/components/form-modals.js`
- `/js/components/float-dock.js`

`float-widget.html` image paths must use `/assets/icons/`.

### Script tags per page

| Page | Scripts (in this order) |
|---|---|
| `index.html` | vendor jQuery, vendor Owl, `main.js`, `faq.js`, `form-modals.js`, `careers.js`, `team.js`, `blogs-carousel.js`, `float-dock.js`, `footer-reviews.js`, `services.js`, `about.js` |
| `about.html` | `main.js`, `about.js`, `site-widget.js` |
| `products.html` | `main.js`, `site-widget.js` |
| `services.html` | `main.js`, `services.js`, `faq.js`, `site-widget.js` |
| `careers.html` | `main.js`, `faq.js`, `careers.js`, `team.js`, `site-widget.js` |
| `blogs.html` | `main.js`, `blogs-data.js`, `blogs.js`, `site-widget.js` |
| `privacy.html`, `terms.html` | `main.js`, `site-widget.js` |

## Redirects

Add 308 redirects in `vercel.json` so cached or bookmarked old files still resolve.

Asset redirects (more specific first):

```
/agilix-collective/assets/team/:path*        → /assets/team/:path*
/agilix-collective/assets/blogs/:path*       → /assets/blogs/:path*
/agilix-collective/assets/reviews/:path*     → /assets/reviews/:path*
/agilix-collective/assets/favicon.svg        → /assets/icons/favicon.svg
/agilix-collective/assets/agilix-logo.svg    → /assets/icons/agilix-logo.svg
/agilix-collective/assets/trace-logo.svg     → /assets/icons/trace-logo.svg
/agilix-collective/assets/trace-favicon.png  → /assets/icons/trace-favicon.png
/agilix-collective/assets/trace-favicon.ico  → /assets/icons/trace-favicon.ico
/agilix-collective/assets/trace-nav-icon.svg → /assets/icons/trace-nav-icon.svg
/agilix-collective/assets/:path*             → /assets/images/:path*
```

Script redirects: one 308 per old JS path to its new path (see Path mapping).

Vendor redirects:

```
/agilix-collective/jQuery/jquery.min.js → /vendor/jquery/jquery.min.js
/agilix-collective/OwlCarousel2-2.3.4/dist/owl.carousel.min.js → /vendor/owl-carousel/owl.carousel.min.js
/agilix-collective/OwlCarousel2-2.3.4/dist/assets/owl.carousel.min.css → /vendor/owl-carousel/owl.carousel.min.css
/agilix-collective/OwlCarousel2-2.3.4/dist/assets/owl.theme.default.min.css → /vendor/owl-carousel/owl.theme.default.min.css
```

Partial: `/agilix-collective/partials/float-widget.html` → `/partials/float-widget.html`.

Do not redirect `/agilix-collective/style.css`. One old file cannot map to the new CSS set. Live HTML will link the new sheets. No leftover shim file.

## Delete after the move

- Root `styles.css` (unused)
- Root `script.js` (unused)
- Root `assets/` (unused duplicate tree; live images come from `agilix-collective/assets/`)
- `index-live-temp.html`
- Entire `agilix-collective/` directory once every live reference is gone

Do not copy unused root `assets/` files (client SVGs, `J-C.png`, placeholder SVGs) into the new tree.

## Config and docs

- `bs-config.js`: watch `css/**`, `js/**`, `assets/**`, `vendor/**`, `partials/**`, `*.html`. Stop watching `agilix-collective/**`.
- `README.md`: document the new tree and `npm run dev`.
- `vercel.json`: keep `cleanUrls` and security header; add the redirects above.
- Deploy hooks already match `html|css|js|svg|png|...` by extension. No hook change unless a path is hardcoded.

## Out of scope

- Visual redesign
- Extracting nav/footer into includes
- Replacing jQuery / Owl Carousel
- Adding a bundler or framework
- Rewriting CSS to custom properties
- Changing production copy, forms, or analytics

## Verification

1. `npm run dev` serves `http://localhost:3000`.
2. Open every root page. Confirm layout, images, favicon, and footer.
3. Home: process animation, products grid, blogs carousel, team reel, FAQ, float dock, forms, dark theme toggle.
4. Careers: jobs board and team reel.
5. Blogs: article list/detail from `blogs-data.js`.
6. About / Services: page-specific visuals and reveals.
7. Privacy / Terms: readable article layout.
8. Repo search: no remaining `/agilix-collective/` or `./agilix-collective/` references except Vercel redirect sources and this spec.
9. `agilix-collective/` directory is gone.

## Success

A visitor cannot tell the site was reorganized. The repo is a standard HTML/CSS/JS tree. Dead files are gone. Production URLs are unchanged.
