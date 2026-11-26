import { describe, expect, it } from 'vitest';
import {
  filterOrdersForAccount,
  generateHandoverKitMarkdown,
  generateLicenseKey,
  isOrderSourceUnlocked,
  isValidEmail,
  mergeCloudAndLocalOrders,
  normalizeEmail,
} from '../authVault';
import { addTemplateToCart, calculateCartTotals } from '../cart';
import { CATALOG_PRODUCTS } from '../catalog';
import { createOrderSnapshot } from '../invoice';
import type { AuthSession } from '../types';

function makeSampleOrder(code: string, email: string, status: 'AWAITING_PAYMENT' | 'DEPOSIT_VERIFIED') {
  const lumina = CATALOG_PRODUCTS.find((p) => p.id === 'lumina-medspa')!;
  const cart = addTemplateToCart([], lumina, 'full-source');
  const totals = calculateCartTotals(cart, null, 'deposit-30');
  return createOrderSnapshot({
    orderCode: code,
    currency: 'VND',
    paymentChannel: 'vietqr',
    status,
    client: {
      fullName: 'Nguyen Minh Anh',
      phoneOrZalo: '0909 888 777',
      email,
      brandOrDomain: 'minhanhdental.vn',
      notes: '',
    },
    items: cart,
    totals,
    createdAtIso: '2026-11-26T16:00:00.000Z',
  });
}

describe('Email Auth Vault & Permanent Source Recovery Engine', () => {
  it('validates and normalizes customer emails cleanly', () => {
    expect(normalizeEmail('  Founder@Company.VN ')).toBe('founder@company.vn');
    expect(isValidEmail('founder@company.vn')).toBe(true);
    expect(isValidEmail('not-an-email')).toBe(false);
  });

  it('generates deterministic commercial license keys per order code', () => {
    const k1 = generateLicenseKey('TVT-ORD-4821');
    const k2 = generateLicenseKey('TVT-ORD-4821');
    const k3 = generateLicenseKey('TVT-ORD-9910');
    expect(k1).toMatch(/^TVT-LIC-4821-[A-Z0-9]{4}$/);
    expect(k1).toBe(k2);
    expect(k1).not.toBe(k3);
  });

  it('unlocks permanent source code recovery strictly after verified payment', () => {
    expect(isOrderSourceUnlocked('PENDING_CONSULTATION')).toBe(false);
    expect(isOrderSourceUnlocked('AWAITING_PAYMENT')).toBe(false);
    expect(isOrderSourceUnlocked('PROOF_SUBMITTED')).toBe(false);
    expect(isOrderSourceUnlocked('DEPOSIT_VERIFIED')).toBe(true);
    expect(isOrderSourceUnlocked('IN_DEVELOPMENT')).toBe(true);
    expect(isOrderSourceUnlocked('UAT_STAGING')).toBe(true);
    expect(isOrderSourceUnlocked('DELIVERED')).toBe(true);
  });

  it('scopes visible orders strictly to the signed-in account email or userId', () => {
    const session: AuthSession = {
      mode: 'local_vault',
      userId: 'user-1',
      email: 'buyer@studio.vn',
      loggedInAtIso: '2026-11-26T16:00:00.000Z',
    };
    const mine = makeSampleOrder('TVT-ORD-1001', 'BUYER@STUDIO.VN', 'DEPOSIT_VERIFIED');
    const other = makeSampleOrder('TVT-ORD-1002', 'stranger@other.vn', 'DEPOSIT_VERIFIED');

    const scoped = filterOrdersForAccount([mine, other], session);
    expect(scoped).toHaveLength(1);
    expect(scoped[0].orderCode).toBe('TVT-ORD-1001');
  });

  it('merges cloud and local orders with cloud status authoritative', () => {
    const localOrd = makeSampleOrder('TVT-ORD-5500', 'a@b.vn', 'AWAITING_PAYMENT');
    const cloudOrd = {
      ...makeSampleOrder('TVT-ORD-5500', 'a@b.vn', 'DEPOSIT_VERIFIED'),
      paymentRef: 'SEPAY-778899',
    };
    const merged = mergeCloudAndLocalOrders([cloudOrd], [localOrd]);
    expect(merged).toHaveLength(1);
    expect(merged[0].status).toBe('DEPOSIT_VERIFIED');
    expect(merged[0].paymentRef).toBe('SEPAY-778899');
  });

  it('generates a complete Commercial License & Source Recovery Kit markdown file', () => {
    const order = makeSampleOrder('TVT-ORD-7741', 'ceo@medspa.vn', 'DEPOSIT_VERIFIED');
    const md = generateHandoverKitMarkdown(order, 'vi');
    expect(md).toContain('TVT-ORD-7741');
    expect(md).toContain(generateLicenseKey('TVT-ORD-7741'));
    expect(md).toContain('Lumina MedSpa');
    expect(md).toContain('ceo@medspa.vn');
  });
});
