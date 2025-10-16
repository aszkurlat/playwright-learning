import { test, expect } from '@playwright/test';
import { dashboardData } from '../test-data/dashboard.data';
import { DashboardPage } from '../pages/dashboard.page';
import { LoginPage } from '../pages/login.page';
import { loginData } from '../test-data/login.data';

test.describe('Dashboard tests', () => {
    test.describe.configure({ retries: 3 });
    let dashboardPage: DashboardPage;
    test.beforeEach(async ({ page }) => {

        await page.goto("/");

        dashboardPage = new DashboardPage(page);
        const loginPage = new LoginPage(page);

        await loginPage.login(loginData.userId, loginData.userPassword);
    })

    test.only('Quick payment with correct data', { tag: ["@dashboard", "@integration"], annotation: { type: 'documentation', description: 'https://jaktestowac.pl/course/playwright-wprowadzenie/' } }, async ({ page }) => {

        // Act
        await page.waitForLoadState('domcontentloaded'); // ensure DOM is loaded (smart wait instead of static delay)
        await dashboardPage.executeQuickPayment(dashboardData.receiverId, dashboardData.transferAmount, dashboardData.transferTitle);

        // Assert
        await expect(dashboardPage.messageText).toHaveText(
            `Przelew wykonany! ${dashboardData.expectedTransferReceiver} -  ${dashboardData.transferAmount},00PLN - ${dashboardData.transferTitle}`
        );
    });

    test('Successful mobile top-up', { tag: ["@dashboard", "@integration"] }, async () => {
        // Arrange
        const expectedMessage = `Doładowanie wykonane! ${dashboardData.topUpAmount},00PLN na numer ${dashboardData.topUpReceiver}`;

        // Act
        await dashboardPage.executeMobileTopUp(dashboardData.topUpReceiver, dashboardData.topUpAmount);

        // Assert
        await expect(dashboardPage.messageText).toHaveText(expectedMessage);
    });

    test('Correct balance after successful mobile top-up', { tag: ["@dashboard", "@integration"] }, async () => {
        // Arrange
        const initialBalance = await dashboardPage.moneyValueText.innerText();
        const expectedBalance = Number(initialBalance) - Number(dashboardData.topUpAmount);

        // Act
        await dashboardPage.executeMobileTopUp(dashboardData.topUpReceiver, dashboardData.topUpAmount);

        // Assert
        await expect(dashboardPage.moneyValueText).toHaveText(`${expectedBalance}`);
    });
});