(function () {
    'use strict';

    var visual = document.querySelector('#about .about__visual-inner');
    var copy = document.querySelector('#about .about__copy');
    if (!visual && !copy) return;

    var bar = visual && visual.querySelector('.about__rectangle');
    var cards = visual && visual.querySelector('.about__illustration');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function revealCopy() {
        if (copy) copy.classList.add('is-in');
    }

    function showFinal() {
        if (visual) visual.classList.add('is-bar-in', 'is-cards-in');
        revealCopy();
    }

    if (reduceMotion) {
        showFinal();
        return;
    }

    function playSequence() {
        revealCopy();

        if (!visual || !bar || !cards) return;
        if (visual.classList.contains('is-bar-in')) return;
        visual.classList.add('is-bar-in');

        var startedCards = false;
        function startCards() {
            if (startedCards) return;
            startedCards = true;
            visual.classList.add('is-cards-in');
        }

        function onBarDone(event) {
            if (event.target !== bar) return;
            if (event.propertyName !== 'clip-path' && event.propertyName !== 'transform') return;
            bar.removeEventListener('transitionend', onBarDone);
            startCards();
        }

        bar.addEventListener('transitionend', onBarDone);
        window.setTimeout(startCards, 950);
    }

    var observeTarget = visual || copy;
    if (!('IntersectionObserver' in window)) {
        playSequence();
        return;
    }

    var observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                playSequence();
                observer.disconnect();
            });
        },
        {
            threshold: 0.25,
            rootMargin: '0px 0px -10% 0px'
        }
    );

    observer.observe(observeTarget);
})();
