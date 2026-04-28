import { test, expect } from '@playwright/test';

test.describe('Premium AI Chatbot Flow', () => {
  test('should open chat and handle booking intent', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // 1. Check if trigger exists at bottom-left
    const trigger = page.locator('button:has(svg.lucide-sparkles)');
    await expect(trigger).toBeVisible();
    
    // 2. Click trigger
    await trigger.click();
    
    // 3. Check if chat window opens
    const chatWindow = page.locator('h3:has-text("הקונסיירז׳ הדיגיטלי")');
    await expect(chatWindow).toBeVisible();
    
    // 4. Send a message
    const input = page.locator('input[placeholder="איך אוכל לעזור לך?"]');
    await input.fill('אני רוצה להזמין כרטיס לסרט פרא');
    await page.keyboard.press('Enter');
    
    // 5. Wait for AI response and booking wizard
    await page.waitForTimeout(5000); // Wait for Gemini + TMDB fetch
    
    // Check for specific movie title in response or wizard
    const wizard = page.locator('h4:has-text("פרא")');
    // If not "פרא", maybe it's "The Wild Robot"
    await expect(wizard.or(page.locator('h4:has-text("The Wild Robot")'))).toBeVisible();
  });
});
