(function () {
    var root = document.querySelector('[data-footer-reviews]');
    var track = document.querySelector('[data-footer-review-track]');
    var prevBtn = document.querySelector('[data-footer-review-prev]');
    var nextBtn = document.querySelector('[data-footer-review-next]');
    if (!root || !track || !prevBtn || !nextBtn) return;

    var REVIEWS = [
        {
            name: 'Ammar Zafar',
            role: 'Chief Executive Officer',
            photo: '/assets/team/ammar-zafar.png',
            quote:
                'At Agilix Collective, business quality starts with clear outcomes. We stay disciplined on scope, communication, and delivery so every engagement feels professional from the first conversation to launch.'
        },
        {
            name: 'S. Mehar Ali Shah',
            role: 'Chief Technical and Operations Officer',
            photo: '/assets/team/mehar-ali-shah.png',
            quote:
                'Professionalism at Agilix means reliable systems and honest timelines. We pair strong engineering judgment with operational rigor so clients can trust both the product and the process behind it.'
        },
        {
            name: 'Waleed Mahmood',
            role: 'Senior Software Engineer (Full-Stack)',
            photo: '/assets/team/waleed-mahmood.png',
            quote:
                'Quality shows up in the details we refuse to rush. Clean architecture, careful reviews, and steady collaboration keep Agilix deliveries sharp, scalable, and ready for real business pressure.'
        },
        {
            name: 'Muhammad Tahir',
            role: 'Senior Software Engineer (Frontend)',
            photo: '/assets/team/muhammad-tahir.png',
            quote:
                'We treat every interface as part of the business experience. At Agilix, polish, accessibility, and performance are not extras — they are how we show professionalism to the people who use what we build.'
        },
        {
            name: 'Usman Ayub',
            role: 'Software Engineer (Frontend)',
            photo: '/assets/team/usman-ayub.png',
            quote:
                'Agilix stays professional by shipping thoughtfully. Clear priorities, careful craft, and consistent follow-through help us turn complex product goals into software teams can depend on.'
        },
        {
            name: 'Bilal Ahmed',
            role: 'Senior Product Designer',
            photo: '/assets/team/bilal-ahmad.png',
            quote:
                'Business quality is design that respects the user’s time and the company’s goals. At Agilix we keep experiences intentional, usable, and aligned so professionalism is visible in every screen.'
        }
    ];

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var HOLD_MS = 5500;
    var index = 0;
    var timer = null;

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function render() {
        track.innerHTML = REVIEWS.map(function (review, i) {
            return (
                '<figure class="footer-review-slide" data-index="' +
                i +
                '" aria-hidden="' +
                (i === 0 ? 'false' : 'true') +
                '">' +
                '<blockquote class="footer-review-quote">' +
                escapeHtml(review.quote) +
                '</blockquote>' +
                '<figcaption class="footer-review-author">' +
                '<img class="footer-review-photo" src="' +
                escapeHtml(review.photo) +
                '" alt="' +
                escapeHtml(review.name) +
                '" width="56" height="56" loading="lazy" decoding="async">' +
                '<div class="footer-review-meta">' +
                '<p class="footer-review-name">' +
                escapeHtml(review.name) +
                '</p>' +
                '<p class="footer-review-role">' +
                escapeHtml(review.role) +
                '</p>' +
                '</div>' +
                '</figcaption>' +
                '</figure>'
            );
        }).join('');
    }

    function goTo(next, userDriven) {
        index = ((next % REVIEWS.length) + REVIEWS.length) % REVIEWS.length;
        track.style.transform = 'translate3d(-' + index * 100 + '%, 0, 0)';

        Array.prototype.forEach.call(track.children, function (slide, i) {
            slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
        });

        if (userDriven) schedule();
    }

    function clearTimer() {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    }

    function schedule() {
        clearTimer();
        if (reduceMotion || REVIEWS.length < 2) return;
        timer = setTimeout(function () {
            goTo(index + 1, false);
            schedule();
        }, HOLD_MS);
    }

    prevBtn.addEventListener('click', function () {
        goTo(index - 1, true);
    });

    nextBtn.addEventListener('click', function () {
        goTo(index + 1, true);
    });

    root.addEventListener('mouseenter', clearTimer);
    root.addEventListener('mouseleave', schedule);
    root.addEventListener('focusin', clearTimer);
    root.addEventListener('focusout', function (e) {
        if (!root.contains(e.relatedTarget)) schedule();
    });

    document.addEventListener('visibilitychange', function () {
        if (document.hidden) clearTimer();
        else schedule();
    });

    render();
    goTo(0, false);
    schedule();
})();
