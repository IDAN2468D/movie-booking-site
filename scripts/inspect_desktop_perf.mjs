import fs from 'fs';

const report = JSON.parse(fs.readFileSync('./lighthouse-report-desktop.json', 'utf8'));

console.log('=== DESKTOP METRICS ===');
const metrics = [
  'first-contentful-paint',
  'largest-contentful-paint',
  'total-blocking-time',
  'cumulative-layout-shift',
  'speed-index',
  'interactive'
];

for (const m of metrics) {
  const a = report.audits[m];
  if (a) {
    console.log(`${a.title}: ${a.displayValue} (score: ${a.score})`);
  }
}

console.log('\n=== AUDITS BELOW 1.0 IN PERFORMANCE ===');
for (const [k, a] of Object.entries(report.audits)) {
  if (report.categories.performance.auditRefs.some(ref => ref.id === k) && a.score !== null && a.score < 1) {
    console.log(`[${k}] ${a.title}: ${a.displayValue || a.score}`);
  }
}
