import {
  computeLocalAnalyticsSummary,
  getBundledCmsProducts,
  loadLocalAnalyticsEvents,
  loadLocalCmsCatalogOverride,
  mapDbRowToCmsProduct,
  type AdminCmsProduct,
  type DailyAnalyticsPoint,
  type ProductAdminMutationInput,
  type RawCloudProductRow,
  type TopProductStat,
} from './analyticsAndCms';
import { generateLicenseKey, normalizeEmail } from './authVault';
import { loadSupabaseRuntimeConfig } from './orderLedger';
import type {
  AuthSession,
  OrderLifecycleStatus,
  OrderSnapshot,
  PaymentChannel,
  QuickInquiryRecord,
} from './types';

export const ADMIN_OWNER_EMAIL = 'tinhkun102@gmail.com';

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return normalizeEmail(email) === ADMIN_OWNER_EMAIL;
}

export function isAdminSession(session?: AuthSession | null): boolean {
  return Boolean(session && isAdminEmail(session.email));
}

export interface AdminWebhookRecord {
  id: number | string;
  provider: string;
  providerTxId: string;
  orderCode: string | null;
  transferAmountVnd: number;
  transferContent: string;
  createdAtIso: string;
}

export interface AdminClientRecord {
  userId?: string;
  email: string;
  fullName: string;
  phoneOrZalo: string;
  brandOrDomain: string;
  preferredChannel: string;
  updatedAtIso: string;
}

export interface AdminMetrics {
  totalOrders: number;
  paidOrdersCount: number;
  paidRevenueVnd: number;
  pipelineVnd: number;
  webhooksCount: number;
  webhooksTotalVnd: number;
  inquiriesCount: number;
  clientsCount: number;
  totalVisits: number;
  uniqueVisitors: number;
  todayVisits: number;
  sandboxOpens: number;
  productDetailViews: number;
  addToCartEvents: number;
  checkoutStarts: number;
  conversionRatePct: number;
  paidConversionPct: number;
  activeProductsCount: number;
  totalProductsCount: number;
}

export interface AdminOverviewPayload {
  source: 'supabase_cloud' | 'local_fallback';
  adminEmail: string;
  metrics: AdminMetrics;
  analytics: {
    dailySeries14d: DailyAnalyticsPoint[];
    topProducts: TopProductStat[];
  };
  orders: OrderSnapshot[];
  webhooks: AdminWebhookRecord[];
  inquiries: QuickInquiryRecord[];
  clients: AdminClientRecord[];
  products: AdminCmsProduct[];
  errorMessage?: string;
}

interface RawCloudOrder {
  user_id?: string | null;
  order_code: string;
  created_at?: string;
  status?: OrderLifecycleStatus;
  payment_channel?: PaymentChannel;
  payment_mode?: 'deposit-30' | 'full';
  payment_ref?: string | null;
  paid_amount_vnd?: number | null;
  paid_at?: string | null;
  license_key?: string | null;
  delivery_zip_url?: string | null;
  download_count?: number | null;
  client_name?: string;
  client_phone?: string;
  client_email?: string;
  brand_or_domain?: string | null;
  notes?: string | null;
  net_total_vnd?: number;
  net_total_usd?: number;
  payable_now_vnd?: number;
  payable_now_usd?: number;
  items_json?: unknown[];
}

function mapCloudOrderToSnapshot(row: RawCloudOrder): OrderSnapshot {
  const netVnd = Number(row.net_total_vnd || 0);
  const payNowVnd = Number(row.payable_now_vnd || 0);
  const netUsd = Number(row.net_total_usd || Math.round(netVnd / 25_000));
  const payNowUsd = Number(row.payable_now_usd || Math.round(payNowVnd / 25_000));
  const items = Array.isArray(row.items_json)
    ? (row.items_json as OrderSnapshot['items'])
    : [];

  return {
    orderCode: row.order_code,
    createdAtIso: row.created_at || new Date().toISOString(),
    currency: 'VND',
    paymentChannel: row.payment_channel || 'vietqr',
    paymentMode: row.payment_mode || 'deposit-30',
    paymentRef: row.payment_ref || undefined,
    status: row.status || 'AWAITING_PAYMENT',
    syncState: 'supabase_synced',
    userId: row.user_id || undefined,
    deliverable: {
      licenseKey: row.license_key || generateLicenseKey(row.order_code),
      sourceDownloadUrl: row.delivery_zip_url || undefined,
      unlockedAtIso: row.paid_at || undefined,
      downloadCount: Number(row.download_count || 0),
    },
    client: {
      fullName: row.client_name || 'Khách hàng',
      phoneOrZalo: row.client_phone || '',
      email: row.client_email || '',
      brandOrDomain: row.brand_or_domain || '',
      notes: row.notes || '',
    },
    items,
    totals: {
      itemCount: items.length || 1,
      subtotalVnd: netVnd,
      subtotalUsd: netUsd,
      discountVnd: 0,
      discountUsd: 0,
      netTotalVnd: netVnd,
      netTotalUsd: netUsd,
      payableNowVnd: payNowVnd,
      payableNowUsd: payNowUsd,
      remainingVnd: Math.max(0, netVnd - payNowVnd),
      remainingUsd: Math.max(0, netUsd - payNowUsd),
      paymentMode: row.payment_mode || 'deposit-30',
      appliedVoucher: undefined,
    },
    milestones: [],
    events: [],
  };
}

export function computeLocalAdminMetrics(
  orders: OrderSnapshot[],
  inquiries: QuickInquiryRecord[],
  products: AdminCmsProduct[] = getBundledCmsProducts()
): AdminMetrics {
  const paidSet = new Set<OrderLifecycleStatus>([
    'DEPOSIT_VERIFIED',
    'IN_DEVELOPMENT',
    'UAT_STAGING',
    'DELIVERED',
  ]);
  const paidOrders = orders.filter((o) => paidSet.has(o.status ?? 'AWAITING_PAYMENT'));
  const paidRevenueVnd = paidOrders.reduce((acc, o) => acc + o.totals.payableNowVnd, 0);
  const pipelineVnd = orders.reduce((acc, o) => acc + o.totals.netTotalVnd, 0);
  const uniqueEmails = new Set(
    orders.map((o) => normalizeEmail(o.client.email)).filter(Boolean)
  );
  const localEvents = loadLocalAnalyticsEvents();
  const analytics = computeLocalAnalyticsSummary(localEvents, orders, products);

  return {
    totalOrders: orders.length,
    paidOrdersCount: paidOrders.length,
    paidRevenueVnd,
    pipelineVnd,
    webhooksCount: 0,
    webhooksTotalVnd: 0,
    inquiriesCount: inquiries.length,
    clientsCount: uniqueEmails.size,
    totalVisits: analytics.totalVisits,
    uniqueVisitors: analytics.uniqueVisitors,
    todayVisits: analytics.todayVisits,
    sandboxOpens: analytics.sandboxOpens,
    productDetailViews: analytics.productDetailViews,
    addToCartEvents: analytics.addToCartEvents,
    checkoutStarts: analytics.checkoutStarts,
    conversionRatePct: analytics.conversionRatePct,
    paidConversionPct: analytics.paidConversionPct,
    activeProductsCount: products.filter((p) => p.isActive).length,
    totalProductsCount: products.length,
  };
}

export async function fetchAdminCloudOverview(
  session: AuthSession | null,
  localOrders: OrderSnapshot[],
  localInquiries: QuickInquiryRecord[]
): Promise<AdminOverviewPayload> {
  const cfg = loadSupabaseRuntimeConfig();
  const localProducts = loadLocalCmsCatalogOverride() ?? getBundledCmsProducts();
  const localEvents = loadLocalAnalyticsEvents();
  const localAnalytics = computeLocalAnalyticsSummary(localEvents, localOrders, localProducts);

  const fallback: AdminOverviewPayload = {
    source: 'local_fallback',
    adminEmail: session?.email ?? ADMIN_OWNER_EMAIL,
    metrics: computeLocalAdminMetrics(localOrders, localInquiries, localProducts),
    analytics: {
      dailySeries14d: localAnalytics.dailySeries14d,
      topProducts: localAnalytics.topProducts,
    },
    orders: localOrders,
    webhooks: [],
    inquiries: localInquiries,
    clients: [],
    products: localProducts,
  };

  if (
    !cfg.url ||
    !cfg.anonKey ||
    !session?.accessToken ||
    !isAdminSession(session) ||
    typeof fetch !== 'function'
  ) {
    return fallback;
  }

  try {
    const res = await fetch(`${cfg.url}/functions/v1/admin-ops`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: cfg.anonKey,
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({ action: 'overview' }),
    });

    const data = (await res.json()) as {
      ok?: boolean;
      error?: string;
      adminEmail?: string;
      metrics?: Partial<AdminMetrics>;
      analytics?: {
        dailySeries14d?: DailyAnalyticsPoint[];
        topProducts?: TopProductStat[];
      };
      orders?: RawCloudOrder[];
      webhooks?: Array<{
        id: number | string;
        provider?: string;
        provider_tx_id?: string;
        order_code?: string | null;
        transfer_amount_vnd?: number;
        transfer_content?: string;
        received_at?: string;
        created_at?: string;
      }>;
      inquiries?: Array<{
        inquiry_code: string;
        created_at?: string;
        product_name?: string;
        client_name?: string;
        client_phone?: string;
        client_email?: string;
        preferred_language?: string;
        budget_note?: string;
        message?: string;
      }>;
      profiles?: Array<{
        user_id?: string;
        email?: string;
        full_name?: string;
        phone_or_zalo?: string;
        brand_or_domain?: string;
        preferred_channel?: string;
        updated_at?: string;
      }>;
      products?: RawCloudProductRow[];
    };

    if (!res.ok || !data.ok) {
      return {
        ...fallback,
        errorMessage: data.error || `Cloud Admin API returned HTTP ${res.status}`,
      };
    }

    const cloudOrders = (data.orders ?? []).map(mapCloudOrderToSnapshot);
    const seen = new Set(cloudOrders.map((o) => o.orderCode));
    const mergedOrders = [
      ...cloudOrders,
      ...localOrders.filter((lo) => !seen.has(lo.orderCode)),
    ];

    const cloudInquiries: QuickInquiryRecord[] = (data.inquiries ?? []).map((inq) => ({
      inquiryCode: inq.inquiry_code,
      createdAtIso: inq.created_at || new Date().toISOString(),
      productName: inq.product_name,
      fullName: inq.client_name || '',
      phoneOrZalo: inq.client_phone || '',
      email: inq.client_email || '',
      preferredLanguage: inq.preferred_language || 'Any',
      budgetNote: inq.budget_note || '',
      message: inq.message || '',
      syncState: 'supabase_synced',
    }));
    const inqSeen = new Set(cloudInquiries.map((i) => i.inquiryCode));
    const mergedInquiries = [
      ...cloudInquiries,
      ...localInquiries.filter((li) => !inqSeen.has(li.inquiryCode)),
    ];

    const webhooks: AdminWebhookRecord[] = (data.webhooks ?? []).map((w) => ({
      id: w.id,
      provider: w.provider || 'sepay',
      providerTxId: w.provider_tx_id || String(w.id),
      orderCode: w.order_code ?? null,
      transferAmountVnd: Number(w.transfer_amount_vnd || 0),
      transferContent: w.transfer_content || '',
      createdAtIso: w.received_at || w.created_at || new Date().toISOString(),
    }));

    const clients: AdminClientRecord[] = (data.profiles ?? []).map((p) => ({
      userId: p.user_id,
      email: p.email || '',
      fullName: p.full_name || '',
      phoneOrZalo: p.phone_or_zalo || '',
      brandOrDomain: p.brand_or_domain || '',
      preferredChannel: p.preferred_channel || 'vietqr',
      updatedAtIso: p.updated_at || new Date().toISOString(),
    }));

    const cloudProducts: AdminCmsProduct[] =
      Array.isArray(data.products) && data.products.length > 0
        ? data.products.map(mapDbRowToCmsProduct)
        : localProducts;

    const baseMetrics = computeLocalAdminMetrics(mergedOrders, mergedInquiries, cloudProducts);
    const mergedMetrics: AdminMetrics = {
      ...baseMetrics,
      ...(data.metrics ?? {}),
      activeProductsCount: cloudProducts.filter((p) => p.isActive).length,
      totalProductsCount: cloudProducts.length,
    };

    return {
      source: 'supabase_cloud',
      adminEmail: data.adminEmail || session.email,
      metrics: mergedMetrics,
      analytics: {
        dailySeries14d:
          data.analytics?.dailySeries14d && data.analytics.dailySeries14d.length > 0
            ? data.analytics.dailySeries14d
            : localAnalytics.dailySeries14d,
        topProducts: data.analytics?.topProducts ?? localAnalytics.topProducts,
      },
      orders: mergedOrders,
      webhooks,
      inquiries: mergedInquiries,
      clients,
      products: cloudProducts,
    };
  } catch {
    return fallback;
  }
}

async function callAdminEdge<T>(
  session: AuthSession | null,
  payload: Record<string, unknown>
): Promise<{ ok: boolean; data?: T; error?: string }> {
  const cfg = loadSupabaseRuntimeConfig();
  if (!cfg.url || !cfg.anonKey || !session?.accessToken || !isAdminSession(session)) {
    return { ok: false, error: 'Not signed in as Cloud Admin' };
  }
  try {
    const res = await fetch(`${cfg.url}/functions/v1/admin-ops`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: cfg.anonKey,
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string } & T;
    return { ok: Boolean(res.ok && data.ok), data, error: data.error };
  } catch {
    return { ok: false, error: 'Network error' };
  }
}

export async function updateCloudOrderAsAdmin(
  session: AuthSession | null,
  params: {
    orderCode: string;
    status?: OrderLifecycleStatus;
    deliveryZipUrl?: string;
    licenseKey?: string;
  }
): Promise<{ ok: boolean; error?: string }> {
  const res = await callAdminEdge(session, { action: 'update_order', ...params });
  return { ok: res.ok, error: res.error };
}

export async function deleteCloudOrderAsAdmin(
  session: AuthSession | null,
  orderCode: string
): Promise<{ ok: boolean; error?: string }> {
  const res = await callAdminEdge(session, { action: 'delete_order', orderCode });
  return { ok: res.ok, error: res.error };
}

export async function upsertCloudProductAsAdmin(
  session: AuthSession | null,
  product: ProductAdminMutationInput
): Promise<{ ok: boolean; product?: AdminCmsProduct; error?: string }> {
  const res = await callAdminEdge<{ product?: RawCloudProductRow }>(session, {
    action: 'upsert_product',
    product,
  });
  return {
    ok: res.ok,
    product: res.data?.product ? mapDbRowToCmsProduct(res.data.product) : undefined,
    error: res.error,
  };
}

export async function quickUpdateCloudPriceAsAdmin(
  session: AuthSession | null,
  params: {
    productId: string;
    priceVnd?: number;
    originalPriceVnd?: number;
    featuredRank?: number;
    isActive?: boolean;
  }
): Promise<{ ok: boolean; product?: AdminCmsProduct; error?: string }> {
  const res = await callAdminEdge<{ product?: RawCloudProductRow }>(session, {
    action: 'quick_update_price',
    ...params,
  });
  return {
    ok: res.ok,
    product: res.data?.product ? mapDbRowToCmsProduct(res.data.product) : undefined,
    error: res.error,
  };
}

export async function deleteCloudProductAsAdmin(
  session: AuthSession | null,
  productId: string
): Promise<{ ok: boolean; error?: string }> {
  const res = await callAdminEdge(session, { action: 'delete_product', productId });
  return { ok: res.ok, error: res.error };
}

export async function bulkSeedCloudProductsAsAdmin(
  session: AuthSession | null,
  products: ProductAdminMutationInput[]
): Promise<{ ok: boolean; seededCount?: number; error?: string }> {
  const res = await callAdminEdge<{ seededCount?: number }>(session, {
    action: 'bulk_seed_products',
    products,
  });
  return { ok: res.ok, seededCount: res.data?.seededCount, error: res.error };
}
