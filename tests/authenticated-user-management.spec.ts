import { test, expect } from '@playwright/test';

test.describe('Authenticated User Management Testing', () => {
  // Set up authentication state
  test.beforeEach(async ({ page }) => {
    // Try to authenticate first
    console.log('🔐 Setting up authentication...');
    
    // Go to login page
    await page.goto('/login');
    
    // Check if we're already logged in by looking for admin interface
    const isLoggedIn = await page.locator('text=/Admin User/i, a:has-text("Sign out")').count() > 0;
    
    if (!isLoggedIn) {
      console.log('🔑 Attempting to log in...');
      
      // Try common admin credentials
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const submitButton = page.locator('button[type="submit"]');
      
      if (await emailInput.count() > 0) {
        await emailInput.fill('admin@thaifoon.com');
        await passwordInput.fill('admin123');
        await submitButton.click();
        
        // Wait for potential redirect
        await page.waitForTimeout(3000);
      }
    }
  });

  test('test full user management interface when authenticated', async ({ page }) => {
    console.log('👥 Testing authenticated user management interface...');
    
    await page.goto('/admin/users');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/authenticated-user-management.png', fullPage: true });
    
    // Check authentication status
    const authStatus = await page.locator('text=/Admin User/i, text=/Sign out/i').count();
    console.log(`🔐 Authentication status: ${authStatus > 0 ? 'Authenticated' : 'Not authenticated'}`);
    
    // Test for the specific elements visible in your screenshot
    console.log('\n🔍 Looking for specific UI elements from screenshot...');
    
    // Test for "User Management" heading
    const userMgmtHeading = await page.locator('h1:has-text("User Management"), h2:has-text("User Management")').count();
    console.log(`📋 "User Management" heading: ${userMgmtHeading > 0 ? '✅ Found' : '❌ Not found'}`);
    
    // Test for "Manage restaurant staff accounts and permissions" subtitle
    const subtitle = await page.locator('text=/Manage restaurant staff/i').count();
    console.log(`📝 Subtitle text: ${subtitle > 0 ? '✅ Found' : '❌ Not found'}`);
    
    // Test for "Add User" button (black button in top right)
    const addUserBtn = await page.locator('button:has-text("Add User"), .bg-black:has-text("Add User")').count();
    console.log(`➕ "Add User" button: ${addUserBtn > 0 ? '✅ Found' : '❌ Not found'}`);
    
    // Test for search box with placeholder
    const searchBox = await page.locator('input[placeholder*="Search users"]').count();
    console.log(`🔍 Search box: ${searchBox > 0 ? '✅ Found' : '❌ Not found'}`);
    
    // Test for "All Users (3)" section
    const allUsersSection = await page.locator('text=/All Users.*3/i').count();
    console.log(`👥 "All Users (3)" section: ${allUsersSection > 0 ? '✅ Found' : '❌ Not found'}`);
    
    // Test for specific user entries
    const staffUser = await page.locator('text="Staff User"').count();
    const managerUser = await page.locator('text="Manager User"').count();
    const adminUser = await page.locator('text="Admin User"').count();
    
    console.log(`👤 User entries:`);
    console.log(`   - Staff User: ${staffUser > 0 ? '✅' : '❌'}`);
    console.log(`   - Manager User: ${managerUser > 0 ? '✅' : '❌'}`);
    console.log(`   - Admin User: ${adminUser > 0 ? '✅' : '❌'}`);
    
    // Test for role badges
    const staffBadge = await page.locator('text="STAFF"').count();
    const managerBadge = await page.locator('text="MANAGER"').count();
    const adminBadge = await page.locator('text="ADMIN"').count();
    
    console.log(`🏷️ Role badges:`);
    console.log(`   - STAFF badge: ${staffBadge}`);
    console.log(`   - MANAGER badge: ${managerBadge}`);
    console.log(`   - ADMIN badge: ${adminBadge}`);
    
    // Test for email addresses
    const emails = await page.locator('text=/.*@thaifoon\.com/').count();
    console.log(`📧 Email addresses found: ${emails}`);
    
    // Test for action buttons (edit/delete icons)
    const editIcons = await page.locator('[data-testid="edit"], button[aria-label*="edit"], .edit-button').count();
    const deleteIcons = await page.locator('[data-testid="delete"], button[aria-label*="delete"], .delete-button').count();
    
    console.log(`⚙️ Action buttons:`);
    console.log(`   - Edit icons: ${editIcons}`);
    console.log(`   - Delete icons: ${deleteIcons}`);
    
    // Test top navigation
    console.log('\n🧭 Testing top navigation...');
    const topNavItems = {
      'Dashboard': await page.locator('nav a:has-text("Dashboard"), .nav-link:has-text("Dashboard")').count(),
      'Courses': await page.locator('nav a:has-text("Courses"), .nav-link:has-text("Courses")').count(),
      'SOPs': await page.locator('nav a:has-text("SOPs"), .nav-link:has-text("SOPs")').count(),
      'Quizzes': await page.locator('nav a:has-text("Quizzes"), .nav-link:has-text("Quizzes")').count(),
      'Admin': await page.locator('nav a:has-text("Admin"), .nav-link:has-text("Admin")').count()
    };
    
    Object.entries(topNavItems).forEach(([name, count]) => {
      console.log(`   - ${name}: ${count > 0 ? '✅' : '❌'}`);
    });
    
    // Test user profile area (top right)
    const userProfile = await page.locator('text="Admin User"').first();
    const signOutBtn = await page.locator('text="Sign out", button:has-text("Sign out")').count();
    
    console.log(`👤 User profile area:`);
    console.log(`   - "Admin User" text: ${await userProfile.count() > 0 ? '✅' : '❌'}`);
    console.log(`   - "Sign out" button: ${signOutBtn > 0 ? '✅' : '❌'}`);
  });

  test('test user management interactions when authenticated', async ({ page }) => {
    console.log('🔄 Testing user management interactions...');
    
    await page.goto('/admin/users');
    await page.waitForLoadState('networkidle');
    
    // Test Add User button click
    const addUserBtn = page.locator('button:has-text("Add User")');
    if (await addUserBtn.count() > 0) {
      console.log('➕ Testing Add User button...');
      await addUserBtn.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test-results/add-user-interface.png', fullPage: true });
      
      const modalOrPage = await page.locator('[role="dialog"], .modal').count() > 0 || 
                          page.url().includes('new') || page.url().includes('add');
      console.log(`📋 Add User interface: ${modalOrPage ? '✅ Opened' : '❌ No change'}`);
    }
    
    // Test search functionality
    const searchInput = page.locator('input[placeholder*="Search users"]');
    if (await searchInput.count() > 0) {
      console.log('🔍 Testing search functionality...');
      await searchInput.fill('staff');
      await page.waitForTimeout(1500);
      await page.screenshot({ path: 'test-results/user-search-results.png' });
      
      // Clear search
      await searchInput.fill('');
      await page.waitForTimeout(1000);
    }
    
    // Test user profile clicks
    const userEntries = page.locator('text="Staff User", text="Manager User", text="Admin User"');
    const userCount = await userEntries.count();
    
    if (userCount > 0) {
      console.log(`👤 Testing user profile access (${userCount} users)...`);
      await userEntries.first().click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test-results/user-profile-access.png', fullPage: true });
    }
  });

  test('test navigation between admin sections', async ({ page }) => {
    console.log('🧭 Testing admin section navigation...');
    
    await page.goto('/admin/users');
    
    const adminSections = [
      { name: 'Dashboard', url: '/dashboard' },
      { name: 'Courses', url: '/admin/courses' },
      { name: 'SOPs', url: '/admin/sops' },
      { name: 'Quizzes', url: '/quizzes' }
    ];
    
    for (const section of adminSections) {
      const link = page.locator(`nav a:has-text("${section.name}"), .nav-link:has-text("${section.name}")`);
      
      if (await link.count() > 0) {
        console.log(`🔗 Testing navigation to ${section.name}...`);
        await link.click();
        await page.waitForTimeout(2000);
        
        const currentUrl = page.url();
        console.log(`   - Current URL: ${currentUrl}`);
        
        await page.screenshot({ path: `test-results/nav-${section.name.toLowerCase()}.png`, fullPage: true });
        
        // Return to users page
        await page.goto('/admin/users');
        await page.waitForTimeout(1000);
      }
    }
  });
});
