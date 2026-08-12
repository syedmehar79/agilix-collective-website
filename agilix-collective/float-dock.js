(function () {
    'use strict';

    if (window.__agilixFloatDockInit) return;
    window.__agilixFloatDockInit = true;

    var THEME_KEY = 'agilix-theme';
    /* Company founded / market start: April 2025 */
    var MARKET_START = new Date(2025, 3, 1);

    var timeEl = document.getElementById('float-dock-time');
    var datetimeEl = document.getElementById('float-dock-datetime');
    var themeBtn = document.getElementById('float-dock-theme');

    function marketTenure(now) {
        var start = MARKET_START;
        if (now < start) {
            return { years: 0, months: 0 };
        }

        var years = now.getFullYear() - start.getFullYear();
        var months = now.getMonth() - start.getMonth();

        if (now.getDate() < start.getDate()) {
            months -= 1;
        }
        if (months < 0) {
            years -= 1;
            months += 12;
        }

        return { years: Math.max(0, years), months: Math.max(0, months) };
    }

    function unitSpan(label) {
        return '<span class="float-dock__unit">' + label + '</span>';
    }

    function formatTenure(parts) {
        var chunks = [];
        if (parts.years > 0) {
            chunks.push(parts.years + ' ' + unitSpan(parts.years === 1 ? 'Year' : 'Years'));
        }
        if (parts.months > 0) {
            chunks.push(parts.months + ' ' + unitSpan(parts.months === 1 ? 'Month' : 'Months'));
        }
        if (!chunks.length) {
            return 'New';
        }
        return chunks.join(' ');
    }

    function tick() {
        if (!timeEl || !datetimeEl) return;
        timeEl.innerHTML = formatTenure(marketTenure(new Date()));
        datetimeEl.textContent = 'Years in Market';
    }

    function getTheme() {
        try {
            return localStorage.getItem(THEME_KEY) || 'light';
        } catch (e) {
            return 'light';
        }
    }

    function syncThemeUi(theme) {
        var isDark = theme === 'dark';
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
        if (!themeBtn) return;
        themeBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        themeBtn.setAttribute(
            'aria-label',
            isDark ? 'Switch to light theme' : 'Switch to dark theme'
        );
    }

    function setTheme(theme) {
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch (e) {}
        syncThemeUi(theme);
    }

    if (timeEl && datetimeEl) {
        tick();
        /* Keep tenure current while the page stays open (month/year rollover) */
        setInterval(tick, 60 * 60 * 1000);
        document.addEventListener('visibilitychange', function () {
            if (!document.hidden) tick();
        });
    }

    syncThemeUi(getTheme());

    if (themeBtn) {
        themeBtn.addEventListener('click', function () {
            setTheme(getTheme() === 'dark' ? 'light' : 'dark');
        });
    }
})();
