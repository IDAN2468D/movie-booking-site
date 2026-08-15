import fs from 'fs';

try {
  const data = JSON.parse(fs.readFileSync('./lighthouse-report.json', 'utf8'));
  console.log('=== LIGHTHOUSE CATEGORY SCORES ===');
  for (const [catName, catData] of Object.entries(data.categories || {})) {
    console.log(`${catData.title} (${catName}): ${Math.round((catData.score || 0) * 100)} / 100`);
  }

  console.log('\n=== FAILED AUDITS / WARNINGS ===');
  for (const [auditId, audit] of Object.entries(data.audits || {})) {
    if (audit.score !== null && audit.score < 1) {
      console.log(`[${audit.scoreDisplayMode || 'FAIL'}] ${auditId}: score=${audit.score} - ${audit.title}`);
      if (audit.displayValue) console.log(`   Display: ${audit.displayValue}`);
      if (audit.explanation) console.log(`   Explanation: ${audit.explanation}`);
      if (audit.details?.items?.length) {
        console.log(`   Items (${audit.details.items.length}):`, JSON.stringify(audit.details.items.slice(0, 3), null, 2));
      }
    }
  }
} catch (e) {
  console.error('Error parsing lighthouse report:', e.message);
}
