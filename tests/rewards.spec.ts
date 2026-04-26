import { test, expect } from '@playwright/test';

test.describe('Rewards & Loyalty Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to rewards page
    await page.goto('/rewards');
    // Wait for initial data load (Skeletons should disappear)
    // Using first() to avoid strict mode violation if multiple elements match
    await expect(page.getByText('הטבות זמינות').first()).toBeVisible({ timeout: 15000 });
  });

  test('should display points and history correctly', async ({ page }) => {
    // Check points display
    await expect(page.getByTestId('stat-label').first()).toBeAttached();
    await expect(page.getByTestId('stat-value').first()).toBeAttached();
    
    // Open full history modal
    await page.getByText('היסטוריה מלאה').click({ force: true });
    
    // Verify modal title using data-testid
    await expect(page.getByTestId('modal-title').first()).toContainText('היסטוריית');
    
    // Close modal
    await page.getByTestId('close-modal').click({ force: true });
  });

  test('should open rewards catalog and check redemption availability', async ({ page }) => {
    // Open catalog
    await page.getByText('קטלוג מלא').click({ force: true });
    await expect(page.getByTestId('modal-title').first()).toContainText('קטלוג');

    // Verify rewards are listed
    await expect(page.getByText('פופקורן גדול חינם').first()).toBeVisible();
    
    // Check buttons state based on points (assuming 0 for guest/empty state)
    // In a real test, we would mock the session points
    const redeemButtons = page.getByRole('button', { name: 'מימוש' });
    const insufficientButtons = page.getByRole('button', { name: 'לא מספיק' });
    
    // At least one of them should exist
    const count = await redeemButtons.count() + await insufficientButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should maintain RTL layout integrity', async ({ page }) => {
    // Check for RTL direction
    // Note: If body doesn't have dir, check the main container
    const container = page.locator('[dir="rtl"]').first();
    await expect(container).toBeVisible();
  });
});
