(function () {
    'use strict';

    var THEME_KEY = 'agilix-theme';

    var timeEl = document.getElementById('float-dock-time');
    var datetimeEl = document.getElementById('float-dock-datetime');
    var themeBtn = document.getElementById('float-dock-theme');

    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    function pad(n) {
        return n < 10 ? '0' + n : String(n);
    }

    function tick() {
        if (!timeEl || !datetimeEl) return;
        var now = new Date();
        timeEl.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes());
        datetimeEl.textContent =
            days[now.getDay()] + ', ' + months[now.getMonth()] + ' ' + pad(now.getDate());
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
        setInterval(tick, 1000);
    }

    syncThemeUi(getTheme());

    if (themeBtn) {
        themeBtn.addEventListener('click', function () {
            setTheme(getTheme() === 'dark' ? 'light' : 'dark');
        });
    }
})();
