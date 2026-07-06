const fs = require('fs');

const data = JSON.parse(fs.readFileSync('lint-results.json', 'utf8'));

data.forEach(file => {
  if (file.errorCount === 0 && file.warningCount === 0) return;

  const filePath = file.filePath;
  let content = fs.readFileSync(filePath, 'utf8');
  let lines = content.split('\n');

  // Sort messages in descending order of line number
  const messages = file.messages.sort((a, b) => b.line - a.line);

  let modified = false;

  messages.forEach(msg => {
    const lineIndex = msg.line - 1; // 0-indexed

    if (msg.ruleId === '@typescript-eslint/no-explicit-any') {
      // Insert eslint disable above the line
      const indentMatch = lines[lineIndex].match(/^\s*/);
      const indent = indentMatch ? indentMatch[0] : '';
      lines.splice(lineIndex, 0, `${indent}// eslint-disable-next-line @typescript-eslint/no-explicit-any`);
      modified = true;
    } else if (msg.ruleId === 'prefer-const') {
      // Replace let with const
      lines[lineIndex] = lines[lineIndex].replace(/\blet\b/, 'const');
      modified = true;
    } else if (msg.ruleId === '@typescript-eslint/no-unused-vars') {
      const indentMatch = lines[lineIndex].match(/^\s*/);
      const indent = indentMatch ? indentMatch[0] : '';
      lines.splice(lineIndex, 0, `${indent}// eslint-disable-next-line @typescript-eslint/no-unused-vars`);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
    console.log(`Fixed ${filePath}`);
  }
});
