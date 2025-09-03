import { test, expect } from '@playwright/test';

test.describe('Visual User Management Analysis', () => {
  test('capture and analyze user management interface', async ({ page }) => {
    console.log('📸 Capturing user management interface...');
    
    // Navigate to the user management page
    await page.goto('https://thaifoon.com/admin/users');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Take full page screenshot
    await page.screenshot({ 
      path: 'test-results/live-user-management-full.png', 
      fullPage: true 
    });
    
    // Get page content for analysis
    const pageContent = await page.content();
    const bodyText = await page.locator('body').textContent();
    
    console.log('🔍 ANALYZING PAGE CONTENT...');
    console.log(`📄 Page title: ${await page.title()}`);
    console.log(`📝 Content length: ${bodyText?.length || 0} characters`);
    
    // Look for key text elements from your screenshot
    const keyElements = [
      'User Management',
      'Manage restaurant staff accounts',
      'Add User',
      'Search users by name',
      'All Users',
      'Staff User',
      'Manager User', 
      'Admin User',
      'STAFF',
      'MANAGER',
      'ADMIN',
      'staff@thaifoon.com',
      'manager@thaifoon.com',
      'admin@thaifoon.com'
    ];
    
    console.log('\n🔍 SEARCHING FOR KEY ELEMENTS...');
    for (const element of keyElements) {
      const found = bodyText?.includes(element) || pageContent.includes(element);
      console.log(`${found ? '✅' : '❌'} "${element}"`);
    }
    
    // Count specific elements
    const userCount = (bodyText?.match(/User/g) || []).length;
    const emailCount = (bodyText?.match(/@thaifoon\.com/g) || []).length;
    const roleCount = (bodyText?.match(/STAFF|MANAGER|ADMIN/g) || []).length;
    
    console.log('\n📊 ELEMENT COUNTS:');
    console.log(`👤 "User" mentions: ${userCount}`);
    console.log(`📧 @thaifoon.com emails: ${emailCount}`);
    console.log(`🏷️ Role badges: ${roleCount}`);
    
    // Check if we're seeing the authenticated interface
    const hasUserManagement = bodyText?.includes('User Management');
    const hasAddUserButton = bodyText?.includes('Add User');
    const hasUserList = bodyText?.includes('All Users');
    
    console.log('\n🎯 INTERFACE ANALYSIS:');
    console.log(`📋 Has "User Management" header: ${hasUserManagement ? '✅' : '❌'}`);
    console.log(`➕ Has "Add User" button: ${hasAddUserButton ? '✅' : '❌'}`);
    console.log(`👥 Has user list: ${hasUserList ? '✅' : '❌'}`);
    
    // Check authentication status
    const hasSignOut = bodyText?.includes('Sign out');
    const hasAdminUser = bodyText?.includes('Admin User');
    
    console.log('\n🔐 AUTHENTICATION STATUS:');
    console.log(`🚪 Has "Sign out": ${hasSignOut ? '✅' : '❌'}`);
    console.log(`👨‍💼 Shows "Admin User": ${hasAdminUser ? '✅' : '❌'}`);
    
    // Save page source for detailed analysis
    await page.locator('body').innerHTML().then(html => {
      require('fs').writeFileSync('test-results/user-management-source.html', html);
      console.log('\n💾 Page source saved to: test-results/user-management-source.html');
    });
    
    console.log('\n🎉 ANALYSIS COMPLETE!');
    console.log('📸 Screenshot: test-results/live-user-management-full.png');
    console.log('💾 Source code: test-results/user-management-source.html');
  });

  test('test different viewport sizes', async ({ page }) => {
    console.log('📱 Testing responsive user management interface...');
    
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1440, height: 900 }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('https://thaifoon.com/admin/users');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      await page.screenshot({ 
        path: `test-results/user-mgmt-${viewport.name}.png`, 
        fullPage: true 
      });
      
      console.log(`📸 ${viewport.name} (${viewport.width}x${viewport.height}): Captured`);
    }
  });

  test('analyze page structure and elements', async ({ page }) => {
    console.log('🔍 Analyzing page structure...');
    
    await page.goto('https://thaifoon.com/admin/users');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Count different types of elements
    const elementCounts = {
      buttons: await page.locator('button').count(),
      links: await page.locator('a').count(),
      inputs: await page.locator('input').count(),
      images: await page.locator('img').count(),
      forms: await page.locator('form').count(),
      tables: await page.locator('table').count(),
      divs: await page.locator('div').count()
    };
    
    console.log('\n📊 ELEMENT COUNTS:');
    Object.entries(elementCounts).forEach(([type, count]) => {
      console.log(`${type}: ${count}`);
    });
    
    // Get all text content from buttons
    const buttonTexts = await page.locator('button').allTextContents();
    console.log('\n🔘 BUTTON TEXTS:');
    buttonTexts.forEach((text, index) => {
      if (text.trim()) console.log(`  ${index + 1}. "${text.trim()}"`);
    });
    
    // Get all link texts
    const linkTexts = await page.locator('a').allTextContents();
    console.log('\n🔗 LINK TEXTS:');
    linkTexts.slice(0, 10).forEach((text, index) => {
      if (text.trim()) console.log(`  ${index + 1}. "${text.trim()}"`);
    });
  });
});
