/* ============================================
   TANIA'S PORTFOLIO — script.js
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

    /* --- NAVBAR SCROLL EFFECT --- */
    var nav = document.getElementById('nav');
    if (nav) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 60) {
                nav.style.background = 'rgba(242,237,230,0.96)';
                nav.style.boxShadow  = '0 2px 20px rgba(0,0,0,0.08)';
            } else {
                nav.style.background = 'rgba(242,237,230,0.75)';
                nav.style.boxShadow  = 'none';
            }
        });
    }


    /* --- OBJECT CAROUSEL --- */
    var track  = document.getElementById('ocarTrack');
    var dotBox = document.getElementById('ocarDots');

    if (track && dotBox) {
        var slides = Array.from(track.children).filter(function(el) {
            return el.classList.contains('ocar-slide');
        });
        var total = slides.length;
        var cur   = 0;

        // Build dots
        slides.forEach(function(_, i) {
            var d = document.createElement('div');
            d.className = 'ocar-dot' + (i === 0 ? ' active' : '');
            d.addEventListener('click', function() { go(i); });
            dotBox.appendChild(d);
        });

        function go(n) {
            cur = ((n % total) + total) % total;
            track.style.transform = 'translateX(-' + (cur * 100) + '%)';
            dotBox.querySelectorAll('.ocar-dot').forEach(function(d, i) {
                d.classList.toggle('active', i === cur);
            });
        }

        // Auto-advance every 2.5s
        setInterval(function() { go(cur + 1); }, 2500);

        // Touch swipe
        var tx = null;
        track.addEventListener('touchstart', function(e) { tx = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend', function(e) {
            if (tx === null) return;
            var diff = e.changedTouches[0].clientX - tx;
            if (Math.abs(diff) > 40) go(cur + (diff < 0 ? 1 : -1));
            tx = null;
        });
    }


    /* --- TIMELINE SCROLL REVEAL --- */
    var tlItems = Array.from(document.querySelectorAll('.tl-item'));

    if (tlItems.length) {
        if ('IntersectionObserver' in window) {
            var tlObs = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        var idx = tlItems.indexOf(entry.target);
                        setTimeout(function() {
                            entry.target.classList.add('visible');
                        }, idx * 100);
                        tlObs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0 });
            tlItems.forEach(function(el) { tlObs.observe(el); });
        } else {
            // Fallback for browsers without IntersectionObserver
            tlItems.forEach(function(el) { el.classList.add('visible'); });
        }
    }


    /* --- PARALLAX on hero background text --- */
    var heroBgText = document.querySelector('.hero-bg-text');
    if (heroBgText) {
        window.addEventListener('scroll', function() {
            var sy = window.scrollY;
            heroBgText.style.transform = 'translate(-50%, calc(-50% + ' + (sy * 0.15) + 'px))';
            heroBgText.style.opacity   = Math.max(0, 1 - sy / 500);
        });
    }


    /* --- COLLAGE CARDS parallax --- */
    var collageZone  = document.querySelector('.collage-zone');
    var collageCards = document.querySelectorAll('.collage-card');
    if (collageZone && collageCards.length) {
        collageZone.addEventListener('mousemove', function(e) {
            var rect = collageZone.getBoundingClientRect();
            var cx = (e.clientX - rect.left - rect.width  / 2) / rect.width;
            var cy = (e.clientY - rect.top  - rect.height / 2) / rect.height;
            collageCards.forEach(function(card, i) {
                var depth = (i + 1) * 6;
                card.style.translate = (cx * depth) + 'px ' + (cy * depth) + 'px';
            });
        });
        collageZone.addEventListener('mouseleave', function() {
            collageCards.forEach(function(card) { card.style.translate = ''; });
        });
    }


    /* --- VINYL tilt on hover --- */
    var vinyl = document.getElementById('bigVinyl');
    if (vinyl) {
        vinyl.addEventListener('mousemove', function(e) {
            var r  = vinyl.getBoundingClientRect();
            var cx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
            var cy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
            vinyl.style.transform = 'rotateX(' + (-cy * 15) + 'deg) rotateY(' + (cx * 15) + 'deg)';
        });
        vinyl.addEventListener('mouseleave', function() { vinyl.style.transform = ''; });
    }


    /* --- POSTCARD stagger on scroll --- */
    var postcards = document.querySelectorAll('.postcard');
    if (postcards.length) {
        var pcArr = Array.from(postcards);
        pcArr.forEach(function(c) {
            c.style.opacity   = '0';
            c.style.transform = 'translateY(28px)';
            c.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
        var pcObs = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var i = pcArr.indexOf(entry.target);
                    setTimeout(function() {
                        entry.target.style.opacity   = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, i * 120);
                    pcObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0 });
        pcArr.forEach(function(c) { pcObs.observe(c); });
    }


    /* --- GENRE CLOUD float --- */
    document.querySelectorAll('.genre').forEach(function(g) {
        g.style.animationDelay = (Math.random() * 3) + 's';
        g.style.animation = 'genreFloat ' + (2 + Math.random() * 2) + 's ease-in-out infinite alternate';
    });
    var fs = document.createElement('style');
    fs.textContent = '@keyframes genreFloat{from{transform:translateY(0)}to{transform:translateY(-8px)}}';
    document.head.appendChild(fs);


    /* --- STATS counter --- */
    var stats = document.querySelectorAll('.stat-number');
    if (stats.length) {
        var stObs = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting && !entry.target.dataset.counted) {
                    entry.target.dataset.counted = 'true';
                    var final = entry.target.textContent.trim();
                    var end = parseFloat(final);
                    if (!isNaN(end)) {
                        var s = 0, step = end / 40;
                        var t = setInterval(function() {
                            s += step;
                            if (s >= end) { entry.target.textContent = final; clearInterval(t); }
                            else entry.target.textContent = Math.floor(s);
                        }, 30);
                    }
                }
            });
        }, { threshold: 0.5 });
        stats.forEach(function(s) { stObs.observe(s); });
    }


    /* --- NAV HIGHLIGHTING --- */
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-links a');
    if (navLinks.length) {
        window.addEventListener('scroll', function() {
            var current = '';
            sections.forEach(function(s) {
                if (window.scrollY >= s.offsetTop - 200) current = s.id;
            });
            navLinks.forEach(function(link) {
                var active = link.getAttribute('href') === ('#' + current);
                link.style.opacity    = active ? '1' : '0.5';
                link.style.fontWeight = active ? '600' : '400';
            });
        });
    }

}); // end DOMContentLoaded
