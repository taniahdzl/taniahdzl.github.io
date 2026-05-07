/* ============================================
   TANIA'S PORTFOLIO — strategy-portal.js
   Portal: Sticky note (strategy) → Mission & Vision
   ============================================ */

(function () {

  /* ---------- CONTENT ---------- */
  var MISSION = {
    title: "Let's build something worth building.",
    subtitle: 'Mission & Strategy',
    sections: [
      {
        title: 'The Goal',
        text: 'I build products and systems at the intersection of <em>data, design, and purpose</em>. Not tools for tools\' sake — things that solve real problems for real people, and leave the world slightly better than I found it.'
      },
      {
        title: 'How',
        text: 'I combine data literacy with business acumen and engineering rigor. Whether it\'s AML dashboards at a fintech, a self-sustaining university garden, or mapping Asia through playlists — every project solves for impact, not just metrics.'
      },
      {
        title: 'What\'s Next',
        text: 'I\'m open to conversations about <em>data strategy, sustainability, fintech, social enterprise, or anything</em> that sits at the intersection of technology and positive impact. If you\'re building something worth building, let\'s talk.'
      }
    ]
  };

  /* ---------- OPEN / CLOSE ---------- */
  function openOverlay() {
    document.getElementById('sp-overlay').classList.add('sp-overlay--open');
    document.body.style.overflow = 'hidden';
  }

  function closeOverlay() {
    document.getElementById('sp-overlay').classList.remove('sp-overlay--open');
    document.body.style.overflow = '';
  }

  /* ---------- INIT ---------- */
  function init() {
    var overlay = document.createElement('div');
    overlay.id  = 'sp-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Mission & Strategy');
    overlay.innerHTML = getHTML();
    document.body.appendChild(overlay);

    // Wire close
    document.getElementById('sp-close').addEventListener('click', closeOverlay);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeOverlay(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeOverlay(); });

    // Wire carousel trigger
    document.querySelectorAll('.strategy-obj').forEach(function (el) {
      el.style.cursor = 'pointer';
      el.setAttribute('title', 'Click to explore the mission');
      el.addEventListener('click', openOverlay);
    });
  }

  /* ---------- HTML ---------- */
  function getHTML() {
    var html = [
      '<div class="sp-modal">',
      '  <button class="sp-close-btn" id="sp-close" aria-label="Close">✕</button>',
      '  <div class="sp-header">',
      '    <div class="sp-title">' + MISSION.title + '</div>',
      '    <div class="sp-subtitle">' + MISSION.subtitle + '</div>',
      '  </div>',
      '  <div class="sp-content">'
    ];

    MISSION.sections.forEach(function (section) {
      html.push(
        '    <div class="sp-section">' +
        '      <div class="sp-section-title">' + section.title + '</div>' +
        '      <p class="sp-section-text">' + section.text + '</p>' +
        '    </div>'
      );
    });

    html.push(
      '  </div>',
      '  <div class="sp-contacts">',
      '    <a href="/cdn-cgi/l/email-protection#f292939c9b93b2978a939f829e97dc919d9f" class="sp-contact-link">',
      '      <span>✉</span> email',
      '    </a>',
      '    <a href="https://www.linkedin.com/in/tania-hernandez-lira-datascience-businesseng/" class="sp-contact-link">',
      '      <span>in</span> linkedin',
      '    </a>',
      '    <a href="https://github.com/taniahdzl" class="sp-contact-link">',
      '      <span>↗</span> github',
      '    </a>',
      '  </div>',
      '  <div class="sp-footer">strategy · vision · impact</div>',
      '</div>'
    );

    return html.join('\n');
  }

  /* ---------- BOOT ---------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
