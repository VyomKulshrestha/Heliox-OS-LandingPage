(() => {
    let loading = false;

    const loadScript = (source) => new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = source;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });

    const beginExploration = () => {
        if (loading) return;
        loading = true;
        window.__helioxExploreRequested = true;
        loadScript('scroll-world.js?v=34')
            .then(() => loadScript('scroll-world-init.js?v=27'))
            .catch(() => {
                // The animated HTML/CSS fallback remains usable if optional
                // cinematic media code cannot be loaded.
                loading = false;
            });
    };

    ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach((eventName) => {
        window.addEventListener(eventName, beginExploration, { once: true, passive: true });
    });
    window.addEventListener('scroll', beginExploration, { once: true, passive: true });
})();
