document.addEventListener('DOMContentLoaded', () => {
    // ---- Navbar Scroll Effect ----
    const navbar = document.querySelector('nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });

    // ---- Smooth Scroll for Anchor Links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
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

    // ---- Scroll Reveal Animation ----
    const sections = document.querySelectorAll('section, h1, h2, h3, h4, p, .group');
    sections.forEach(section => {
        section.classList.add('reveal');
    });

    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 100;
        
        revealElements.forEach(element => {
            const revealTop = element.getBoundingClientRect().top;
            
            if (revealTop < windowHeight - revealPoint) {
                element.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load

    // ---- Button Routing ----
    const repoUrl = 'https://github.com/VyomKulshrestha/Heliox-OS';
    
    // Select all buttons by ID or text content
    const dlBtn1 = document.getElementById('download-btn-1');
    const dlBtn2 = document.getElementById('download-btn-2');
    const discordBtn = document.getElementById('discord-btn');

    // Also the Repository button in navbar
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        const text = btn.textContent.toLowerCase();
        
        // Handle "Repository" or "Download" buttons that should link to Github
        if (text.includes('repository') || btn === dlBtn1 || btn === dlBtn2) {
            btn.addEventListener('click', () => {
                // Flash effect before redirecting
                const originalBoxShadow = btn.style.boxShadow;
                btn.style.boxShadow = "0 0 50px rgba(0, 225, 255, 1)";
                setTimeout(() => {
                    window.open(repoUrl, '_blank');
                    btn.style.boxShadow = originalBoxShadow;
                }, 300);
            });
        }
    });



    // ---- Terminal Typing Effect ----
    const terminalLines = document.querySelectorAll('.overflow-x-auto > div');
    if (terminalLines.length > 0) {
        terminalLines.forEach(line => line.style.opacity = '0');
        
        // Use IntersectionObserver to start terminal effect when visible
        const terminalObserver = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting) {
                terminalLines.forEach((line, index) => {
                    setTimeout(() => {
                        line.style.opacity = '1';
                        line.animate([
                            { opacity: 0 },
                            { opacity: 1, offset: 0.1 },
                            { opacity: 0.5, offset: 0.2 },
                            { opacity: 1 }
                        ], { duration: 300 });
                    }, 500 + (index * 400));
                });
                // Unobserve after running once
                terminalObserver.disconnect();
            }
        });
        
        terminalObserver.observe(terminalLines[0].parentElement);
    }
});
