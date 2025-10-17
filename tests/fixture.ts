import { test as base, expect } from '@playwright/test';

export const test = base.extend({
    page: async ({ page }, use) => {
        const errors: string[] = [];

        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                errors.push(`Error message: ${msg.text()}`);
            }
        });

        await use(page);

        expect(errors, `There were console errors:\n${errors.join('\n')}`).toEqual([]);
    }
});
