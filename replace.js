const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === 'backend' || file === '.git') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      replaceInDir(fullPath);
    } else if (file.endsWith('.html') || file.endsWith('.js')) {
      if (file === 'data.js') continue;
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('OchugiDataLoaded')) {
        content = content.replace(/OchugiDataLoaded/g, 'OchugiDataLoaded');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Replaced in ${fullPath}`);
      }
    }
  }
}

replaceInDir(__dirname);
