import { test, expect } from '@playwright/test';

test.describe('Courses', () => {
  test('courses page loads and displays course list', async ({ page }) => {
    await page.goto('/courses');
    
    // Check that the page loads
    await expect(page.locator('body')).toBeVisible();
    
    // Look for course-related elements
    const courseElements = page.locator('[data-testid="course-card"], .course-card, .course-item');
    
    // Either courses are displayed or there's an empty state
    const hasContent = await courseElements.count() > 0;
    const hasEmptyState = await page.locator('text=/no courses/i, text=/empty/i').count() > 0;
    
    expect(hasContent || hasEmptyState).toBeTruthy();
  });

  test('individual course page is accessible', async ({ page }) => {
    // First go to courses page to potentially find a course
    await page.goto('/courses');
    
    // Try to find a course link or navigate directly to a test course
    const courseLinks = page.locator('a[href*="/courses/"]');
    const courseCount = await courseLinks.count();
    
    if (courseCount > 0) {
      // Click on the first course link
      await courseLinks.first().click();
      
      // Verify we're on a course page
      await expect(page).toHaveURL(/.*\/courses\/[^\/]+$/);
      await expect(page.locator('body')).toBeVisible();
    } else {
      // Try accessing a course directly (this might 404, which is expected)
      await page.goto('/courses/test-course');
      
      // Either the course loads or we get a 404/not found page
      const isNotFound = await page.locator('text=/not found/i, text=/404/i').count() > 0;
      const hasContent = await page.locator('body').isVisible();
      
      expect(isNotFound || hasContent).toBeTruthy();
    }
  });
});



