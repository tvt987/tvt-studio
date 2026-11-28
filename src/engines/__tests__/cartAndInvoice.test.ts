import { describe, expect, it } from 'vitest';
import { CATALOG_PRODUCTS } from '../catalog';
import {
  addCustomScopeToCart,
  addTemplateToCart,
  calculateCartTotals,
  generateOrderCode,
  removeCartItem,
  switchTemplateLicenseInCart,
  updateCartQuantity,
} from '../cart';
import {
  buildMailtoOrderUrl,
  buildZaloDirectUrl,
  createOrderSnapshot,
  generateOrderInvoiceMarkdown,
} from '../invoice';

describe('Cart, Deposit & Digital Contract Invoice Engine', () => {
  const maison = CATALOG_PRODUCTS.find((p) => p.id === 'maison-vera')!;
  const lumina = CATALOG_PRODUCTS.find((p) => p.id === 'lumina-medspa')!;

  it('merges identical product + license additions and separates different license tiers', () => {
    let cart = addTemplateToCart([], maison, 'standard');
    cart = addTemplateToCart(cart, maison, 'standard');
    cart = addTemplateToCart(cart, maison, 'full-source');

    expect(cart).toHaveLength(2);
    expect(cart[0].quantity).toBe(2);
    expect(cart[1].quantity).toBe(1);
  });

  it('switches license tier inside cart and merges colliding lines cleanly', () => {
    let cart = addTemplateToCart([], maison, 'standard');
    const stdKey = cart[0].cartKey;

    cart = switchTemplateLicenseInCart(cart, stdKey, 'full-source', CATALOG_PRODUCTS);
    expect(cart).toHaveLength(1);
    expect(cart[0].kind === 'template' && cart[0].license).toBe('full-source');
    expect(cart[0].unitVnd).toBe(2_330_000);

    // Add another standard line, then upgrade it -> should merge quantities to 2
    cart = addTemplateToCart(cart, maison, 'standard');
    const newStdKey = cart.find((i) => i.kind === 'template' && i.license === 'standard')!.cartKey;
    cart = switchTemplateLicenseInCart(cart, newStdKey, 'full-source', CATALOG_PRODUCTS);
    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(2);
  });

  it('adds custom scope builds, increments/decrements quantities, and removes zero-qty lines', () => {
    let cart = addCustomScopeToCart([], {
      projectType: 'starter-landing',
      selectedAddons: ['bilingual-i18n', 'seo-cwv'],
      pace: 'standard',
      projectName: 'Apex Studio',
    });
    expect(cart).toHaveLength(1);
    expect(cart[0].unitVnd).toBe(1_200_000 + 400_000 + 300_000);

    const key = cart[0].cartKey;
    cart = updateCartQuantity(cart, key, 1);
    expect(cart[0].quantity).toBe(2);

    cart = updateCartQuantity(cart, key, -2);
    expect(cart).toHaveLength(0);

    cart = addTemplateToCart([], lumina, 'standard');
    cart = removeCartItem(cart, cart[0].cartKey);
    expect(cart).toHaveLength(0);
  });

  it('calculates full (100%) vs deposit (30%) totals accurately with active promo code', () => {
    let cart = addTemplateToCart([], maison, 'standard');
    cart = addTemplateToCart(cart, lumina, 'standard');

    const fullTotals = calculateCartTotals(cart, 'VIP500K', 'full');
    expect(fullTotals.subtotalVnd).toBe(1_790_000 + 1_290_000);
    expect(fullTotals.discountVnd).toBe(500_000);
    expect(fullTotals.netTotalVnd).toBe(2_580_000);
    expect(fullTotals.payableNowVnd).toBe(2_580_000);
    expect(fullTotals.remainingVnd).toBe(0);

    const depositTotals = calculateCartTotals(cart, 'VIP500K', 'deposit-30');
    expect(depositTotals.netTotalVnd).toBe(2_580_000);
    expect(depositTotals.payableNowVnd + depositTotals.remainingVnd).toBe(
      depositTotals.netTotalVnd
    );
    expect(depositTotals.payableNowUsd + depositTotals.remainingUsd).toBe(
      depositTotals.netTotalUsd
    );
    expect(depositTotals.payableNowVnd).toBe(770_000);
  });

  it('generates standardized TVT-ORD-XXXX transfer memos', () => {
    const code = generateOrderCode(4281);
    expect(code).toMatch(/^TVT-ORD-\d{4}$/);
    const randomCode = generateOrderCode();
    expect(randomCode).toMatch(/^TVT-ORD-\d{4}$/);
  });

  it('generates Markdown contract receipts and pre-filled mailto / Zalo links', () => {
    const cart = addTemplateToCart([], maison, 'full-source');
    const totals = calculateCartTotals(cart, 'TVTLAUNCH15', 'deposit-30');
    const order = createOrderSnapshot({
      orderCode: 'TVT-ORD-7741',
      currency: 'VND',
      paymentChannel: 'zalopay',
      client: {
        fullName: 'Nguyen Minh Anh',
        phoneOrZalo: '0909 123 456',
        email: 'minhanh@maison.vn',
        brandOrDomain: 'maisonanh.vn',
        notes: 'Can tich hop them thanh toan VietQR',
      },
      items: cart,
      totals,
      createdAtIso: '2026-11-26T13:30:00.000Z',
    });

    const mdVi = generateOrderInvoiceMarkdown(order, 'vi');
    expect(mdVi).toContain('TVT-ORD-7741');
    expect(mdVi).toContain('Nguyen Minh Anh');
    expect(mdVi).toContain('TVTLAUNCH15');
    expect(mdVi).toContain('0931 467 024');
    expect(mdVi).toContain('Full Source + Custom Brand');

    const mdEn = generateOrderInvoiceMarkdown(order, 'en');
    expect(mdEn).toContain('ORDER RECEIPT & DIGITAL CONTRACT BRIEF');
    expect(mdEn).toContain('30% Kickoff Deposit');

    const mailtoUrl = buildMailtoOrderUrl(order, 'vi');
    expect(mailtoUrl.startsWith('mailto:tinhkun102@gmail.com?subject=')).toBe(true);
    expect(decodeURIComponent(mailtoUrl)).toContain('TVT-ORD-7741');
    expect(buildZaloDirectUrl()).toBe('https://zalo.me/0931467024');
  });
});
