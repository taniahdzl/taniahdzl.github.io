/* ============================================
   TANIA'S PORTFOLIO — beads-poem.js
   Portal: Beads "TANIA" → Poema interactivo
   ============================================ */

(function () {

/* ---------- DATA ---------- */
var COLORS  = ['#1A1A1A', '#D14B35', '#2A6B3F', '#2B4C8C', '#C49A3C'];
var LETTERS = ['T', 'A', 'N', 'I', 'A'];

var STANZAS = [
  // T
  {
    lines: [
      { text: 'The best stories',                 cls: '' },
      { text: 'take root from a <em>seed</em>',   cls: '' },
      { text: 'or from a leap into the unknown.', cls: 'accent' },
    ],
    sub: 'data scientist · builder · ITAM'
  },

  // A
  {
    lines: [
      { text: 'Across Singapore, I arrived',            cls: '' },
      { text: 'armed with a backpack and the feeling',  cls: '' },
      { text: 'that the world <em>opens</em> when you seek it.', cls: '' },
    ],
    sub: '7 countries · NUS 2025 · still exploring'
  },

  // N
  {
    lines: [
      { text: 'Numbers alone are never enough —', cls: '' },
      { text: 'nurture what you <em>plant</em>,', cls: '' },
      { text: 'and stay to watch it grow.',       cls: 'accent' },
    ],
    sub: 'President · ITAM Garden · 2022→'
  },

  // I
  {
    lines: [
      { text: 'I move between data,',                   cls: '' },
      { text: 'inked code and soil on my hands,',       cls: '' },
      { text: 'with <em>music</em> always nearby.',     cls: '' },
    ],
    sub: 'SQL · Python · afrobeats · 80s rock'
  },

  // A — final
  {
    lines: [
      { text: 'At the end of it all,',                 cls: '' },
      { text: 'I build things that <em>matter</em>',   cls: '' },
      { text: '— and that is enough for me.',          cls: 'accent' },
    ],
    sub: 'available 2026 · let’s build something'
  },
];

  /* ---------- STATE ---------- */
  var revealed  = 0;
  var beadEls   = [];
  var poemEl, threadEl, hintEl, counterEl, restartBtn;

  /* ---------- INIT ---------- */
  function initPoem() {
    var beadsEl = document.getElementById('bp-beads');
    poemEl      = document.getElementById('bp-poem');
    threadEl    = document.getElementById('bp-thread');
    hintEl      = document.getElementById('bp-hint');
    counterEl   = document.getElementById('bp-counter');
    restartBtn  = document.getElementById('bp-restart');

    beadsEl.innerHTML = '';
    poemEl.innerHTML  = '';
    beadEls  = [];
    revealed = 0;

    threadEl.classList.remove('bp-thread--broken');
    threadEl.style.opacity = '';
    hintEl.classList.remove('bp-hint--hidden');
    restartBtn.classList.remove('bp-restart--show');
    updateCounter();

    LETTERS.forEach(function (letter, i) {
      var bead           = document.createElement('div');
      bead.className     = 'bp-bead';
      bead.style.background = COLORS[i];
      bead.textContent   = letter;
      bead.dataset.idx   = i;
      bead.addEventListener('click', function () { revealBead(i); });
      beadsEl.appendChild(bead);
      beadEls.push(bead);
    });
  }

  /* ---------- REVEAL ---------- */
  function revealBead(i) {
    if (i !== revealed) return; // must go in order

    var bead = beadEls[i];
    hintEl.classList.add('bp-hint--hidden');

    // Unravel animation
    bead.classList.add('bp-bead--unraveling');
    setTimeout(function () { bead.classList.add('bp-bead--gone'); }, 480);

    // Show stanza
    setTimeout(function () {
      appendStanza(STANZAS[i], i);
      revealed++;
      updateCounter();

      if (i === 1) { threadEl.style.opacity = '0.15'; }

      if (revealed === LETTERS.length) {
        setTimeout(function () {
          threadEl.classList.add('bp-thread--broken');
          restartBtn.classList.add('bp-restart--show');
        }, 400);
      }
    }, 300);
  }

  function appendStanza(stanza, idx) {
    if (idx > 0) {
      var div       = document.createElement('div');
      div.className = 'bp-divider';
      poemEl.appendChild(div);
    }

    stanza.lines.forEach(function (line, li) {
      var el       = document.createElement('div');
      el.className = 'bp-line' + (line.cls ? ' bp-line--' + line.cls : '');
      el.innerHTML = line.text;
      poemEl.appendChild(el);
      setTimeout(function () { el.classList.add('bp-line--visible'); }, li * 140);
    });

    if (stanza.sub) {
      var sub       = document.createElement('div');
      sub.className = 'bp-line bp-line--small';
      sub.textContent = stanza.sub;
      poemEl.appendChild(sub);
      setTimeout(function () { sub.classList.add('bp-line--visible'); }, stanza.lines.length * 140 + 80);
    }

    setTimeout(function () {
      if (poemEl.lastChild && poemEl.lastChild.scrollIntoView) {
        poemEl.lastChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 500);
  }

  function updateCounter() {
    if (!counterEl) return;
    counterEl.textContent = revealed === 0 ? '' : (revealed + ' / ' + LETTERS.length);
  }

  /* ---------- RESTART ---------- */
  function restart() {
    poemEl.style.opacity   = '0';
    poemEl.style.transition = 'opacity .4s';
    setTimeout(function () {
      poemEl.style.opacity   = '';
      poemEl.style.transition = '';
      initPoem();
    }, 400);
  }

  /* ---------- OVERLAY OPEN / CLOSE ---------- */
  function openOverlay() {
    document.getElementById('bp-overlay').classList.add('bp-overlay--open');
    document.body.style.overflow = 'hidden';
    initPoem();
  }

  function closeOverlay() {
    document.getElementById('bp-overlay').classList.remove('bp-overlay--open');
    document.body.style.overflow = '';
  }

  /* ---------- INIT ---------- */
  function init() {
    var overlay       = document.createElement('div');
    overlay.id        = 'bp-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'TANIA — poema interactivo');
    overlay.innerHTML = getHTML();
    document.body.appendChild(overlay);

    // Wire close
    document.getElementById('bp-close').addEventListener('click', closeOverlay);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeOverlay(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeOverlay(); });

    // Wire restart button
    document.getElementById('bp-restart').addEventListener('click', restart);

    // Wire carousel trigger
    document.querySelectorAll('.beads-obj').forEach(function (el) {
      el.style.cursor = 'pointer';
      el.setAttribute('title', 'Click para descubrir');
      el.addEventListener('click', openOverlay);
    });
  }

  /* ---------- HTML ---------- */
  function getHTML() {
    return [
      '<div class="bp-modal">',
      '  <button class="bp-close-btn" id="bp-close" aria-label="Cerrar">✕</button>',
      '  <div class="bp-hint" id="bp-hint">click en cada letra para descubrir</div>',
      '  <div class="bp-counter" id="bp-counter"></div>',

      '  <div class="bp-beads-wrap">',
      '    <div class="bp-thread" id="bp-thread"></div>',
      '    <div class="bp-beads" id="bp-beads"></div>',
      '  </div>',

      '  <div class="bp-poem" id="bp-poem"></div>',

      '  <button class="bp-restart" id="bp-restart">volver a tejer →</button>',
      '</div>',
    ].join('\n');
  }

  /* ---------- BOOT ---------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
