import { test, expect } from '@playwright/test';
import { userLogin } from '../test-data/login.data';
import { LoginPage } from '../pages/login.page';


test.describe('Payment tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        const loginPage = new LoginPage(page);
        await loginPage.loginInput.fill(userLogin.userId);
        await loginPage.passwordInput.fill(userLogin.userPassword);
        await loginPage.loginButton.click();

        await page.getByRole('link', { name: 'płatności' }).click();
    });

    test('Simple payment', async ({ page }) => {
        // Arrange
        const transferReceiver = 'Jan Nowak';
        const transferAccount = '12 3456 7890 1234 5678 9012 34568';
        const transferAmount = '222';
        const expectedMessage = `Przelew wykonany! ${transferAmount},00PLN dla Jan Nowak`;

        // Act
        await page.getByTestId('transfer_receiver').fill(transferReceiver);
        await page.getByTestId('form_account_to').fill(transferAccount);
        await page.getByTestId('form_amount').fill(transferAmount);
        await page.getByRole('button', { name: 'wykonaj przelew' }).click();
        await page.getByTestId('close-button').click();

        // Assert
        await expect(page.locator('#show_messages')).toHaveText(expectedMessage);
    });
});