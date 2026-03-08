/* ============================================================
   OCHUGI HOLDINGS LTD — POSITION SIZE CALCULATOR
   ============================================================ */

const CALC_INSTRUMENTS = {
  XAUUSD: { label: "Gold (XAU/USD) 🥇",      pipValue: 1.0,  pipLabel: "Points", killList: false },
  GBPUSD: { label: "GBP/USD 💷",             pipValue: 10,   pipLabel: "Pips",   killList: false },
  EURUSD: { label: "EUR/USD 💶",             pipValue: 10,   pipLabel: "Pips",   killList: false },
  GBPNZD: { label: "GBP/NZD 🥝",            pipValue: 6.2,  pipLabel: "Pips",   killList: false },
  GBPJPY: { label: "GBP/JPY 🇯🇵",           pipValue: 6.8,  pipLabel: "Pips",   killList: false },
  USDCHF: { label: "USD/CHF 🇨🇭",           pipValue: 11.2, pipLabel: "Pips",   killList: false },
  AUDUSD: { label: "AUD/USD 🦘",            pipValue: 10,   pipLabel: "Pips",   killList: false },
  EURJPY: { label: "EUR/JPY",               pipValue: 6.8,  pipLabel: "Pips",   killList: false },
  GER30:  { label: "GER30 (DAX) 📊",        pipValue: 1.0,  pipLabel: "Points", killList: false },
  USDJPY: { label: "USD/JPY ❌ KILL LIST",  pipValue: 6.8,  pipLabel: "Pips",   killList: true  },
  AUDCAD: { label: "AUD/CAD ❌ KILL LIST",  pipValue: 7.3,  pipLabel: "Pips",   killList: true  },
  US30:   { label: "US30 ❌ KILL LIST",     pipValue: 1.0,  pipLabel: "Points", killList: true  },
  BTCUSD: { label: "BTC/USD ❌ KILL LIST",  pipValue: 1.0,  pipLabel: "Points", killList: true  }
};

const RISK_PROFILES = [
  { label: "Full Risk",      pct: 0.25, color: "var(--green)",  note: "A-grade setup (score 8+)" },
  { label: "Reduced",        pct: 0.15, color: "var(--yellow)", note: "Good setup (score 6–7)" },
  { label: "Micro",          pct: 0.10, color: "var(--blue)",   note: "Uncertain (test size)" }
];

let calcState = {
  balance: 5174,
  instrument: "XAUUSD",
  slPips: 15,
  rrRatio: 2,
  riskProfile: 0
};

/* ─── MAIN CALCULATE FUNCTION ──────────────────────────────────── */
function calculate() {
  const { balance, instrument, slPips, rrRatio, riskProfile } = calcState;
  const inst = CALC_INSTRUMENTS[instrument];
  const profile = RISK_PROFILES[riskProfile];

  if (!inst || slPips <= 0 || balance <= 0) return null;

  const riskAmount  = (balance * profile.pct) / 100;
  const lotSize     = riskAmount / (slPips * inst.pipValue);
  const lotRounded  = Math.floor(lotSize * 100) / 100;
  const tpPips      = slPips * rrRatio;
  const potProfit   = tpPips * inst.pipValue * lotRounded;
  const dailyLimit  = (balance * 1) / 100;
  const maxTrades   = Math.floor(dailyLimit / riskAmount);
  const mavenFloor  = OCHUGI_DATA.raymond.mavenStartBalance * 0.95;
  const bufferLeft  = balance - mavenFloor;

  return {
    riskAmount,
    lotSize: lotRounded,
    tpPips,
    potProfit,
    dailyLimit,
    maxTrades,
    mavenFloor,
    bufferLeft,
    isKillList: inst.killList,
    pipLabel: inst.pipLabel
  };
}

/* ─── RENDER CALCULATOR ────────────────────────────────────────── */
function renderCalculator() {
  const container = document.getElementById('calculatorApp');
  if (!container) return;

  const result = calculate();
  const inst = CALC_INSTRUMENTS[calcState.instrument];
  const profile = RISK_PROFILES[calcState.riskProfile];

  container.innerHTML = `
    <div class="calc-grid">

      <!-- INPUTS -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">📐 Inputs</span>
        </div>
        <div class="card-body" style="display:flex;flex-direction:column;gap:16px;">

          <!-- Balance -->
          <div class="form-group">
            <label class="form-label">Account Balance (USD)</label>
            <input class="form-input large" type="number" id="calcBalance"
                   value="${calcState.balance}"
                   oninput="calcState.balance=parseFloat(this.value)||0; renderCalculator()">
            <div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap;">
              ${[5000, 5174, 5200, 5500].map(v => `
                <button class="btn btn-sm ${calcState.balance==v?'btn-gold':'btn-outline'}"
                        onclick="calcState.balance=${v};document.getElementById('calcBalance').value=${v};renderCalculator()">
                  $${v.toLocaleString()}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Instrument -->
          <div class="form-group">
            <label class="form-label">Instrument</label>
            <select class="form-select" id="calcInstrument"
                    style="${inst.killList ? 'border-color:var(--red);color:var(--red)' : ''}"
                    onchange="calcState.instrument=this.value;renderCalculator()">
              ${Object.entries(CALC_INSTRUMENTS).map(([k,v]) => `
                <option value="${k}" ${calcState.instrument===k?'selected':''}>${v.label}</option>
              `).join('')}
            </select>
            ${inst.killList ? `
              <div class="alert alert-danger" style="margin-top:8px;padding:8px 12px;font-size:0.78rem;">
                ❌ Kill list instrument — negative expectancy. Do not trade.
              </div>` : ''}
          </div>

          <!-- SL Pips -->
          <div class="form-group">
            <label class="form-label">Stop Loss (${inst.pipLabel})</label>
            <input class="form-input large" type="number" id="calcSL"
                   value="${calcState.slPips}"
                   oninput="calcState.slPips=parseFloat(this.value)||0;renderCalculator()">
            <div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap;">
              ${(inst.pipLabel === 'Points' ? [8,12,15,20,25] : [10,15,20,25,30]).map(v => `
                <button class="btn btn-sm ${calcState.slPips==v?'btn-gold':'btn-outline'}"
                        onclick="calcState.slPips=${v};document.getElementById('calcSL').value=${v};renderCalculator()">
                  ${v}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Risk Profile -->
          <div class="form-group">
            <label class="form-label">Risk Profile</label>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:4px;">
              ${RISK_PROFILES.map((p, i) => `
                <div onclick="calcState.riskProfile=${i};renderCalculator()"
                     style="padding:10px;border-radius:8px;border:1px solid ${calcState.riskProfile===i ? p.color : 'var(--border)'};
                            background:${calcState.riskProfile===i ? 'rgba(255,255,255,0.05)' : 'var(--bg-deep)'};
                            cursor:pointer;text-align:center;">
                  <div style="font-family:var(--font-mono);font-size:0.6rem;color:var(--text-muted);margin-bottom:4px;">${p.label}</div>
                  <div style="font-family:var(--font-display);font-size:1.1rem;font-weight:700;color:${p.color};">${p.pct}%</div>
                  <div style="font-family:var(--font-mono);font-size:0.6rem;color:${p.color};margin-top:2px;">$${((calcState.balance*p.pct)/100).toFixed(2)}</div>
                </div>
              `).join('')}
            </div>
            <div style="font-family:var(--font-mono);font-size:0.65rem;color:var(--text-muted);margin-top:6px;">
              ${RISK_PROFILES[calcState.riskProfile].note}
            </div>
          </div>

          <!-- R:R -->
          <div class="form-group">
            <label class="form-label">Target R:R Ratio</label>
            <div style="display:flex;align-items:center;gap:12px;margin-top:4px;">
              <input type="range" min="1" max="5" step="0.5"
                     value="${calcState.rrRatio}"
                     oninput="calcState.rrRatio=parseFloat(this.value);renderCalculator()"
                     style="flex:1;accent-color:var(--green);">
              <span style="font-family:var(--font-display);font-size:1.3rem;font-weight:700;color:var(--green);min-width:40px;">
                1:${calcState.rrRatio}
              </span>
            </div>
            <div style="display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:0.6rem;color:var(--text-muted);margin-top:4px;">
              <span>1:1</span><span>1:2</span><span>1:3</span><span>1:4</span><span>1:5</span>
            </div>
          </div>

        </div>
      </div>

      <!-- RESULT -->
      <div>
        ${!result ? '' : inst.killList ? `
          <div class="card" style="border-color:var(--red);">
            <div class="card-body" style="text-align:center;padding:40px;">
              <div style="font-size:3rem;margin-bottom:12px;">❌</div>
              <div style="font-family:var(--font-display);font-size:1.2rem;font-weight:700;color:var(--red);margin-bottom:8px;">Kill List Instrument</div>
              <div style="font-size:0.82rem;color:var(--text-secondary);">This instrument has negative expectancy based on your live trade history. Do not calculate a size for it — remove it from your watchlist.</div>
            </div>
          </div>
        ` : `
          <!-- LOT SIZE RESULT -->
          <div class="card" style="border-color:var(--gold-dim);margin-bottom:16px;">
            <div class="card-body" style="text-align:center;padding:28px 20px;">
              <div class="section-title" style="text-align:center;">Lot Size</div>
              <div style="font-family:var(--font-display);font-size:4rem;font-weight:800;color:var(--gold);line-height:1;">
                ${result.lotSize.toFixed(2)}
              </div>
              <div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--text-muted);margin-top:4px;">lots</div>
            </div>
          </div>

          <!-- STATS GRID -->
          <div class="grid-2" style="margin-bottom:16px;">
            <div class="stat-card red">
              <div class="stat-label">Risk Amount</div>
              <div class="stat-value negative" style="font-size:1.3rem;">-$${result.riskAmount.toFixed(2)}</div>
              <div class="stat-sub">${profile.pct}% of balance</div>
            </div>
            <div class="stat-card green">
              <div class="stat-label">Potential Profit</div>
              <div class="stat-value positive" style="font-size:1.3rem;">+$${result.potProfit.toFixed(2)}</div>
              <div class="stat-sub">TP at ${result.tpPips} ${result.pipLabel}</div>
            </div>
            <div class="stat-card blue">
              <div class="stat-label">Daily Limit</div>
              <div class="stat-value neutral" style="font-size:1.3rem;">$${result.dailyLimit.toFixed(2)}</div>
              <div class="stat-sub">${result.maxTrades} max losing trades today</div>
            </div>
            <div class="stat-card gold">
              <div class="stat-label">Maven Floor Buffer</div>
              <div class="stat-value ${result.bufferLeft < 100 ? 'negative' : 'gold'}" style="font-size:1.3rem;">$${result.bufferLeft.toFixed(2)}</div>
              <div class="stat-sub">Floor at $${result.mavenFloor.toFixed(2)}</div>
            </div>
          </div>

          <!-- SAFETY CHECK -->
          <div class="alert ${result.bufferLeft < 50 ? 'alert-danger' : 'alert-success'}">
            <span class="alert-icon">${result.bufferLeft < 50 ? '🚨' : '✅'}</span>
            <div class="alert-text">
              ${result.bufferLeft < 50
                ? '<strong>DANGER:</strong> Maven floor critically close. Reduce to micro size or skip today.'
                : `<strong>Safe to trade.</strong> ${result.maxTrades} full-size losing trades remain before daily limit.`}
            </div>
          </div>
        `}

        <!-- QUICK REFERENCE -->
        <div class="card" style="margin-top:16px;">
          <div class="card-header">
            <span class="card-title">⚡ Quick Limits</span>
          </div>
          <div class="card-body" style="padding:0;">
            ${[
              { label: "Max per trade (0.25%)", val: `$${((calcState.balance*0.0025)).toFixed(2)}`, color: "var(--red)" },
              { label: "Max daily loss (1%)",   val: `$${((calcState.balance*0.01)).toFixed(2)}`,  color: "var(--yellow)" },
              { label: "Maven floor (−5%)",     val: `$${(OCHUGI_DATA.raymond.mavenStartBalance*0.95).toFixed(2)}`,  color: "var(--red)" },
              { label: "Maven target (+8%)",    val: `$${(OCHUGI_DATA.raymond.mavenStartBalance*1.08).toFixed(2)}`,  color: "var(--green)" }
            ].map(item => `
              <div class="list-item" style="padding:10px 20px;">
                <span class="list-item-label">${item.label}</span>
                <span class="list-item-value" style="color:${item.color};">${item.val}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

    </div>
  `;
}

/* ─── INIT ──────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `.calc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; } @media(max-width:900px){.calc-grid{grid-template-columns:1fr;}}`;
  document.head.appendChild(style);
  renderCalculator();
});
