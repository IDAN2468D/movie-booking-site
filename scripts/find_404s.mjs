import { chromium } from '@playwright/test';

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  
  const failedRequests = [];
  page.on('response', res => {
    if (res.status() >= 400) {
      failedRequests.push({ url: res.url(), status: res.status() });
    }
  });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  console.log('Failed Requests:', JSON.stringify(failedRequests, null, 2));
  console.log('Console Errors:', JSON.stringify(consoleErrors, null, 2));

  await browser.close();
}

main().catch(console.error);
