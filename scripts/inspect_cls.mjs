import fs from 'fs';
const report = JSON.parse(fs.readFileSync('./lighthouse-report-desktop.json', 'utf8'));

for (const [k, v] of Object.entries(report.audits)) {
  if (k.includes('shift') || k.includes('cls')) {
    console.log(`=== ${k} ===`);
    console.dir(v.details?.items || v.details || v.displayValue, { depth: 5 });
  }
}
