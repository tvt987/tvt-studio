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

export interface AdminOverviewPayload {
  source: 'supabase_cloud' | 'local_fallback';
  adminEmail: string;
  metrics: {
    totalOrders: number;
    paidOrdersCount: number;
    paidRevenueVnd: number;
    pipelineVnd: number;
    webhooksCount: number;
    webhooksTotalVnd: number;
    inquiriesCount: number;
    clientsCount: number;
  };
  orders: OrderSnapshot[];
  webhooks: AdminWebhookRecord[];
  inquiries: QuickInquiryRecord[];
  clients: AdminClientRecord[];
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
  inquiries: QuickInquiryRecord[]
): AdminOverviewPayload['metrics'] {
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
  return {
    totalOrders: orders.length,
    paidOrdersCount: paidOrders.length,
    paidRevenueVnd,
    pipelineVnd,
    webhooksCount: 0,
    webhooksTotalVnd: 0,
    inquiriesCount: inquiries.length,
    clientsCount: uniqueEmails.size,
  };
}

/**
 * Fetches live Cloud Admin overview via Zero-Trust `admin-ops` Supabase Edge Function
 * (cryptographically verified JWT for `tinhkun102@gmail.com`). Falls back cleanly to local data when offline.
 */
export async function fetchAdminCloudOverview(
  session: AuthSession | null,
  localOrders: OrderSnapshot[],
  localInquiries: QuickInquiryRecord[]
): Promise<AdminOverviewPayload> {
  const cfg = loadSupabaseRuntimeConfig();
  const fallback: AdminOverviewPayload = {
    source: 'local_fallback',
    adminEmail: session?.email ?? ADMIN_OWNER_EMAIL,
    metrics: computeLocalAdminMetrics(localOrders, localInquiries),
    orders: localOrders,
    webhooks: [],
    inquiries: localInquiries,
    clients: [],
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
      metrics?: AdminOverviewPayload['metrics'];
      orders?: RawCloudOrder[];
      webhooks?: Array<{
        id: number | string;
        provider?: string;
        provider_tx_id?: string;
        order_code?: string | null;
        transfer_amount_vnd?: number;
        transfer_content?: string;
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
      createdAtIso: w.created_at || new Date().toISOString(),
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

    return {
      source: 'supabase_cloud',
      adminEmail: data.adminEmail || session.email,
      metrics: data.metrics ?? computeLocalAdminMetrics(mergedOrders, mergedInquiries),
      orders: mergedOrders,
      webhooks,
      inquiries: mergedInquiries,
      clients,
    };
  } catch {
    return fallback;
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
      body: JSON.stringify({
        action: 'update_order',
        ...params,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    return { ok: Boolean(res.ok && data.ok), error: data.error };
  } catch {
    return { ok: false, error: 'Network error' };
  }
}

export async function deleteCloudOrderAsAdmin(
  session: AuthSession | null,
  orderCode: string
): Promise<{ ok: boolean; error?: string }> {
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
      body: JSON.stringify({
        action: 'delete_order',
        orderCode,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    return { ok: Boolean(res.ok && data.ok), error: data.error };
  } catch {
    return { ok: false, error: 'Network error' };
  }
}
