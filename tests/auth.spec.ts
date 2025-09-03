import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('login page displays correctly', async ({ page }) => {
    await page.goto('/login');
    
    // Check for login form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('redirects to login when accessing protected routes', async ({ page }) => {
    // Try to access admin page without authentication
    await page.goto('/admin');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login.*/);
  });

  test('redirects to dashboard when accessing protected routes', async ({ page }) => {
    // Try to access dashboard without authentication
    await page.goto('/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login.*/);
  });
});



