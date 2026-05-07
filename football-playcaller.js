/* ============================================
   TANIA'S PORTFOLIO — football-playcaller.js
   Portal: Football card → Play Caller
   ============================================ */

(function () {

  /* ---------- PALETTE ---------- */
  var PAL = {
    green:'#2A6B3F', greenL:'#5BAD72',
    red:'#D14B35', gold:'#C49A3C',
    blue:'#2B4C8C', ink:'#1A1A1A',
    bg:'#F2EDE6', cream:'#FAF7F2',
  };

  /* ---------- POSITIONS ---------- */
  var POSITIONS = [
    {key:'QB',  label:'QB', color:'#D14B35', desc:'quarterback'},
    {key:'C',   label:'C',  color:'#2B4C8C', desc:'centro'},
    {key:'WR1', label:'W1', color:'#2A6B3F', desc:'wide receiver 1'},
    {key:'WR2', label:'W2', color:'#5BAD72', desc:'wide receiver 2'},
    {key:'WR3', label:'W3', color:'#C49A3C', desc:'wide receiver 3'},
    {key:'RB',  label:'RB', color:'#8B4513', desc:'running back'},
    {key:'DEF', label:'D',  color:'#555555', desc:'defensa'},
  ];

  /* ---------- PRESET PLAYS ---------- */
  /* Field: 680×420. LOS is a HORIZONTAL line at y≈290 (bottom third).
     Offense attacks upward (lower y = deeper into opponent's field).
     x=340 is center of field. */
  var PRESETS = [
    { name: 'Shotgun spread', players: [
      {x:340, y:305, posIdx:0, routes:[{x:340,y:260},{x:370,y:210}]},   // QB
      {x:340, y:285, posIdx:1, routes:[]},                               // C
      {x:200, y:285, posIdx:2, routes:[{x:200,y:220},{x:260,y:170}]},   // WR1 out-route
      {x:480, y:285, posIdx:3, routes:[{x:480,y:220},{x:420,y:170}]},   // WR2 out-route
      {x:290, y:285, posIdx:4, routes:[{x:280,y:230},{x:310,y:180}]},   // WR3 drag
    ]},
    { name: 'Post & go', players: [
      {x:340, y:305, posIdx:0, routes:[{x:340,y:265},{x:355,y:225}]},   // QB
      {x:340, y:285, posIdx:1, routes:[]},                               // C
      {x:180, y:285, posIdx:2, routes:[{x:180,y:230},{x:240,y:185},{x:290,y:155}]}, // WR1 post
      {x:500, y:285, posIdx:3, routes:[{x:500,y:225},{x:450,y:175}]},   // WR2 out
      {x:420, y:285, posIdx:4, routes:[{x:415,y:240},{x:390,y:200}]},   // WR3 curl
    ]},
    { name: 'Drag screen', players: [
      {x:340, y:305, posIdx:0, routes:[{x:340,y:270},{x:310,y:245}]},   // QB
      {x:340, y:285, posIdx:1, routes:[]},                               // C
      {x:210, y:285, posIdx:2, routes:[{x:225,y:285},{x:290,y:258}]},   // WR1 drag
      {x:480, y:285, posIdx:3, routes:[{x:480,y:225},{x:515,y:185}]},   // WR2 go
      {x:285, y:285, posIdx:4, routes:[{x:285,y:245},{x:310,y:205},{x:375,y:195}]}, // WR3 cross
    ]},
  ];

  /* ---------- STATE ---------- */
  var canvas, ctx, tooltipEl;
  var CW = 680, CH = 420;
  var mode = 'place';
  var selectedPos = 0;
  var players = [];
  var history = [];
  var savedPlays = [];
  var dragging = null, dragOff = {x:0, y:0};
  var drawingRoute = null;
  var mousePos = {x:0, y:0};
  var rafPending = false;

  /* ---------- FIELD GEOMETRY ---------- */
  /* Landscape field, LOS is HORIZONTAL */
  var FIELD = { x:30, y:20, w:620, h:380 };
  var LOS_Y; // computed after FIELD set

  function computeLOS() {
    LOS_Y = FIELD.y + FIELD.h * 0.68; // line of scrimmage ~68% down
  }

  /* ---------- DRAW ---------- */
  function drawField() {
    // Grass
    ctx.fillStyle = '#4a8a28';
    ctx.fillRect(FIELD.x, FIELD.y, FIELD.w, FIELD.h);

    // Alternating grass stripes (horizontal — parallel to LOS)
    var stripeH = FIELD.h / 10;
    for (var i = 0; i < 10; i++) {
      if (i % 2 === 0) {
        ctx.fillStyle = 'rgba(0,0,0,0.04)';
        ctx.fillRect(FIELD.x, FIELD.y + i * stripeH, FIELD.w, stripeH);
      }
    }

    // Yard lines (horizontal)
    for (var j = 0; j <= 10; j++) {
      var ly = FIELD.y + j * (FIELD.h / 10);
      ctx.strokeStyle = j === 0 || j === 10 ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.18)';
      ctx.lineWidth   = j === 0 || j === 10 ? 2 : 0.5;
      ctx.beginPath(); ctx.moveTo(FIELD.x, ly); ctx.lineTo(FIELD.x + FIELD.w, ly); ctx.stroke();
      // hash marks along each yard line
      if (j > 0 && j < 10) {
        for (var hx = FIELD.x + 20; hx < FIELD.x + FIELD.w; hx += 28) {
          ctx.strokeStyle = 'rgba(255,255,255,0.1)';
          ctx.lineWidth = 0.5;
          ctx.beginPath(); ctx.moveTo(hx, ly - 4); ctx.lineTo(hx, ly + 4); ctx.stroke();
        }
      }
    }

    // End zones (top and bottom)
    ctx.fillStyle = 'rgba(42,107,63,0.55)';
    ctx.fillRect(FIELD.x, FIELD.y, FIELD.w, 28);
    ctx.fillRect(FIELD.x, FIELD.y + FIELD.h - 28, FIELD.w, 28);

    // End zone labels
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('END ZONE', FIELD.x + FIELD.w / 2, FIELD.y + 14);
    ctx.fillText('END ZONE', FIELD.x + FIELD.w / 2, FIELD.y + FIELD.h - 14);

    // Line of scrimmage (HORIZONTAL)
    ctx.strokeStyle = 'rgba(255,255,100,0.75)';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([7, 5]);
    ctx.beginPath();
    ctx.moveTo(FIELD.x + 4, LOS_Y);
    ctx.lineTo(FIELD.x + FIELD.w - 4, LOS_Y);
    ctx.stroke();
    ctx.setLineDash([]);

    // LOS label
    ctx.fillStyle = 'rgba(255,255,100,0.6)';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('LOS', FIELD.x + 6, LOS_Y - 8);

    // "attack direction" arrow at right side
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = '9px monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText('▲ ataque', FIELD.x + FIELD.w - 6, FIELD.y + 32);

    // Field border
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 2;
    ctx.strokeRect(FIELD.x, FIELD.y, FIELD.w, FIELD.h);
  }

  function drawRoutes() {
    players.forEach(function (p, pi) {
      if (!p.routes || p.routes.length < 1) return;
      var pos = POSITIONS[p.posIdx];
      ctx.save();
      ctx.strokeStyle = pos.color;
      ctx.lineWidth   = 2.5;
      ctx.setLineDash([5, 3]);
      ctx.lineCap     = 'round';
      ctx.lineJoin    = 'round';
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      p.routes.forEach(function (pt) { ctx.lineTo(pt.x, pt.y); });
      ctx.stroke();

      // Arrowhead
      var pts = [{x:p.x,y:p.y}].concat(p.routes);
      if (pts.length >= 2) {
        var last = pts[pts.length - 1];
        var prev = pts[pts.length - 2];
        var angle = Math.atan2(last.y - prev.y, last.x - prev.x);
        ctx.setLineDash([]);
        ctx.fillStyle = pos.color;
        ctx.save();
        ctx.translate(last.x, last.y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(-10, -5); ctx.lineTo(-10, 5);
        ctx.closePath(); ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    });

    // Live preview while drawing
    if (drawingRoute !== null) {
      var p = players[drawingRoute.idx];
      var pos = POSITIONS[p.posIdx];
      ctx.save();
      ctx.strokeStyle = pos.color;
      ctx.lineWidth   = 1.8;
      ctx.globalAlpha = 0.45;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      p.routes.forEach(function (pt) { ctx.lineTo(pt.x, pt.y); });
      ctx.lineTo(mousePos.x, mousePos.y);
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawPlayers() {
    players.forEach(function (p, i) {
      var pos = POSITIONS[p.posIdx];
      var r   = 14;
      ctx.save();
      // shadow
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      ctx.beginPath(); ctx.ellipse(p.x + 2, p.y + 3, r * .8, r * .35, 0, 0, Math.PI * 2); ctx.fill();
      // body
      ctx.fillStyle = pos.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
      // rim
      ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.stroke();
      // label
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(pos.label, p.x, p.y);
      // route-mode selection ring
      if (mode === 'route' && drawingRoute && drawingRoute.idx === i) {
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5;
        ctx.setLineDash([3, 2]);
        ctx.beginPath(); ctx.arc(p.x, p.y, r + 5, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.restore();
    });
  }

  function drawHint() {
    var hints = {
      place:  'click en el campo para colocar jugadora',
      route:  'click en jugadora → dibuja ruta → doble click para terminar',
      move:   'arrastra una jugadora para reposicionarla',
    };
    ctx.fillStyle = 'rgba(255,255,255,0.38)';
    ctx.font = '8px monospace';
    ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
    ctx.fillText(hints[mode], FIELD.x + FIELD.w - 6, FIELD.y + FIELD.h - 6);
  }

  function render() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(function () {
      rafPending = false;
      ctx.clearRect(0, 0, CW, CH);
      drawField();
      drawRoutes();
      drawPlayers();
      drawHint();
    });
  }

  /* ---------- INTERACTIONS ---------- */
  function getPos(e) {
    var r   = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * (CW / r.width),
      y: (e.clientY - r.top)  * (CH / r.height),
    };
  }
  function inField(x, y) {
    return x > FIELD.x && x < FIELD.x + FIELD.w && y > FIELD.y && y < FIELD.y + FIELD.h;
  }
  function nearPlayer(x, y, radius) {
    radius = radius || 20;
    var best = null, bd = radius;
    players.forEach(function (p, i) {
      var d = Math.hypot(x - p.x, y - p.y);
      if (d < bd) { bd = d; best = i; }
    });
    return best;
  }

  function saveHistory() {
    history.push(JSON.stringify(players));
    if (history.length > 40) history.shift();
  }

  function showTip(msg) {
    tooltipEl.textContent = msg;
    tooltipEl.classList.add('fp-tip--show');
    clearTimeout(tooltipEl._t);
    tooltipEl._t = setTimeout(function () { tooltipEl.classList.remove('fp-tip--show'); }, 2000);
  }

  /* ---------- SAVE / LOAD ---------- */
  function savePlay() {
    var nameEl = document.getElementById('fp-play-name');
    var name   = nameEl.value.trim() || ('jugada ' + (savedPlays.length + 1));
    savedPlays.push({ name: name, players: JSON.parse(JSON.stringify(players)) });
    nameEl.value = '';
    renderSaved();
    showTip('guardada: ' + name);
  }

  function loadPlay(data) {
    saveHistory();
    players = JSON.parse(JSON.stringify(data.players));
    render();
    showTip('cargada: ' + data.name);
  }

  function renderSaved() {
    var wrap   = document.getElementById('fp-saved-wrap');
    var label  = document.getElementById('fp-saved-label');
    while (wrap.firstChild) wrap.removeChild(wrap.firstChild);

    var allPlays = [];
    PRESETS.forEach(function (p) { allPlays.push({ play:p, preset:true }); });
    savedPlays.forEach(function (p)  { allPlays.push({ play:p, preset:false }); });

    if (allPlays.length === 0) {
      wrap.appendChild(label);
      return;
    }

    allPlays.forEach(function (item) {
      var btn = document.createElement('span');
      btn.className = 'fp-saved-pill';
      if (item.preset) btn.classList.add('fp-saved-pill--preset');
      btn.textContent = item.play.name;
      btn.addEventListener('click', function () { loadPlay(item.play); });
      wrap.appendChild(btn);
    });
  }

  /* ---------- MODE SWITCH ---------- */
  function setMode(m) {
    mode = m;
    drawingRoute = null;
    ['place','route','move'].forEach(function (id) {
      var el = document.getElementById('fp-mode-' + id);
      if (el) el.classList.toggle('fp-mode-btn--active', id === m);
    });
    canvas.style.cursor = m === 'move' ? 'grab' : 'crosshair';
    render();
  }

  /* ---------- INIT ---------- */
  function init() {
    var overlay = document.createElement('div');
    overlay.id = 'fp-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Play Caller — Flag Football');
    overlay.innerHTML = getHTML();
    document.body.appendChild(overlay);

    canvas    = document.getElementById('fp-canvas');
    ctx       = canvas.getContext('2d');
    tooltipEl = document.getElementById('fp-tooltip');

    // ── DPR FIX ──
    var dpr = window.devicePixelRatio || 1;
    canvas.width  = CW * dpr;
    canvas.height = CH * dpr;
    canvas.style.width  = CW + 'px';
    canvas.style.height = CH + 'px';
    ctx.scale(dpr, dpr);
    // ─────────────

    computeLOS();

    // Close
    document.getElementById('fp-close').addEventListener('click', closeOverlay);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeOverlay(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeOverlay(); });

    // Mode buttons
    document.getElementById('fp-mode-place').addEventListener('click', function () { setMode('place'); });
    document.getElementById('fp-mode-route').addEventListener('click', function () { setMode('route'); });
    document.getElementById('fp-mode-move').addEventListener('click',  function () { setMode('move');  });

    // Position selector
    var posWrap = document.getElementById('fp-pos-wrap');
    POSITIONS.forEach(function (p, i) {
      var btn = document.createElement('button');
      btn.className   = 'fp-pos-btn' + (i === 0 ? ' fp-pos-btn--sel' : '');
      btn.style.background   = p.color;
      btn.style.borderColor  = p.color;
      btn.title       = p.desc;
      btn.textContent = p.label;
      btn.addEventListener('click', function () {
        selectedPos = i;
        document.querySelectorAll('.fp-pos-btn').forEach(function (b, j) {
          b.classList.toggle('fp-pos-btn--sel', j === i);
        });
      });
      posWrap.appendChild(btn);
    });

    // Action buttons
    document.getElementById('fp-undo').addEventListener('click',  function () {
      if (!history.length) return;
      players = JSON.parse(history.pop());
      drawingRoute = null; render();
    });
    document.getElementById('fp-clear').addEventListener('click', function () {
      saveHistory(); players = []; drawingRoute = null; render();
    });
    document.getElementById('fp-save').addEventListener('click',  savePlay);

    // Canvas events
    canvas.addEventListener('mousemove', function (e) {
      var pos = getPos(e);
      mousePos = pos;
      if (mode === 'move' && dragging !== null) {
        players[dragging].x = pos.x - dragOff.x;
        players[dragging].y = pos.y - dragOff.y;
      }
      render();
    });

    canvas.addEventListener('mousedown', function (e) {
      if (mode === 'move') {
        var pos = getPos(e);
        var idx = nearPlayer(pos.x, pos.y);
        if (idx !== null) {
          dragging = idx;
          dragOff  = { x: pos.x - players[idx].x, y: pos.y - players[idx].y };
          canvas.style.cursor = 'grabbing';
        }
      }
    });
    canvas.addEventListener('mouseup', function () {
      if (mode === 'move') { dragging = null; canvas.style.cursor = 'grab'; }
    });

    canvas.addEventListener('click', function (e) {
      var pos = getPos(e);
      if (!inField(pos.x, pos.y)) return;

      if (mode === 'place') {
        saveHistory();
        players.push({ x: pos.x, y: pos.y, posIdx: selectedPos, routes: [] });
        showTip(POSITIONS[selectedPos].desc + ' colocada');
        render();
        return;
      }

      if (mode === 'route') {
        var idx = nearPlayer(pos.x, pos.y);
        if (drawingRoute === null) {
          if (idx !== null) {
            drawingRoute = { idx: idx };
            showTip('dibuja la ruta — doble click para terminar');
          }
        } else {
          saveHistory();
          players[drawingRoute.idx].routes.push({ x: pos.x, y: pos.y });
        }
        render();
      }
    });

    canvas.addEventListener('dblclick', function () {
      if (mode === 'route' && drawingRoute !== null) {
        drawingRoute = null;
        showTip('ruta guardada');
        render();
      }
    });

    // Touch support
    canvas.addEventListener('touchstart', function (e) { e.preventDefault(); }, { passive: false });
    canvas.addEventListener('touchend',   function (e) {
      e.preventDefault();
      var t   = e.changedTouches[0];
      var r   = canvas.getBoundingClientRect();
      var pos = {
        x: (t.clientX - r.left) * (CW / r.width),
        y: (t.clientY - r.top)  * (CH / r.height),
      };
      if (!inField(pos.x, pos.y)) return;
      if (mode === 'place') {
        saveHistory();
        players.push({ x: pos.x, y: pos.y, posIdx: selectedPos, routes: [] });
        showTip(POSITIONS[selectedPos].desc + ' colocada');
        render();
      }
    }, { passive: false });

    renderSaved();
    render();

    // Wire carousel trigger
    document.querySelectorAll('.football-obj').forEach(function (el) {
      el.style.cursor = 'pointer';
      el.setAttribute('title', 'Click para abrir el Play Caller');
      el.addEventListener('click', openOverlay);
    });
  }

  function openOverlay() {
    document.getElementById('fp-overlay').classList.add('fp-overlay--open');
    document.body.style.overflow = 'hidden';
    players = []; history = []; drawingRoute = null; mode = 'place';
    setMode('place');
    render();
  }

  function closeOverlay() {
    document.getElementById('fp-overlay').classList.remove('fp-overlay--open');
    document.body.style.overflow = '';
  }

  /* ---------- HTML TEMPLATE ---------- */
  function getHTML() {
    return [
      '<div class="fp-modal">',
      '  <button class="fp-close-btn" id="fp-close" aria-label="Cerrar">✕</button>',

      '  <div class="fp-modal-header">',
      '    <span class="fp-modal-logo">Play Caller — Flag Football</span>',
      '    <div class="fp-mode-btns">',
      '      <button class="fp-mode-btn fp-mode-btn--active" id="fp-mode-place">place</button>',
      '      <button class="fp-mode-btn" id="fp-mode-route">draw route</button>',
      '      <button class="fp-mode-btn" id="fp-mode-move">move</button>',
      '    </div>',
      '  </div>',

      '  <div class="fp-field-wrap">',
      '    <canvas id="fp-canvas"></canvas>',
      '    <div class="fp-tooltip" id="fp-tooltip"></div>',
      '  </div>',

      '  <div class="fp-controls">',
      '    <span class="fp-ctrl-label">jugadora</span>',
      '    <div class="fp-pos-wrap" id="fp-pos-wrap"></div>',
      '    <div class="fp-ctrl-actions">',
      '      <button class="fp-action-btn" id="fp-undo">undo</button>',
      '      <button class="fp-action-btn fp-action-btn--danger" id="fp-clear">limpiar</button>',
      '      <button class="fp-action-btn fp-action-btn--save" id="fp-save">guardar jugada</button>',
      '    </div>',
      '  </div>',

      '  <div class="fp-name-row">',
      '    <span class="fp-ctrl-label">nombre</span>',
      '    <input id="fp-play-name" class="fp-name-input" placeholder="ej. post corner, drag screen..." maxlength="40" />',
      '  </div>',

      '  <div class="fp-saved-row">',
      '    <span class="fp-saved-label" id="fp-saved-label">jugadas guardadas</span>',
      '    <div class="fp-saved-wrap" id="fp-saved-wrap"></div>',
      '  </div>',
      '</div>',
    ].join('\n');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
