/* ============================================================
   OCHUGI HOLDINGS LTD — CENTRAL DATA FILE
   Updated: Now fetches data dynamically from the backend API.
   ============================================================ */

let OCHUGI_DATA = null;

// Helper functions that remain unchanged
function calcLotSize(balance, riskPct, slPips, pipValue) {
  const riskAmount = (balance * riskPct) / 100;
  return riskAmount / (slPips * pipValue);
}

function formatUSD(amount) {
  const abs = Math.abs(amount);
  const formatted = abs.toFixed(2);
  return (amount >= 0 ? '+$' : '-$') + formatted;
}

function formatPct(value) {
  return (value >= 0 ? '+' : '') + value.toFixed(2) + '%';
}

function getMavenColor(pct) {
  if (pct >= 80) return 'var(--green)';
  if (pct >= 50) return 'var(--gold)';
  return 'var(--blue)';
}

function getTodayEvents() {
  if (!OCHUGI_DATA || !OCHUGI_DATA.newsEvents) return [];
  const today = new Date().toISOString().split('T')[0];
  return OCHUGI_DATA.newsEvents.filter(e => e.date === today);
}

function getUpcomingEvents(days = 7) {
  if (!OCHUGI_DATA || !OCHUGI_DATA.newsEvents) return [];
  const today = new Date();
  const future = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
  return OCHUGI_DATA.newsEvents.filter(e => {
    const d = new Date(e.date);
    return d >= today && d <= future;
  });
}

function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatCurrency(num) {
  if (num === undefined || num === null) return '';
  return '$' + Number(num).toFixed(2);
}

function formatPNL(num) {
  if (num === undefined || num === null) return '';
  var n = Number(num);
  return (n > 0 ? '+$' : (n < 0 ? '-$' : '$')) + Math.abs(n).toFixed(2);
}

function formatPercent(num) {
  if (num === undefined || num === null) return '';
  return Number(num).toFixed(1) + '%';
}

// Fetch data from backend on load
const token = localStorage.getItem('ochugi_token');
if (!token) {
  window.location.href = 'login.html';
} else {
  fetch('http://localhost:3000/api/data', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => {
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('ochugi_token');
        window.location.href = 'login.html';
        throw new Error('Unauthorized');
      }
      return res.json();
    })
    .then(data => {
      OCHUGI_DATA = data;
      // Dispatch custom event to notify all scripts that data is ready
      document.dispatchEvent(new Event('OchugiDataLoaded'));
    })
    .catch(err => {
      console.error('Failed to load OCHUGI_DATA from backend:', err);
      if (err.message !== 'Unauthorized') {
        document.body.innerHTML = '<div style="color:white; padding: 2rem;"><h2>Backend Connection Failed</h2><p>Please ensure the backend server is running at localhost:3000</p></div>';
      }
    });
}
