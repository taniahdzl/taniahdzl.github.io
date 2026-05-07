/* ============================================
   TANIA'S PORTFOLIO — flight-simulator.js
   Portal: Boarding Pass → Flight Simulator
   ============================================ */

(function () {

    /* ---------- DATA ---------- */
    const DESTINATIONS = [
        {
            time: '08:15', city: 'SINGAPORE', country: 'CITY-STATE',
            code: 'SIN', gate: 'A1', flag: '🇸🇬',
            sky: 'linear-gradient(180deg,#0e2040 0%,#1a4080 50%,#e87040 80%,#f0a050 100%)',
            image: 'img/Singapore.JPG',
            date: 'AUG — DEC 2025',
            note: 'Home for 5 months. NUS changed everything — the transit system, the hawker centres, the density of ideas. I arrived a student and left something else.',
            moods: ['home base', 'NUS exchange', 'hawker centres', 'best transit ever', '5 months'],
            status: 'DEPARTED'
        },
        {
            time: '10:40', city: 'KYOTO', country: 'JAPAN',
            code: 'KIX', gate: 'B3', flag: '🇯🇵',
            sky: 'linear-gradient(180deg,#1a0e2e 0%,#3a1060 40%,#c04060 75%,#f08060 100%)',
            image: 'img/Kyoto.JPG',
            date: 'NOV 2025',
            note: 'Bamboo forests at 6am before the tourists arrived. Matcha everywhere. A 400-year-old temple where I sat for an hour doing nothing — and it felt like the right thing.',
            moods: ['bamboo forest', 'ancient temples', 'matcha everything', '4am sunrises'],
            status: 'BOARDING'
        },
        {
            time: '13:20', city: 'BANGKOK', country: 'THAILAND',
            code: 'BKK', gate: 'C7', flag: '🇹🇭',
            sky: 'linear-gradient(180deg,#200a0a 0%,#601520 40%,#d05020 75%,#f0a030 100%)',
            image: 'img/Bangkok.JPG',
            date: 'OCT 2025',
            note: 'Controlled chaos. A temple at every corner, tuk-tuks weaving through traffic, and the best street food on Earth. You don\'t visit Bangkok — you survive it, and love it.',
            moods: ['street food', 'temple chaos', 'tuk-tuks', 'night markets', 'survived it'],
            status: 'ON TIME'
        },
        {
            time: '15:55', city: 'SEOUL', country: 'SOUTH KOREA',
            code: 'ICN', gate: 'D2', flag: '🇰🇷',
            sky: 'linear-gradient(180deg,#080e20 0%,#102040 40%,#304870 75%,#6080a0 100%)',
            image: 'img/Seoul.JPG',
            date: 'NOV 2025',
            note: 'Palaces next to skyscrapers. K-indie on the subway at midnight. Street food in Myeongdong at 2am. The city never sleeps — and neither did I.',
            moods: ['K-indie playlists', 'Myeongdong 2am', 'palace vibes', 'city that never sleeps'],
            status: 'ON TIME'
        },
        {
            time: '17:10', city: 'BALI', country: 'INDONESIA',
            code: 'DPS', gate: 'E4', flag: '🇮🇩',
            sky: 'linear-gradient(180deg,#0a1a0a 0%,#1a4020 40%,#7a9840 75%,#d4c060 100%)',
            image: 'img/Bali.JPG',
            date: 'SEP 2025',
            note: 'Rice terraces and monkey forests. Watching the sun set over Tanah Lot with a coconut in hand. The kind of slow that makes you rethink everything.',
            moods: ['rice terraces', 'monkey forest', 'Tanah Lot', 'island slow'],
            status: 'ON TIME'
        },
        {
            time: '19:30', city: 'KL', country: 'MALAYSIA',
            code: 'KUL', gate: 'F1', flag: '🇲🇾',
            sky: 'linear-gradient(180deg,#100820 0%,#2a1050 45%,#5020a0 80%,#8040c0 100%)',
            image: 'img/KL.jpg',
            date: 'SEP 2025',
            note: 'Petronas Towers from the skybridge. Chinatown, Little India, and Malay kampungs all within walking distance. A city that somehow holds it all together.',
            moods: ['Petronas Towers', 'multicultural', 'Chinatown', 'chaos that works'],
            status: 'DEPARTED'
        },
        {
            time: '21:05', city: 'HANOI', country: 'VIETNAM',
            code: 'HAN', gate: 'G9', flag: '🇻🇳',
            sky: 'linear-gradient(180deg,#040810 0%,#0a1828 45%,#1a3848 80%,#304858 100%)',
            image: 'img/Hanoi.JPG',
            date: 'OCT 2025',
            note: 'Motorbikes everywhere. Pho at 7am in a tiny plastic chair. Halong Bay emerging from fog like a painting. Vietnam operates on a different frequency.',
            moods: ['Halong Bay', 'pho at dawn', 'motorbike chaos', 'different frequency'],
            status: 'DEPARTED'
        }
    ];

    /* ---------- STATE ---------- */
    let selectedIdx   = null;
    let currentFlight = 0;
    let clockInterval = null;

    /* ---------- HELPERS ---------- */
    function pad(n) { return String(n).padStart(2, '0'); }

    function updateClock() {
        var el = document.getElementById('fs-clock');
        if (!el) return;
        var now = new Date();
        el.textContent = pad(now.getHours()) + ' : ' + pad(now.getMinutes()) + ' : ' + pad(now.getSeconds());
    }

    /* ---------- FIDS BOARD ---------- */
    function renderFIDS() {
        var container = document.getElementById('fs-fids-rows');
        if (!container) return;
        container.innerHTML = '';
        DESTINATIONS.forEach(function (d, i) {
            var row = document.createElement('div');
            row.className = 'fs-fids-row' + (selectedIdx === i ? ' fs-selected' : '');
            var statusClass = d.status === 'BOARDING'
                ? 'fs-status-boarding'
                : (d.status === 'DEPARTED' ? 'fs-status-dep' : 'fs-status-ontime');
            row.innerHTML =
                '<span class="fs-fids-time">'   + d.time    + '</span>' +
                '<span class="fs-fids-dest">'   + d.city    + '<small>' + d.flag + ' ' + d.country + '</small></span>' +
                '<span class="fs-fids-flight">TNI-' + d.code + '</span>' +
                '<span class="fs-fids-gate">'   + d.gate    + '</span>' +
                '<span class="fs-fids-status '  + statusClass + '">' + d.status + '</span>';
            row.addEventListener('click', function () { selectDestination(i); });
            container.appendChild(row);
        });
    }

    function selectDestination(i) {
        selectedIdx = i;
        renderFIDS();
        var btn = document.getElementById('fs-board-btn');
        var d   = DESTINATIONS[i];
        btn.disabled    = false;
        btn.textContent = 'BOARD → ' + d.city + ' ' + d.flag;
        btn.onclick     = function () { openFlight(i); };
    }

    /* ---------- CLOUDS ---------- */
    function makeClouds() {
        var container = document.getElementById('fs-clouds');
        if (!container) return;
        container.innerHTML = '';
        for (var i = 0; i < 5; i++) {
            var cl = document.createElement('div');
            cl.className = 'fs-cloud';
            cl.style.cssText =
                'width:'              + (60  + Math.random() * 80)   + 'px;' +
                'height:'             + (18  + Math.random() * 20)   + 'px;' +
                'top:'                + (10  + Math.random() * 50)   + '%;'  +
                'animation-duration:' + (12  + Math.random() * 10)   + 's;'  +
                'animation-delay:'    + (-Math.random() * 12)        + 's;'  +
                'opacity:'            + (0.06 + Math.random() * 0.1) + ';';
            container.appendChild(cl);
        }
    }

    /* ---------- FLIGHT VIEW ---------- */
    function openFlight(idx) {
        currentFlight = idx;
        var terminal = document.getElementById('fs-terminal');
        var flight   = document.getElementById('fs-flight');
        terminal.style.display = 'none';
        flight.style.display   = 'flex';
        loadFlightData(idx);
        makeClouds();
        renderNavDots(idx);
    }

    function loadFlightData(idx) {
        var d = DESTINATIONS[idx];
        var skyEl = document.getElementById('fs-sky');
        
        // Use image if available, otherwise use sky gradient
        if (d.image) {
            skyEl.style.backgroundImage = 'url(' + d.image + ')';
            skyEl.style.backgroundSize = 'cover';
            skyEl.style.backgroundPosition = 'center';
            skyEl.style.backgroundColor = 'transparent';
        } else {
            skyEl.style.backgroundImage = 'none';
            skyEl.style.background = d.sky;
        }
        
        document.getElementById('fs-flag').textContent        = d.flag;
        document.getElementById('fs-flight-code').textContent = 'TNI-' + d.code;
        document.getElementById('fs-city').textContent        = d.city;
        document.getElementById('fs-country-label').textContent = d.country;
        document.getElementById('fs-ps-date').textContent     = d.date;
        document.getElementById('fs-ps-note').textContent     = d.note;

        var moodEl = document.getElementById('fs-ps-mood');
        moodEl.innerHTML = d.moods.map(function (m) {
            return '<span class="fs-mood-tag">' + m + '</span>';
        }).join('');

        document.querySelectorAll('.fs-nav-dot').forEach(function (dot, i) {
            dot.classList.toggle('fs-nav-dot--active', i === idx);
        });
    }

    function renderNavDots(activeIdx) {
        var container = document.getElementById('fs-nav-dots');
        container.innerHTML = '';
        DESTINATIONS.forEach(function (d, i) {
            var dot = document.createElement('button');
            dot.className = 'fs-nav-dot' + (i === activeIdx ? ' fs-nav-dot--active' : '');
            dot.title     = d.city;
            dot.setAttribute('aria-label', 'Go to ' + d.city);
            dot.addEventListener('click', function () {
                currentFlight = i;
                loadFlightData(i);
            });
            container.appendChild(dot);
        });
    }

    /* ---------- OVERLAY OPEN / CLOSE ---------- */
    function openOverlay() {
        var overlay = document.getElementById('fs-overlay');
        overlay.classList.add('fs-overlay--open');
        document.body.style.overflow = 'hidden';
        selectedIdx = null;
        renderFIDS();

        /* reset to terminal view */
        document.getElementById('fs-terminal').style.display = 'flex';
        document.getElementById('fs-flight').style.display   = 'none';
        document.getElementById('fs-board-btn').disabled     = true;
        document.getElementById('fs-board-btn').textContent  = 'SELECT A DESTINATION TO BOARD →';

        clockInterval = setInterval(updateClock, 1000);
        updateClock();
    }

    function closeOverlay() {
        var overlay = document.getElementById('fs-overlay');
        overlay.classList.remove('fs-overlay--open');
        document.body.style.overflow = '';
        clearInterval(clockInterval);
    }

    /* ---------- INIT ---------- */
    function init() {
        /* Inject overlay HTML */
        var overlay = document.createElement('div');
        overlay.id        = 'fs-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Tania\'s Asia Flight Simulator');
        overlay.innerHTML = getOverlayHTML();
        document.body.appendChild(overlay);

        /* Close button */
        document.getElementById('fs-close').addEventListener('click', closeOverlay);

        /* Close on backdrop click */
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) closeOverlay();
        });

        /* Escape key */
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeOverlay();
        });

        /* Back button inside flight view */
        document.getElementById('fs-back-btn').addEventListener('click', function () {
            document.getElementById('fs-flight').style.display   = 'none';
            document.getElementById('fs-terminal').style.display = 'flex';
        });

        /* Wire up the boarding-pass card in the hero carousel */
        wireCarouselTrigger();
    }

    function wireCarouselTrigger() {
        /* The boarding pass .ocar-slide is inside .boarding-obj */
        var boardingSlides = document.querySelectorAll('.boarding-obj');
        boardingSlides.forEach(function (el) {
            el.style.cursor = 'pointer';
            el.setAttribute('title', 'Click to open Flight Simulator');
            el.addEventListener('click', openOverlay);
        });
    }

    /* ---------- OVERLAY TEMPLATE ---------- */
    function getOverlayHTML() {
        return [
            '<div class="fs-modal">',
            '  <button class="fs-close-btn" id="fs-close" aria-label="Close flight simulator">✕</button>',

            '  <!-- TERMINAL VIEW -->',
            '  <div class="fs-terminal" id="fs-terminal">',
            '    <div class="fs-term-header">',
            '      <div class="fs-term-logo">TANIA · WORLD ATLAS</div>',
            '      <div class="fs-term-clock" id="fs-clock">— : — : —</div>',
            '    </div>',
            '    <div class="fs-board-label">DEPARTURES — ASIA SEMESTER 2025</div>',
            '    <div class="fs-fids-board">',
            '      <div class="fs-fids-head">',
            '        <span>TIME</span><span>DESTINATION</span><span>FLIGHT</span><span>GATE</span><span>STATUS</span>',
            '      </div>',
            '      <div id="fs-fids-rows"></div>',
            '    </div>',
            '    <button class="fs-board-btn" id="fs-board-btn" disabled>SELECT A DESTINATION TO BOARD →</button>',
            '    <div class="fs-ticker">',
            '      <span class="fs-ticker-inner">✈ SINGAPORE · NUS EXCHANGE AUG–DEC 2025 · TEMPLE HOPPING IN KYOTO · STREET FOOD IN BANGKOK · NIGHT MARKETS IN SEOUL · MONKEY FOREST IN BALI · HALONG BAY VIETNAM · PETRONAS TOWERS KL · 7 COUNTRIES · COUNTLESS PLAYLISTS ✈</span>',
            '    </div>',
            '  </div>',

            '  <!-- FLIGHT VIEW -->',
            '  <div class="fs-flight" id="fs-flight" style="display:none">',
            '    <div class="fs-window-frame">',
            '      <div class="fs-window-inner">',
            '        <div class="fs-sky" id="fs-sky"></div>',
            '        <div class="fs-clouds" id="fs-clouds"></div>',
            '        <div class="fs-wing"></div>',
            '        <div class="fs-stamp" id="fs-flag"></div>',
            '        <div class="fs-alt-strip">',
            '          <span>ALT 35,000ft</span>',
            '          <span id="fs-flight-code">——</span>',
            '          <span>MX → ——</span>',
            '        </div>',
            '      </div>',
            '    </div>',
            '    <div class="fs-flight-content">',
            '      <div class="fs-flight-header">',
            '        <div>',
            '          <div class="fs-city" id="fs-city">——</div>',
            '          <div class="fs-country-label" id="fs-country-label">——</div>',
            '        </div>',
            '        <button class="fs-back-btn" id="fs-back-btn">← DEPARTURES</button>',
            '      </div>',
            '      <div class="fs-passport-stamp">',
            '        <div class="fs-ps-date" id="fs-ps-date">——</div>',
            '        <div class="fs-ps-note" id="fs-ps-note">——</div>',
            '        <div class="fs-ps-mood" id="fs-ps-mood"></div>',
            '      </div>',
            '      <div class="fs-nav-dots" id="fs-nav-dots"></div>',
            '    </div>',
            '  </div>',
            '</div>'
        ].join('\n');
    }

    /* ---------- BOOT ---------- */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
