---
name: e2e-test-design
description: "Design end-to-end tests covering critical user journeys, cross-browser testing, and production-like scenario validation. Use when testing complete user flows, validating release readiness, or ensuring cross-browser compatibility."
---

# E2E Test Design

Design end-to-end tests that validate complete user journeys through the entire application stack in a production-like environment.

**Use when:** Testing critical user flows, validating release readiness, ensuring cross-browser compatibility, or catching integration issues missed by lower-level tests.

**Arguments:**
- `$APPLICATION`: The application or product name
- `$USER_JOURNEY`: The critical user flow to test
- `$CONTEXT`: Target browsers, devices, and environments

## E2E Test Scope

```
┌────────────────────────────────────────────────────────────────────┐
│                        E2E Test Boundary                           │
│                                                                     │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐     │
│  │  Browser │───▶│ Frontend │───▶│  Backend │───▶│ Database │     │
│  │  (Real)  │    │  (Real)  │    │  (Real)  │    │  (Real)  │     │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘     │
│                                         │                          │
│                                         ▼                          │
│                                  ┌──────────────┐                  │
│                                  │   External   │ ← May be stubbed │
│                                  │   Services   │   for stability  │
│                                  └──────────────┘                  │
└────────────────────────────────────────────────────────────────────┘
```

## Critical User Journeys

### Identify High-Value Flows

| Priority | Journey Type           | Example                           |
|----------|------------------------|-----------------------------------|
| P0       | Revenue-critical       | Checkout, payment, subscription   |
| P0       | Security-critical      | Login, password reset, 2FA        |
| P1       | Core functionality     | Search, create, edit, delete      |
| P1       | User onboarding        | Signup, profile setup, first use  |
| P2       | Secondary features     | Settings, notifications, export   |

## E2E Test Structure

### Playwright Example

```javascript
import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: logged-in user with items in cart
    await page.goto('/');
    await loginAsTestUser(page);
    await addItemToCart(page, 'WIDGET-001');
  });

  test('should complete purchase with credit card', async ({ page }) => {
    // Navigate to checkout
    await page.click('[data-testid="cart-icon"]');
    await page.click('[data-testid="checkout-button"]');

    // Fill shipping information
    await page.fill('[data-testid="shipping-address"]', '123 Test St');
    await page.fill('[data-testid="shipping-city"]', 'Test City');
    await page.fill('[data-testid="shipping-zip"]', '12345');
    await page.click('[data-testid="continue-to-payment"]');

    // Fill payment information
    await page.fill('[data-testid="card-number"]', '4242424242424242');
    await page.fill('[data-testid="card-expiry"]', '12/25');
    await page.fill('[data-testid="card-cvc"]', '123');

    // Complete purchase
    await page.click('[data-testid="place-order"]');

    // Verify success
    await expect(page.locator('[data-testid="order-confirmation"]')).toBeVisible();
    await expect(page.locator('[data-testid="order-number"]')).toHaveText(/ORD-\d+/);

    // Verify email sent (check via API or test inbox)
    const orderNumber = await page.locator('[data-testid="order-number"]').textContent();
    const email = await checkTestInbox('order-confirmation');
    expect(email.subject).toContain(orderNumber);
  });

  test('should show error for declined card', async ({ page }) => {
    await page.click('[data-testid="cart-icon"]');
    await page.click('[data-testid="checkout-button"]');

    // Fill valid shipping
    await fillShippingForm(page);
    await page.click('[data-testid="continue-to-payment"]');

    // Use test card that triggers decline
    await page.fill('[data-testid="card-number"]', '4000000000000002');
    await page.fill('[data-testid="card-expiry"]', '12/25');
    await page.fill('[data-testid="card-cvc"]', '123');

    await page.click('[data-testid="place-order"]');

    // Verify error handling
    await expect(page.locator('[data-testid="payment-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="payment-error"]')).toContainText('declined');

    // Verify cart is preserved (user can retry)
    await page.click('[data-testid="back-to-cart"]');
    await expect(page.locator('[data-testid="cart-items"]')).toHaveCount(1);
  });
});
```

## Step-by-Step Process

1. **Identify critical user journeys**
   - Map revenue-critical and security-critical flows
   - Prioritize based on business impact
   - Limit to 10-20 E2E tests (quality over quantity)

2. **Define test scenarios per journey**
   - Happy path (complete flow works)
   - Primary error paths (payment fails, validation errors)
   - Edge cases (session timeout, network issues)

3. **Design page objects or test utilities**
   - Reusable login, navigation, form-filling helpers
   - Data-testid selectors for stability
   - Test data factories for consistent setup

4. **Configure test environment**
   - Staging environment with seeded data
   - Stable external service mocks (payment sandbox)
   - Visual regression baseline

5. **Set up cross-browser testing**
   - Chrome (primary)
   - Firefox, Safari (secondary)
   - Mobile viewports (responsive)

## E2E Test Template

```markdown
## E2E Test: [User Journey Name]

### Journey Map
1. User starts at [page/state]
2. User performs [action]
3. System responds with [expected behavior]
4. User continues to [next step]
5. Journey completes at [end state]

### Test Scenarios

| ID  | Scenario              | Preconditions         | Expected Outcome         |
|-----|-----------------------|-----------------------|--------------------------|
| E1  | Happy path            | [Setup requirements]  | [Success state]          |
| E2  | Validation error      | [Invalid input]       | [Error displayed]        |
| E3  | External failure      | [Service unavailable] | [Graceful degradation]   |

### Browser Matrix

| Browser | Version | Viewport    | Priority |
|---------|---------|-------------|----------|
| Chrome  | Latest  | Desktop     | P0       |
| Chrome  | Latest  | Mobile      | P0       |
| Firefox | Latest  | Desktop     | P1       |
| Safari  | Latest  | Desktop     | P1       |
| Edge    | Latest  | Desktop     | P2       |

### Test Data Requirements
- Test user account: [credentials or factory]
- Test payment method: [sandbox card numbers]
- Seed data: [products, inventory levels]
```

## Page Object Pattern

```javascript
// pages/CheckoutPage.js
export class CheckoutPage {
  constructor(page) {
    this.page = page;
  }

  async fillShippingAddress(address) {
    await this.page.fill('[data-testid="shipping-address"]', address.street);
    await this.page.fill('[data-testid="shipping-city"]', address.city);
    await this.page.fill('[data-testid="shipping-zip"]', address.zip);
    await this.page.selectOption('[data-testid="shipping-country"]', address.country);
  }

  async fillPaymentDetails(card) {
    await this.page.fill('[data-testid="card-number"]', card.number);
    await this.page.fill('[data-testid="card-expiry"]', card.expiry);
    await this.page.fill('[data-testid="card-cvc"]', card.cvc);
  }

  async placeOrder() {
    await this.page.click('[data-testid="place-order"]');
  }

  async getOrderNumber() {
    return this.page.locator('[data-testid="order-number"]').textContent();
  }

  async getErrorMessage() {
    return this.page.locator('[data-testid="payment-error"]').textContent();
  }
}
```

## Cross-Browser Configuration

```javascript
// playwright.config.js
export default {
  projects: [
    {
      name: 'Desktop Chrome',
      use: { browserName: 'chromium', viewport: { width: 1280, height: 720 } },
    },
    {
      name: 'Mobile Chrome',
      use: { browserName: 'chromium', ...devices['Pixel 5'] },
    },
    {
      name: 'Desktop Firefox',
      use: { browserName: 'firefox', viewport: { width: 1280, height: 720 } },
    },
    {
      name: 'Desktop Safari',
      use: { browserName: 'webkit', viewport: { width: 1280, height: 720 } },
    },
  ],
  retries: 2, // E2E tests can be flaky
  timeout: 60000, // Generous timeout for slow flows
};
```

## Anti-Patterns to Avoid

| Anti-Pattern          | Problem                         | Solution                          |
|-----------------------|---------------------------------|-----------------------------------|
| Too many E2E tests    | Slow, flaky, expensive          | Focus on critical paths only      |
| Testing implementation| Breaks on UI changes            | Use stable selectors (data-testid)|
| No test data strategy | Tests depend on prod data       | Use factories, seed data          |
| Synchronous waits     | Flaky timing issues             | Use proper async waits            |
| Ignoring flakiness    | Erodes trust in tests           | Fix or quarantine flaky tests     |

## Notes

- E2E tests are the most expensive to write and maintain — be selective
- Use data-testid attributes for reliable element selection
- Run E2E tests in CI but not on every commit — pre-deploy or nightly is typical
- Visual regression testing complements functional E2E tests
- Mock unstable external services (payment sandbox, not prod)
- Parallelize test execution to reduce total run time
