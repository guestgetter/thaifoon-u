import { test, expect } from '@playwright/test';

test.describe('Production User Management Testing', () => {
  test('comprehensive user management interface test', async ({ page }) => {
    console.log('👥 Testing User Management with populated data...');
    
    // Test against production URL if available, otherwise local
    const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:8000';
    console.log(`🌐 Testing against: ${baseUrl}`);
    
    await page.goto('/admin/users');
    await page.screenshot({ path: 'test-results/user-management-populated.png', fullPage: true });
    
    // Test page title and header
    const title = await page.title();
    console.log(`📄 Page title: ${title}`);
    
    // Check for User Management header
    const headerText = await page.locator('h1, h2').first().textContent();
    console.log(`📋 Header: ${headerText}`);
    
    // Test navigation elements
    const navItems = await page.locator('nav a, .nav-link').count();
    console.log(`🧭 Navigation items found: ${navItems}`);
    
    // Check for specific nav items
    const dashboardLink = await page.locator('a:has-text("Dashboard")').count();
    const coursesLink = await page.locator('a:has-text("Courses")').count();
    const sopsLink = await page.locator('a:has-text("SOPs")').count();
    const quizzesLink = await page.locator('a:has-text("Quizzes")').count();
    const adminLink = await page.locator('a:has-text("Admin")').count();
    
    console.log(`🔗 Navigation links:`);
    console.log(`   - Dashboard: ${dashboardLink > 0 ? '✅' : '❌'}`);
    console.log(`   - Courses: ${coursesLink > 0 ? '✅' : '❌'}`);
    console.log(`   - SOPs: ${sopsLink > 0 ? '✅' : '❌'}`);
    console.log(`   - Quizzes: ${quizzesLink > 0 ? '✅' : '❌'}`);
    console.log(`   - Admin: ${adminLink > 0 ? '✅' : '❌'}`);
    
    // Test user list functionality
    const userCount = await page.locator('[class*="user"], tr:has(td)').count();
    console.log(`👤 Users found: ${userCount}`);
    
    // Test for specific user roles
    const staffUsers = await page.locator('text=/STAFF/i').count();
    const managerUsers = await page.locator('text=/MANAGER/i').count();
    const adminUsers = await page.locator('text=/ADMIN/i').count();
    
    console.log(`👥 User roles detected:`);
    console.log(`   - Staff users: ${staffUsers}`);
    console.log(`   - Manager users: ${managerUsers}`);
    console.log(`   - Admin users: ${adminUsers}`);
    
    // Test Add User functionality
    const addUserButton = await page.locator('button:has-text("Add User"), a:has-text("Add User")').count();
    console.log(`➕ Add User button: ${addUserButton > 0 ? '✅ Found' : '❌ Not found'}`);
    
    // Test search functionality
    const searchBox = await page.locator('input[placeholder*="search"], input[type="search"]').count();
    console.log(`🔍 Search functionality: ${searchBox > 0 ? '✅ Available' : '❌ Not found'}`);
    
    if (searchBox > 0) {
      // Test search interaction
      await page.fill('input[placeholder*="search"], input[type="search"]', 'staff');
      console.log('🔍 Search test: Entered "staff" in search box');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'test-results/user-search-test.png' });
    }
    
    // Test user action buttons (edit/delete)
    const editButtons = await page.locator('button:has-text("Edit"), a:has-text("Edit"), [aria-label*="edit"]').count();
    const deleteButtons = await page.locator('button:has-text("Delete"), [aria-label*="delete"]').count();
    
    console.log(`⚙️ User actions:`);
    console.log(`   - Edit buttons: ${editButtons}`);
    console.log(`   - Delete buttons: ${deleteButtons}`);
    
    // Test user avatars/profile images
    const avatars = await page.locator('img[alt*="avatar"], img[alt*="profile"], .avatar').count();
    console.log(`👤 User avatars: ${avatars}`);
    
    // Test responsive behavior
    console.log('\n📱 Testing responsive behavior...');
    
    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ path: 'test-results/user-management-mobile.png', fullPage: true });
    console.log('📱 Mobile screenshot captured');
    
    // Tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({ path: 'test-results/user-management-tablet.png', fullPage: true });
    console.log('📱 Tablet screenshot captured');
    
    // Desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({ path: 'test-results/user-management-desktop.png', fullPage: true });
    console.log('🖥️ Desktop screenshot captured');
  });

  test('test user management interactions', async ({ page }) => {
    console.log('🔄 Testing user management interactions...');
    
    await page.goto('/admin/users');
    
    // Test clicking Add User button if it exists
    const addUserButton = page.locator('button:has-text("Add User"), a:has-text("Add User")');
    const addUserCount = await addUserButton.count();
    
    if (addUserCount > 0) {
      console.log('➕ Testing Add User button click...');
      await addUserButton.first().click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test-results/add-user-modal.png' });
      console.log('📸 Add User modal/page screenshot captured');
      
      // Check if modal or new page opened
      const modalExists = await page.locator('[role="dialog"], .modal').count() > 0;
      const newPageLoaded = page.url().includes('new') || page.url().includes('add');
      
      console.log(`📋 Add User interface: ${modalExists ? 'Modal opened' : newPageLoaded ? 'New page loaded' : 'No change detected'}`);
    }
    
    // Test navigation between admin sections
    console.log('\n🧭 Testing admin navigation...');
    
    const adminSections = [
      { name: 'Courses', selector: 'a:has-text("Courses")' },
      { name: 'Employees', selector: 'a[href*="employees"]' },
      { name: 'SOPs', selector: 'a:has-text("SOPs")' },
      { name: 'Assessments', selector: 'a[href*="assessments"]' }
    ];
    
    for (const section of adminSections) {
      const link = page.locator(section.selector);
      const linkCount = await link.count();
      
      if (linkCount > 0) {
        console.log(`🔗 Testing navigation to ${section.name}...`);
        await link.first().click();
        await page.waitForTimeout(1500);
        
        const currentUrl = page.url();
        console.log(`   - Navigated to: ${currentUrl}`);
        
        await page.screenshot({ path: `test-results/admin-${section.name.toLowerCase()}-navigation.png` });
        
        // Navigate back to users
        await page.goto('/admin/users');
        await page.waitForTimeout(1000);
      }
    }
  });

  test('test user role and permission system', async ({ page }) => {
    console.log('🔐 Testing user roles and permissions...');
    
    await page.goto('/admin/users');
    
    // Look for role badges/indicators
    const roleElements = await page.locator('[class*="role"], [class*="badge"], .tag').allTextContents();
    console.log('🏷️ Role elements found:', roleElements);
    
    // Test user profile access
    const userProfiles = page.locator('a[href*="/admin/users/"], button[data-user-id]');
    const profileCount = await userProfiles.count();
    
    if (profileCount > 0) {
      console.log(`👤 Testing user profile access (${profileCount} profiles found)...`);
      
      // Click on first user profile
      await userProfiles.first().click();
      await page.waitForTimeout(2000);
      
      const profileUrl = page.url();
      console.log(`👤 User profile URL: ${profileUrl}`);
      
      await page.screenshot({ path: 'test-results/user-profile-detail.png', fullPage: true });
      console.log('📸 User profile detail captured');
    }
    
    // Test permission indicators
    const permissionElements = await page.locator('text=/permission/i, text=/access/i, text=/role/i').count();
    console.log(`🔒 Permission-related elements: ${permissionElements}`);
  });
});
