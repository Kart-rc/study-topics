// Historical bundles need explicit coverage: the main smoke suite selects the newest day.
const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');

for (const day of ['Day1', 'Day15']) {
  const lessons = JSON.parse(fs.readFileSync(path.join(root, day, 'lessons.json'), 'utf8'));
  for (const lesson of lessons) {
    test(`${day}/${lesson.slug}: practical use case fits the viewport`, async ({ page }, testInfo) => {
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const response = await page.goto(`/${day}/${lesson.slug}.html`);
      expect(response.status()).toBe(200);
      const section = page.locator('.use-case');
      await section.scrollIntoViewIfNeeded();
      await expect(section.getByRole('heading', { name: 'Use case: when to use this' })).toBeVisible();
      for (const key of ['when', 'example', 'decision']) {
        expect(lesson.use_case[key].trim()).not.toBe('');
        await expect(section).toContainText(lesson.use_case[key]);
      }
      await expect(section).toContainText('Part of the 4-minute explanation.');
      const overflow = await page.evaluate(() => {
        const width = document.documentElement.clientWidth;
        const section = document.querySelector('.use-case').getBoundingClientRect();
        return { document: document.documentElement.scrollWidth - width,
          left: section.left, right: section.right, width };
      });
      expect(overflow.document).toBeLessThanOrEqual(1);
      expect(overflow.left).toBeGreaterThanOrEqual(0);
      expect(overflow.right).toBeLessThanOrEqual(overflow.width + 1);
      expect(errors).toEqual([]);
      await section.screenshot({ path: testInfo.outputPath('use-case.png') });
    });
  }
}
