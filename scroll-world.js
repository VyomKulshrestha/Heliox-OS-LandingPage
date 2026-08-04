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

    function mountScrollWorld(root, config) {
        if (!root || !config?.sections?.length) return;

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const sections = config.sections;
        const sectionWeights = sections.map((section) => section.scroll || config.sceneScroll || 1.55);
        const totalWeight = sectionWeights.reduce((total, weight) => total + weight, 0);
        const stage = createElement('div', 'hworld-stage');
        const atmosphere = createElement('div', 'hworld-atmosphere');
        const aurora = createElement('div', 'hworld-aurora');
        const scan = createElement('div', 'hworld-scan');
        const vignette = createElement('div', 'hworld-vignette');
        const lightning = createElement('div', 'hworld-lightning');
        const copyLayer = createElement('div', 'hworld-copy-layer');
        const route = createElement('nav', 'hworld-route');
        const progress = createElement('div', 'hworld-progress');
        const progressFill = createElement('span');
        const scrollHint = createElement('div', 'hworld-scroll-hint');
        const track = createElement('div', 'hworld-track');
        const signal = createElement('div', 'hworld-signal');
        const scenes = [];
        const copies = [];
        const routeButtons = [];
        let viewportHeight = window.innerHeight;
        let rootTop = 0;
        let activeIndex = -1;
        let scrollTicking = false;

        root.innerHTML = '';
        root.classList.add('is-mounted');
        root.style.setProperty('--hworld-accent', sections[0].accent);
        root.style.setProperty('--hworld-world-opacity', '1');

        progress.appendChild(progressFill);
        scrollHint.innerHTML = '<span>Scroll to enter Heliox</span><i></i>';
        signal.innerHTML = '<span></span><b>HELIOX SIGNAL</b><small>LIVE WORLD / 24 FPS</small>';

        atmosphere.append(aurora, scan, lightning);
        for (let particleIndex = 0; particleIndex < 28; particleIndex += 1) {
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
            const copy = createElement('div', `hworld-copy hworld-copy--${index % 2 ? 'right' : 'left'}`);
            const routeButton = createElement('button', 'hworld-route__button');
            const start = runningOffset;
            const end = start + sectionWeights[index];

            runningOffset = end;
            if (index === sections.length - 1) copy.classList.add('is-final');
            poster.src = section.still;
            poster.alt = '';
            poster.decoding = 'async';
            poster.loading = index < 2 ? 'eager' : 'lazy';
            video.muted = true;
            video.playsInline = true;
            video.preload = index < 2 ? 'auto' : 'metadata';
            video.poster = section.still;
            video.setAttribute('muted', '');
            video.setAttribute('playsinline', '');

            const setVideoSource = () => {
                if (scene.dataset.sourceReady === 'true' || reducedMotion) return;
                scene.dataset.sourceReady = 'true';
                video.src = section.clip;
                video.load();
            };

            video.addEventListener('loadedmetadata', () => {
                scene.classList.add('has-metadata');
                video.currentTime = 0.01;
            });
            video.addEventListener('seeked', () => scene.classList.add('has-video'), { once: true });
            video.addEventListener('error', () => scene.classList.remove('has-video'));

            copy.innerHTML = `
                <span class="hworld-copy__index">0${index + 1} / 0${sections.length}</span>
                <span class="hworld-copy__eyebrow">${section.eyebrow}</span>
                <h2>${section.title}</h2>
                <p>${section.body}</p>
                <ul>${section.tags.map((tag) => `<li>${tag}</li>`).join('')}</ul>
                ${section.cta ? `<div class="hworld-copy__actions"><a href="${section.cta.primary.href}">${section.cta.primary.label}</a><a class="is-ghost" href="${section.cta.secondary.href}">${section.cta.secondary.label}</a></div>` : ''}
            `;

            routeButton.type = 'button';
            routeButton.setAttribute('aria-label', `Go to ${section.label}`);
            routeButton.innerHTML = `<span>${section.label}</span><i></i>`;
            routeButton.addEventListener('click', () => {
                const destination = rootTop + (start + sectionWeights[index] * 0.48) * viewportHeight;
                window.scrollTo({ top: destination, behavior: reducedMotion ? 'auto' : 'smooth' });
            });

            scene.style.setProperty('--scene-accent', section.accent);
            copy.style.setProperty('--scene-accent', section.accent);
            scene.append(poster, video);
            stage.appendChild(scene);
            copyLayer.appendChild(copy);
            route.appendChild(routeButton);
            scenes.push({ element: scene, poster, video, start, end, target: 0, current: 0, setVideoSource });
            copies.push(copy);
            routeButtons.push(routeButton);
        });

        stage.append(atmosphere, vignette);
        root.append(stage, copyLayer, route, progress, signal, scrollHint, track);

        function layout() {
            viewportHeight = window.innerHeight;
            rootTop = root.getBoundingClientRect().top + window.scrollY;
            track.style.height = `${(totalWeight + 0.9) * viewportHeight}px`;
            updateFromScroll();
        }

        function copyOpacity(index, localProgress, sceneOpacity) {
            if (index === 0) return sceneOpacity * (1 - smooth((localProgress - 0.06) / 0.56));
            if (index === sections.length - 1) return sceneOpacity * smooth((localProgress - 0.12) / 0.42);
            return sceneOpacity * smooth(1 - Math.abs(localProgress - 0.5) / 0.48);
        }

        function updateFromScroll() {
            const localY = window.scrollY - rootTop;
            const worldPosition = localY / viewportHeight;
            const exitStart = totalWeight + 0.08;
            const exitEnd = totalWeight + 0.72;
            const worldOpacity = localY < 0 ? 1 : 1 - smooth((worldPosition - exitStart) / (exitEnd - exitStart));
            const fadeWidth = config.crossfade || 0.11;
            let nearestSection = 0;

            root.style.setProperty('--hworld-world-opacity', clamp(worldOpacity).toFixed(3));
            root.classList.toggle('is-past', worldPosition > exitEnd);
            progressFill.style.transform = `scaleX(${clamp(worldPosition / totalWeight).toFixed(4)})`;
            scrollHint.style.opacity = `${clamp(1 - Math.max(localY, 0) / (viewportHeight * 0.58)).toFixed(3)}`;
            atmosphere.style.transform = `translate3d(0, ${Math.max(localY, 0) * -0.018}px, 0)`;

            scenes.forEach((scene, index) => {
                const localProgress = clamp((worldPosition - scene.start) / (scene.end - scene.start));
                const fadeIn = index === 0 ? 1 : smooth((worldPosition - (scene.start - fadeWidth)) / (fadeWidth * 2));
                const fadeOut = index === scenes.length - 1 ? 1 : smooth(((scene.end + fadeWidth) - worldPosition) / (fadeWidth * 2));
                const sceneOpacity = clamp(Math.min(fadeIn, fadeOut)) * clamp(worldOpacity);
                const distance = Math.min(Math.abs(worldPosition - scene.start), Math.abs(worldPosition - scene.end));

                if (worldPosition >= scene.start) nearestSection = index;
                if (distance < 2.2 || index === 0) scene.setVideoSource();
                scene.target = localProgress;
                scene.element.style.opacity = sceneOpacity.toFixed(3);
                scene.element.style.zIndex = String(30 + Math.round(sceneOpacity * 20));
                scene.poster.style.transform = `scale(${(1.035 + localProgress * 0.08).toFixed(3)})`;

                const contentOpacity = copyOpacity(index, localProgress, sceneOpacity);
                copies[index].style.opacity = contentOpacity.toFixed(3);
                copies[index].style.transform = `translate3d(0, ${(0.5 - localProgress) * 34}px, 0)`;
                copies[index].style.pointerEvents = contentOpacity > 0.55 ? 'auto' : 'none';
            });

            if (nearestSection !== activeIndex) {
                activeIndex = nearestSection;
                routeButtons.forEach((button, index) => button.classList.toggle('is-active', index === activeIndex));
                root.style.setProperty('--hworld-accent', sections[activeIndex].accent);
            }
            scrollTicking = false;
        }

        function animateVideos() {
            if (!reducedMotion) {
                scenes.forEach((scene) => {
                    if (!scene.video.duration || scene.video.seeking || scene.element.style.opacity === '0.000') return;
                    scene.current += (scene.target - scene.current) * 0.16;
                    const targetTime = clamp(scene.current, 0, 0.997) * scene.video.duration;
                    if (Math.abs(scene.video.currentTime - targetTime) > 0.012) {
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

        window.addEventListener('scroll', () => {
            if (!scrollTicking) {
                scrollTicking = true;
                window.requestAnimationFrame(updateFromScroll);
            }
        }, { passive: true });
        window.addEventListener('resize', layout);
        window.addEventListener('load', layout);
        layout();
        updateFromScroll();
        window.requestAnimationFrame(animateVideos);
    }

    window.mountScrollWorld = mountScrollWorld;
}());
