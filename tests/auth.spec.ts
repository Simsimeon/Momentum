import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.describe.configure({ mode: 'serial' });
  test('should sign up a new user', async ({ page }) => {
    await page.goto('/auth/signup');
    
    const email = `test-${Math.random().toString(36).substring(7)}@example.com`;
    
    await page.fill('input[placeholder="John Doe"]', 'Test User');
    await page.getByTestId('auth-signup-email').fill(email);
    await page.getByTestId('auth-signup-password').fill('password123');
    
    await page.getByTestId('auth-signup-submit').click();
    
    // Should be redirected to dashboard
    await expect(page.getByTestId('dashboard-page')).toBeVisible({ timeout: 10000 });
  });

  test('should log in with existing user', async ({ page }) => {
    // First signup a user to ensure they exist (since store is local/persisted in browser)
    await page.goto('/auth/signup');
    const email = `login-${Math.random().toString(36).substring(7)}@example.com`;
    await page.fill('input[placeholder="John Doe"]', 'Login User');
    await page.getByTestId('auth-signup-email').fill(email);
    await page.getByTestId('auth-signup-password').fill('password123');
    await page.getByTestId('auth-signup-submit').click();
    
    // Logout
    await page.getByTestId('auth-logout-button').click();
    
    // Now try to log in
    await page.goto('/auth/login');
    await page.getByTestId('auth-login-email').fill(email);
    // Note: there was a typo in data-testid in the user's change: data-test-id="auth-login-password"
    // Let me check LoginForm.tsx to be sure.
    await page.getByTestId('auth-login-password').fill('password123');
    await page.getByTestId('auth-login-submit').click();
    
    await expect(page.getByTestId('dashboard-page')).toBeVisible({ timeout: 10000 });
  });

  test('should show splash screen on home page', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('splash-screen')).toBeVisible();
  });
});
