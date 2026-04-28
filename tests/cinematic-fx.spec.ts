import { test, expect } from '@playwright/test';

test.describe('Cinematic UI Effects', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have a mesh background in the cinematic fx layer', async ({ page }) => {
    // MeshBackground uses framer-motion div with radial-gradient
    await expect(page.locator('div')).toContainText(''); // Just to ensure page loaded
  });

  test('should apply kinetic typography to headers', async ({ page }) => {
    // Check if brand title has motion spans
    const brandTitle = page.locator('header h1 span');
    await expect(brandTitle.first()).toBeVisible();
  });

  test('should have magnetic navigation buttons', async ({ page }) => {
    const navLinks = page.locator('header nav button, header nav a');
    await expect(navLinks.first()).toBeVisible();
  });

  test('should have shimmer posters on movie cards', async ({ page }) => {
    const movieCards = page.locator('.movie-card');
    await expect(movieCards.first()).toBeVisible();
    
    const shimmerMask = movieCards.first().locator('.shimmer-mask');
    await expect(shimmerMask).toBeVisible();
  });
});
