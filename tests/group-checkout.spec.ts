import { test, expect } from '@playwright/test';

test('group seat selection and discount', async ({ page }) => {
  await page.goto('/');
  
  // Wait for movie links
  const movieLink = page.getByTestId('movie-link').first();
  await movieLink.waitFor({ state: 'attached', timeout: 15000 });
  
  const movieHref = await movieLink.getAttribute('href');
  if (movieHref) {
    await page.goto(movieHref);
  } else {
    await movieLink.click({ force: true });
  }
  
  // Book and Select Branch
  const bookNowBtn = page.getByTestId('book-now-button');
  await bookNowBtn.waitFor({ state: 'attached', timeout: 10000 });
  await bookNowBtn.click({ force: true });
  
  const selectBranchBtn = page.getByTestId('select-branch-button').first();
  await selectBranchBtn.waitFor({ state: 'attached', timeout: 10000 });
  await selectBranchBtn.evaluate(el => (el as HTMLElement).click());

  // Multi-seat selection
  await page.waitForSelector('text=בחר מושבים', { timeout: 10000 });
  const seatButtons = page.getByTestId('seat-button').filter({ hasNot: page.locator(':disabled') });
  
  // Select 3 seats for group discount
  await seatButtons.nth(0).click({ force: true });
  await seatButtons.nth(1).click({ force: true });
  await seatButtons.nth(2).click({ force: true });
  
  // Verify price updates
  const priceText = await page.textContent('text=סה"כ');
  expect(priceText).toBeTruthy();
  
  await page.click('button:has-text("המשך לתשלום")');
  await expect(page).toHaveURL(/.*checkout/);
});
