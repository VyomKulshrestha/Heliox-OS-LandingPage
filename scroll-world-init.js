document.addEventListener('DOMContentLoaded', () => {
    const world = document.getElementById('scroll-world');

    window.mountScrollWorld(world, {
        sceneScroll: 1.62,
        crossfade: 0.1,
        sections: [
            {
                label: 'Awakening',
                eyebrow: 'THE STORM SIGNAL',
                title: 'Command the machine. Move the world.',
                body: 'A living operating system wakes beneath the storm. Every intent becomes motion, every action remains visible.',
                tags: ['Voice-native', 'Open source', 'Local first'],
                accent: '#5de9ff',
                still: 'assets/scroll-world/posters/clip-01-start.webp',
                clip: 'assets/scroll-world/clip-01.mp4',
                scroll: 1.72
            },
            {
                label: 'Perception',
                eyebrow: 'THE PERCEPTION FIELD',
                title: 'Your intent becomes spatial intelligence.',
                body: 'Voice, gaze, gesture, and live context fuse into one continuously aware command surface.',
                tags: ['30+ gestures', 'Always-on vision', 'Ambient voice'],
                accent: '#72f3ff',
                still: 'assets/scroll-world/posters/clip-02-start.webp',
                clip: 'assets/scroll-world/clip-02.mp4',
                scroll: 1.64
            },
            {
                label: 'Agents',
                eyebrow: 'THE AGENT FOUNDRY',
                title: 'Plans become coordinated action.',
                body: 'Specialized agents decompose complex objectives, operate in parallel, and reconnect every result into a verified whole.',
                tags: ['21 agents', '156 actions', 'Parallel execution'],
                accent: '#b797ff',
                still: 'assets/scroll-world/posters/clip-03-start.webp',
                clip: 'assets/scroll-world/clip-03.mp4',
                scroll: 1.78
            },
            {
                label: 'Safety',
                eyebrow: 'THE SAFETY CORE',
                title: 'Power is nothing without control.',
                body: 'Permission rings, confirmation gates, rollback paths, and local policy keep autonomous work inspectable and reversible.',
                tags: ['Tier 5 security', 'Human approval', 'Rollback ready'],
                accent: '#d3a4ff',
                still: 'assets/scroll-world/posters/clip-04-start.webp',
                clip: 'assets/scroll-world/clip-04.mp4',
                scroll: 1.82
            },
            {
                label: 'Horizon',
                eyebrow: 'THE COMMAND HORIZON',
                title: 'One calm system. Infinite operational reach.',
                body: 'Heliox turns your entire digital environment into a coherent world you can direct with natural intent.',
                tags: ['Private by design', 'Runs on your hardware', 'Built to extend'],
                accent: '#62e8ff',
                still: 'assets/scroll-world/posters/clip-05-start.webp',
                clip: 'assets/scroll-world/clip-05.mp4',
                scroll: 2.05,
                cta: {
                    primary: { label: 'Download Heliox', href: '#install' },
                    secondary: { label: 'Explore the system', href: '#features' }
                }
            }
        ]
    });
});
