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
    var form = root.querySelector('.careers__form, .career-form');
    var shellEl = root.querySelector('[data-jobs-shell]');
    var emptyScreenEl = root.querySelector('[data-jobs-empty-screen]');
    var emptyToggle = root.querySelector('[data-jobs-empty-toggle]');
    var leadEl = root.querySelector('[data-jobs-lead]');
    var showEmptyBoard = false;

    var OPENINGS = [
        {
            id: 'frontend-developer',
            role: 'Frontend Developer',
            type: 'Full time',
            city: 'Lahore / Remote',
            experience: '2–4 years',
            posted: 'Recently posted',
            summary: 'Build responsive product interfaces with modern web stacks and a strong eye for detail.',
            about:
                'You will shape product UI across Agilix platforms—shipping polished, accessible interfaces that stay fast under real usage. You will work closely with design and backend to turn product goals into calm, reliable frontends.',
            responsibilities: [
                'Build and maintain responsive web interfaces with modern HTML, CSS, and JavaScript',
                'Collaborate with design to implement intentional, usable UI systems',
                'Integrate APIs and handle client-side state with clear, maintainable patterns',
                'Improve performance, accessibility, and cross-browser quality',
                'Participate in reviews, planning, and iterative delivery'
            ],
            requirements: [
                '2–4 years of frontend development experience',
                'Strong grasp of semantic HTML, modern CSS, and JavaScript',
                'Experience with component-driven UI and responsive layouts',
                'Comfort working with REST APIs and browser tooling',
                'Clear communication and collaborative habits'
            ]
        },
        {
            id: 'backend-developer',
            role: 'Backend Developer',
            type: 'Full time',
            city: 'Lahore',
            experience: '2–4 years',
            posted: 'Recently posted',
            summary: 'Design APIs and services that scale cleanly — reliability, clarity, and maintainable architecture.',
            about:
                'You will own backend services that power Agilix products—designing APIs, data models, and integrations that stay reliable as we grow. You will balance delivery speed with sound engineering judgment.',
            responsibilities: [
                'Design and implement APIs and service-layer logic',
                'Model data carefully and keep queries performant',
                'Build integrations with third-party and internal systems',
                'Improve observability, security, and operational readiness',
                'Document decisions and support frontend/product partners'
            ],
            requirements: [
                '2–4 years of backend development experience',
                'Strong experience with server-side frameworks and relational databases',
                'Familiarity with REST APIs, auth, and production debugging',
                'Interest in scalable SaaS architecture',
                'Reliable ownership of delivery and quality'
            ]
        },
        {
            id: 'ui-ux-designer',
            role: 'UI/UX Designer',
            type: 'Full time',
            city: 'Remote',
            experience: '1–2 years',
            posted: 'Recently posted',
            summary: 'Shape product flows and visual systems that feel simple, purposeful, and brand-true.',
            about:
                'You will design product experiences that respect user time and business goals—flows, screens, and systems that feel intentional. You will partner with engineering to ship design that holds up in production.',
            responsibilities: [
                'Design end-to-end product flows and high-quality UI',
                'Maintain and evolve visual systems and interaction patterns',
                'Prototype, validate, and refine with stakeholders',
                'Hand off clearly and stay close through implementation',
                'Advocate for usability, accessibility, and brand consistency'
            ],
            requirements: [
                '1–2 years of product or UI/UX design experience',
                'Portfolio showing shipped product work',
                'Proficiency with modern design tools',
                'Strong visual craft and systems thinking',
                'Comfort collaborating with engineers and product owners'
            ]
        },
        {
            id: 'qa-engineer',
            role: 'QA Engineer',
            type: 'Full time',
            city: 'Lahore',
            experience: '1–2 years',
            posted: 'Recently posted',
            summary: 'Own quality across releases with thoughtful test plans, automation, and clear bug reports.',
            about:
                'You will protect release quality across Agilix products—catching issues early, clarifying expected behavior, and helping the team ship with confidence.',
            responsibilities: [
                'Create and execute test plans for features and regressions',
                'File clear, reproducible bug reports with prioritization',
                'Contribute to automation where it adds leverage',
                'Partner with engineering on release readiness',
                'Track quality signals and improve team habits'
            ],
            requirements: [
                '1–2 years of QA or software testing experience',
                'Strong attention to detail and structured thinking',
                'Familiarity with web app testing and browser tools',
                'Clear written communication',
                'Bonus: automation experience'
            ]
        },
        {
            id: 'intern',
            role: 'Intern',
            type: 'Part time',
            city: 'Lahore / Remote',
            experience: 'Fresher',
            posted: 'Recently posted',
            summary: 'Learn by shipping — pair with the team on real product work across design and engineering.',
            about:
                'You will learn by contributing to real Agilix product work—pairing with mentors, taking on scoped tasks, and building habits that last beyond the internship.',
            responsibilities: [
                'Support engineering or design tasks under mentorship',
                'Ship small, well-scoped improvements',
                'Write clearly about what you built and learned',
                'Participate in reviews and team rituals',
                'Grow ownership as confidence builds'
            ],
            requirements: [
                'Currently studying or recently graduated in a related field',
                'Curiosity, reliability, and willingness to learn',
                'Basic familiarity with web technologies or design tools',
                'Strong communication and follow-through',
                'Ability to commit consistent weekly hours'
            ]
        },
        {
            id: 'devops-engineer',
            role: 'DevOps Engineer',
            type: 'Full time',
            city: 'Remote',
            experience: '4–6 years',
            posted: 'Recently posted',
            summary: 'Keep delivery smooth: CI/CD, cloud ops, observability, and pragmatic automation.',
            about:
                'You will strengthen how Agilix builds and runs software—pipelines, environments, observability, and automation that keep delivery calm and predictable.',
            responsibilities: [
                'Own and improve CI/CD pipelines',
                'Manage cloud infrastructure with clear operational practices',
                'Improve monitoring, alerting, and incident response readiness',
                'Automate repetitive operational work',
                'Partner with engineers on deployability and reliability'
            ],
            requirements: [
                '4–6 years of DevOps or platform engineering experience',
                'Hands-on cloud experience and infrastructure-as-code familiarity',
                'Strong CI/CD and Linux fundamentals',
                'Practical observability and security habits',
                'Clear communication under production pressure'
            ]
        },
        {
            id: 'full-stack-developer',
            role: 'Full Stack Developer',
            type: 'Full time',
            city: 'Lahore / Remote',
            experience: '2–4 years',
            posted: 'Recently posted',
            summary: 'Ship end-to-end features across UI and APIs with ownership from idea to production.',
            about:
                'You will build features across the stack—interfaces, APIs, and data—keeping quality high and handoffs low. You will own outcomes with product and design, not just tickets.',
            responsibilities: [
                'Deliver features spanning frontend and backend',
                'Design pragmatic APIs and data models for product needs',
                'Keep codebases maintainable through reviews and clear structure',
                'Debug production issues across layers when needed',
                'Collaborate tightly with design and product on scope and quality'
            ],
            requirements: [
                '2–4 years of full stack web development experience',
                'Comfort with modern frontend and server-side frameworks',
                'Experience with relational databases and REST APIs',
                'Strong debugging and ownership habits',
                'Clear written and verbal communication'
            ]
        },
        {
            id: 'software-engineer',
            role: 'Software Engineer',
            type: 'Full time',
            city: 'Lahore',
            experience: '1–2 years',
            posted: 'Recently posted',
            summary: 'Write clean, reliable software and grow into broader ownership across Agilix products.',
            about:
                'You will contribute to core product work with mentorship and room to grow—shipping well-scoped features, learning our systems, and building strong engineering habits.',
            responsibilities: [
                'Implement features and fixes with guidance from senior engineers',
                'Write tests and documentation for the work you ship',
                'Participate in code reviews and planning',
                'Improve tooling and developer experience where you can',
                'Learn the product domain deeply over time'
            ],
            requirements: [
                '1–2 years of professional software development experience',
                'Solid fundamentals in at least one modern language and stack',
                'Willingness to learn across frontend or backend as needed',
                'Curiosity, reliability, and collaborative attitude',
                'Clear communication and follow-through'
            ]
        },
        {
            id: 'product-manager',
            role: 'Product Manager',
            type: 'Full time',
            city: 'Remote',
            experience: '2–4 years',
            posted: 'Recently posted',
            summary: 'Define priorities, shape roadmaps, and turn customer needs into shippable product outcomes.',
            about:
                'You will own product clarity—problem definition, prioritization, and delivery coordination—so engineering and design can move with confidence toward outcomes that matter.',
            responsibilities: [
                'Translate customer and business needs into clear product briefs',
                'Prioritize roadmaps with trade-offs that stay explicit',
                'Partner with design and engineering through discovery and delivery',
                'Measure impact and iterate on what ships',
                'Communicate status and decisions cleanly to stakeholders'
            ],
            requirements: [
                '2–4 years of product management experience in software',
                'Strong written communication and structured thinking',
                'Comfort with discovery, scoping, and delivery rituals',
                'Ability to balance customer value with delivery constraints',
                'Experience working closely with engineering teams'
            ]
        },
        {
            id: 'project-manager',
            role: 'Project Manager',
            type: 'Full time',
            city: 'Lahore / Remote',
            experience: '2–4 years',
            posted: 'Recently posted',
            summary: 'Keep delivery on track—scope, timelines, stakeholders, and calm execution across initiatives.',
            about:
                'You will run projects end to end—alignment, planning, risk visibility, and steady follow-through—so teams can focus on craft while commitments stay real.',
            responsibilities: [
                'Plan and track project milestones, risks, and dependencies',
                'Facilitate standups, reviews, and stakeholder updates',
                'Keep scope changes visible and decisions documented',
                'Coordinate across engineering, design, and clients when needed',
                'Drive closure with clear handoffs and retrospectives'
            ],
            requirements: [
                '2–4 years of project management in software or digital delivery',
                'Strong organization and stakeholder communication',
                'Familiarity with agile delivery practices',
                'Comfort managing competing priorities without noise',
                'Reliable ownership of timelines and follow-ups'
            ]
        },
        {
            id: 'mobile-developer',
            role: 'Mobile Developer',
            type: 'Full time',
            city: 'Lahore',
            experience: '2–4 years',
            posted: 'Recently posted',
            summary: 'Build polished mobile experiences that feel fast, stable, and native to each platform.',
            about:
                'You will craft mobile product surfaces for Agilix—performance, UX fidelity, and reliable releases—working with design and backend to ship features users trust.',
            responsibilities: [
                'Build and maintain mobile app features with high polish',
                'Integrate APIs and handle offline/edge cases thoughtfully',
                'Improve performance, crash rates, and store release quality',
                'Collaborate on UX details that matter on small screens',
                'Participate in reviews, planning, and release cycles'
            ],
            requirements: [
                '2–4 years of mobile development experience',
                'Strong skills in React Native, Flutter, or native iOS/Android',
                'Experience shipping apps to production stores',
                'Comfort with API integration and debugging tools',
                'Attention to UI detail and performance'
            ]
        },
        {
            id: 'data-analyst',
            role: 'Data Analyst',
            type: 'Full time',
            city: 'Remote',
            experience: '1–2 years',
            posted: 'Recently posted',
            summary: 'Turn product and business data into clear insights that guide decisions and priorities.',
            about:
                'You will help Agilix understand what is working—building analyses, dashboards, and narratives that make metrics actionable for product and leadership.',
            responsibilities: [
                'Analyze product and operational data to answer key questions',
                'Build and maintain clear dashboards and reports',
                'Partner with product and engineering on instrumentation needs',
                'Spot trends, anomalies, and opportunities early',
                'Present findings in plain language with recommended next steps'
            ],
            requirements: [
                '1–2 years of data analysis experience',
                'Proficiency with SQL and spreadsheet/analysis tools',
                'Comfort with visualization and storytelling with data',
                'Curious, careful, and detail-oriented habits',
                'Bonus: experience with product analytics platforms'
            ]
        },
        {
            id: 'technical-writer',
            role: 'Technical Writer',
            type: 'Full time',
            city: 'Remote',
            experience: '1–2 years',
            posted: 'Recently posted',
            summary: 'Write clear docs, guides, and product help that make complex software feel approachable.',
            about:
                'You will make Agilix products easier to understand—docs, release notes, and help content that stay accurate, scannable, and useful for real users.',
            responsibilities: [
                'Write and maintain product documentation and guides',
                'Partner with engineering and product to keep content accurate',
                'Improve information architecture and findability',
                'Support release communication with clear changelogs',
                'Gather feedback and continuously refine content quality'
            ],
            requirements: [
                '1–2 years of technical writing for software products',
                'Excellent written English and editing judgment',
                'Ability to learn complex topics quickly',
                'Comfort collaborating with engineers and designers',
                'Bonus: familiarity with docs-as-code workflows'
            ]
        },
        {
            id: 'customer-success',
            role: 'Customer Success Associate',
            type: 'Full time',
            city: 'Lahore / Remote',
            experience: '1–2 years',
            posted: 'Recently posted',
            summary: 'Help customers adopt, succeed, and stay—turning feedback into clearer product and support paths.',
            about:
                'You will be a trusted partner for Agilix customers—onboarding, ongoing success, and feedback loops that improve both relationships and the product.',
            responsibilities: [
                'Guide customers through onboarding and adoption milestones',
                'Respond to questions with clarity and follow-through',
                'Track health signals and escalate risks early',
                'Capture structured product feedback for the team',
                'Contribute to playbooks, templates, and success rituals'
            ],
            requirements: [
                '1–2 years in customer success, support, or account management',
                'Strong written and verbal communication',
                'Empathy with structured problem-solving',
                'Comfort with SaaS tools and light technical concepts',
                'Reliable ownership of customer outcomes'
            ]
        },
        {
            id: 'scrum-master',
            role: 'Scrum Master',
            type: 'Full time',
            city: 'Lahore / Remote',
            experience: '2–4 years',
            posted: 'Recently posted',
            summary: 'Coach teams on agile flow—remove blockers, protect focus, and improve delivery habits.',
            about:
                'You will help Agilix teams work with clarity and cadence—facilitating rituals, surfacing impediments, and coaching continuous improvement without process theater.',
            responsibilities: [
                'Facilitate ceremonies and keep them purposeful and short',
                'Remove impediments and protect team focus',
                'Coach the team on flow, estimation, and retrospection',
                'Make delivery health visible without micromanagement',
                'Partner with product and engineering leads on sustainable pace'
            ],
            requirements: [
                '2–4 years as a Scrum Master or agile delivery coach',
                'Deep familiarity with Scrum and related practices',
                'Strong facilitation and conflict-resolution skills',
                'Ability to influence without authority',
                'Practical mindset—process serves outcomes, not the reverse'
            ]
        },
        {
            id: 'marketing-specialist',
            role: 'Marketing Specialist',
            type: 'Full time',
            city: 'Remote',
            experience: '1–2 years',
            posted: 'Recently posted',
            summary: 'Grow brand presence with clear campaigns, content, and channels that match how Agilix shows up.',
            about:
                'You will help people discover Agilix Collective—campaigns, content, and channel work that stays on-brand, measurable, and useful rather than noisy.',
            responsibilities: [
                'Plan and execute campaigns across relevant channels',
                'Write and coordinate content that supports brand and growth goals',
                'Track performance and recommend sensible optimizations',
                'Coordinate with design and product for launches and stories',
                'Maintain a consistent brand voice across touchpoints'
            ],
            requirements: [
                '1–2 years of marketing experience, preferably B2B or SaaS',
                'Strong writing and campaign coordination skills',
                'Familiarity with analytics and basic funnel thinking',
                'Creative judgment with attention to brand consistency',
                'Ability to manage multiple initiatives without dropping details'
            ]
        }
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
            '<button type="button" class="jobs-list-item' +
            (active ? ' is-active' : '') +
            '" data-job-id="' +
            escapeHtml(opening.id) +
            '" aria-pressed="' +
            (active ? 'true' : 'false') +
            '">' +
            '<span class="jobs-list-item-role">' +
            escapeHtml(opening.role) +
            '</span>' +
            '<span class="jobs-list-item-meta">' +
            escapeHtml(opening.city) +
            ' · ' +
            escapeHtml(opening.type) +
            '</span>' +
            '<span class="jobs-list-item-summary">' +
            escapeHtml(opening.summary) +
            '</span>' +
            '<span class="jobs-list-item-posted">' +
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
            '<div class="jobs-detail-inner">' +
            '<button type="button" class="jobs-detail-back" data-jobs-back>← Back to openings</button>' +
            '<p class="jobs-detail-eyebrow">Agilix Collective</p>' +
            '<h2 class="jobs-detail-role">' +
            escapeHtml(opening.role) +
            '</h2>' +
            '<p class="jobs-detail-meta">' +
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
            '<div class="jobs-detail-section">' +
            '<h3>About the role</h3>' +
            '<p>' +
            escapeHtml(opening.about) +
            '</p>' +
            '</div>' +
            '<div class="jobs-detail-section">' +
            '<h3>Responsibilities</h3>' +
            '<ul>' +
            responsibilities +
            '</ul>' +
            '</div>' +
            '<div class="jobs-detail-section">' +
            '<h3>Requirements</h3>' +
            '<ul>' +
            requirements +
            '</ul>' +
            '</div>' +
            '<div class="jobs-detail-section jobs-detail-apply-block" id="jobs-apply">' +
            '<h3>Apply for this role</h3>' +
            '<p class="jobs-detail-apply-lead">Share your profile and we will reach out when there is a fit.</p>' +
            '</div>' +
            '</div>'
        );
    }

    function emptyDetailHtml() {
        return (
            '<div class="jobs-detail-empty">' +
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
        showEmptyBoard = !!empty;
        root.classList.toggle('is-empty-board', showEmptyBoard);

        if (emptyToggle) {
            emptyToggle.setAttribute('aria-pressed', showEmptyBoard ? 'true' : 'false');
            emptyToggle.classList.toggle('is-active', showEmptyBoard);
        }

        if (shellEl) shellEl.hidden = showEmptyBoard;
        if (emptyScreenEl) emptyScreenEl.hidden = !showEmptyBoard;

        if (leadEl) {
            leadEl.textContent = showEmptyBoard
                ? 'There are no open roles at the moment. Toggle again to browse openings.'
                : 'Browse openings on the left. Select a role to see details and apply on the right.';
        }

        if (showEmptyBoard) {
            root.classList.remove('is-detail-mobile');
            if (form) {
                form.hidden = true;
                if (shellEl && !shellEl.contains(form)) {
                    shellEl.appendChild(form);
                }
            }
            fillPosition('');
            return;
        }

        filterJobs(searchInput ? searchInput.value : '');
    }

    if (emptyToggle) {
        emptyToggle.addEventListener('click', function () {
            setEmptyBoard(!showEmptyBoard);
        });
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
        var form = document.querySelector('.careers__form, .career-form');
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
