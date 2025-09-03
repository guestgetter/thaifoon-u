import { test, expect } from '@playwright/test';

test.describe('Thaifoon University Admin Deep Dive', () => {
  test('explore admin dashboard functionality', async ({ page }) => {
    console.log('👨‍💼 Deep diving into admin functionality...');
    
    await page.goto('/admin');
    await page.screenshot({ path: 'test-results/admin-dashboard.png', fullPage: true });
    
    const title = await page.title();
    console.log(`📄 Admin page title: ${title}`);
    
    // Look for admin navigation and sections
    const adminSections = await page.locator('nav a, .nav-link, [href*="/admin"]').count();
    console.log(`🧭 Admin navigation sections: ${adminSections}`);
    
    // Check for specific admin features
    const userManagement = await page.locator('a[href*="users"], button:has-text("Users"), text=/user management/i').count();
    const courseManagement = await page.locator('a[href*="courses"], button:has-text("Courses"), text=/course management/i').count();
    const employeeManagement = await page.locator('a[href*="employees"], button:has-text("Employees"), text=/employee/i').count();
    const sopManagement = await page.locator('a[href*="sops"], button:has-text("SOPs"), text=/sop/i').count();
    const assessments = await page.locator('a[href*="assessment"], button:has-text("Assessment"), text=/assessment/i').count();
    
    console.log(`🔧 Admin features found:`);
    console.log(`   - User Management: ${userManagement}`);
    console.log(`   - Course Management: ${courseManagement}`);
    console.log(`   - Employee Management: ${employeeManagement}`);
    console.log(`   - SOP Management: ${sopManagement}`);
    console.log(`   - Assessments: ${assessments}`);
    
    // Look for data tables or lists
    const tables = await page.locator('table, .table, [role="table"]').count();
    const cards = await page.locator('.card, [class*="card"]').count();
    const buttons = await page.locator('button').count();
    
    console.log(`📊 Admin UI elements:`);
    console.log(`   - Tables: ${tables}`);
    console.log(`   - Cards: ${cards}`);
    console.log(`   - Buttons: ${buttons}`);
  });

  test('explore admin users section', async ({ page }) => {
    console.log('👥 Exploring user management...');
    
    await page.goto('/admin/users');
    await page.screenshot({ path: 'test-results/admin-users.png', fullPage: true });
    
    const title = await page.title();
    console.log(`📄 Users page title: ${title}`);
    
    // Look for user-related functionality
    const userList = await page.locator('table tr, .user-item, [data-testid*="user"]').count();
    const addUserButton = await page.locator('button:has-text("Add"), button:has-text("Create"), button:has-text("New User")').count();
    const searchBox = await page.locator('input[placeholder*="search"], input[type="search"]').count();
    
    console.log(`👥 User management features:`);
    console.log(`   - User entries: ${userList}`);
    console.log(`   - Add user buttons: ${addUserButton}`);
    console.log(`   - Search functionality: ${searchBox}`);
  });

  test('explore admin courses section', async ({ page }) => {
    console.log('📚 Exploring course management...');
    
    await page.goto('/admin/courses');
    await page.screenshot({ path: 'test-results/admin-courses.png', fullPage: true });
    
    const title = await page.title();
    console.log(`📄 Courses admin title: ${title}`);
    
    // Look for course management features
    const courseList = await page.locator('table tr, .course-item, [data-testid*="course"]').count();
    const createCourseButton = await page.locator('button:has-text("Create"), button:has-text("Add"), button:has-text("New Course")').count();
    const editButtons = await page.locator('button:has-text("Edit"), a:has-text("Edit")').count();
    
    console.log(`📚 Course management features:`);
    console.log(`   - Course entries: ${courseList}`);
    console.log(`   - Create course buttons: ${createCourseButton}`);
    console.log(`   - Edit buttons: ${editButtons}`);
  });

  test('explore admin employees section', async ({ page }) => {
    console.log('👨‍🍳 Exploring employee management...');
    
    await page.goto('/admin/employees');
    await page.screenshot({ path: 'test-results/admin-employees.png', fullPage: true });
    
    const title = await page.title();
    console.log(`📄 Employees admin title: ${title}`);
    
    // Look for employee management features
    const employeeList = await page.locator('table tr, .employee-item, [data-testid*="employee"]').count();
    const addEmployeeButton = await page.locator('button:has-text("Add"), button:has-text("Create"), button:has-text("New Employee")').count();
    const noteFeatures = await page.locator('button:has-text("Note"), a:has-text("Notes"), text=/notes/i').count();
    
    console.log(`👨‍🍳 Employee management features:`);
    console.log(`   - Employee entries: ${employeeList}`);
    console.log(`   - Add employee buttons: ${addEmployeeButton}`);
    console.log(`   - Note features: ${noteFeatures}`);
  });

  test('explore admin SOPs section', async ({ page }) => {
    console.log('📋 Exploring SOP management...');
    
    await page.goto('/admin/sops');
    await page.screenshot({ path: 'test-results/admin-sops.png', fullPage: true });
    
    const title = await page.title();
    console.log(`📄 SOPs admin title: ${title}`);
    
    // Look for SOP management features
    const sopList = await page.locator('table tr, .sop-item, [data-testid*="sop"]').count();
    const createSopButton = await page.locator('button:has-text("Create"), button:has-text("Add"), button:has-text("New SOP")').count();
    const categories = await page.locator('select, .category, [data-testid*="category"]').count();
    
    console.log(`📋 SOP management features:`);
    console.log(`   - SOP entries: ${sopList}`);
    console.log(`   - Create SOP buttons: ${createSopButton}`);
    console.log(`   - Category features: ${categories}`);
  });

  test('explore admin assessments section', async ({ page }) => {
    console.log('📊 Exploring assessment management...');
    
    await page.goto('/admin/assessments');
    await page.screenshot({ path: 'test-results/admin-assessments.png', fullPage: true });
    
    const title = await page.title();
    console.log(`📄 Assessments admin title: ${title}`);
    
    // Look for assessment features
    const assessmentList = await page.locator('table tr, .assessment-item, [data-testid*="assessment"]').count();
    const createButton = await page.locator('button:has-text("Create"), button:has-text("Add"), button:has-text("New Assessment")').count();
    const statsFeatures = await page.locator('text=/statistics/i, text=/stats/i, .stats').count();
    
    console.log(`📊 Assessment management features:`);
    console.log(`   - Assessment entries: ${assessmentList}`);
    console.log(`   - Create buttons: ${createButton}`);
    console.log(`   - Statistics features: ${statsFeatures}`);
  });

  test('test API endpoints and data flow', async ({ page }) => {
    console.log('🔌 Testing API endpoints and data flow...');
    
    // Monitor network requests
    const requests: string[] = [];
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        requests.push(`${request.method()} ${request.url()}`);
      }
    });
    
    // Visit different admin pages to trigger API calls
    await page.goto('/admin/users');
    await page.waitForTimeout(2000);
    
    await page.goto('/admin/courses');
    await page.waitForTimeout(2000);
    
    await page.goto('/admin/employees');
    await page.waitForTimeout(2000);
    
    console.log(`🔌 API calls detected:`);
    requests.forEach(req => console.log(`   - ${req}`));
    
    // Check for authentication status
    await page.goto('/api/auth/session');
    const sessionResponse = await page.textContent('body');
    console.log(`🔐 Session status: ${sessionResponse?.substring(0, 100)}...`);
  });
});
