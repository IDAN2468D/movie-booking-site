import fs from 'fs';
import path from 'path';

const report = JSON.parse(fs.readFileSync('./lighthouse-report.json', 'utf8'));

console.log('--- METRICS ---');
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

console.log('\n--- OPPORTUNITIES & DIAGNOSTICS ---');
for (const [k, a] of Object.entries(report.audits)) {
  if (a.details && (a.details.type === 'opportunity' || a.details.overallSavingsMs > 0 || a.details.overallSavingsBytes > 0)) {
    console.log(`[${k}] ${a.title}: savings ${a.details.overallSavingsMs || 0}ms / ${Math.round((a.details.overallSavingsBytes || 0) / 1024)}KB`);
  }
}
