# Playwright Testing Setup for Thaifoon University

This directory contains end-to-end tests for the Thaifoon University application using Playwright.

## Setup

The project is already configured with Playwright. The setup includes:

- **Playwright Config**: `playwright.config.ts` in the project root
- **Test Directory**: `tests/` containing all test files
- **MCP Integration**: `.cursor/mcp.json` for Cursor IDE integration

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests with UI mode (interactive)
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run specific test file
npx playwright test tests/auth.spec.ts

# Run tests matching a pattern
npx playwright test --grep "login"
```

### Test Reports

After running tests, you can view the HTML report:

```bash
npx playwright show-report
```

## Test Structure

### Test Files

- `example.spec.ts` - Basic smoke tests
- `auth.spec.ts` - Authentication flow tests
- `courses.spec.ts` - Course-related functionality tests
- `sops.spec.ts` - Standard Operating Procedures tests

### Utilities

- `utils/test-helpers.ts` - Common helper functions for tests

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/some-page');
    await expect(page.locator('selector')).toBeVisible();
  });
});
```

### Using Test Helpers

```typescript
import { loginAsTestUser, waitForPageLoad } from './utils/test-helpers';

test('authenticated user test', async ({ page }) => {
  await loginAsTestUser(page);
  await waitForPageLoad(page);
  // ... rest of test
});
```

## Cursor MCP Integration

The project is configured to work with Cursor's MCP (Model Context Protocol) integration. This allows you to:

1. Run Playwright commands directly from Cursor
2. Generate tests using AI assistance
3. Debug tests interactively

### Enabling MCP in Cursor

1. Open Cursor Settings
2. Navigate to Features > MCP
3. The Playwright MCP server should be automatically detected from `.cursor/mcp.json`

## Configuration

### Playwright Config Highlights

- **Base URL**: `http://localhost:8000` (matches your dev server)
- **Browsers**: Chromium, Firefox, WebKit
- **Auto-start dev server**: Configured to run `npm run dev` before tests
- **Trace collection**: Enabled on first retry for debugging

### Environment Variables

You can set these environment variables to customize test behavior:

- `CI=true` - Enables CI-specific settings (retries, single worker)
- `PLAYWRIGHT_BASE_URL` - Override the base URL for tests

## Best Practices

1. **Use data-testid attributes** for reliable element selection
2. **Wait for elements** before interacting with them
3. **Use helper functions** for common operations
4. **Group related tests** using `test.describe()`
5. **Clean up after tests** if they create data

## Debugging

### Debug Mode

```bash
npm run test:debug
```

This opens the Playwright Inspector where you can:
- Step through tests
- Inspect elements
- View network requests
- See console logs

### Screenshots and Videos

Failed tests automatically capture:
- Screenshots
- Videos (in headed mode)
- Traces (for debugging)

These are saved in `test-results/` directory.



