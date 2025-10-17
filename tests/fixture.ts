import { test as base, expect } from '@playwright/test';

export const test = base.extend({
    page: async ({ page }, use) => {
        const errors: string[] = [];

        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                errors.push(`Console error: ${msg.text()}`);
            }
        });

        page.on('pageerror', (err) => {
            errors.push(`Page error: ${err.message}`);
        });

        page.on('response', (res) => {
            if (res.status() >= 400) {
                errors.push(`HTTP ${res.status()}: ${res.url()}`);
            }
        });

        page.on('dialog', (dialog) => {
            errors.push(`Unexpected dialog: ${dialog.message()}`);
            dialog.dismiss();
        });

        await use(page);

        expect(errors, `Errors captured during test:\n${errors.join('\n')}`).toEqual([]);
    }
});
