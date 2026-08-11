(function () {
    var cards = document.querySelectorAll(".services-grid .service-detail");
    var intro = document.querySelector("#services .services-intro");
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function revealIntro() {
        if (intro) intro.classList.add("is-in");
    }

    if (reduceMotion) {
        revealIntro();
        cards.forEach(function (card) {
            card.classList.add("is-revealed");
        });
        return;
    }

    if (!("IntersectionObserver" in window)) {
        revealIntro();
        cards.forEach(function (card) {
            card.classList.add("is-revealed");
        });
        return;
    }

    if (intro) {
        var introObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    revealIntro();
                    introObserver.disconnect();
                });
            },
            {
                threshold: 0.25,
                rootMargin: "0px 0px -10% 0px"
            }
        );
        introObserver.observe(intro);
    }

    if (!cards.length) return;

    var observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var card = entry.target;
                var delay = parseInt(card.getAttribute("data-reveal-delay") || "0", 10);
                window.setTimeout(function () {
                    card.classList.add("is-revealed");
                }, delay);
                observer.unobserve(card);
            });
        },
        {
            threshold: 0.15,
            rootMargin: "0px 0px -8% 0px"
        }
    );

    cards.forEach(function (card) {
        observer.observe(card);
    });
})();
