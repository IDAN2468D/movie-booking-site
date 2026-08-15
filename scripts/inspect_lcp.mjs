import fs from 'fs';
const report = JSON.parse(fs.readFileSync('./lighthouse-report.json', 'utf8'));

for (const [k, v] of Object.entries(report.audits)) {
  if (k.includes('lcp') || k.includes('largest-contentful-paint') || k.includes('layout-shift') || k.includes('cls') || k.includes('tbt') || k.includes('long-tasks')) {
    console.log(`=== ${k} ===`);
    console.dir(v.details?.items || v.details || v.displayValue, { depth: 4 });
  }
}
