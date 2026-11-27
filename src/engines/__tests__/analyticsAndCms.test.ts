import { describe, expect, it } from 'vitest';
import {
  computeLocalAnalyticsSummary,
  getBundledCmsProducts,
  mapDbRowToCmsProduct,
  templateProductToAdminInput,
  validateProductDraft,
  type LocalAnalyticsEvent,
} from '../analyticsAndCms';
import { CATALOG_PRODUCTS } from '../catalog';
import type { OrderSnapshot } from '../types';

function makeOrder(
  code: string,
  status: OrderSnapshot['status'],
  productId: string,
  netVnd: number,
  payVnd: number
): OrderSnapshot {
  return {
    orderCode: code,
    createdAtIso: new Date().toISOString(),
    currency: 'VND',
    paymentChannel: 'vietqr',
    paymentMode: 'deposit-30',
    status,
    client: {
      fullName: 'VIP Buyer',
      phoneOrZalo: '0909123456',
      email: 'vip@enterprise.vn',
      brandOrDomain: 'enterprise.vn',
      notes: '',
    },
    items: [
      {
        kind: 'template',
        cartKey: `tpl:${productId}:standard`,
        productId,
        sku: 'TVT-EV-11',
        title: 'Velox EV Motors v3.0',
        subtitle: { vi: 'Showroom EV', en: 'EV Showroom' },
        previewImage: './media/velox-ev-motors.webp',
        license: 'standard',
        unitVnd: netVnd,
        unitUsd: Math.round(netVnd / 25_000),
        quantity: 1,
        deliveryDaysLabel: '4–6 ngày',
      },
    ],
    totals: {
      itemCount: 1,
      subtotalVnd: netVnd,
      subtotalUsd: Math.round(netVnd / 25_000),
      discountVnd: 0,
      discountUsd: 0,
      netTotalVnd: netVnd,
      netTotalUsd: Math.round(netVnd / 25_000),
      payableNowVnd: payVnd,
      payableNowUsd: Math.round(payVnd / 25_000),
      remainingVnd: netVnd - payVnd,
      remainingUsd: Math.round((netVnd - payVnd) / 25_000),
      paymentMode: 'deposit-30',
      appliedVoucher: undefined,
    },
    milestones: [],
    events: [],
  };
}

describe('Executive Analytics & Cloud Product CMS Engine', () => {
  it('computes 14-day daily analytics series, unique visitors, funnel & conversion rates accurately', () => {
    const nowIso = new Date().toISOString();
    const events: LocalAnalyticsEvent[] = [
      { eventType: 'page_view', sessionId: 'sess_a', path: '/', locale: 'vi', createdAtIso: nowIso },
      { eventType: 'page_view', sessionId: 'sess_a', path: '/', locale: 'vi', createdAtIso: nowIso },
      { eventType: 'page_view', sessionId: 'sess_b', path: '/', locale: 'en', createdAtIso: nowIso },
      { eventType: 'page_view', sessionId: 'sess_c', path: '/', locale: 'vi', createdAtIso: nowIso },
      { eventType: 'sandbox_open', sessionId: 'sess_a', productId: 'velox-ev-motors', path: '/', locale: 'vi', createdAtIso: nowIso },
      { eventType: 'sandbox_open', sessionId: 'sess_b', productId: 'velox-ev-motors', path: '/', locale: 'en', createdAtIso: nowIso },
      { eventType: 'product_detail', sessionId: 'sess_a', productId: 'aegispulse', path: '/', locale: 'vi', createdAtIso: nowIso },
      { eventType: 'add_to_cart', sessionId: 'sess_a', productId: 'velox-ev-motors', path: '/', locale: 'vi', createdAtIso: nowIso },
      { eventType: 'checkout_start', sessionId: 'sess_a', path: '/', locale: 'vi', createdAtIso: nowIso },
    ];
    const orders = [
      makeOrder('TVT-ORD-7001', 'DEPOSIT_VERIFIED', 'velox-ev-motors', 20_000_000, 6_000_000),
      makeOrder('TVT-ORD-7002', 'AWAITING_PAYMENT', 'aegispulse', 22_900_000, 6_870_000),
    ];

    const summary = computeLocalAnalyticsSummary(events, orders, CATALOG_PRODUCTS);
    expect(summary.totalVisits).toBe(4);
    expect(summary.uniqueVisitors).toBe(3);
    expect(summary.todayVisits).toBe(4);
    expect(summary.sandboxOpens).toBe(2);
    expect(summary.productDetailViews).toBe(1);
    expect(summary.addToCartEvents).toBe(1);
    expect(summary.checkoutStarts).toBe(1);
    // 2 orders / 3 unique visitors = 66.7%
    expect(summary.conversionRatePct).toBe(66.7);
    // 1 paid order / 3 unique visitors = 33.3%
    expect(summary.paidConversionPct).toBe(33.3);
    expect(summary.dailySeries14d).toHaveLength(14);

    const todayBucket = summary.dailySeries14d[summary.dailySeries14d.length - 1];
    expect(todayBucket.visits).toBe(4);
    expect(todayBucket.orders).toBe(2);
    expect(todayBucket.revenueVnd).toBe(6_000_000);

    expect(summary.topProducts[0].productId).toBe('velox-ev-motors');
    expect(summary.topProducts[0].sandboxOpens).toBe(2);
    expect(summary.topProducts[0].cartAdds).toBe(1);
    expect(summary.topProducts[0].orderCount).toBe(1);
    expect(summary.topProducts[0].revenueVnd).toBe(20_000_000);
  });

  it('maps Supabase tvt_products rows cleanly while preserving bundled deliverables fallback', () => {
    const mapped = mapDbRowToCmsProduct({
      id: 'velox-ev-motors',
      sku: 'TVT-EV-11',
      name: 'Velox EV Motors v3.0',
      price_vnd: 25_000_000,
      original_price_vnd: 35_000_000,
      price_usd: 999,
      original_price_usd: 1_399,
      featured_rank: 1,
      is_active: true,
    });
    expect(mapped.priceVnd).toBe(25_000_000);
    expect(mapped.featuredRank).toBe(1);
    expect(mapped.isActive).toBe(true);
    expect(mapped.deliverables.vi.length).toBeGreaterThanOrEqual(4);
  });

  it('maps brand-new custom Cloud CMS product without bundled entry cleanly', () => {
    const custom = mapDbRowToCmsProduct({
      id: 'hyper-erp-ai',
      sku: 'TVT-ERP-99',
      name: 'HyperERP AI Suite',
      subtitle_vi: 'Hệ thống ERP đa chi nhánh',
      category: 'enterprise-b2b',
      price_vnd: 28_000_000,
      live_url: 'https://tvt987.github.io/hyper-erp/',
      stack_json: ['.NET 10', 'React 19', 'PostgreSQL'],
      featured_rank: 2,
      is_active: false,
    });
    expect(custom.id).toBe('hyper-erp-ai');
    expect(custom.priceVnd).toBe(28_000_000);
    expect(custom.priceUsd).toBe(1_120);
    expect(custom.isActive).toBe(false);
    expect(custom.stack).toContain('.NET 10');
    expect(custom.deliverables.vi.length).toBeGreaterThan(0);
  });

  it('validates product CRUD form inputs strictly against invalid slugs, low prices, and unsafe URLs', () => {
    expect(
      validateProductDraft({
        id: 'hyper-crm-v1',
        name: 'HyperCRM Pro',
        priceVnd: 15_000_000,
        liveUrl: 'https://tvt987.github.io/hyper-crm/',
      }).valid
    ).toBe(true);

    expect(
      validateProductDraft({
        id: 'BAD SLUG!',
        name: 'HyperCRM',
        priceVnd: 15_000_000,
      }).valid
    ).toBe(false);

    expect(
      validateProductDraft({
        id: 'valid-slug',
        name: 'A',
        priceVnd: 15_000_000,
      }).valid
    ).toBe(false);

    expect(
      validateProductDraft({
        id: 'valid-slug',
        name: 'Valid Product',
        priceVnd: 5_000,
      }).valid
    ).toBe(false);

    expect(
      validateProductDraft({
        id: 'valid-slug',
        name: 'Valid Product',
        priceVnd: 12_000_000,
        liveUrl: 'javascript:alert(1)',
      }).valid
    ).toBe(false);
  });

  it('converts TemplateProduct to AdminMutationInput cleanly and sorts bundled catalog by featuredRank', () => {
    const bundled = getBundledCmsProducts();
    expect(bundled).toHaveLength(19);
    expect(bundled[0].id).toBe('velox-ev-motors');
    expect(bundled[0].featuredRank).toBe(1);

    const input = templateProductToAdminInput(bundled[0], true);
    expect(input.id).toBe('velox-ev-motors');
    expect(input.priceVnd).toBe(20_000_000);
    expect(input.isActive).toBe(true);
    expect(input.stack.length).toBeGreaterThan(0);
  });
});
