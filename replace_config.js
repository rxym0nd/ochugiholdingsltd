const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const p = path.join(dir, file);
  let content = fs.readFileSync(p, 'utf8');
  if (content.includes('<script src="js/data.js"></script>') && !content.includes('<script src="js/config.js"></script>')) {
    content = content.replace('<script src="js/data.js"></script>', '<script src="js/config.js"></script>\n<script src="js/data.js"></script>');
    fs.writeFileSync(p, content, 'utf8');
  }
});
console.log('Replaced in ' + files.length + ' files');
