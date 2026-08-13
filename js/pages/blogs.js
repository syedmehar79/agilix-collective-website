(function () {
    'use strict';

    if (!document.body.classList.contains('blogs-page')) return;

    var posts = window.AGILIX_BLOGS || [];
    if (!posts.length) return;

    var reader = document.querySelector('[data-blog-reader]');
    var list = document.querySelector('[data-blogs-track]');
    var recentList = document.querySelector('[data-recent-posts]');
    var popularList = document.querySelector('[data-popular-posts]');
    if (!reader || !list) return;

    var img = reader.querySelector('[data-blog-image]');
    var dateEl = reader.querySelector('[data-blog-date]');
    var titleEl = reader.querySelector('[data-blog-title]');
    var bodyEl = reader.querySelector('[data-blog-body]');
    var likeBtn = reader.querySelector('[data-blog-like]');
    var likeCountEl = reader.querySelector('[data-blog-like-count]');
    var shareBtn = reader.querySelector('[data-blog-share]');
    var shareLabel = reader.querySelector('[data-blog-share-label]');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var LIKES_KEY = 'agilix-blog-likes';
    var shareResetTimer = null;

    function readLikesState() {
        try {
            var raw = localStorage.getItem(LIKES_KEY);
            var parsed = raw ? JSON.parse(raw) : {};
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch (e) {
            return {};
        }
    }

    function writeLikesState(state) {
        try {
            localStorage.setItem(LIKES_KEY, JSON.stringify(state));
        } catch (e) {}
    }

    function likeTotal(post) {
        var extra = readLikesState()[post.id];
        return (post.likes || 0) + (extra && extra.liked ? 1 : 0);
    }

    function isLiked(id) {
        var extra = readLikesState()[id];
        return !!(extra && extra.liked);
    }

    function likeIcon() {
        return '<svg class="blog-action-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12.1 20.3 11 19.3C6.4 15.2 3.5 12.6 3.5 9.5A4.4 4.4 0 0 1 8 5c1.5 0 2.9.7 3.8 1.8A4.8 4.8 0 0 1 15.6 5a4.4 4.4 0 0 1 4.5 4.5c0 3.1-2.9 5.7-7.5 9.8l-2.5 1Z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/></svg>';
    }

    function shareIcon() {
        return '<svg class="blog-action-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="18" cy="5" r="2.4" stroke="currentColor" stroke-width="1.75"/><circle cx="6" cy="12" r="2.4" stroke="currentColor" stroke-width="1.75"/><circle cx="18" cy="19" r="2.4" stroke="currentColor" stroke-width="1.75"/><path d="M8.2 11.1 15.8 6.4M8.3 12.9 15.7 17.6" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>';
    }

    function actionButtons(post) {
        var liked = isLiked(post.id);
        return (
            '<div class="blog-reader-actions blog-item-actions">' +
            '<button type="button" class="blog-action blog-action--like' +
            (liked ? ' is-liked' : '') +
            '" data-blog-like data-like-id="' +
            post.id +
            '" aria-pressed="' +
            (liked ? 'true' : 'false') +
            '" aria-label="' +
            (liked ? 'Unlike this post' : 'Like this post') +
            '">' +
            likeIcon() +
            '<span class="blog-action-label">like</span>' +
            '<span class="blog-action-count" data-blog-like-count>' +
            likeTotal(post) +
            '</span>' +
            '</button>' +
            '<button type="button" class="blog-action blog-action--share" data-blog-share data-share-id="' +
            post.id +
            '" aria-label="Share this post">' +
            shareIcon() +
            '<span class="blog-action-label" data-blog-share-label>share</span>' +
            '</button>' +
            '</div>'
        );
    }

    function syncLikeUi(post) {
        if (!post) return;
        var liked = isLiked(post.id);
        var count = String(likeTotal(post));
        var label = liked ? 'Unlike this post' : 'Like this post';

        if (likeBtn && likeCountEl && reader.getAttribute('data-active-id') === post.id) {
            likeCountEl.textContent = count;
            likeBtn.setAttribute('aria-pressed', liked ? 'true' : 'false');
            likeBtn.classList.toggle('is-liked', liked);
            likeBtn.setAttribute('aria-label', label);
        }

        document.querySelectorAll('[data-blog-like][data-like-id="' + post.id + '"]').forEach(function (btn) {
            var countEl = btn.querySelector('[data-blog-like-count]');
            if (countEl) countEl.textContent = count;
            btn.setAttribute('aria-pressed', liked ? 'true' : 'false');
            btn.classList.toggle('is-liked', liked);
            btn.setAttribute('aria-label', label);
        });
    }

    function toggleLike(id) {
        var post = byId(id || reader.getAttribute('data-active-id'));
        if (!post) return;
        var state = readLikesState();
        var current = state[post.id] || { liked: false };
        current.liked = !current.liked;
        state[post.id] = current;
        writeLikesState(state);
        syncLikeUi(post);
    }

    function showShareCopied(labelEl, buttonEl) {
        if (!labelEl) return;
        labelEl.textContent = 'copied';
        if (buttonEl) buttonEl.setAttribute('aria-label', 'Link copied');
        window.clearTimeout(shareResetTimer);
        shareResetTimer = window.setTimeout(function () {
            document.querySelectorAll('[data-blog-share-label]').forEach(function (el) {
                el.textContent = 'share';
            });
            document.querySelectorAll('[data-blog-share]').forEach(function (btn) {
                btn.setAttribute('aria-label', 'Share this post');
            });
        }, 1800);
    }

    function sharePost(id, labelEl, buttonEl) {
        var post = byId(id || reader.getAttribute('data-active-id'));
        if (!post) return;
        var url = postShareUrl(post);
        var payload = {
            title: post.title + ' — Agilix Collective',
            text: post.excerpt || post.title,
            url: url
        };
        if (navigator.share) {
            navigator.share(payload).catch(function () {});
            return;
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(function () {
                showShareCopied(labelEl, buttonEl);
            }).catch(function () {
                window.prompt('Copy this link', url);
            });
            return;
        }
        window.prompt('Copy this link', url);
    }

    function postShareUrl(post) {
        return location.origin + location.pathname.replace(/\/$/, '') + '#' + post.id;
    }

    function byId(id) {
        for (var i = 0; i < posts.length; i++) {
            if (posts[i].id === id) return posts[i];
        }
        return null;
    }

    function hashId() {
        return (location.hash || '').replace(/^#/, '');
    }

    function cardMarkup(post) {
        return (
            '<article class="blog-item" data-blog-id="' +
            post.id +
            '">' +
            '<a class="blog-item-link" href="#' +
            post.id +
            '" data-blog-open="' +
            post.id +
            '">' +
            '<div class="blog-item-media">' +
            '<img src="' +
            post.image +
            '" alt="' +
            escapeAttr(post.imageAlt) +
            '" width="1400" height="900" loading="lazy" decoding="async">' +
            '</div>' +
            '<div class="blog-item-body">' +
            '<time class="blog-item-date" datetime="' +
            post.date +
            '">' +
            escapeHtml(post.dateLabel) +
            '</time>' +
            '<h3 class="blog-item-title">' +
            escapeHtml(post.title) +
            '</h3>' +
            '<p class="blog-item-excerpt">' +
            escapeHtml(post.excerpt) +
            '</p>' +
            '<span class="blog-item-cta">read more</span>' +
            '</div>' +
            '</a>' +
            actionButtons(post) +
            '</article>'
        );
    }

    function sideCardMarkup(post) {
        return (
            '<a class="blog-side-card" href="#' +
            post.id +
            '" data-blog-id="' +
            post.id +
            '" data-blog-open="' +
            post.id +
            '">' +
            '<span class="blog-side-card-media">' +
            '<img src="' +
            post.image +
            '" alt="" width="160" height="120" loading="lazy" decoding="async">' +
            '</span>' +
            '<span class="blog-side-card-copy">' +
            '<time class="blog-side-card-date" datetime="' +
            post.date +
            '">' +
            escapeHtml(post.dateLabel) +
            '</time>' +
            '<span class="blog-side-card-title">' +
            escapeHtml(post.title) +
            '</span>' +
            '</span>' +
            '</a>'
        );
    }

    function renderList() {
        list.innerHTML = posts.map(cardMarkup).join('');
    }

    function renderSideLists() {
        var recent = posts.slice().sort(function (a, b) {
            return String(b.date).localeCompare(String(a.date));
        });
        var popular = posts.slice().sort(function (a, b) {
            return (b.popularity || 0) - (a.popularity || 0);
        });
        if (recentList) recentList.innerHTML = recent.slice(0, 3).map(sideCardMarkup).join('');
        if (popularList) popularList.innerHTML = popular.slice(0, 3).map(sideCardMarkup).join('');
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function escapeAttr(value) {
        return escapeHtml(value).replace(/'/g, '&#39;');
    }

    function setActive(id) {
        document.querySelectorAll('[data-blog-id]').forEach(function (item) {
            var active = item.getAttribute('data-blog-id') === id;
            item.classList.toggle('is-active', active);
            if (item.matches('a')) {
                if (active) item.setAttribute('aria-current', 'true');
                else item.removeAttribute('aria-current');
            }
            var link = item.querySelector('.blog-item-link');
            if (link) {
                if (active) link.setAttribute('aria-current', 'true');
                else link.removeAttribute('aria-current');
            }
        });
    }

    function renderPost(post, options) {
        if (!post) return;
        options = options || {};

        if (img) {
            img.src = post.image;
            img.alt = post.imageAlt;
        }
        if (dateEl) {
            dateEl.setAttribute('datetime', post.date);
            dateEl.textContent = post.dateLabel;
        }
        if (titleEl) titleEl.textContent = post.title;
        if (bodyEl) {
            bodyEl.innerHTML = post.body
                .map(function (paragraph) {
                    return '<p>' + escapeHtml(paragraph) + '</p>';
                })
                .join('');
        }

        reader.setAttribute('data-active-id', post.id);
        setActive(post.id);
        syncLikeUi(post);

        if (options.updateHash !== false && hashId() !== post.id) {
            history.replaceState(null, '', '#' + post.id);
        }

        if (options.scroll) {
            var top =
                reader.getBoundingClientRect().top +
                window.scrollY -
                Math.min(96, window.innerHeight * 0.12);
            window.scrollTo({
                top: Math.max(0, top),
                behavior: reduceMotion ? 'auto' : 'smooth'
            });
        }
    }

    function openFromHash(options) {
        options = options || {};
        var id = hashId();
        if (!id) {
            renderPost(posts[0], { updateHash: true, scroll: !!options.scroll });
            return;
        }
        var post = byId(id);
        if (!post) return;
        renderPost(post, {
            updateHash: options.updateHash === true,
            scroll: !!options.scroll
        });
    }

    renderList();
    renderSideLists();
    openFromHash({ updateHash: true, scroll: false });

    function onOpenClick(event) {
        var link = event.target.closest('[data-blog-open]');
        if (!link) return;
        event.preventDefault();
        var id = link.getAttribute('data-blog-open');
        var post = byId(id);
        if (!post) return;
        renderPost(post, { updateHash: true, scroll: true });
    }

    list.addEventListener('click', function (event) {
        var like = event.target.closest('[data-blog-like]');
        if (like && list.contains(like)) {
            event.preventDefault();
            event.stopPropagation();
            toggleLike(like.getAttribute('data-like-id'));
            return;
        }
        var share = event.target.closest('[data-blog-share]');
        if (share && list.contains(share)) {
            event.preventDefault();
            event.stopPropagation();
            sharePost(
                share.getAttribute('data-share-id'),
                share.querySelector('[data-blog-share-label]'),
                share
            );
            return;
        }
        onOpenClick(event);
    });
    if (recentList) recentList.addEventListener('click', onOpenClick);
    if (popularList) popularList.addEventListener('click', onOpenClick);
    if (likeBtn) {
        likeBtn.addEventListener('click', function () {
            toggleLike(reader.getAttribute('data-active-id'));
        });
    }
    if (shareBtn) {
        shareBtn.addEventListener('click', function () {
            sharePost(reader.getAttribute('data-active-id'), shareLabel, shareBtn);
        });
    }

    window.addEventListener('hashchange', function () {
        openFromHash({ updateHash: false, scroll: true });
    });
})();
