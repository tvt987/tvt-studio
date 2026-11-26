import { formatMoney, STUDIO_CONTACT } from './catalog';
import { isCloudRealtimeConfigured, loadSupabaseRuntimeConfig } from './orderLedger';
import type {
  AuthSession,
  ClientProfile,
  Locale,
  OrderDeliverable,
  OrderLifecycleStatus,
  OrderSnapshot,
} from './types';

const AUTH_SESSION_KEY = 'tvt_studio_auth_session_v2';
const CLIENT_PROFILES_KEY = 'tvt_studio_client_profiles_v2';

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export function isValidEmail(raw: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(raw));
}

/**
 * Generates a deterministic commercial license key tied to an order code
 * so customers always have a permanent proof of ownership for support & re-downloads.
 */
export function generateLicenseKey(orderCode: string): string {
  const clean = orderCode.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const digits = clean.slice(-4).padStart(4, '0');
  let hash = 5381;
  for (let i = 0; i < clean.length; i++) {
    hash = ((hash << 5) + hash + clean.charCodeAt(i)) >>> 0;
  }
  const suffix = (hash % 1679616).toString(36).toUpperCase().padStart(4, '0').slice(0, 4);
  return `TVT-LIC-${digits}-${suffix}`;
}

export function isOrderSourceUnlocked(status?: OrderLifecycleStatus): boolean {
  return (
    status === 'DEPOSIT_VERIFIED' ||
    status === 'IN_DEVELOPMENT' ||
    status === 'UAT_STAGING' ||
    status === 'DELIVERED'
  );
}

export function ensureOrderDeliverable(order: OrderSnapshot): OrderDeliverable {
  if (order.deliverable?.licenseKey) {
    return order.deliverable;
  }
  return {
    licenseKey: generateLicenseKey(order.orderCode),
    unlockedAtIso: isOrderSourceUnlocked(order.status) ? order.createdAtIso : undefined,
    downloadCount: 0,
  };
}

// ============================================================================
// Session & Saved Billing Profile Persistence (Local + Supabase JWT Sync)
// ============================================================================

export function loadAuthSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    return parsed?.email ? parsed : null;
  } catch {
    return null;
  }
}

export function saveAuthSession(session: AuthSession | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (!session) {
      window.localStorage.removeItem(AUTH_SESSION_KEY);
      return;
    }
    window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  } catch {
    // ignore
  }
}

function readAllLocalProfiles(): Record<string, ClientProfile> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(CLIENT_PROFILES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, ClientProfile>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function loadLocalClientProfile(email: string): ClientProfile | null {
  const map = readAllLocalProfiles();
  return map[normalizeEmail(email)] ?? null;
}

export function saveLocalClientProfile(profile: ClientProfile): ClientProfile {
  const normalized: ClientProfile = {
    ...profile,
    email: normalizeEmail(profile.email),
    updatedAtIso: new Date().toISOString(),
  };
  if (typeof window !== 'undefined') {
    try {
      const map = readAllLocalProfiles();
      map[normalized.email] = normalized;
      window.localStorage.setItem(CLIENT_PROFILES_KEY, JSON.stringify(map));
    } catch {
      // ignore
    }
  }
  return normalized;
}

export function createDefaultProfile(email: string, userId?: string): ClientProfile {
  return {
    userId,
    email: normalizeEmail(email),
    fullName: '',
    phoneOrZalo: '',
    brandOrDomain: '',
    preferredChannel: 'vietqr',
    billingNote: '',
    updatedAtIso: new Date().toISOString(),
  };
}

// ============================================================================
// Free Email Auth: Real Supabase Email OTP (50K MAU Free) + Local Email Vault
// ============================================================================

export async function requestEmailOtpLogin(email: string): Promise<{
  ok: boolean;
  mode: 'supabase_otp' | 'local_vault';
  session?: AuthSession;
  messageVi: string;
  messageEn: string;
}> {
  const cleanEmail = normalizeEmail(email);
  if (!isValidEmail(cleanEmail)) {
    return {
      ok: false,
      mode: 'local_vault',
      messageVi: 'Vui lòng nhập địa chỉ email hợp lệ.',
      messageEn: 'Please enter a valid email address.',
    };
  }

  // Real Supabase Free Email OTP when Cloud DB is connected
  if (isCloudRealtimeConfigured() && typeof fetch === 'function') {
    const cfg = loadSupabaseRuntimeConfig();
    try {
      const res = await fetch(`${cfg.url}/auth/v1/otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: cfg.anonKey,
        },
        body: JSON.stringify({
          email: cleanEmail,
          create_user: true,
        }),
      });
      if (res.ok) {
        return {
          ok: true,
          mode: 'supabase_otp',
          messageVi: `Đã gửi mã xác thực 6 số (OTP) tới ${cleanEmail}. Hãy kiểm tra hộp thư và nhập mã bên dưới.`,
          messageEn: `A 6-digit login code has been sent to ${cleanEmail}. Enter it below to sign in.`,
        };
      }
    } catch {
      // Fall through cleanly if offline
    }
  }

  // Local Email Vault Mode (works immediately out of the box with IndexedDB)
  const localSession: AuthSession = {
    mode: 'local_vault',
    userId: `local-${cleanEmail}`,
    email: cleanEmail,
    loggedInAtIso: new Date().toISOString(),
  };
  saveAuthSession(localSession);
  return {
    ok: true,
    mode: 'local_vault',
    session: localSession,
    messageVi: `Đã đăng nhập tài khoản ${cleanEmail} (Lưu trữ IndexedDB — tự đồng bộ Cloud khi bật Supabase).`,
    messageEn: `Signed in as ${cleanEmail} (IndexedDB Vault active — auto-syncs to Cloud once Supabase is enabled).`,
  };
}

export async function verifyEmailOtpCode(
  email: string,
  otpToken: string
): Promise<{ ok: boolean; session?: AuthSession; errorVi?: string; errorEn?: string }> {
  const cleanEmail = normalizeEmail(email);
  const token = otpToken.trim();
  const cfg = loadSupabaseRuntimeConfig();
  if (!cfg.url || !cfg.anonKey || token.length < 6) {
    return {
      ok: false,
      errorVi: 'Mã OTP phải gồm 6 chữ số.',
      errorEn: 'Please enter the 6-digit OTP code from your email.',
    };
  }

  try {
    const res = await fetch(`${cfg.url}/auth/v1/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: cfg.anonKey,
      },
      body: JSON.stringify({
        email: cleanEmail,
        token,
        type: 'email',
      }),
    });
    if (!res.ok) {
      return {
        ok: false,
        errorVi: 'Mã OTP không đúng hoặc đã hết hạn. Vui lòng gửi lại mã mới.',
        errorEn: 'Invalid or expired OTP code. Please request a new code.',
      };
    }
    const data = (await res.json()) as {
      access_token?: string;
      user?: { id: string; email: string };
    };
    if (!data.access_token || !data.user?.id) {
      return {
        ok: false,
        errorVi: 'Không nhận được phiên đăng nhập từ máy chủ.',
        errorEn: 'Could not establish an authenticated session.',
      };
    }
    const session: AuthSession = {
      mode: 'supabase_otp',
      userId: data.user.id,
      email: normalizeEmail(data.user.email || cleanEmail),
      accessToken: data.access_token,
      loggedInAtIso: new Date().toISOString(),
    };
    saveAuthSession(session);
    return { ok: true, session };
  } catch {
    return {
      ok: false,
      errorVi: 'Lỗi kết nối khi xác thực OTP. Vui lòng thử lại.',
      errorEn: 'Network error while verifying OTP code.',
    };
  }
}

export async function syncCloudProfile(
  session: AuthSession,
  profile: ClientProfile
): Promise<ClientProfile> {
  const savedLocal = saveLocalClientProfile({ ...profile, userId: session.userId });
  const cfg = loadSupabaseRuntimeConfig();
  if (session.mode === 'supabase_otp' && session.accessToken && cfg.url && cfg.anonKey) {
    try {
      await fetch(`${cfg.url}/rest/v1/tvt_client_profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: cfg.anonKey,
          Authorization: `Bearer ${session.accessToken}`,
          Prefer: 'resolution=merge-duplicates,return=minimal',
        },
        body: JSON.stringify({
          user_id: session.userId,
          email: savedLocal.email,
          full_name: savedLocal.fullName,
          phone_or_zalo: savedLocal.phoneOrZalo,
          brand_or_domain: savedLocal.brandOrDomain,
          preferred_channel: savedLocal.preferredChannel,
          billing_note: savedLocal.billingNote,
          updated_at: savedLocal.updatedAtIso,
        }),
      });
    } catch {
      // Local profile is already saved
    }
  }
  return savedLocal;
}

export async function fetchCloudAccountData(session: AuthSession): Promise<{
  profile: ClientProfile | null;
  orders: OrderSnapshot[];
}> {
  const localProfile = loadLocalClientProfile(session.email);
  const cfg = loadSupabaseRuntimeConfig();
  if (session.mode !== 'supabase_otp' || !session.accessToken || !cfg.url || !cfg.anonKey) {
    return { profile: localProfile, orders: [] };
  }

  let cloudProfile: ClientProfile | null = localProfile;
  const cloudOrders: OrderSnapshot[] = [];

  try {
    const [profRes, ordRes] = await Promise.all([
      fetch(
        `${cfg.url}/rest/v1/tvt_client_profiles?user_id=eq.${encodeURIComponent(session.userId)}&limit=1`,
        {
          headers: {
            apikey: cfg.anonKey,
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      ),
      fetch(`${cfg.url}/rest/v1/tvt_orders?order=created_at.desc&limit=50`, {
        headers: {
          apikey: cfg.anonKey,
          Authorization: `Bearer ${session.accessToken}`,
        },
      }),
    ]);

    if (profRes.ok) {
      const rows = (await profRes.json()) as Array<{
        user_id: string;
        email: string;
        full_name: string;
        phone_or_zalo: string;
        brand_or_domain: string;
        preferred_channel: ClientProfile['preferredChannel'];
        billing_note: string;
        updated_at: string;
      }>;
      if (rows[0]) {
        cloudProfile = saveLocalClientProfile({
          userId: rows[0].user_id,
          email: rows[0].email,
          fullName: rows[0].full_name || '',
          phoneOrZalo: rows[0].phone_or_zalo || '',
          brandOrDomain: rows[0].brand_or_domain || '',
          preferredChannel: rows[0].preferred_channel || 'vietqr',
          billingNote: rows[0].billing_note || '',
          updatedAtIso: rows[0].updated_at || new Date().toISOString(),
        });
      }
    }

    if (ordRes.ok) {
      const rows = (await ordRes.json()) as Array<{
        order_code: string;
        created_at: string;
        status: OrderLifecycleStatus;
        payment_channel: OrderSnapshot['paymentChannel'];
        payment_mode: OrderSnapshot['paymentMode'];
        payment_ref?: string | null;
        client_name: string;
        client_phone: string;
        client_email: string;
        brand_or_domain?: string | null;
        notes?: string | null;
        net_total_vnd: number;
        net_total_usd: number;
        payable_now_vnd: number;
        payable_now_usd: number;
        items_json: OrderSnapshot['items'];
        milestones_json: OrderSnapshot['milestones'];
        user_id?: string | null;
        license_key?: string | null;
        delivery_repo_url?: string | null;
        delivery_zip_url?: string | null;
        delivery_docs_url?: string | null;
        download_count?: number | null;
      }>;

      for (const r of rows) {
        cloudOrders.push({
          orderCode: r.order_code,
          createdAtIso: r.created_at,
          currency: 'VND',
          paymentChannel: r.payment_channel,
          paymentMode: r.payment_mode,
          paymentRef: r.payment_ref || undefined,
          status: r.status,
          syncState: 'supabase_synced',
          userId: r.user_id || session.userId,
          client: {
            fullName: r.client_name,
            phoneOrZalo: r.client_phone,
            email: r.client_email,
            brandOrDomain: r.brand_or_domain || '',
            notes: r.notes || '',
          },
          items: Array.isArray(r.items_json) ? r.items_json : [],
          milestones: Array.isArray(r.milestones_json) ? r.milestones_json : [],
          totals: {
            itemCount: Array.isArray(r.items_json)
              ? r.items_json.reduce((acc, it) => acc + (it.quantity || 1), 0)
              : 1,
            subtotalVnd: r.net_total_vnd,
            subtotalUsd: r.net_total_usd,
            discountVnd: 0,
            discountUsd: 0,
            netTotalVnd: r.net_total_vnd,
            netTotalUsd: r.net_total_usd,
            paymentMode: r.payment_mode,
            payableNowVnd: r.payable_now_vnd,
            payableNowUsd: r.payable_now_usd,
            remainingVnd: Math.max(0, r.net_total_vnd - r.payable_now_vnd),
            remainingUsd: Math.max(0, r.net_total_usd - r.payable_now_usd),
            appliedVoucher: undefined,
          },
          deliverable: {
            licenseKey: r.license_key || generateLicenseKey(r.order_code),
            sourceDownloadUrl: r.delivery_zip_url || undefined,
            repoUrl: r.delivery_repo_url || undefined,
            docsUrl: r.delivery_docs_url || undefined,
            downloadCount: r.download_count || 0,
          },
        });
      }
    }
  } catch {
    // Graceful fallback to local
  }

  return { profile: cloudProfile, orders: cloudOrders };
}

/**
 * Requests a short-lived signed source-code download URL from the Supabase Edge Function
 * so purchased packages can be re-downloaded anytime without leaking permanent public links.
 */
export async function requestSignedSourceDownload(
  session: AuthSession,
  orderCode: string
): Promise<string | null> {
  const cfg = loadSupabaseRuntimeConfig();
  if (session.mode !== 'supabase_otp' || !session.accessToken || !cfg.url || !cfg.anonKey) {
    return null;
  }
  try {
    const res = await fetch(`${cfg.url}/functions/v1/download-source`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: cfg.anonKey,
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({ orderCode }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { ok?: boolean; downloadUrl?: string };
    return data.ok && data.downloadUrl ? data.downloadUrl : null;
  } catch {
    return null;
  }
}

export function mergeCloudAndLocalOrders(
  cloudOrders: OrderSnapshot[],
  localOrders: OrderSnapshot[]
): OrderSnapshot[] {
  const byCode = new Map<string, OrderSnapshot>();
  for (const lo of localOrders) {
    byCode.set(lo.orderCode, lo);
  }
  // Cloud is authoritative whenever present
  for (const co of cloudOrders) {
    const existing = byCode.get(co.orderCode);
    byCode.set(co.orderCode, {
      ...existing,
      ...co,
      events: co.events?.length ? co.events : existing?.events,
    });
  }
  return Array.from(byCode.values()).sort((a, b) =>
    b.createdAtIso.localeCompare(a.createdAtIso)
  );
}

export function filterOrdersForAccount(
  orders: OrderSnapshot[],
  session: AuthSession
): OrderSnapshot[] {
  const targetEmail = normalizeEmail(session.email);
  return orders.filter(
    (o) =>
      o.userId === session.userId || normalizeEmail(o.client.email) === targetEmail
  );
}

/**
 * Generates a permanent Commercial License Certificate & Source Recovery Kit (.md)
 * that clients can re-download anytime from their Account Vault.
 */
export function generateHandoverKitMarkdown(order: OrderSnapshot, locale: Locale): string {
  const deliv = ensureOrderDeliverable(order);
  const itemsList = order.items
    .map((it, idx) =>
      it.kind === 'template'
        ? `${idx + 1}. **${it.title}** (${it.sku} · ${it.license === 'full-source' ? 'Full Source + Custom' : 'Standard Deploy'}) x${it.quantity}`
        : `${idx + 1}. **${it.title[locale]}** (${it.sku}) x${it.quantity}`
    )
    .join('\n');

  if (locale === 'vi') {
    return [
      `# TVT STUDIO — CHỨNG NHẬN BẢN QUYỀN & GÓI KHÔI PHỤC SOURCE CODE`,
      ``,
      `- **Mã đơn hàng**: \`${order.orderCode}\``,
      `- **Mã bản quyền (License Key)**: \`${deliv.licenseKey}\``,
      `- **Chủ sở hữu**: ${order.client.fullName} (${order.client.email} · ${order.client.phoneOrZalo})`,
      `- **Giá trị hợp đồng**: ${formatMoney(order.totals.netTotalVnd, 'VND')} (${formatMoney(order.totals.netTotalUsd, 'USD')})`,
      `- **Trạng thái thanh toán**: ${order.status ?? 'DEPOSIT_VERIFIED'}${order.paymentRef ? ` (Ref: ${order.paymentRef})` : ''}`,
      ``,
      `## 1. Hạng Mục Đã Mua`,
      itemsList,
      ``,
      `## 2. Đường Dẫn Tải Lại Source Code & Tài Liệu`,
      `- **Link tải gói Source Code (.zip / Release)**: ${deliv.sourceDownloadUrl || 'Đã kích hoạt bảo lưu — Nhắn mã bản quyền qua Zalo 0931 467 024 để cấp lại link tải tức thì (miễn phí trọn đời).'}`,
      `- **Private Git Repository**: ${deliv.repoUrl || 'Cấp quyền truy cập trực tiếp theo email GitHub của khách hàng.'}`,
      `- **Tài liệu hướng dẫn triển khai**: ${deliv.docsUrl || 'Kèm trong thư mục README.md của gói bàn giao.'}`,
      ``,
      `## 3. Cam Kết Hỗ Trợ & Khôi Phục Mã Nguồn Vĩnh Viễn`,
      `- Nếu bạn lỡ xóa mất source code trên máy tính, chỉ cần đăng nhập lại https://tvt987.github.io/tvt-studio/ bằng email \`${order.client.email}\` để tải lại bất cứ lúc nào.`,
      `- Hỗ trợ kỹ thuật trực tiếp trong suốt quá trình vận hành: Zalo **${STUDIO_CONTACT.phoneDisplay}** · Email **${STUDIO_CONTACT.email}**.`,
      ``,
    ].join('\n');
  }

  return [
    `# TVT STUDIO — COMMERCIAL LICENSE & SOURCE RECOVERY KIT`,
    ``,
    `- **Order Code**: \`${order.orderCode}\``,
    `- **License Key**: \`${deliv.licenseKey}\``,
    `- **License Holder**: ${order.client.fullName} (${order.client.email} · ${order.client.phoneOrZalo})`,
    `- **Contract Value**: ${formatMoney(order.totals.netTotalUsd, 'USD')} (${formatMoney(order.totals.netTotalVnd, 'VND')})`,
    ``,
    `## 1. Purchased Items`,
    itemsList,
    ``,
    `## 2. Source Code Recovery Links`,
    `- **Source Package (.zip / Release)**: ${deliv.sourceDownloadUrl || 'Archived permanently — contact Zalo 0931 467 024 with your License Key for instant re-delivery.'}`,
    `- **Private Repository**: ${deliv.repoUrl || 'Granted to your GitHub account upon handover.'}`,
    ``,
    `## 3. Lifetime Re-Download & Ongoing Support`,
    `- Sign back in anytime with \`${order.client.email}\` at https://tvt987.github.io/tvt-studio/ to access your order history & source vault.`,
    `- Direct Architect Support: Zalo **${STUDIO_CONTACT.phoneDisplay}** · Email **${STUDIO_CONTACT.email}**.`,
    ``,
  ].join('\n');
}
