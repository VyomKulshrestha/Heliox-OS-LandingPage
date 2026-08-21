function initializeCapabilityExplorer() {
    const dialog = document.getElementById('capability-explorer-dialog');
    const specialistFilter = document.getElementById('capability-specialist-filter');
    const verificationFilter = document.getElementById('capability-verification-filter');
    const results = document.getElementById('capability-results');
    const resultCount = document.getElementById('capability-result-count');
    const errorMessage = document.getElementById('capability-explorer-error');
    const stateLink = document.getElementById('capability-state-link');

    if (!dialog || !specialistFilter || !verificationFilter || !results || !resultCount || !errorMessage || !stateLink) return;

    let actions = [];
    let loadPromise = null;
    let returnFocus = null;

    const verificationState = (action) => action.verification?.independent_postcondition ? 'independent' : 'executor';

    const readableName = (value) => value
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

    const createElement = (tagName, className, text) => {
        const element = document.createElement(tagName);
        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;
        return element;
    };

    const currentStateUrl = () => {
        const url = new URL(window.location.href);
        const specialist = specialistFilter.value;
        const verification = verificationFilter.value;

        if (specialist === 'all') url.searchParams.delete('specialist');
        else url.searchParams.set('specialist', specialist);

        if (verification === 'all') url.searchParams.delete('verification');
        else url.searchParams.set('verification', verification);

        url.hash = 'actions';
        return url;
    };

    const renderAction = (action) => {
        const card = createElement('article', 'capability-card');
        const header = createElement('div', 'capability-card__header');
        const identity = createElement('div');
        const id = createElement('code', 'capability-card__id', action.id);
        const family = createElement('span', 'capability-card__family', readableName(action.family));
        const verification = verificationState(action);
        const verificationLink = createElement(
            'a',
            `capability-verification capability-verification--${verification}`,
            verification === 'independent' ? 'Independent post-condition' : 'Executor result only'
        );

        verificationLink.href = 'proof.html#verification-depth';
        verificationLink.title = 'Read what this verification status proves';
        identity.append(id, family);
        header.append(identity, verificationLink);

        const specialists = createElement('div', 'capability-card__specialists');
        specialists.appendChild(createElement('span', '', 'Specialists'));
        action.providers.forEach((provider) => {
            const button = createElement('button', '', provider.name);
            button.type = 'button';
            button.dataset.specialist = provider.name;
            button.title = `Filter by ${provider.name}`;
            specialists.appendChild(button);
        });

        const footer = createElement('div', 'capability-card__footer');
        const permission = createElement('span', '', `${readableName(action.permission.name)} permission`);
        const catalogLink = createElement('a', '', 'Catalog record');
        catalogLink.href = 'capabilities.json';
        catalogLink.title = `Inspect ${action.id} in the canonical capability catalog`;
        footer.append(permission, catalogLink);

        card.append(header, specialists, footer);
        return card;
    };

    const render = ({ updateUrl = true } = {}) => {
        if (!actions.length) return;

        const specialist = specialistFilter.value;
        const verification = verificationFilter.value;
        const filtered = actions.filter((action) => {
            const hasSpecialist = specialist === 'all' || action.providers.some((provider) => provider.name === specialist);
            const hasVerification = verification === 'all' || verificationState(action) === verification;
            return hasSpecialist && hasVerification;
        });

        const representedSpecialists = new Set(filtered.flatMap((action) => action.providers.map((provider) => provider.name)));
        const independentCount = filtered.filter((action) => verificationState(action) === 'independent').length;
        const fragment = document.createDocumentFragment();
        filtered.forEach((action) => fragment.appendChild(renderAction(action)));

        results.replaceChildren(fragment);
        resultCount.textContent = `${filtered.length} of ${actions.length} actions · ${representedSpecialists.size} specialists represented · ${independentCount} with independent post-condition checks`;

        const url = currentStateUrl();
        stateLink.href = url.href;
        stateLink.setAttribute('aria-label', `Link to the current ${filtered.length}-action capability view`);
        if (updateUrl) window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
    };

    const applyUrlState = () => {
        const parameters = new URL(window.location.href).searchParams;
        const specialist = parameters.get('specialist');
        const verification = parameters.get('verification');

        if (specialist && Array.from(specialistFilter.options).some((option) => option.value === specialist)) {
            specialistFilter.value = specialist;
        }
        if (verification === 'independent' || verification === 'executor') {
            verificationFilter.value = verification;
        }
    };

    const loadCapabilities = () => {
        if (loadPromise) return loadPromise;

        results.setAttribute('aria-busy', 'true');
        resultCount.textContent = 'Loading the canonical capability catalog…';
        errorMessage.hidden = true;

        loadPromise = fetch('capabilities.json', { headers: { Accept: 'application/json' } })
            .then((response) => {
                if (!response.ok) throw new Error(`Capability catalog returned ${response.status}`);
                return response.json();
            })
            .then((catalog) => {
                if (!Array.isArray(catalog.actions) || catalog.actions.length !== catalog.summary?.action_types) {
                    throw new Error('Capability catalog count does not match its declared summary');
                }

                actions = catalog.actions;
                const specialists = Array.from(new Set(actions.flatMap((action) => action.providers.map((provider) => provider.name)))).sort();
                specialists.forEach((specialist) => {
                    specialistFilter.appendChild(new Option(specialist, specialist));
                });
                specialistFilter.disabled = false;
                verificationFilter.disabled = false;
                applyUrlState();
                render({ updateUrl: false });
            })
            .catch(() => {
                errorMessage.hidden = false;
                resultCount.textContent = 'Interactive catalog unavailable.';
                loadPromise = null;
            })
            .finally(() => results.setAttribute('aria-busy', 'false'));

        return loadPromise;
    };

    const openExplorer = (trigger) => {
        returnFocus = trigger instanceof HTMLElement ? trigger : document.activeElement;
        if (!dialog.open) dialog.showModal();
        loadCapabilities();
    };

    document.addEventListener('click', (event) => {
        const openTrigger = event.target.closest('[data-capability-explorer-open], a[href="#capability-explorer-dialog"]');
        if (openTrigger) {
            event.preventDefault();
            openExplorer(openTrigger);
            return;
        }

        if (event.target.closest('[data-capability-explorer-close]')) dialog.close();

        const specialistButton = event.target.closest('[data-specialist]');
        if (specialistButton && dialog.contains(specialistButton)) {
            specialistFilter.value = specialistButton.dataset.specialist;
            render();
        }
    });

    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', () => {
        if (returnFocus?.isConnected) returnFocus.focus();
    });
    specialistFilter.addEventListener('change', () => render());
    verificationFilter.addEventListener('change', () => render());

    const parameters = new URL(window.location.href).searchParams;
    if (parameters.has('specialist') || parameters.has('verification')) openExplorer(null);
}

document.addEventListener('DOMContentLoaded', () => {
    initializeCapabilityExplorer();
    const worldActive = document.body.classList.contains('scroll-world-active');
    const cinematicMain = document.querySelector('body > main');
    if (!worldActive && cinematicMain) {
        cinematicMain.classList.add('cinematic-content');

        const chapters = Array.from(cinematicMain.querySelectorAll(':scope > section')).filter((section) => {
            return !section.classList.contains('hero-section') && section.id !== 'about';
        });

        const chapterActs = [
            { start: 0, end: 3, label: '01 / INTERACTION + INTELLIGENCE' },
            { start: 4, end: 6, label: '02 / EXECUTION + TRUST' },
            { start: 7, end: 9, label: '03 / BUILD + JOIN' }
        ];

        chapters.forEach((section, index) => {
            const heading = section.querySelector('h2');
            const act = chapterActs.find((candidate) => index >= candidate.start && index <= candidate.end);
            section.dataset.cinematicIndex = String(index + 1).padStart(2, '0');
            section.dataset.cinematicLabel = heading?.textContent.trim() || 'Live Execution';
            section.dataset.cinematicAct = act?.label || 'HELIOX SYSTEM';
            section.classList.toggle('cinematic-act-start', act?.start === index);
        });
    }
    // ── Navbar Scroll Effect ──
    const navbar = document.querySelector('nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });

    // ── Mobile Menu Toggle ──
    const mobileMenuBtn = document.getElementById('primary-mobile-menu-btn');
    const mobileMenu = document.getElementById('primary-mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            const isOpen = mobileMenu.classList.contains('open');
            mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
            mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
        });

        // Close mobile menu on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.setAttribute('aria-label', 'Open navigation menu');
            });
        });
    }

    // ── Smooth Scroll for Anchor Links ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || this.dataset.worldNavigation === 'true') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ── Scroll Reveal Animation ──
    if (worldActive) return;

    const cinematicChapters = document.querySelectorAll('.cinematic-content > section[data-cinematic-index]');
    const chapterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add('chapter-active');
        });
    }, { threshold: 0.14 });

    cinematicChapters.forEach((chapter) => chapterObserver.observe(chapter));

    // ── Animated Counters ──
    const counters = document.querySelectorAll('.count-up');
    const counterFrames = new WeakMap();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const cancelCounterAnimation = (counter) => {
        const animationFrame = counterFrames.get(counter);
        if (animationFrame) cancelAnimationFrame(animationFrame);
        counterFrames.delete(counter);
    };

    const animateCounter = (counter) => {
        const target = Number(counter.getAttribute('data-target'));
        const suffix = counter.getAttribute('data-suffix') || '';

        if (prefersReducedMotion) {
            counter.textContent = target + suffix;
            return;
        }

        cancelCounterAnimation(counter);
        counter.textContent = '0' + suffix;
        const duration = 1600;
        const start = performance.now();

        const updateCounter = (currentTime) => {
            const progress = Math.min((currentTime - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(eased * target) + suffix;

            if (progress < 1) {
                counterFrames.set(counter, requestAnimationFrame(updateCounter));
            } else {
                counter.textContent = target + suffix;
                counterFrames.delete(counter);
            }
        };

        counterFrames.set(counter, requestAnimationFrame(updateCounter));
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const counter = entry.target;

            if (entry.isIntersecting && counter.dataset.counterAnimated !== 'true') {
                counter.dataset.counterAnimated = 'true';
                animateCounter(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach((counter) => {
        counterObserver.observe(counter);
    });

    // Persistent background lightning: one three-strike cycle per scroll distance.
    const globalStormEffects = document.getElementById('global-storm-effects');
    if (globalStormEffects && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const updateGlobalStorm = () => {
            const cycleDistance = 900;
            const progress = (window.scrollY % cycleDistance) / cycleDistance;
            globalStormEffects.style.setProperty('--storm-cycle-progress', progress.toFixed(3));
        };

        window.addEventListener('scroll', updateGlobalStorm, { passive: true });
        updateGlobalStorm();
    }

    // ── Platform Tabs (Installation Section) ──
    const platformTabs = document.querySelectorAll('.platform-tab');
    const platformContents = document.querySelectorAll('.platform-content');

    platformTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const platform = tab.getAttribute('data-platform');

            // Deactivate all
            platformTabs.forEach(t => t.classList.remove('active'));
            platformContents.forEach(c => c.classList.remove('active'));

            // Activate selected
            tab.classList.add('active');
            const content = document.getElementById(`platform-${platform}`);
            if (content) {
                content.classList.add('active');
                // Add a subtle entry animation
                content.style.opacity = '0';
                content.style.transform = 'translateY(10px)';
                requestAnimationFrame(() => {
                    content.style.transition = 'all 0.4s ease';
                    content.style.opacity = '1';
                    content.style.transform = 'translateY(0)';
                });
            }
        });
    });

    // ── Terminal Typing Effect ──
    const terminalCode = document.getElementById('terminal-code');
    if (terminalCode) {
        const terminalLines = terminalCode.querySelectorAll(':scope > div');
        terminalLines.forEach(line => line.style.opacity = '0');
        
        const terminalObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                terminalLines.forEach((line, index) => {
                    setTimeout(() => {
                        line.style.opacity = '1';
                        line.animate([
                            { opacity: 0 },
                            { opacity: 1, offset: 0.1 },
                            { opacity: 0.5, offset: 0.2 },
                            { opacity: 1 }
                        ], { duration: 300 });
                    }, 300 + (index * 350));
                });
                terminalObserver.disconnect();
            }
        });
        
        terminalObserver.observe(terminalCode);
    }

    // ── Action Badge Hover Ripple ──
    document.querySelectorAll('.action-badge').forEach(badge => {
        badge.addEventListener('mouseenter', () => {
            badge.animate([
                { transform: 'scale(1)' },
                { transform: 'scale(1.08)' },
                { transform: 'scale(1)' }
            ], { duration: 300, easing: 'ease-out' });
        });
    });
});
