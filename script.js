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
const ocarTrack  = document.getElementById('ocarTrack');
const ocarDots   = document.getElementById('ocarDots');
const ocarPrev   = document.getElementById('ocarPrev');
const ocarNext   = document.getElementById('ocarNext');
const slides     = document.querySelectorAll('.ocar-slide');
const slideCount = slides.length;
let ocarIndex    = 0;
let ocarAuto;

console.log('Carousel initialized:', { slideCount, ocarPrev, ocarNext, ocarTrack });

// Build dots
if (ocarDots) {
    slides.forEach((_, i) => {
        const d = document.createElement('div');
        d.classList.add('ocar-dot');
        if (i === 0) d.classList.add('active');
        d.addEventListener('click', () => ocarGo(i));
        ocarDots.appendChild(d);
    });
}

function ocarGo(index) {
    ocarIndex = (index + slideCount) % slideCount;
    console.log('Moving to slide:', ocarIndex);
    
    if (ocarTrack) {
        ocarTrack.style.transform = `translateX(-${ocarIndex * 100}%)`;
    }
    
    document.querySelectorAll('.ocar-dot').forEach((d, i) => {
        d.classList.toggle('active', i === ocarIndex);
    });
    
    // Restart float animation on active slide
    slides.forEach((s, i) => {
        s.style.animationPlayState = i === ocarIndex ? 'running' : 'paused';
    });
    
    resetOcarAuto();
}

// Attach click listeners to buttons
if (ocarPrev) {
    ocarPrev.addEventListener('click', (e) => {
        console.log('Previous button clicked');
        ocarGo(ocarIndex - 1);
    });
} else {
    console.warn('Previous button not found');
}

if (ocarNext) {
    ocarNext.addEventListener('click', (e) => {
        console.log('Next button clicked');
        ocarGo(ocarIndex + 1);
    });
} else {
    console.warn('Next button not found');
}

// Touch / swipe support
let ocarTouchX = null;
if (ocarTrack) {
    ocarTrack.addEventListener('touchstart', e => { ocarTouchX = e.touches[0].clientX; }, { passive: true });
    ocarTrack.addEventListener('touchend', e => {
        if (ocarTouchX === null) return;
        const diff = e.changedTouches[0].clientX - ocarTouchX;
        if (Math.abs(diff) > 40) ocarGo(ocarIndex + (diff < 0 ? 1 : -1));
        ocarTouchX = null;
    });
}

function resetOcarAuto() {
    clearInterval(ocarAuto);
    ocarAuto = setInterval(() => {
        ocarGo(ocarIndex + 1);
    }, 4000);
}

// Initialize carousel with auto-rotation
if (slideCount > 0) {
    ocarGo(0);
    console.log('Carousel auto-rotation started');
}
}


/* --- SCROLL REVEAL (Intersection Observer) --- */
const revealEls = document.querySelectorAll('.tl-item');

const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, i * 120);
        }
    });
}, { threshold: 0.15 });

revealEls.forEach(el => observer.observe(el));


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
