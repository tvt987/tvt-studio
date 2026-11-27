import { describe, expect, it } from 'vitest';
import {
  ADMIN_OWNER_EMAIL,
  computeLocalAdminMetrics,
  isAdminEmail,
  isAdminSession,
} from '../adminOps';
import type { AuthSession, OrderSnapshot } from '../types';

function makeOrder(code: string, status: OrderSnapshot['status'], netVnd: number, payVnd: number): OrderSnapshot {
  return {
    orderCode: code,
    createdAtIso: '2026-11-27T00:00:00.000Z',
    currency: 'VND',
    paymentChannel: 'vietqr',
    paymentMode: 'deposit-30',
    status,
    client: {
      fullName: 'Client',
      phoneOrZalo: '0909000111',
      email: 'buyer@company.vn',
      brandOrDomain: 'company.vn',
      notes: '',
    },
    items: [],
    totals: {
      itemCount: 1,
      subtotalVnd: netVnd,
      subtotalUsd: 800,
      discountVnd: 0,
      discountUsd: 0,
      netTotalVnd: netVnd,
      netTotalUsd: 800,
      payableNowVnd: payVnd,
      payableNowUsd: 240,
      remainingVnd: netVnd - payVnd,
      remainingUsd: 560,
      paymentMode: 'deposit-30',
      appliedVoucher: undefined,
    },
    milestones: [],
    events: [],
  };
}

describe('Admin Ops & Role Verification Engine', () => {
  it('strictly authorizes only tinhkun102@gmail.com regardless of case/whitespace', () => {
    expect(ADMIN_OWNER_EMAIL).toBe('tinhkun102@gmail.com');
    expect(isAdminEmail('tinhkun102@gmail.com')).toBe(true);
    expect(isAdminEmail('  TINHKUN102@GMAIL.COM  ')).toBe(true);
    expect(isAdminEmail('tinhkun102@evil.com')).toBe(false);
    expect(isAdminEmail('customer@gmail.com')).toBe(false);
    expect(isAdminEmail(null)).toBe(false);
    expect(isAdminEmail('')).toBe(false);
  });

  it('validates AuthSession admin eligibility cleanly', () => {
    const adminSess: AuthSession = {
      mode: 'supabase_otp',
      userId: 'u-1',
      email: 'TinhKun102@gmail.com',
      accessToken: 'jwt',
      loggedInAtIso: '2026-11-27T00:00:00.000Z',
    };
    const buyerSess: AuthSession = {
      mode: 'supabase_otp',
      userId: 'u-2',
      email: 'buyer@clinic.vn',
      accessToken: 'jwt',
      loggedInAtIso: '2026-11-27T00:00:00.000Z',
    };
    expect(isAdminSession(adminSess)).toBe(true);
    expect(isAdminSession(buyerSess)).toBe(false);
    expect(isAdminSession(null)).toBe(false);
  });

  it('computes local admin revenue, pipeline, and paid order counts accurately', () => {
    const orders = [
      makeOrder('TVT-ORD-1001', 'DEPOSIT_VERIFIED', 20_000_000, 6_000_000),
      makeOrder('TVT-ORD-1002', 'DELIVERED', 15_000_000, 15_000_000),
      makeOrder('TVT-ORD-1003', 'AWAITING_PAYMENT', 10_000_000, 3_000_000),
    ];
    const metrics = computeLocalAdminMetrics(orders, []);
    expect(metrics.totalOrders).toBe(3);
    expect(metrics.paidOrdersCount).toBe(2);
    expect(metrics.paidRevenueVnd).toBe(21_000_000);
    expect(metrics.pipelineVnd).toBe(45_000_000);
    expect(metrics.clientsCount).toBe(1);
  });
});
