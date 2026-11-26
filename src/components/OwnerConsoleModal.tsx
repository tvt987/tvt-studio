import React, { useState } from 'react';
import { formatMoney } from '../engines/catalog';
import {
  exportOrdersToCsvBom,
  loadSupabaseRuntimeConfig,
  ORDER_STATUS_META,
  ORDER_STATUS_SEQUENCE,
  saveSupabaseRuntimeConfig,
  type SupabaseRuntimeConfig,
} from '../engines/orderLedger';
import {
  buildVietQrImageUrl,
  isValidBankVietQrConfig,
  saveBankVietQrConfig,
  VIETNAM_BANKS,
} from '../engines/vietqr';
import type {
  BankVietQrConfig,
  Locale,
  OrderLifecycleStatus,
  OrderSnapshot,
  QuickInquiryRecord,
} from '../engines/types';
import { downloadTextFile } from '../utils/download';
import { IconCheck, IconClose, IconDownload, IconQrCode, IconShield } from './Icons';

interface OwnerConsoleModalProps {
  isOpen: boolean;
  locale: Locale;
  orders: OrderSnapshot[];
  inquiries: QuickInquiryRecord[];
  bankConfig: BankVietQrConfig | null;
  onClose: () => void;
  onUpdateOrderStatus: (orderCode: string, nextStatus: OrderLifecycleStatus) => void;
  onBankConfigChange: (next: BankVietQrConfig | null) => void;
}

export const OwnerConsoleModal: React.FC<OwnerConsoleModalProps> = ({
  isOpen,
  locale,
  orders,
  inquiries,
  bankConfig,
  onClose,
  onUpdateOrderStatus,
  onBankConfigChange,
}) => {
  const [tab, setTab] = useState<'orders' | 'vietqr' | 'cloud-db'>('orders');
  const [bankBin, setBankBin] = useState(bankConfig?.bankBin ?? '970422');
  const [accountNumber, setAccountNumber] = useState(bankConfig?.accountNumber ?? '');
  const [accountName, setAccountName] = useState(bankConfig?.accountName ?? 'TRUONG VAN TINH');
  const [bankSaved, setBankSaved] = useState(false);

  const [cloudCfg, setCloudCfg] = useState<SupabaseRuntimeConfig>(() => loadSupabaseRuntimeConfig());
  const [cloudSaved, setCloudSaved] = useState(false);

  if (!isOpen) return null;

  const totalPipelineVnd = orders.reduce((acc, o) => acc + o.totals.netTotalVnd, 0);
  const selectedBank = VIETNAM_BANKS.find((b) => b.bin === bankBin) ?? VIETNAM_BANKS[0];
  const draftBankCfg: BankVietQrConfig = {
    bankBin,
    bankShortName: selectedBank.shortName,
    accountNumber,
    accountName,
  };
  const draftValid = isValidBankVietQrConfig(draftBankCfg);

  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftValid) return;
    saveBankVietQrConfig(draftBankCfg);
    onBankConfigChange(draftBankCfg);
    setBankSaved(true);
    window.setTimeout(() => setBankSaved(false), 2000);
  };

  const handleClearBank = () => {
    saveBankVietQrConfig(null);
    onBankConfigChange(null);
    setAccountNumber('');
  };

  const handleSaveCloud = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseRuntimeConfig(cloudCfg);
    setCloudSaved(true);
    window.setTimeout(() => setCloudSaved(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="TVT Studio Owner Console"
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
        <div
          className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b px-6 py-4 backdrop-blur-md"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-hairline)',
          }}
        >
          <div>
            <span className="font-mono-num text-[11px] font-semibold uppercase" style={{ color: 'var(--accent)' }}>
              OWNER ADMIN CONSOLE · CTRL+SHIFT+A
            </span>
            <h2 className="font-display text-lg font-extrabold">
              {locale === 'vi'
                ? 'Quản Trị Đơn Hàng, VietQR & Kết Nối Cloud DB'
                : 'Order Operations, Live VietQR & Cloud DB Config'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost flex h-9 w-9 items-center justify-center rounded-lg"
            aria-label="Close owner console"
          >
            <IconClose className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex flex-wrap gap-2 border-b px-6 py-3" style={{ borderColor: 'var(--border-hairline)' }}>
          {(
            [
              { id: 'orders', label: locale === 'vi' ? `Đơn Hàng & Lead (${orders.length + inquiries.length})` : `Orders & Leads (${orders.length + inquiries.length})` },
              { id: 'vietqr', label: locale === 'vi' ? 'Cấu Hình VietQR Ngân Hàng' : 'Live Bank VietQR Setup' },
              { id: 'cloud-db', label: locale === 'vi' ? 'Cloud DB (Supabase) & Webhook' : 'Cloud DB & Auto-Webhook' },
            ] as const
          ).map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
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

        <div className="p-6">
          {/* TAB 1: ORDERS & LEADS */}
          {tab === 'orders' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="surface-elevated rounded-xl p-4">
                  <div className="text-[11px]" style={{ color: 'var(--ink-muted)' }}>
                    {locale === 'vi' ? 'Tổng Đơn Hàng (IndexedDB)' : 'Persisted Orders'}
                  </div>
                  <div className="font-mono-num mt-1 text-2xl font-extrabold">{orders.length}</div>
                </div>
                <div className="surface-elevated rounded-xl p-4">
                  <div className="text-[11px]" style={{ color: 'var(--ink-muted)' }}>
                    {locale === 'vi' ? 'Tổng Giá Trị Hợp Đồng' : 'Pipeline Value'}
                  </div>
                  <div className="font-mono-num mt-1 text-2xl font-extrabold" style={{ color: 'var(--emerald)' }}>
                    {formatMoney(totalPipelineVnd, 'VND')}
                  </div>
                </div>
                <div className="surface-elevated rounded-xl p-4">
                  <div className="text-[11px]" style={{ color: 'var(--ink-muted)' }}>
                    {locale === 'vi' ? 'Yêu Cầu Tư Vấn Nhanh' : 'Quick Inquiries'}
                  </div>
                  <div className="font-mono-num mt-1 text-2xl font-extrabold" style={{ color: 'var(--cyan)' }}>
                    {inquiries.length}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold">
                  {locale === 'vi' ? 'Danh Sách Đơn Hàng (Cập Nhật Trạng Thái Trực Tiếp)' : 'Orders Ledger'}
                </h3>
                <button
                  type="button"
                  disabled={orders.length === 0}
                  onClick={() => {
                    const csv = exportOrdersToCsvBom(orders);
                    downloadTextFile(`TVT-Studio-Orders-${new Date().toISOString().slice(0, 10)}.csv`, csv);
                  }}
                  className="btn-secondary inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-40"
                >
                  <IconDownload className="h-3.5 w-3.5" />
                  <span>Export CSV (UTF-8 BOM)</span>
                </button>
              </div>

              {orders.length === 0 ? (
                <p className="rounded-xl border p-6 text-center text-xs" style={{ borderColor: 'var(--border-hairline)', color: 'var(--ink-muted)' }}>
                  {locale === 'vi' ? 'Chưa có đơn hàng nào.' : 'No orders recorded yet.'}
                </p>
              ) : (
                <div className="space-y-2.5">
                  {orders.map((order) => (
                    <div
                      key={order.orderCode}
                      className="flex flex-col justify-between gap-3 rounded-xl border p-4 sm:flex-row sm:items-center"
                      style={{ backgroundColor: 'var(--bg-canvas)', borderColor: 'var(--border-hairline)' }}
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono-num text-xs font-bold" style={{ color: 'var(--accent)' }}>
                            {order.orderCode}
                          </span>
                          <span className="text-xs font-semibold">{order.client.fullName}</span>
                          <span className="font-mono-num text-[11px]" style={{ color: 'var(--ink-muted)' }}>
                            {order.client.phoneOrZalo}
                          </span>
                        </div>
                        <div className="mt-1 text-[11px]" style={{ color: 'var(--ink-secondary)' }}>
                          {formatMoney(order.totals.netTotalVnd, 'VND')} · {order.paymentChannel}
                          {order.paymentRef ? ` · Ref: ${order.paymentRef}` : ''}
                        </div>
                      </div>

                      <select
                        value={order.status ?? 'AWAITING_PAYMENT'}
                        onChange={(e) =>
                          onUpdateOrderStatus(order.orderCode, e.target.value as OrderLifecycleStatus)
                        }
                        className="input-studio h-9 rounded-lg px-3 text-xs font-semibold"
                        aria-label={`Status for ${order.orderCode}`}
                      >
                        {ORDER_STATUS_SEQUENCE.map((st) => (
                          <option key={st} value={st}>
                            {ORDER_STATUS_META[st][locale]}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}

              {inquiries.length > 0 && (
                <div className="space-y-2 border-t pt-4" style={{ borderColor: 'var(--border-hairline)' }}>
                  <h3 className="text-sm font-bold">
                    {locale === 'vi' ? 'Yêu Cầu Tư Vấn / Thương Lượng Giá' : 'Consultation Leads'}
                  </h3>
                  {inquiries.map((inq) => (
                    <div
                      key={inq.inquiryCode}
                      className="rounded-xl border p-3.5 text-xs"
                      style={{ backgroundColor: 'var(--bg-canvas)', borderColor: 'var(--border-hairline)' }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono-num font-bold" style={{ color: 'var(--cyan)' }}>
                          {inq.inquiryCode} · {inq.productName || 'Custom'}
                        </span>
                        <span className="font-mono-num text-[10px]" style={{ color: 'var(--ink-muted)' }}>
                          {inq.preferredLanguage}
                        </span>
                      </div>
                      <div className="mt-1 font-semibold">
                        {inq.fullName} — {inq.phoneOrZalo} ({inq.email})
                      </div>
                      <p className="mt-1" style={{ color: 'var(--ink-secondary)' }}>
                        {inq.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LIVE BANK VIETQR CONFIG */}
          {tab === 'vietqr' && (
            <form onSubmit={handleSaveBank} className="grid grid-cols-1 gap-6 md:grid-cols-12">
              <div className="space-y-4 md:col-span-7">
                <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
                  {locale === 'vi'
                    ? 'Nhập số tài khoản ngân hàng thật của bạn (hoặc cấu hình biến môi trường VITE_BANK_BIN / VITE_BANK_ACCOUNT / VITE_BANK_ACCOUNT_NAME trên GitHub Actions). Trang Checkout sẽ tự động sinh mã VietQR chuẩn NAPAS tự điền sẵn số tiền & mã đơn TVT-ORD-XXXX.'
                    : 'Configure your real Vietnam bank account (or set VITE_BANK_BIN / VITE_BANK_ACCOUNT / VITE_BANK_ACCOUNT_NAME in CI) to activate dynamic amount-locked VietQR codes in Checkout.'}
                </p>

                <div>
                  <label htmlFor="owner-bank-bin" className="block text-xs font-semibold">
                    {locale === 'vi' ? 'Ngân hàng (NAPAS BIN)' : 'Bank (NAPAS BIN)'}
                  </label>
                  <select
                    id="owner-bank-bin"
                    value={bankBin}
                    onChange={(e) => setBankBin(e.target.value)}
                    className="input-studio mt-1.5 h-10 w-full rounded-xl px-3 text-sm"
                  >
                    {VIETNAM_BANKS.map((bank) => (
                      <option key={bank.bin} value={bank.bin}>
                        {bank.shortName} ({bank.bin}) — {bank.fullName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="owner-bank-acct" className="block text-xs font-semibold">
                    {locale === 'vi' ? 'Số tài khoản ngân hàng' : 'Bank Account Number'}
                  </label>
                  <input
                    id="owner-bank-acct"
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="VD: 0931467024"
                    className="input-studio mt-1.5 h-10 w-full rounded-xl px-3.5 font-mono-num text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="owner-bank-name" className="block text-xs font-semibold">
                    {locale === 'vi' ? 'Tên chủ tài khoản (Không dấu)' : 'Account Holder Name'}
                  </label>
                  <input
                    id="owner-bank-name"
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="TRUONG VAN TINH"
                    className="input-studio mt-1.5 h-10 w-full rounded-xl px-3.5 font-mono-num text-sm uppercase"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="submit"
                    disabled={!draftValid}
                    className="btn-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold disabled:opacity-45"
                  >
                    <IconCheck className="h-4 w-4" />
                    <span>{bankSaved ? 'Đã Lưu VietQR!' : 'Lưu & Kích Hoạt VietQR'}</span>
                  </button>
                  {bankConfig && (
                    <button
                      type="button"
                      onClick={handleClearBank}
                      className="btn-ghost rounded-xl px-3.5 py-2.5 text-xs font-semibold"
                    >
                      Xóa cấu hình STK
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl border p-5 md:col-span-5" style={{ backgroundColor: 'var(--bg-canvas)', borderColor: 'var(--border-hairline)' }}>
                {draftValid ? (
                  <>
                    <div className="rounded-xl bg-white p-2.5 shadow-md">
                      <img
                        src={buildVietQrImageUrl(draftBankCfg, 1_050_000, 'TVT-ORD-DEMO')}
                        alt="Live VietQR Preview"
                        className="h-52 w-52 object-contain"
                      />
                    </div>
                    <span className="font-mono-num mt-2 text-[11px]" style={{ color: 'var(--emerald)' }}>
                      LIVE VIETQR PREVIEW (1.050.000₫)
                    </span>
                  </>
                ) : (
                  <div className="text-center text-xs" style={{ color: 'var(--ink-muted)' }}>
                    <IconQrCode className="mx-auto h-10 w-10 opacity-40" />
                    <p className="mt-2">
                      {locale === 'vi'
                        ? 'Nhập STK từ 6 ký tự trở lên để xem trước mã VietQR thật.'
                        : 'Enter an account number (6+ chars) to preview live VietQR.'}
                    </p>
                  </div>
                )}
              </div>
            </form>
          )}

          {/* TAB 3: SUPABASE CLOUD DB & SEPAY WEBHOOK */}
          {tab === 'cloud-db' && (
            <form onSubmit={handleSaveCloud} className="space-y-5">
              <div className="rounded-xl border p-4 text-xs leading-relaxed" style={{ backgroundColor: 'var(--bg-canvas)', borderColor: 'var(--border-hairline)', color: 'var(--ink-secondary)' }}>
                <div className="flex items-center gap-2 font-bold" style={{ color: 'var(--ink-primary)' }}>
                  <IconShield className="h-4 w-4" style={{ color: 'var(--emerald)' }} />
                  <span>Kiến Trúc Lưu Trữ 3 Tầng (0đ / tháng — Production Ready)</span>
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>
                    <strong>Tầng 1 (Đang bật sẵn 100%)</strong>: IndexedDB nội bộ trình duyệt lưu lịch sử đơn hàng & Tra cứu ngay lập tức không cần server.
                  </li>
                  <li>
                    <strong>Tầng 2 (Đang bật sẵn · 0đ)</strong>: Email Webhook (FormSubmit.co) tự động bắn đơn hàng mới về hộp thư <code>tinhkun102@gmail.com</code> (chỉ cần bấm Confirm 1 lần ở email đầu tiên).
                  </li>
                  <li>
                    <strong>Tầng 3 (Plug-and-Play PostgreSQL + Tự động xác nhận chuyển khoản)</strong>: Chạy sẵn file <code>supabase/schema.sql</code> trên Supabase Free Tier + triển khai <code>supabase/sepay_vietqr_webhook.ts</code> với SePay / PayOS, sau đó dán URL & Anon Key bên dưới.
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="sb-url" className="block text-xs font-semibold">
                    Supabase Project URL (Optional)
                  </label>
                  <input
                    id="sb-url"
                    type="url"
                    value={cloudCfg.url}
                    onChange={(e) => setCloudCfg({ ...cloudCfg, url: e.target.value })}
                    placeholder="https://xxxx.supabase.co"
                    className="input-studio mt-1.5 h-10 w-full rounded-xl px-3.5 font-mono-num text-xs"
                  />
                </div>
                <div>
                  <label htmlFor="sb-key" className="block text-xs font-semibold">
                    Supabase Anon Key (Optional)
                  </label>
                  <input
                    id="sb-key"
                    type="password"
                    value={cloudCfg.anonKey}
                    onChange={(e) => setCloudCfg({ ...cloudCfg, anonKey: e.target.value })}
                    placeholder="eyJhbGciOi..."
                    className="input-studio mt-1.5 h-10 w-full rounded-xl px-3.5 font-mono-num text-xs"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2.5 text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={cloudCfg.enableEmailWebhook}
                  onChange={(e) =>
                    setCloudCfg({ ...cloudCfg, enableEmailWebhook: e.target.checked })
                  }
                  className="h-4 w-4 accent-[var(--accent)]"
                />
                <span>
                  {locale === 'vi'
                    ? 'Tự động gửi thông báo đơn hàng mới về Email tinhkun102@gmail.com (0đ)'
                    : 'Auto-dispatch new orders to tinhkun102@gmail.com via free Email Webhook'}
                </span>
              </label>

              <button type="submit" className="btn-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold">
                <IconCheck className="h-4 w-4" />
                <span>{cloudSaved ? 'Đã Lưu Cấu Hình Cloud!' : 'Lưu Cấu Hình Đồng Bộ'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
