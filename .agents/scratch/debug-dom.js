const { chromium } = require('playwright');
const fs = require('fs');

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { timeout: 30000 });
    
    // Wait for content
    console.log('Waiting for content to load...');
    await page.waitForTimeout(10000);
    
    const content = await page.content();
    fs.writeFileSync('dom-dump.html', content);
    console.log('DOM dump saved to dom-dump.html');
    
    const metrics = await page.evaluate(() => {
      const movieLinks = Array.from(document.querySelectorAll('[data-testid="movie-link"]'));
      return movieLinks.map(link => {
        const style = window.getComputedStyle(link);
        const rect = link.getBoundingClientRect();
        return {
          href: link.getAttribute('href'),
          opacity: style.opacity,
          visibility: style.visibility,
          display: style.display,
          rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
          parentOpacity: window.getComputedStyle(link.parentElement).opacity,
          grandparentOpacity: window.getComputedStyle(link.parentElement.parentElement).opacity
        };
      });
    });
    
    fs.writeFileSync('dom-metrics.json', JSON.stringify(metrics, null, 2));
    console.log('Metrics saved to dom-metrics.json. Found ' + metrics.length + ' links.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await browser.close();
  }
}

run();
