import { test, expect } from '@playwright/test';

test.describe('Thaifoon University Portal Exploration', () => {
  test('explore homepage and main navigation', async ({ page }) => {
    console.log('🏠 Navigating to Thaifoon University homepage...');
    await page.goto('/');
    
    // Take a screenshot of the homepage
    await page.screenshot({ path: 'test-results/homepage.png', fullPage: true });
    
    // Check if page loads
    await expect(page.locator('body')).toBeVisible();
    
    // Log the page title
    const title = await page.title();
    console.log(`📄 Page title: ${title}`);
    
    // Look for navigation elements
    const navElements = await page.locator('nav, header, [role="navigation"]').count();
    console.log(`🧭 Found ${navElements} navigation elements`);
    
    // Look for links to main sections
    const courseLink = page.locator('a[href*="/courses"], a:has-text("Courses")');
    const dashboardLink = page.locator('a[href*="/dashboard"], a:has-text("Dashboard")');
    const loginLink = page.locator('a[href*="/login"], a:has-text("Login")');
    const sopLink = page.locator('a[href*="/sops"], a:has-text("SOP")');
    
    const courseCount = await courseLink.count();
    const dashboardCount = await dashboardLink.count();
    const loginCount = await loginLink.count();
    const sopCount = await sopLink.count();
    
    console.log(`🔗 Navigation links found:`);
    console.log(`   - Courses: ${courseCount}`);
    console.log(`   - Dashboard: ${dashboardCount}`);
    console.log(`   - Login: ${loginCount}`);
    console.log(`   - SOPs: ${sopCount}`);
    
    // Check for any forms on the homepage
    const forms = await page.locator('form').count();
    console.log(`📝 Found ${forms} forms on homepage`);
  });

  test('explore courses section', async ({ page }) => {
    console.log('📚 Exploring courses section...');
    await page.goto('/courses');
    
    await page.screenshot({ path: 'test-results/courses-page.png', fullPage: true });
    
    // Check if courses page loads
    await expect(page.locator('body')).toBeVisible();
    
    const title = await page.title();
    console.log(`📄 Courses page title: ${title}`);
    
    // Look for course-related content
    const courseCards = await page.locator('[data-testid*="course"], .course, [class*="course"]').count();
    const courseLinks = await page.locator('a[href*="/courses/"]').count();
    const courseButtons = await page.locator('button:has-text("Course"), button:has-text("Enroll"), button:has-text("Start")').count();
    
    console.log(`📚 Course content found:`);
    console.log(`   - Course cards/items: ${courseCards}`);
    console.log(`   - Course links: ${courseLinks}`);
    console.log(`   - Course action buttons: ${courseButtons}`);
    
    // Check for admin/creation functionality
    const createButton = await page.locator('button:has-text("Create"), button:has-text("Add"), button:has-text("New")').count();
    console.log(`➕ Create/Add buttons: ${createButton}`);
  });

  test('explore login functionality', async ({ page }) => {
    console.log('🔐 Exploring login functionality...');
    await page.goto('/login');
    
    await page.screenshot({ path: 'test-results/login-page.png', fullPage: true });
    
    await expect(page.locator('body')).toBeVisible();
    
    const title = await page.title();
    console.log(`📄 Login page title: ${title}`);
    
    // Check for login form elements
    const emailInput = await page.locator('input[type="email"], input[name*="email"], input[placeholder*="email"]').count();
    const passwordInput = await page.locator('input[type="password"], input[name*="password"]').count();
    const submitButton = await page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign in")').count();
    
    console.log(`🔐 Login form elements:`);
    console.log(`   - Email inputs: ${emailInput}`);
    console.log(`   - Password inputs: ${passwordInput}`);
    console.log(`   - Submit buttons: ${submitButton}`);
    
    // Check for additional auth options
    const authProviders = await page.locator('button:has-text("Google"), button:has-text("GitHub"), button:has-text("OAuth")').count();
    console.log(`🔗 External auth providers: ${authProviders}`);
  });

  test('explore SOPs (Standard Operating Procedures)', async ({ page }) => {
    console.log('📋 Exploring SOPs section...');
    await page.goto('/sops');
    
    await page.screenshot({ path: 'test-results/sops-page.png', fullPage: true });
    
    await expect(page.locator('body')).toBeVisible();
    
    const title = await page.title();
    console.log(`📄 SOPs page title: ${title}`);
    
    // Look for SOP-related content
    const sopCards = await page.locator('[data-testid*="sop"], .sop, [class*="sop"]').count();
    const sopLinks = await page.locator('a[href*="/sops/"]').count();
    const sopButtons = await page.locator('button:has-text("SOP"), button:has-text("Procedure"), button:has-text("Guide")').count();
    
    console.log(`📋 SOP content found:`);
    console.log(`   - SOP cards/items: ${sopCards}`);
    console.log(`   - SOP links: ${sopLinks}`);
    console.log(`   - SOP action buttons: ${sopButtons}`);
  });

  test('test admin access (should redirect to login)', async ({ page }) => {
    console.log('👨‍💼 Testing admin access...');
    await page.goto('/admin');
    
    // Should redirect to login or show access denied
    const currentUrl = page.url();
    console.log(`🔄 Redirected to: ${currentUrl}`);
    
    const isLoginPage = currentUrl.includes('/login');
    const hasLoginForm = await page.locator('input[type="password"]').count() > 0;
    const hasAccessDenied = await page.locator('text=/access denied/i, text=/unauthorized/i, text=/403/i').count() > 0;
    
    console.log(`🔐 Admin access results:`);
    console.log(`   - Redirected to login: ${isLoginPage}`);
    console.log(`   - Has login form: ${hasLoginForm}`);
    console.log(`   - Shows access denied: ${hasAccessDenied}`);
    
    expect(isLoginPage || hasLoginForm || hasAccessDenied).toBeTruthy();
  });

  test('explore quiz functionality', async ({ page }) => {
    console.log('🧠 Exploring quiz functionality...');
    await page.goto('/quizzes');
    
    await page.screenshot({ path: 'test-results/quizzes-page.png', fullPage: true });
    
    await expect(page.locator('body')).toBeVisible();
    
    const title = await page.title();
    console.log(`📄 Quizzes page title: ${title}`);
    
    // Look for quiz-related content
    const quizCards = await page.locator('[data-testid*="quiz"], .quiz, [class*="quiz"]').count();
    const quizLinks = await page.locator('a[href*="/quiz"]').count();
    const quizButtons = await page.locator('button:has-text("Quiz"), button:has-text("Start"), button:has-text("Take")').count();
    
    console.log(`🧠 Quiz content found:`);
    console.log(`   - Quiz cards/items: ${quizCards}`);
    console.log(`   - Quiz links: ${quizLinks}`);
    console.log(`   - Quiz action buttons: ${quizButtons}`);
  });
});



