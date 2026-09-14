(function () {
    'use strict';

    var root = document.querySelector('[data-trace-slider]');
    if (!root) return;

    var slides = root.querySelectorAll('[data-trace-slide]');
    var prevBtn = root.querySelector('[data-trace-prev]');
    var nextBtn = root.querySelector('[data-trace-next]');
    var dotsWrap = root.querySelector('[data-trace-dots]');
    var statusEl = root.querySelector('[data-trace-status]');
    var gotoBtns = document.querySelectorAll('[data-trace-goto]');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var index = 0;
    var timer = null;
    var intervalMs = 7000;
    var inView = true;
    var hovering = false;

    if (!slides.length) return;

    function titleOf(slide) {
        var title = slide.querySelector('.products__features-slide-title');
        return title ? title.textContent.replace(/\s+/g, ' ').trim() : '';
    }

    function goTo(nextIndex) {
        var total = slides.length;
        index = ((nextIndex % total) + total) % total;

        var i;
        for (i = 0; i < total; i += 1) {
            var on = i === index;
            slides[i].classList.toggle('is-active', on);
            slides[i].setAttribute('aria-hidden', on ? 'false' : 'true');
        }

        for (i = 0; i < gotoBtns.length; i += 1) {
            var onBtn = Number(gotoBtns[i].getAttribute('data-trace-goto')) === index;
            gotoBtns[i].classList.toggle('is-active', onBtn);
            if (onBtn) {
                gotoBtns[i].setAttribute('aria-current', 'true');
            } else {
                gotoBtns[i].removeAttribute('aria-current');
            }
        }

        if (dotsWrap) {
            var dots = dotsWrap.querySelectorAll('button');
            for (i = 0; i < dots.length; i += 1) {
                var onDot = i === index;
                dots[i].classList.toggle('is-active', onDot);
                dots[i].setAttribute('aria-current', onDot ? 'true' : 'false');
            }
        }

        if (statusEl) {
            statusEl.textContent = titleOf(slides[index]) + ' (' + (index + 1) + ' of ' + total + ')';
        }
    }

    function stopTimer() {
        if (timer) {
            window.clearInterval(timer);
            timer = null;
        }
    }

    function startTimer() {
        stopTimer();
        if (reduceMotion || !inView || hovering || slides.length < 2) return;
        timer = window.setInterval(function () {
            goTo(index + 1);
        }, intervalMs);
    }

    if (dotsWrap) {
        dotsWrap.addEventListener('click', function (event) {
            var target = event.target;
            while (target && target !== dotsWrap && !(target.getAttribute && target.getAttribute('data-trace-dot'))) {
                target = target.parentNode;
            }
            if (!target || !target.getAttribute) return;
            var n = Number(target.getAttribute('data-trace-dot'));
            if (isNaN(n)) return;
            goTo(n);
            startTimer();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            goTo(index - 1);
            startTimer();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            goTo(index + 1);
            startTimer();
        });
    }

    var g;
    for (g = 0; g < gotoBtns.length; g += 1) {
        gotoBtns[g].addEventListener('click', function (event) {
            var n = Number(event.currentTarget.getAttribute('data-trace-goto'));
            if (isNaN(n)) return;
            goTo(n);
            startTimer();
        });
    }

    root.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            goTo(index - 1);
            startTimer();
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            goTo(index + 1);
            startTimer();
        }
    });

    root.addEventListener('mouseenter', function () {
        hovering = true;
        stopTimer();
    });
    root.addEventListener('mouseleave', function () {
        hovering = false;
        startTimer();
    });
    root.addEventListener('focusin', function () {
        hovering = true;
        stopTimer();
    });
    root.addEventListener('focusout', function (event) {
        if (root.contains(event.relatedTarget)) return;
        hovering = false;
        startTimer();
    });

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            inView = !!(entries[0] && entries[0].isIntersecting);
            if (inView) startTimer();
            else stopTimer();
        }, { threshold: 0.35 });
        observer.observe(root);
    }

    root.classList.add('is-ready');
    goTo(0);
    startTimer();
})();
