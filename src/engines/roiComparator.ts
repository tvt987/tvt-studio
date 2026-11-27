import {
  getLicensePrice,
  matchesTechStack,
  roundUsd,
  roundVnd,
} from './catalog';
import type {
  LicenseTier,
  Locale,
  LocalizedText,
  TemplateProduct,
} from './types';

export interface AgencyRoiComparison {
  productId: string;
  license: LicenseTier;
  tvtPriceVnd: number;
  tvtPriceUsd: number;
  tvtDaysMin: number;
  tvtDaysMax: number;
  tvtAvgDays: number;
  agencyMultiplier: number;
  agencyCostVnd: number;
  agencyCostUsd: number;
  agencyDaysMin: number;
  agencyDaysMax: number;
  agencyAvgDays: number;
  cashSavedVnd: number;
  cashSavedUsd: number;
  costReductionPct: number;
  daysSaved: number;
  timeReductionPct: number;
  tvtCostBarPct: number;
  tvtTimeBarPct: number;
  agencyTeamProfile: LocalizedText;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Computes a deterministic ROI & Time-to-Market comparison between commissioning
 * a traditional 3-person agency (UI/UX + Frontend + Backend, ~4.5x-6.5x cost &
 * 60-120 delivery days) versus deploying a TVT Studio turnkey monorepo.
 */
export function calculateAgencyRoi(
  product: TemplateProduct,
  license: LicenseTier
): AgencyRoiComparison {
  const tvtPriceVnd = getLicensePrice(product, license, 'VND');
  const tvtPriceUsd = getLicensePrice(product, license, 'USD');

  const isThreeJs = matchesTechStack(product, 'threejs');
  const isAiRag = matchesTechStack(product, 'ai-rag');

  let baseMultiplier = 4.6;
  if (product.priceVnd >= 24_000_000) {
    baseMultiplier = 5.8;
  } else if (product.priceVnd >= 14_000_000) {
    baseMultiplier = 5.4;
  } else if (product.priceVnd >= 10_000_000) {
    baseMultiplier = 5.0;
  }

  const complexityLift = (isThreeJs ? 0.4 : 0) + (isAiRag ? 0.3 : 0);
  const agencyMultiplier = Math.round(clamp(baseMultiplier + complexityLift, 4.5, 6.5) * 10) / 10;

  const agencyCostVnd = roundVnd(tvtPriceVnd * agencyMultiplier);
  const agencyCostUsd = roundUsd(tvtPriceUsd * agencyMultiplier);

  const cashSavedVnd = Math.max(0, agencyCostVnd - tvtPriceVnd);
  const cashSavedUsd = Math.max(0, agencyCostUsd - tvtPriceUsd);
  const costReductionPct =
    agencyCostVnd > 0 ? Math.round((cashSavedVnd / agencyCostVnd) * 100) : 0;

  const tvtDaysMin = Math.max(1, product.deliveryDaysMin);
  const tvtDaysMax = Math.max(tvtDaysMin, product.deliveryDaysMax);
  const tvtAvgDays = Math.max(1, Math.round((tvtDaysMin + tvtDaysMax) / 2));

  const complexityDays = (isThreeJs ? 10 : 0) + (isAiRag ? 10 : 0);
  const agencyDaysMin = clamp(48 + tvtAvgDays * 5 + complexityDays, 60, 95);
  const agencyDaysMax = clamp(agencyDaysMin + 25, agencyDaysMin + 15, 120);
  const agencyAvgDays = Math.round((agencyDaysMin + agencyDaysMax) / 2);

  const daysSaved = Math.max(1, agencyAvgDays - tvtAvgDays);
  const timeReductionPct =
    agencyAvgDays > 0 ? Math.round((daysSaved / agencyAvgDays) * 100) : 0;

  const tvtCostBarPct = clamp(Math.round((tvtPriceVnd / agencyCostVnd) * 100), 10, 45);
  const tvtTimeBarPct = clamp(Math.round((tvtAvgDays / agencyAvgDays) * 100), 6, 30);

  return {
    productId: product.id,
    license,
    tvtPriceVnd,
    tvtPriceUsd,
    tvtDaysMin,
    tvtDaysMax,
    tvtAvgDays,
    agencyMultiplier,
    agencyCostVnd,
    agencyCostUsd,
    agencyDaysMin,
    agencyDaysMax,
    agencyAvgDays,
    cashSavedVnd,
    cashSavedUsd,
    costReductionPct,
    daysSaved,
    timeReductionPct,
    tvtCostBarPct,
    tvtTimeBarPct,
    agencyTeamProfile: {
      vi: 'Agency truyền thống (3 nhân sự: UI/UX + FE + BE)',
      en: 'Traditional 3-person agency (UI/UX + FE + BE)',
    },
  };
}

export function formatAgencyDaysRange(
  roi: Pick<AgencyRoiComparison, 'agencyDaysMin' | 'agencyDaysMax'>,
  locale: Locale
): string {
  return locale === 'vi'
    ? `${roi.agencyDaysMin}–${roi.agencyDaysMax} ngày`
    : `${roi.agencyDaysMin}–${roi.agencyDaysMax} days`;
}
