import { describe, expect, it } from 'vitest';
import {
  CATALOG_PRODUCTS,
  filterAndSortCatalog,
  formatDeliveryRange,
  formatMoney,
  getCategoryCounts,
  getLicensePrice,
  getSavingsPercent,
} from '../catalog';

describe('Catalog Engine', () => {
  it('contains all 26 real commercial products with valid live URLs and relative media paths', () => {
    expect(CATALOG_PRODUCTS).toHaveLength(26);
    for (const product of CATALOG_PRODUCTS) {
      expect(product.liveUrl).toMatch(/^https:\/\/tvt987\.github\.io\/.+\/$/);
      expect(product.previewImage).toMatch(/^\.\/media\/.+\.(webp|jpg)$/);
      expect(product.priceVnd).toBeGreaterThan(0);
      expect(product.priceUsd).toBeGreaterThan(0);
      expect(product.originalPriceVnd).toBeGreaterThan(product.priceVnd);
    }
  });

  it('computes accurate category counts across all 5 vertical segments', () => {
    const counts = getCategoryCounts(CATALOG_PRODUCTS);
    expect(counts.all).toBe(26);
    expect(counts['commerce-3d']).toBe(5);
    expect(counts['clinic-proptech']).toBe(4);
    expect(counts['pos-fnb']).toBe(3);
    expect(counts['enterprise-b2b']).toBe(7);
    expect(counts['saas-ai']).toBe(7);
  });

  it('filters catalog by category and search query across VI/EN and tech stack', () => {
    const posOnly = filterAndSortCatalog(CATALOG_PRODUCTS, 'pos-fnb', '', 'featured');
    expect(posOnly).toHaveLength(3);
    expect(posOnly.some((p) => p.id === 'pulse-pos-fnb')).toBe(true);

    const byStack = filterAndSortCatalog(CATALOG_PRODUCTS, 'all', 'DuckDB-WASM', 'featured');
    expect(byStack).toHaveLength(1);
    expect(byStack[0].id).toBe('nexus-lake');

    const byVietnamese = filterAndSortCatalog(CATALOG_PRODUCTS, 'all', 'kính mắt', 'featured');
    expect(byVietnamese).toHaveLength(1);
    expect(byVietnamese[0].id).toBe('maison-vera');
  });

  it('sorts products accurately by featured VIP order, price ascending/descending, and fastest delivery', () => {
    const featured = filterAndSortCatalog(CATALOG_PRODUCTS, 'all', '', 'featured');
    expect(featured[0].id).toBe('velox-ev-motors');
    expect(featured[0].priceVnd).toBe(20_000_000);

    const asc = filterAndSortCatalog(CATALOG_PRODUCTS, 'all', '', 'price-asc');
    expect(asc[0].id).toBe('vanguard-fitness');
    expect(asc[asc.length - 1].id).toBe('aeroforge-digital-twin');

    const desc = filterAndSortCatalog(CATALOG_PRODUCTS, 'all', '', 'price-desc');
    expect(desc[0].id).toBe('aeroforge-digital-twin');
    expect(desc[desc.length - 1].id).toBe('vanguard-fitness');

    const fastest = filterAndSortCatalog(CATALOG_PRODUCTS, 'all', '', 'fastest');
    expect(fastest[0].deliveryDaysMin).toBe(2);
  });

  it('formats VND and USD currency strings deterministically', () => {
    expect(formatMoney(20_000_000, 'VND')).toBe('20.000.000₫');
    expect(formatMoney(11_900_000, 'VND')).toBe('11.900.000₫');
    expect(formatMoney(799, 'USD')).toBe('$799');
    expect(formatMoney(1_450, 'USD')).toBe('$1,450');
    expect(formatMoney(-500, 'VND')).toBe('0₫');
  });

  it('calculates Standard vs Full Source (+30%) license pricing cleanly', () => {
    const velox = CATALOG_PRODUCTS.find((p) => p.id === 'velox-ev-motors')!;
    expect(getLicensePrice(velox, 'standard', 'VND')).toBe(20_000_000);
    expect(getLicensePrice(velox, 'standard', 'USD')).toBe(799);
    // 20,000,000 * 1.3 = 26,000,000
    expect(getLicensePrice(velox, 'full-source', 'VND')).toBe(26_000_000);
    // 799 * 1.3 = 1038.7 -> rounded = 1039
    expect(getLicensePrice(velox, 'full-source', 'USD')).toBe(1_039);
  });

  it('computes savings percentage and localized delivery ranges', () => {
    const aegis = CATALOG_PRODUCTS.find((p) => p.id === 'aegispulse')!;
    expect(getSavingsPercent(aegis, 'VND')).toBe(36);
    expect(formatDeliveryRange(aegis, 'vi')).toBe('5–10 ngày');
    expect(formatDeliveryRange(aegis, 'en')).toBe('5–10 days');
  });
});
