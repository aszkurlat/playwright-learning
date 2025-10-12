import { test, expect } from '@playwright/test';
import { dashboardData } from '../test-data/dashboard.data';
import { DashboardPage } from '../pages/dashboard.page';

test.describe('Dashboard tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await page.getByTestId('login-input').fill(dashboardData.userId);
        await page.getByTestId('password-input').fill(dashboardData.userPassword);
        await page.getByTestId('login-button').click();

        await page.waitForURL('https://demo-bank.vercel.app/pulpit.html');
    })

    test('Quick payment with correct data', async ({ page }) => {

        // Act
        const dashboardPage = new DashboardPage(page);
        await dashboardPage.transferReceiverInput.selectOption(dashboardData.receiverId);
        await dashboardPage.transferAmountInput.fill(dashboardData.transferAmount);
        await dashboardPage.transferTitleInput.fill(dashboardData.transferTitle);
        await dashboardPage.transferButton.click();
        await dashboardPage.actionCloseButton.click();

        // Assert
        await expect(dashboardPage.messageText).toHaveText(
            `Przelew wykonany! ${dashboardData.expectedTransferReceiver} -  ${dashboardData.transferAmount},00PLN - ${dashboardData.transferTitle}`
        );
    });

    test('Successful mobile top-up', async ({ page }) => {
        // Arrange
        const expectedMessage = `Doładowanie wykonane! ${dashboardData.topUpAmount},00PLN na numer ${dashboardData.topUpReceiver}`;

        // Act
        const dashboardPage = new DashboardPage(page);
        await dashboardPage.topUpReceiverInput.selectOption(dashboardData.topUpReceiver);
        await dashboardPage.topUpAmountInput.fill(dashboardData.topUpAmount);
        await dashboardPage.topUpAgreementCheckbox.click();

        await dashboardPage.topUpExecuteButton.click();
        await dashboardPage.actionCloseButton.click();

        // Assert
        await expect(dashboardPage.messageText).toHaveText(expectedMessage);
    });

    test('Correct balance after successful mobile top-up', async ({ page }) => {
        // Arrange
        const dashboardPage = new DashboardPage(page);
        const initialBalance = await dashboardPage.moneyValueText.innerText();
        const expectedBalance = Number(initialBalance) - Number(dashboardData.topUpAmount);

        // Act
        await dashboardPage.topUpReceiverInput.selectOption(dashboardData.topUpReceiver);
        await dashboardPage.topUpAmountInput.fill(dashboardData.topUpAmount);
        await dashboardPage.topUpAgreementCheckbox.click();

        await dashboardPage.topUpExecuteButton.click();
        await dashboardPage.actionCloseButton.click();

        // Assert
        await expect(dashboardPage.moneyValueText).toHaveText(`${expectedBalance}`);
    });
});