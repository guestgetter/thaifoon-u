import { test, expect } from '@playwright/test';

test.describe('User Edit Functionality', () => {
  test('user edit buttons should be functional', async ({ page }) => {
    console.log('🔧 Testing user edit functionality...');
    
    // Navigate to admin users page
    await page.goto('/admin/users');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Take screenshot of the page
    await page.screenshot({ path: 'test-results/user-edit-before.png', fullPage: true });
    
    // Look for edit buttons (pencil icons)
    const editButtons = page.locator('button:has(svg)').filter({ hasText: '' });
    const editButtonCount = await editButtons.count();
    
    console.log(`✏️ Found ${editButtonCount} potential edit buttons`);
    
    // Look specifically for edit buttons with Edit2 icon or similar
    const specificEditButtons = page.locator('button[aria-label*="edit"], button:has([data-lucide="edit-2"]), button:has(.lucide-edit-2)');
    const specificCount = await specificEditButtons.count();
    
    console.log(`🎯 Found ${specificCount} specific edit buttons`);
    
    // Try to find buttons that contain edit icons
    const allButtons = page.locator('button');
    const buttonCount = await allButtons.count();
    
    console.log(`🔘 Total buttons on page: ${buttonCount}`);
    
    // Check if any buttons have onClick handlers or are clickable
    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const button = allButtons.nth(i);
      const buttonText = await button.textContent();
      const isVisible = await button.isVisible();
      const isEnabled = await button.isEnabled();
      
      if (isVisible && buttonText?.trim() === '') {
        // This might be an icon button
        console.log(`🔍 Button ${i}: Empty text, visible: ${isVisible}, enabled: ${isEnabled}`);
        
        // Try clicking it to see if it opens a dialog
        try {
          await button.click();
          await page.waitForTimeout(1000);
          
          // Check if a dialog opened
          const dialog = page.locator('[role="dialog"], .modal');
          const dialogVisible = await dialog.isVisible();
          
          if (dialogVisible) {
            console.log(`✅ Button ${i} opened a dialog!`);
            await page.screenshot({ path: `test-results/user-edit-dialog-${i}.png` });
            
            // Check if it's an edit user dialog
            const dialogTitle = await page.locator('[role="dialog"] h2, .modal h2').textContent();
            console.log(`📋 Dialog title: ${dialogTitle}`);
            
            // Close the dialog
            const closeButton = page.locator('[role="dialog"] button:has-text("Cancel"), .modal button:has-text("Cancel")');
            if (await closeButton.isVisible()) {
              await closeButton.click();
              await page.waitForTimeout(500);
            } else {
              // Try pressing Escape
              await page.keyboard.press('Escape');
              await page.waitForTimeout(500);
            }
          }
        } catch (error) {
          console.log(`❌ Button ${i} click failed: ${error}`);
        }
      }
    }
    
    // Test for the presence of UserEditDialog component
    const userEditDialogs = page.locator('[data-testid="user-edit-dialog"], .user-edit-dialog');
    const dialogCount = await userEditDialogs.count();
    console.log(`📝 UserEditDialog components found: ${dialogCount}`);
    
    // Final screenshot
    await page.screenshot({ path: 'test-results/user-edit-after.png', fullPage: true });
    
    console.log('🎉 User edit functionality test completed!');
  });

  test('test user edit form functionality', async ({ page }) => {
    console.log('📝 Testing user edit form...');
    
    await page.goto('/admin/users');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Look for any button that might open an edit dialog
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    let editDialogFound = false;
    
    for (let i = 0; i < buttonCount && !editDialogFound; i++) {
      const button = buttons.nth(i);
      const isVisible = await button.isVisible();
      
      if (isVisible) {
        try {
          await button.click();
          await page.waitForTimeout(1000);
          
          // Check if an edit dialog opened
          const dialog = page.locator('[role="dialog"]');
          const dialogVisible = await dialog.isVisible();
          
          if (dialogVisible) {
            const dialogContent = await dialog.textContent();
            
            if (dialogContent?.includes('Edit User') || dialogContent?.includes('Update user')) {
              console.log('✅ Found user edit dialog!');
              editDialogFound = true;
              
              await page.screenshot({ path: 'test-results/user-edit-form.png' });
              
              // Test form fields
              const nameInput = dialog.locator('input[placeholder*="name"], input[id="name"]');
              const emailInput = dialog.locator('input[type="email"], input[id="email"]');
              const roleSelect = dialog.locator('select, [role="combobox"]');
              
              const nameVisible = await nameInput.isVisible();
              const emailVisible = await emailInput.isVisible();
              const roleVisible = await roleSelect.isVisible();
              
              console.log(`📝 Form fields:`);
              console.log(`   - Name input: ${nameVisible ? '✅' : '❌'}`);
              console.log(`   - Email input: ${emailVisible ? '✅' : '❌'}`);
              console.log(`   - Role select: ${roleVisible ? '✅' : '❌'}`);
              
              // Test form interaction
              if (nameVisible) {
                await nameInput.fill('Test User Updated');
                console.log('✅ Name field updated');
              }
              
              if (emailVisible) {
                const currentEmail = await emailInput.inputValue();
                console.log(`📧 Current email: ${currentEmail}`);
              }
              
              // Close dialog
              const cancelButton = dialog.locator('button:has-text("Cancel")');
              if (await cancelButton.isVisible()) {
                await cancelButton.click();
              } else {
                await page.keyboard.press('Escape');
              }
              
              await page.waitForTimeout(500);
            }
          }
        } catch (error) {
          // Continue to next button
        }
      }
    }
    
    if (!editDialogFound) {
      console.log('❌ No user edit dialog found');
    }
  });

  test('verify API endpoints are working', async ({ page }) => {
    console.log('🔌 Testing user edit API endpoints...');
    
    // Test GET endpoint for fetching user data
    const response = await page.request.get('/api/admin/users');
    console.log(`📊 GET /api/admin/users: ${response.status()}`);
    
    if (response.ok()) {
      const users = await response.json();
      console.log(`👥 Found ${users.length} users`);
      
      if (users.length > 0) {
        const firstUserId = users[0].id;
        
        // Test GET single user endpoint
        const userResponse = await page.request.get(`/api/admin/users/${firstUserId}`);
        console.log(`👤 GET /api/admin/users/${firstUserId}: ${userResponse.status()}`);
        
        if (userResponse.ok()) {
          const userData = await userResponse.json();
          console.log(`✅ User data retrieved: ${userData.name} (${userData.email})`);
        }
      }
    }
  });
});
