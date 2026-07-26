import { chromium } from 'playwright';
import fs from 'fs';

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  
  // Wait for content
  await page.waitForTimeout(5000);
  
  const content = await page.content();
  fs.writeFileSync('dom-dump.html', content);
  
  const metrics = await page.evaluate(() => {
    const movieLinks = Array.from(document.querySelectorAll('[data-testid="movie-link"]'));
    return movieLinks.map(link => {
      const style = window.getComputedStyle(link);
      const rect = link.getBoundingClientRect();
      return {
        id: link.getAttribute('href'),
        opacity: style.opacity,
        visibility: style.visibility,
        display: style.display,
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        parentOpacity: window.getComputedStyle(link.parentElement!).opacity
      };
    });
  });
  
  fs.writeFileSync('dom-metrics.json', JSON.stringify(metrics, null, 2));
  
  await browser.close();
}

run();
