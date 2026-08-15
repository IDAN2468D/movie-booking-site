import { chromium } from '@playwright/test';

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'load' });
  await page.waitForTimeout(2000);

  const missingButtonLabels = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).filter(btn => {
      const text = (btn.innerText || '').trim();
      const ariaLabel = btn.getAttribute('aria-label');
      const ariaLabelledby = btn.getAttribute('aria-labelledby');
      const title = btn.getAttribute('title');
      return !text && !ariaLabel && !ariaLabelledby && !title;
    }).map(btn => ({
      tagName: btn.tagName,
      className: btn.className,
      outerHTML: btn.outerHTML.slice(0, 200),
      parentHTML: btn.parentElement?.outerHTML.slice(0, 200),
    }));
  });

  const missingLinkLabels = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a')).filter(a => {
      const text = (a.innerText || '').trim();
      const ariaLabel = a.getAttribute('aria-label');
      const ariaLabelledby = a.getAttribute('aria-labelledby');
      const title = a.getAttribute('title');
      return !text && !ariaLabel && !ariaLabelledby && !title;
    }).map(a => ({
      href: a.getAttribute('href'),
      className: a.className,
      outerHTML: a.outerHTML.slice(0, 200),
    }));
  });

  const contrastIssues = await page.evaluate(() => {
    const el = document.querySelector('span.text-lg.md\\:text-xl.font-black.font-display');
    return el ? {
      text: el.innerText,
      className: el.className,
      outerHTML: el.outerHTML,
      color: window.getComputedStyle(el).color,
      backgroundColor: window.getComputedStyle(el.parentElement).backgroundColor
    } : null;
  });

  console.log('--- MISSING BUTTON LABELS (' + missingButtonLabels.length + ') ---');
  console.log(JSON.stringify(missingButtonLabels, null, 2));

  console.log('\n--- MISSING LINK LABELS (' + missingLinkLabels.length + ') ---');
  console.log(JSON.stringify(missingLinkLabels, null, 2));

  console.log('\n--- CONTRAST ISSUE ELEMENT ---');
  console.log(JSON.stringify(contrastIssues, null, 2));

  await browser.close();
}

main().catch(console.error);
