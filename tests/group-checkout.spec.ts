import { test, expect } from '@playwright/test';

test.describe('Group Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage and pick a movie to populate store
    await page.goto('/');
    const movieLink = page.locator('a[href^="/movie/"]').first();
    await expect(movieLink).toBeVisible({ timeout: 15000 });
    await movieLink.click();
    
    // Select a seat
    const seat = page.locator('button:not([disabled])').filter({ hasText: /^[A-H][1-6]$/ }).first();
    await seat.click();
    
    // Go to checkout
    await page.getByText('המשך לתשלום').click();
    await expect(page).toHaveURL(/.*checkout/);
  });

  test('should enable social mode and add group members', async ({ page }) => {
    // Verify SplitPayPanel is visible
    await expect(page.getByText('Social Cinema')).toBeVisible();
    
    // Toggle social mode
    const toggleBtn = page.getByText('פצל תשלום');
    await toggleBtn.click();
    
    // Verify invite code is generated
    await expect(page.getByText('קוד הצטרפות לקבוצה')).toBeVisible();
    
    // Add a group member
    await page.getByPlaceholder('שם חבר').fill('ישראל ישראלי');
    await page.getByPlaceholder('אימייל').fill('israel@example.com');
    await page.locator('button:has(svg)').filter({ has: page.locator('polyline') }).click(); // UserPlus icon button
    
    // Verify member added
    await expect(page.getByText('ישראל ישראלי')).toBeVisible();
    await expect(page.getByText('פיצול בין 2 משתתפים')).toBeVisible();
  });

  test('should reflect dynamic pricing in order summary', async ({ page }) => {
    // Check for dynamic pricing badge
    await expect(page.getByText('מחיר דינמי')).toBeVisible();
    
    // Check for specific insights (mocked values in CheckoutPage)
    // "עומס בשעות השיא" or "הנחת הזמנה מוקדמת" etc.
    const insight = page.locator('p').filter({ hasText: /עומס|הנחה|סופ"ש/ }).first();
    await expect(insight).toBeVisible();
  });
});
