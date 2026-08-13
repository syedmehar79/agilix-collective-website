# BEM + SEO + UI bugfix — design

Date: 2026-08-14  
Status: approved  
Stack: static HTML, one `css/style.css`, vanilla JS. No package.json, no bundler, no React.

## Goal

Refactor the Agilix Collective marketing site to:

1. Consistent **BEM** class structure
2. **SEO-optimized**, semantic HTML
3. Fix **clear UI / quality bugs** found by audit

**Visual look stays the same** (colors, typography, spacing intent, layout, motion). Class names, landmarks, metadata, and defect fixes change — not the design system.

## Constraints

- Keep relative asset paths (`css/style.css`, `assets/...`, `js/...`) so `file://` and a simple static server both work
- Keep a **single** site stylesheet: `css/style.css`
- Keep vendored Owl / jQuery under `vendor/` (no npm)
- Do not rename image files on disk (e.g. `startegic.png` stays; improve `alt` only)
- Do not redesign, rewrite marketing copy for rankings, or replace carousels
- JS behavior must keep working: every renamed class used in `querySelector` / `classList` / generated HTML must be updated in the same change

## Approach

Hybrid, block-by-block:

1. Shared chrome (header, nav, footer, skip-link, back-to-top)
2. Home sections (hero → FAQ)
3. Inner pages
4. SEO metadata / schema / alts / landmarks
5. Bug pass + regression smoke

## BEM naming

Pattern: `block__element--modifier` only. No `block__el__el`.

State classes may remain short and global where already used: `is-open`, `is-active`, `is-in`, `is-menu-open`, etc.

JS-only hooks that should not be styled as BEM blocks use `data-*` attributes (preferred) or existing `id`s where needed for anchors/carousels.

### Block map

| Area | Blocks |
|---|---|
| Chrome | `skip-link`, `site-header` (if needed), `site-nav`, `site-footer`, `back-to-top` |
| Home / shared sections | `hero`, `about`, `services`, `process`, `products`, `team`, `careers`, `blogs`, `faq`, `section` |
| Shared UI | `btn`, `card`, `modal`, `float-dock` (already partially BEM) |
| Page root | `page page--about`, `page page--products`, etc. where useful |

### Rename examples

| Current | Target |
|---|---|
| `primary-nav` | `site-nav` |
| `nav-toggle` | `site-nav__toggle` |
| `nav-logo` | `site-nav__logo` |
| `banner` / `banner-text` | `hero` / `hero__copy` (section-specific variants as `about__copy`, etc. when clearer) |
| `banner-cta` | `btn` + `btn--primary` / `btn--secondary` (or `hero__cta` where section-scoped) |
| `gradient-background` | keep as layout utility **or** fold into section blocks without visual change — prefer mapping to section roots (`hero`, `services`, …) rather than inventing new look |

Exact 1:1 dictionary will be maintained during implementation; every HTML/CSS/JS occurrence of a renamed class is updated together.

## SEO and semantic HTML

### Every page

- Unique `<title>` and meta description (keep existing good copy; fill gaps only)
- Full Open Graph + Twitter set on **all** pages (today mainly home)
- Canonical URLs consistent with Vercel `cleanUrls`: prefer `/about`, `/services`, `/privacy`, `/terms` (not `/privacy.html`)
- Exactly one meaningful `<h1>` per page
- Heading order without decorative skip abuse
- Landmarks: `header` (optional wrap), `nav`, `main`, `footer`
- Content images: descriptive `alt`; decorative: `alt=""` + `aria-hidden="true"`
- Major images keep width/height (or equivalent) to limit CLS
- JSON-LD: Organization / WebSite on home; WebPage (and Article where blogs warrant) on inner pages as cheap wins

### Known SEO gaps to fix

- about / products / services lack a clear `<h1>`
- Inner pages lack OG/Twitter parity with home
- privacy/terms canonicals use `.html`
- Some process image alts are filename-like (`discovery-image`, `agile-execution`)

## UI / quality bug scope

### Must fix

- Missing / weak `h1` on listed pages
- Nested `section` inside `section` where present — flatten or change inner to `div` with BEM class
- Remove inline `onclick="topFunction()"`; bind in JS
- Canonical consistency
- Home logo should behave like other pages (link to `index.html` / home), not only `#main-content`
- After BEM renames, all JS selectors and class strings must match or features break

### Check and fix if found

- Mobile nav open/close and `aria-expanded`
- Horizontal overflow on small viewports
- In-page anchors (`#contact`, `#faq`, `#team`, `#careers`)
- Modal keyboard / focus behavior already intended by current code
- Dark theme still applies after renames

### Out of scope

- Visual redesign, new sections, new animations
- Replacing jQuery / Owl Carousel
- Renaming asset files on disk
- Adding sitemap/robots unless requested later

## File touch list

- HTML: `index.html`, `about.html`, `products.html`, `services.html`, `careers.html`, `blogs.html`, `privacy.html`, `terms.html`, `partials/float-widget.html`
- CSS: `css/style.css` (rename selectors in place; keep one file)
- JS: `js/main.js`, `js/components/*`, `js/pages/*` as needed for class/selector updates
- Docs: `README.md` structure note if class/docs mention old names

## Verification

1. Open each page via `file://` and via `python -m http.server 3000`
2. Confirm CSS loads from `css/style.css`
3. Home: nav, process, products, blogs carousel, team reel, careers strip, FAQ, float dock, forms, dark theme
4. Careers board, blogs reader, about/services reveals
5. No console errors from missing selectors
6. Spot-check mobile width (~375px) for overflow and menu
7. Validate one `h1`, landmarks, and meta tags per page

## Success

A visitor cannot tell the site was visually redesigned. Source uses BEM and cleaner semantics. SEO metadata is consistent. Listed bugs are fixed. Relative paths and single stylesheet remain.
