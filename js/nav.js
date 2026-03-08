/* ============================================================
   OCHUGI HOLDINGS LTD — NAVIGATION
   Builds the sidebar and handles active states.
   To add a new page: add an entry to NAV_ITEMS below.
   ============================================================ */

const NAV_ITEMS = [
  {
    section: "Daily Use",
    items: [
      { icon: "⚡", label: "Command Center",    href: "index.html",              badge: null },
      { icon: "🎯", label: "Maven Tracker",     href: "maven.html",              badge: { text: "LIVE", color: "gold" } },
      { icon: "📅", label: "News Calendar",     href: "news-calendar.html",      badge: null },
      { icon: "🧮", label: "Calculator",        href: "calculator.html",         badge: null },
      { icon: "⏰", label: "Daily Routine",     href: "routine.html",            badge: null }
    ]
  },
  {
    section: "Traders",
    items: [
      { icon: "📈", label: "Raymond",           href: "raymond.html",            badge: null },
      { icon: "📈", label: "Elvis",             href: "elvis.html",              badge: { text: "SETUP", color: "blue" } },
      { icon: "📋", label: "Trade Log",         href: "trade-log.html",          badge: { text: "60", color: "green" } }
    ]
  },
  {
    section: "Analysis",
    items: [
      { icon: "📊", label: "Analytics",         href: "analytics.html",          badge: null },
      { icon: "🔬", label: "Backtesting",       href: "backtesting.html",        badge: { text: "4", color: "green" } },
      { icon: "🏆", label: "Strategy Vault",    href: "strategy-vault.html",     badge: null },
      { icon: "📸", label: "Screenshots",       href: "screenshot-archive.html", badge: null }
    ]
  },
  {
    section: "Risk",
    items: [
      { icon: "⚠️", label: "Risk Monitor",     href: "risk-monitor.html",       badge: null }
    ]
  }
];

/* ─── BUILD SIDEBAR ────────────────────────────────────────────── */
function buildSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  const data = OCHUGI_DATA;
  const r = data.raymond;

  // Calculate if Maven floor is close
  const mavenFloor = r.mavenStartBalance * 0.95;
  const bufferPct = ((r.currentBalance - mavenFloor) / r.currentBalance * 100);
  const floorWarning = bufferPct < 3;

  sidebar.innerHTML = `
    <!-- Logo -->
    <div class="sidebar-logo">
      <img src="assets/logo.png" alt="Ochugi Logo"
           onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
      <div class="sidebar-logo-fallback" style="display:none">OH</div>
      <div class="sidebar-brand">
        <div class="sidebar-brand-name">Ochugi Holdings</div>
        <div class="sidebar-brand-sub">Trading Firm</div>
      </div>
    </div>

    <!-- Live Stats -->
    <div class="sidebar-stats">
      <div class="sidebar-stat-row">
        <span class="sidebar-stat-label">BALANCE</span>
        <span class="sidebar-stat-value positive">$${r.currentBalance.toLocaleString('en-US', {minimumFractionDigits:2})}</span>
      </div>
      <div class="sidebar-stat-row">
        <span class="sidebar-stat-label">NET P&L</span>
        <span class="sidebar-stat-value positive">+$${r.netPnL.toFixed(2)}</span>
      </div>
      <div class="sidebar-stat-row">
        <span class="sidebar-stat-label">WIN RATE</span>
        <span class="sidebar-stat-value neutral">${r.winRate}%</span>
      </div>
    </div>

    <!-- Maven Progress -->
    <div class="sidebar-maven">
      <div class="sidebar-maven-header">
        <span class="sidebar-maven-label">MAVEN CHALLENGE</span>
        <span class="sidebar-maven-pct">${r.mavenPct.toFixed(1)}%</span>
      </div>
      <div class="sidebar-progress-track">
        <div class="sidebar-progress-fill" style="width: ${r.mavenPct}%"></div>
      </div>
    </div>

    <!-- Nav -->
    <nav class="sidebar-nav">
      ${NAV_ITEMS.map(section => `
        <div class="nav-section">
          <div class="nav-section-label">${section.section}</div>
          ${section.items.map(item => `
            <a href="${item.href}" class="nav-item ${isActivePage(item.href) ? 'active' : ''}">
              <span class="nav-icon">${item.icon}</span>
              <span class="nav-label">${item.label}</span>
              ${item.badge ? `<span class="nav-badge ${item.badge.color}">${item.badge.text}</span>` : ''}
            </a>
          `).join('')}
        </div>
      `).join('')}
    </nav>

    <!-- Footer -->
    <div class="sidebar-footer">
      <div class="sidebar-footer-text">
        Updated ${data.firm.lastUpdated}
      </div>
    </div>
  `;
}

/* ─── DETECT ACTIVE PAGE ───────────────────────────────────────── */
function isActivePage(href) {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  return currentPage === href;
}

/* ─── MOBILE TOGGLE ────────────────────────────────────────────── */
function initMobileNav() {
  const toggle = document.getElementById('mobileNavToggle');
  const overlay = document.getElementById('sidebarOverlay');
  const sidebar = document.getElementById('sidebar');

  if (!toggle || !overlay || !sidebar) return;

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('visible');
  });

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
  });
}

/* ─── NEWS ALERT BAR ────────────────────────────────────────────── */
function buildNewsAlert() {
  const container = document.getElementById('newsAlertBar');
  if (!container) return;

  const upcoming = getUpcomingEvents(2);
  if (upcoming.length === 0) {
    container.style.display = 'none';
    return;
  }

  const next = upcoming[0];
  const isToday = next.date === new Date().toISOString().split('T')[0];

  container.innerHTML = `
    <div class="alert ${next.impact === 'extreme' ? 'alert-danger' : 'alert-warning'}" style="margin-bottom: 20px;">
      <span class="alert-icon">⚠️</span>
      <div class="alert-text">
        <span class="alert-title">${isToday ? 'TODAY' : 'UPCOMING'}: ${next.event} — ${next.country}</span>
        ${next.date} at ${next.time} EAT · No-trade window: ${next.block} · Maven rule applies
      </div>
    </div>
  `;
}

/* ─── INIT ──────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  buildSidebar();
  initMobileNav();
  buildNewsAlert();
});
