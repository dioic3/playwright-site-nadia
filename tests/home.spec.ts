import { test, expect } from '@playwright/test';

test.describe('Home page - nahlacerda.com.br', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads successfully with the expected title', async ({ page }) => {
    await expect(page).toHaveTitle('Nádia Lacerda');
  });

  test('has the expected meta description', async ({ page }) => {
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute(
      'content',
      'Nádia Lacerda — estrategista de redes sociais.'
    );
  });

  test('has the expected Open Graph metadata', async ({ page }) => {
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      'Nádia Lacerda — Estrategista de Redes Sociais'
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      'https://nahlacerda.com.br/og-image.jpg'
    );
  });

  test('declares Portuguese (Brazil) as the page language', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  });

  test('renders visible content after the initial loader finishes', async ({ page }) => {
    const loader = page.locator('#initial-loader');
    await expect(loader).toBeHidden({ timeout: 15000 });
    await expect(page.locator('body')).toBeVisible();
  });

  test('has no horizontal overflow on a mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.reload();
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });

  test('produces no unexpected console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(errors).toEqual([]);
  });
});
