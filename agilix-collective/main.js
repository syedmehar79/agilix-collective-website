// main-slider
if (typeof jQuery !== 'undefined') {
    $(document).ready(function () {
        var $slider = $('#slider-3');
        if ($slider.length) {
            $slider.owlCarousel({
                loop: true,
                items: 3,
                autoplay: true,
                margin: 20,
                autoHeight: false,
                nav: false,
                responsive: {
                    0: {
                        items: 1
                    },
                    768: {
                        items: 2
                    }
                }
            });

            $('.nav-btn.prev').on('click', function () {
                $slider.trigger('prev.owl.carousel');
            });

            $('.nav-btn.next').on('click', function () {
                $slider.trigger('next.owl.carousel');
            });
        }
    });
}

function scrollFunction() {
    var mybutton = document.getElementById('myBtn');
    if (!mybutton) return;
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = 'block';
    } else {
        mybutton.style.display = 'none';
    }
}

window.addEventListener('scroll', scrollFunction, { passive: true });

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

// Process section — steps slide in one-by-one (1 → 5)
(function initProcessSlides() {
    var container = document.getElementById('process-section');
    if (!container) return;

    var slides = container.querySelectorAll('.process-slide');
    var endLine = container.querySelector('.process-end-line');
    var SLIDE_DURATION = 700;
    var GAP = 150;
    var played = false;

    function showEndLine() {
        container.classList.add('is-complete');
        if (endLine) endLine.classList.add('is-visible');
    }

    function revealAll() {
        container.classList.add('is-started', 'is-complete');
        slides.forEach(function (slide) {
            slide.classList.add('is-active');
        });
        if (endLine) endLine.classList.add('is-visible');
    }

    function playSequence() {
        if (played) return;
        played = true;
        container.classList.add('is-started');

        slides.forEach(function (slide, index) {
            setTimeout(function () {
                slide.classList.add('is-active');
                // Wait for step 5's slide-in to finish before unlocking overflow
                // (overflow:visible during the animation makes it emerge from the page left).
                if (index === slides.length - 1) {
                    setTimeout(showEndLine, SLIDE_DURATION);
                }
            }, index * (SLIDE_DURATION + GAP));
        });
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        revealAll();
        return;
    }

    if (!('IntersectionObserver' in window)) {
        playSequence();
        return;
    }

    var observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    playSequence();
                    observer.disconnect();
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(container);
})();

// Mobile navigation toggle (≤768px only)
(function initMobileNav() {
    var nav = document.getElementById('primary-nav');
    var toggle = nav && nav.querySelector('.nav-toggle');
    if (!nav || !toggle) return;

    var mobileQuery = window.matchMedia('(max-width: 768px)');

    function setMenuOpen(open) {
        nav.classList.toggle('is-menu-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        document.body.classList.toggle('nav-menu-open', open);
    }

    toggle.addEventListener('click', function () {
        if (!mobileQuery.matches) return;
        setMenuOpen(!nav.classList.contains('is-menu-open'));
    });

    nav.querySelectorAll('.nav-left a, .nav-right a').forEach(function (link) {
        link.addEventListener('click', function () {
            setMenuOpen(false);
        });
    });

    function onViewportChange() {
        if (!mobileQuery.matches) {
            setMenuOpen(false);
        }
    }

    window.addEventListener('resize', onViewportChange);
    if (mobileQuery.addEventListener) {
        mobileQuery.addEventListener('change', onViewportChange);
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('is-menu-open')) {
            setMenuOpen(false);
            toggle.focus();
        }
    });
})();

// Active top-nav indicator (current page / in-page section)
(function initActiveNav() {
    var nav = document.getElementById('primary-nav');
    if (!nav) return;

    var links = Array.prototype.slice.call(
        nav.querySelectorAll('.nav-left a, .nav-right a')
    );
    if (!links.length) return;

    var SECTION_IDS = ['about', 'products', 'services'];
    var PAGE_IDS = ['about', 'products', 'services', 'careers', 'blogs'];

    function pathName() {
        return (location.pathname || '/').replace(/\\/g, '/').toLowerCase();
    }

    function currentPageId() {
        var path = pathName();
        for (var i = 0; i < PAGE_IDS.length; i++) {
            var id = PAGE_IDS[i];
            var htmlRe = new RegExp('\\/' + id + '\\.html$');
            var cleanRe = new RegExp('\\/' + id + '\\/?$');
            if (htmlRe.test(path) || cleanRe.test(path)) return id;
        }
        return '';
    }

    function isHomePage() {
        var path = pathName();
        return (
            path === '/' ||
            /\/index\.html$/.test(path) ||
            /\/index\/?$/.test(path) ||
            path === ''
        );
    }

    function linkSectionId(link) {
        var href = link.getAttribute('href') || '';
        try {
            var url = new URL(href, location.href);
            var hash = (url.hash || '').replace(/^#/, '');
            if (SECTION_IDS.indexOf(hash) !== -1) return hash;
        } catch (e) {}
        return '';
    }

    function isPageLink(link, pageId) {
        var href = (link.getAttribute('href') || '').toLowerCase();
        if (href.indexOf(pageId + '.html') !== -1) return true;
        try {
            var url = new URL(href, location.href);
            var path = (url.pathname || '').replace(/\\/g, '/').toLowerCase();
            if (path === '/' + pageId || path === '/' + pageId + '/') return true;
            if (path.slice(-('/' + pageId + '.html').length) === '/' + pageId + '.html') return true;
        } catch (e) {}
        return linkSectionId(link) === pageId;
    }

    function isCareersLink(link) {
        return isPageLink(link, 'careers');
    }

    function clearActive() {
        links.forEach(function (link) {
            link.classList.remove('is-active');
            link.removeAttribute('aria-current');
        });
    }

    function setActiveLink(activeLink) {
        clearActive();
        if (!activeLink) return;
        activeLink.classList.add('is-active');
        activeLink.setAttribute('aria-current', 'page');
    }

    function setActiveBySection(sectionId) {
        var match = null;
        links.forEach(function (link) {
            if (linkSectionId(link) === sectionId) match = link;
        });
        if (sectionId === 'careers' && !match) {
            links.forEach(function (link) {
                if (isCareersLink(link)) match = link;
            });
        }
        setActiveLink(match);
    }

    var pageId = currentPageId();
    if (pageId) {
        var pageLink = null;
        links.forEach(function (link) {
            if (isPageLink(link, pageId)) pageLink = link;
        });
        setActiveLink(pageLink);
        return;
    }

    if (!isHomePage()) {
        clearActive();
        return;
    }

    var sections = SECTION_IDS.map(function (id) {
        return document.getElementById(id);
    }).filter(Boolean);

    function updateFromScroll() {
        if (!sections.length) {
            if (location.hash) {
                setActiveBySection(location.hash.replace(/^#/, ''));
            }
            return;
        }

        var marker = window.scrollY + Math.min(160, window.innerHeight * 0.28);
        var current = sections[0].id;

        sections.forEach(function (section) {
            if (section.offsetTop <= marker) current = section.id;
        });

        setActiveBySection(current);
    }

    var scrollTimer = null;
    function onScroll() {
        window.clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(updateFromScroll, 40);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('hashchange', function () {
        var id = location.hash.replace(/^#/, '');
        if (SECTION_IDS.indexOf(id) !== -1) setActiveBySection(id);
        else updateFromScroll();
    });

    updateFromScroll();
})();
