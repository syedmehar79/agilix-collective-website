(function () {
    'use strict';

    var root = document.querySelector('[data-jobs-board]');
    if (!root) return;

    var listEl = root.querySelector('[data-jobs-list]');
    var detailEl = root.querySelector('[data-jobs-detail]');
    var searchInput = root.querySelector('[data-jobs-search]');
    var emptyEl = root.querySelector('[data-jobs-empty]');
    var countEl = root.querySelector('[data-jobs-count]');
    var positionInput = document.getElementById('career-position');
    var form = root.querySelector('.careers__form');
    var shellEl = root.querySelector('[data-jobs-shell]');
    var emptyScreenEl = root.querySelector('[data-jobs-empty-screen]');

    var OPENINGS = [
        // Add openings here when roles are available.
    ];

    var filtered = OPENINGS.slice();
    var selectedId = OPENINGS[0] ? OPENINGS[0].id : null;

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function findOpening(id) {
        for (var i = 0; i < filtered.length; i++) {
            if (filtered[i].id === id) return filtered[i];
        }
        return null;
    }

    function fillPosition(role) {
        if (!positionInput) return;
        positionInput.value = role || '';
    }

    function listItemHtml(opening, active) {
        return (
            '<button type="button" class="jobs-board__list-item' +
            (active ? ' is-active' : '') +
            '" data-job-id="' +
            escapeHtml(opening.id) +
            '" aria-pressed="' +
            (active ? 'true' : 'false') +
            '">' +
            '<span class="jobs-board__list-item-role">' +
            escapeHtml(opening.role) +
            '</span>' +
            '<span class="jobs-board__list-item-meta">' +
            escapeHtml(opening.city) +
            ' · ' +
            escapeHtml(opening.type) +
            '</span>' +
            '<span class="jobs-board__list-item-summary">' +
            escapeHtml(opening.summary) +
            '</span>' +
            '<span class="jobs-board__list-item-posted">' +
            escapeHtml(opening.posted) +
            '</span>' +
            '</button>'
        );
    }

    function detailHtml(opening) {
        var responsibilities = opening.responsibilities
            .map(function (item) {
                return '<li>' + escapeHtml(item) + '</li>';
            })
            .join('');
        var requirements = opening.requirements
            .map(function (item) {
                return '<li>' + escapeHtml(item) + '</li>';
            })
            .join('');

        return (
            '<div class="jobs-board__detail-inner">' +
            '<button type="button" class="jobs-board__detail-back" data-jobs-back>← Back to openings</button>' +
            '<p class="jobs-board__detail-eyebrow">Agilix Collective</p>' +
            '<h2 class="jobs-board__detail-role">' +
            escapeHtml(opening.role) +
            '</h2>' +
            '<p class="jobs-board__detail-meta">' +
            '<span>' +
            escapeHtml(opening.city) +
            '</span>' +
            '<span>' +
            escapeHtml(opening.type) +
            '</span>' +
            '<span>' +
            escapeHtml(opening.experience) +
            '</span>' +
            '</p>' +
            '<div class="jobs-board__detail-section">' +
            '<h3>About the role</h3>' +
            '<p>' +
            escapeHtml(opening.about) +
            '</p>' +
            '</div>' +
            '<div class="jobs-board__detail-section">' +
            '<h3>Responsibilities</h3>' +
            '<ul>' +
            responsibilities +
            '</ul>' +
            '</div>' +
            '<div class="jobs-board__detail-section">' +
            '<h3>Requirements</h3>' +
            '<ul>' +
            requirements +
            '</ul>' +
            '</div>' +
            '<div class="jobs-board__detail-section jobs-board__detail-apply-block" id="jobs-apply">' +
            '<h3>Apply for this role</h3>' +
            '<p class="jobs-board__detail-apply-lead">Share your profile and we will reach out when there is a fit.</p>' +
            '</div>' +
            '</div>'
        );
    }

    function emptyDetailHtml() {
        return (
            '<div class="jobs-board__detail-empty">' +
            '<p>Select an opening to view details.</p>' +
            '</div>'
        );
    }

    function placeForm(show) {
        if (!form) return;
        var slot = detailEl.querySelector('#jobs-apply');
        if (show && slot) {
            slot.appendChild(form);
            form.hidden = false;
        }
    }

    function renderList() {
        if (!listEl) return;

        if (countEl) {
            countEl.textContent =
                filtered.length + (filtered.length === 1 ? ' opening' : ' openings');
        }

        if (!filtered.length) {
            listEl.innerHTML = '';
            if (emptyEl) emptyEl.hidden = false;
            selectedId = null;
            renderDetail();
            return;
        }

        if (emptyEl) emptyEl.hidden = true;
        if (!findOpening(selectedId)) selectedId = filtered[0].id;

        listEl.innerHTML = filtered
            .map(function (opening) {
                return listItemHtml(opening, opening.id === selectedId);
            })
            .join('');
    }

    function renderDetail() {
        if (!detailEl) return;
        var opening = findOpening(selectedId);
        if (!opening) {
            detailEl.innerHTML = emptyDetailHtml();
            detailEl.classList.remove('is-open');
            if (form) form.hidden = true;
            fillPosition('');
            return;
        }

        detailEl.innerHTML = detailHtml(opening);
        detailEl.classList.add('is-open');
        placeForm(true);
        fillPosition(opening.role);

        var backBtn = detailEl.querySelector('[data-jobs-back]');
        if (backBtn) {
            backBtn.addEventListener('click', function () {
                root.classList.remove('is-detail-mobile');
            });
        }
    }

    function selectJob(id, fromUser) {
        selectedId = id;
        renderList();
        renderDetail();
        if (fromUser) {
            root.classList.add('is-detail-mobile');
        }
    }

    function filterJobs(query) {
        var q = String(query || '').trim().toLowerCase();
        filtered = !q
            ? OPENINGS.slice()
            : OPENINGS.filter(function (item) {
                  var hay = [
                      item.role,
                      item.type,
                      item.city,
                      item.experience,
                      item.summary,
                      item.about
                  ]
                      .join(' ')
                      .toLowerCase();
                  return hay.indexOf(q) !== -1;
              });
        renderList();
        renderDetail();
    }

    listEl.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-job-id]');
        if (!btn || !listEl.contains(btn)) return;
        selectJob(btn.getAttribute('data-job-id'), true);
    });

    if (searchInput) {
        var searchTimer = null;
        searchInput.addEventListener('input', function () {
            window.clearTimeout(searchTimer);
            searchTimer = window.setTimeout(function () {
                filterJobs(searchInput.value);
            }, 120);
        });
    }

    if (form) {
        form.hidden = true;
    }

    function setEmptyBoard(empty) {
        var noPosts = !!empty;
        root.classList.toggle('is-empty-board', noPosts);

        if (shellEl) shellEl.hidden = noPosts;
        if (emptyScreenEl) emptyScreenEl.hidden = !noPosts;

        if (noPosts) {
            root.classList.remove('is-detail-mobile');
            if (form) {
                form.hidden = true;
                if (shellEl && !shellEl.contains(form)) {
                    shellEl.appendChild(form);
                }
            }
            fillPosition('');
        }
    }

    if (!OPENINGS.length) {
        setEmptyBoard(true);
        return;
    }

    renderList();
    renderDetail();
})();

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
        // Add openings here when roles are available.
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
        var wrap = select.closest('.site-footer__select');
        if (!wrap) return;
        var trigger = wrap.querySelector('.site-footer__select-trigger');
        var menu = wrap.querySelector('.site-footer__select-menu');
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
        var form = document.querySelector('.careers__form');
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
            card.className = 'careers__opening-card';
            card.setAttribute('data-index', String(i));
            card.innerHTML =
                '<h4 class="careers__opening-role"></h4>' +
                '<p class="careers__opening-meta">' +
                '<span class="careers__opening-type"></span>' +
                '<span class="careers__opening-city"></span>' +
                '<span class="careers__opening-exp"></span>' +
                '</p>' +
                '<p class="careers__opening-desc"></p>' +
                '<button type="button" class="careers__opening-apply">apply for this role</button>';

            card.querySelector('.careers__opening-role').textContent = opening.role;
            card.querySelector('.careers__opening-type').textContent = opening.type;
            card.querySelector('.careers__opening-city').textContent = opening.city;
            card.querySelector('.careers__opening-exp').textContent = opening.experience;
            card.querySelector('.careers__opening-desc').textContent = opening.description;
            card.querySelector('.careers__opening-apply').addEventListener('click', function () {
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
