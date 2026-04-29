import { test, expect } from '@playwright/test';

test.describe('Habit Management', () => {
  test.describe.configure({ mode: 'serial' });
  test.beforeEach(async ({ page }) => {
    // Signup and login
    await page.goto('/auth/signup');
    const email = `habit-test-${Math.random().toString(36).substring(7)}@example.com`;
    await page.fill('input[placeholder="John Doe"]', 'Habit Tester');
    await page.getByTestId('auth-signup-email').fill(email);
    await page.getByTestId('auth-signup-password').fill('password123');
    await page.getByTestId('auth-signup-submit').click();
    await expect(page.getByTestId('dashboard-page')).toBeVisible({ timeout: 10000 });
  });

  test('should create a new habit', async ({ page }) => {
    await page.getByTestId('crate-habit-button').click();
    
    await page.getByTestId('habit-name-input').fill('Morning Jog');
    await page.getByTestId('habit-description-input').fill('5km run around the lake');
    await page.getByTestId('habit-frequency-select').selectOption('daily');
    
    await page.getByTestId('habit-save-button').click();
    
    // Check if habit card exists
    await expect(page.getByTestId('habit-edit-morning-jog')).toBeVisible();
  });

  test('should delete a habit', async ({ page }) => {
    // Create first
    await page.getByTestId('crate-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Delete Me');
    await page.getByTestId('habit-save-button').click();
    
    const habitSlug = 'delete-me';
    await expect(page.getByTestId(`habit-edit-${habitSlug}`)).toBeVisible();
    
    // Click delete icon
    await page.getByTestId(`habit-edit-${habitSlug}`).hover();
    await page.getByTestId(`habit-delete-btn-${habitSlug}`).click();
    
    // Confirm delete
    await expect(page.getByText('Delete Habit?')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('confirm-delete-button').click();
    
    // Check it's gone
    await expect(page.getByTestId(`habit-edit-${habitSlug}`)).not.toBeVisible();
  });
});
