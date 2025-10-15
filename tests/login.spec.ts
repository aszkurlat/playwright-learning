import { test, expect } from '@playwright/test';
import { loginData } from '../test-data/login.data';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';

test.describe('User login to Demobank', () => {

  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    loginPage = new LoginPage(page);
  });

  test('Successful login with correct credentials', { tag: ["@login", "@smoke"], annotation: { type: 'Happy path', description: "Basic happy path test for login" }  }, async ({ page }) => {
    // Act
    await loginPage.login(loginData.userId, loginData.userPassword);

    // Assert
    const dashboardPage = new DashboardPage(page);
    await expect(dashboardPage.userNameText).toHaveText(loginData.expectedUserName);
  });

  test('Unsuccessful login with too short username', { tag: ["@login", "@unhappy_path"] }, async () => {
    // Act
    await loginPage.loginInput.fill(loginData.incorrectLogin)
    await loginPage.passwordInput.click();

    //Assert
    await expect(loginPage.loginError).toHaveText(loginData.expectedErrorMessage);
  });

  test('Unsuccessful login with too short password', { tag: ["@login", "@unhappy_path"] }, async () => {
    // Act
    await loginPage.loginInput.fill(loginData.userId);
    await loginPage.passwordInput.fill(loginData.incorrectPassword);
    await loginPage.passwordInput.blur();

    // Assert
    await expect(loginPage.passwordError).toHaveText(loginData.expectedPasswordErrorMessage);
  });
});