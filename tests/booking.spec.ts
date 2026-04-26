import { test, expect } from '@playwright/test';

test('complete booking flow', async ({ page }) => {
  // Set desktop viewport to ensure grid layout
  await page.setViewportSize({ width: 1440, height: 900 });
  page.on('console', msg => console.log(`[BROWSER] ${msg.type()}: ${msg.text()}`));

  // 1. Navigate to home
  await page.goto('/');
  
  // Wait for initial load
  await page.waitForTimeout(2000);
  
  // 2. Click on the first movie link
  const movieLink = page.getByTestId('movie-link').first();
  await movieLink.waitFor({ state: 'attached', timeout: 15000 });
  
  const movieHref = await movieLink.getAttribute('href');
  if (movieHref) {
    await page.goto(movieHref);
  } else {
    await movieLink.click({ force: true });
  }
  
  // 3. Confirm we're on details page and click Book Now
  const bookNowBtn = page.getByTestId('book-now-button');
  // Wait for the button to be attached, and then try to click even if Playwright thinks it's hidden by an animation
  await bookNowBtn.waitFor({ state: 'attached', timeout: 10000 });
  await bookNowBtn.evaluate(el => (el as HTMLElement).click());
  
  // Wait for navigation to branches
  await page.waitForURL('**/branches**', { timeout: 10000 });
  
  // 4. Select a branch (Mandatory flow step)
  const selectBranchBtn = page.getByTestId('select-branch-button').first();
  await selectBranchBtn.waitFor({ state: 'attached', timeout: 10000 });
  await selectBranchBtn.evaluate(el => (el as HTMLElement).click());
  
  // 5. Select seats
  await page.waitForSelector('text=בחר מושבים', { timeout: 10000 });
  const seatButtons = page.getByTestId('seat-button').filter({ hasNot: page.locator(':disabled') });
  await seatButtons.first().waitFor({ state: 'attached' });
  await seatButtons.first().click({ force: true });
  
  // 6. Go to checkout
  await page.click('button:has-text("המשך לתשלום")');
  
  // 7. Verify checkout page
  await expect(page).toHaveURL(/.*checkout/);
  await expect(page.locator('text=סיכום הזמנה').first()).toBeVisible();
});
