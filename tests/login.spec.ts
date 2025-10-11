import { test, expect } from '@playwright/test';
import { userLogin } from '../test-data/login.data';
import { LoginPage } from '../pages/login.page';

test.describe('User login to Demobank', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test('Successful login with correct credentials', async ({ page }) => {
    // Arrange
    const expectedUserName = "Jan Demobankowy";

    // Act
    const loginPage = new LoginPage(page);
    await loginPage.loginInput.fill(userLogin.userId);
    await loginPage.passwordInput.fill(userLogin.userPassword);
    await loginPage.loginButton.click();

    // Assert
    await expect(page.getByTestId('user-name')).toHaveText(expectedUserName);
  });

  test('Unsuccessful login with too short username', async ({ page }) => {
    // Arrange
    const incorrectLogin = 'User';
    const expectedErrorMessage = 'identyfikator ma min. 8 znaków';
    const loginPage = new LoginPage(page);
    // Act
    await loginPage.loginInput.fill(incorrectLogin)
    await loginPage.passwordInput.click();


    //Assert
    await expect(loginPage.loginError).toHaveText(expectedErrorMessage);
  });

  test('Unsuccessful login with too short password', async ({ page }) => {
    // Arrange
    const incorrectPassword = 'Qwe';
    const expectedErrorMessage = 'hasło ma min. 8 znaków';

    const loginPage = new LoginPage(page);
    // Act
    await loginPage.loginInput.fill(userLogin.userId);
    await loginPage.passwordInput.fill(incorrectPassword);
    await loginPage.passwordInput.blur();

    // Assert
    await expect(loginPage.passwordError).toHaveText(expectedErrorMessage);
  });
});