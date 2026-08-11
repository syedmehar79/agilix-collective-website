(function () {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var openClass = 'is-open';
    var bodyOpenClass = 'form-modal-open';
    var activeModal = null;
    var lastFocus = null;

    function getModal(key) {
        if (key === 'contact') return document.getElementById('contact-modal');
        if (key === 'careers') return document.getElementById('careers-modal');
        return null;
    }

    function getFocusable(modal) {
        if (!modal) return [];
        return Array.prototype.slice.call(
            modal.querySelectorAll(
                'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
        ).filter(function (el) {
            return !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true' && el.offsetParent !== null;
        });
    }

    function openModal(key) {
        var modal = getModal(key);
        if (!modal) return;

        if (activeModal && activeModal !== modal) {
            closeModal(activeModal, true);
        }

        lastFocus = document.activeElement;
        activeModal = modal;
        modal.hidden = false;
        modal.setAttribute('aria-hidden', 'false');
        document.documentElement.classList.add(bodyOpenClass);

        if (reduceMotion) {
            modal.classList.add(openClass);
        } else {
            requestAnimationFrame(function () {
                modal.classList.add(openClass);
            });
        }

        var focusTarget =
            modal.querySelector('[data-modal-focus]') ||
            modal.querySelector('.form-modal__close');
        if (focusTarget) {
            window.setTimeout(function () {
                focusTarget.focus();
            }, reduceMotion ? 0 : 40);
        }
    }

    function closeModal(modal, immediate) {
        if (!modal || modal.hidden) return;

        modal.classList.remove(openClass);
        modal.setAttribute('aria-hidden', 'true');

        function finish() {
            modal.hidden = true;
            if (activeModal === modal) {
                activeModal = null;
                document.documentElement.classList.remove(bodyOpenClass);
            }
            if (lastFocus && typeof lastFocus.focus === 'function') {
                lastFocus.focus();
            }
            lastFocus = null;
        }

        if (immediate || reduceMotion) {
            finish();
            return;
        }

        window.setTimeout(finish, 220);
    }

    function closeActive() {
        if (activeModal) closeModal(activeModal, false);
    }

    document.querySelectorAll('[data-open-modal]').forEach(function (trigger) {
        trigger.addEventListener('click', function (e) {
            var key = trigger.getAttribute('data-open-modal');
            if (!key || !getModal(key)) return;
            e.preventDefault();
            openModal(key);
        });
    });

    document.querySelectorAll('.form-modal').forEach(function (modal) {
        modal.querySelectorAll('[data-close-modal]').forEach(function (el) {
            el.addEventListener('click', function () {
                closeModal(modal, false);
            });
        });
    });

    document.addEventListener('keydown', function (e) {
        if (!activeModal) return;

        if (e.key === 'Escape') {
            e.preventDefault();
            closeActive();
            return;
        }

        if (e.key !== 'Tab') return;

        var focusable = getFocusable(activeModal);
        if (!focusable.length) return;

        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === first || !activeModal.contains(document.activeElement)) {
                e.preventDefault();
                last.focus();
            }
        } else if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    });
})();
