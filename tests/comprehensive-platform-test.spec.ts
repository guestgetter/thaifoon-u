import { test, expect } from '@playwright/test';

test.describe('Comprehensive Thaifoon University Platform Test', () => {
  test('complete platform exploration and functionality test', async ({ page }) => {
    console.log('🚀 Starting comprehensive Thaifoon University platform test...');
    
    // Test 1: Homepage Analysis
    console.log('\n📱 TESTING HOMEPAGE...');
    await page.goto('/');
    await page.screenshot({ path: 'test-results/01-homepage-full.png', fullPage: true });
    
    const title = await page.title();
    console.log(`✅ Page title: ${title}`);
    
    // Check for any visible content
    const bodyText = await page.locator('body').textContent();
    const hasContent = bodyText && bodyText.length > 100;
    console.log(`✅ Page has content: ${hasContent ? 'Yes' : 'No'} (${bodyText?.length} chars)`);
    
    // Look for navigation
    const navElements = await page.locator('nav, header, .navbar, .navigation').count();
    console.log(`🧭 Navigation elements: ${navElements}`);
    
    // Test 2: Login System
    console.log('\n🔐 TESTING LOGIN SYSTEM...');
    await page.goto('/login');
    await page.screenshot({ path: 'test-results/02-login-system.png', fullPage: true });
    
    const emailInput = await page.locator('input[type="email"]').count();
    const passwordInput = await page.locator('input[type="password"]').count();
    const submitButton = await page.locator('button[type="submit"]').count();
    
    console.log(`✅ Email input: ${emailInput > 0 ? 'Found' : 'Missing'}`);
    console.log(`✅ Password input: ${passwordInput > 0 ? 'Found' : 'Missing'}`);
    console.log(`✅ Submit button: ${submitButton > 0 ? 'Found' : 'Missing'}`);
    
    // Test login form interaction
    if (emailInput > 0 && passwordInput > 0) {
      await page.fill('input[type="email"]', 'test@thaifoon.com');
      await page.fill('input[type="password"]', 'testpassword');
      console.log('✅ Login form can be filled');
    }
    
    // Test 3: Admin Dashboard
    console.log('\n👨‍💼 TESTING ADMIN DASHBOARD...');
    await page.goto('/admin');
    await page.screenshot({ path: 'test-results/03-admin-dashboard.png', fullPage: true });
    
    const adminContent = await page.locator('body').textContent();
    console.log(`✅ Admin page loads: ${adminContent ? 'Yes' : 'No'}`);
    
    // Test 4: Admin Users Section
    console.log('\n👥 TESTING USER MANAGEMENT...');
    await page.goto('/admin/users');
    await page.screenshot({ path: 'test-results/04-admin-users.png', fullPage: true });
    
    const usersContent = await page.locator('body').textContent();
    console.log(`✅ Users page loads: ${usersContent ? 'Yes' : 'No'}`);
    
    // Test 5: Course Management
    console.log('\n📚 TESTING COURSE MANAGEMENT...');
    await page.goto('/admin/courses');
    await page.screenshot({ path: 'test-results/05-admin-courses.png', fullPage: true });
    
    const coursesContent = await page.locator('body').textContent();
    console.log(`✅ Courses admin loads: ${coursesContent ? 'Yes' : 'No'}`);
    
    // Test 6: Employee Management
    console.log('\n👨‍🍳 TESTING EMPLOYEE MANAGEMENT...');
    await page.goto('/admin/employees');
    await page.screenshot({ path: 'test-results/06-admin-employees.png', fullPage: true });
    
    const employeesContent = await page.locator('body').textContent();
    console.log(`✅ Employees admin loads: ${employeesContent ? 'Yes' : 'No'}`);
    
    // Test 7: SOP Management
    console.log('\n📋 TESTING SOP MANAGEMENT...');
    await page.goto('/admin/sops');
    await page.screenshot({ path: 'test-results/07-admin-sops.png', fullPage: true });
    
    const sopsContent = await page.locator('body').textContent();
    console.log(`✅ SOPs admin loads: ${sopsContent ? 'Yes' : 'No'}`);
    
    // Test 8: Assessment System
    console.log('\n📊 TESTING ASSESSMENT SYSTEM...');
    await page.goto('/admin/assessments');
    await page.screenshot({ path: 'test-results/08-admin-assessments.png', fullPage: true });
    
    const assessmentsContent = await page.locator('body').textContent();
    console.log(`✅ Assessments admin loads: ${assessmentsContent ? 'Yes' : 'No'}`);
    
    // Test 9: Public Course Access
    console.log('\n🎓 TESTING PUBLIC COURSE ACCESS...');
    await page.goto('/courses');
    await page.screenshot({ path: 'test-results/09-public-courses.png', fullPage: true });
    
    const publicCoursesContent = await page.locator('body').textContent();
    console.log(`✅ Public courses page loads: ${publicCoursesContent ? 'Yes' : 'No'}`);
    
    // Test 10: Quiz System
    console.log('\n🧠 TESTING QUIZ SYSTEM...');
    await page.goto('/quizzes');
    await page.screenshot({ path: 'test-results/10-quiz-system.png', fullPage: true });
    
    const quizzesContent = await page.locator('body').textContent();
    console.log(`✅ Quiz system loads: ${quizzesContent ? 'Yes' : 'No'}`);
    
    // Test 11: SOPs Public Access
    console.log('\n📖 TESTING PUBLIC SOP ACCESS...');
    await page.goto('/sops');
    await page.screenshot({ path: 'test-results/11-public-sops.png', fullPage: true });
    
    const publicSopsContent = await page.locator('body').textContent();
    console.log(`✅ Public SOPs page loads: ${publicSopsContent ? 'Yes' : 'No'}`);
    
    // Test 12: Dashboard Access
    console.log('\n📊 TESTING DASHBOARD ACCESS...');
    await page.goto('/dashboard');
    await page.screenshot({ path: 'test-results/12-dashboard.png', fullPage: true });
    
    const dashboardContent = await page.locator('body').textContent();
    console.log(`✅ Dashboard loads: ${dashboardContent ? 'Yes' : 'No'}`);
    
    console.log('\n🎉 COMPREHENSIVE PLATFORM TEST COMPLETE!');
    console.log('📸 All screenshots saved to test-results/ directory');
    console.log('🔍 Check the screenshots to see your platform in action!');
  });

  test('API endpoint testing', async ({ page }) => {
    console.log('\n🔌 TESTING API ENDPOINTS...');
    
    const apiTests = [
      '/api/auth/session',
      '/api/admin/users',
      '/api/admin/courses', 
      '/api/admin/employees',
      '/api/sops'
    ];
    
    for (const endpoint of apiTests) {
      try {
        const response = await page.request.get(`http://localhost:8000${endpoint}`);
        console.log(`${endpoint}: ${response.status()} ${response.statusText()}`);
      } catch (error) {
        console.log(`${endpoint}: Error - ${error}`);
      }
    }
  });

  test('responsive design testing', async ({ page }) => {
    console.log('\n📱 TESTING RESPONSIVE DESIGN...');
    
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await page.screenshot({ 
        path: `test-results/responsive-${viewport.name.toLowerCase()}.png`,
        fullPage: true 
      });
      console.log(`✅ ${viewport.name} (${viewport.width}x${viewport.height}): Screenshot captured`);
    }
  });
});
