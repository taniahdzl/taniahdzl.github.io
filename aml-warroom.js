/* ============================================
   TANIA'S PORTFOLIO — aml-warroom.js
   Portal: AML card → The War Room
   ============================================ */

(function () {

  /* ---------- DATA ---------- */
  var TRANSACTIONS = [
    {id:'TX-001', from:'Persona A',     to:'Empresa XYZ',  amt:'$12,000', type:'depósito',  flag:'review'},
    {id:'TX-002', from:'Empresa XYZ',   to:'Shell Panamá', amt:'$89,000', type:'wire intl', flag:'alert'},
    {id:'TX-003', from:'Cuenta MX',     to:'Cuenta MX',    amt:'$500',    type:'interno',   flag:'normal'},
    {id:'TX-004', from:'Shell Panamá',  to:'Cuenta Dubai', amt:'$87,500', type:'wire intl', flag:'alert'},
    {id:'TX-005', from:'Cuenta Dubai',  to:'Crypto addr.', amt:'$85,000', type:'crypto',    flag:'alert'},
  ];

  var SCORES = [
    {name:'Shell Panamá', val:96, col:'#f85149'},
    {name:'Cuenta Dubai', val:93, col:'#f85149'},
    {name:'Crypto addr.', val:90, col:'#f85149'},
    {name:'Empresa XYZ',  val:61, col:'#d29922'},
    {name:'Persona A',    val:38, col:'#d29922'},
    {name:'Cuenta MX',    val:12, col:'#3fb950'},
  ];

  var ALERTS = [
    {time:'14:32:01', msg:'TX-005 → conversión crypto >$80k',          hot:true},
    {time:'14:31:44', msg:'flujo: XYZ→Panamá→Dubai en 48h',            hot:true},
    {time:'14:30:12', msg:'TX-004: monto casi idéntico a TX-002',       hot:true},
    {time:'14:28:55', msg:'TX-002: wire internacional >$50k',           hot:false},
    {time:'14:22:10', msg:'Empresa XYZ: registrada hace 3 meses',       hot:false},
  ];

  var STEPS = [
    {
      title: '¿Qué está pasando aquí?',
      desc:  'Mira cómo se mueve el dinero. ¿Cuál describe mejor lo que ves?',
      choices: [
        {text:'El dinero se divide en muchos pagos pequeños para no llamar la atención', correct:false},
        {text:'El dinero salta de cuenta en cuenta para esconder de dónde viene',         correct:true},
        {text:'El dinero se mezcla con ventas reales de un negocio legítimo',             correct:false},
      ],
    },
    {
      title: '¿Cuál es la señal más sospechosa?',
      desc:  'Observa los montos y los tiempos. ¿Qué te parece más raro?',
      choices: [
        {text:'Que la empresa haga muchas transacciones seguidas',                               correct:false},
        {text:'Que una persona desconocida inicie el flujo con $12,000',                         correct:false},
        {text:'Que el mismo monto ($89k→$87.5k→$85k) viaje por 3 países en 2 días',             correct:true},
      ],
    },
    {
      title: '¿Qué harías ahora?',
      desc:  'Eres analista. El caso está frente a ti. ¿Cuál es tu recomendación?',
      choices: [
        {text:'Esperar unos días más y seguir monitoreando — falta evidencia',            correct:false},
        {text:'Reportar la actividad sospechosa y congelar las cuentas involucradas',     correct:true},
        {text:'Cerrar solo la última cuenta (crypto) y avisar al dueño',                  correct:false},
      ],
    },
  ];

  /* ---------- STATE ---------- */
  var timerInterval = null;
  var timerSecs     = 0;
  var currentStep   = 0;
  var correctCount  = 0;
  var rafPending    = false;

  /* ---------- HELPERS ---------- */
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  /* ---------- DRAW: VOLUME GRAPH ---------- */
  function drawGraph() {
    var c   = document.getElementById('wr-graph-canvas');
    if (!c) return;
    var ctx = c.getContext('2d');
    c.width = c.offsetWidth || 500;
    var W = c.width, H = 72;
    var d = [10,14,12,18,15,22,13,11,28,32,18,14,11,17,22,20,15,19,27,52,58,44,34,26,18,14,12,17,15,11];
    var mx = Math.max.apply(null, d), bw = W / d.length;
    ctx.clearRect(0, 0, W, H);
    d.forEach(function (v, i) {
      var h = (v / mx) * (H - 8), sus = i >= 18 && i <= 22;
      ctx.fillStyle = sus ? 'rgba(248,81,73,0.75)' : 'rgba(63,185,80,0.45)';
      ctx.fillRect(i * bw + 1, H - h, bw - 2, h);
    });
    ctx.fillStyle = '#f85149';
    ctx.font = '7px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('spike sospechoso', 19.5 * bw, 10);
    ctx.beginPath();
    ctx.moveTo(19.5 * bw, 13);
    ctx.lineTo(19.5 * bw, H - (58 / mx) * (H - 8) + 2);
    ctx.strokeStyle = 'rgba(248,81,73,0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  /* ---------- DRAW: ENTITY MAP ---------- */
  function drawMap() {
    var c   = document.getElementById('wr-map-canvas');
    if (!c) return;
    var ctx = c.getContext('2d');
    c.width = c.offsetWidth || 240;
    var W = c.width, H = 110;
    var nodes = [
      {x:.08, y:.5, label:'Persona A',    col:'#d29922'},
      {x:.28, y:.5, label:'Empresa XYZ',  col:'#d29922'},
      {x:.50, y:.5, label:'Shell Panamá', col:'#f85149'},
      {x:.72, y:.5, label:'Dubai',         col:'#f85149'},
      {x:.93, y:.5, label:'Crypto',        col:'#f85149'},
    ];
    var amts = ['$12k','$89k','$87.5k','$85k'];
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < nodes.length - 1; i++) {
      var a = nodes[i], b = nodes[i+1], sus = i >= 1;
      ctx.strokeStyle = sus ? 'rgba(248,81,73,0.7)' : 'rgba(210,153,34,0.6)';
      ctx.lineWidth   = sus ? 2 : 1.5;
      ctx.setLineDash(sus ? [4,3] : []);
      ctx.beginPath(); ctx.moveTo(a.x*W, a.y*H); ctx.lineTo(b.x*W, b.y*H); ctx.stroke();
      ctx.setLineDash([]);
      var mx2 = (a.x+b.x)/2*W, my2 = a.y*H;
      ctx.fillStyle = sus ? 'rgba(248,81,73,0.85)' : 'rgba(210,153,34,0.85)';
      ctx.save(); ctx.translate(mx2, my2);
      ctx.beginPath(); ctx.moveTo(4,0); ctx.lineTo(-3,-3); ctx.lineTo(-3,3); ctx.closePath(); ctx.fill();
      ctx.restore();
      ctx.fillStyle = sus ? 'rgba(248,81,73,0.85)' : 'rgba(210,153,34,0.85)';
      ctx.font = '7px monospace'; ctx.textAlign = 'center';
      ctx.fillText(amts[i], mx2, my2-10);
    }
    nodes.forEach(function (n, i) {
      if (i >= 2) {
        ctx.strokeStyle = 'rgba(248,81,73,0.5)'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(n.x*W, n.y*H, 13, 0, Math.PI*2); ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(n.x*W, n.y*H, 9, 0, Math.PI*2);
      ctx.fillStyle = n.col; ctx.fill();
      ctx.fillStyle = '#f0f6fc'; ctx.font = 'bold 7px monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.fillText(n.label, n.x*W, n.y*H - 13);
    });
    ctx.fillStyle = 'rgba(248,81,73,0.45)';
    ctx.font = '7px monospace'; ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
    ctx.fillText('todo en 48 horas →', W-4, H-2);
  }

  /* ---------- BUILD: TRANSACTIONS TABLE ---------- */
  function buildTransactions() {
    var wrap = document.getElementById('wr-rows');
    if (!wrap) return;
    wrap.innerHTML = '';
    TRANSACTIONS.forEach(function (tx) {
      var row = document.createElement('div');
      row.className = 'wr-row' + (tx.flag === 'alert' ? ' wr-row--flagged' : '');
      row.innerHTML =
        '<span class="wr-cell-id">'   + tx.id   + '</span>' +
        '<span class="wr-cell-flow">' + tx.from + ' → ' + tx.to + '</span>' +
        '<span class="wr-amt'   + (tx.flag === 'alert' ? ' wr-amt--sus' : '') + '">' + tx.amt + '</span>' +
        '<span class="wr-cell-type">' + tx.type + '</span>' +
        '<span class="wr-tag wr-tag--' + tx.flag + '">' + tx.flag + '</span>';
      wrap.appendChild(row);
    });
  }

  /* ---------- BUILD: RISK SCORES ---------- */
  function buildScores() {
    var wrap = document.getElementById('wr-scores');
    if (!wrap) return;
    wrap.innerHTML = '';
    SCORES.forEach(function (s) {
      var row = document.createElement('div');
      row.className = 'wr-score-row';
      row.innerHTML =
        '<span class="wr-score-name">' + s.name + '</span>' +
        '<div class="wr-bar-wrap"><div class="wr-bar" style="width:0%;background:' + s.col + '" data-val="' + s.val + '"></div></div>' +
        '<span class="wr-score-val" style="color:' + s.col + '">' + s.val + '</span>';
      wrap.appendChild(row);
    });
    setTimeout(function () {
      document.querySelectorAll('.wr-bar').forEach(function (b) { b.style.width = b.dataset.val + '%'; });
    }, 350);
  }

  /* ---------- BUILD: ALERTS ---------- */
  function buildAlerts() {
    var wrap = document.getElementById('wr-alerts');
    if (!wrap) return;
    wrap.innerHTML = '';
    ALERTS.forEach(function (a) {
      var el = document.createElement('div');
      el.className = 'wr-alert' + (a.hot ? ' wr-alert--hot' : '');
      el.innerHTML = '<span class="wr-alert-time">' + a.time + '</span><span>' + a.msg + '</span>';
      wrap.appendChild(el);
    });
  }

  /* ---------- BUILD: STEPS ---------- */
  function renderSteps() {
    var stepsEl  = document.getElementById('wr-steps');
    var verdictEl = document.getElementById('wr-verdict');
    if (!stepsEl) return;
    stepsEl.innerHTML = '';

    STEPS.forEach(function (s, i) {
      var el = document.createElement('div');
      var mod = i < currentStep ? ' wr-step--done' : i === currentStep ? ' wr-step--active' : ' wr-step--locked';
      el.className = 'wr-step' + mod;

      var choicesHTML = '';
      if (i === currentStep) {
        choicesHTML = '<div class="wr-choices" id="wr-ch-' + i + '">';
        s.choices.forEach(function (c) {
          choicesHTML += '<button class="wr-choice" data-step="' + i + '" data-correct="' + c.correct + '">' + c.text + '</button>';
        });
        choicesHTML += '</div>';
      }

      el.innerHTML =
        '<div class="wr-step-head">' +
          '<div class="wr-step-num">' + (i < currentStep ? '✓' : (i+1)) + '</div>' +
          '<span class="wr-step-title">' + s.title + '</span>' +
        '</div>' +
        '<div class="wr-step-desc">' + s.desc + '</div>' +
        choicesHTML;
      stepsEl.appendChild(el);
    });

    document.querySelectorAll('.wr-choice').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var si      = parseInt(btn.dataset.step);
        var correct = btn.dataset.correct === 'true';
        document.getElementById('wr-ch-' + si).querySelectorAll('.wr-choice').forEach(function (b) { b.disabled = true; });
        btn.classList.add(correct ? 'wr-choice--correct' : 'wr-choice--wrong');
        if (correct) correctCount++;
        setTimeout(function () {
          currentStep++;
          if (currentStep >= STEPS.length) showVerdict();
          else renderSteps();
        }, 700);
      });
    });
  }

  function showVerdict() {
    renderSteps();
    var verdictEl = document.getElementById('wr-verdict');
    if (!verdictEl) return;
    verdictEl.classList.add('wr-verdict--show');
    var perfect = correctCount === 3;
    verdictEl.innerHTML =
      '<div class="wr-verdict-title">' + (perfect ? 'caso cerrado ✓' : 'investigación completa') + '</div>' +
      '<div class="wr-verdict-body">' + (
        perfect
          ? '<strong>Análisis perfecto.</strong> Identificaste layering, detectaste el patrón de montos decrecientes cross-border, y recomendaste el SAR correcto. Esto es exactamente lo que hacemos en Klar — solo que yo lo hago con cientos de transacciones a la vez.'
          : '<strong>' + correctCount + '/3 correctas.</strong> El patrón es <strong>layering</strong>: dinero moviéndose en capas para ocultar su origen. La señal clave es el mismo monto viajando por 3 países en 48h. La acción correcta es reportar y congelar.'
      ) + '</div>';
  }

  /* ---------- TIMER ---------- */
  function startTimer() {
    timerSecs = 0;
    clearInterval(timerInterval);
    timerInterval = setInterval(function () {
      timerSecs++;
      var el = document.getElementById('wr-timer');
      if (el) el.textContent = pad(Math.floor(timerSecs/60)) + ':' + pad(timerSecs%60);
    }, 1000);
  }
  function stopTimer() { clearInterval(timerInterval); timerInterval = null; }

  /* ---------- OVERLAY OPEN / CLOSE ---------- */
  function openOverlay() {
    document.getElementById('wr-overlay').classList.add('wr-overlay--open');
    document.body.style.overflow = 'hidden';
    currentStep  = 0;
    correctCount = 0;

    // reset verdict
    var v = document.getElementById('wr-verdict');
    if (v) { v.classList.remove('wr-verdict--show'); v.innerHTML = ''; }

    buildTransactions();
    buildScores();
    buildAlerts();
    renderSteps();
    startTimer();

    // draw canvases after layout
    requestAnimationFrame(function () { drawGraph(); drawMap(); });
  }

  function closeOverlay() {
    document.getElementById('wr-overlay').classList.remove('wr-overlay--open');
    document.body.style.overflow = '';
    stopTimer();
  }

  /* ---------- INIT ---------- */
  function init() {
    var overlay = document.createElement('div');
    overlay.id  = 'wr-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'AML War Room — caso interactivo');
    overlay.innerHTML = getHTML();
    document.body.appendChild(overlay);

    document.getElementById('wr-close').addEventListener('click', closeOverlay);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeOverlay(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeOverlay(); });

    // Wire carousel trigger
    document.querySelectorAll('.aml-obj').forEach(function (el) {
      el.style.cursor = 'pointer';
      el.setAttribute('title', 'Click para abrir la War Room');
      el.addEventListener('click', openOverlay);
    });
  }

  /* ---------- HTML TEMPLATE ---------- */
  function getHTML() {
    return [
      '<div class="wr-modal">',

      '  <div class="wr-top">',
      '    <span class="wr-title">AML War Room</span>',
      '    <span class="wr-live-badge">live monitoring</span>',
      '    <span class="wr-timer" id="wr-timer">00:00</span>',
      '    <button class="wr-close-btn" id="wr-close" aria-label="Cerrar">✕</button>',
      '  </div>',

      '  <div class="wr-context">',
      '    <span class="wr-context-logo">Klar</span>',
      '    <div class="wr-context-divider"></div>',
      '    <div>',
      '      <div class="wr-context-text"><strong>Anti-Money Laundering · Equipo de Riesgo Financiero</strong><br>Este es el tipo de caso que analizo en Klar — una fintech mexicana. Fui Summer Intern en el equipo de AML en 2025 y ahora colaboro part-time. Cada día revisamos patrones de transacciones, identificamos flujos sospechosos y decidimos si escalar a reporte regulatorio.</div>',
      '      <div class="wr-context-tags">',
      '        <span class="wr-ctx-tag wr-ctx-tag--blue">Summer Intern 2025</span>',
      '        <span class="wr-ctx-tag wr-ctx-tag--green">Part-time actual</span>',
      '        <span class="wr-ctx-tag wr-ctx-tag--gold">Fintech MX</span>',
      '        <span class="wr-ctx-tag wr-ctx-tag--blue">Riesgo financiero</span>',
      '        <span class="wr-ctx-tag wr-ctx-tag--gold">FATF compliance</span>',
      '      </div>',
      '    </div>',
      '  </div>',

      '  <div class="wr-body">',

      '    <div class="wr-main">',
      '      <div><div class="wr-section-label">volumen de transacciones · últimos 30 días</div>',
      '        <div class="wr-graph-wrap"><canvas id="wr-graph-canvas" height="72"></canvas></div></div>',
      '      <div><div class="wr-section-label">transacciones del caso · #KL-2847</div>',
      '        <div class="wr-table">',
      '          <div class="wr-table-head"><span>ID</span><span>origen → destino</span><span>monto</span><span>tipo</span><span>flag</span></div>',
      '          <div id="wr-rows"></div>',
      '        </div></div>',
      '      <div><div class="wr-section-label">flujo del dinero · 48 horas</div>',
      '        <div class="wr-map-wrap"><canvas id="wr-map-canvas" height="110"></canvas></div></div>',
      '    </div>',

      '    <div class="wr-side">',
      '      <div><div class="wr-section-label">nivel de riesgo · entidades</div><div id="wr-scores"></div></div>',
      '      <div><div class="wr-section-label">alertas del sistema</div><div class="wr-alerts" id="wr-alerts"></div></div>',
      '      <div><div class="wr-section-label">tu turno · resuelve el caso</div>',
      '        <div class="wr-steps" id="wr-steps"></div>',
      '        <div class="wr-verdict" id="wr-verdict"></div>',
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
