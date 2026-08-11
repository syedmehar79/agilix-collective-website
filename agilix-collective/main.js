// main-slider
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
