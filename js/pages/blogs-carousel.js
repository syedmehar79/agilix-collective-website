(function () {
    var viewport = document.querySelector('[data-blogs-viewport]');
    var track = document.querySelector('[data-blogs-track]');
    var prevBtn = document.querySelector('[data-blogs-prev]');
    var nextBtn = document.querySelector('[data-blogs-next]');
    if (!viewport || !track || !prevBtn || !nextBtn) return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function stepSize() {
        var item = track.querySelector('.blog-item');
        if (!item) return viewport.clientWidth;
        var styles = window.getComputedStyle(track);
        var gap = parseFloat(styles.columnGap || styles.gap) || 20;
        return item.getBoundingClientRect().width + gap;
    }

    function updateButtons() {
        var maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
        var left = viewport.scrollLeft;
        var atStart = left <= 2;
        var atEnd = left >= maxScroll - 2;

        prevBtn.disabled = atStart;
        nextBtn.disabled = atEnd;
        prevBtn.setAttribute('aria-disabled', atStart ? 'true' : 'false');
        nextBtn.setAttribute('aria-disabled', atEnd ? 'true' : 'false');
    }

    function scrollByDir(dir) {
        viewport.scrollBy({
            left: dir * stepSize(),
            behavior: reduceMotion ? 'auto' : 'smooth'
        });
    }

    prevBtn.addEventListener('click', function () {
        scrollByDir(-1);
    });
    nextBtn.addEventListener('click', function () {
        scrollByDir(1);
    });

    viewport.addEventListener('scroll', updateButtons, { passive: true });
    window.addEventListener('resize', updateButtons);

    updateButtons();
})();
