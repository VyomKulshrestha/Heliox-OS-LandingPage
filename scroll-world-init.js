document.addEventListener('DOMContentLoaded', () => {
    const world = document.getElementById('scroll-world');

    window.mountScrollWorld(world, {
        mediaVersion: '17',
        sceneScroll: 1.58,
        crossfade: 0.08,
        sections: [
            {
                id: 'awakening',
                label: 'Awakening',
                anchors: ['#top'],
                eyebrow: 'JARVIS AUTONOMY v0.10.1 / OPEN SOURCE',
                title: 'Your computer becomes an intelligent world.',
                body: 'Heliox is a privacy-first AI system control agent that plans, executes, and verifies complex work across your computer using natural language, voice, vision, and gesture.',
                accent: '#6deeff',
                align: 'left',
                still: 'assets/scroll-world/posters/clip-01-start.webp',
                clip: 'assets/scroll-world/enhanced/clip-01-ai-1440p.mp4',
                hold: {
                    still: 'assets/scroll-world/enhanced/clip-01-hold-4k.webp',
                    time: 0.504,
                    scrollStart: 0.34,
                    scrollEnd: 0.58
                },
                scroll: 1.9,
                metrics: [
                    { target: 156, label: 'action types' },
                    { target: 30, suffix: '+', label: 'gestures' },
                    { target: 21, label: 'specialist agents' },
                    { value: 'Tier 5', label: 'security' }
                ],
                cta: {
                    primary: { label: 'Download v0.10.1', href: 'https://github.com/VyomKulshrestha/Heliox-OS/releases' },
                    secondary: { label: 'Explore source', href: 'https://github.com/VyomKulshrestha/Heliox-OS' }
                }
            },
            {
                id: 'features',
                label: 'Perception',
                anchors: ['#features'],
                eyebrow: 'INTERACTION + INTELLIGENCE',
                title: 'Intent enters through every human channel.',
                body: 'The perception field fuses voice, hand motion, live screen context, and adaptive calibration into one continuously aware command surface.',
                accent: '#77efff',
                align: 'right',
                still: 'assets/scroll-world/posters/clip-02-start.webp',
                clip: 'assets/scroll-world/clip-02.mp4',
                signals: [
                    { title: 'Voice & speech', body: 'Ambient wake word, VAD endpoints, barge-in, and real-time push-free dispatch.' },
                    { title: '30+ hand gestures', body: 'Static poses, motion gestures, air drawing, cursor control, and opt-in gaze fusion.' },
                    { title: 'Always-on awareness', body: 'A local computer-vision loop keeps the active app and screen state available to the planner.' },
                    { title: 'Adaptive control', body: 'On-device calibration personalizes interaction thresholds while staying bounded and resettable.' }
                ]
            },
            {
                id: 'jarvis',
                label: 'Cognition',
                anchors: ['#jarvis', '#cognitive'],
                eyebrow: 'JARVIS COGNITIVE FIELD',
                title: 'A system that reasons before it acts.',
                body: 'JARVIS runs a continuous ReAct loop, estimates cognitive load locally, and keeps an execution companion beside every autonomous plan.',
                accent: '#b998ff',
                align: 'left',
                still: 'assets/scroll-world/posters/clip-03-start.webp',
                clip: 'assets/scroll-world/clip-03.mp4',
                signals: [
                    { title: 'Proactive suggestions', body: 'Grounded next actions emerge from the current screen, memory, and verified results.' },
                    { title: 'Execution companion', body: 'Plans can be reviewed, corrected, stopped, or redirected while work is still running.' },
                    { title: 'Cognitive engine', body: 'Attention, stress, and load estimates adapt pacing, confirmations, and notification timing.' },
                    { title: 'Persona fingerprint', body: 'A local, resettable engagement model tunes behavior without external tracking.' }
                ]
            },
            {
                id: 'architecture',
                label: 'Architecture',
                anchors: ['#architecture'],
                eyebrow: 'THE AGENT FOUNDRY',
                title: 'One objective. Twenty-one coordinated specialists.',
                body: 'The gateway, planner, orchestrator, specialists, verifier, reflector, and security layer form a modular cognitive pipeline rather than a simple command runner.',
                accent: '#c4a4ff',
                align: 'right',
                still: 'assets/scroll-world/posters/clip-04-start.webp',
                clip: 'assets/scroll-world/clip-04.mp4',
                metrics: [
                    { target: 7, label: 'pipeline stages' },
                    { target: 21, label: 'specialist agents' },
                    { value: 'ReAct', label: 'execution loop' }
                ],
                signals: [
                    { title: 'Task decomposition', body: 'Complex goals become parallel, dependency-aware work units.' },
                    { title: 'Simulation sandbox', body: 'Risky operations can be previewed before touching the live system.' },
                    { title: 'Verification + reflection', body: 'Every result is checked, then used to improve future planning prompts.' }
                ]
            },
            {
                id: 'about',
                label: 'About',
                anchors: ['#about'],
                eyebrow: 'THE HUMAN IN THE LOOP',
                title: 'Hi, I’m Vyom.',
                body: 'A pre-final year Computer Science student at VIT, building next-generation AI systems and intelligent developer experiences.',
                accent: '#71e9ff',
                align: 'left',
                still: 'assets/scroll-world/posters/clip-05-start.webp',
                clip: 'assets/scroll-world/clip-05.mp4',
                scroll: 2.15,
                profile: {
                    portrait: 'image.png',
                    name: 'Vyom Kulshrestha',
                    role: 'Creator of Heliox OS'
                },
                signals: [
                    { title: 'Why Heliox exists', body: 'To unite autonomous agents, multimodal intelligence, and system-level automation in one coherent experience.' },
                    { title: 'Open invitation', body: 'Developers, contributors, recruiters, and anyone building the future of human-computer interaction are welcome.' }
                ],
                cta: {
                    primary: { label: 'Connect on LinkedIn', href: 'https://www.linkedin.com/in/vyomkulshrestha' },
                    secondary: { label: 'Email Vyom', href: 'mailto:vyomkulshrestha2004@gmail.com' }
                }
            },
            {
                id: 'actions',
                label: 'Actions',
                anchors: ['#actions'],
                eyebrow: 'THE ACTION LATTICE',
                title: '156 actions become one command language.',
                body: 'The planner schema spans the operating system, browser, code, packages, windows, Git, devices, schedules, and integrations with complete provider coverage.',
                accent: '#67efff',
                align: 'right',
                still: 'assets/scroll-world/continuation/posters/clip-06-start.jpg',
                clip: 'assets/scroll-world/continuation/clip-06.mp4',
                metrics: [
                    { target: 156, label: 'declared actions' },
                    { target: 17, label: 'capability groups' },
                    { value: '156/156', label: 'provider coverage' }
                ],
                signals: [
                    { title: 'Operate', body: 'Files, processes, shell, windows, packages, power, audio, display, network, and clipboard.' },
                    { title: 'Build', body: 'Code execution, Git workflows, environment variables, plugins, WASM, and reusable skills.' },
                    { title: 'Observe', body: 'Browser control, screenshots, vision, system information, and scheduled tasks.' }
                ]
            },
            {
                id: 'plugins',
                label: 'Ecosystem',
                anchors: ['#plugins'],
                eyebrow: 'EXTENSIBLE BY DESIGN',
                title: 'The system grows without surrendering trust.',
                body: 'Signed plugins, WASM boundaries, and reusable skills let Heliox expand into weather, media, smart-home, and future integrations without weakening the core.',
                accent: '#c89cff',
                align: 'left',
                still: 'assets/scroll-world/continuation/posters/clip-07-start.jpg',
                clip: 'assets/scroll-world/continuation/clip-07.mp4',
                signals: [
                    { title: 'Weather intelligence', body: 'Contextual forecasts become inputs for proactive planning and daily routines.' },
                    { title: 'Media control', body: 'Spotify and audio workflows operate through the same verified action model.' },
                    { title: 'Home automation', body: 'Home Assistant integrations connect physical spaces to the command horizon.' },
                    { title: 'Signed execution', body: 'Ed25519 verification and scoped capabilities keep extensions attributable and bounded.' }
                ]
            },
            {
                id: 'security',
                label: 'Security',
                anchors: ['#security'],
                eyebrow: 'THE SAFETY CORE',
                title: 'Autonomy with brakes, memory, and proof.',
                body: 'Heliox is designed to make powerful actions inspectable, permissioned, reversible, and private on the machine where they run.',
                accent: '#8feee1',
                align: 'right',
                still: 'assets/scroll-world/continuation/posters/clip-08-start.jpg',
                clip: 'assets/scroll-world/continuation/clip-08.mp4',
                signals: [
                    { title: 'Five-tier permissions', body: 'Risk determines whether work proceeds, simulates, confirms, or stops.' },
                    { title: 'Safety critic + learned risk', body: 'Plans are challenged before execution and compared with bounded local risk history.' },
                    { title: 'Snapshot rollback', body: 'Recoverable operations keep a concrete path back when outcomes drift.' },
                    { title: 'Private foundations', body: 'Encrypted key storage, open-source voice, and mid-flight cancellation keep authority local.' }
                ],
                cta: {
                    primary: { label: 'Read security whitepaper', href: 'whitepaper.html' },
                    secondary: { label: 'Privacy policy', href: 'privacy.html' }
                }
            },
            {
                id: 'install',
                label: 'Install',
                anchors: ['#install', '#try'],
                eyebrow: 'ENTER THE SYSTEM',
                title: 'Three platforms. One command horizon.',
                body: 'Install Heliox on Windows, macOS, or Linux, then test the complete interaction loop from natural-language intent to verified execution.',
                accent: '#76ebff',
                align: 'left',
                still: 'assets/scroll-world/continuation/posters/clip-09-start.jpg',
                clip: 'assets/scroll-world/continuation/clip-09.mp4',
                signals: [
                    { title: 'Windows', body: 'Download the current release and launch the native desktop experience.' },
                    { title: 'macOS', body: 'Build from source with the same local-first agent and security model.' },
                    { title: 'Linux', body: 'Run the open stack directly and extend the adapters for your environment.' },
                    { title: 'Try the live loop', body: 'Speak, gesture, or type an objective and inspect every planned and verified step.' }
                ],
                cta: {
                    primary: { label: 'Download release', href: 'https://github.com/VyomKulshrestha/Heliox-OS/releases' },
                    secondary: { label: 'Installation docs', href: 'https://github.com/VyomKulshrestha/Heliox-OS#readme' }
                }
            },
            {
                id: 'contact',
                label: 'Horizon',
                anchors: ['#contact'],
                eyebrow: 'THE COMMAND HORIZON',
                title: 'Build the future of human–computer interaction.',
                body: 'Heliox is open source, built independently, and growing with every contributor. Download it, inspect it, challenge it, and help shape what comes next.',
                accent: '#bda1ff',
                align: 'left',
                still: 'assets/scroll-world/continuation/posters/clip-10-start.jpg',
                clip: 'assets/scroll-world/continuation/clip-10.mp4',
                scroll: 2.2,
                cta: {
                    primary: { label: 'Download Heliox', href: 'https://github.com/VyomKulshrestha/Heliox-OS/releases' },
                    secondary: { label: 'Contribute on GitHub', href: 'https://github.com/VyomKulshrestha/Heliox-OS' },
                    tertiary: { label: 'Join Discord', href: 'https://discord.gg/EcEtkBfXU' }
                },
                footer: {
                    links: [
                        { label: 'Documentation', href: 'https://github.com/VyomKulshrestha/Heliox-OS#readme' },
                        { label: 'Privacy', href: 'privacy.html' },
                        { label: 'Security', href: 'whitepaper.html' },
                        { label: 'YouTube', href: 'https://www.youtube.com/@HelioxOS' }
                    ],
                    meta: '© 2026 HELIOX OS / v0.10.1'
                }
            }
        ]
    });
});
