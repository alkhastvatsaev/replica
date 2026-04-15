import { test, expect } from '@playwright/test';

test.describe('Interface Mobile - MAISON 7', () => {

  test('devrait afficher le logo MAISON 7 correctement', async ({ page }) => {
    await page.goto('/');
    
    const logoTop = page.locator('.logo-top');
    const logoBottom = page.locator('.logo-bottom');
    
    await expect(logoTop).toHaveText('MAISON');
    await expect(logoBottom).toHaveText('7');
    await expect(logoTop).toBeVisible();
  });

  test('devrait charger les produits Cartier', async ({ page }) => {
    await page.goto('/');
    
    // On attend que les produits soient rendus par le JS
    const firstProduct = page.locator('.product-card').first();
    await expect(firstProduct).toBeVisible();
    
    const productTitle = page.locator('h2').first();
    await expect(productTitle).not.toBeEmpty();
  });

  test('le bouton COMMANDER devrait générer un lien WhatsApp valide', async ({ page }) => {
    await page.goto('/');
    
    // On cherche le bouton du premier produit
    const buyBtn = page.locator('.wa-buy-btn').first();
    await expect(buyBtn).toBeVisible();
    
    // On vérifie que le bouton contient bien le texte traduit
    const btnText = await buyBtn.innerText();
    expect(btnText.trim()).toBe('COMMANDER');
  });

  test('le layout ne devrait pas déborder à droite (no overflow)', async ({ page }) => {
    await page.goto('/');
    
    // On vérifie si la page est scrollable horizontalement (signe de bug de layout)
    const isHorizontalScrollable = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    
    expect(isHorizontalScrollable).toBe(false);
  });

});
