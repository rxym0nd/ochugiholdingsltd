const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'ochugi_secret_key_2026_luxury_firm';

// Render allows wildcard CORS for APIs if needed, but specific is better if you know your Github Pages domain.
app.use(cors({ origin: '*' }));
app.use(express.json());

const db = new sqlite3.Database('./database.sqlite');

// Initial users for the firm
const users = {
  'raymond': { id: 1, password: 'password123', name: 'Raymond Ochieng', role: 'admin' },
  'elvis': { id: 2, password: 'password123', name: 'Elvis Ngugi', role: 'trader' }
};

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, message: 'Missing fields' });
  
  const user = users[username.toLowerCase()];
  
  if (user && user.password === password) {
    const token = jwt.sign({ id: user.id, username: username.toLowerCase(), role: user.role, name: user.name }, SECRET_KEY, { expiresIn: '8h' });
    res.json({ success: true, token, user: { name: user.name, role: user.role, username: username.toLowerCase() } });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Unauthorized: Missing Token' });
  
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden: Invalid Token' });
    req.user = user;
    next();
  });
};

app.get('/api/data', authenticateToken, (req, res) => {
  db.get("SELECT data FROM store WHERE id = 'OCHUGI_DATA'", (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) {
      res.json(JSON.parse(row.data));
    } else {
      res.status(404).json({ error: "Data not found" });
    }
  });
});

app.post('/api/data', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admins only' });
  }
  const dataString = JSON.stringify(req.body);
  db.run("INSERT OR REPLACE INTO store (id, data) VALUES ('OCHUGI_DATA', ?)", [dataString], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
