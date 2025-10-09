import { test, expect } from '@playwright/test';

test.describe('Dashboard tests', () => {
    test('Quick payment with correct data', async ({ page }) => {
        // Arrange
        const url = 'https://demo-bank.vercel.app/';
        const userId = 'UserTest';
        const userPassword = 'Qwerty12';

        const receiverId = '2';
        const transferAmount = '150';
        const transferTitle = 'Nike Shoes';
        const expectedTransferReceiver = 'Chuck Demobankowy';

        // Act
        await page.goto(url);
        await page.getByTestId('login-input').fill(userId);
        await page.getByTestId('password-input').fill(userPassword);
        await page.getByTestId('login-button').click();

        await page.locator('#widget_1_transfer_receiver').selectOption(receiverId);
        await page.locator('#widget_1_transfer_amount').fill(transferAmount);
        await page.locator('#widget_1_transfer_title').fill(transferTitle);

        await page.getByRole('button', { name: 'wykonaj' }).click();
        await page.getByTestId('close-button').click();

        // Assert
        await expect(page.locator('#show_messages')).toHaveText(
            `Przelew wykonany! ${expectedTransferReceiver} - 150,00PLN - Nike Shoes`
        );
    });
});