import { CATALOG_PRODUCTS } from './catalog';
import { loadSupabaseRuntimeConfig } from './orderLedger';
import type { Locale, OrderLifecycleStatus, OrderSnapshot, ProductCategory, TemplateProduct } from './types';

export type SiteAnalyticsEventType =
  | 'page_view'
  | 'sandbox_open'
  | 'product_detail'
  | 'add_to_cart'
  | 'checkout_start'
  | 'inquiry_submit';

export interface LocalAnalyticsEvent {
  eventType: SiteAnalyticsEventType;
  sessionId: string;
  productId?: string;
  path: string;
  locale: Locale;
  createdAtIso: string;
}

export interface DailyAnalyticsPoint {
  date: string;
  label: string;
  visits: number;
  uniqueVisitors: number;
  orders: number;
  revenueVnd: number;
}

export interface TopProductStat {
  productId: string;
  name: string;
  sandboxOpens: number;
  detailViews: number;
  cartAdds: number;
  orderCount: number;
  revenueVnd: number;
}

export interface AdminCmsProduct extends TemplateProduct {
  isActive: boolean;
  updatedAtIso?: string;
}

export interface RawCloudProductRow {
  id: string;
  sku: string;
  name: string;
  subtitle_vi?: string;
  subtitle_en?: string;
  tagline_vi?: string;
  tagline_en?: string;
  category?: string;
  category_label_vi?: string;
  category_label_en?: string;
  price_vnd: number;
  original_price_vnd?: number;
  price_usd?: number;
  original_price_usd?: number;
  delivery_days_min?: number;
  delivery_days_max?: number;
  live_url?: string;
  preview_image?: string;
  preview_badge?: string | null;
  featured_rank?: number;
  stack_json?: unknown;
  deliverables_vi?: unknown;
  deliverables_en?: unknown;
  architecture_note_vi?: string;
  architecture_note_en?: string;
  metrics_badge?: string;
  is_active?: boolean;
  updated_at?: string;
}

export interface ProductAdminMutationInput {
  id: string;
  sku: string;
  name: string;
  subtitleVi: string;
  subtitleEn: string;
  taglineVi: string;
  taglineEn: string;
  category: Exclude<ProductCategory, 'all'>;
  categoryLabelVi?: string;
  categoryLabelEn?: string;
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
  deliverablesVi: string[];
  deliverablesEn: string[];
  architectureNoteVi: string;
  architectureNoteEn: string;
  metricsBadge: string;
  isActive: boolean;
}

const SESSION_ID_KEY = 'tvt_studio_anon_sid_v1';
const LOCAL_ANALYTICS_KEY = 'tvt_studio_local_analytics_v1';
const LOCAL_CMS_PRODUCTS_KEY = 'tvt_studio_cms_products_v1';

const CATEGORY_DEFAULT_LABELS: Record<Exclude<ProductCategory, 'all'>, { vi: string; en: string }> = {
  'commerce-3d': { vi: 'Bán Hàng 3D & Nội Thất', en: '3D Commerce & Interior' },
  'clinic-proptech': { vi: 'Y Tế, BĐS & Wellness', en: 'Clinic, PropTech & Wellness' },
  'pos-fnb': { vi: 'Nhà Hàng, Resort & POS', en: 'Hospitality & POS' },
  'enterprise-b2b': { vi: 'Doanh Nghiệp, HR & FinTech', en: 'Enterprise, EdTech & FinTech' },
  'saas-ai': { vi: 'SaaS & AI', en: 'SaaS & AI' },
};

const VALID_CAT_SET = new Set<Exclude<ProductCategory, 'all'>>([
  'commerce-3d',
  'clinic-proptech',
  'pos-fnb',
  'enterprise-b2b',
  'saas-ai',
]);

export function getCategoryDefaultLabel(
  category: Exclude<ProductCategory, 'all'>
): { vi: string; en: string } {
  return CATEGORY_DEFAULT_LABELS[category] ?? CATEGORY_DEFAULT_LABELS['saas-ai'];
}

export function getOrCreateAnonSessionId(): string {
  if (typeof window === 'undefined') return 'ssr-session';
  try {
    const existing = window.sessionStorage.getItem(SESSION_ID_KEY);
    if (existing && existing.length >= 8) return existing;
    const rand = Math.random().toString(36).slice(2, 10);
    const sid = `tvt_${Date.now().toString(36)}_${rand}`;
    window.sessionStorage.setItem(SESSION_ID_KEY, sid);
    return sid;
  } catch {
    return `tvt_mem_${Date.now().toString(36)}`;
  }
}

export function loadLocalAnalyticsEvents(): LocalAnalyticsEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_ANALYTICS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LocalAnalyticsEvent[]) : [];
  } catch {
    return [];
  }
}

function appendLocalAnalyticsEvent(ev: LocalAnalyticsEvent): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = loadLocalAnalyticsEvents();
    const next = [ev, ...existing].slice(0, 600);
    window.localStorage.setItem(LOCAL_ANALYTICS_KEY, JSON.stringify(next));
  } catch {
    // ignore storage quota errors
  }
}

/**
 * Records a zero-PII visitor/conversion event both locally (for instant offline telemetry)
 * and to Supabase Cloud via validated SECURITY DEFINER RPC `record_site_event`.
 */
export async function trackSiteEvent(
  eventType: SiteAnalyticsEventType,
  options?: { productId?: string; locale?: Locale }
): Promise<void> {
  const sessionId = getOrCreateAnonSessionId();
  const path =
    typeof window !== 'undefined' ? window.location.pathname.slice(0, 120) : '/';
  const referrer =
    typeof document !== 'undefined' ? (document.referrer || '').slice(0, 200) : '';
  const locale: Locale = options?.locale === 'en' ? 'en' : 'vi';

  appendLocalAnalyticsEvent({
    eventType,
    sessionId,
    productId: options?.productId,
    path,
    locale,
    createdAtIso: new Date().toISOString(),
  });

  const cfg = loadSupabaseRuntimeConfig();
  if (!cfg.url || !cfg.anonKey || typeof fetch !== 'function') return;

  try {
    await fetch(`${cfg.url}/rest/v1/rpc/record_site_event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: cfg.anonKey,
        Authorization: `Bearer ${cfg.anonKey}`,
      },
      body: JSON.stringify({
        p_event_type: eventType,
        p_session_id: sessionId,
        p_product_id: options?.productId ?? null,
        p_path: path,
        p_referrer: referrer,
        p_locale: locale,
      }),
    });
  } catch {
    // Never break UX or spam console when offline
  }
}

function toVnDateKey(isoOrDate: string | Date): string {
  const dt = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
  if (Number.isNaN(dt.getTime())) return '';
  const vnMs = dt.getTime() + 7 * 60 * 60 * 1000;
  return new Date(vnMs).toISOString().slice(0, 10);
}

export function computeLocalAnalyticsSummary(
  events: LocalAnalyticsEvent[],
  orders: OrderSnapshot[],
  products: TemplateProduct[]
): {
  totalVisits: number;
  uniqueVisitors: number;
  todayVisits: number;
  sandboxOpens: number;
  productDetailViews: number;
  addToCartEvents: number;
  checkoutStarts: number;
  conversionRatePct: number;
  paidConversionPct: number;
  dailySeries14d: DailyAnalyticsPoint[];
  topProducts: TopProductStat[];
} {
  const todayKey = toVnDateKey(new Date());
  const dailyMap = new Map<
    string,
    {
      date: string;
      label: string;
      visits: number;
      sessions: Set<string>;
      orders: number;
      revenueVnd: number;
    }
  >();

  for (let i = 13; i >= 0; i -= 1) {
    const dt = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = toVnDateKey(dt);
    dailyMap.set(key, {
      date: key,
      label: `${key.slice(8, 10)}/${key.slice(5, 7)}`,
      visits: 0,
      sessions: new Set<string>(),
      orders: 0,
      revenueVnd: 0,
    });
  }

  const nameLookup = new Map(products.map((p) => [p.id, p.name]));
  const statMap = new Map<string, TopProductStat>();
  const ensureStat = (pid: string): TopProductStat => {
    let found = statMap.get(pid);
    if (!found) {
      found = {
        productId: pid,
        name: nameLookup.get(pid) ?? pid,
        sandboxOpens: 0,
        detailViews: 0,
        cartAdds: 0,
        orderCount: 0,
        revenueVnd: 0,
      };
      statMap.set(pid, found);
    }
    return found;
  };

  const allSessions = new Set<string>();
  let totalVisits = 0;
  let todayVisits = 0;
  let sandboxOpens = 0;
  let productDetailViews = 0;
  let addToCartEvents = 0;
  let checkoutStarts = 0;

  for (const ev of events) {
    if (ev.sessionId) allSessions.add(ev.sessionId);
    const dayKey = toVnDateKey(ev.createdAtIso);
    if (ev.eventType === 'page_view') {
      totalVisits += 1;
      if (dayKey === todayKey) todayVisits += 1;
      const bucket = dailyMap.get(dayKey);
      if (bucket) {
        bucket.visits += 1;
        if (ev.sessionId) bucket.sessions.add(ev.sessionId);
      }
    } else if (ev.eventType === 'sandbox_open') {
      sandboxOpens += 1;
      if (ev.productId) ensureStat(ev.productId).sandboxOpens += 1;
    } else if (ev.eventType === 'product_detail') {
      productDetailViews += 1;
      if (ev.productId) ensureStat(ev.productId).detailViews += 1;
    } else if (ev.eventType === 'add_to_cart') {
      addToCartEvents += 1;
      if (ev.productId) ensureStat(ev.productId).cartAdds += 1;
    } else if (ev.eventType === 'checkout_start') {
      checkoutStarts += 1;
    }
  }

  const paidSet = new Set<OrderLifecycleStatus>([
    'DEPOSIT_VERIFIED',
    'IN_DEVELOPMENT',
    'UAT_STAGING',
    'DELIVERED',
  ]);
  let paidOrdersCount = 0;

  for (const o of orders) {
    const isPaid = paidSet.has(o.status ?? 'AWAITING_PAYMENT');
    if (isPaid) paidOrdersCount += 1;
    const dayKey = toVnDateKey(o.createdAtIso);
    const bucket = dailyMap.get(dayKey);
    if (bucket) {
      bucket.orders += 1;
      if (isPaid) bucket.revenueVnd += o.totals.payableNowVnd;
    }
    for (const item of o.items) {
      if (item.kind === 'template' && item.productId) {
        const st = ensureStat(item.productId);
        st.orderCount += Math.max(1, item.quantity);
        st.revenueVnd += item.unitVnd * Math.max(1, item.quantity);
      }
    }
  }

  const uniqueVisitors = allSessions.size;
  const conversionRatePct =
    uniqueVisitors > 0 ? Math.round((orders.length / uniqueVisitors) * 1000) / 10 : 0;
  const paidConversionPct =
    uniqueVisitors > 0 ? Math.round((paidOrdersCount / uniqueVisitors) * 1000) / 10 : 0;

  const dailySeries14d: DailyAnalyticsPoint[] = Array.from(dailyMap.values()).map((d) => ({
    date: d.date,
    label: d.label,
    visits: d.visits,
    uniqueVisitors: d.sessions.size,
    orders: d.orders,
    revenueVnd: d.revenueVnd,
  }));

  const topProducts = Array.from(statMap.values())
    .sort(
      (a, b) =>
        b.orderCount * 10 +
        b.cartAdds * 4 +
        b.sandboxOpens * 2 +
        b.detailViews -
        (a.orderCount * 10 + a.cartAdds * 4 + a.sandboxOpens * 2 + a.detailViews)
    )
    .slice(0, 8);

  return {
    totalVisits,
    uniqueVisitors,
    todayVisits,
    sandboxOpens,
    productDetailViews,
    addToCartEvents,
    checkoutStarts,
    conversionRatePct,
    paidConversionPct,
    dailySeries14d,
    topProducts,
  };
}

// ============================================================================
// Live Cloud CMS Product Catalog Mapping, Validation & Local Override Sync
// ============================================================================

export function mapDbRowToCmsProduct(row: RawCloudProductRow): AdminCmsProduct {
  const bundled = CATALOG_PRODUCTS.find((p) => p.id === row.id);
  const rawCat = String(row.category || bundled?.category || 'saas-ai') as Exclude<
    ProductCategory,
    'all'
  >;
  const category: Exclude<ProductCategory, 'all'> = VALID_CAT_SET.has(rawCat)
    ? rawCat
    : 'saas-ai';
  const catDefault = getCategoryDefaultLabel(category);

  const stack =
    Array.isArray(row.stack_json) && row.stack_json.length > 0
      ? row.stack_json.map(String)
      : bundled?.stack ?? ['React 19', 'TypeScript'];

  const delivVi =
    Array.isArray(row.deliverables_vi) && row.deliverables_vi.length > 0
      ? row.deliverables_vi.map(String)
      : bundled?.deliverables.vi ?? [
          'Tùy biến toàn bộ nhận diện thương hiệu, màu sắc & nội dung',
          'Triển khai Hosting, gắn Domain riêng, SSL & bảo hành kỹ thuật',
        ];

  const delivEn =
    Array.isArray(row.deliverables_en) && row.deliverables_en.length > 0
      ? row.deliverables_en.map(String)
      : bundled?.deliverables.en ?? [
          'Complete brand customization across palette, typography & content',
          'Production deployment with custom domain, SSL & engineering support',
        ];

  const priceVnd = Math.max(10_000, Number(row.price_vnd || bundled?.priceVnd || 9_900_000));
  const originalPriceVnd = Math.max(
    priceVnd,
    Number(row.original_price_vnd || bundled?.originalPriceVnd || Math.round(priceVnd * 1.45))
  );
  const priceUsd = Math.max(1, Number(row.price_usd || Math.round(priceVnd / 25_000)));
  const originalPriceUsd = Math.max(
    priceUsd,
    Number(row.original_price_usd || Math.round(originalPriceVnd / 25_000))
  );

  return {
    id: row.id,
    sku: row.sku || bundled?.sku || `TVT-${row.id.slice(0, 6).toUpperCase()}`,
    name: row.name || bundled?.name || row.id,
    subtitle: {
      vi: row.subtitle_vi || bundled?.subtitle.vi || 'Giải pháp website doanh nghiệp cao cấp',
      en: row.subtitle_en || bundled?.subtitle.en || 'Enterprise commercial web platform',
    },
    tagline: {
      vi: row.tagline_vi || bundled?.tagline.vi || '',
      en: row.tagline_en || bundled?.tagline.en || '',
    },
    category,
    categoryLabel: {
      vi: row.category_label_vi || bundled?.categoryLabel.vi || catDefault.vi,
      en: row.category_label_en || bundled?.categoryLabel.en || catDefault.en,
    },
    priceVnd,
    originalPriceVnd,
    priceUsd,
    originalPriceUsd,
    deliveryDaysMin: Math.max(1, Number(row.delivery_days_min || bundled?.deliveryDaysMin || 3)),
    deliveryDaysMax: Math.max(1, Number(row.delivery_days_max || bundled?.deliveryDaysMax || 6)),
    liveUrl: row.live_url || bundled?.liveUrl || 'https://tvt987.github.io/tvt-studio/',
    previewImage: row.preview_image || bundled?.previewImage || './media/studio-emblem.webp',
    previewBadge: row.preview_badge || bundled?.previewBadge || row.metrics_badge || undefined,
    featuredRank: Math.max(1, Number(row.featured_rank || bundled?.featuredRank || 50)),
    stack,
    deliverables: {
      vi: delivVi,
      en: delivEn,
    },
    architectureNote: {
      vi: row.architecture_note_vi || bundled?.architectureNote.vi || '',
      en: row.architecture_note_en || bundled?.architectureNote.en || '',
    },
    metricsBadge: row.metrics_badge || bundled?.metricsBadge || 'PRODUCTION READY',
    isActive: row.is_active !== false,
    updatedAtIso: row.updated_at,
  };
}

export function templateProductToAdminInput(
  product: TemplateProduct,
  isActive = true
): ProductAdminMutationInput {
  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    subtitleVi: product.subtitle.vi,
    subtitleEn: product.subtitle.en,
    taglineVi: product.tagline.vi,
    taglineEn: product.tagline.en,
    category: product.category,
    categoryLabelVi: product.categoryLabel.vi,
    categoryLabelEn: product.categoryLabel.en,
    priceVnd: product.priceVnd,
    originalPriceVnd: product.originalPriceVnd,
    priceUsd: product.priceUsd,
    originalPriceUsd: product.originalPriceUsd,
    deliveryDaysMin: product.deliveryDaysMin,
    deliveryDaysMax: product.deliveryDaysMax,
    liveUrl: product.liveUrl,
    previewImage: product.previewImage,
    previewBadge: product.previewBadge ?? product.metricsBadge,
    featuredRank: product.featuredRank,
    stack: product.stack,
    deliverablesVi: product.deliverables.vi,
    deliverablesEn: product.deliverables.en,
    architectureNoteVi: product.architectureNote.vi,
    architectureNoteEn: product.architectureNote.en,
    metricsBadge: product.metricsBadge,
    isActive,
  };
}

export function validateProductDraft(
  draft: Partial<ProductAdminMutationInput>
): { valid: boolean; error?: string } {
  const id = String(draft.id || '').trim().toLowerCase();
  if (!/^[a-z0-9][a-z0-9-]{1,63}$/.test(id)) {
    return {
      valid: false,
      error: 'ID slug chỉ gồm chữ thường, số và dấu gạch ngang (VD: my-pro-app)',
    };
  }
  const name = String(draft.name || '').trim();
  if (name.length < 2) {
    return { valid: false, error: 'Tên sản phẩm cần tối thiểu 2 ký tự' };
  }
  const priceVnd = Number(draft.priceVnd || 0);
  if (!Number.isFinite(priceVnd) || priceVnd < 10_000) {
    return { valid: false, error: 'Giá bán VNĐ tối thiểu 10.000₫' };
  }
  const liveUrl = String(draft.liveUrl || '').trim();
  if (liveUrl && !/^https:\/\//i.test(liveUrl)) {
    return { valid: false, error: 'Link Demo phải bắt đầu bằng https://' };
  }
  return { valid: true };
}

export function loadLocalCmsCatalogOverride(): AdminCmsProduct[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_CMS_PRODUCTS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? (parsed as AdminCmsProduct[]) : null;
  } catch {
    return null;
  }
}

export function saveLocalCmsCatalogOverride(products: AdminCmsProduct[] | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (!products) {
      window.localStorage.removeItem(LOCAL_CMS_PRODUCTS_KEY);
    } else {
      window.localStorage.setItem(LOCAL_CMS_PRODUCTS_KEY, JSON.stringify(products));
    }
  } catch {
    // ignore storage quota errors
  }
}

export function getBundledCmsProducts(): AdminCmsProduct[] {
  return [...CATALOG_PRODUCTS]
    .sort((a, b) => a.featuredRank - b.featuredRank)
    .map((p) => ({ ...p, isActive: true }));
}

/**
 * Loads the live active storefront product catalog from Supabase `tvt_products`
 * (reflecting Admin price updates, newly inserted products, and rank changes in real time).
 * Gracefully falls back to local Admin overrides or bundled `CATALOG_PRODUCTS`.
 */
export async function fetchLiveCatalogProducts(): Promise<TemplateProduct[]> {
  const cfg = loadSupabaseRuntimeConfig();
  if (cfg.url && cfg.anonKey && typeof fetch === 'function') {
    try {
      const res = await fetch(
        `${cfg.url}/rest/v1/tvt_products?select=*&is_active=eq.true&order=featured_rank.asc`,
        {
          headers: {
            apikey: cfg.anonKey,
            Authorization: `Bearer ${cfg.anonKey}`,
          },
        }
      );
      if (res.ok) {
        const rows = (await res.json()) as RawCloudProductRow[];
        if (Array.isArray(rows) && rows.length > 0) {
          return rows.map(mapDbRowToCmsProduct);
        }
      }
    } catch {
      // Fall back cleanly below
    }
  }

  const localOverride = loadLocalCmsCatalogOverride();
  if (localOverride) {
    return localOverride
      .filter((p) => p.isActive)
      .sort((a, b) => a.featuredRank - b.featuredRank);
  }
  return [...CATALOG_PRODUCTS].sort((a, b) => a.featuredRank - b.featuredRank);
}
