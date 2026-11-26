import { formatMoney, STUDIO_CONTACT } from './catalog';
import { getPaymentChannelLabel } from './invoice';
import type {
  CloudSyncState,
  Locale,
  OrderLifecycleStatus,
  OrderSnapshot,
  OrderTimelineEvent,
  QuickInquiryRecord,
} from './types';

const IDB_NAME = 'tvt_studio_commerce_db';
const IDB_VERSION = 1;
const STORE_ORDERS = 'orders';
const STORE_INQUIRIES = 'inquiries';
const LS_ORDERS_KEY = 'tvt_studio_orders_v2';
const LS_INQUIRIES_KEY = 'tvt_studio_inquiries_v2';
const SUPABASE_RUNTIME_KEY = 'tvt_studio_supabase_runtime_v2';

export interface SupabaseRuntimeConfig {
  url: string;
  anonKey: string;
  enableEmailWebhook: boolean;
}

export const ORDER_STATUS_META: Record<
  OrderLifecycleStatus,
  { stepIndex: number; vi: string; en: string; colorVar: string }
> = {
  PENDING_CONSULTATION: {
    stepIndex: 0,
    vi: 'Chờ Tư Vấn & Chốt Chi Tiết',
    en: 'Pending Consultation',
    colorVar: 'var(--cyan)',
  },
  AWAITING_PAYMENT: {
    stepIndex: 0,
    vi: 'Đã Tạo Đơn · Chờ Thanh Toán',
    en: 'Created · Awaiting Payment',
    colorVar: 'var(--accent)',
  },
  PROOF_SUBMITTED: {
    stepIndex: 1,
    vi: 'Đã Gửi Mã Giao Dịch · Chờ Xác Minh',
    en: 'Transfer Proof Submitted',
    colorVar: 'var(--cyan)',
  },
  DEPOSIT_VERIFIED: {
    stepIndex: 2,
    vi: 'Đã Xác Nhận Cọc · Khóa Lịch Code',
    en: 'Deposit Verified · Kickoff Locked',
    colorVar: 'var(--emerald)',
  },
  IN_DEVELOPMENT: {
    stepIndex: 3,
    vi: 'Đang Thiết Kế & Lập Trình',
    en: 'In Active Development',
    colorVar: 'var(--accent)',
  },
  UAT_STAGING: {
    stepIndex: 4,
    vi: 'Đã Gửi Link Staging · Đang Tinh Chỉnh',
    en: 'Staging Live · UAT Tuning',
    colorVar: 'var(--cyan)',
  },
  DELIVERED: {
    stepIndex: 5,
    vi: 'Hoàn Tất Go-Live · Đang Hỗ Trợ Sử Dụng',
    en: 'Delivered Live · Support Active',
    colorVar: 'var(--emerald)',
  },
};

export const ORDER_STATUS_SEQUENCE: OrderLifecycleStatus[] = [
  'PENDING_CONSULTATION',
  'AWAITING_PAYMENT',
  'PROOF_SUBMITTED',
  'DEPOSIT_VERIFIED',
  'IN_DEVELOPMENT',
  'UAT_STAGING',
  'DELIVERED',
];

export function generateInquiryCode(seed?: number): string {
  const num =
    seed !== undefined
      ? Math.abs(Math.floor(seed)) % 9000 + 1000
      : Math.floor(1000 + Math.random() * 9000);
  return `TVT-INQ-${num}`;
}

export function resolveInitialOrderStatus(
  paymentChannel: OrderSnapshot['paymentChannel'],
  paymentRef?: string
): OrderLifecycleStatus {
  if (paymentChannel === 'consult-first') {
    return 'PENDING_CONSULTATION';
  }
  if (paymentRef && paymentRef.trim().length >= 4) {
    return 'PROOF_SUBMITTED';
  }
  return 'AWAITING_PAYMENT';
}

export function createOrderEvent(
  status: OrderLifecycleStatus,
  noteVi: string,
  noteEn: string,
  atIso?: string
): OrderTimelineEvent {
  return {
    atIso: atIso ?? new Date().toISOString(),
    status,
    noteVi,
    noteEn,
  };
}

export function appendStatusTransition(
  order: OrderSnapshot,
  nextStatus: OrderLifecycleStatus,
  customNoteVi?: string,
  customNoteEn?: string,
  paymentRef?: string,
  atIso?: string
): OrderSnapshot {
  const meta = ORDER_STATUS_META[nextStatus];
  const event = createOrderEvent(
    nextStatus,
    customNoteVi ?? `Cập nhật trạng thái: ${meta.vi}`,
    customNoteEn ?? `Status updated: ${meta.en}`,
    atIso
  );
  return {
    ...order,
    status: nextStatus,
    paymentRef: paymentRef !== undefined ? paymentRef.trim() : order.paymentRef,
    events: [...(order.events ?? []), event],
  };
}

// ============================================================================
// IndexedDB + localStorage Dual-Resilience Storage Layer
// ============================================================================

function openLedgerDb(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    try {
      const req = window.indexedDB.open(IDB_NAME, IDB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_ORDERS)) {
          db.createObjectStore(STORE_ORDERS, { keyPath: 'orderCode' });
        }
        if (!db.objectStoreNames.contains(STORE_INQUIRIES)) {
          db.createObjectStore(STORE_INQUIRIES, { keyPath: 'inquiryCode' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

function readLocalFallback<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function writeLocalFallback<T>(key: string, records: T[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(records));
  } catch {
    // Ignore storage quota errors
  }
}

export async function loadPersistedOrders(): Promise<OrderSnapshot[]> {
  const db = await openLedgerDb();
  if (db) {
    try {
      const rows = await new Promise<OrderSnapshot[]>((resolve) => {
        const tx = db.transaction(STORE_ORDERS, 'readonly');
        const req = tx.objectStore(STORE_ORDERS).getAll();
        req.onsuccess = () => resolve((req.result as OrderSnapshot[]) ?? []);
        req.onerror = () => resolve([]);
      });
      db.close();
      if (rows.length > 0) {
        return rows.sort((a, b) => b.createdAtIso.localeCompare(a.createdAtIso));
      }
    } catch {
      db.close();
    }
  }
  return readLocalFallback<OrderSnapshot>(LS_ORDERS_KEY).sort((a, b) =>
    b.createdAtIso.localeCompare(a.createdAtIso)
  );
}

export async function savePersistedOrder(order: OrderSnapshot): Promise<OrderSnapshot[]> {
  const existing = await loadPersistedOrders();
  const merged = [order, ...existing.filter((item) => item.orderCode !== order.orderCode)];
  writeLocalFallback(LS_ORDERS_KEY, merged);

  const db = await openLedgerDb();
  if (db) {
    try {
      await new Promise<void>((resolve) => {
        const tx = db.transaction(STORE_ORDERS, 'readwrite');
        tx.objectStore(STORE_ORDERS).put(order);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    } finally {
      db.close();
    }
  }
  return merged;
}

export async function loadPersistedInquiries(): Promise<QuickInquiryRecord[]> {
  const db = await openLedgerDb();
  if (db) {
    try {
      const rows = await new Promise<QuickInquiryRecord[]>((resolve) => {
        const tx = db.transaction(STORE_INQUIRIES, 'readonly');
        const req = tx.objectStore(STORE_INQUIRIES).getAll();
        req.onsuccess = () => resolve((req.result as QuickInquiryRecord[]) ?? []);
        req.onerror = () => resolve([]);
      });
      db.close();
      if (rows.length > 0) {
        return rows.sort((a, b) => b.createdAtIso.localeCompare(a.createdAtIso));
      }
    } catch {
      db.close();
    }
  }
  return readLocalFallback<QuickInquiryRecord>(LS_INQUIRIES_KEY).sort((a, b) =>
    b.createdAtIso.localeCompare(a.createdAtIso)
  );
}

export async function savePersistedInquiry(
  inquiry: QuickInquiryRecord
): Promise<QuickInquiryRecord[]> {
  const existing = await loadPersistedInquiries();
  const merged = [inquiry, ...existing.filter((item) => item.inquiryCode !== inquiry.inquiryCode)];
  writeLocalFallback(LS_INQUIRIES_KEY, merged);

  const db = await openLedgerDb();
  if (db) {
    try {
      await new Promise<void>((resolve) => {
        const tx = db.transaction(STORE_INQUIRIES, 'readwrite');
        tx.objectStore(STORE_INQUIRIES).put(inquiry);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    } finally {
      db.close();
    }
  }
  return merged;
}

// ============================================================================
// Pluggable Cloud DB (Supabase PostgreSQL) & Zero-Cost Email Webhook Adapter
// ============================================================================

export function loadSupabaseRuntimeConfig(): SupabaseRuntimeConfig {
  const envUrl = (import.meta.env?.VITE_SUPABASE_URL as string | undefined)?.trim() ?? '';
  const envKey = (import.meta.env?.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() ?? '';
  if (envUrl && envKey) {
    return { url: envUrl, anonKey: envKey, enableEmailWebhook: true };
  }
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(SUPABASE_RUNTIME_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<SupabaseRuntimeConfig>;
        return {
          url: (parsed.url ?? '').trim(),
          anonKey: (parsed.anonKey ?? '').trim(),
          enableEmailWebhook: parsed.enableEmailWebhook ?? true,
        };
      }
    } catch {
      // ignore
    }
  }
  return { url: '', anonKey: '', enableEmailWebhook: true };
}

export function saveSupabaseRuntimeConfig(config: SupabaseRuntimeConfig): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      SUPABASE_RUNTIME_KEY,
      JSON.stringify({
        url: config.url.trim().replace(/\/+$/, ''),
        anonKey: config.anonKey.trim(),
        enableEmailWebhook: config.enableEmailWebhook,
      })
    );
  } catch {
    // ignore
  }
}

export async function dispatchOrderToCloud(
  order: OrderSnapshot,
  locale: Locale
): Promise<CloudSyncState> {
  const cfg = loadSupabaseRuntimeConfig();

  // 1. Authoritative Server-Side Order Creation (Supabase Edge Function `create-order`)
  // Recomputes prices & discounts server-side to block DevTools price tampering!
  if (cfg.url && cfg.anonKey && typeof fetch === 'function') {
    try {
      const res = await fetch(`${cfg.url}/functions/v1/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: cfg.anonKey,
          Authorization: `Bearer ${cfg.anonKey}`,
        },
        body: JSON.stringify({
          orderCode: order.orderCode,
          paymentChannel: order.paymentChannel,
          paymentMode: order.paymentMode,
          paymentRef: order.paymentRef ?? null,
          voucherCode: order.totals.appliedVoucher?.code ?? null,
          client: order.client,
          items: order.items.map((it) =>
            it.kind === 'template'
              ? {
                  kind: 'template',
                  productId: it.productId,
                  license: it.license,
                  quantity: it.quantity,
                }
              : {
                  kind: 'custom',
                  quantity: it.quantity,
                  unitVnd: it.unitVnd,
                  title: it.title,
                }
          ),
        }),
      });
      if (res.ok) {
        return 'supabase_synced';
      }
    } catch {
      // Fall through to email webhook / local IDB
    }
  }

  // 2. Zero-Cost Live Email Webhook (FormSubmit.co -> tinhkun102@gmail.com)
  // FormSubmit only accepts requests from deployed public domains (rejects localhost with 403).
  const isLocalHost =
    typeof window !== 'undefined' &&
    ['localhost', '127.0.0.1', ''].includes(window.location.hostname);

  if (cfg.enableEmailWebhook && !isLocalHost && typeof fetch === 'function') {
    try {
      const itemSummary = order.items
        .map((it) =>
          it.kind === 'template'
            ? `${it.title} (${it.license}) x${it.quantity}`
            : `${it.title[locale]} x${it.quantity}`
        )
        .join(' | ');

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`https://formsubmit.co/ajax/${STUDIO_CONTACT.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          _subject: `[TVT Studio] Đơn mới ${order.orderCode} - ${order.client.fullName}`,
          _template: 'table',
          order_code: order.orderCode,
          status: order.status ?? 'AWAITING_PAYMENT',
          client_name: order.client.fullName,
          phone_zalo: order.client.phoneOrZalo,
          email: order.client.email,
          brand_domain: order.client.brandOrDomain || 'Chưa cung cấp',
          payment_channel: getPaymentChannelLabel(order.paymentChannel, 'vi'),
          payment_ref: order.paymentRef || 'Chưa nhập (Tư vấn / Chờ CK)',
          payable_now: `${formatMoney(order.totals.payableNowVnd, 'VND')} (${formatMoney(order.totals.payableNowUsd, 'USD')})`,
          contract_total: `${formatMoney(order.totals.netTotalVnd, 'VND')} (${formatMoney(order.totals.netTotalUsd, 'USD')})`,
          items: itemSummary,
          notes: order.client.notes || 'Không có',
        }),
      });
      clearTimeout(timer);
      if (res.ok) {
        return 'email_webhook_sent';
      }
    } catch {
      // Graceful offline fallback — order is already safely saved in IndexedDB
    }
  }

  return 'local_idb_only';
}

export async function dispatchInquiryToCloud(
  inquiry: QuickInquiryRecord
): Promise<CloudSyncState> {
  const cfg = loadSupabaseRuntimeConfig();

  if (cfg.url && cfg.anonKey && typeof fetch === 'function') {
    try {
      const res = await fetch(`${cfg.url}/rest/v1/tvt_inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: cfg.anonKey,
          Authorization: `Bearer ${cfg.anonKey}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          inquiry_code: inquiry.inquiryCode,
          product_name: inquiry.productName ?? 'Custom Project',
          client_name: inquiry.fullName,
          client_phone: inquiry.phoneOrZalo,
          client_email: inquiry.email,
          preferred_language: inquiry.preferredLanguage,
          budget_note: inquiry.budgetNote,
          message: inquiry.message,
        }),
      });
      if (res.ok) {
        void fetch(`${cfg.url}/functions/v1/order-notify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: cfg.anonKey,
            Authorization: `Bearer ${cfg.anonKey}`,
          },
          body: JSON.stringify({
            type: 'inquiry',
            code: inquiry.inquiryCode,
            clientName: inquiry.fullName,
            phone: inquiry.phoneOrZalo,
            summary: `${inquiry.productName || 'Custom'} · ${inquiry.preferredLanguage} · ${inquiry.message}`,
          }),
        }).catch(() => null);
        return 'supabase_synced';
      }
    } catch {
      // fall through
    }
  }

  const isLocalHost =
    typeof window !== 'undefined' &&
    ['localhost', '127.0.0.1', ''].includes(window.location.hostname);

  if (cfg.enableEmailWebhook && !isLocalHost && typeof fetch === 'function') {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`https://formsubmit.co/ajax/${STUDIO_CONTACT.email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          _subject: `[TVT Studio] Yêu cầu tư vấn ${inquiry.inquiryCode} - ${inquiry.fullName}`,
          _template: 'table',
          inquiry_code: inquiry.inquiryCode,
          product: inquiry.productName || 'Thiết kế / Code theo yêu cầu',
          client_name: inquiry.fullName,
          phone_zalo: inquiry.phoneOrZalo,
          email: inquiry.email,
          preferred_stack: inquiry.preferredLanguage,
          budget_expectation: inquiry.budgetNote || 'Thương lượng linh hoạt',
          message: inquiry.message,
        }),
      });
      clearTimeout(timer);
      if (res.ok) return 'email_webhook_sent';
    } catch {
      // fall through
    }
  }

  return 'local_idb_only';
}

function escapeCsvCell(value: string): string {
  const str = String(value ?? '');
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Generates a UTF-8 BOM Excel-safe CSV ledger of all persisted orders.
 */
export function exportOrdersToCsvBom(orders: OrderSnapshot[]): string {
  const headers = [
    'OrderCode',
    'CreatedAtUTC',
    'Status',
    'ClientName',
    'PhoneOrZalo',
    'Email',
    'BrandOrDomain',
    'PaymentChannel',
    'PaymentMode',
    'PaymentRef',
    'NetTotalVND',
    'PayableNowVND',
    'NetTotalUSD',
    'Items',
    'SyncState',
  ];

  const rows = orders.map((order) => {
    const itemsText = order.items
      .map((i) => (i.kind === 'template' ? `${i.title} (${i.license}) x${i.quantity}` : `${i.title.vi} x${i.quantity}`))
      .join('; ');
    return [
      order.orderCode,
      order.createdAtIso,
      order.status ?? 'AWAITING_PAYMENT',
      order.client.fullName,
      order.client.phoneOrZalo,
      order.client.email,
      order.client.brandOrDomain,
      order.paymentChannel,
      order.paymentMode,
      order.paymentRef ?? '',
      String(order.totals.netTotalVnd),
      String(order.totals.payableNowVnd),
      String(order.totals.netTotalUsd),
      itemsText,
      order.syncState ?? 'local_idb_only',
    ]
      .map(escapeCsvCell)
      .join(',');
  });

  return `\uFEFF${headers.join(',')}\n${rows.join('\n')}\n`;
}

// ============================================================================
// Real-Time Payment Status Poller (Supabase Non-PII RPC) & Cross-Tab Bus
// ============================================================================

export interface RealtimePaymentUpdate {
  orderCode: string;
  status: OrderLifecycleStatus;
  paidAmountVnd: number;
  paymentRef: string;
  gateway?: string;
  verifiedAtIso: string;
}

const REALTIME_CHANNEL_NAME = 'tvt_studio_realtime_payments_v2';

export function isCloudRealtimeConfigured(): boolean {
  const cfg = loadSupabaseRuntimeConfig();
  return Boolean(cfg.url && cfg.anonKey);
}

/**
 * Polls the zero-PII Supabase RPC `get_order_payment_status(p_order_code)`
 * so the customer's checkout / tracker screen auto-updates within 3 seconds
 * of an inbound SePay / PayOS VietQR webhook (even while the owner is offline).
 */
export async function pollOrderCloudPaymentStatus(
  orderCode: string
): Promise<RealtimePaymentUpdate | null> {
  const cfg = loadSupabaseRuntimeConfig();
  if (!cfg.url || !cfg.anonKey || typeof fetch !== 'function') return null;

  try {
    const res = await fetch(`${cfg.url}/rest/v1/rpc/get_order_payment_status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: cfg.anonKey,
        Authorization: `Bearer ${cfg.anonKey}`,
      },
      body: JSON.stringify({ p_order_code: orderCode }),
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as Array<{
      order_code: string;
      status: OrderLifecycleStatus;
      paid_amount_vnd: number;
      payment_ref?: string | null;
      paid_at?: string | null;
      updated_at?: string | null;
    }>;
    const row = Array.isArray(rows) ? rows[0] : null;
    if (!row) return null;
    return {
      orderCode: row.order_code,
      status: row.status,
      paidAmountVnd: Number(row.paid_amount_vnd || 0),
      paymentRef: row.payment_ref || 'AUTO-VIETQR',
      verifiedAtIso: row.paid_at || row.updated_at || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function broadcastRealtimePaymentVerified(update: RealtimePaymentUpdate): void {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new CustomEvent<RealtimePaymentUpdate>(REALTIME_CHANNEL_NAME, { detail: update }));
    if ('BroadcastChannel' in window) {
      const ch = new BroadcastChannel(REALTIME_CHANNEL_NAME);
      ch.postMessage(update);
      ch.close();
    }
  } catch {
    // Ignore unsupported environments
  }
}

export function subscribeRealtimePaymentVerified(
  handler: (update: RealtimePaymentUpdate) => void
): () => void {
  if (typeof window === 'undefined') return () => {};
  const onDomEvent = (ev: Event) => {
    const detail = (ev as CustomEvent<RealtimePaymentUpdate>).detail;
    if (detail?.orderCode) handler(detail);
  };
  window.addEventListener(REALTIME_CHANNEL_NAME, onDomEvent);

  let bc: BroadcastChannel | null = null;
  if ('BroadcastChannel' in window) {
    try {
      bc = new BroadcastChannel(REALTIME_CHANNEL_NAME);
      bc.onmessage = (msg) => {
        const payload = msg.data as RealtimePaymentUpdate | undefined;
        if (payload?.orderCode) handler(payload);
      };
    } catch {
      bc = null;
    }
  }

  return () => {
    window.removeEventListener(REALTIME_CHANNEL_NAME, onDomEvent);
    bc?.close();
  };
}
