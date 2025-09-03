import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  
  // Check that the page loads
  await expect(page).toHaveTitle(/Thaifoon University/i);
  
  // Check for basic navigation elements
  await expect(page.locator('body')).toBeVisible();
});

test('login page is accessible', async ({ page }) => {
  await page.goto('/login');
  
  // Check that login page loads
  await expect(page.locator('form')).toBeVisible();
});

test('courses page loads', async ({ page }) => {
  await page.goto('/courses');
  
  // Check that courses page is accessible
  await expect(page.locator('body')).toBeVisible();
});



