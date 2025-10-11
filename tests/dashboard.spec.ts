import { test, expect } from '@playwright/test';

test.describe('Dashboard tests', () => {
    const userId = 'UserTest';
    const userPassword = 'Qwerty12';

    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await page.getByTestId('login-input').fill(userId);
        await page.getByTestId('password-input').fill(userPassword);
        await page.getByTestId('login-button').click();

        await page.waitForURL('https://demo-bank.vercel.app/pulpit.html');
    })

    test('Quick payment with correct data', async ({ page }) => {
        // Arrange
        const receiverId = '2';
        const transferAmount = '150';
        const transferTitle = 'Nike Shoes';
        const expectedTransferReceiver = 'Chuck Demobankowy';

        // Act
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

    test('Successful mobile top-up', async ({ page }) => {
        // Arrange
        const topUpReceiver = '500 xxx xxx';
        const topUpAmount = '50';
        const expectedMessage = `Doładowanie wykonane! ${topUpAmount},00PLN na numer ${topUpReceiver}`;

        // Act
        await page.locator('#widget_1_topup_receiver').selectOption(topUpReceiver);
        await page.locator('#widget_1_topup_amount').fill(topUpAmount);
        await page.locator('#uniform-widget_1_topup_agreement span').click();
        await page.getByRole('button', { name: 'doładuj telefon' }).click();
        await page.getByTestId('close-button').click();

        // Assert
        await expect(page.locator('#show_messages')).toHaveText(expectedMessage);
    });

    test('Correct balance after successful mobile top-up', async ({ page }) => {
        // Arrange
        const topUpReceiver = '500 xxx xxx';
        const topUpAmount = '50';
        const initialBalance = await page.locator('#money_value').innerText();
        const expectedBalance = Number(initialBalance) - Number(topUpAmount);

        // Act
        await page.locator('#widget_1_topup_receiver').selectOption(topUpReceiver);
        await page.locator('#widget_1_topup_amount').fill(topUpAmount);
        await page.locator('#uniform-widget_1_topup_agreement span').click();
        await page.getByRole('button', { name: 'doładuj telefon' }).click();
        await page.getByTestId('close-button').click();

        // Assert
        await expect(page.locator('#money_value')).toHaveText(`${expectedBalance}`);
    });
});