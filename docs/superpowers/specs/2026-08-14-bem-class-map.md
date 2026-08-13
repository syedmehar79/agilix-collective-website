# BEM class map

This is the living rename dictionary for the BEM + SEO + UI bugfix implementation.

## Shared chrome

| Old | New |
|---|---|
| `skip-link` | `skip-link` (keep) |
| `primary-nav` | `site-nav` |
| `nav-logo` | `site-nav__logo` |
| `nav-toggle` | `site-nav__toggle` |
| `nav-toggle-icon` | `site-nav__toggle-icon` |
| `nav-mobile-panel` | `site-nav__panel` |
| `nav-mobile-panel-inner` | `site-nav__panel-inner` |
| `nav-left` | `site-nav__cluster site-nav__cluster--left` |
| `nav-right` | `site-nav__cluster site-nav__cluster--right` |
| `#myBtn` / back-to-top button | `back-to-top` with `id="back-to-top"` |
| `footer-scroll-anchor` | `site-footer__scroll-anchor` |
| `footer-inner` | `site-footer__inner` |
| `footer-cta` | `site-footer__cta` |
| `footer-eyebrow` | `site-footer__eyebrow` |
| `footer-heading` | `site-footer__heading` |
| `footer-cta-text` | `site-footer__cta-text` |
| `footer-review` | `site-footer__review` |
| `footer-review-viewport` | `site-footer__review-viewport` |
| `footer-review-track` | `site-footer__review-track` |
| `footer-review-slide` | `site-footer__review-slide` |
| `footer-review-quote` | `site-footer__review-quote` |
| `footer-review-author` | `site-footer__review-author` |
| `footer-review-photo` | `site-footer__review-photo` |
| `footer-review-meta` | `site-footer__review-meta` |
| `footer-review-name` | `site-footer__review-name` |
| `footer-review-role` | `site-footer__review-role` |
| `footer-review-nav` | `site-footer__review-nav` |
| `footer-review-btn` | `site-footer__review-btn` |
| `footer-review-btn--next` | `site-footer__review-btn--next` |
| `footer-form` | `site-footer__form` |
| `footer-form-grid` | `site-footer__form-grid` |
| `footer-field` | `site-footer__field` |
| `footer-field--full` | `site-footer__field--full` |
| `footer-label` | `site-footer__label` |
| `footer-form-row` | `site-footer__form-row` |
| `footer-select` | `site-footer__select` |
| `footer-select-native` | `site-footer__select-native` |
| `footer-select-trigger` | `site-footer__select-trigger` |
| `footer-select-menu` | `site-footer__select-menu` |
| `footer-select-option` | `site-footer__select-option` |
| `footer-form-button` | `site-footer__form-button` |
| `footer-form-status` | `site-footer__form-status` |
| `footer-consent` | `site-footer__consent` |
| `footer-consent-label` | `site-footer__consent-label` |
| `footer-honey` | `site-footer__honey` |
| `footer-rule` | `site-footer__rule` |
| `footer-nav-row` | `site-footer__nav-row` |
| `footer-columns` | `site-footer__columns` |
| `footer-col` | `site-footer__col` |
| `footer-col-title` | `site-footer__col-title` |
| `footer-links` | `site-footer__links` |
| `footer-link-underline` | `site-footer__link-underline` |
| `footer-slogan` | `site-footer__slogan` |
| `footer-brand` | `site-footer__brand` |
| `footer-brand-logo` | `site-footer__brand-logo` |
| `footer-bottom` | `site-footer__bottom` |
| `footer-copy` | `site-footer__copy` |
| `footer-social` | `site-footer__social` |
| `footer-social-link` | `site-footer__social-link` |

The footer root remains `site-footer`. Existing `data-footer-*` attributes and form-control IDs/labels such as `footer-name` remain unchanged.

## Home sections

| Old | New |
|---|---|
| `gradient-background` (home hero) | `hero` |
| `banner` / `banner-text` (home hero) | `hero__body` / `hero__copy` |
| `tagline` / `section-slogan` | `hero__tagline` / `hero__slogan` |
| `banner-visual` / `banner-visual-inner` | `hero__visual` / `hero__visual-inner` |
| `banner-cta-group` | `hero__actions` or `about__actions` |
| `banner-cta` | `btn btn--primary` |
| `banner-cta banner-cta--secondary` | `btn btn--secondary` |
| `gradient-process-background` / `about-banner` | `about` / `about__body` |
| `about-agilix` / `about-image` / `about-visual-inner` | `about__copy` / `about__visual` / `about__visual-inner` |
| `section-header` / `section-label` | `section__header` / `section__label` |
| `gradient-background` + inner `services` | `services` + `services__body` |
| `services-grid` / `services-grid-2` | `services__grid` / `services__grid--two` |
| `service-detail` / `service-icon` / `service-list` | `services__item` / `services__icon` / `services__list` |
| `gradient-process-background` + `our-process` | `process` + `process__body` |
| `process-*` | `process__*` (one-to-one suffix mapping) |
| `products-grid` / `product-card` | `products__grid` / `products__card` |
| `product-card-{variant}` | `products__card--{variant}` |
| `product-*` card elements | `products__*` |
| `our-team` / `team-section-*` | `team` / `team__*` |
| `slider-viewport` / `slider-track` / `team-card*` | `team__viewport` / `team__track` / `team__card*` |
| `career-section` / `career-*` | `careers` / `careers__*` |
| `blogs-section` / `blogs-*` / `blog-*` | `blogs` / `blogs__*` |
| `faq-section` / `faq-*` | `faq` / `faq__*` |

`css/style.css` temporarily uses dual `:is(.old, .new)` selectors for legacy inner-page and modal markup. Task 3 should remove the old selector branches after those pages adopt the BEM classes. Careers form JavaScript also accepts both `.career-*` and `.careers__*` selectors until the shared inner-page/modal markup is migrated.
