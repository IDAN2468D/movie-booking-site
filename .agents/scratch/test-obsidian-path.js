const fs = require('fs');
const path = require('path');

const commonDirs = [
  'C:\\Users\\kazam\\Desktop',
  'C:\\Users\\kazam\\Documents',
  'C:\\Users\\kazam\\Desktop\\App',
  'C:\\Users\\kazam\\Desktop\\App\\movie-booking-site',
];

function findInDir(dir, filter) {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      let stat;
      try {
        stat = fs.statSync(fullPath);
      } catch (e) {
        continue;
      }
      if (stat.isDirectory()) {
        if (file === 'node_modules' || file === '.git' || file === '.next') continue;
        const found = findInDir(fullPath, filter);
        if (found) return found;
      } else if (file === filter) {
        return fullPath;
      }
    }
  } catch (e) {}
  return null;
}

for (const dir of commonDirs) {
  console.log('Searching in:', dir);
  const found = findInDir(dir, 'UI_DesignSystem.md');
  if (found) {
    console.log('FOUND:', found);
    break;
  }
}
