/* ============================================================
   OCHUGI HOLDINGS LTD — CENTRAL DATA FILE
   Update this file when you import new trades.
   All pages pull from this single source of truth.
   ============================================================ */

const OCHUGI_DATA = {

  /* ─── FIRM INFO ─────────────────────────────────────────────── */
  firm: {
    name: "Ochugi Holdings Ltd",
    broker: "MavenTrade Limited",
    founded: "2026",
    lastUpdated: "March 7, 2026"
  },

  /* ─── RAYMOND'S STATS ─────────────────────────────────────── */
  raymond: {
    name: "Raymond Ochieng",
    accountId: "10212887",
    startingBalance: 5000,
    currentBalance: 5173.87,
    netPnL: 173.87,
    grossProfit: 349.75,
    grossLoss: -175.88,
    totalTrades: 60,
    wins: 32,
    losses: 28,
    winRate: 53.33,
    profitFactor: 1.99,
    sharpeRatio: 0.20,
    maxDrawdown: 38.08,
    maxDrawdownPct: 0.74,
    recoveryFactor: 4.57,
    expectancy: 2.90,
    expectancyR: 0.46,
    avgWin: 10.93,
    avgLoss: -6.28,
    bestTrade: { amount: 52.64, instrument: "GBPNZD" },
    worstTrade: { amount: -22.07, instrument: "XAUUSD" },
    period: "Feb 9 – Mar 7, 2026",
    // Maven Challenge
    mavenTarget: 400,
    mavenCurrent: 173.87,
    mavenPct: 43.47,
    mavenRemaining: 226.13,
    mavenStartBalance: 5000,
    // Session breakdown
    sessions: [
      { name: "Asian",    pnl: 92.97,  wr: 57, trades: 21, color: "#0fd980" },
      { name: "London",   pnl: 62.60,  wr: 39, trades: 18, color: "#3d8ef0" },
      { name: "Overlap",  pnl: 39.52,  wr: 67, trades: 9,  color: "#f5c542" },
      { name: "New York", pnl: -17.82, wr: 33, trades: 12, color: "#ff4b5c" }
    ],
    // Asset class breakdown
    assets: [
      { name: "Forex",  pnl: 97.68,  trades: 28, color: "#3d8ef0" },
      { name: "Metals", pnl: 75.76,  trades: 14, color: "#c9a84c" },
      { name: "Index",  pnl: 18.21,  trades: 5,  color: "#9b59e8" },
      { name: "Crypto", pnl: -17.78, trades: 13, color: "#ff4b5c" }
    ],
    // Instrument breakdown
    instruments: [
      { symbol: "XAUUSD",  pnl:  55.46, trades: 14, wr: 57, status: "green" },
      { symbol: "GBPNZD",  pnl:  52.64, trades: 1,  wr: 100, status: "green" },
      { symbol: "GER30",   pnl:  43.51, trades: 1,  wr: 100, status: "green" },
      { symbol: "USDCHF",  pnl:  22.14, trades: 3,  wr: 67, status: "green" },
      { symbol: "EURUSD",  pnl:  18.32, trades: 6,  wr: 50, status: "green" },
      { symbol: "GBPUSD",  pnl:  14.55, trades: 5,  wr: 60, status: "green" },
      { symbol: "AUDUSD",  pnl:   8.67, trades: 4,  wr: 50, status: "watch" },
      { symbol: "BTCUSD",  pnl: -17.57, trades: 8,  wr: 37.5, status: "kill" },
      { symbol: "USDJPY",  pnl:  -8.01, trades: 3,  wr: 33, status: "kill" },
      { symbol: "US30",    pnl: -25.30, trades: 3,  wr: 33, status: "kill" },
      { symbol: "AUDCAD",  pnl: -13.38, trades: 1,  wr: 0,  status: "kill" }
    ],
    // Monthly equity curve (approximate)
    equity: [
      { date: "Feb 9",  balance: 5000 },
      { date: "Feb 11", balance: 5023 },
      { date: "Feb 13", balance: 5041 },
      { date: "Feb 16", balance: 5022 },  // overtrading day
      { date: "Feb 18", balance: 5010 },  // revenge trade
      { date: "Feb 20", balance: 5055 },
      { date: "Feb 22", balance: 5085 },
      { date: "Feb 24", balance: 5102 },
      { date: "Feb 26", balance: 5120 },
      { date: "Feb 28", balance: 5135 },
      { date: "Mar 2",  balance: 5148 },
      { date: "Mar 4",  balance: 5162 },
      { date: "Mar 6",  balance: 5170 },
      { date: "Mar 7",  balance: 5174 }
    ]
  },

  /* ─── ELVIS'S STATS ────────────────────────────────────────── */
  elvis: {
    name: "Elvis Ngugi",
    accountId: "Pending",
    currentBalance: null,
    netPnL: null,
    totalTrades: null,
    status: "awaiting_data",
    message: "Upload MavenTrade Excel to populate"
  },

  /* ─── RISK RULES ───────────────────────────────────────────── */
  risk: {
    riskPerTrade: 0.25,
    dailyMaxLoss: 1.0,
    weeklyMaxLoss: 5.0,
    monthlyMaxLoss: 8.0,
    mavenDailyDD: 3.0,
    mavenMaxDD: 5.0,
    mavenProfitTarget: 8.0
  },

  /* ─── KILL LIST ────────────────────────────────────────────── */
  killList: [
    { symbol: "US30",   reason: "−$8.43/trade avg",   totalLoss: -25.30 },
    { symbol: "USDJPY", reason: "−$2.67/trade avg",   totalLoss: -8.01 },
    { symbol: "AUDCAD", reason: "−$13.38/trade avg",  totalLoss: -13.38 },
    { symbol: "BTCUSD", reason: "38.5% WR, −$2.20/trade", totalLoss: -17.57 }
  ],

  /* ─── BEST SESSIONS ────────────────────────────────────────── */
  bestSession: "Asian",
  worstSession: "New York",

  /* ─── NEWS EVENTS (March–June 2026) ───────────────────────── */
  newsEvents: [
    { date: "2026-03-11", event: "US CPI",           country: "USD", impact: "extreme", time: "16:30", block: "16:28–16:32" },
    { date: "2026-03-12", event: "US PPI",           country: "USD", impact: "high",    time: "16:30", block: "16:28–16:32" },
    { date: "2026-03-13", event: "US Retail Sales",  country: "USD", impact: "high",    time: "16:30", block: "16:28–16:32" },
    { date: "2026-03-18", event: "FOMC Decision",    country: "USD", impact: "extreme", time: "22:00", block: "21:30–23:30" },
    { date: "2026-03-19", event: "BOE Decision",     country: "GBP", impact: "extreme", time: "15:00", block: "14:58–15:30" },
    { date: "2026-04-03", event: "US NFP",           country: "USD", impact: "extreme", time: "16:30", block: "16:00–17:30" },
    { date: "2026-04-09", event: "US CPI",           country: "USD", impact: "extreme", time: "16:30", block: "16:28–16:32" },
    { date: "2026-04-16", event: "ECB Decision",     country: "EUR", impact: "high",    time: "16:15", block: "16:13–17:00" },
    { date: "2026-04-29", event: "FOMC Decision",    country: "USD", impact: "extreme", time: "22:00", block: "21:30–23:30" },
    { date: "2026-05-01", event: "US NFP",           country: "USD", impact: "extreme", time: "16:30", block: "16:00–17:30" },
    { date: "2026-05-07", event: "BOE Decision",     country: "GBP", impact: "extreme", time: "15:00", block: "14:58–15:30" },
    { date: "2026-05-12", event: "US CPI",           country: "USD", impact: "extreme", time: "16:30", block: "16:28–16:32" },
    { date: "2026-06-05", event: "US NFP",           country: "USD", impact: "extreme", time: "16:30", block: "16:00–17:30" },
    { date: "2026-06-11", event: "US CPI",           country: "USD", impact: "extreme", time: "16:30", block: "16:28–16:32" },
    { date: "2026-06-11", event: "ECB Decision",     country: "EUR", impact: "high",    time: "16:15", block: "16:13–17:00" },
    { date: "2026-06-17", event: "FOMC Decision",    country: "USD", impact: "extreme", time: "22:00", block: "21:30–23:30" },
    { date: "2026-06-18", event: "BOE Decision",     country: "GBP", impact: "extreme", time: "15:00", block: "14:58–15:30" }
  ],

  /* ─── BACKTESTING LOG ──────────────────────────────────────── */
  backtests: [
    {
      id: 1,
      name: "XAUUSD Asian Session Pullback",
      trader: "Raymond",
      instrument: "XAUUSD",
      timeframe: "M15",
      session: "Asian",
      trades: 14, wins: 8, losses: 6,
      winRate: 57.1, profitFactor: 2.08,
      avgWin: 7.91, avgLoss: 5.11,
      expectancy: 3.47,
      maxConsecLoss: 2,
      verdict: "approved",
      confidence: 8,
      readyForLive: true
    },
    {
      id: 2,
      name: "GBP Pairs London Open Momentum",
      trader: "Raymond",
      instrument: "GBPUSD / GBPNZD / GBPJPY",
      timeframe: "M15",
      session: "London",
      trades: 4, wins: 3, losses: 1,
      winRate: 75.0, profitFactor: 4.57,
      avgWin: 18.55, avgLoss: 6.10,
      expectancy: 12.36,
      maxConsecLoss: 1,
      verdict: "approved",
      confidence: 7,
      readyForLive: true
    },
    {
      id: 3,
      name: "GER30 Overlap Breakout",
      trader: "Raymond",
      instrument: "GER30",
      timeframe: "H1",
      session: "Overlap",
      trades: 3, wins: 2, losses: 1,
      winRate: 66.7, profitFactor: 5.16,
      avgWin: 21.75, avgLoss: 8.43,
      expectancy: 15.69,
      maxConsecLoss: 1,
      verdict: "approved",
      confidence: 6,
      readyForLive: true
    },
    {
      id: 4,
      name: "Crypto (BTCUSD/ETHUSD) Any Setup",
      trader: "Raymond",
      instrument: "BTCUSD / ETHUSD",
      timeframe: "M15",
      session: "All",
      trades: 13, wins: 5, losses: 8,
      winRate: 38.5, profitFactor: 0.45,
      avgWin: 3.10, avgLoss: 4.23,
      expectancy: -2.18,
      maxConsecLoss: 4,
      verdict: "failed",
      confidence: 1,
      readyForLive: false
    }
  ],

  /* ─── MISTAKES ──────────────────────────────────────────────── */
  mistakes: [
    { date: "Feb 16", type: "Overtrading",     detail: "8 trades in one day, exceeded 1% daily limit",  impact: -18.48 },
    { date: "Feb 18", type: "Revenge Trade",   detail: "Entered after XAUUSD loss to recover quickly",  impact: -9.20 },
    { date: "Various", type: "Kill List",      detail: "13 crypto trades despite negative expectancy",   impact: -17.78 },
    { date: "Various", type: "Kill List",      detail: "US30 — 3 trades, all losses",                   impact: -25.30 },
    { date: "Feb 16",  type: "Session Error",  detail: "NY session overuse — 33% WR confirmed",          impact: -17.82 }
  ]
};

/* ─── HELPER FUNCTIONS ─────────────────────────────────────────── */

// Calculate position size
function calcLotSize(balance, riskPct, slPips, pipValue) {
  const riskAmount = (balance * riskPct) / 100;
  return riskAmount / (slPips * pipValue);
}

// Format currency
function formatUSD(amount) {
  const abs = Math.abs(amount);
  const formatted = abs.toFixed(2);
  return (amount >= 0 ? '+$' : '-$') + formatted;
}

// Format percentage
function formatPct(value) {
  return (value >= 0 ? '+' : '') + value.toFixed(2) + '%';
}

// Get Maven progress color
function getMavenColor(pct) {
  if (pct >= 80) return 'var(--green)';
  if (pct >= 50) return 'var(--gold)';
  return 'var(--blue)';
}

// Get today's news events
function getTodayEvents() {
  const today = new Date().toISOString().split('T')[0];
  return OCHUGI_DATA.newsEvents.filter(e => e.date === today);
}

// Get upcoming news (next 7 days)
function getUpcomingEvents(days = 7) {
  const today = new Date();
  const future = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
  return OCHUGI_DATA.newsEvents.filter(e => {
    const d = new Date(e.date);
    return d >= today && d <= future;
  });
}
