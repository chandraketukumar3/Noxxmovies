const fs = require('fs');
const path = require('path');

function findConflicts(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findConflicts(fullPath);
    } else if (file.match(/\.(js|jsx|css|html)$/)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('<<<<<<< HEAD')) {
        console.log(fullPath);
      }
    }
  }
}

findConflicts(path.join(__dirname, 'src'));
