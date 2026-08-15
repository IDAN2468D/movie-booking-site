import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const port = process.argv[2] || '3001';
const preset = process.argv[3] || 'desktop';
const url = `http://localhost:${port}/`;
const reportPath = path.resolve(projectRoot, `lighthouse-report-${preset}.json`);

console.log(`Running Lighthouse Audit on ${url} (preset: ${preset}) ...`);

try {
  // Set chrome binary path
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const customUserDataDir = path.resolve(projectRoot, '.chrome-temp-profile');
  
  if (!fs.existsSync(customUserDataDir)) {
    fs.mkdirSync(customUserDataDir, { recursive: true });
  }

  const presetFlag = preset === 'desktop' ? '--preset=desktop' : '';
  const cmd = `npx --yes lighthouse "${url}" ${presetFlag} --chrome-flags="--headless=new --no-sandbox --disable-gpu --user-data-dir=\\"${customUserDataDir}\\"" --output=json --output-path="${reportPath}" --quiet --only-categories=accessibility,best-practices,seo,performance`;
  
  execSync(cmd, {
    cwd: projectRoot,
    env: { ...process.env, CHROME_PATH: chromePath },
    stdio: 'inherit',
    timeout: 120000
  });

  console.log('Lighthouse run finished. Parsing report...');
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

  console.log('\n========================================');
  console.log('       LIGHTHOUSE AUDIT RESULTS        ');
  console.log('========================================');

  let all100 = true;
  for (const [catKey, cat] of Object.entries(report.categories || {})) {
    const score = Math.round((cat.score || 0) * 100);
    console.log(`${cat.title.padEnd(20)}: ${score} / 100`);
    if (score < 100) all100 = false;
  }
  console.log('========================================\n');

  if (!all100) {
    console.log('Audits below 100:');
    for (const [auditKey, audit] of Object.entries(report.audits || {})) {
      if (audit.score !== null && audit.score < 1) {
        console.log(`- [${audit.scoreDisplayMode || 'FAIL'}] ${auditKey}: ${audit.title} (score: ${audit.score})`);
        if (audit.displayValue) console.log(`    Value: ${audit.displayValue}`);
        if (audit.explanation) console.log(`    Explanation: ${audit.explanation}`);
      }
    }
  }

} catch (err) {
  console.error('Lighthouse runner encountered error/warning:', err.message);
  if (fs.existsSync(reportPath)) {
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    console.log('\n--- SCORES FROM GENERATED REPORT ---');
    for (const [catKey, cat] of Object.entries(report.categories || {})) {
      console.log(`${cat.title}: ${Math.round((cat.score || 0) * 100)} / 100`);
    }
  }
}
