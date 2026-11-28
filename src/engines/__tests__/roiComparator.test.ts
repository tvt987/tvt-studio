import { describe, expect, it } from 'vitest';
import { CATALOG_PRODUCTS, getLicensePrice } from '../catalog';
import {
  calculateAgencyRoi,
  formatAgencyDaysRange,
} from '../roiComparator';

describe('Agency vs TVT Studio ROI Comparator Engine', () => {
  it('enforces valid 4.5x-6.5x agency cost & 60-120 day delivery invariants across all 26 products', () => {
    for (const product of CATALOG_PRODUCTS) {
      for (const license of ['standard', 'full-source'] as const) {
        const roi = calculateAgencyRoi(product, license);

        expect(roi.productId).toBe(product.id);
        expect(roi.license).toBe(license);
        expect(roi.agencyMultiplier).toBeGreaterThanOrEqual(4.5);
        expect(roi.agencyMultiplier).toBeLessThanOrEqual(6.5);

        expect(roi.tvtPriceVnd).toBe(getLicensePrice(product, license, 'VND'));
        expect(roi.tvtPriceUsd).toBe(getLicensePrice(product, license, 'USD'));
        expect(roi.agencyCostVnd).toBeGreaterThan(roi.tvtPriceVnd);
        expect(roi.agencyCostUsd).toBeGreaterThan(roi.tvtPriceUsd);

        expect(roi.cashSavedVnd).toBe(roi.agencyCostVnd - roi.tvtPriceVnd);
        expect(roi.cashSavedUsd).toBe(roi.agencyCostUsd - roi.tvtPriceUsd);
        expect(roi.costReductionPct).toBeGreaterThanOrEqual(75);
        expect(roi.costReductionPct).toBeLessThanOrEqual(86);

        expect(roi.agencyDaysMin).toBeGreaterThanOrEqual(60);
        expect(roi.agencyDaysMax).toBeLessThanOrEqual(120);
        expect(roi.agencyDaysMax).toBeGreaterThan(roi.agencyDaysMin);
        expect(roi.daysSaved).toBe(roi.agencyAvgDays - roi.tvtAvgDays);
        expect(roi.daysSaved).toBeGreaterThanOrEqual(50);
        expect(roi.timeReductionPct).toBeGreaterThanOrEqual(88);
        expect(roi.timeReductionPct).toBeLessThanOrEqual(97);
      }
    }
  });

  it('computes exact ROI metrics for flagship Velox EV Motors (Standard vs Full Source)', () => {
    const velox = CATALOG_PRODUCTS.find((p) => p.id === 'velox-ev-motors')!;
    const std = calculateAgencyRoi(velox, 'standard');
    const full = calculateAgencyRoi(velox, 'full-source');

    // 20M tier (5.4x) + Three.js 3D complexity (+0.4x) = 5.8x
    expect(std.agencyMultiplier).toBe(5.8);
    expect(std.tvtPriceVnd).toBe(2_990_000);
    expect(std.agencyCostVnd).toBe(17_340_000);
    expect(std.cashSavedVnd).toBe(14_350_000);
    expect(std.costReductionPct).toBe(83);
    expect(std.tvtAvgDays).toBe(5);
    expect(std.agencyDaysMin).toBe(83);
    expect(std.agencyDaysMax).toBe(108);
    expect(std.timeReductionPct).toBeGreaterThanOrEqual(91);

    // Full Source (+30% -> 26M) yields higher absolute cash savings vs custom agency full IP build
    expect(full.tvtPriceVnd).toBe(3_890_000);
    expect(full.agencyCostVnd).toBe(22_560_000);
    expect(full.cashSavedVnd).toBe(18_670_000);
    expect(full.cashSavedVnd).toBeGreaterThan(std.cashSavedVnd);
    expect(full.cashSavedUsd).toBeGreaterThan(std.cashSavedUsd);
  });

  it('applies higher agency complexity multipliers to Ultra 3D Twin & AI RAG systems than standard clinics', () => {
    const aero = CATALOG_PRODUCTS.find((p) => p.id === 'aeroforge-digital-twin')!;
    const vectra = CATALOG_PRODUCTS.find((p) => p.id === 'vectradoc-rag')!;
    const lumina = CATALOG_PRODUCTS.find((p) => p.id === 'lumina-medspa')!;

    const aeroRoi = calculateAgencyRoi(aero, 'standard');
    const vectraRoi = calculateAgencyRoi(vectra, 'standard');
    const luminaRoi = calculateAgencyRoi(lumina, 'standard');

    expect(aeroRoi.agencyMultiplier).toBe(6.2);
    expect(vectraRoi.agencyMultiplier).toBe(6.5);
    expect(luminaRoi.agencyMultiplier).toBe(4.6);
    expect(aeroRoi.agencyMultiplier).toBeGreaterThan(luminaRoi.agencyMultiplier);
    expect(vectraRoi.agencyMultiplier).toBeGreaterThan(luminaRoi.agencyMultiplier);
  });

  it('bounds proportional horizontal bar widths cleanly for desktop & mobile UI rendering', () => {
    for (const product of CATALOG_PRODUCTS) {
      const roi = calculateAgencyRoi(product, 'standard');
      expect(roi.tvtCostBarPct).toBeGreaterThanOrEqual(10);
      expect(roi.tvtCostBarPct).toBeLessThanOrEqual(45);
      expect(roi.tvtTimeBarPct).toBeGreaterThanOrEqual(6);
      expect(roi.tvtTimeBarPct).toBeLessThanOrEqual(30);
    }
  });

  it('formats agency delivery day ranges cleanly in both Vietnamese and English', () => {
    const velox = CATALOG_PRODUCTS.find((p) => p.id === 'velox-ev-motors')!;
    const roi = calculateAgencyRoi(velox, 'standard');
    expect(formatAgencyDaysRange(roi, 'vi')).toBe(`${roi.agencyDaysMin}–${roi.agencyDaysMax} ngày`);
    expect(formatAgencyDaysRange(roi, 'en')).toBe(`${roi.agencyDaysMin}–${roi.agencyDaysMax} days`);
  });

  it('provides localized 3-person agency team profile copy for VI and EN', () => {
    const aegis = CATALOG_PRODUCTS.find((p) => p.id === 'aegispulse')!;
    const roi = calculateAgencyRoi(aegis, 'standard');
    expect(roi.agencyTeamProfile.vi).toContain('3 nhân sự');
    expect(roi.agencyTeamProfile.en).toContain('3-person agency');
  });

  it('clamps extreme synthetic delivery ranges safely inside [60, 120] agency days', () => {
    const fastSynthetic = {
      ...CATALOG_PRODUCTS[0],
      deliveryDaysMin: 1,
      deliveryDaysMax: 1,
      stack: ['.NET 10'],
      metricsBadge: 'SIMPLE',
      name: 'Fast Landing v1.0',
      tagline: { vi: 'Nhanh', en: 'Fast' },
      architectureNote: { vi: 'Đơn giản', en: 'Simple' },
      deliverables: { vi: ['Deploy'], en: ['Deploy'] },
    };
    const fastRoi = calculateAgencyRoi(fastSynthetic, 'standard');
    expect(fastRoi.agencyDaysMin).toBe(60);
    expect(fastRoi.agencyDaysMax).toBe(85);

    const slowSynthetic = {
      ...CATALOG_PRODUCTS[0],
      deliveryDaysMin: 14,
      deliveryDaysMax: 20,
      stack: ['.NET 10', 'Three.js HDRI', 'Hybrid RAG'],
    };
    const slowRoi = calculateAgencyRoi(slowSynthetic, 'standard');
    expect(slowRoi.agencyDaysMin).toBeLessThanOrEqual(95);
    expect(slowRoi.agencyDaysMax).toBe(120);
  });
});
