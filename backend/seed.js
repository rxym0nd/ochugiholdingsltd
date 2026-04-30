const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Read data.js
let dataJs = fs.readFileSync('../js/data.js', 'utf8');

// The file defines `const OCHUGI_DATA = { ... };`
// We will replace `const OCHUGI_DATA = ` with `module.exports = `
dataJs = dataJs.replace(/const OCHUGI_DATA\s*=\s*/, 'module.exports = ');

fs.writeFileSync('./temp_data.js', dataJs);

const OCHUGI_DATA = require('./temp_data');

const db = new sqlite3.Database('./database.sqlite');
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS store (id TEXT PRIMARY KEY, data TEXT)");
  const stmt = db.prepare("INSERT OR REPLACE INTO store (id, data) VALUES ('OCHUGI_DATA', ?)");
  stmt.run(JSON.stringify(OCHUGI_DATA), (err) => {
    if(err) console.error(err);
    else console.log('Database seeded successfully with OCHUGI_DATA.');
    
    fs.unlinkSync('./temp_data.js');
    db.close();
  });
});
