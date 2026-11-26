import React, { useEffect, useMemo, useState } from 'react';
import {
  createDefaultProfile,
  ensureOrderDeliverable,
  filterOrdersForAccount,
  generateHandoverKitMarkdown,
  isOrderSourceUnlocked,
  requestPasswordReset,
  requestSignedSourceDownload,
  signInWithEmailPassword,
  signUpWithEmailPassword,
  startSocialOAuthLogin,
  syncCloudProfile,
  type SocialAuthProvider,
} from '../engines/authVault';
import { formatMoney, STUDIO_CONTACT } from '../engines/catalog';
import { isCloudRealtimeConfigured, ORDER_STATUS_META } from '../engines/orderLedger';
import type {
  AuthSession,
  ClientProfile,
  Currency,
  Locale,
  OrderSnapshot,
  PaymentChannel,
} from '../engines/types';
import { copyToClipboard, downloadTextFile } from '../utils/download';
import {
  IconArrowRight,
  IconCheck,
  IconClose,
  IconCode,
  IconCopy,
  IconDownload,
  IconExternal,
  IconEye,
  IconEyeOff,
  IconFacebook,
  IconGoogle,
  IconLinkedIn,
  IconLock,
  IconPhone,
} from './Icons';

interface AccountPortalModalProps {
  isOpen: boolean;
  locale: Locale;
  currency: Currency;
  session: AuthSession | null;
  profile: ClientProfile | null;
  orders: OrderSnapshot[];
  onClose: () => void;
  onAuthenticated: (session: AuthSession) => void;
  onLogout: () => void;
  onProfileSaved: (profile: ClientProfile) => void;
  onOpenOrderTracker: (orderCode: string) => void;
}

export const AccountPortalModal: React.FC<AccountPortalModalProps> = ({
  isOpen,
  locale,
  currency,
  session,
  profile,
  orders,
  onClose,
  onAuthenticated,
  onLogout,
  onProfileSaved,
  onOpenOrderTracker,
}) => {
  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot'>('login');
  const [fullNameInput, setFullNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [tab, setTab] = useState<'vault' | 'history' | 'profile'>('vault');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [downloadingCode, setDownloadingCode] = useState<string | null>(null);

  const [draftProfile, setDraftProfile] = useState<ClientProfile>(() =>
    profile ?? createDefaultProfile(session?.email ?? '')
  );
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (session) {
      setDraftProfile(profile ?? createDefaultProfile(session.email, session.userId));
      setAuthView('login');
      setAuthError(null);
      setAuthNotice(null);
    }
  }, [profile, session]);

  const accountOrders = useMemo(() => {
    if (!session) return [];
    return filterOrdersForAccount(orders, session);
  }, [orders, session]);

  const unlockedCount = useMemo(
    () => accountOrders.filter((o) => isOrderSourceUnlocked(o.status)).length,
    [accountOrders]
  );

  if (!isOpen) return null;

  const cloudAuthActive = isCloudRealtimeConfigured();

  const switchAuthView = (next: 'login' | 'register' | 'forgot') => {
    setAuthView(next);
    setAuthError(null);
    setAuthNotice(null);
    setPasswordInput('');
    setConfirmPasswordInput('');
  };

  const handleSocialClick = (provider: SocialAuthProvider) => {
    setAuthError(null);
    const res = startSocialOAuthLogin(provider);
    if (!res.redirected) {
      setAuthNotice(locale === 'vi' ? res.messageVi : res.messageEn);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthNotice(null);
    setBusy(true);
    const res = await signInWithEmailPassword(emailInput, passwordInput);
    setBusy(false);
    if (!res.ok || !res.session) {
      setAuthError(locale === 'vi' ? res.messageVi : res.messageEn);
      return;
    }
    onAuthenticated(res.session);
    setPasswordInput('');
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthNotice(null);
    if (passwordInput !== confirmPasswordInput) {
      setAuthError(
        locale === 'vi' ? 'Mật khẩu nhập lại chưa khớp.' : 'Passwords do not match.'
      );
      return;
    }
    setBusy(true);
    const res = await signUpWithEmailPassword({
      fullName: fullNameInput,
      email: emailInput,
      password: passwordInput,
    });
    setBusy(false);
    if (!res.ok) {
      setAuthError(locale === 'vi' ? res.messageVi : res.messageEn);
      return;
    }
    if (res.session) {
      onAuthenticated(res.session);
      setPasswordInput('');
      setConfirmPasswordInput('');
    } else if (res.needsEmailConfirm) {
      setAuthNotice(locale === 'vi' ? res.messageVi : res.messageEn);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthNotice(null);
    setBusy(true);
    const res = await requestPasswordReset(emailInput, cloudAuthActive ? undefined : passwordInput);
    setBusy(false);
    if (!res.ok) {
      setAuthError(locale === 'vi' ? res.messageVi : res.messageEn);
      return;
    }
    setAuthNotice(locale === 'vi' ? res.messageVi : res.messageEn);
    if (!cloudAuthActive) {
      setAuthView('login');
      setPasswordInput('');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setBusy(true);
    const saved = await syncCloudProfile(session, draftProfile);
    setBusy(false);
    onProfileSaved(saved);
    setProfileSavedToast(true);
    window.setTimeout(() => setProfileSavedToast(false), 2400);
  };

  const handleCopyLicense = async (key: string) => {
    await copyToClipboard(key);
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey((c) => (c === key ? null : c)), 1500);
  };

  const handleRedownloadSource = async (order: OrderSnapshot) => {
    if (!session) return;
    setDownloadingCode(order.orderCode);
    const deliv = ensureOrderDeliverable(order);

    const signedUrl = await requestSignedSourceDownload(session, order.orderCode);
    if (signedUrl) {
      window.open(signedUrl, '_blank', 'noopener,noreferrer');
      setDownloadingCode(null);
      return;
    }

    if (deliv.sourceDownloadUrl && /^https?:\/\//i.test(deliv.sourceDownloadUrl)) {
      window.open(deliv.sourceDownloadUrl, '_blank', 'noopener,noreferrer');
      setDownloadingCode(null);
      return;
    }

    const kit = generateHandoverKitMarkdown(order, locale);
    downloadTextFile(`${order.orderCode}-TVT-License-Source-Recovery.md`, kit);
    setDownloadingCode(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="TVT Studio Client Account Portal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* LOGGED-OUT VIEW: Clean Modern Social + Email/Password Card */}
      {!session ? (
        <div
          className="relative max-h-[94vh] w-full max-w-[500px] overflow-y-auto rounded-3xl border p-6 sm:p-8"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-strong)',
            boxShadow: 'var(--shadow-modal)',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full"
            aria-label="Close account portal"
          >
            <IconClose className="h-4 w-4" />
          </button>

          {/* Centered Brand Mark + Title */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2.5">
              <img
                src="./media/studio-emblem.webp"
                alt="TVT Studio"
                className="h-9 w-9 rounded-xl border object-cover"
                style={{ borderColor: 'var(--border-strong)' }}
              />
              <span className="font-brand text-xl font-extrabold tracking-wider">
                TVT <span style={{ color: 'var(--accent)' }}>STUDIO</span>
              </span>
            </div>

            <h2 className="font-display mt-3 text-xl font-extrabold sm:text-2xl">
              {authView === 'login'
                ? locale === 'vi'
                  ? 'Chào mừng quay trở lại'
                  : 'Welcome back'
                : authView === 'register'
                  ? locale === 'vi'
                    ? 'Tạo tài khoản TVT Studio'
                    : 'Create your TVT Studio account'
                  : locale === 'vi'
                    ? 'Khôi phục mật khẩu'
                    : 'Reset your password'}
            </h2>
            <p className="mt-1 text-xs" style={{ color: 'var(--ink-secondary)' }}>
              {locale === 'vi'
                ? 'Lưu thông tin thanh toán, lịch sử đơn cũ & tải lại Source Code vĩnh viễn'
                : 'Save billing details, order history & lifetime Source Code re-downloads'}
            </p>
          </div>

          {/* Social OAuth Buttons (Google full-width + Facebook & LinkedIn 2-col) */}
          {authView !== 'forgot' && (
            <div className="mt-6 space-y-2.5">
              <button
                type="button"
                onClick={() => handleSocialClick('google')}
                data-testid="oauth-google-btn"
                className="flex h-11 w-full items-center justify-center gap-2.5 rounded-full border text-sm font-semibold transition-all hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)]"
                style={{
                  backgroundColor: 'var(--bg-canvas)',
                  borderColor: 'var(--border-hairline)',
                  color: 'var(--ink-primary)',
                }}
              >
                <IconGoogle className="h-4.5 w-4.5 shrink-0" />
                <span>
                  {authView === 'register'
                    ? locale === 'vi'
                      ? 'Đăng ký bằng Google'
                      : 'Continue with Google'
                    : locale === 'vi'
                      ? 'Đăng nhập bằng Google'
                      : 'Sign in with Google'}
                </span>
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSocialClick('facebook')}
                  data-testid="oauth-facebook-btn"
                  className="flex h-11 items-center justify-center gap-2 rounded-full border text-sm font-semibold transition-all hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)]"
                  style={{
                    backgroundColor: 'var(--bg-canvas)',
                    borderColor: 'var(--border-hairline)',
                    color: 'var(--ink-primary)',
                  }}
                >
                  <IconFacebook className="h-4.5 w-4.5 shrink-0" />
                  <span>Facebook</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialClick('linkedin_oidc')}
                  data-testid="oauth-linkedin-btn"
                  className="flex h-11 items-center justify-center gap-2 rounded-full border text-sm font-semibold transition-all hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)]"
                  style={{
                    backgroundColor: 'var(--bg-canvas)',
                    borderColor: 'var(--border-hairline)',
                    color: 'var(--ink-primary)',
                  }}
                >
                  <IconLinkedIn className="h-4.5 w-4.5 shrink-0" />
                  <span>LinkedIn</span>
                </button>
              </div>

              {/* Clean Horizontal Divider */}
              <div className="flex items-center gap-3 pt-2">
                <div className="h-px flex-1" style={{ backgroundColor: 'var(--border-hairline)' }} />
                <span className="text-xs font-medium" style={{ color: 'var(--ink-muted)' }}>
                  {authView === 'register'
                    ? locale === 'vi'
                      ? 'Hoặc đăng ký bằng email'
                      : 'Or sign up with email'
                    : locale === 'vi'
                      ? 'Hoặc đăng nhập bằng email'
                      : 'Or sign in with email'}
                </span>
                <div className="h-px flex-1" style={{ backgroundColor: 'var(--border-hairline)' }} />
              </div>
            </div>
          )}

          {/* Contextual Notice / Error Banner */}
          {authNotice && (
            <div
              className="mt-4 rounded-xl border px-3.5 py-2.5 text-xs leading-relaxed"
              style={{
                backgroundColor: 'var(--cyan-soft)',
                borderColor: 'var(--cyan)',
                color: 'var(--ink-primary)',
              }}
            >
              {authNotice}
            </div>
          )}
          {authError && (
            <div
              className="mt-4 rounded-xl border px-3.5 py-2.5 text-xs font-semibold"
              style={{
                backgroundColor: 'var(--accent-soft)',
                borderColor: 'var(--accent)',
                color: 'var(--accent)',
              }}
            >
              {authError}
            </div>
          )}

          {/* LOGIN FORM */}
          {authView === 'login' && (
            <form onSubmit={handleLoginSubmit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="auth-login-email" className="block text-xs font-bold">
                  Email
                </label>
                <input
                  id="auth-login-email"
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder={locale === 'vi' ? 'Nhập email' : 'Enter email'}
                  className="input-studio mt-1.5 h-11 w-full rounded-xl px-4 text-sm"
                  data-testid="account-email-input"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="auth-login-password" className="block text-xs font-bold">
                    {locale === 'vi' ? 'Mật khẩu' : 'Password'}
                  </label>
                  <button
                    type="button"
                    onClick={() => switchAuthView('forgot')}
                    className="text-xs font-semibold hover:underline"
                    style={{ color: 'var(--accent)' }}
                    data-testid="auth-forgot-link"
                  >
                    {locale === 'vi' ? 'Quên mật khẩu' : 'Forgot password'}
                  </button>
                </div>
                <div className="relative mt-1.5">
                  <input
                    id="auth-login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder={locale === 'vi' ? 'Nhập mật khẩu' : 'Enter password'}
                    className="input-studio h-11 w-full rounded-xl pr-11 pl-4 text-sm"
                    data-testid="account-password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 p-1"
                    style={{ color: 'var(--ink-muted)' }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <IconEye className="h-4 w-4" /> : <IconEyeOff className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="btn-primary inline-flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-bold disabled:opacity-60"
                data-testid="account-login-submit-btn"
              >
                <span>
                  {busy
                    ? locale === 'vi'
                      ? 'Đang đăng nhập...'
                      : 'Signing in...'
                    : locale === 'vi'
                      ? 'Đăng nhập'
                      : 'Sign in'}
                </span>
                <IconArrowRight className="h-4 w-4" />
              </button>

              <p className="pt-1 text-center text-xs sm:text-sm" style={{ color: 'var(--ink-secondary)' }}>
                {locale === 'vi' ? 'Bạn chưa có tài khoản? ' : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => switchAuthView('register')}
                  className="font-bold hover:underline"
                  style={{ color: 'var(--accent)' }}
                  data-testid="auth-switch-register-btn"
                >
                  {locale === 'vi' ? 'Đăng ký ngay' : 'Sign up now'}
                </button>
              </p>
            </form>
          )}

          {/* REGISTER FORM */}
          {authView === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="mt-4 space-y-3.5">
              <div>
                <label htmlFor="auth-reg-name" className="block text-xs font-bold">
                  {locale === 'vi' ? 'Họ và tên' : 'Full Name'}
                </label>
                <input
                  id="auth-reg-name"
                  type="text"
                  required
                  value={fullNameInput}
                  onChange={(e) => setFullNameInput(e.target.value)}
                  placeholder={locale === 'vi' ? 'Nguyễn Minh Anh' : 'Alex Nguyen'}
                  className="input-studio mt-1.5 h-11 w-full rounded-xl px-4 text-sm"
                  data-testid="account-reg-name-input"
                />
              </div>

              <div>
                <label htmlFor="auth-reg-email" className="block text-xs font-bold">
                  Email
                </label>
                <input
                  id="auth-reg-email"
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder={locale === 'vi' ? 'Nhập email của bạn' : 'Enter your email'}
                  className="input-studio mt-1.5 h-11 w-full rounded-xl px-4 text-sm"
                  data-testid="account-reg-email-input"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="auth-reg-pass" className="block text-xs font-bold">
                    {locale === 'vi' ? 'Mật khẩu' : 'Password'}
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      id="auth-reg-pass"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="≥ 6 ký tự"
                      className="input-studio h-11 w-full rounded-xl pr-10 pl-3.5 text-sm"
                      data-testid="account-reg-password-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute top-1/2 right-2.5 -translate-y-1/2 p-1"
                      style={{ color: 'var(--ink-muted)' }}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <IconEye className="h-4 w-4" /> : <IconEyeOff className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="auth-reg-confirm" className="block text-xs font-bold">
                    {locale === 'vi' ? 'Nhập lại mật khẩu' : 'Confirm Password'}
                  </label>
                  <input
                    id="auth-reg-confirm"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    placeholder="••••••"
                    className="input-studio mt-1.5 h-11 w-full rounded-xl px-3.5 text-sm"
                    data-testid="account-reg-confirm-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="btn-primary inline-flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-bold disabled:opacity-60"
                data-testid="account-register-submit-btn"
              >
                <span>
                  {busy
                    ? locale === 'vi'
                      ? 'Đang tạo tài khoản...'
                      : 'Creating account...'
                    : locale === 'vi'
                      ? 'Đăng ký tài khoản miễn phí'
                      : 'Create Free Account'}
                </span>
                <IconArrowRight className="h-4 w-4" />
              </button>

              <p className="pt-1 text-center text-xs sm:text-sm" style={{ color: 'var(--ink-secondary)' }}>
                {locale === 'vi' ? 'Đã có tài khoản? ' : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => switchAuthView('login')}
                  className="font-bold hover:underline"
                  style={{ color: 'var(--accent)' }}
                >
                  {locale === 'vi' ? 'Đăng nhập ngay' : 'Sign in'}
                </button>
              </p>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {authView === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="mt-5 space-y-4">
              <div>
                <label htmlFor="auth-forgot-email" className="block text-xs font-bold">
                  {locale === 'vi' ? 'Email đã đăng ký' : 'Registered Email'}
                </label>
                <input
                  id="auth-forgot-email"
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="ban@congty.vn"
                  className="input-studio mt-1.5 h-11 w-full rounded-xl px-4 text-sm"
                />
              </div>

              {!cloudAuthActive && (
                <div>
                  <label htmlFor="auth-forgot-newpass" className="block text-xs font-bold">
                    {locale === 'vi' ? 'Đặt mật khẩu mới (≥ 6 ký tự)' : 'New Password (≥ 6 chars)'}
                  </label>
                  <input
                    id="auth-forgot-newpass"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••"
                    className="input-studio mt-1.5 h-11 w-full rounded-xl px-4 text-sm"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="btn-primary inline-flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-bold"
              >
                <span>
                  {cloudAuthActive
                    ? locale === 'vi'
                      ? 'Gửi Link Đặt Lại Mật Khẩu'
                      : 'Send Reset Link'
                    : locale === 'vi'
                      ? 'Cập Nhật Mật Khẩu Mới'
                      : 'Update Password'}
                </span>
                <IconArrowRight className="h-4 w-4" />
              </button>

              <p className="text-center text-xs">
                <button
                  type="button"
                  onClick={() => switchAuthView('login')}
                  className="font-semibold hover:underline"
                  style={{ color: 'var(--accent)' }}
                >
                  {locale === 'vi' ? '← Quay lại trang Đăng nhập' : '← Back to Sign in'}
                </button>
              </p>
            </form>
          )}

          {/* Bottom Support Pill (Matches clean enterprise UX) */}
          <div
            className="mt-5 rounded-full px-4 py-2.5 text-center text-[11px] leading-snug"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              color: 'var(--ink-secondary)',
            }}
          >
            {locale === 'vi' ? 'Bạn gặp khó khăn khi tạo tài khoản? Nhắn Zalo ' : 'Need help signing in? Contact Zalo '}
            <a
              href={STUDIO_CONTACT.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono-num font-bold hover:underline"
              style={{ color: 'var(--emerald)' }}
            >
              {STUDIO_CONTACT.phoneDisplay}
            </a>{' '}
            {locale === 'vi' ? '(hỗ trợ 08:00–22:00).' : '(08:00–22:00 ICT).'}
          </div>
        </div>
      ) : (
        /* LOGGED-IN VIEW: 3-Tab Client Vault, Order History & Saved Billing Profile */
        <div
          className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-strong)',
            boxShadow: 'var(--shadow-modal)',
          }}
        >
          {/* Header */}
          <div
            className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b px-6 py-4 backdrop-blur-md"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-hairline)',
            }}
          >
            <div className="min-w-0">
              <span className="font-mono-num text-[11px] font-semibold uppercase" style={{ color: 'var(--accent)' }}>
                {session.mode === 'supabase_otp' ? 'CLOUD AUTH VERIFIED' : 'CLIENT ACCOUNT VAULT'} · {session.email}
              </span>
              <h2 className="font-display truncate text-lg font-extrabold">
                {locale === 'vi'
                  ? 'Tài Khoản Khách Hàng & Kho Tải Lại Source Code'
                  : 'Client Account & Permanent Source Code Vault'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onLogout}
                className="btn-ghost rounded-lg px-3 py-1.5 text-xs font-semibold"
                data-testid="account-logout-btn"
              >
                {locale === 'vi' ? 'Đăng xuất' : 'Sign out'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-ghost flex h-9 w-9 items-center justify-center rounded-lg"
                aria-label="Close account portal"
              >
                <IconClose className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-5 p-6">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 border-b pb-3" style={{ borderColor: 'var(--border-hairline)' }}>
              {(
                [
                  {
                    id: 'vault',
                    label:
                      locale === 'vi'
                        ? `Kho Source Code (${unlockedCount})`
                        : `Source Vault (${unlockedCount})`,
                  },
                  {
                    id: 'history',
                    label:
                      locale === 'vi'
                        ? `Lịch Sử Đơn Hàng (${accountOrders.length})`
                        : `Order History (${accountOrders.length})`,
                  },
                  {
                    id: 'profile',
                    label: locale === 'vi' ? 'Hồ Sơ Thanh Toán Đã Lưu' : 'Saved Billing Profile',
                  },
                ] as const
              ).map((item) => {
                const active = tab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTab(item.id)}
                    data-testid={`account-tab-${item.id}`}
                    className="rounded-lg border px-3.5 py-2 text-xs font-semibold transition-all"
                    style={{
                      backgroundColor: active ? 'var(--accent)' : 'var(--bg-elevated)',
                      borderColor: active ? 'var(--accent)' : 'var(--border-hairline)',
                      color: active ? '#ffffff' : 'var(--ink-secondary)',
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* TAB 1: PERMANENT SOURCE CODE & LICENSE RECOVERY VAULT */}
            {tab === 'vault' && (
              <div className="space-y-4">
                <div
                  className="flex items-start gap-3 rounded-xl border p-4 text-xs"
                  style={{
                    backgroundColor: 'var(--bg-canvas)',
                    borderColor: 'var(--border-hairline)',
                    color: 'var(--ink-secondary)',
                  }}
                >
                  <IconCode className="mt-0.5 h-4.5 w-4.5 shrink-0" style={{ color: 'var(--emerald)' }} />
                  <div>
                    <strong style={{ color: 'var(--ink-primary)' }}>
                      {locale === 'vi'
                        ? 'Bảo Lưu Mã Nguồn Vĩnh Viễn Theo Tài Khoản'
                        : 'Permanent Source Code Recovery Vault'}
                    </strong>
                    <p className="mt-1 leading-relaxed">
                      {locale === 'vi'
                        ? 'Mọi sản phẩm bạn đã thanh toán đều được lưu vĩnh viễn tại đây cùng Mã Bản Quyền. Nếu lỡ xóa source code trên máy, chỉ cần bấm "Tải Lại Source Code" (cấp link tải riêng an toàn 5 phút khi nối Supabase Private Storage) hoặc tải gói chứng nhận khôi phục.'
                        : 'Every verified purchase stays linked to your account permanently with its License Key. Re-download your clean source package anytime if you ever lose your local files.'}
                    </p>
                  </div>
                </div>

                {accountOrders.length === 0 ? (
                  <div className="rounded-2xl border p-8 text-center" style={{ backgroundColor: 'var(--bg-canvas)', borderColor: 'var(--border-hairline)' }}>
                    <p className="text-sm font-bold">
                      {locale === 'vi'
                        ? `Chưa có đơn hàng nào gắn với tài khoản ${session.email}.`
                        : `No orders linked to ${session.email} yet.`}
                    </p>
                    <p className="mt-1.5 text-xs" style={{ color: 'var(--ink-secondary)' }}>
                      {locale === 'vi'
                        ? 'Khi đặt mua bằng tài khoản này, toàn bộ hóa đơn & gói Source Code sẽ tự động lưu vào kho của bạn.'
                        : 'Orders placed with this account automatically appear here with lifetime re-download access.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {accountOrders.map((order) => {
                      const unlocked = isOrderSourceUnlocked(order.status);
                      const deliv = ensureOrderDeliverable(order);
                      return (
                        <div
                          key={order.orderCode}
                          className="rounded-2xl border p-4"
                          style={{
                            backgroundColor: 'var(--bg-canvas)',
                            borderColor: unlocked ? 'var(--emerald)' : 'var(--border-hairline)',
                          }}
                          data-testid={`vault-item-${order.orderCode}`}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono-num text-xs font-bold" style={{ color: 'var(--accent)' }}>
                                  {order.orderCode}
                                </span>
                                <span
                                  className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold"
                                  style={{
                                    backgroundColor: unlocked ? 'var(--emerald-soft)' : 'var(--bg-elevated)',
                                    color: unlocked ? 'var(--emerald)' : 'var(--ink-muted)',
                                  }}
                                >
                                  {unlocked ? <IconCheck className="h-3 w-3" /> : <IconLock className="h-3 w-3" />}
                                  {unlocked
                                    ? locale === 'vi'
                                      ? 'ĐÃ MỞ KHÓA · TẢI LẠI VĨNH VIỄN'
                                      : 'UNLOCKED · LIFETIME RECOVERY'
                                    : locale === 'vi'
                                      ? 'CHỜ XÁC NHẬN THANH TOÁN'
                                      : 'AWAITING PAYMENT VERIFICATION'}
                                </span>
                              </div>
                              <h3 className="mt-1 text-sm font-bold">
                                {order.items
                                  .map((it) => (it.kind === 'template' ? it.title : it.title[locale]))
                                  .join(' + ')}
                              </h3>
                              <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]">
                                <span style={{ color: 'var(--ink-muted)' }}>License:</span>
                                <code className="font-mono-num rounded bg-black/30 px-1.5 py-0.5 font-bold" style={{ color: 'var(--cyan)' }}>
                                  {deliv.licenseKey}
                                </code>
                                <button
                                  type="button"
                                  onClick={() => handleCopyLicense(deliv.licenseKey)}
                                  className="inline-flex items-center gap-1 text-[10px] font-semibold hover:text-[var(--accent)]"
                                  style={{ color: 'var(--ink-secondary)' }}
                                >
                                  <IconCopy className="h-3 w-3" />
                                  {copiedKey === deliv.licenseKey ? 'Đã copy' : 'Copy'}
                                </button>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              {unlocked ? (
                                <>
                                  <button
                                    type="button"
                                    disabled={downloadingCode === order.orderCode}
                                    onClick={() => handleRedownloadSource(order)}
                                    data-testid={`vault-download-${order.orderCode}`}
                                    className="btn-primary inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold"
                                  >
                                    <IconDownload className="h-3.5 w-3.5" />
                                    <span>
                                      {downloadingCode === order.orderCode
                                        ? 'Đang tạo link...'
                                        : locale === 'vi'
                                          ? 'Tải Lại Source Code'
                                          : 'Re-Download Source'}
                                    </span>
                                  </button>
                                  {deliv.repoUrl && (
                                    <a
                                      href={deliv.repoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="btn-secondary inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold"
                                    >
                                      <span>Git Repo</span>
                                      <IconExternal className="h-3.5 w-3.5" />
                                    </a>
                                  )}
                                </>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onClose();
                                    onOpenOrderTracker(order.orderCode);
                                  }}
                                  className="btn-secondary rounded-xl px-3.5 py-2 text-xs font-semibold"
                                >
                                  {locale === 'vi' ? 'Hoàn tất thanh toán →' : 'Complete Payment →'}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: FULL ORDER HISTORY */}
            {tab === 'history' && (
              <div className="space-y-3">
                {accountOrders.length === 0 ? (
                  <p className="rounded-xl border p-6 text-center text-xs" style={{ borderColor: 'var(--border-hairline)', color: 'var(--ink-muted)' }}>
                    {locale === 'vi' ? 'Chưa có lịch sử đơn hàng.' : 'No order history yet.'}
                  </p>
                ) : (
                  accountOrders.map((order) => {
                    const meta = ORDER_STATUS_META[order.status ?? 'AWAITING_PAYMENT'];
                    return (
                      <div
                        key={order.orderCode}
                        className="flex flex-col justify-between gap-3 rounded-xl border p-4 sm:flex-row sm:items-center"
                        style={{ backgroundColor: 'var(--bg-canvas)', borderColor: 'var(--border-hairline)' }}
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono-num text-xs font-bold" style={{ color: 'var(--accent)' }}>
                              {order.orderCode}
                            </span>
                            <span className="font-mono-num text-[11px]" style={{ color: 'var(--ink-muted)' }}>
                              {order.createdAtIso.slice(0, 10)}
                            </span>
                            <span className="text-[11px] font-semibold" style={{ color: meta.colorVar }}>
                              · {meta[locale]}
                            </span>
                          </div>
                          <div className="mt-1 text-xs font-semibold">
                            {order.items.map((i) => (i.kind === 'template' ? i.title : i.title[locale])).join(', ')}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono-num text-sm font-bold">
                            {formatMoney(
                              currency === 'VND' ? order.totals.netTotalVnd : order.totals.netTotalUsd,
                              currency
                            )}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenOrderTracker(order.orderCode);
                            }}
                            className="btn-secondary rounded-lg px-3 py-1.5 text-xs font-semibold"
                          >
                            {locale === 'vi' ? 'Xem & In PDF' : 'Receipt / PDF'}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB 3: SAVED BILLING & CHECKOUT PROFILE */}
            {tab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="rounded-xl border p-3.5 text-xs" style={{ backgroundColor: 'var(--bg-canvas)', borderColor: 'var(--border-hairline)', color: 'var(--ink-secondary)' }}>
                  <strong style={{ color: 'var(--ink-primary)' }}>
                    {locale === 'vi' ? 'Tự động điền Checkout 1 chạm · An toàn PCI:' : '1-Click Checkout Auto-Fill · PCI Safe:'}
                  </strong>{' '}
                  {locale === 'vi'
                    ? 'Thông tin bên dưới được lưu gắn với tài khoản để lần sau mua không cần nhập lại. Hệ thống KHÔNG bao giờ lưu số thẻ, CVV hay mật khẩu ngân hàng.'
                    : 'Saved to your account for 1-click checkout on future orders. We NEVER store credit cards, CVVs, or banking passwords.'}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="prof-name" className="block text-xs font-semibold">
                      {locale === 'vi' ? 'Họ và tên mặc định' : 'Default Full Name'}
                    </label>
                    <input
                      id="prof-name"
                      type="text"
                      value={draftProfile.fullName}
                      onChange={(e) => setDraftProfile({ ...draftProfile, fullName: e.target.value })}
                      placeholder="Nguyễn Minh Anh"
                      className="input-studio mt-1.5 h-10 w-full rounded-xl px-3.5 text-sm"
                      data-testid="profile-fullname-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="prof-phone" className="block text-xs font-semibold">
                      {locale === 'vi' ? 'Số điện thoại / Zalo mặc định' : 'Default Phone / Zalo'}
                    </label>
                    <input
                      id="prof-phone"
                      type="tel"
                      value={draftProfile.phoneOrZalo}
                      onChange={(e) => setDraftProfile({ ...draftProfile, phoneOrZalo: e.target.value })}
                      placeholder="0909 123 456"
                      className="input-studio mt-1.5 h-10 w-full rounded-xl px-3.5 text-sm"
                      data-testid="profile-phone-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="prof-domain" className="block text-xs font-semibold">
                      {locale === 'vi' ? 'Thương hiệu / Domain / Công ty' : 'Brand / Domain / Company'}
                    </label>
                    <input
                      id="prof-domain"
                      type="text"
                      value={draftProfile.brandOrDomain}
                      onChange={(e) => setDraftProfile({ ...draftProfile, brandOrDomain: e.target.value })}
                      placeholder="thuonghieu.vn"
                      className="input-studio mt-1.5 h-10 w-full rounded-xl px-3.5 text-sm"
                      data-testid="profile-domain-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="prof-channel" className="block text-xs font-semibold">
                      {locale === 'vi' ? 'Kênh thanh toán ưa thích' : 'Preferred Payment Channel'}
                    </label>
                    <select
                      id="prof-channel"
                      value={draftProfile.preferredChannel}
                      onChange={(e) =>
                        setDraftProfile({
                          ...draftProfile,
                          preferredChannel: e.target.value as PaymentChannel,
                        })
                      }
                      className="input-studio mt-1.5 h-10 w-full rounded-xl px-3 text-sm"
                    >
                      <option value="vietqr">VietQR Ngân Hàng 24/7</option>
                      <option value="consult-first">Tư Vấn Trước (0₫ cọc)</option>
                      <option value="zalopay">ZaloPay / QR</option>
                      <option value="momo">Ví MoMo</option>
                      <option value="b2b-wire">B2B USD Invoice (Deel / Wise)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="prof-note" className="block text-xs font-semibold">
                    {locale === 'vi' ? 'Ghi chú xuất hóa đơn / Công nghệ ưa thích' : 'Default Billing / Tech Stack Note'}
                  </label>
                  <textarea
                    id="prof-note"
                    rows={2}
                    value={draftProfile.billingNote}
                    onChange={(e) => setDraftProfile({ ...draftProfile, billingNote: e.target.value })}
                    placeholder="VD: MST công ty hoặc ngôn ngữ lập trình ưu tiên..."
                    className="input-studio mt-1.5 w-full rounded-xl p-3 text-sm"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="submit"
                    disabled={busy}
                    className="btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold"
                    data-testid="profile-save-btn"
                  >
                    <IconCheck className="h-4 w-4" />
                    <span>
                      {profileSavedToast
                        ? locale === 'vi'
                          ? 'Đã Lưu Hồ Sơ Thanh Toán!'
                          : 'Billing Profile Saved!'
                        : locale === 'vi'
                          ? 'Lưu Thông Tin Cho Lần Mua Sau'
                          : 'Save Profile For Future Orders'}
                    </span>
                  </button>

                  <a
                    href={STUDIO_CONTACT.zaloUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold hover:text-[var(--accent)]"
                    style={{ color: 'var(--ink-secondary)' }}
                  >
                    <IconPhone className="h-3.5 w-3.5" />
                    <span>Hỗ trợ khôi phục đơn cũ qua Zalo {STUDIO_CONTACT.phoneDisplay}</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
