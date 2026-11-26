import { describe, expect, it } from 'vitest';
import {
  buildMilestones,
  calculateCustomEstimate,
  generateTechnicalProposalMarkdown,
  PROJECT_TYPES,
  SCOPE_ADDONS,
} from '../estimator';

describe('Custom Scope & Price Estimator Engine', () => {
  it('exposes 3 service tiers and 7 selectable commercial add-ons', () => {
    expect(PROJECT_TYPES).toHaveLength(3);
    expect(SCOPE_ADDONS).toHaveLength(7);
  });

  it('computes base estimates accurately for Starter, Growth, and Enterprise tiers', () => {
    const starter = calculateCustomEstimate({
      projectType: 'starter-landing',
      selectedAddons: [],
      pace: 'standard',
    });
    expect(starter.totalVnd).toBe(5_500_000);
    expect(starter.totalUsd).toBe(220);
    expect(starter.estimatedDays).toBe(5);

    const enterprise = calculateCustomEstimate({
      projectType: 'enterprise-system',
      selectedAddons: [],
      pace: 'standard',
    });
    expect(enterprise.totalVnd).toBe(35_000_000);
    expect(enterprise.totalUsd).toBe(1_400);
    expect(enterprise.estimatedDays).toBe(21);
  });

  it('accumulates selected add-ons and deduplicates duplicate add-on IDs', () => {
    const result = calculateCustomEstimate({
      projectType: 'growth-webapp',
      selectedAddons: ['webgl-3d', 'payment-gateway', 'webgl-3d'],
      pace: 'standard',
    });
    expect(result.addons).toHaveLength(2);
    expect(result.addonsVnd).toBe(4_500_000 + 3_500_000);
    expect(result.addonsUsd).toBe(180 + 140);
    expect(result.totalVnd).toBe(14_000_000 + 8_000_000);
    expect(result.estimatedDays).toBe(10 + 4 + 3);
  });

  it('applies priority rush pace (+20% surcharge, -25% delivery days with 4-day floor)', () => {
    const standard = calculateCustomEstimate({
      projectType: 'growth-webapp',
      selectedAddons: ['ai-rag', 'admin-cms'],
      pace: 'standard',
    });
    const priority = calculateCustomEstimate({
      projectType: 'growth-webapp',
      selectedAddons: ['ai-rag', 'admin-cms'],
      pace: 'priority',
    });

    expect(priority.rushSurchargeVnd).toBeGreaterThan(0);
    expect(priority.totalVnd).toBeGreaterThan(standard.totalVnd);
    expect(priority.estimatedDays).toBeLessThan(standard.estimatedDays);
    expect(priority.estimatedDays).toBeGreaterThanOrEqual(4);
  });

  it('splits 3-stage milestones (30% / 40% / 30%) with zero rounding drift', () => {
    const testAmounts: Array<[number, number]> = [
      [5_500_000, 220],
      [18_700_000, 749],
      [47_300_000, 1_893],
    ];
    for (const [vnd, usd] of testAmounts) {
      const stages = buildMilestones(vnd, usd);
      expect(stages).toHaveLength(3);
      const sumVnd = stages.reduce((acc, s) => acc + s.amountVnd, 0);
      const sumUsd = stages.reduce((acc, s) => acc + s.amountUsd, 0);
      expect(sumVnd).toBe(vnd);
      expect(sumUsd).toBe(usd);
      expect(stages[0].percentLabel).toBe('30%');
      expect(stages[1].percentLabel).toBe('40%');
      expect(stages[2].percentLabel).toBe('30%');
    }
  });

  it('exports rich Vietnamese and English technical proposal Markdown documents', () => {
    const config = {
      projectType: 'growth-webapp' as const,
      selectedAddons: ['ai-rag' as const, 'source-cicd' as const],
      pace: 'priority' as const,
      projectName: 'Nova MedTech Commerce',
    };
    const estimate = calculateCustomEstimate(config);

    const mdVi = generateTechnicalProposalMarkdown(config, estimate, 'vi');
    expect(mdVi).toContain('TVT STUDIO — BẢN ĐỀ XUẤT KỸ THUẬT');
    expect(mdVi).toContain('Nova MedTech Commerce');
    expect(mdVi).toContain('0931 467 024');
    expect(mdVi).toContain('tinhkun102@gmail.com');
    expect(mdVi).toContain('30%');
    expect(mdVi).toContain('40%');

    const mdEn = generateTechnicalProposalMarkdown(config, estimate, 'en');
    expect(mdEn).toContain('TECHNICAL ARCHITECTURE PROPOSAL');
    expect(mdEn).toContain('Nova MedTech Commerce');
    expect(mdEn).toContain('Priority Acceleration Surcharge');
  });
});
