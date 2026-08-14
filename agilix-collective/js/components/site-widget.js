(function () {
    'use strict';

    if (document.querySelector('.float-dock')) return;

    var PARTIAL = 'agilix-collective/partials/float-widget.html';

    function loadScript(src) {
        return new Promise(function (resolve, reject) {
            if (document.querySelector('script[src="' + src + '"]')) {
                resolve();
                return;
            }
            var script = document.createElement('script');
            script.src = src;
            script.onload = function () {
                resolve();
            };
            script.onerror = function () {
                reject(new Error('Failed to load ' + src));
            };
            document.body.appendChild(script);
        });
    }

    function mountWidget(html) {
        var holder = document.createElement('div');
        holder.innerHTML = html;
        while (holder.firstChild) {
            document.body.appendChild(holder.firstChild);
        }
    }

    fetch(PARTIAL)
        .then(function (response) {
            if (!response.ok) throw new Error('Widget partial missing');
            return response.text();
        })
        .then(function (html) {
            mountWidget(html);
            return loadScript('agilix-collective/js/components/faq.js');
        })
        .then(function () {
            if (typeof window.AgilixWireForms === 'function') {
                window.AgilixWireForms();
            }
            return loadScript('agilix-collective/js/components/form-modals.js');
        })
        .then(function () {
            return loadScript('agilix-collective/js/components/float-dock.js');
        })
        .catch(function (err) {
            console.error('Failed to load site widget:', err);
        });
})();
