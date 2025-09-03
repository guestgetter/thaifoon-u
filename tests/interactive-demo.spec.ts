import { test, expect } from '@playwright/test';

test.describe('Interactive Thaifoon University Demo', () => {
  test('manual exploration of the portal', async ({ page }) => {
    // Start at the homepage
    await page.goto('/');
    
    console.log('🏠 Welcome to Thaifoon University!');
    console.log('📄 Page title:', await page.title());
    
    // Pause here so you can manually explore
    console.log('⏸️  Test paused - you can now manually explore the portal');
    console.log('   - Click around the interface');
    console.log('   - Try different pages');
    console.log('   - Test the login form');
    console.log('   - Check out the admin section');
    console.log('   - Press "Resume" in the Playwright UI when ready');
    
    await page.pause(); // This will pause the test for manual exploration
    
    // After manual exploration, let's check the login page
    await page.goto('/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    
    console.log('✅ Login page verified - has email input');
    
    // Check courses page
    await page.goto('/courses');
    await expect(page.locator('body')).toBeVisible();
    
    console.log('✅ Courses page loaded successfully');
    
    // Final pause for any additional exploration
    console.log('⏸️  Final pause - explore anything else you want to test');
    await page.pause();
  });

  test('test login form interaction', async ({ page }) => {
    await page.goto('/login');
    
    // Fill in test credentials (won't actually log in unless you have test data)
    await page.fill('input[type="email"]', 'test@thaifoon.com');
    await page.fill('input[type="password"]', 'testpassword');
    
    console.log('📝 Filled in test credentials');
    console.log('⏸️  You can now click the login button to see what happens');
    
    await page.pause();
    
    // You can manually click the submit button during the pause
    // or uncomment the next line to do it automatically:
    // await page.click('button[type="submit"]');
  });
});



