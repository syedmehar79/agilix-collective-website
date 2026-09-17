'use strict';

(function () {
    var STORAGE_KEY = 'agilix-page-loader';
    var barEl = null;
    var rootEl = null;
    var leaveTimer = null;

    function preferReducedMotion() {
        try {
            return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        } catch (e) {
            return false;
        }
    }

    function ensureLoader() {
        if (rootEl) return rootEl;
        rootEl = document.createElement('div');
        rootEl.className = 'page-loader';
        rootEl.setAttribute('aria-hidden', 'true');
        barEl = document.createElement('span');
        barEl.className = 'page-loader__bar';
        rootEl.appendChild(barEl);
        if (document.body) {
            document.body.appendChild(rootEl);
        } else {
            document.addEventListener('DOMContentLoaded', function () {
                if (rootEl && !rootEl.parentNode) {
                    document.body.appendChild(rootEl);
                }
            });
        }
        return rootEl;
    }

    function normalizePath(pathname) {
        var path = pathname || '/';
        if (path.length > 1 && path.charAt(path.length - 1) === '/') {
            path = path.slice(0, -1);
        }
        if (path === '/index.html' || path === 'index.html') {
            path = '/';
        }
        if (/\.html$/i.test(path)) {
            path = path.replace(/\.html$/i, '');
            if (path === '/index' || path === 'index') {
                path = '/';
            }
        }
        if (!path) {
            path = '/';
        }
        return path;
    }

    function samePage(url) {
        return (
            normalizePath(url.pathname) === normalizePath(window.location.pathname) &&
            (url.search || '') === (window.location.search || '')
        );
    }

    function isInternalPageNav(anchor, event) {
        if (!anchor || !anchor.getAttribute) return false;
        if (event.defaultPrevented) return false;
        if (event.button && event.button !== 0) return false;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;

        var hrefAttr = anchor.getAttribute('href');
        if (!hrefAttr || hrefAttr === '#' || hrefAttr.charAt(0) === '#') return false;
        if (/^(mailto:|tel:|javascript:)/i.test(hrefAttr)) return false;
        if (anchor.getAttribute('download') != null) return false;

        var target = (anchor.getAttribute('target') || '').toLowerCase();
        if (target && target !== '_self') return false;

        var url;
        try {
            url = new URL(anchor.href, window.location.href);
        } catch (e) {
            return false;
        }

        if (url.origin !== window.location.origin) return false;
        if (samePage(url) && url.hash) return false;
        if (samePage(url)) return false;

        return true;
    }

    function startLeave() {
        ensureLoader();
        try {
            sessionStorage.setItem(STORAGE_KEY, '1');
        } catch (e) {}
        rootEl.classList.remove('is-done', 'is-leaving');
        void rootEl.offsetWidth;
        rootEl.classList.add('is-active');
        if (preferReducedMotion()) {
            rootEl.classList.add('is-done');
        }
    }

    function finishEnter() {
        var flag = null;
        try {
            flag = sessionStorage.getItem(STORAGE_KEY);
            sessionStorage.removeItem(STORAGE_KEY);
        } catch (e) {}
        if (flag !== '1') return;

        ensureLoader();
        rootEl.classList.remove('is-leaving');
        rootEl.classList.add('is-active');
        void rootEl.offsetWidth;
        rootEl.classList.add('is-done');

        if (leaveTimer) {
            clearTimeout(leaveTimer);
        }
        leaveTimer = setTimeout(function () {
            rootEl.classList.add('is-leaving');
            setTimeout(function () {
                rootEl.classList.remove('is-active', 'is-done', 'is-leaving');
            }, preferReducedMotion() ? 0 : 200);
        }, preferReducedMotion() ? 0 : 180);
    }

    function onClick(event) {
        var node = event.target;
        while (node && node.nodeType === 1 && node.tagName !== 'A') {
            node = node.parentNode;
        }
        if (!node || node.tagName !== 'A') return;
        if (!isInternalPageNav(node, event)) return;
        startLeave();
    }

    function boot() {
        ensureLoader();
        finishEnter();
        document.addEventListener('click', onClick, false);
        window.addEventListener('pageshow', function (event) {
            if (event.persisted) {
                try {
                    sessionStorage.removeItem(STORAGE_KEY);
                } catch (e) {}
                if (rootEl) {
                    rootEl.classList.remove('is-active', 'is-done', 'is-leaving');
                }
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
