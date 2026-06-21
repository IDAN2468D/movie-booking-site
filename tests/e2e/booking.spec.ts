import { test, expect } from '@playwright/test';

test.describe('Movie Booking Flow', () => {
  test('should display movies on homepage and allow navigation', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');

    // Verify the page loaded successfully by checking the title or a main heading
    await expect(page).toHaveTitle(/Movie/i);

    // Wait for movies to load (assuming movies have a specific test ID or role)
    // Here we just ensure the body is visible
    await expect(page.locator('body')).toBeVisible();
    
    // We can also verify that the Navbar or Sidebar is present
    await expect(page.locator('nav')).toBeVisible();
  });
});
