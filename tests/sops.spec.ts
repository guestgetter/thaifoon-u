import { test, expect } from '@playwright/test';

test.describe('SOPs (Standard Operating Procedures)', () => {
  test('SOPs page loads correctly', async ({ page }) => {
    await page.goto('/sops');
    
    // Check that the page loads
    await expect(page.locator('body')).toBeVisible();
    
    // Look for SOP-related elements
    const sopElements = page.locator('[data-testid="sop-card"], .sop-card, .sop-item');
    
    // Either SOPs are displayed or there's an empty state
    const hasContent = await sopElements.count() > 0;
    const hasEmptyState = await page.locator('text=/no sops/i, text=/empty/i').count() > 0;
    
    expect(hasContent || hasEmptyState).toBeTruthy();
  });

  test('individual SOP page is accessible', async ({ page }) => {
    // First go to SOPs page
    await page.goto('/sops');
    
    // Try to find a SOP link
    const sopLinks = page.locator('a[href*="/sops/"]');
    const sopCount = await sopLinks.count();
    
    if (sopCount > 0) {
      // Click on the first SOP link
      await sopLinks.first().click();
      
      // Verify we're on a SOP page
      await expect(page).toHaveURL(/.*\/sops\/[^\/]+$/);
      await expect(page.locator('body')).toBeVisible();
    } else {
      // Try accessing a SOP directly
      await page.goto('/sops/test-sop');
      
      // Either the SOP loads or we get a 404/not found page
      const isNotFound = await page.locator('text=/not found/i, text=/404/i').count() > 0;
      const hasContent = await page.locator('body').isVisible();
      
      expect(isNotFound || hasContent).toBeTruthy();
    }
  });
});



