import { chromium } from '@playwright/test';

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  
  const consoleMessages = [];
  page.on('console', msg => consoleMessages.push({ type: msg.type(), text: msg.text() }));
  
  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err.message));

  console.log('Navigating to http://localhost:3000 ...');
  const response = await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  console.log('Status:', response?.status());

  // Evaluate DOM metrics, headings, images, forms, ARIA, SEO meta tags
  const evaluation = await page.evaluate(() => {
    const title = document.title;
    const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content');
    const h1s = Array.from(document.querySelectorAll('h1')).map(h => ({ text: h.innerText.trim(), html: h.outerHTML.slice(0, 100) }));
    const h2s = Array.from(document.querySelectorAll('h2')).map(h => ({ text: h.innerText.trim() }));
    const images = Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src.slice(0, 80),
      alt: img.getAttribute('alt'),
      hasAlt: img.hasAttribute('alt'),
      loading: img.getAttribute('loading'),
      width: img.naturalWidth || img.width,
      height: img.naturalHeight || img.height,
      outerHTML: img.outerHTML.slice(0, 120)
    }));
    const buttonsWithoutLabel = Array.from(document.querySelectorAll('button')).filter(btn => {
      const text = btn.innerText.trim();
      const ariaLabel = btn.getAttribute('aria-label');
      const ariaLabelledby = btn.getAttribute('aria-labelledby');
      const title = btn.getAttribute('title');
      return !text && !ariaLabel && !ariaLabelledby && !title;
    }).map(b => b.outerHTML.slice(0, 150));
    
    const linksWithoutText = Array.from(document.querySelectorAll('a')).filter(a => {
      const text = a.innerText.trim();
      const ariaLabel = a.getAttribute('aria-label');
      const title = a.getAttribute('title');
      return !text && !ariaLabel && !title;
    }).map(a => a.outerHTML.slice(0, 150));

    const htmlLang = document.documentElement.getAttribute('lang');
    const htmlDir = document.documentElement.getAttribute('dir');
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
    const viewport = document.querySelector('meta[name="viewport"]')?.getAttribute('content');

    return {
      title,
      metaDesc,
      viewport,
      htmlLang,
      htmlDir,
      canonical,
      h1Count: h1s.length,
      h1s,
      h2Count: h2s.length,
      h2s,
      totalImages: images.length,
      imagesWithoutAlt: images.filter(i => !i.hasAlt || i.alt === null),
      buttonsWithoutLabelCount: buttonsWithoutLabel.length,
      buttonsWithoutLabel,
      linksWithoutTextCount: linksWithoutText.length,
      linksWithoutText,
    };
  });

  console.log('--- EVALUATION REPORT ---');
  console.log(JSON.stringify(evaluation, null, 2));
  console.log('--- CONSOLE MESSAGES (' + consoleMessages.length + ') ---');
  console.log(JSON.stringify(consoleMessages.filter(m => m.type === 'error' || m.type === 'warning'), null, 2));
  console.log('--- PAGE ERRORS (' + pageErrors.length + ') ---');
  console.log(JSON.stringify(pageErrors, null, 2));

  await browser.close();
}

main().catch(console.error);
