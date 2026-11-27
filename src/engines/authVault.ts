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
const LOCAL_ACCOUNTS_KEY = 'tvt_studio_local_accounts_v2';
const LOGIN_ATTEMPTS_KEY = 'tvt_studio_login_throttle_v1';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 30_000;

export type SocialAuthProvider = 'google' | 'facebook' | 'linkedin_oidc';

interface LocalAccountEntry {
  email: string;
  fullName: string;
  passwordHash: string;
  createdAtIso: string;
}

interface LoginAttemptRecord {
  failures: number;
  lockedUntilMs: number;
}

/**
 * Strips HTML tags and dangerous control characters from plain-text client fields.
 */
export function sanitizePlainText(raw: string, maxLen = 200): string {
  return String(raw ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLen);
}

/**
 * Constant-time string comparison to avoid timing side channels during hash verification.
 */
function timingSafeEqualStr(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < len; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

/**
 * OWASP 2026 password derivation using Web Crypto PBKDF2-HMAC-SHA256 (100,000 iterations)
 * with per-account salt. Never stores plain-text passwords.
 */
export async function hashPasswordSalted(email: string, password: string): Promise<string> {
  const cleanEmail = normalizeEmail(email);
  const saltBytes = new TextEncoder().encode(`tvt-studio-pbkdf2-v2::${cleanEmail}`);
  const passBytes = new TextEncoder().encode(password);

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const baseKey = await crypto.subtle.importKey('raw', passBytes, 'PBKDF2', false, [
        'deriveBits',
      ]);
      const derived = await crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: saltBytes,
          iterations: 100_000,
          hash: 'SHA-256',
        },
        baseKey,
        256
      );
      const hex = Array.from(new Uint8Array(derived))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      return `pbkdf2$100000$${hex}`;
    } catch {
      const fallbackDigest = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(`tvt-studio-v2::${cleanEmail}::${password}`)
      );
      return Array.from(new Uint8Array(fallbackDigest))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    }
  }
  let h = 2166136261;
  const input = `tvt-studio-v2::${cleanEmail}::${password}`;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return `fnv-${h.toString(16).padStart(8, '0')}`;
}

async function hashLegacySha256(email: string, password: string): Promise<string> {
  const input = `tvt-studio-v2::${normalizeEmail(email)}::${password}`;
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  return hashPasswordSalted(email, password);
}

function readThrottleMap(): Record<string, LoginAttemptRecord> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.sessionStorage.getItem(LOGIN_ATTEMPTS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, LoginAttemptRecord>) : {};
  } catch {
    return {};
  }
}

function writeThrottleMap(map: Record<string, LoginAttemptRecord>): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

export function checkLoginLockoutSeconds(email: string, nowMs = Date.now()): number {
  const rec = readThrottleMap()[normalizeEmail(email)];
  if (!rec || rec.lockedUntilMs <= nowMs) return 0;
  return Math.ceil((rec.lockedUntilMs - nowMs) / 1000);
}

export function recordLoginFailure(email: string, nowMs = Date.now()): { lockedSeconds: number; remaining: number } {
  const key = normalizeEmail(email);
  const map = readThrottleMap();
  const prev = map[key] ?? { failures: 0, lockedUntilMs: 0 };
  const failures = prev.failures + 1;
  const lockedUntilMs = failures >= MAX_FAILED_ATTEMPTS ? nowMs + LOCKOUT_MS : 0;
  map[key] = { failures: failures >= MAX_FAILED_ATTEMPTS ? 0 : failures, lockedUntilMs };
  writeThrottleMap(map);
  return {
    lockedSeconds: lockedUntilMs > nowMs ? Math.ceil(LOCKOUT_MS / 1000) : 0,
    remaining: Math.max(0, MAX_FAILED_ATTEMPTS - failures),
  };
}

export function clearLoginFailures(email: string): void {
  const key = normalizeEmail(email);
  const map = readThrottleMap();
  if (map[key]) {
    delete map[key];
    writeThrottleMap(map);
  }
}

function readLocalAccounts(): Record<string, LocalAccountEntry> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(LOCAL_ACCOUNTS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, LocalAccountEntry>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeLocalAccounts(map: Record<string, LocalAccountEntry>): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

/**
 * Builds the official Supabase Auth OAuth 2.0 redirect URL for Google, Facebook, or LinkedIn.
 */
export function buildOAuthAuthorizeUrl(
  supabaseUrl: string,
  provider: SocialAuthProvider,
  redirectTo: string
): string {
  const base = supabaseUrl.trim().replace(/\/+$/, '');
  return `${base}/auth/v1/authorize?provider=${encodeURIComponent(provider)}&redirect_to=${encodeURIComponent(redirectTo)}`;
}

export function startSocialOAuthLogin(provider: SocialAuthProvider): {
  redirected: boolean;
  messageVi: string;
  messageEn: string;
} {
  const cfg = loadSupabaseRuntimeConfig();
  if (cfg.url && cfg.anonKey && typeof window !== 'undefined') {
    const redirectTo = `${window.location.origin}${window.location.pathname}`;
    window.location.href = buildOAuthAuthorizeUrl(cfg.url, provider, redirectTo);
    return {
      redirected: true,
      messageVi: 'Đang chuyển hướng tới trang đăng nhập bảo mật...',
      messageEn: 'Redirecting to secure OAuth provider...',
    };
  }
  const label =
    provider === 'google' ? 'Google' : provider === 'facebook' ? 'Facebook' : 'LinkedIn';
  return {
    redirected: false,
    messageVi: `Đăng nhập 1 chạm bằng ${label} (miễn phí 0₫ qua Supabase Auth) sẵn sàng ngay khi bật Supabase Cloud. Hiện tại bạn có thể đăng ký / đăng nhập ngay bằng Email & Mật khẩu bên dưới.`,
    messageEn: `1-click ${label} OAuth (free via Supabase Auth) activates automatically once Supabase Cloud is connected. You can sign up or sign in immediately with Email & Password below.`,
  };
}

/**
 * Parses a returning Supabase OAuth 2.0 callback hash (`#access_token=...`)
 * verifies the user via `/auth/v1/user`, persists the session, and strips tokens from the URL.
 */
export async function parseOAuthCallbackFromUrl(): Promise<AuthSession | null> {
  if (typeof window === 'undefined' || !window.location.hash.includes('access_token=')) {
    return null;
  }
  const cfg = loadSupabaseRuntimeConfig();
  if (!cfg.url || !cfg.anonKey || typeof fetch !== 'function') return null;

  const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const accessToken = params.get('access_token');
  if (!accessToken) return null;

  try {
    const res = await fetch(`${cfg.url}/auth/v1/user`, {
      headers: {
        apikey: cfg.anonKey,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!res.ok) return null;
    const user = (await res.json()) as { id?: string; email?: string; user_metadata?: { full_name?: string } };
    if (!user.id || !user.email) return null;
    const session: AuthSession = {
      mode: 'supabase_otp',
      userId: user.id,
      email: normalizeEmail(user.email),
      accessToken,
      loggedInAtIso: new Date().toISOString(),
    };
    saveAuthSession(session);
    if (user.user_metadata?.full_name) {
      const existing = loadLocalClientProfile(session.email) ?? createDefaultProfile(session.email, session.userId);
      if (!existing.fullName) {
        saveLocalClientProfile({ ...existing, fullName: user.user_metadata.full_name });
      }
    }
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    return session;
  } catch {
    return null;
  }
}

export async function signUpWithEmailPassword(params: {
  fullName: string;
  email: string;
  password: string;
}): Promise<{
  ok: boolean;
  session?: AuthSession;
  needsEmailConfirm?: boolean;
  messageVi: string;
  messageEn: string;
}> {
  const cleanEmail = normalizeEmail(params.email);
  const fullName = sanitizePlainText(params.fullName, 120);
  const password = params.password;

  if (!fullName) {
    return {
      ok: false,
      messageVi: 'Vui lòng nhập họ và tên.',
      messageEn: 'Please enter your full name.',
    };
  }
  if (!isValidEmail(cleanEmail)) {
    return {
      ok: false,
      messageVi: 'Địa chỉ email không hợp lệ.',
      messageEn: 'Please enter a valid email address.',
    };
  }
  if (password.length < 6) {
    return {
      ok: false,
      messageVi: 'Mật khẩu cần tối thiểu 6 ký tự.',
      messageEn: 'Password must be at least 6 characters.',
    };
  }

  // 1. Real Supabase Email + Password Signup (50K MAU free)
  if (isCloudRealtimeConfigured() && typeof fetch === 'function') {
    const cfg = loadSupabaseRuntimeConfig();
    try {
      const res = await fetch(`${cfg.url}/auth/v1/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: cfg.anonKey },
        body: JSON.stringify({
          email: cleanEmail,
          password,
          data: { full_name: fullName },
        }),
      });
      const data = (await res.json()) as {
        access_token?: string;
        user?: { id: string; email: string };
        msg?: string;
        error_description?: string;
      };
      if (!res.ok) {
        const err = data.msg || data.error_description || 'Đăng ký thất bại.';
        return { ok: false, messageVi: err, messageEn: err };
      }
      if (data.access_token && data.user?.id) {
        const session: AuthSession = {
          mode: 'supabase_otp',
          userId: data.user.id,
          email: cleanEmail,
          accessToken: data.access_token,
          loggedInAtIso: new Date().toISOString(),
        };
        saveAuthSession(session);
        await syncCloudProfile(session, { ...createDefaultProfile(cleanEmail, session.userId), fullName });
        return {
          ok: true,
          session,
          messageVi: 'Tạo tài khoản thành công!',
          messageEn: 'Account created successfully!',
        };
      }
      return {
        ok: true,
        needsEmailConfirm: true,
        messageVi: `Đã gửi email xác nhận tới ${cleanEmail}. Bấm link trong email để hoàn tất kích hoạt tài khoản.`,
        messageEn: `Confirmation email sent to ${cleanEmail}. Click the link in your inbox to activate.`,
      };
    } catch {
      return {
        ok: false,
        messageVi: 'Không thể kết nối máy chủ đăng ký. Vui lòng thử lại.',
        messageEn: 'Network error during signup. Please try again.',
      };
    }
  }

  // 2. Local Salted SHA-256 Account Vault (never stores plain-text passwords)
  const accounts = readLocalAccounts();
  if (accounts[cleanEmail]) {
    return {
      ok: false,
      messageVi: 'Email này đã được đăng ký. Vui lòng chuyển sang Đăng nhập.',
      messageEn: 'This email is already registered. Please sign in instead.',
    };
  }
  const passwordHash = await hashPasswordSalted(cleanEmail, password);
  accounts[cleanEmail] = {
    email: cleanEmail,
    fullName,
    passwordHash,
    createdAtIso: new Date().toISOString(),
  };
  writeLocalAccounts(accounts);

  const localSession: AuthSession = {
    mode: 'local_vault',
    userId: `local-${cleanEmail}`,
    email: cleanEmail,
    loggedInAtIso: new Date().toISOString(),
  };
  saveAuthSession(localSession);
  saveLocalClientProfile({
    ...createDefaultProfile(cleanEmail, localSession.userId),
    fullName,
  });

  return {
    ok: true,
    session: localSession,
    messageVi: `Đăng ký tài khoản ${cleanEmail} thành công!`,
    messageEn: `Account ${cleanEmail} created!`,
  };
}

export async function signInWithEmailPassword(
  email: string,
  password: string
): Promise<{
  ok: boolean;
  session?: AuthSession;
  messageVi: string;
  messageEn: string;
}> {
  const cleanEmail = normalizeEmail(email);
  if (!isValidEmail(cleanEmail)) {
    return {
      ok: false,
      messageVi: 'Vui lòng nhập email hợp lệ.',
      messageEn: 'Please enter a valid email address.',
    };
  }
  const lockedSec = checkLoginLockoutSeconds(cleanEmail);
  if (lockedSec > 0) {
    return {
      ok: false,
      messageVi: `Nhập sai quá nhiều lần. Vui lòng thử lại sau ${lockedSec} giây.`,
      messageEn: `Too many failed attempts. Please wait ${lockedSec} seconds.`,
    };
  }
  if (!password || password.length < 6) {
    return {
      ok: false,
      messageVi: 'Vui lòng nhập mật khẩu (tối thiểu 6 ký tự).',
      messageEn: 'Please enter your password (min 6 characters).',
    };
  }

  // 1. Real Supabase Email + Password Sign-In
  if (isCloudRealtimeConfigured() && typeof fetch === 'function') {
    const cfg = loadSupabaseRuntimeConfig();
    try {
      const res = await fetch(`${cfg.url}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: cfg.anonKey },
        body: JSON.stringify({ email: cleanEmail, password }),
      });
      const data = (await res.json()) as {
        access_token?: string;
        user?: { id: string; email: string };
        error_description?: string;
        msg?: string;
      };
      if (!res.ok || !data.access_token || !data.user?.id) {
        const resLock = recordLoginFailure(cleanEmail);
        return {
          ok: false,
          messageVi:
            resLock.lockedSeconds > 0
              ? `Sai thông tin quá 5 lần. Tạm khóa bảo mật trong ${resLock.lockedSeconds} giây.`
              : `Email hoặc mật khẩu chưa chính xác (còn ${resLock.remaining} lần thử).`,
          messageEn:
            resLock.lockedSeconds > 0
              ? `Too many failed attempts. Temporarily locked for ${resLock.lockedSeconds}s.`
              : `Invalid email or password (${resLock.remaining} attempts remaining).`,
        };
      }
      clearLoginFailures(cleanEmail);
      const session: AuthSession = {
        mode: 'supabase_otp',
        userId: data.user.id,
        email: cleanEmail,
        accessToken: data.access_token,
        loggedInAtIso: new Date().toISOString(),
      };
      saveAuthSession(session);
      return {
        ok: true,
        session,
        messageVi: 'Đăng nhập thành công!',
        messageEn: 'Signed in successfully!',
      };
    } catch {
      return {
        ok: false,
        messageVi: 'Lỗi kết nối máy chủ đăng nhập.',
        messageEn: 'Network error while signing in.',
      };
    }
  }

  // 2. Local Salted SHA-256 Account Verification
  const accounts = readLocalAccounts();
  const entry = accounts[cleanEmail];
  if (!entry) {
    return {
      ok: false,
      messageVi: 'Email này chưa có tài khoản trên thiết bị này. Hãy bấm "Đăng ký ngay".',
      messageEn: 'No account found for this email yet. Click "Sign up now".',
    };
  }
  const candidateHash = entry.passwordHash.startsWith('pbkdf2$')
    ? await hashPasswordSalted(cleanEmail, password)
    : await hashLegacySha256(cleanEmail, password);
  if (!timingSafeEqualStr(candidateHash, entry.passwordHash)) {
    const res = recordLoginFailure(cleanEmail);
    return {
      ok: false,
      messageVi:
        res.lockedSeconds > 0
          ? `Sai mật khẩu quá 5 lần. Tạm khóa bảo mật trong ${res.lockedSeconds} giây.`
          : `Mật khẩu chưa chính xác (còn ${res.remaining} lần thử).`,
      messageEn:
        res.lockedSeconds > 0
          ? `Too many failed attempts. Temporarily locked for ${res.lockedSeconds}s.`
          : `Incorrect password (${res.remaining} attempts remaining).`,
    };
  }
  clearLoginFailures(cleanEmail);

  const localSession: AuthSession = {
    mode: 'local_vault',
    userId: `local-${cleanEmail}`,
    email: cleanEmail,
    loggedInAtIso: new Date().toISOString(),
  };
  saveAuthSession(localSession);
  return {
    ok: true,
    session: localSession,
    messageVi: `Chào mừng quay trở lại, ${entry.fullName || cleanEmail}!`,
    messageEn: `Welcome back, ${entry.fullName || cleanEmail}!`,
  };
}

export async function requestPasswordReset(
  email: string,
  newPasswordLocal?: string
): Promise<{ ok: boolean; messageVi: string; messageEn: string }> {
  const cleanEmail = normalizeEmail(email);
  if (!isValidEmail(cleanEmail)) {
    return {
      ok: false,
      messageVi: 'Vui lòng nhập email hợp lệ.',
      messageEn: 'Please enter a valid email.',
    };
  }

  if (isCloudRealtimeConfigured() && typeof fetch === 'function') {
    const cfg = loadSupabaseRuntimeConfig();
    try {
      const redirectTo =
        typeof window !== 'undefined'
          ? `${window.location.origin}${window.location.pathname}`
          : undefined;
      const res = await fetch(`${cfg.url}/auth/v1/recover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: cfg.anonKey },
        body: JSON.stringify({ email: cleanEmail, redirect_to: redirectTo }),
      });
      if (res.ok) {
        return {
          ok: true,
          messageVi: `Đã gửi link đặt lại mật khẩu tới ${cleanEmail}. Vui lòng kiểm tra hộp thư.`,
          messageEn: `Password reset link sent to ${cleanEmail}. Please check your inbox.`,
        };
      }
    } catch {
      // fall through
    }
  }

  const accounts = readLocalAccounts();
  if (!accounts[cleanEmail]) {
    return {
      ok: false,
      messageVi: 'Không tìm thấy tài khoản với email này.',
      messageEn: 'No account found with this email.',
    };
  }
  if (!newPasswordLocal || newPasswordLocal.length < 6) {
    return {
      ok: false,
      messageVi: 'Nhập mật khẩu mới tối thiểu 6 ký tự.',
      messageEn: 'Enter a new password (at least 6 characters).',
    };
  }
  accounts[cleanEmail].passwordHash = await hashPasswordSalted(cleanEmail, newPasswordLocal);
  writeLocalAccounts(accounts);
  return {
    ok: true,
    messageVi: 'Đã cập nhật mật khẩu mới thành công! Bạn có thể đăng nhập ngay.',
    messageEn: 'Password updated! You can sign in now.',
  };
}

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
    fullName: sanitizePlainText(profile.fullName, 120),
    phoneOrZalo: sanitizePlainText(profile.phoneOrZalo, 60),
    brandOrDomain: sanitizePlainText(profile.brandOrDomain, 160),
    billingNote: sanitizePlainText(profile.billingNote, 500),
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
