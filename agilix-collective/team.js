(function () {
    var track = document.getElementById('track');
    var viewport = document.getElementById('viewport');
    var prevBtn = document.getElementById('prevBtn');
    var nextBtn = document.getElementById('nextBtn');
    if (!track || !viewport || !prevBtn || !nextBtn) {
        return;
    }

    /* =====================================================
       TEAM DATA — edit name / role / photo as needed
    ===================================================== */
    var TEAM = [
        { name: 'Ammar Zafar', role: 'Chief Executive Officer', photo: './agilix-collective/assets/team/ammar-zafar.png' },
        { name: 'S. Mehar Ali Shah', role: 'Chief Technical and Operations Officer', photo: './agilix-collective/assets/team/mehar-ali-shah.png' },
        { name: 'Waleed Mahmood', role: 'Senior Software Engineer (Full-Stack)', photo: './agilix-collective/assets/team/waleed-mahmood.png' },
        { name: 'Muhammad Tahir', role: 'Senior Software Engineer (Frontend)', photo: './agilix-collective/assets/team/muhammad-tahir.png' },
        { name: 'Usman Ayub', role: 'Software Engineer (Frontend)', photo: './agilix-collective/assets/team/usman-ayub.png' },
        { name: 'Bilal Ahmed', role: 'Senior Product Designer', photo: './agilix-collective/assets/team/bilal-ahmad.png' }
    ];

    var GAP = 20;
    /* 2 advances per 10s → 5s between slides (hold + roll) */
    var HOLD_MS = 4250;
    var ROLL_MS = 750;
    var COPIES = 3;
    var N = TEAM.length;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Design reference sizes (desktop) */
    var DESIGN = {
        inactiveW: 300,
        activeW: 500,
        inactiveH: 600,
        activeH: 640
    };

    /* physical index in the middle copy */
    var physicalIdx = N;
    var animating = false;
    var animToken = 0;
    var paused = false;
    var autoTimer = null;
    var cards = [];

    function sizes() {
        var w = window.innerWidth;
        /* Scale down proportionally on smaller screens; keep design ratio */
        if (w <= 480) {
            return { inactiveW: 150, activeW: 250, inactiveH: 300, activeH: 320 };
        }
        if (w <= 768) {
            return { inactiveW: 180, activeW: 300, inactiveH: 360, activeH: 384 };
        }
        if (w <= 1100) {
            return { inactiveW: 220, activeW: 360, inactiveH: 440, activeH: 470 };
        }
        return {
            inactiveW: DESIGN.inactiveW,
            activeW: DESIGN.activeW,
            inactiveH: DESIGN.inactiveH,
            activeH: DESIGN.activeH
        };
    }

    function logicalOf(physical) {
        return ((physical % N) + N) % N;
    }

    function buildCard(member, physical) {
        var card = document.createElement('article');
        card.className = 'team-card';
        card.dataset.physical = String(physical);
        card.setAttribute('role', 'group');
        card.setAttribute('aria-roledescription', 'slide');
        card.setAttribute('aria-label', member.name + ', ' + member.role);

        card.innerHTML =
            '<div class="team-card-info">' +
            '<p class="team-card-role">' + member.role + '</p>' +
            '<p class="team-card-name">' + member.name + '</p>' +
            '</div>' +
            '<div class="team-card-media">' +
            '<img class="team-card-photo" src="' + member.photo + '" alt="' + member.name + '" draggable="false" loading="lazy" decoding="async">' +
            '</div>';

        return card;
    }

    /* Invisible swap onto the middle copy (same person). Used only before
       auto/arrow steps when a prior click left us on an outer copy. */
    function remountToMiddle() {
        var mid = normalizePhysical(physicalIdx);
        if (mid === physicalIdx) return;

        track.classList.add('is-jumping', 'is-remounting');
        physicalIdx = mid;
        applyActive(physicalIdx);
        track.style.transform = 'translate3d(' + centerX(physicalIdx) + 'px, 0, 0)';
        void track.offsetWidth;
        track.classList.remove('is-jumping', 'is-remounting');
    }

    function activateCard(card) {
        if (!card || !track.contains(card)) return false;
        /* Use the clicked copy's physical index so the reel moves toward
           that visible card (left/right), not the sequential middle-copy path.
           Do NOT remount after click — that remount caused neighbor blinks. */
        var target = Number(card.dataset.physical);
        if (isNaN(target) || target === physicalIdx) return false;

        animToken += 1;
        animating = false;
        goToPhysical(target, true);
        return true;
    }

    /* Triple the deck so the reel can roll forever without reversing */
    for (var copy = 0; copy < COPIES; copy++) {
        for (var i = 0; i < N; i++) {
            var card = buildCard(TEAM[i], copy * N + i);
            track.appendChild(card);
            cards.push(card);
        }
    }

    function centerX(idx) {
        var s = sizes();
        var left = 0;
        for (var i = 0; i < idx; i++) {
            left += s.inactiveW + GAP;
        }
        return viewport.clientWidth / 2 - (left + s.activeW / 2);
    }

    function applyActive(idx) {
        var s = sizes();
        track.style.gap = GAP + 'px';
        /* Keep FAQ stable: viewport height never follows mid-transition card heights */
        viewport.style.height = (s.activeH + 44) + 'px';
        cards.forEach(function (card, i) {
            var on = i === idx;
            card.classList.toggle('is-active', on);
            card.setAttribute('aria-hidden', on ? 'false' : 'true');
            card.style.width = (on ? s.activeW : s.inactiveW) + 'px';
            card.style.height = (on ? s.activeH : s.inactiveH) + 'px';
        });
    }

    function setTransform(x, withTransition) {
        if (!withTransition) {
            track.classList.add('is-jumping');
            track.style.transform = 'translate3d(' + x + 'px, 0, 0)';
            void track.offsetWidth;
            track.classList.remove('is-jumping');
        } else {
            track.style.transform = 'translate3d(' + x + 'px, 0, 0)';
        }
    }

    /* Keep the active slide inside the middle copy for seamless looping */
    function normalizePhysical(idx) {
        return N + logicalOf(idx);
    }

    function goToPhysical(idx, animate) {
        if (animating && animate) return;

        physicalIdx = idx;
        applyActive(physicalIdx);

        var x = centerX(physicalIdx);
        if (!animate || reduceMotion) {
            setTransform(x, false);
            return;
        }

        animating = true;
        var token = ++animToken;
        setTransform(x, true);

        window.setTimeout(function () {
            if (token === animToken) {
                animating = false;
            }
        }, ROLL_MS + 40);
    }

    function step(dir) {
        if (animating) return;

        /* Clicks may leave the active index on an outer copy; re-seat onto
           the middle copy first so the existing loop logic below still applies. */
        if (physicalIdx < N || physicalIdx >= 2 * N) {
            remountToMiddle();
        }

        /*
          Seamless loop:
          Before leaving the middle copy, silently jump to the same
          person in another copy, then animate one step.
          That avoids a visible snap when Ammar comes around again.
        */
        if (dir > 0 && physicalIdx === 2 * N - 1) {
            // Last card of middle copy → jump to last of first copy, then go next
            goToPhysical(N - 1, false);
            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    goToPhysical(N, true);
                });
            });
            return;
        }

        if (dir < 0 && physicalIdx === N) {
            // First card of middle copy → jump to first of third copy, then go prev
            goToPhysical(2 * N, false);
            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    goToPhysical(2 * N - 1, true);
                });
            });
            return;
        }

        goToPhysical(physicalIdx + dir, true);
    }

    function clearRoll() {
        clearTimeout(autoTimer);
        autoTimer = null;
    }

    function scheduleRoll() {
        clearRoll();
        if (paused || reduceMotion) return;
        autoTimer = setTimeout(function () {
            step(1);
            scheduleRoll();
        }, HOLD_MS + ROLL_MS);
    }

    viewport.addEventListener('mouseenter', function () {
        paused = true;
        clearRoll();
    });
    viewport.addEventListener('mouseleave', function () {
        paused = false;
        scheduleRoll();
    });

    prevBtn.addEventListener('click', function () {
        step(-1);
        scheduleRoll();
    });
    nextBtn.addEventListener('click', function () {
        step(1);
        scheduleRoll();
    });

    /* Drag / swipe — reel feel.
       Note: pointer capture retargets events to the viewport, so card
       activation is handled on pointerup (not click). */
    var pointerX = 0;
    var dragging = false;
    var startTransform = 0;
    var dragMoved = false;
    var pressCard = null;
    var activePointerId = null;

    function readX() {
        var m = /translate3d\((-?\d+(?:\.\d+)?)px/.exec(track.style.transform || '');
        return m ? parseFloat(m[1]) : centerX(physicalIdx);
    }

    viewport.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        dragging = true;
        dragMoved = false;
        activePointerId = e.pointerId;
        pressCard = e.target.closest ? e.target.closest('.team-card') : null;
        pointerX = e.clientX;
        startTransform = readX();
        track.classList.add('is-jumping');
        clearRoll();
        try {
            viewport.setPointerCapture(e.pointerId);
        } catch (err) { /* ignore */ }
    });

    viewport.addEventListener('pointermove', function (e) {
        if (!dragging || e.pointerId !== activePointerId) return;
        var dx = e.clientX - pointerX;
        if (Math.abs(dx) > 8) dragMoved = true;
        if (dragMoved) {
            track.style.transform = 'translate3d(' + (startTransform + dx) + 'px, 0, 0)';
        }
    });

    function endDrag(e) {
        if (!dragging) return;
        if (e && activePointerId != null && e.pointerId !== activePointerId) return;

        dragging = false;
        track.classList.remove('is-jumping');

        var dx = e ? e.clientX - pointerX : 0;
        var threshold = 48;
        var card = pressCard;
        pressCard = null;
        activePointerId = null;

        if (dragMoved && dx <= -threshold) {
            step(1);
            scheduleRoll();
            return;
        }
        if (dragMoved && dx >= threshold) {
            step(-1);
            scheduleRoll();
            return;
        }

        if (!dragMoved && card && activateCard(card)) {
            scheduleRoll();
            return;
        }

        /* Cancelled drag or click on already-active card — snap back */
        goToPhysical(physicalIdx, dragMoved);
        scheduleRoll();
    }

    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);

    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            goToPhysical(physicalIdx, false);
        }, 80);
    });

    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            clearRoll();
        } else if (!paused) {
            scheduleRoll();
        }
    });

    goToPhysical(physicalIdx, false);
    scheduleRoll();
})();
