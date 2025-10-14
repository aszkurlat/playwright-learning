import { test, expect } from '@playwright/test';
import { loginData } from '../test-data/login.data';
import { LoginPage } from '../pages/login.page';
import { paymentData } from '../test-data/payment.data';
import { PaymentPage } from '../pages/payment.page';
import { DashboardPage } from '../pages/dashboard.page';


test.describe('Payment tests', () => {
    let paymentPage: PaymentPage;

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        paymentPage = new PaymentPage(page);
        const dashboardPage = new DashboardPage(page);
        const loginPage = new LoginPage(page);

        await loginPage.login(loginData.userId, loginData.userPassword);
        await dashboardPage.sideMenu.paymentButton.click();

    });

    test('Simple payment', async () => {
        // Arrange
        const expectedMessage = `Przelew wykonany! ${paymentData.transferAmount},00PLN dla ${paymentData.transferReceiver}`;

        // Act
        paymentPage.makeTransfer(paymentData.transferReceiver, paymentData.transferAccount, paymentData.transferAmount);
        // await paymentPage.transferReceiverInput.fill(paymentData.transferReceiver);

        // await paymentPage.transferToInput.fill(paymentData.transferAccount);
        // await paymentPage.transferAmountInput.fill(paymentData.transferAmount);
        // await paymentPage.transferButton.click();
        // await paymentPage.actionCloseButton.click();

        // Assert
        await expect(paymentPage.messageText).toHaveText(expectedMessage);
    });
});