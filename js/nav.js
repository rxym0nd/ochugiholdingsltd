/* ============================================================
   OCHUGI HOLDINGS LTD — NAVIGATION & INTERACTIONS v3
   Custom cursor · Top nav · Scroll reveal · Loading screen
   ============================================================ */

var NAV_STRUCTURE = [
  {
    label: 'Daily',
    items: [
      { icon: '⚡', label: 'Command Center', href: 'index.html' },
      { icon: '🎯', label: 'Maven Tracker',  href: 'maven.html', badge: { text: 'LIVE', cls: 'nav-badge-accent' } },
      { icon: '📅', label: 'News Calendar',  href: 'news-calendar.html' },
      { icon: '⏰', label: 'Daily Routine',  href: 'routine.html' },
      { icon: '✍️', label: 'Log Trade',     href: 'trade-entry.html', badge: { text: 'NEW', cls: 'nav-badge-accent' } }
    ]
  },
  {
    label: 'Traders',
    items: [
      { icon: '📈', label: 'Raymond', href: 'raymond.html' },
      { icon: '📈', label: 'Elvis',   href: 'elvis.html', badge: { text: 'SETUP', cls: 'nav-badge-blue' } },
      { icon: '📋', label: 'Trade Log', href: 'trade-log.html', badge: { text: '60', cls: 'nav-badge-green' } }
    ]
  },
  {
    label: 'Analysis',
    items: [
      { icon: '📊', label: 'Analytics',     href: 'analytics.html' },
      { icon: '🔬', label: 'Backtesting',   href: 'backtesting.html' },
      { icon: '🏆', label: 'Strategies',    href: 'strategy-vault.html' },
      { icon: '📸', label: 'Screenshots',   href: 'screenshot-archive.html' }
    ]
  },
  {
    label: 'Risk',
    items: [
      { icon: '⚠️', label: 'Risk Monitor', href: 'risk-monitor.html' },
      { icon: '🧮', label: 'Calculator',    href: 'calculator.html' }
    ]
  }
];

/* ─── ACTIVE PAGE ────────────────────────────────────────────── */
function getActivePage() {
  return window.location.pathname.split('/').pop() || 'index.html';
}

/* ─── BUILD TOP NAV ─────────────────────────────────────────── */
function buildNav() {
  var nav = document.getElementById('topnav');
  if (!nav) return;

  var r = OCHUGI_DATA.raymond;
  var activePage = getActivePage();

  var groupsHtml = '';
  for (var g = 0; g < NAV_STRUCTURE.length; g++) {
    var group = NAV_STRUCTURE[g];
    var hasActive = group.items.some(function(i) { return i.href === activePage; });

    groupsHtml += '<div class="nav-group">';
    groupsHtml += '<span class="nav-link nav-group-trigger' + (hasActive ? ' active' : '') + '">' + escapeHTML(group.label) + '</span>';
    groupsHtml += '<div class="nav-dropdown">';
    for (var i = 0; i < group.items.length; i++) {
      var item = group.items[i];
      var isActive = item.href === activePage;
      var badgeHtml = item.badge
        ? '<span class="nav-badge ' + escapeHTML(item.badge.cls) + '">' + escapeHTML(item.badge.text) + '</span>'
        : '';
      groupsHtml += '<a href="' + escapeHTML(item.href) + '" class="nav-dropdown-item' + (isActive ? ' active' : '') + '">';
      groupsHtml += '<span class="nav-dropdown-icon">' + escapeHTML(item.icon) + '</span>';
      groupsHtml += escapeHTML(item.label) + badgeHtml;
      groupsHtml += '</a>';
    }
    groupsHtml += '</div></div>';
  }

  nav.innerHTML =
    // Logo
    '<a href="index.html" class="nav-logo">'
    + '<img class="nav-logo-img" src="assets/logo.png" alt="Ochugi" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">'
    + '<div class="nav-logo-fallback">OH</div>'
    + '<div class="nav-brand">'
    + '<div class="nav-brand-name">Ochugi</div>'
    + '<div class="nav-brand-sub">Holdings · Trading Firm</div>'
    + '</div>'
    + '</a>'

    // Nav links
    + '<div class="nav-links">' + groupsHtml + '</div>'

    // Right: Maven pill & Logout
    + '<div class="nav-right">'
    + '<a href="maven.html" class="nav-maven-pill">'
    + '<span class="nav-maven-label">Maven</span>'
    + '<div class="nav-maven-bar"><div class="nav-maven-fill" style="width:' + escapeHTML(r.mavenPct) + '%"></div></div>'
    + '<span class="nav-maven-pct">' + escapeHTML(r.mavenPct.toFixed(1)) + '%</span>'
    + '</a>'
    + '<button class="nav-link" id="navLogout" style="background:transparent;border:none;cursor:pointer;color:var(--text-muted);font-size:0.85rem;margin-left:16px;">Logout</button>'
    + '<button class="nav-hamburger" id="navHamburger" aria-label="Menu">'
    + '<span></span><span></span><span></span>'
    + '</button>'
    + '</div>';
    
  setTimeout(function() {
    var logoutBtn = document.getElementById('navLogout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('ochugi_token');
        localStorage.removeItem('ochugi_user');
        window.location.href = 'login.html';
      });
    }
  }, 0);
}

/* ─── MOBILE MENU ────────────────────────────────────────────── */
function buildMobileMenu() {
  var menu = document.getElementById('mobileMenu');
  if (!menu) return;

  var r = OCHUGI_DATA.raymond;
  var activePage = getActivePage();
  var allItems = [];
  NAV_STRUCTURE.forEach(function(g) { allItems = allItems.concat(g.items); });

  var linksHtml = '';
  for (var i = 0; i < allItems.length; i++) {
    var item = allItems[i];
    var isActive = item.href === activePage;
    linksHtml += '<a href="' + escapeHTML(item.href) + '" class="mobile-menu-link' + (isActive ? ' active' : '') + '">';
    linksHtml += '<span class="mobile-icon">' + escapeHTML(item.icon) + '</span>' + escapeHTML(item.label);
    linksHtml += '</a>';
  }

  menu.innerHTML = linksHtml
    + '<div class="mobile-menu-stats">'
    + '<div class="mobile-stat">'
    + '<div class="mobile-stat-label">Balance</div>'
    + '<div class="mobile-stat-value text-accent">$' + escapeHTML(r.currentBalance.toLocaleString('en-US', {minimumFractionDigits:2})) + '</div>'
    + '</div>'
    + '<div class="mobile-stat">'
    + '<div class="mobile-stat-label">Win Rate</div>'
    + '<div class="mobile-stat-value text-accent">' + escapeHTML(r.winRate) + '%</div>'
    + '</div>'
    + '</div>';
}

/* ─── NAV SCROLL BEHAVIOR ────────────────────────────────────── */
function initNavScroll() {
  var nav = document.getElementById('topnav');
  if (!nav) return;
  window.addEventListener('scroll', function() {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ─── HAMBURGER TOGGLE ───────────────────────────────────────── */
function initHamburger() {
  var btn = document.getElementById('navHamburger');
  var menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', function() {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      btn.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ─── CUSTOM CURSOR ──────────────────────────────────────────── */
function initCursor() {
  var dot = document.getElementById('cursorDot');
  var ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  var dotX = 0, dotY = 0, ringX = 0, ringY = 0;
  var rafId;

  document.addEventListener('mousemove', function(e) {
    dotX = e.clientX;
    dotY = e.clientY;
  });

  function animate() {
    ringX += (dotX - ringX) * 0.12;
    ringY += (dotY - ringY) * 0.12;

    dot.style.left = dotX + 'px';
    dot.style.top  = dotY + 'px';
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';

    rafId = requestAnimationFrame(animate);
  }
  animate();

  // Hover effect on interactive elements
  var hoverEls = document.querySelectorAll('a, button, [onclick], .nav-group-trigger, input, select');
  hoverEls.forEach(function(el) {
    el.addEventListener('mouseenter', function() {
      dot.classList.add('hover');
      ring.classList.add('hover');
    });
    el.addEventListener('mouseleave', function() {
      dot.classList.remove('hover');
      ring.classList.remove('hover');
    });
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', function() {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', function() {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
}

/* ─── SCROLL REVEAL ──────────────────────────────────────────── */
function initScrollReveal() {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(function(el) { observer.observe(el); });
}

/* ─── STAT TICKER ────────────────────────────────────────────── */
function buildTicker() {
  var wrap = document.getElementById('statTicker');
  if (!wrap) return;

  var r = OCHUGI_DATA.raymond;
  var items = [
    { label: 'Balance', val: '$' + r.currentBalance.toFixed(2) },
    { label: 'Net P&L', val: '+$' + r.netPnL.toFixed(2) },
    { label: 'Win Rate', val: r.winRate + '%' },
    { label: 'Maven', val: r.mavenPct.toFixed(1) + '% Complete' },
    { label: 'Profit Factor', val: r.profitFactor },
    { label: 'Expectancy', val: '+$' + r.expectancy + '/trade' },
    { label: 'Best Trade', val: '+$' + r.bestTrade.amount + ' · ' + r.bestTrade.instrument },
    { label: 'Trades', val: r.totalTrades + ' total' },
    { label: 'Session', val: r.bestSession + ' is the edge' },
    { label: 'Target', val: '$' + r.mavenRemaining.toFixed(2) + ' remaining' }
  ];

  // Build one set
  var oneSet = '';
  for (var i = 0; i < items.length; i++) {
    oneSet += '<div class="ticker-item">';
    oneSet += '<span>' + escapeHTML(items[i].label) + '</span>';
    oneSet += '<span class="ticker-sep">◆</span>';
    oneSet += '<span class="ticker-val">' + escapeHTML(items[i].val) + '</span>';
    if (i < items.length - 1) {
      oneSet += '<span class="ticker-sep">—</span>';
    }
    oneSet += '</div>';
  }

  // Duplicate for seamless loop
  var track = wrap.querySelector('.ticker-track');
  if (track) {
    track.innerHTML = oneSet + oneSet;
  }
}

/* ─── NEWS ALERT ─────────────────────────────────────────────── */
function buildNewsAlert() {
  var container = document.getElementById('newsAlertBar');
  if (!container) return;

  var upcoming = getUpcomingEvents(2);
  if (!upcoming.length) {
    container.style.display = 'none';
    return;
  }

  var next = upcoming[0];
  var isToday = next.date === new Date().toISOString().split('T')[0];

  container.innerHTML = '<div class="alert ' + (next.impact === 'extreme' ? 'alert-red' : 'alert-accent') + '" style="margin-bottom:24px;">'
    + '<span class="alert-icon">⚠️</span>'
    + '<div class="alert-text">'
    + '<span class="alert-title">' + (isToday ? 'TODAY' : 'UPCOMING') + ': ' + escapeHTML(next.event) + ' — ' + escapeHTML(next.country) + '</span>'
    + escapeHTML(next.date) + ' at ' + escapeHTML(next.time) + ' EAT · No-trade window: ' + escapeHTML(next.block) + ' · Maven rule applies'
    + '</div>'
    + '</div>';
}

/* ─── LOADING SCREEN ─────────────────────────────────────────── */
function initLoadingScreen() {
  var screen = document.getElementById('loadingScreen');
  var bar = document.getElementById('loadingBar');
  if (!screen) return;

  // Animate bar
  var pct = 0;
  var interval = setInterval(function() {
    pct += Math.random() * 25 + 10;
    if (pct > 100) pct = 100;
    if (bar) bar.style.width = pct + '%';
    if (pct >= 100) {
      clearInterval(interval);
      setTimeout(function() {
        screen.classList.add('hidden');
      }, 300);
    }
  }, 120);
}

/* ─── INIT ALL ───────────────────────────────────────────────── */
document.addEventListener('OchugiDataLoaded', function() {
  buildNav();
  buildMobileMenu();
  initNavScroll();
  initHamburger();
  initCursor();
  initScrollReveal();
  buildTicker();
  buildNewsAlert();
  initLoadingScreen();
});

