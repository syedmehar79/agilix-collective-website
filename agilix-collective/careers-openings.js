(function () {
    'use strict';

    var root = document.querySelector('[data-openings]');
    if (!root) return;

    var track = root.querySelector('[data-openings-track]');
    var searchInput = root.querySelector('[data-openings-search]');
    var prevBtn = root.querySelector('[data-openings-prev]');
    var nextBtn = root.querySelector('[data-openings-next]');
    var meta = root.querySelector('[data-openings-meta]');
    var empty = root.querySelector('[data-openings-empty]');
    var positionSelect = document.getElementById('career-position');

    var OPENINGS = [
        {
            role: 'Frontend Developer',
            type: 'Full time',
            city: 'Lahore / Remote',
            experience: '2–4 years',
            description: 'Build responsive product interfaces with modern web stacks and a strong eye for detail.'
        },
        {
            role: 'Backend Developer',
            type: 'Full time',
            city: 'Lahore',
            experience: '2–4 years',
            description: 'Design APIs and services that scale cleanly — reliability, clarity, and maintainable architecture.'
        },
        {
            role: 'UI/UX Designer',
            type: 'Full time',
            city: 'Remote',
            experience: '1–2 years',
            description: 'Shape product flows and visual systems that feel simple, purposeful, and brand-true.'
        },
        {
            role: 'QA Engineer',
            type: 'Full time',
            city: 'Lahore',
            experience: '1–2 years',
            description: 'Own quality across releases with thoughtful test plans, automation, and clear bug reports.'
        },
        {
            role: 'Intern',
            type: 'Part time',
            city: 'Lahore / Remote',
            experience: 'Fresher',
            description: 'Learn by shipping — pair with the team on real product work across design and engineering.'
        },
        {
            role: 'DevOps Engineer',
            type: 'Full time',
            city: 'Remote',
            experience: '4–6 years',
            description: 'Keep delivery smooth: CI/CD, cloud ops, observability, and pragmatic automation.'
        }
    ];

    var filtered = OPENINGS.slice();
    var index = 0;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function syncSelect(select, value) {
        if (!select) return;
        var match = Array.prototype.some.call(select.options, function (opt) {
            return opt.value === value;
        });
        if (!match) return;
        select.value = value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        var wrap = select.closest('.footer-select');
        if (!wrap) return;
        var trigger = wrap.querySelector('.footer-select-trigger');
        var menu = wrap.querySelector('.footer-select-menu');
        if (!trigger || !menu) return;
        var selected = select.options[select.selectedIndex];
        trigger.textContent = selected ? selected.textContent : '';
        trigger.classList.toggle('is-placeholder', !select.value);
        Array.prototype.forEach.call(menu.children, function (item) {
            var active = item.getAttribute('data-value') === select.value;
            item.classList.toggle('is-active', active);
            item.setAttribute('aria-selected', active ? 'true' : 'false');
        });
    }

    function applyToForm(opening) {
        syncSelect(positionSelect, opening.role);
        var form = document.querySelector('.career-form');
        if (form) {
            form.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
            window.setTimeout(function () {
                var nameField = document.getElementById('career-name');
                if (nameField) nameField.focus();
            }, reduceMotion ? 0 : 350);
        }
    }

    function renderCards() {
        if (!track) return;
        track.innerHTML = '';

        if (!filtered.length) {
            if (empty) empty.hidden = false;
            if (meta) meta.textContent = '';
            track.style.transform = 'translate3d(0,0,0)';
            if (prevBtn) prevBtn.disabled = true;
            if (nextBtn) nextBtn.disabled = true;
            return;
        }

        if (empty) empty.hidden = true;

        filtered.forEach(function (opening, i) {
            var card = document.createElement('article');
            card.className = 'career-opening-card';
            card.setAttribute('data-index', String(i));
            card.innerHTML =
                '<h4 class="career-opening-role"></h4>' +
                '<p class="career-opening-meta">' +
                '<span class="career-opening-type"></span>' +
                '<span class="career-opening-city"></span>' +
                '<span class="career-opening-exp"></span>' +
                '</p>' +
                '<p class="career-opening-desc"></p>' +
                '<button type="button" class="career-opening-apply">apply for this role</button>';

            card.querySelector('.career-opening-role').textContent = opening.role;
            card.querySelector('.career-opening-type').textContent = opening.type;
            card.querySelector('.career-opening-city').textContent = opening.city;
            card.querySelector('.career-opening-exp').textContent = opening.experience;
            card.querySelector('.career-opening-desc').textContent = opening.description;
            card.querySelector('.career-opening-apply').addEventListener('click', function () {
                applyToForm(opening);
            });
            track.appendChild(card);
        });

        index = Math.min(index, filtered.length - 1);
        updateView();
    }

    function updateView() {
        if (!filtered.length) return;
        track.style.transform = 'translate3d(-' + index * 100 + '%, 0, 0)';
        if (meta) {
            meta.textContent = index + 1 + ' / ' + filtered.length;
        }
        if (prevBtn) prevBtn.disabled = filtered.length <= 1;
        if (nextBtn) nextBtn.disabled = filtered.length <= 1;
    }

    function go(delta) {
        if (filtered.length <= 1) return;
        index = (index + delta + filtered.length) % filtered.length;
        updateView();
    }

    function filterOpenings(query) {
        var q = String(query || '').trim().toLowerCase();
        filtered = !q
            ? OPENINGS.slice()
            : OPENINGS.filter(function (item) {
                  var hay = [item.role, item.type, item.city, item.experience, item.description]
                      .join(' ')
                      .toLowerCase();
                  return hay.indexOf(q) !== -1;
              });
        index = 0;
        renderCards();
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { go(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { go(1); });

    if (searchInput) {
        var searchTimer = null;
        searchInput.addEventListener('input', function () {
            window.clearTimeout(searchTimer);
            searchTimer = window.setTimeout(function () {
                filterOpenings(searchInput.value);
            }, 120);
        });
    }

    renderCards();
})();
