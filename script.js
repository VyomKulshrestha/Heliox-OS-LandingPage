document.addEventListener('DOMContentLoaded', () => {
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
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = mobileMenuBtn?.querySelector('.material-symbols-outlined');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            if (menuIcon) {
                menuIcon.textContent = mobileMenu.classList.contains('open') ? 'close' : 'menu';
            }
        });

        // Close mobile menu on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                if (menuIcon) menuIcon.textContent = 'menu';
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

    // Storm Awakening Scene: scroll-scrubbed reveal with pointer parallax.
    const awakeningScene = document.getElementById('awakening-scene');
    if (awakeningScene) {
        const stormTrack = awakeningScene.closest('.storm-scroll-track');
        const stormStatus = document.getElementById('storm-scroll-status');
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!reducedMotion && stormTrack) {
            const updateAwakeningProgress = () => {
                const trackTop = stormTrack.getBoundingClientRect().top + window.scrollY;
                const animationDistance = Math.max(stormTrack.offsetHeight - window.innerHeight, 1);
                const progress = Math.max(0, Math.min(1, (window.scrollY - trackTop) / animationDistance));
                awakeningScene.style.setProperty('--scroll-progress', progress.toFixed(3));

                if (stormStatus) {
                    stormStatus.textContent = progress < 0.14 ? 'Scroll to call the agents'
                        : progress < 0.4 ? 'First strike: perimeter agent online'
                        : progress < 0.68 ? 'Second strike: core agent online'
                        : progress < 0.94 ? 'Final strike: system awakening'
                        : 'All agents online';
                }
            };

            awakeningScene.classList.add('is-scroll-driven');
            window.addEventListener('scroll', updateAwakeningProgress, { passive: true });
            window.addEventListener('resize', updateAwakeningProgress);
            updateAwakeningProgress();
        }

        if (!reducedMotion) {
        awakeningScene.addEventListener('pointermove', (event) => {
            const bounds = awakeningScene.getBoundingClientRect();
            const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 12;
            const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 12;
            awakeningScene.style.setProperty('--pointer-x', x.toFixed(2) + 'px');
            awakeningScene.style.setProperty('--pointer-y', y.toFixed(2) + 'px');
        });

        awakeningScene.addEventListener('pointerleave', () => {
            awakeningScene.style.setProperty('--pointer-x', '0px');
            awakeningScene.style.setProperty('--pointer-y', '0px');
        });
        }
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
