/* ============================================
   TANIA'S PORTFOLIO — listening-room.js
   Portal: Vinyl card → The Listening Room
   ============================================ */

(function () {

  /* ---------- ALBUMS ---------- */
  var ALBUMS = [
    {
      city: 'Ciudad de México', era: '2022 — presente', short: 'CDMX',
      color: '#C49A3C',
      note: 'La ciudad que me hizo. Mercados, tráfico, el ruido de fondo de crecer. Esta playlist suena a caos bonito.',
      genres: ['latin indie', 'afrobeats', '80s rock', 'boleros'],
      track: 'CDMX forever',
      playlistId: '37i9dQZF1DX0pH2SQMRXnC',
      led: [196, 154, 60],
    },
    {
      city: 'Singapur', era: 'Aug — Dec 2025', short: 'SIN',
      color: '#D14B35',
      note: 'Cinco meses que lo cambiaron todo. Hawker centres a medianoche, el MRT, lluvia tropical todos los días a las 4pm.',
      genres: ['k-indie', 'j-pop', 'hyperpop', 'ambient'],
      track: 'Singapore nights',
      playlistId: '2ccjvVUl20k9qmaFgMbqv7',
      led: [209, 75, 53],
    },
    {
      city: 'Kyoto', era: 'Nov 2025', short: 'KYO',
      color: '#2B4C8C',
      note: 'Bamboo forest at 6am. Silencio real. Esta playlist no tiene letras — solo instrumentales que caben en un templo.',
      genres: ['japanese jazz', 'ambient', 'neo-classical'],
      track: 'Kyoto 6am',
      playlistId: '6wxD9cupvIoOBhj701Ih8n',
      led: [43, 76, 140],
    },
    {
      city: 'Bangkok', era: 'Oct 2025', short: 'BKK',
      color: '#D14B35',
      note: 'Caos perfectamente organizado. Tuk-tuks, templos y el mejor pad thai del mundo. La playlist pica igual.',
      genres: ['thai pop', 'cumbia', 'dancehall', 'afrobeats'],
      track: 'Bangkok heat',
      playlistId: '37i9dQZF1DX5q67ZpuRkOT',
      led: [209, 75, 53],
    },
    {
      city: 'Seoul', era: 'Nov 2025', short: 'ICN',
      color: '#5BAD72',
      note: 'Palacios y rascacielos. K-indie en el metro a medianoche. La ciudad que nunca duerme, y yo tampoco.',
      genres: ['k-indie', 'lo-fi hip hop', 'k-r&b'],
      track: 'Seoul midnight',
      playlistId: '37i9dQZF1DX9tPFAjMgmA8',
      led: [91, 173, 114],
    },
    {
      city: 'Bali', era: 'Sep 2025', short: 'DPS',
      color: '#2A6B3F',
      note: 'Arrozales y selva. El único lugar donde estar quieta se siente productivo. Esta playlist dura horas.',
      genres: ['world music', 'reggae', 'tropical', 'lo-fi'],
      track: 'Bali slow',
      playlistId: '37i9dQZF1DX4PP3DA4J0N8',
      led: [42, 107, 63],
    },
  ];

  /* ---------- STATE ---------- */
  var current  = null;
  var playing  = false;
  var ambRaf   = null;
  var ambT     = 0;
  var ledColor = null;
  var ambCanvas, ambCtx;

  /* ---------- AMBIENCE ---------- */
  function sizeAmb() {
    var player = document.getElementById('lr-player');
    if (!player || !ambCanvas) return;
    ambCanvas.width  = player.offsetWidth  || 500;
    ambCanvas.height = player.offsetHeight || 520;
  }

  function drawAmb() {
    ambCtx.clearRect(0, 0, ambCanvas.width, ambCanvas.height);
    if (ledColor) {
      ambT += 0.012;
      var r = ledColor[0], g = ledColor[1], b = ledColor[2];
      var blobs = [
        { fx:.85, fy:.15, fr:.5, ph:0   },
        { fx:.15, fy:.75, fr:.4, ph:2.1 },
        { fx:.5,  fy:.5,  fr:.3, ph:4.2 },
      ];
      blobs.forEach(function (bl) {
        var bx = bl.fx * ambCanvas.width  + Math.sin(ambT * .4 + bl.ph) * 25;
        var by = bl.fy * ambCanvas.height + Math.cos(ambT * .3 + bl.ph) * 18;
        var br = bl.fr * Math.max(ambCanvas.width, ambCanvas.height);
        var gr = ambCtx.createRadialGradient(bx, by, 0, bx, by, br);
        gr.addColorStop(0,   'rgba('+r+','+g+','+b+',0.18)');
        gr.addColorStop(0.5, 'rgba('+r+','+g+','+b+',0.06)');
        gr.addColorStop(1,   'rgba('+r+','+g+','+b+',0)');
        ambCtx.fillStyle = gr;
        ambCtx.fillRect(0, 0, ambCanvas.width, ambCanvas.height);
      });
    }
    ambRaf = requestAnimationFrame(drawAmb);
  }

  /* ---------- VINYL ---------- */
  function drawVinyl(color) {
    var c   = document.getElementById('lr-disc');
    if (!c) return;
    var ctx = c.getContext('2d');
    var S   = 150, cx = S / 2, cy = S / 2;
    ctx.clearRect(0, 0, S, S);
    ctx.fillStyle = '#0a0608';
    ctx.beginPath(); ctx.arc(cx, cy, cx, 0, Math.PI * 2); ctx.fill();
    for (var r = 18; r < 70; r += 2.8) {
      ctx.strokeStyle = 'rgba(255,255,255,' + (r % 8 < 1 ? 0.06 : 0.018) + ')';
      ctx.lineWidth   = r % 11 < 1 ? 0.8 : 0.4;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    }
    var gr = ctx.createRadialGradient(cx, cy, 16, cx, cy, 72);
    gr.addColorStop(0, color + '33'); gr.addColorStop(1, 'transparent');
    ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(cx, cy, 72, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(cx, cy, 50, Math.PI * .75, Math.PI * 1.25); ctx.stroke();
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(cx, cy, 16, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill();
  }

  /* ---------- BUILD SHELF ---------- */
  function buildShelf() {
    var wrap = document.getElementById('lr-records');
    if (!wrap) return;
    wrap.innerHTML = '';
    ALBUMS.forEach(function (a, i) {
      var el = document.createElement('div');
      el.className = 'lr-record';
      el.innerHTML =
        '<div class="lr-disc" style="background:' + a.color + '"></div>' +
        '<div class="lr-rec-info">' +
          '<div class="lr-rec-city">' + a.city + '</div>' +
          '<div class="lr-rec-year">' + a.era  + '</div>' +
          '<div class="lr-rec-mood">' + a.genres.slice(0, 2).join(' · ') + '</div>' +
        '</div>';
      el.addEventListener('click', function () { selectAlbum(i, el); });
      wrap.appendChild(el);
    });
  }

  /* ---------- SELECT ---------- */
  function selectAlbum(i, el) {
    current = ALBUMS[i];

    document.querySelectorAll('.lr-record').forEach(function (r) { r.classList.remove('active'); });
    el.classList.add('active');

    // LED — update color and resize canvas
    ledColor = current.led;
    sizeAmb();

    // text
    document.getElementById('lr-city').textContent         = current.city;
    document.getElementById('lr-era').textContent          = current.era;
    document.getElementById('lr-note').textContent         = current.note;
    document.getElementById('lr-note').style.borderColor   = current.color;
    document.getElementById('lr-track').textContent        = current.track;
    document.getElementById('lr-bar').style.background     = current.color;

    // genres
    var gw = document.getElementById('lr-genres'); gw.innerHTML = '';
    current.genres.forEach(function (g) {
      var s = document.createElement('span');
      s.className           = 'lr-genre';
      s.style.borderColor   = current.color + '55';
      s.style.color         = current.color;
      s.style.background    = current.color + '11';
      s.textContent         = g;
      gw.appendChild(s);
    });

    // play button
    var pb = document.getElementById('lr-play');
    pb.style.borderColor = current.color;
    pb.style.color       = current.color;

    // vinyl
    drawVinyl(current.color);

    // needle
    document.getElementById('lr-needle').classList.add('lr-needle--on');

    // spotify embed
    var embedWrap = document.getElementById('lr-embed');
    embedWrap.innerHTML =
      '<iframe src="https://open.spotify.com/embed/playlist/' + current.playlistId +
      '?utm_source=generator&theme=0" width="100%" height="152" frameBorder="0"' +
      ' allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"' +
      ' loading="lazy" style="border-radius:10px;display:block"></iframe>';

    document.getElementById('lr-open-sp').href =
      'https://open.spotify.com/playlist/' + current.playlistId;

    setPlaying(true);
  }

  /* ---------- PLAY / PAUSE ---------- */
  function setPlaying(val) {
    playing = val;
    var disc = document.getElementById('lr-disc');
    var bar  = document.getElementById('lr-bar');
    var btn  = document.getElementById('lr-play');
    disc.classList.toggle('lr-disc--playing', playing);
    bar.classList.toggle('lr-bar--playing',   playing);
    btn.textContent = playing ? '⏸' : '▶';
  }

  /* ---------- OVERLAY OPEN / CLOSE ---------- */
  function openOverlay() {
    document.getElementById('lr-overlay').classList.add('lr-overlay--open');
    document.body.style.overflow = 'hidden';
    current  = null;
    playing  = false;
    ledColor = null;
    ambT     = 0;

    buildShelf();
    sizeAmb();
    if (!ambRaf) drawAmb();

    // auto-select first
    setTimeout(function () {
      var first = document.querySelector('.lr-record');
      if (first) first.click();
    }, 150);
  }

  function closeOverlay() {
    document.getElementById('lr-overlay').classList.remove('lr-overlay--open');
    document.body.style.overflow = '';
    if (ambRaf) { cancelAnimationFrame(ambRaf); ambRaf = null; }
  }

  /* ---------- INIT ---------- */
  function init() {
    var overlay = document.createElement('div');
    overlay.id  = 'lr-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'The Listening Room');
    overlay.innerHTML = getHTML();
    document.body.appendChild(overlay);

    ambCanvas = document.getElementById('lr-amb');
    ambCtx    = ambCanvas.getContext('2d');

    document.getElementById('lr-close').addEventListener('click', closeOverlay);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeOverlay(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeOverlay(); });

    document.getElementById('lr-play').addEventListener('click', function () {
      if (!current) return;
      setPlaying(!playing);
    });

    // Wire carousel trigger
    document.querySelectorAll('.vinyl-obj').forEach(function (el) {
      el.style.cursor = 'pointer';
      el.setAttribute('title', 'Click para abrir The Listening Room');
      el.addEventListener('click', openOverlay);
    });
  }

  /* ---------- HTML ---------- */
  function getHTML() {
    return [
      '<div class="lr-modal">',
      '  <div class="lr-room">',

      '    <div class="lr-shelf">',
      '      <div class="lr-shelf-top">',
      '        <div class="lr-shelf-logo">Listening Room</div>',
      '        <div class="lr-shelf-sub">ciudades · épocas · moods</div>',
      '      </div>',
      '      <div class="lr-records" id="lr-records"></div>',
      '    </div>',

      '    <div class="lr-player" id="lr-player">',
      '      <canvas class="lr-ambience" id="lr-amb"></canvas>',
      '      <button class="lr-close-btn" id="lr-close" aria-label="Cerrar">✕</button>',
      '      <div class="lr-pcontent">',

      '        <div class="lr-left">',
      '          <div class="lr-vinyl-wrap">',
      '            <canvas id="lr-disc" class="lr-vinyl-disc" width="150" height="150"></canvas>',
      '            <div class="lr-needle" id="lr-needle"></div>',
      '          </div>',
      '          <div class="lr-info">',
      '            <div class="lr-city" id="lr-city">—</div>',
      '            <div class="lr-era"  id="lr-era">selecciona un disco</div>',
      '            <div class="lr-note" id="lr-note"></div>',
      '            <div class="lr-genres" id="lr-genres"></div>',
      '          </div>',
      '        </div>',

      '        <div class="lr-right">',
      '          <div class="lr-spotify-label">spotify</div>',
      '          <div class="lr-spotify-wrap">',
      '            <div id="lr-embed"></div>',
      '            <a class="lr-open-sp" id="lr-open-sp" href="#" target="_blank" rel="noopener">abrir en spotify ↗</a>',
      '            <div class="lr-sp-hint">necesitas estar loggeada en Spotify en este browser para reproducir</div>',
      '          </div>',
      '        </div>',

      '      </div>',
      '      <div class="lr-controls">',
      '        <button class="lr-play-btn" id="lr-play">▶</button>',
      '        <div class="lr-now">',
      '          <div class="lr-now-label">sonando ahora</div>',
      '          <div class="lr-now-track" id="lr-track">← elige una ciudad</div>',
      '          <div class="lr-progress"><div class="lr-bar" id="lr-bar"></div></div>',
      '        </div>',
      '      </div>',
      '    </div>',

      '  </div>',
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
