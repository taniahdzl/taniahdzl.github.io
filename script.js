/* ============================================
   TANIA'S PORTFOLIO — script.js
   ============================================ */

/* --- CUSTOM CURSOR --- */
// Disabled - using default browser cursor instead


/* --- NAVBAR SCROLL EFFECT --- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        nav.style.background = 'rgba(242,237,230,0.96)';
        nav.style.boxShadow  = '0 2px 20px rgba(0,0,0,0.08)';
    } else {
        nav.style.background = 'rgba(242,237,230,0.75)';
        nav.style.boxShadow  = 'none';
    }
});


/* --- OBJECT CAROUSEL --- */
(function () {
    const track  = document.getElementById('ocarTrack');
    const dotBox = document.getElementById('ocarDots');
    if (!track) return;

    const slides = track.querySelectorAll('.ocar-slide');
    const total  = slides.length;
    let cur = 0;

    // Build dots
    slides.forEach((_, i) => {
        const d = document.createElement('div');
        d.className = 'ocar-dot' + (i === 0 ? ' active' : '');
        d.addEventListener('click', () => go(i));
        dotBox.appendChild(d);
    });

    function go(n) {
        cur = ((n % total) + total) % total;
        track.style.transform = 'translateX(-' + (cur * 100) + '%)';
        dotBox.querySelectorAll('.ocar-dot').forEach((d, i) => {
            d.classList.toggle('active', i === cur);
        });
    }

    // Auto-advance
    setInterval(() => go(cur + 1), 2500);

    // Touch swipe
    let tx = null;
    track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
        if (tx === null) return;
        if (Math.abs(e.changedTouches[0].clientX - tx) > 40)
            go(cur + (e.changedTouches[0].clientX < tx ? 1 : -1));
        tx = null;
    });
}());


/* --- SCROLL REVEAL --- */
(function () {
    const items = Array.from(document.querySelectorAll('.tl-item'));
    if (!items.length) return;

    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const idx = items.indexOf(entry.target);
            setTimeout(() => entry.target.classList.add('visible'), idx * 100);
            io.unobserve(entry.target);
        });
    }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });

    items.forEach(el => io.observe(el));
}());


/* --- PARALLAX on hero background text --- */
const heroBgText = document.querySelector('.hero-bg-text');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (heroBgText) {
        heroBgText.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.15}px))`;
        heroBgText.style.opacity   = Math.max(0, 1 - scrollY / 500);
    }
});


/* --- COLLAGE CARDS: subtle mouse parallax --- */
const collageZone  = document.querySelector('.collage-zone');
const collageCards = document.querySelectorAll('.collage-card');

if (collageZone) {
    collageZone.addEventListener('mousemove', e => {
        const rect = collageZone.getBoundingClientRect();
        const cx   = (e.clientX - rect.left - rect.width  / 2) / rect.width;
        const cy   = (e.clientY - rect.top  - rect.height / 2) / rect.height;

        collageCards.forEach((card, i) => {
            const depth = (i + 1) * 6;
            card.style.transform += '';   // don't override rotation; add translate
            card.style.translate  = `${cx * depth}px ${cy * depth}px`;
        });
    });
    collageZone.addEventListener('mouseleave', () => {
        collageCards.forEach(card => { card.style.translate = ''; });
    });
}


/* --- VINYL 3D tilt on hover --- */
const vinyl = document.getElementById('bigVinyl');
if (vinyl) {
    vinyl.addEventListener('mousemove', e => {
        const r    = vinyl.getBoundingClientRect();
        const cx   = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
        const cy   = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
        vinyl.style.transform = `rotateX(${-cy * 15}deg) rotateY(${cx * 15}deg)`;
    });
    vinyl.addEventListener('mouseleave', () => {
        vinyl.style.transform = '';
    });
}


/* --- ATLAS CARDS stagger on scroll --- */
const atlasCards = document.querySelectorAll('.atlas-card');
const atlasObs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity   = '1';
                entry.target.style.transform = 'translateY(0)';
            }, i * 100);
        }
    });
}, { threshold: 0.1 });

atlasCards.forEach(card => {
    card.style.opacity   = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s';
    atlasObs.observe(card);
});


/* --- GENRE CLOUD: random float animation offsets --- */
document.querySelectorAll('.genre').forEach(g => {
    g.style.animationDelay = `${Math.random() * 3}s`;
    g.style.animation      = `float ${2 + Math.random() * 2}s ease-in-out infinite alternate`;
});

const floatStyle = document.createElement('style');
floatStyle.textContent = `
    @keyframes float {
        from { transform: translateY(0px); }
        to   { transform: translateY(-8px); }
    }
`;
document.head.appendChild(floatStyle);


/* --- STATS counter animation --- */
const stats = document.querySelectorAll('.stat-number');
const statObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
            entry.target.dataset.counted = true;
            const final = entry.target.textContent;
            if (!isNaN(parseFloat(final))) {
                const end = parseFloat(final);
                let start = 0;
                const step = end / 40;
                const timer = setInterval(() => {
                    start += step;
                    if (start >= end) {
                        entry.target.textContent = final;
                        clearInterval(timer);
                    } else {
                        entry.target.textContent = Math.floor(start);
                    }
                }, 30);
            }
        }
    });
}, { threshold: 0.5 });
stats.forEach(s => statObs.observe(s));


/* --- Smooth active nav link highlighting --- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 200) current = s.id;
    });
    navLinks.forEach(link => {
        link.style.opacity = link.getAttribute('href') === `#${current}` ? '1' : '0.5';
        link.style.fontWeight = link.getAttribute('href') === `#${current}` ? '600' : '400';
    });
});
