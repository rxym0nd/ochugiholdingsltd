/* ============================================================
   OCHUGI HOLDINGS LTD — POSITION SIZE CALCULATOR
   
   Pip values are USD per STANDARD LOT per pip/point.
   Formula: Lot Size = Risk Amount / (SL pips × Pip Value per lot)
   
   XAUUSD example: $12.94 risk ÷ (15 points × $100/lot) = 0.0086 lots
   GBPUSD example: $12.94 risk ÷ (15 pips  × $10/lot)  = 0.086 lots
   ============================================================ */

var CALC_INSTRUMENTS = {
  XAUUSD: { label: 'Gold (XAU/USD) 🥇',       pipValue: 100,  pipLabel: 'Points', killList: false, note: '1 lot = 100oz · $100/point/lot' },
  GBPUSD: { label: 'GBP/USD 💷',              pipValue: 10,   pipLabel: 'Pips',   killList: false, note: '$10/pip/lot' },
  EURUSD: { label: 'EUR/USD 💶',              pipValue: 10,   pipLabel: 'Pips',   killList: false, note: '$10/pip/lot' },
  GBPNZD: { label: 'GBP/NZD',                           pipValue: 6.2,  pipLabel: 'Pips',   killList: false, note: '~$6.20/pip/lot' },
  GBPJPY: { label: 'GBP/JPY',                           pipValue: 6.8,  pipLabel: 'Pips',   killList: false, note: '~$6.80/pip/lot' },
  USDCHF: { label: 'USD/CHF',                           pipValue: 9.5,  pipLabel: 'Pips',   killList: false, note: '~$9.50/pip/lot' },
  AUDUSD: { label: 'AUD/USD',                           pipValue: 10,   pipLabel: 'Pips',   killList: false, note: '$10/pip/lot' },
  EURJPY: { label: 'EUR/JPY',                           pipValue: 6.8,  pipLabel: 'Pips',   killList: false, note: '~$6.80/pip/lot' },
  GER30:  { label: 'GER30 (DAX) 📊',         pipValue: 1,    pipLabel: 'Points', killList: false, note: '~$1/point/lot' },
  USDJPY: { label: 'USD/JPY ❌ KILL LIST',          pipValue: 6.8,  pipLabel: 'Pips',   killList: true,  note: 'Kill list — do not trade' },
  AUDCAD: { label: 'AUD/CAD ❌ KILL LIST',          pipValue: 7.3,  pipLabel: 'Pips',   killList: true,  note: 'Kill list — do not trade' },
  US30:   { label: 'US30 ❌ KILL LIST',             pipValue: 1,    pipLabel: 'Points', killList: true,  note: 'Kill list — do not trade' },
  BTCUSD: { label: 'BTC/USD ❌ KILL LIST',          pipValue: 1,    pipLabel: 'Points', killList: true,  note: 'Kill list — do not trade' }
};

var RISK_PROFILES = [
  { label: 'Full Risk', pct: 0.25, color: 'var(--green)',  note: 'A-grade setup — Scorecard 8+' },
  { label: 'Reduced',   pct: 0.15, color: 'var(--yellow)', note: 'Good setup — Scorecard 6 to 7' },
  { label: 'Micro',     pct: 0.10, color: 'var(--blue)',   note: 'Uncertain market — test size' }
];

var calcState = {
  balance: 0,
  mavenStartBalance: 0,
  instrument: 'XAUUSD',
  slPips: 15,
  rrRatio: 2,
  riskProfile: 0
};

function calculateLotSize() {
  var balance   = calcState.balance;
  var inst      = CALC_INSTRUMENTS[calcState.instrument];
  var slPips    = calcState.slPips;
  var rrRatio   = calcState.rrRatio;
  var profile   = RISK_PROFILES[calcState.riskProfile];

  if (!inst || slPips <= 0 || balance <= 0) return null;

  var riskAmount  = (balance * profile.pct) / 100;
  var lotSize     = riskAmount / (slPips * inst.pipValue);
  var lotRounded  = Math.floor(lotSize * 100) / 100;   // floor to 2dp (conservative)
  var tpPips      = slPips * rrRatio;
  var potProfit   = tpPips * inst.pipValue * lotRounded;
  var dailyLimit  = (balance * 1) / 100;
  var maxTrades   = Math.floor(dailyLimit / riskAmount);
  var mavenFloor  = calcState.mavenStartBalance * 0.95;
  var bufferLeft  = balance - mavenFloor;

  return {
    riskAmount:  riskAmount,
    lotSize:     lotRounded,
    lotExact:    lotSize,
    tpPips:      tpPips,
    potProfit:   potProfit,
    dailyLimit:  dailyLimit,
    maxTrades:   maxTrades,
    mavenFloor:  mavenFloor,
    bufferLeft:  bufferLeft,
    isKillList:  inst.killList,
    pipLabel:    inst.pipLabel
  };
}

function renderCalculator() {
  var container = document.getElementById('calculatorApp');
  if (!container) return;

  var result   = calculateLotSize();
  var inst     = CALC_INSTRUMENTS[calcState.instrument];
  var profile  = RISK_PROFILES[calcState.riskProfile];
  var bal      = calcState.balance;

  // Build instrument options
  var instOptions = '';
  var keys = Object.keys(CALC_INSTRUMENTS);
  for (var k = 0; k < keys.length; k++) {
    var key = keys[k];
    var opt = CALC_INSTRUMENTS[key];
    instOptions += '<option value="' + escapeHTML(key) + '"' + (calcState.instrument === key ? ' selected' : '') + '>' + escapeHTML(opt.label) + '</option>';
  }

  // Build risk profile buttons
  var profileBtns = '';
  for (var p = 0; p < RISK_PROFILES.length; p++) {
    var prof = RISK_PROFILES[p];
    var isActive = calcState.riskProfile === p;
    var profileIdx = p;
    profileBtns += '<div onclick="selectProfile(' + profileIdx + ')" style="padding:12px;border-radius:var(--r-sm);border:1px solid ' + (isActive ? prof.color : 'var(--border)') + ';background:' + (isActive ? 'rgba(255,255,255,0.05)' : 'var(--bg-1)') + ';cursor:pointer;text-align:center;">';
    profileBtns += '<div style="font-family:var(--font-mono);font-size:0.65rem;color:var(--text-muted);margin-bottom:6px;">' + escapeHTML(prof.label) + '</div>';
    profileBtns += '<div style="font-family:var(--font-display);font-size:1.3rem;font-weight:600;color:' + prof.color + ';">' + prof.pct + '%</div>';
    profileBtns += '<div style="font-family:var(--font-mono);font-size:0.7rem;color:' + prof.color + ';margin-top:4px;">$' + ((bal * prof.pct) / 100).toFixed(2) + '</div>';
    profileBtns += '</div>';
  }

  // SL quick buttons
  var slPresets = inst.pipLabel === 'Points' ? [8, 12, 15, 20, 25] : [10, 15, 20, 25, 30];
  var slBtns = '';
  for (var s = 0; s < slPresets.length; s++) {
    var preset = slPresets[s];
    slBtns += '<button class="btn btn-sm ' + (calcState.slPips === preset ? 'btn-accent' : 'btn-outline') + '" onclick="setSlPips(' + preset + ')">' + preset + '</button>';
  }

  // Balance quick buttons
  var balPresets = [5000, 5174, 5200, 5500];
  var balBtns = '';
  for (var b = 0; b < balPresets.length; b++) {
    var bPreset = balPresets[b];
    balBtns += '<button class="btn btn-sm ' + (calcState.balance === bPreset ? 'btn-accent' : 'btn-outline') + '" onclick="setBalance(' + bPreset + ')">$' + bPreset.toLocaleString() + '</button>';
  }

  // Build result panel
  var resultHtml = '';
  if (!result) {
    resultHtml = '<div class="card"><div class="card-body" style="text-align:center;padding:60px;color:var(--text-muted);">Enter valid values to calculate.</div></div>';
  } else if (inst.killList) {
    resultHtml = '<div class="card" style="border-color:var(--red);">';
    resultHtml += '<div class="card-body" style="text-align:center;padding:60px 20px;">';
    resultHtml += '<div style="font-size:3.5rem;margin-bottom:16px;">❌</div>';
    resultHtml += '<div style="font-family:var(--font-display);font-size:1.4rem;font-weight:600;color:var(--red);margin-bottom:12px;">Kill List Instrument</div>';
    resultHtml += '<div style="font-size:0.9rem;color:var(--text-secondary);max-width:320px;margin:0 auto;">This instrument has negative expectancy from your live trade history. Do not calculate a size — remove it from your watchlist entirely.</div>';
    resultHtml += '</div></div>';
  } else {
    // Big lot size display
    resultHtml += '<div class="card" style="border-color:var(--accent-dim);margin-bottom:20px;">';
    resultHtml += '<div class="card-body" style="text-align:center;padding:40px 20px;">';
    resultHtml += '<div class="section-title" style="text-align:center;">Lot Size</div>';
    resultHtml += '<div style="font-family:var(--font-display);font-size:5.5rem;font-weight:600;color:var(--accent);line-height:1;">' + result.lotSize.toFixed(2) + '</div>';
    resultHtml += '<div style="font-family:var(--font-mono);font-size:0.8rem;color:var(--text-muted);margin-top:8px;">standard lots</div>';
    resultHtml += '<div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--text-muted);margin-top:4px;">exact: ' + result.lotExact.toFixed(4) + ' lots</div>';
    resultHtml += '</div></div>';

    // Stats grid
    resultHtml += '<div class="bento-grid" style="margin-bottom:20px; gap:16px;">';
    resultHtml += '<div class="col-6 stat-card red"><div class="stat-label">Risk Amount</div><div class="stat-value negative" style="font-size:1.4rem;">-$' + result.riskAmount.toFixed(2) + '</div><div class="stat-sub">' + profile.pct + '% of balance</div></div>';
    resultHtml += '<div class="col-6 stat-card green"><div class="stat-label">Potential Profit</div><div class="stat-value positive" style="font-size:1.4rem;">+$' + result.potProfit.toFixed(2) + '</div><div class="stat-sub">TP at ' + result.tpPips + ' ' + escapeHTML(result.pipLabel) + '</div></div>';
    resultHtml += '<div class="col-6 stat-card blue"><div class="stat-label">Daily Limit</div><div class="stat-value neutral" style="font-size:1.4rem;">$' + result.dailyLimit.toFixed(2) + '</div><div class="stat-sub">' + result.maxTrades + ' max full-risk trades today</div></div>';
    resultHtml += '<div class="col-6 stat-card accent"><div class="stat-label">Maven Buffer</div><div class="stat-value ' + (result.bufferLeft < 100 ? 'negative' : 'accent') + '" style="font-size:1.4rem;">$' + result.bufferLeft.toFixed(2) + '</div><div class="stat-sub">Floor at $' + result.mavenFloor.toFixed(2) + '</div></div>';
    resultHtml += '</div>';

    // Safety alert
    if (result.bufferLeft < 50) {
      resultHtml += '<div class="alert alert-red">';
      resultHtml += '<span class="alert-icon">🚨</span>';
      resultHtml += '<div class="alert-text"><strong>DANGER:</strong> Maven floor critically close. Use micro size or skip today.</div>';
      resultHtml += '</div>';
    } else {
      resultHtml += '<div class="alert alert-green">';
      resultHtml += '<span class="alert-icon">✅</span>';
      resultHtml += '<div class="alert-text"><strong>Safe to trade.</strong> ' + result.maxTrades + ' full-size losing trades remain before daily limit.</div>';
      resultHtml += '</div>';
    }
  }

  // Quick limits table
  var limitsHtml = '';
  var limitsData = [
    { label:'Max per trade (0.25%)', val:'$' + (bal * 0.0025).toFixed(2), color:'var(--red)' },
    { label:'Max daily loss (1%)',   val:'$' + (bal * 0.01).toFixed(2),   color:'var(--yellow)' },
    { label:'Maven floor (-5%)',     val:'$' + (calcState.mavenStartBalance * 0.95).toFixed(2), color:'var(--red)' },
    { label:'Maven target (+8%)',    val:'$' + (calcState.mavenStartBalance * 1.08).toFixed(2), color:'var(--green)' }
  ];
  for (var li = 0; li < limitsData.length; li++) {
    var lim = limitsData[li];
    limitsHtml += '<div class="list-item" style="padding:14px 20px;">';
    limitsHtml += '<span class="list-item-label">' + escapeHTML(lim.label) + '</span>';
    limitsHtml += '<span class="list-item-value" style="color:' + lim.color + ';">' + escapeHTML(lim.val) + '</span>';
    limitsHtml += '</div>';
  }

  container.innerHTML = '<div class="col-6 card">'
    +   '<div class="card-header"><span class="card-title">📏 Inputs</span></div>'
    +   '<div class="card-body" style="display:flex;flex-direction:column;gap:20px;">'

    // Balance
    +     '<div class="form-group">'
    +       '<label class="form-label">Account Balance (USD)</label>'
    +       '<input class="form-input large" type="number" id="calcBalance" value="' + calcState.balance + '" oninput="onBalanceInput(this.value)">'
    +       '<div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;">' + balBtns + '</div>'
    +     '</div>'

    // Instrument
    +     '<div class="form-group">'
    +       '<label class="form-label">Instrument</label>'
    +       '<select class="form-select" id="calcInstrument"' + (inst.killList ? ' style="border-color:var(--red);color:var(--red);"' : '') + ' onchange="onInstrumentChange(this.value)">' + instOptions + '</select>'
    +       '<div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--text-muted);margin-top:6px;">' + escapeHTML(inst.note) + '</div>'
    +       (inst.killList ? '<div class="alert alert-red" style="margin-top:12px;padding:12px;font-size:0.85rem;">❌ Kill list — negative expectancy. Do not trade.</div>' : '')
    +     '</div>'

    // SL
    +     '<div class="form-group">'
    +       '<label class="form-label">Stop Loss (' + escapeHTML(inst.pipLabel) + ')</label>'
    +       '<input class="form-input large" type="number" id="calcSL" value="' + calcState.slPips + '" oninput="onSlInput(this.value)">'
    +       '<div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;">' + slBtns + '</div>'
    +     '</div>'

    // Risk Profile
    +     '<div class="form-group">'
    +       '<label class="form-label">Risk Profile</label>'
    +       '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-top:6px;">' + profileBtns + '</div>'
    +       '<div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--text-muted);margin-top:8px;">' + escapeHTML(RISK_PROFILES[calcState.riskProfile].note) + '</div>'
    +     '</div>'

    // R:R Slider
    +     '<div class="form-group">'
    +       '<label class="form-label">Target R:R Ratio</label>'
    +       '<div style="display:flex;align-items:center;gap:16px;margin-top:6px;">'
    +         '<input type="range" min="1" max="5" step="0.5" value="' + calcState.rrRatio + '" oninput="onRRInput(this.value)" style="flex:1;accent-color:var(--green);">'
    +         '<span id="rrDisplay" style="font-family:var(--font-display);font-size:1.5rem;font-weight:600;color:var(--green);min-width:54px;">1:' + calcState.rrRatio + '</span>'
    +       '</div>'
    +       '<div style="display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:0.7rem;color:var(--text-muted);margin-top:8px;">'
    +         '<span>1:1</span><span>1:2</span><span>1:3</span><span>1:4</span><span>1:5</span>'
    +       '</div>'
    +     '</div>'

    +   '</div>'
    + '</div>'

    // === RIGHT: RESULT ===
    + '<div class="col-6">'
    +   resultHtml
    +   '<div class="card" style="margin-top:20px;">'
    +     '<div class="card-header"><span class="card-title">⚡ Quick Limits</span></div>'
    +     '<div>' + limitsHtml + '</div>'
    +   '</div>'
    + '</div>';
}

// --- Event handlers ---
function onBalanceInput(val) {
  calcState.balance = parseFloat(val) || 0;
  renderCalculator();
}
function setBalance(val) {
  calcState.balance = val;
  var el = document.getElementById('calcBalance');
  if (el) el.value = val;
  renderCalculator();
}
function onInstrumentChange(val) {
  calcState.instrument = val;
  renderCalculator();
}
function setSlPips(val) {
  calcState.slPips = val;
  var el = document.getElementById('calcSL');
  if (el) el.value = val;
  renderCalculator();
}
function onSlInput(val) {
  calcState.slPips = parseFloat(val) || 0;
  renderCalculator();
}
function selectProfile(idx) {
  calcState.riskProfile = idx;
  renderCalculator();
}
function onRRInput(val) {
  calcState.rrRatio = parseFloat(val);
  var el = document.getElementById('rrDisplay');
  if (el) el.textContent = '1:' + calcState.rrRatio;
  renderCalculator();
}

// --- Init ---
document.addEventListener('OchugiDataLoaded', function() {
  var userStr = localStorage.getItem('ochugi_user');
  var user = userStr ? JSON.parse(userStr) : {username: 'raymond'};
  var r = OCHUGI_DATA[user.username] || OCHUGI_DATA.raymond;
  
  calcState.balance = r.currentBalance;
  calcState.mavenStartBalance = r.mavenStartBalance;
  
  renderCalculator();
});

