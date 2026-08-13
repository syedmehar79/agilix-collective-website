(function () {
    var items = document.querySelectorAll('.faq__item, .faq-item');
    var ANIM_MS = 450;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function closeItem(item, immediate) {
        var btn = item.querySelector('.faq__trigger, .faq-trigger');
        var panel = item.querySelector('.faq__panel, .faq-panel');
        if (!btn || !panel || !item.classList.contains('is-open')) {
            return Promise.resolve();
        }

        item.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        panel.setAttribute('aria-hidden', 'true');

        if (immediate || reduceMotion) {
            panel.hidden = true;
            return Promise.resolve();
        }

        return new Promise(function (resolve) {
            var done = false;
            function finish() {
                if (done) return;
                done = true;
                panel.removeEventListener('transitionend', onTransition);
                if (!item.classList.contains('is-open')) {
                    panel.hidden = true;
                }
                resolve();
            }

            function onTransition(e) {
                if (e.target === panel && e.propertyName === 'grid-template-rows') {
                    finish();
                }
            }

            panel.addEventListener('transitionend', onTransition);
            setTimeout(finish, ANIM_MS + 50);
        });
    }

    function openItem(item) {
        var btn = item.querySelector('.faq__trigger, .faq-trigger');
        var panel = item.querySelector('.faq__panel, .faq-panel');
        if (!btn || !panel) return;

        panel.hidden = false;
        panel.setAttribute('aria-hidden', 'false');

        if (reduceMotion) {
            item.classList.add('is-open');
            btn.setAttribute('aria-expanded', 'true');
            return;
        }

        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                item.classList.add('is-open');
                btn.setAttribute('aria-expanded', 'true');
            });
        });
    }

    items.forEach(function (item) {
        var btn = item.querySelector('.faq__trigger, .faq-trigger');
        var panel = item.querySelector('.faq__panel, .faq-panel');
        if (!btn || !panel) return;

        var isOpen = item.classList.contains('is-open');
        panel.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
        if (!isOpen) {
            panel.hidden = true;
        }

        btn.addEventListener('click', function () {
            var willOpen = !item.classList.contains('is-open');

            var closePromises = [];
            items.forEach(function (other) {
                if (other !== item) {
                    closePromises.push(closeItem(other, reduceMotion));
                }
            });

            Promise.all(closePromises).then(function () {
                if (willOpen) {
                    openItem(item);
                } else {
                    closeItem(item, reduceMotion);
                }
            });
        });
    });

    var CONTACT_EMAIL = 'mehar.ali@agilixcollective.com';

    function syncFooterSelect(select, trigger, menu) {
        var selected = select.options[select.selectedIndex];
        var label = selected ? selected.textContent : '';
        var isPlaceholder = !select.value;
        trigger.textContent = label;
        trigger.classList.toggle('is-placeholder', isPlaceholder);
        Array.prototype.forEach.call(menu.children, function (item) {
            var active = item.getAttribute('data-value') === select.value;
            item.classList.toggle('is-active', active);
            item.setAttribute('aria-selected', active ? 'true' : 'false');
        });
    }

    function enhanceFooterSelect(select) {
        if (select.dataset.enhanced === 'true') return;
        select.dataset.enhanced = 'true';

        var wrap = document.createElement('div');
        wrap.className = 'site-footer__select';
        select.parentNode.insertBefore(wrap, select);
        wrap.appendChild(select);
        select.classList.add('site-footer__select-native');

        var trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'site-footer__select-trigger';
        trigger.setAttribute('aria-haspopup', 'listbox');
        trigger.setAttribute('aria-expanded', 'false');

        var menu = document.createElement('ul');
        menu.className = 'site-footer__select-menu';
        menu.setAttribute('role', 'listbox');

        Array.prototype.forEach.call(select.options, function (opt) {
            if (opt.disabled && !opt.value) {
                return;
            }
            var item = document.createElement('li');
            item.className = 'site-footer__select-option';
            item.setAttribute('role', 'option');
            item.setAttribute('data-value', opt.value);
            item.textContent = opt.textContent;
            item.addEventListener('click', function () {
                select.value = opt.value;
                select.dispatchEvent(new Event('change', { bubbles: true }));
                syncFooterSelect(select, trigger, menu);
                wrap.classList.remove('is-open');
                trigger.setAttribute('aria-expanded', 'false');
            });
            menu.appendChild(item);
        });

        wrap.appendChild(trigger);
        wrap.appendChild(menu);
        syncFooterSelect(select, trigger, menu);

        trigger.addEventListener('click', function (e) {
            e.preventDefault();
            var open = !wrap.classList.contains('is-open');
            document.querySelectorAll('.site-footer__select.is-open').forEach(function (el) {
                if (el !== wrap) {
                    el.classList.remove('is-open');
                    var btn = el.querySelector('.site-footer__select-trigger');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                }
            });
            wrap.classList.toggle('is-open', open);
            trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    function refreshEnhancedSelects(form, selectSelector) {
        form.querySelectorAll(selectSelector).forEach(function (select) {
            var wrap = select.closest('.site-footer__select');
            if (!wrap) return;
            var trigger = wrap.querySelector('.site-footer__select-trigger');
            var menu = wrap.querySelector('.site-footer__select-menu');
            if (trigger && menu) syncFooterSelect(select, trigger, menu);
        });
    }

    document.addEventListener('click', function (e) {
        if (e.target.closest('.site-footer__select')) return;
        document.querySelectorAll('.site-footer__select.is-open').forEach(function (el) {
            el.classList.remove('is-open');
            var btn = el.querySelector('.site-footer__select-trigger');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        });
    });

    function wireFooterForm(footerForm) {
        if (!footerForm || footerForm.dataset.wired === 'true') return;
        footerForm.dataset.wired = 'true';

        var formStatus = footerForm.querySelector('.site-footer__form-status');
        if (!formStatus) {
            formStatus = document.createElement('p');
            formStatus.className = 'site-footer__form-status';
            formStatus.setAttribute('role', 'status');
            formStatus.setAttribute('aria-live', 'polite');
            footerForm.appendChild(formStatus);
        }

        var submitButton = footerForm.querySelector('.site-footer__form-button');

        footerForm.querySelectorAll('.site-footer__field select').forEach(enhanceFooterSelect);

        footerForm.addEventListener('reset', function () {
            setTimeout(function () {
                refreshEnhancedSelects(footerForm, '.site-footer__field select');
            }, 0);
        });

        footerForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!footerForm.checkValidity()) {
                footerForm.reportValidity();
                return;
            }

            formStatus.className = 'site-footer__form-status';
            formStatus.textContent = 'Sendingâ€¦';
            if (submitButton) {
                submitButton.disabled = true;
            }

            var formData = new FormData(footerForm);
            var payload = {};
            formData.forEach(function (value, key) {
                if (key === '_honey') return;
                payload[key] = value;
            });
            var marketingConsent = footerForm.querySelector('[name="marketing_email_consent"]');
            var smsConsent = footerForm.querySelector('[name="sms_consent"]');
            payload.marketing_email_consent =
                marketingConsent && marketingConsent.checked ? 'Yes' : 'No';
            payload.sms_consent = smsConsent && smsConsent.checked ? 'Yes' : 'No';

            fetch('https://formsubmit.co/ajax/' + CONTACT_EMAIL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify(payload)
            })
                .then(function (response) {
                    return response.json().then(function (data) {
                        return { ok: response.ok, data: data };
                    });
                })
                .then(function (result) {
                    if (!result.ok) {
                        throw new Error((result.data && result.data.message) || 'Send failed');
                    }
                    formStatus.className = 'site-footer__form-status is-success';
                    formStatus.textContent =
                        'Thank you. Your message has been sent â€” we will be in touch soon.';
                    footerForm.reset();
                    refreshEnhancedSelects(footerForm, '.site-footer__field select');
                })
                .catch(function () {
                    formStatus.className = 'site-footer__form-status is-error';
                    formStatus.textContent =
                        'Something went wrong. Please email ' + CONTACT_EMAIL + ' directly.';
                })
                .finally(function () {
                    if (submitButton) {
                        submitButton.disabled = false;
                    }
                });
        });
    }

    var RESUME_MAX_BYTES = 5 * 1024 * 1024;
    var resumeHint = 'PDF or DOC, max 5MB';

    function wireCareerForm(careerForm) {
        if (!careerForm || careerForm.dataset.wired === 'true') return;
        careerForm.dataset.wired = 'true';

        var careerStatus = careerForm.querySelector('.careers__form-status, .careers__form, .career-form-status');
        var careerSubmit = careerForm.querySelector('.careers__form-button, .careers__form, .career-form-button');
        var resumeInput = careerForm.querySelector('.careers__upload-input, .career-upload-input');
        var resumeName = careerForm.querySelector('.careers__upload-name, .career-upload-name');

        careerForm.querySelectorAll('.careers__field select, .career-field select').forEach(enhanceFooterSelect);

        function resetResumeLabel() {
            if (!resumeName) return;
            resumeName.textContent = resumeHint;
            resumeName.classList.remove('is-selected');
        }

        if (resumeInput) {
            resumeInput.addEventListener('change', function () {
                var file = resumeInput.files && resumeInput.files[0];
                if (!file) {
                    resetResumeLabel();
                    return;
                }
                if (file.size > RESUME_MAX_BYTES) {
                    resumeInput.value = '';
                    resetResumeLabel();
                    if (careerStatus) {
                        careerStatus.className = 'careers__form-status is-error';
                        careerStatus.textContent = 'Resume must be 5MB or smaller.';
                    }
                    return;
                }
                if (careerStatus) {
                    careerStatus.className = 'careers__form-status';
                    careerStatus.textContent = '';
                }
                if (resumeName) {
                    resumeName.textContent = file.name;
                    resumeName.classList.add('is-selected');
                }
            });
        }

        careerForm.addEventListener('reset', function () {
            setTimeout(function () {
                refreshEnhancedSelects(careerForm, '.careers__field select, .career-field select');
                resetResumeLabel();
            }, 0);
        });

        careerForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!careerForm.checkValidity()) {
                careerForm.reportValidity();
                return;
            }

            var file = resumeInput && resumeInput.files && resumeInput.files[0];
            if (!file) {
                if (careerStatus) {
                    careerStatus.className = 'careers__form-status is-error';
                    careerStatus.textContent = 'Please upload your resume.';
                }
                return;
            }
            if (file.size > RESUME_MAX_BYTES) {
                if (careerStatus) {
                    careerStatus.className = 'careers__form-status is-error';
                    careerStatus.textContent = 'Resume must be 5MB or smaller.';
                }
                return;
            }

            if (careerStatus) {
                careerStatus.className = 'careers__form-status';
                careerStatus.textContent = 'Sending…';
            }
            if (careerSubmit) {
                careerSubmit.disabled = true;
            }

            var formData = new FormData(careerForm);

            fetch('https://formsubmit.co/ajax/' + CONTACT_EMAIL, {
                method: 'POST',
                headers: {
                    Accept: 'application/json'
                },
                body: formData
            })
                .then(function (response) {
                    return response.json().then(function (data) {
                        return { ok: response.ok, data: data };
                    });
                })
                .then(function (result) {
                    if (!result.ok) {
                        throw new Error((result.data && result.data.message) || 'Send failed');
                    }
                    if (careerStatus) {
                        careerStatus.className = 'careers__form-status is-success';
                        careerStatus.textContent =
                            'Thank you. Your application has been sent — we will be in touch soon.';
                    }
                    careerForm.reset();
                    refreshEnhancedSelects(careerForm, '.careers__field select, .career-field select');
                    resetResumeLabel();
                })
                .catch(function () {
                    if (careerStatus) {
                        careerStatus.className = 'careers__form-status is-error';
                        careerStatus.textContent =
                            'Something went wrong. Please email ' + CONTACT_EMAIL + ' directly.';
                    }
                })
                .finally(function () {
                    if (careerSubmit) {
                        careerSubmit.disabled = false;
                    }
                });
        });
    }

    function wireAllForms() {
        document.querySelectorAll('.site-footer__form').forEach(wireFooterForm);
        document.querySelectorAll('.careers__form, .career-form').forEach(wireCareerForm);
    }

    wireAllForms();
    window.AgilixWireForms = wireAllForms;
})();
