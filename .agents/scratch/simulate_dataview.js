const fs = require('fs');
const path = require('path');

const vaultDir = 'C:\\Users\\kazam\\Desktop\\App\\movie-booking-site\\movie-site';

function getFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const fmText = match[1];
  const fm = {};
  fmText.split('\n').forEach(line => {
    const parts = line.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join(':').trim().replace(/^['"]|['"]$/g, '');
      fm[key] = value;
    }
  });
  return fm;
}

try {
  const files = fs.readdirSync(vaultDir);
  const tableRows = [];

  for (const file of files) {
    if (path.extname(file) !== '.md') continue;
    const filePath = path.join(vaultDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const fm = getFrontmatter(content);
    
    // Check if it has #skill or type: skill
    const hasSkillTag = content.includes('#skill') || (fm.tags && fm.tags.includes('#skill'));
    const isSkillType = fm.type === 'skill';

    if (isSkillType || hasSkillTag) {
      tableRows.push({
        file: file,
        type: fm.type || 'skill',
        status: fm.status || 'Active',
        folder: '/'
      });
    }
  }

  // Sort by file name
  tableRows.sort((a, b) => a.file.localeCompare(b.file));

  console.log('| קובץ (File) | סוג (Type) | סטטוס (Status) | מיקום ב-Vault (Folder) |');
  console.log('| --- | --- | --- | --- |');
  tableRows.forEach(row => {
    console.log(`| [${row.file}](${row.file}) | ${row.type} | ${row.status} | ${row.folder} |`);
  });

} catch (e) {
  console.error(e);
}
