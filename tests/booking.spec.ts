import { test, expect } from '@playwright/test';

test('should navigate to movie booking flow', async ({ page }) => {
  await page.goto('/');
  
  // Check if the title is present
  await expect(page.getByText('MOVIEBOOK', { exact: true }).first()).toBeVisible();
  
  // Check if movies are loaded
  const movieCards = page.locator('.movie-card');
  // Since it might take a moment for TMDB to load, we wait
  await expect(movieCards.first()).toBeVisible({ timeout: 15000 });
  
  // Click on the first movie
  await movieCards.first().click();
  
  // Verify we are in the booking state (RightPanel should show "בחר מושבים")
  await expect(page.getByText('בחר מושבים')).toBeVisible();
});
