# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking.spec.ts >> should navigate to movie booking flow
- Location: tests\booking.spec.ts:3:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.movie-card').first()
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for locator('.movie-card').first()

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
  3  | test('should navigate to movie booking flow', async ({ page }) => {
  4  |   await page.goto('/');
  5  |   
  6  |   // Check if the title is present
  7  |   await expect(page.getByText('MOVIEBOOK', { exact: true }).first()).toBeVisible();
  8  |   
  9  |   // Check if movies are loaded
  10 |   const movieCards = page.locator('.movie-card');
  11 |   // Since it might take a moment for TMDB to load, we wait
> 12 |   await expect(movieCards.first()).toBeVisible({ timeout: 15000 });
     |                                    ^ Error: expect(locator).toBeVisible() failed
  13 |   
  14 |   // Click on the first movie
  15 |   await movieCards.first().click();
  16 |   
  17 |   // Verify we are in the booking state (RightPanel should show "בחר מושבים")
  18 |   await expect(page.getByText('בחר מושבים')).toBeVisible();
  19 | });
  20 | 
```