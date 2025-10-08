import { test, expect } from '@playwright/test';

test.describe('User login to Demobank', () => {
  test('successful login with correct credentials', async ({ page }) => {
    await page.goto('https://demo-bank.vercel.app/');
    await page.getByTestId('login-input').fill('UserTest');
    await page.getByTestId('password-input').fill('Qwerty12');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('user-name')).toHaveText('Jan Demobankowy');
  });

  test('Unsuccessful login with too short username', async ({ page }) => {
    await page.goto('https://demo-bank.vercel.app/');
    await page.getByTestId('login-input').fill('User1');
    await page.getByTestId('password-input').click();

    await expect(page.getByTestId('error-login-id')).toHaveText(
      'identyfikator ma min. 8 znaków'
    );
  });

  test('Unsuccessful login with too short password', async ({ page }) => {
    await page.goto('https://demo-bank.vercel.app/');
    await page.getByTestId('login-input').fill('User1');
    await page.getByTestId('password-input').fill('Qwe');
    await page.getByTestId('password-input').blur();

    await expect(page.getByTestId('error-login-password')).toHaveText(
      'hasło ma min. 8 znaków'
    );
  });
});