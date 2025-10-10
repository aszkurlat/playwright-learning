import { test, expect } from '@playwright/test';
import { userLogin } from '../test-data/login.data';

test.describe('User login to Demobank', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });
  test('Successful login with correct credentials', async ({ page }) => {
    // Arrange
    const expectedUserName = "Jan Demobankowy";

    // Act
    await page.getByTestId('login-input').fill(userLogin.userId);
    await page.getByTestId('password-input').fill(userLogin.userPassword);
    await page.getByTestId('login-button').click();

    // Assert
    await expect(page.getByTestId('user-name')).toHaveText(expectedUserName);
  });

  test('Unsuccessful login with too short username', async ({ page }) => {
    // Arrange
    const userId = 'User';
    const expectedErrorMessage = 'identyfikator ma min. 8 znaków';

    // Act
    await page.getByTestId('login-input').fill(userId);
    await page.getByTestId('password-input').click();


    //Assert
    await expect(page.getByTestId('error-login-id')).toHaveText(
      expectedErrorMessage
    );
  });

  test('Unsuccessful login with too short password', async ({ page }) => {
    // Arrange
    const userId = 'User1';
    const userPassword = 'Qwe';
    const expectedErrorMessage = 'hasło ma min. 8 znaków';

    // Act

    await page.getByTestId('login-input').fill(userId);
    await page.getByTestId('password-input').fill(userPassword);
    await page.getByTestId('password-input').blur();

    // Assert
    await expect(page.getByTestId('error-login-password')).toHaveText(expectedErrorMessage);
  });
});