(function () {
    const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
    const smooth = (value) => {
        const normalized = clamp(value);
        return normalized * normalized * (3 - 2 * normalized);
    };

    function createElement(tag, className) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        return element;
    }

    function linkAttributes(href) {
        return /^https?:/i.test(href) ? ' target="_blank" rel="noreferrer"' : '';
    }

    function actionsMarkup(actions) {
        if (!actions) return '';
        const entries = [actions.primary, actions.secondary, actions.tertiary].filter(Boolean);

        return `<div class="hworld-copy__actions">${entries.map((action, index) => (
            `<a class="${index ? 'is-ghost' : ''}" href="${action.href}"${linkAttributes(action.href)}>${action.label}</a>`
        )).join('')}</div>`;
    }

    function metricsMarkup(metrics) {
        if (!metrics?.length) return '';

        return `<dl class="hworld-metrics">${metrics.map((metric) => {
            const value = metric.target === undefined ? metric.value : metric.target;
            const target = metric.target === undefined ? '' : ` data-target="${metric.target}"`;
            const suffix = metric.suffix ? ` data-suffix="${metric.suffix}"` : '';
            return `<div><dt${target}${suffix}>${value}${metric.target === undefined ? '' : metric.suffix || ''}</dt><dd>${metric.label}</dd></div>`;
        }).join('')}</dl>`;
    }

    function signalsMarkup(signals) {
        if (!signals?.length) return '';

        return `<ol class="hworld-manifest">${signals.map((signal) => `
            <li>
                <div><b>${signal.title}</b><p>${signal.body}</p></div>
            </li>
        `).join('')}</ol>`;
    }

    function profileMarkup(profile) {
        if (!profile) return '';
        return `
            <div class="hworld-profile">
                <img src="${profile.portrait}" alt="${profile.name}">
                <span><b>${profile.name}</b><small>${profile.role}</small></span>
            </div>
        `;
    }

    function footerMarkup(footer) {
        if (!footer) return '';
        return `
            <div class="hworld-footer">
                <div>${footer.links.map((link) => `<a href="${link.href}"${linkAttributes(link.href)}>${link.label}</a>`).join('')}</div>
                <small>${footer.meta}</small>
            </div>
        `;
    }

    function mountScrollWorld(root, config) {
        if (!root || !config?.sections?.length) return;

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const sections = config.sections;
        const codecProbe = document.createElement('video');
        const supportsAv1 = [
            'video/mp4; codecs="av01.0.08M.08"',
            'video/mp4; codecs="av01.0.12M.08"'
        ].some((type) => codecProbe.canPlayType(type) !== '');
        const mediaUrl = (url) => {
            if (!url || !config.mediaVersion) return url;
            return `${url}${url.includes('?') ? '&' : '?'}v=${config.mediaVersion}`;
        };
        const sectionWeights = sections.map((section) => section.scroll || config.sceneScroll || 1.55);
        const totalWeight = sectionWeights.reduce((total, weight) => total + weight, 0);
        const stage = createElement('div', 'hworld-stage');
        const atmosphere = createElement('div', 'hworld-atmosphere');
        const aurora = createElement('div', 'hworld-aurora');
        const scan = createElement('div', 'hworld-scan');
        const vignette = createElement('div', 'hworld-vignette');
        const lightning = createElement('div', 'hworld-lightning');
        const energyArc = createElement('div', 'hworld-energy-arc');
        const copyLayer = createElement('div', 'hworld-copy-layer');
        const progress = createElement('div', 'hworld-progress');
        const progressFill = createElement('span');
        const scrollHint = createElement('div', 'hworld-scroll-hint');
        const track = createElement('div', 'hworld-track');
        const scenes = [];
        let viewportHeight = window.innerHeight;
        let rootTop = 0;
        let activeIndex = -1;
        let scrollTicking = false;
        let primed = false;
        let lastVideoTick = 0;

        root.innerHTML = '';
        root.classList.add('is-mounted');
        root.style.setProperty('--hworld-accent', sections[0].accent);
        document.body.classList.add('scroll-world-active');

        ['main', 'footer'].forEach((selector) => {
            const legacyElement = document.querySelector(`body > ${selector}`);
            if (!legacyElement) return;
            legacyElement.setAttribute('aria-hidden', 'true');
            legacyElement.inert = true;
        });

        progress.appendChild(progressFill);
        scrollHint.innerHTML = '<span>Scroll to direct the world</span><i></i>';
        atmosphere.append(aurora, scan, lightning, energyArc);
        for (let particleIndex = 0; particleIndex < 34; particleIndex += 1) {
            const particle = createElement('i', 'hworld-particle');
            particle.style.setProperty('--x', `${(particleIndex * 37) % 101}%`);
            particle.style.setProperty('--y', `${(particleIndex * 61) % 97}%`);
            particle.style.setProperty('--delay', `${-(particleIndex % 13)}s`);
            particle.style.setProperty('--duration', `${13 + (particleIndex % 11)}s`);
            atmosphere.appendChild(particle);
        }

        let runningOffset = 0;
        sections.forEach((section, index) => {
            const scene = createElement('article', 'hworld-scene');
            const poster = createElement('img', 'hworld-poster');
            const video = createElement('video', 'hworld-video');
            const hold = section.hold ? createElement('img', 'hworld-hold') : null;
            const copy = createElement('section', `hworld-copy hworld-copy--${section.align || (index % 2 ? 'right' : 'left')}`);
            copy.dataset.section = section.id;
            const posterUrl = mediaUrl(section.still);
            let selectedClip = supportsAv1 && section.clipAv1 ? section.clipAv1 : section.clip;
            let fallbackAttempted = false;
            const start = runningOffset;
            const end = start + sectionWeights[index];

            runningOffset = end;
            scene.id = `world-${section.id || index + 1}`;
            scene.style.setProperty('--scene-accent', section.accent);
            copy.style.setProperty('--scene-accent', section.accent);
            copy.dataset.scene = section.id || String(index + 1);
            if (section.profile) copy.classList.add('has-profile');
            if (section.footer) copy.classList.add('has-footer');
            if (index === 0) copy.classList.add('is-hero');
            if (index === sections.length - 1) copy.classList.add('is-finale');

            poster.alt = '';
            poster.decoding = 'async';
            poster.loading = 'eager';

            video.muted = true;
            video.playsInline = true;
            video.preload = 'none';
            video.setAttribute('muted', '');
            video.setAttribute('playsinline', '');

            if (hold) {
                hold.src = mediaUrl(section.hold.still);
                hold.alt = '';
                hold.decoding = 'async';
                hold.loading = index < 2 ? 'eager' : 'lazy';
            }

            copy.innerHTML = `
                <div class="hworld-copy__frame">
                    ${profileMarkup(section.profile)}
                    <div class="hworld-copy__header">
                        <span class="hworld-copy__eyebrow">${section.eyebrow}</span>
                    </div>
                    <h2>${section.title}</h2>
                    <p class="hworld-copy__lede">${section.body}</p>
                    ${metricsMarkup(section.metrics)}
                    ${signalsMarkup(section.signals)}
                    ${actionsMarkup(section.cta)}
                    ${footerMarkup(section.footer)}
                </div>
            `;

            const counters = Array.from(copy.querySelectorAll('[data-target]'));
            let sceneState = null;
            const setPosterSource = () => {
                if (poster.dataset.sourceReady === 'true') return;
                poster.dataset.sourceReady = 'true';
                poster.src = posterUrl;
            };
            const setVideoSource = (preload = 'metadata') => {
                if (sceneState.releaseTimer) {
                    window.clearTimeout(sceneState.releaseTimer);
                    sceneState.releaseTimer = null;
                }
                video.preload = preload;
                if (scene.dataset.sourceReady === 'true' || reducedMotion || !selectedClip) return;
                scene.dataset.sourceReady = 'true';
                video.src = mediaUrl(selectedClip);
                video.load();
            };
            const clearVideoSource = () => {
                if (scene.dataset.sourceReady !== 'true') return;
                video.pause();
                video.removeAttribute('src');
                video.load();
                scene.dataset.sourceReady = 'false';
                scene.classList.remove('has-video', 'has-metadata');
            };
            const scheduleVideoRelease = () => {
                if (scene.dataset.sourceReady !== 'true' || sceneState.releaseTimer) return;
                sceneState.releaseTimer = window.setTimeout(() => {
                    sceneState.releaseTimer = null;
                    clearVideoSource();
                }, 350);
            };

            video.addEventListener('loadedmetadata', () => {
                scene.classList.add('has-metadata');
                try {
                    sceneState.current = sceneState.target;
                    video.currentTime = clamp(sceneState.target, 0.002, 0.995) * video.duration;
                } catch (error) {
                    scene.classList.remove('has-video');
                }
            });
            video.addEventListener('seeked', () => scene.classList.add('has-video'));
            video.addEventListener('loadeddata', () => scene.classList.add('has-video'));
            video.addEventListener('error', () => {
                if (!fallbackAttempted && selectedClip !== section.clip && section.clip) {
                    fallbackAttempted = true;
                    selectedClip = section.clip;
                    video.src = mediaUrl(selectedClip);
                    video.load();
                    return;
                }
                scene.classList.remove('has-video');
            });

            scene.append(poster, video);
            if (hold) scene.appendChild(hold);
            stage.appendChild(scene);
            copyLayer.appendChild(copy);
            sceneState = {
                element: scene,
                poster,
                video,
                hold,
                holdConfig: section.hold || null,
                copy,
                counters,
                start,
                end,
                target: 0,
                current: 0,
                opacity: 0,
                counterActive: false,
                counterStart: null,
                releaseTimer: null,
                setPosterSource,
                setVideoSource,
                clearVideoSource,
                scheduleVideoRelease
            };
            scenes.push(sceneState);
            (section.anchors || []).forEach((anchor) => {
                document.querySelectorAll(`a[href="${anchor}"]`).forEach((link) => {
                    link.dataset.worldNavigation = 'true';
                    link.addEventListener('click', (event) => {
                        event.preventDefault();
                        jumpTo(index);
                    });
                });
            });
        });

        stage.append(atmosphere, vignette);
        root.append(stage, copyLayer, progress, scrollHint, track);
        scenes.forEach((scene) => scene.setPosterSource());

        function jumpTo(index) {
            const scene = scenes[index];
            if (!scene) return;
            const destination = rootTop + (scene.start + (scene.end - scene.start) * 0.38) * viewportHeight;
            window.scrollTo({ top: destination, behavior: reducedMotion ? 'auto' : 'smooth' });
        }

        function layout() {
            viewportHeight = window.innerHeight;
            rootTop = root.getBoundingClientRect().top + window.scrollY;
            track.style.height = `${(totalWeight + 0.72) * viewportHeight}px`;
            updateFromScroll();
        }

        function copyOpacity(index, localProgress, sceneOpacity) {
            const section = sections[index];
            if (Number.isFinite(section.copyStart)) {
                const fadeDuration = section.copyFadeIn || 0.16;
                return sceneOpacity * smooth((localProgress - section.copyStart) / fadeDuration);
            }
            if (index === 0) return sceneOpacity * (1 - smooth((localProgress - 0.68) / 0.24));
            if (index === scenes.length - 1) return sceneOpacity * smooth((localProgress - 0.03) / 0.22);
            const fadeIn = smooth((localProgress - 0.035) / 0.18);
            const fadeOut = 1 - smooth((localProgress - 0.79) / 0.16);
            return sceneOpacity * Math.min(fadeIn, fadeOut);
        }

        function updateCounters(scene, now) {
            if (!scene.counterActive) return;

            const elapsed = scene.counterStart === null ? 1 : (now - scene.counterStart) / 1250;
            const counterProgress = reducedMotion ? 1 : Math.max(0.08, smooth(elapsed));
            scene.counters.forEach((counter) => {
                const target = Number(counter.dataset.target || 0);
                const suffix = counter.dataset.suffix || '';
                counter.textContent = `${Math.round(target * counterProgress)}${suffix}`;
            });
        }

        function updateFromScroll() {
            const localY = window.scrollY - rootTop;
            const worldPosition = localY / viewportHeight;
            const fadeWidth = config.crossfade || 0.09;
            let nearestSection = 0;

            scenes.forEach((scene, index) => {
                if (worldPosition >= scene.start) nearestSection = index;
            });

            progressFill.style.transform = `scaleX(${clamp(worldPosition / totalWeight).toFixed(4)})`;
            scrollHint.style.opacity = `${clamp(1 - Math.max(localY, 0) / (viewportHeight * 0.7)).toFixed(3)}`;
            atmosphere.style.transform = `translate3d(0, ${Math.max(localY, 0) * -0.012}px, 0)`;

            scenes.forEach((scene, index) => {
                const localProgress = clamp((worldPosition - scene.start) / (scene.end - scene.start));
                const fadeIn = index === 0 ? 1 : smooth((worldPosition - (scene.start - fadeWidth)) / (fadeWidth * 2));
                const fadeOut = index === scenes.length - 1 ? 1 : smooth(((scene.end + fadeWidth) - worldPosition) / (fadeWidth * 2));
                const sceneOpacity = clamp(Math.min(fadeIn, fadeOut));
                const sceneVisible = sceneOpacity > 0.001;

                scene.element.classList.toggle('is-renderable', sceneVisible);
                scene.element.classList.toggle('is-active', sceneOpacity > 0.55);
                scene.opacity = sceneVisible ? sceneOpacity : 0;
                if (!sceneVisible) {
                    scene.element.style.opacity = '0';
                    scene.copy.classList.remove('is-renderable');
                    scene.copy.style.opacity = '0';
                    scene.copy.style.pointerEvents = 'none';
                    scene.copy.setAttribute('aria-hidden', 'true');
                    scene.counterActive = false;
                    scene.counterStart = null;
                    if (scene.hold) scene.hold.style.opacity = '0';
                    return;
                }

                let mediaProgress = localProgress;
                if (scene.holdConfig) {
                    const holdStart = scene.holdConfig.scrollStart ?? 0.36;
                    const holdEnd = scene.holdConfig.scrollEnd ?? 0.56;
                    const holdTime = scene.holdConfig.time ?? 0.5;
                    const holdFade = Math.min(0.045, (holdEnd - holdStart) * 0.25);

                    if (localProgress < holdStart) {
                        mediaProgress = holdStart > 0 ? (localProgress / holdStart) * holdTime : holdTime;
                    } else if (localProgress <= holdEnd) {
                        mediaProgress = holdTime;
                    } else {
                        mediaProgress = holdTime + ((localProgress - holdEnd) / (1 - holdEnd)) * (1 - holdTime);
                    }

                    const holdIn = smooth((localProgress - holdStart) / holdFade);
                    const holdOut = 1 - smooth((localProgress - (holdEnd - holdFade)) / holdFade);
                    scene.hold.style.opacity = (sceneOpacity * Math.min(holdIn, holdOut)).toFixed(3);
                }

                scene.target = mediaProgress;
                scene.element.style.opacity = sceneOpacity.toFixed(3);
                scene.element.style.zIndex = String(30 + Math.round(sceneOpacity * 20));
                scene.poster.style.transform = `scale(${(1.025 + localProgress * 0.065).toFixed(3)})`;

                const contentOpacity = copyOpacity(index, localProgress, sceneOpacity);
                scene.copy.classList.toggle('is-renderable', contentOpacity > 0.002);
                scene.copy.style.opacity = contentOpacity.toFixed(3);
                scene.copy.style.transform = `translate3d(0, ${(0.5 - localProgress) * 28}px, 0) scale(${(0.985 + contentOpacity * 0.015).toFixed(3)})`;
                scene.copy.style.pointerEvents = contentOpacity > 0.55 ? 'auto' : 'none';
                scene.copy.style.setProperty('--local-progress', localProgress.toFixed(3));
                scene.copy.setAttribute('aria-hidden', contentOpacity > 0.12 ? 'false' : 'true');
                const counterVisible = contentOpacity > 0.12;
                if (counterVisible && !scene.counterActive) {
                    scene.counterActive = true;
                    scene.counterStart = performance.now();
                } else if (!counterVisible) {
                    scene.counterActive = false;
                    scene.counterStart = null;
                }
            });

            if (nearestSection !== activeIndex) {
                activeIndex = nearestSection;
                root.style.setProperty('--hworld-accent', sections[activeIndex].accent);
                syncMediaSources();
            }

            scrollTicking = false;
        }

        function animateVideos(now) {
            scenes.forEach((scene) => updateCounters(scene, now));
            if (!reducedMotion && !document.hidden && now - lastVideoTick >= 1000 / 24) {
                lastVideoTick = now;
                scenes.forEach((scene, index) => {
                    if (
                        index !== activeIndex ||
                        !scene.video.duration ||
                        scene.video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
                        scene.video.seeking ||
                        scene.opacity < 0.02
                    ) return;
                    scene.current += (scene.target - scene.current) * 0.5;
                    const targetTime = clamp(scene.current, 0.002, 0.995) * scene.video.duration;
                    if (Math.abs(scene.video.currentTime - targetTime) > 0.018) {
                        try {
                            scene.video.currentTime = targetTime;
                        } catch (error) {
                            scene.element.classList.remove('has-video');
                        }
                    }
                });
            }
            window.requestAnimationFrame(animateVideos);
        }

        function syncMediaSources() {
            scenes.forEach((scene, index) => {
                if (document.hidden) {
                    scene.scheduleVideoRelease();
                } else if (index === activeIndex) {
                    scene.setVideoSource('auto');
                } else if (index === activeIndex + 1) {
                    scene.setVideoSource('metadata');
                } else {
                    scene.scheduleVideoRelease();
                }
            });
        }

        function primeVideos() {
            if (primed || reducedMotion) return;
            primed = true;
            const scene = scenes[activeIndex];
            if (!scene?.video.src) return;
            const promise = scene.video.play();
            if (promise?.then) promise.then(() => scene.video.pause()).catch(() => {});
        }

        window.addEventListener('scroll', () => {
            if (!scrollTicking) {
                scrollTicking = true;
                window.requestAnimationFrame(updateFromScroll);
            }
        }, { passive: true });
        window.addEventListener('resize', layout);
        window.addEventListener('load', layout);
        window.addEventListener('pointerdown', primeVideos, { once: true, passive: true });
        window.addEventListener('touchstart', primeVideos, { once: true, passive: true });
        window.addEventListener('pagehide', () => scenes.forEach((scene) => scene.clearVideoSource()));
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) scenes.forEach((scene) => { scene.current = scene.target; });
            syncMediaSources();
        });

        layout();
        updateFromScroll();
        window.requestAnimationFrame(animateVideos);
    }

    window.mountScrollWorld = mountScrollWorld;
}());
