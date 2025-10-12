import { test, expect } from '@playwright/test';
import { loginData } from '../test-data/login.data';
import { LoginPage } from '../pages/login.page';

test.describe('User login to Demobank', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test('Successful login with correct credentials', async ({ page }) => {
    // Act
    const loginPage = new LoginPage(page);
    await loginPage.loginInput.fill(loginData.userId);
    await loginPage.passwordInput.fill(loginData.userPassword);
    await loginPage.loginButton.click();

    // Assert
    await expect(loginPage.userName).toHaveText(loginData.expectedUserName);
  });

  test('Unsuccessful login with too short username', async ({ page }) => {
    const loginPage = new LoginPage(page);
    // Act
    await loginPage.loginInput.fill(loginData.incorrectLogin)
    await loginPage.passwordInput.click();

    //Assert
    await expect(loginPage.loginError).toHaveText(loginData.expectedErrorMessage);
  });

  test('Unsuccessful login with too short password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    // Act
    await loginPage.loginInput.fill(loginData.userId);
    await loginPage.passwordInput.fill(loginData.incorrectPassword);
    await loginPage.passwordInput.blur();

    // Assert
    await expect(loginPage.passwordError).toHaveText(loginData.expectedPasswordErrorMessage);
  });
});