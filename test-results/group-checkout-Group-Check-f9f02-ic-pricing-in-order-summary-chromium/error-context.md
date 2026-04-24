# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: group-checkout.spec.ts >> Group Checkout Flow >> should reflect dynamic pricing in order summary
- Location: tests\group-checkout.spec.ts:41:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('a[href^="/movie/"]').first()
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for locator('a[href^="/movie/"]').first()

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - img "Cinema Background" [ref=e4]
      - generic [ref=e7]:
        - generic [ref=e8]:
          - generic [ref=e9]: MOVIEBOOK
          - img [ref=e11]
        - heading "המקום בו כל פריים מספר סיפור" [level=1] [ref=e16]
        - paragraph [ref=e17]: הצטרפו לאלפי חובבי קולנוע וקבלו גישה להקרנות בלעדיות, מושבי פרימיום ומשלוחי אוכל גורמה עד למושב.
    - generic [ref=e18]:
      - generic [ref=e20]:
        - generic [ref=e22]:
          - heading "ברוכים השבים" [level=1] [ref=e23]
          - paragraph [ref=e24]: אנא הזינו את הפרטים שלכם כדי להתחבר
        - generic [ref=e25]:
          - generic [ref=e26]:
            - text: כתובת אימייל
            - generic [ref=e27]:
              - img [ref=e28]
              - textbox "hello@example.com" [ref=e31]
          - generic [ref=e32]:
            - generic [ref=e33]:
              - generic [ref=e34]: סיסמה
              - link "שכחת סיסמה?" [ref=e35] [cursor=pointer]:
                - /url: "#"
            - generic [ref=e36]:
              - img [ref=e37]
              - textbox "••••••••" [ref=e40]
          - button "כניסה" [ref=e41]:
            - text: כניסה
            - img [ref=e42]
          - generic [ref=e48]: או התחברו באמצעות
          - button "התחברות עם Google" [ref=e49]:
            - img [ref=e50]
            - text: התחברות עם Google
        - paragraph [ref=e55]:
          - text: אין לך חשבון?
          - link "צור אחד עכשיו" [ref=e56] [cursor=pointer]:
            - /url: /register
      - generic [ref=e57]: © 2026 MOVIEBOOK • חווית קולנוע פרימיום
  - button "Open Next.js Dev Tools" [ref=e63] [cursor=pointer]:
    - img [ref=e64]
  - alert [ref=e67]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Group Checkout Flow', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // Navigate to homepage and pick a movie to populate store
  6  |     await page.goto('/');
  7  |     const movieLink = page.locator('a[href^="/movie/"]').first();
> 8  |     await expect(movieLink).toBeVisible({ timeout: 15000 });
     |                             ^ Error: expect(locator).toBeVisible() failed
  9  |     await movieLink.click();
  10 |     
  11 |     // Select a seat
  12 |     const seat = page.locator('button:not([disabled])').filter({ hasText: /^[A-H][1-6]$/ }).first();
  13 |     await seat.click();
  14 |     
  15 |     // Go to checkout
  16 |     await page.getByText('המשך לתשלום').click();
  17 |     await expect(page).toHaveURL(/.*checkout/);
  18 |   });
  19 | 
  20 |   test('should enable social mode and add group members', async ({ page }) => {
  21 |     // Verify SplitPayPanel is visible
  22 |     await expect(page.getByText('Social Cinema')).toBeVisible();
  23 |     
  24 |     // Toggle social mode
  25 |     const toggleBtn = page.getByText('פצל תשלום');
  26 |     await toggleBtn.click();
  27 |     
  28 |     // Verify invite code is generated
  29 |     await expect(page.getByText('קוד הצטרפות לקבוצה')).toBeVisible();
  30 |     
  31 |     // Add a group member
  32 |     await page.getByPlaceholder('שם חבר').fill('ישראל ישראלי');
  33 |     await page.getByPlaceholder('אימייל').fill('israel@example.com');
  34 |     await page.locator('button:has(svg)').filter({ has: page.locator('polyline') }).click(); // UserPlus icon button
  35 |     
  36 |     // Verify member added
  37 |     await expect(page.getByText('ישראל ישראלי')).toBeVisible();
  38 |     await expect(page.getByText('פיצול בין 2 משתתפים')).toBeVisible();
  39 |   });
  40 | 
  41 |   test('should reflect dynamic pricing in order summary', async ({ page }) => {
  42 |     // Check for dynamic pricing badge
  43 |     await expect(page.getByText('מחיר דינמי')).toBeVisible();
  44 |     
  45 |     // Check for specific insights (mocked values in CheckoutPage)
  46 |     // "עומס בשעות השיא" or "הנחת הזמנה מוקדמת" etc.
  47 |     const insight = page.locator('p').filter({ hasText: /עומס|הנחה|סופ"ש/ }).first();
  48 |     await expect(insight).toBeVisible();
  49 |   });
  50 | });
  51 | 
```