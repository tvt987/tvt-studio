export type Locale = 'vi' | 'en';
export type Currency = 'VND' | 'USD';
export type ThemeMode = 'dark' | 'light';

export type ProductCategory =
  | 'all'
  | 'commerce-3d'
  | 'clinic-proptech'
  | 'pos-fnb'
  | 'saas-ai';

export type CatalogSort = 'featured' | 'price-asc' | 'price-desc' | 'fastest';

export type LicenseTier = 'standard' | 'full-source';

export type PaymentMode = 'full' | 'deposit-30';

export type PaymentChannel = 'zalopay' | 'momo' | 'b2b-wire';

export interface LocalizedText {
  vi: string;
  en: string;
}

export interface TemplateProduct {
  id: string;
  sku: string;
  name: string;
  subtitle: LocalizedText;
  tagline: LocalizedText;
  category: Exclude<ProductCategory, 'all'>;
  categoryLabel: LocalizedText;
  priceVnd: number;
  originalPriceVnd: number;
  priceUsd: number;
  originalPriceUsd: number;
  deliveryDaysMin: number;
  deliveryDaysMax: number;
  liveUrl: string;
  previewImage: string;
  previewBadge?: string;
  featuredRank: number;
  stack: string[];
  deliverables: {
    vi: string[];
    en: string[];
  };
  architectureNote: LocalizedText;
  metricsBadge: string;
}

export type ProjectTypeId = 'starter-landing' | 'growth-webapp' | 'enterprise-system';
export type DeliveryPace = 'standard' | 'priority';

export interface ProjectTypeOption {
  id: ProjectTypeId;
  tierName: LocalizedText;
  priceRangeDisplay: LocalizedText;
  priceRangeUsdDisplay: string;
  badge?: LocalizedText;
  summary: LocalizedText;
  baseVnd: number;
  baseUsd: number;
  baseDays: number;
  idealFor: {
    vi: string[];
    en: string[];
  };
}

export type AddonId =
  | 'webgl-3d'
  | 'ai-rag'
  | 'payment-gateway'
  | 'bilingual-i18n'
  | 'admin-cms'
  | 'seo-cwv'
  | 'source-cicd';

export interface ScopeAddon {
  id: AddonId;
  label: LocalizedText;
  description: LocalizedText;
  priceVnd: number;
  priceUsd: number;
  addedDays: number;
}

export interface CustomScopeConfig {
  projectType: ProjectTypeId;
  selectedAddons: AddonId[];
  pace: DeliveryPace;
  projectName?: string;
}

export interface MilestoneStage {
  stage: 1 | 2 | 3;
  ratio: number;
  percentLabel: string;
  label: LocalizedText;
  deliverable: LocalizedText;
  amountVnd: number;
  amountUsd: number;
}

export interface CustomEstimateResult {
  projectType: ProjectTypeOption;
  addons: ScopeAddon[];
  baseVnd: number;
  baseUsd: number;
  addonsVnd: number;
  addonsUsd: number;
  rushSurchargeVnd: number;
  rushSurchargeUsd: number;
  totalVnd: number;
  totalUsd: number;
  estimatedDays: number;
  milestones: MilestoneStage[];
}

export interface CartTemplateItem {
  kind: 'template';
  cartKey: string;
  productId: string;
  sku: string;
  title: string;
  subtitle: LocalizedText;
  previewImage: string;
  license: LicenseTier;
  unitVnd: number;
  unitUsd: number;
  quantity: number;
  deliveryDaysLabel: string;
}

export interface CartCustomItem {
  kind: 'custom';
  cartKey: string;
  sku: string;
  title: LocalizedText;
  summary: LocalizedText;
  config: CustomScopeConfig;
  unitVnd: number;
  unitUsd: number;
  quantity: number;
  estimatedDays: number;
  addonLabels: LocalizedText[];
}

export type CartItem = CartTemplateItem | CartCustomItem;

export interface VoucherDefinition {
  code: string;
  type: 'percent' | 'fixed';
  percentOff?: number;
  fixedVnd?: number;
  fixedUsd?: number;
  minSubtotalVnd: number;
  minSubtotalUsd: number;
  maxDiscountVnd?: number;
  maxDiscountUsd?: number;
  label: LocalizedText;
  description: LocalizedText;
}

export interface VoucherEvaluation {
  valid: boolean;
  code: string;
  idempotencyKey: string;
  discountVnd: number;
  discountUsd: number;
  voucher?: VoucherDefinition;
  message: LocalizedText;
}

export interface CartTotals {
  itemCount: number;
  subtotalVnd: number;
  subtotalUsd: number;
  discountVnd: number;
  discountUsd: number;
  netTotalVnd: number;
  netTotalUsd: number;
  payableNowVnd: number;
  payableNowUsd: number;
  remainingVnd: number;
  remainingUsd: number;
  paymentMode: PaymentMode;
  appliedVoucher?: VoucherEvaluation;
}

export interface ClientOrderForm {
  fullName: string;
  phoneOrZalo: string;
  email: string;
  brandOrDomain: string;
  notes: string;
}

export interface OrderSnapshot {
  orderCode: string;
  createdAtIso: string;
  currency: Currency;
  paymentChannel: PaymentChannel;
  paymentMode: PaymentMode;
  client: ClientOrderForm;
  items: CartItem[];
  totals: CartTotals;
  milestones: MilestoneStage[];
}
