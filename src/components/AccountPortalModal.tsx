import React, { useEffect, useMemo, useState } from 'react';
import {
  createDefaultProfile,
  ensureOrderDeliverable,
  filterOrdersForAccount,
  generateHandoverKitMarkdown,
  isOrderSourceUnlocked,
  requestEmailOtpLogin,
  requestSignedSourceDownload,
  syncCloudProfile,
  verifyEmailOtpCode,
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
  IconCheck,
  IconClose,
  IconCode,
  IconCopy,
  IconDownload,
  IconExternal,
  IconLock,
  IconMail,
  IconPhone,
  IconShield,
  IconUser,
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
  const [tab, setTab] = useState<'vault' | 'history' | 'profile'>('vault');
  const [emailInput, setEmailInput] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [authMsg, setAuthMsg] = useState<string | null>(null);
  const [authErr, setAuthErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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

  const handleRequestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthErr(null);
    setAuthMsg(null);
    setBusy(true);
    const res = await requestEmailOtpLogin(emailInput);
    setBusy(false);
    if (!res.ok) {
      setAuthErr(locale === 'vi' ? res.messageVi : res.messageEn);
      return;
    }
    if (res.mode === 'supabase_otp') {
      setOtpStep(true);
      setAuthMsg(locale === 'vi' ? res.messageVi : res.messageEn);
      return;
    }
    if (res.session) {
      onAuthenticated(res.session);
      setEmailInput('');
      setOtpStep(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthErr(null);
    setBusy(true);
    const res = await verifyEmailOtpCode(emailInput, otpCode);
    setBusy(false);
    if (!res.ok || !res.session) {
      setAuthErr(
        locale === 'vi'
          ? res.errorVi || 'Mã OTP chưa đúng.'
          : res.errorEn || 'Invalid OTP code.'
      );
      return;
    }
    onAuthenticated(res.session);
    setOtpStep(false);
    setOtpCode('');
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

    // 1. If Supabase Cloud Auth active, try minting a 5-min signed Private Storage URL
    const signedUrl = await requestSignedSourceDownload(session, order.orderCode);
    if (signedUrl) {
      window.open(signedUrl, '_blank', 'noopener,noreferrer');
      setDownloadingCode(null);
      return;
    }

    // 2. If owner attached a direct release / GitHub URL to the order, open it
    if (deliv.sourceDownloadUrl && /^https?:\/\//i.test(deliv.sourceDownloadUrl)) {
      window.open(deliv.sourceDownloadUrl, '_blank', 'noopener,noreferrer');
      setDownloadingCode(null);
      return;
    }

    // 3. Always provide immediate Commercial License & Recovery Kit (.md) download
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
              {session
                ? `${session.mode === 'supabase_otp' ? 'CLOUD AUTH VERIFIED' : 'EMAIL ACCOUNT VAULT'} · ${session.email}`
                : cloudAuthActive
                  ? 'FREE EMAIL OTP LOGIN · ZERO PASSWORD'
                  : 'CLIENT ACCOUNT & SOURCE RECOVERY VAULT'}
            </span>
            <h2 className="font-display truncate text-lg font-extrabold">
              {session
                ? locale === 'vi'
                  ? 'Tài Khoản Khách Hàng & Kho Tải Lại Source Code'
                  : 'Client Account & Permanent Source Code Vault'
                : locale === 'vi'
                  ? 'Đăng Nhập Bằng Email (Miễn Phí · Không Cần Mật Khẩu)'
                  : 'Sign In With Email (Free · Passwordless)'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {session && (
              <button
                type="button"
                onClick={onLogout}
                className="btn-ghost rounded-lg px-3 py-1.5 text-xs font-semibold"
                data-testid="account-logout-btn"
              >
                {locale === 'vi' ? 'Đăng xuất' : 'Sign out'}
              </button>
            )}
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

        <div className="p-6">
          {/* LOGGED-OUT VIEW: Email Login */}
          {!session ? (
            <div className="mx-auto max-w-xl space-y-5">
              <div
                className="rounded-2xl border p-5"
                style={{
                  backgroundColor: 'var(--bg-canvas)',
                  borderColor: 'var(--border-hairline)',
                }}
              >
                <div className="flex items-center gap-2 text-xs font-bold uppercase" style={{ color: 'var(--emerald)' }}>
                  <IconShield className="h-4 w-4" />
                  <span>
                    {locale === 'vi'
                      ? 'Quyền Lợi Khi Đăng Nhập Bằng Email'
                      : 'Why Sign In With Your Email?'}
                  </span>
                </div>
                <ul className="mt-3 space-y-2 text-xs leading-relaxed sm:text-sm" style={{ color: 'var(--ink-secondary)' }}>
                  <li className="flex items-start gap-2">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--emerald)' }} />
                    <span>
                      <strong>{locale === 'vi' ? 'Tải lại Source Code vĩnh viễn:' : 'Lifetime Source Code Recovery:'}</strong>{' '}
                      {locale === 'vi'
                        ? 'Lỡ xóa mất file trên máy hay đổi laptop mới? Đăng nhập đúng email đã mua để tải lại Source Code & Giấy phép bất cứ lúc nào.'
                        : 'Accidentally deleted your project files? Sign back in with your email anytime to re-download your source & license.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--emerald)' }} />
                    <span>
                      <strong>{locale === 'vi' ? 'Lưu sẵn thông tin thanh toán & xuất hóa đơn:' : 'Saved Billing & 1-Click Auto-Fill:'}</strong>{' '}
                      {locale === 'vi'
                        ? 'Lưu Họ tên, SĐT/Zalo, Domain và Kênh thanh toán ưa thích để mua các lần sau chỉ trong 1 chạm (không bao giờ lưu số thẻ hay mật khẩu ngân hàng).'
                        : 'Saves contact details, domain & preferred payment channel for 1-click checkout (never stores bank passwords or card numbers).'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--emerald)' }} />
                    <span>
                      <strong>{locale === 'vi' ? 'Đồng bộ lịch sử đơn hàng & hóa đơn PDF A4:' : 'Unified Order History & A4 PDF Invoices:'}</strong>{' '}
                      {locale === 'vi'
                        ? 'Tra cứu toàn bộ các đơn đã mua, tiến độ bàn giao 6 mốc và in lại hóa đơn PDF bất cứ khi nào cần.'
                        : 'Access all past orders, 6-stage delivery progress, and formal printable A4 PDF receipts.'}
                    </span>
                  </li>
                </ul>
              </div>

              {!otpStep ? (
                <form onSubmit={handleRequestLogin} className="space-y-4">
                  <div>
                    <label htmlFor="auth-email-input" className="block text-xs font-semibold">
                      {locale === 'vi' ? 'Nhập Email của bạn *' : 'Enter Your Email Address *'}
                    </label>
                    <div className="relative mt-1.5">
                      <IconMail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
                      <input
                        id="auth-email-input"
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="ban@congty.vn"
                        className="input-studio h-11 w-full rounded-xl pr-4 pl-10 text-sm"
                        data-testid="account-email-input"
                      />
                    </div>
                  </div>

                  {authErr && (
                    <p className="rounded-lg border px-3 py-2 text-xs font-semibold" style={{ borderColor: 'var(--accent)', color: 'var(--accent)', backgroundColor: 'var(--accent-soft)' }}>
                      {authErr}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={busy}
                    className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold disabled:opacity-60"
                    data-testid="account-login-submit-btn"
                  >
                    <IconUser className="h-4 w-4" />
                    <span>
                      {busy
                        ? locale === 'vi'
                          ? 'Đang xử lý...'
                          : 'Processing...'
                        : cloudAuthActive
                          ? locale === 'vi'
                            ? 'Gửi Mã Đăng Nhập 6 Số Qua Email (Miễn Phí)'
                            : 'Send Free 6-Digit Email Login Code'
                          : locale === 'vi'
                            ? 'Đăng Nhập & Mở Kho Đơn Hàng Theo Email'
                            : 'Sign In & Open Email Vault'}
                    </span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  {authMsg && (
                    <p className="rounded-xl border p-3 text-xs font-medium" style={{ borderColor: 'var(--emerald)', backgroundColor: 'var(--emerald-soft)', color: 'var(--ink-primary)' }}>
                      {authMsg}
                    </p>
                  )}
                  <div>
                    <label htmlFor="auth-otp-input" className="block text-xs font-semibold">
                      {locale === 'vi' ? 'Nhập mã OTP 6 chữ số trong Email' : 'Enter 6-Digit OTP From Email'}
                    </label>
                    <input
                      id="auth-otp-input"
                      type="text"
                      inputMode="numeric"
                      maxLength={8}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="input-studio mt-1.5 h-11 w-full rounded-xl px-4 text-center font-mono-num text-lg tracking-widest"
                    />
                  </div>
                  {authErr && (
                    <p className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                      {authErr}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setOtpStep(false)}
                      className="btn-ghost rounded-xl px-4 py-3 text-xs font-semibold"
                    >
                      {locale === 'vi' ? '← Đổi Email' : '← Change Email'}
                    </button>
                    <button
                      type="submit"
                      disabled={busy}
                      className="btn-primary flex-1 rounded-xl py-3 text-sm font-semibold"
                    >
                      {locale === 'vi' ? 'Xác Thực & Đăng Nhập' : 'Verify & Sign In'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* LOGGED-IN VIEW: 3-Tab Client Portal */
            <div className="space-y-5">
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
                          ? 'Bảo Lưu Mã Nguồn Vĩnh Viễn Theo Tài Khoản Email'
                          : 'Permanent Source Code Recovery Vault'}
                      </strong>
                      <p className="mt-1 leading-relaxed">
                        {locale === 'vi'
                          ? 'Mọi sản phẩm bạn đã thanh toán đều được lưu vĩnh viễn tại đây cùng Mã Bản Quyền. Nếu lỡ xóa source code trên máy, chỉ cần bấm "Tải Lại Source Code" (cấp link tải riêng an toàn 5 phút khi nối Supabase Private Storage) hoặc tải gói chứng nhận khôi phục.'
                          : 'Every verified purchase stays linked to your email permanently with its License Key. Re-download your clean source package anytime if you ever lose your local files.'}
                      </p>
                    </div>
                  </div>

                  {accountOrders.length === 0 ? (
                    <div className="rounded-2xl border p-8 text-center" style={{ backgroundColor: 'var(--bg-canvas)', borderColor: 'var(--border-hairline)' }}>
                      <p className="text-sm font-bold">
                        {locale === 'vi'
                          ? `Chưa có đơn hàng nào gắn với email ${session.email}.`
                          : `No orders linked to ${session.email} yet.`}
                      </p>
                      <p className="mt-1.5 text-xs" style={{ color: 'var(--ink-secondary)' }}>
                        {locale === 'vi'
                          ? 'Khi đặt mua bằng email này, toàn bộ hóa đơn & gói Source Code sẽ tự động lưu vào kho của bạn.'
                          : 'Orders placed with this email automatically appear here with lifetime re-download access.'}
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
                      ? 'Thông tin bên dưới được lưu gắn với email tài khoản để lần sau mua không cần nhập lại. Hệ thống KHÔNG bao giờ lưu số thẻ, CVV hay mật khẩu ngân hàng.'
                      : 'Saved to your email account for 1-click checkout on future orders. We NEVER store credit cards, CVVs, or banking passwords.'}
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
          )}
        </div>
      </div>
    </div>
  );
};
