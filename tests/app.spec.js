import { test, expect } from '@playwright/test';

test.describe('Tic Tac Toe', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads without console errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => {
      if (m.type() === 'error') errors.push(m.text());
    });
    await expect(page.locator('body')).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('alternates turns and displays correct status', async ({ page }) => {
    const status = page.getByTestId('status');
    await expect(status).toHaveText("Player X's turn");
    await page.getByRole('gridcell', { name: 'Row 1, Column 1' }).click();
    await expect(status).toHaveText("Player O's turn");
    await page.getByRole('gridcell', { name: 'Row 1, Column 2' }).click();
    await expect(status).toHaveText("Player X's turn");
  });

  test('detects a win in a row', async ({ page }) => {
    const status = page.getByTestId('status');
    await page.getByRole('gridcell', { name: 'Row 1, Column 1' }).click(); // X
    await page.getByRole('gridcell', { name: 'Row 2, Column 1' }).click(); // O
    await page.getByRole('gridcell', { name: 'Row 1, Column 2' }).click(); // X
    await page.getByRole('gridcell', { name: 'Row 2, Column 2' }).click(); // O
    await page.getByRole('gridcell', { name: 'Row 1, Column 3' }).click(); // X wins
    await expect(status).toHaveText('Player X wins!');
    await expect(page.getByTestId('score-x')).toHaveText('1');
  });

  test('detects a draw', async ({ page }) => {
    const status = page.getByTestId('status');
    const moves = [
      [0, 'X'], [1, 'O'], [2, 'X'],
      [4, 'O'], [3, 'X'], [5, 'O'],
      [7, 'X'], [6, 'O'], [8, 'X']
    ];
    for (const [idx, _] of moves) {
      await page.getByRole('gridcell', { name: `Row ${Math.floor(idx/3)+1}, Column ${idx%3+1}` }).click();
    }
    await expect(status).toHaveText("It's a draw!");
    await expect(page.getByTestId('score-draw')).toHaveText('1');
  });

  test('reset button clears board but keeps scores', async ({ page }) => {
    const status = page.getByTestId('status');
    await page.getByRole('gridcell', { name: 'Row 1, Column 1' }).click(); // X
    await page.getByRole('gridcell', { name: 'Row 1, Column 2' }).click(); // O
    await page.getByRole('gridcell', { name: 'Row 1, Column 3' }).click(); // X
    await page.getByRole('gridcell', { name: 'Row 2, Column 1' }).click(); // O
    await page.getByRole('gridcell', { name: 'Row 2, Column 2' }).click(); // X
    await page.getByRole('gridcell', { name: 'Row 2, Column 3' }).click(); // O
    await page.getByRole('gridcell', { name: 'Row 3, Column 1' }).click(); // X wins
    await expect(status).toHaveText('Player X wins!');
    await page.getByTestId('reset-btn').click();
    await expect(page.getByRole('gridcell', { name: 'Row 1, Column 1' })).toHaveText('');
    await expect(page.getByTestId('score-x')).toHaveText('1');
  });
});
