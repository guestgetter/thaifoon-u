import { Page, expect } from '@playwright/test';

/**
 * Helper function to wait for page to be fully loaded
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
  await expect(page.locator('body')).toBeVisible();
}

/**
 * Helper function to check if user is logged in
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  try {
    // Check for common logged-in indicators
    const logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout")');
    const dashboardLink = page.locator('a[href="/dashboard"]');
    const userMenu = page.locator('[data-testid="user-menu"], .user-menu');
    
    const hasLogout = await logoutButton.count() > 0;
    const hasDashboard = await dashboardLink.count() > 0;
    const hasUserMenu = await userMenu.count() > 0;
    
    return hasLogout || hasDashboard || hasUserMenu;
  } catch {
    return false;
  }
}

/**
 * Helper function to login with test credentials
 */
export async function loginAsTestUser(page: Page, email = 'test@example.com', password = 'password') {
  await page.goto('/login');
  
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  
  // Wait for redirect after login
  await page.waitForURL(/(?!.*login).*/, { timeout: 10000 });
}

/**
 * Helper function to check for error messages
 */
export async function hasErrorMessage(page: Page): Promise<boolean> {
  const errorSelectors = [
    '.error',
    '.alert-error',
    '[role="alert"]',
    '.text-red-500',
    '.text-red-600',
    '.text-destructive'
  ];
  
  for (const selector of errorSelectors) {
    const count = await page.locator(selector).count();
    if (count > 0) return true;
  }
  
  return false;
}

/**
 * Helper function to check for success messages
 */
export async function hasSuccessMessage(page: Page): Promise<boolean> {
  const successSelectors = [
    '.success',
    '.alert-success',
    '.text-green-500',
    '.text-green-600',
    '.text-success'
  ];
  
  for (const selector of successSelectors) {
    const count = await page.locator(selector).count();
    if (count > 0) return true;
  }
  
  return false;
}



