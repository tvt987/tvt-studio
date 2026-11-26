import { describe, expect, it } from 'vitest';
import {
  buildVietQrImageUrl,
  isValidBankVietQrConfig,
  sanitizeAccountName,
  sanitizeAccountNumber,
  VIETNAM_BANKS,
} from '../vietqr';
import {
  appendStatusTransition,
  exportOrdersToCsvBom,
  generateInquiryCode,
  ORDER_STATUS_META,
  ORDER_STATUS_SEQUENCE,
  resolveInitialOrderStatus,
} from '../orderLedger';
import { CATALOG_PRODUCTS } from '../catalog';
import { addTemplateToCart, calculateCartTotals } from '../cart';
import { createOrderSnapshot } from '../invoice';

describe('VietQR Banking Engine & Order Persistence Ledger', () => {
  it('exposes official NAPAS bank directory and sanitizes Vietnamese account holder names', () => {
    expect(VIETNAM_BANKS.length).toBeGreaterThanOrEqual(8);
    expect(sanitizeAccountNumber('0931-467 024')).toBe('0931467024');
    expect(sanitizeAccountName('Trương Văn Tình')).toBe('TRUONG VAN TINH');
    expect(sanitizeAccountName('Đặng Đức Anh')).toBe('DANG DUC ANH');
  });

  it('validates bank config and generates exact img.vietqr.io dynamic payment QR URLs', () => {
    expect(isValidBankVietQrConfig(null)).toBe(false);
    expect(
      isValidBankVietQrConfig({
        bankBin: '970422',
        bankShortName: 'MB Bank',
        accountNumber: '123',
        accountName: 'TRUONG VAN TINH',
      })
    ).toBe(false);

    const validCfg = {
      bankBin: '970422',
      bankShortName: 'MB Bank',
      accountNumber: '0931467024',
      accountName: 'Trương Văn Tình',
    };
    expect(isValidBankVietQrConfig(validCfg)).toBe(true);

    const url = buildVietQrImageUrl(validCfg, 1_050_000, 'TVT-ORD-8821');
    expect(url).toBe(
      'https://img.vietqr.io/image/970422-0931467024-compact2.png?amount=1050000&addInfo=TVT-ORD-8821&accountName=TRUONG%20VAN%20TINH'
    );
  });

  it('resolves initial order status accurately across consultation, proof submission, and awaiting payment', () => {
    expect(resolveInitialOrderStatus('consult-first')).toBe('PENDING_CONSULTATION');
    expect(resolveInitialOrderStatus('vietqr', 'FT2633012994')).toBe('PROOF_SUBMITTED');
    expect(resolveInitialOrderStatus('zalopay', '')).toBe('AWAITING_PAYMENT');
    expect(generateInquiryCode(5512)).toMatch(/^TVT-INQ-\d{4}$/);
  });

  it('appends immutable status timeline transitions across the full lifecycle', () => {
    const lumina = CATALOG_PRODUCTS.find((p) => p.id === 'lumina-medspa')!;
    const cart = addTemplateToCart([], lumina, 'standard');
    const totals = calculateCartTotals(cart, null, 'deposit-30');
    let order = createOrderSnapshot({
      orderCode: 'TVT-ORD-3310',
      currency: 'VND',
      paymentChannel: 'vietqr',
      client: {
        fullName: 'Le Quoc Huy',
        phoneOrZalo: '0908 111 222',
        email: 'huy@clinic.vn',
        brandOrDomain: 'huydental.vn',
        notes: 'Can tinh chinh mau xanh navy',
      },
      items: cart,
      totals,
      createdAtIso: '2026-11-26T15:00:00.000Z',
    });

    expect(order.status).toBe('AWAITING_PAYMENT');
    expect(order.events).toHaveLength(1);

    order = appendStatusTransition(order, 'PROOF_SUBMITTED', undefined, undefined, 'FT26330998');
    expect(order.status).toBe('PROOF_SUBMITTED');
    expect(order.paymentRef).toBe('FT26330998');
    expect(order.events).toHaveLength(2);

    order = appendStatusTransition(order, 'DEPOSIT_VERIFIED');
    expect(order.status).toBe('DEPOSIT_VERIFIED');
    expect(ORDER_STATUS_META[order.status!].stepIndex).toBe(2);
    expect(ORDER_STATUS_SEQUENCE).toHaveLength(7);
  });

  it('exports UTF-8 BOM Excel-safe CSV order ledgers with escaped fields', () => {
    const maison = CATALOG_PRODUCTS.find((p) => p.id === 'maison-vera')!;
    const cart = addTemplateToCart([], maison, 'full-source');
    const totals = calculateCartTotals(cart, 'AGENCY10', 'deposit-30');
    const order = createOrderSnapshot({
      orderCode: 'TVT-ORD-9104',
      currency: 'VND',
      paymentChannel: 'consult-first',
      client: {
        fullName: 'Tran, Bao Ngoc',
        phoneOrZalo: '0912 345 678',
        email: 'ngoc@brand.vn',
        brandOrDomain: 'ngocstudio.vn',
        notes: 'Quote "custom" colors',
      },
      items: cart,
      totals,
    });

    const csv = exportOrdersToCsvBom([order]);
    expect(csv.startsWith('\uFEFFOrderCode,')).toBe(true);
    expect(csv).toContain('"Tran, Bao Ngoc"');
    expect(csv).toContain('TVT-ORD-9104');
    expect(csv).toContain('PENDING_CONSULTATION');
  });
});
