import fs from 'fs';
import path from 'path';

function resolveConflicts(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      resolveConflicts(fullPath);
    } else if (file.match(/\.(js|jsx|css|html)$/)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('<<<<<<< HEAD')) {
        // Replace conflict markers with HEAD content
        const resolvedContent = content.replace(/<<<<<<< HEAD\r?\n([\s\S]*?)=======\r?\n[\s\S]*?>>>>>>>[^\n]*\r?\n?/g, '$1');
        if (content !== resolvedContent) {
           fs.writeFileSync(fullPath, resolvedContent, 'utf8');
           console.log(`Resolved: ${fullPath}`);
        }
      }
    }
  }
}

resolveConflicts(path.join(process.cwd(), 'src'));
