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
  it('contains all 19 real commercial products with valid live URLs and relative media paths', () => {
    expect(CATALOG_PRODUCTS).toHaveLength(19);
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
    expect(counts.all).toBe(19);
    expect(counts['commerce-3d']).toBe(4);
    expect(counts['clinic-proptech']).toBe(3);
    expect(counts['pos-fnb']).toBe(3);
    expect(counts['enterprise-b2b']).toBe(5);
    expect(counts['saas-ai']).toBe(4);
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

  it('sorts products accurately by price ascending, descending, and fastest delivery', () => {
    const asc = filterAndSortCatalog(CATALOG_PRODUCTS, 'all', '', 'price-asc');
    expect(asc[0].id).toBe('lumina-medspa');
    expect(asc[asc.length - 1].id).toBe('aegispulse');

    const desc = filterAndSortCatalog(CATALOG_PRODUCTS, 'all', '', 'price-desc');
    expect(desc[0].id).toBe('aegispulse');
    expect(desc[desc.length - 1].id).toBe('lumina-medspa');

    const fastest = filterAndSortCatalog(CATALOG_PRODUCTS, 'all', '', 'fastest');
    expect(fastest[0].deliveryDaysMin).toBe(2);
  });

  it('formats VND and USD currency strings deterministically', () => {
    expect(formatMoney(3_490_000, 'VND')).toBe('3.490.000₫');
    expect(formatMoney(6_990_000, 'VND')).toBe('6.990.000₫');
    expect(formatMoney(139, 'USD')).toBe('$139');
    expect(formatMoney(1_450, 'USD')).toBe('$1,450');
    expect(formatMoney(-500, 'VND')).toBe('0₫');
  });

  it('calculates Standard vs Full Source (+30%) license pricing cleanly', () => {
    const maison = CATALOG_PRODUCTS.find((p) => p.id === 'maison-vera')!;
    expect(getLicensePrice(maison, 'standard', 'VND')).toBe(3_490_000);
    expect(getLicensePrice(maison, 'standard', 'USD')).toBe(139);
    // 3,490,000 * 1.3 = 4,537,000 -> rounded to nearest 10k = 4,540,000
    expect(getLicensePrice(maison, 'full-source', 'VND')).toBe(4_540_000);
    // 139 * 1.3 = 180.7 -> rounded = 181
    expect(getLicensePrice(maison, 'full-source', 'USD')).toBe(181);
  });

  it('computes savings percentage and localized delivery ranges', () => {
    const aegis = CATALOG_PRODUCTS.find((p) => p.id === 'aegispulse')!;
    expect(getSavingsPercent(aegis, 'VND')).toBe(46);
    expect(formatDeliveryRange(aegis, 'vi')).toBe('5–10 ngày');
    expect(formatDeliveryRange(aegis, 'en')).toBe('5–10 days');
  });
});
