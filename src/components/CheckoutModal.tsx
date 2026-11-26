import React, { useEffect, useMemo, useState } from 'react';
import { generateOrderCode } from '../engines/cart';
import { formatMoney, STUDIO_CONTACT } from '../engines/catalog';
import {
  buildMailtoOrderUrl,
  buildZaloDirectUrl,
  createOrderSnapshot,
  generateOrderInvoiceMarkdown,
  getPaymentChannelLabel,
} from '../engines/invoice';
import type {
  CartItem,
  CartTotals,
  ClientOrderForm,
  Currency,
  Locale,
  OrderSnapshot,
  PaymentChannel,
} from '../engines/types';
import { copyToClipboard, downloadTextFile } from '../utils/download';
import {
  IconArrowUpRight,
  IconCheck,
  IconClose,
  IconCopy,
  IconCreditCard,
  IconDownload,
  IconGlobe,
  IconMail,
  IconPhone,
  IconQrCode,
  IconShield,
} from './Icons';

interface CheckoutModalProps {
  isOpen: boolean;
  items: CartItem[];
  totals: CartTotals;
  locale: Locale;
  currency: Currency;
  onClose: () => void;
  onOrderCompleted: (order: OrderSnapshot) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  items,
  totals,
  locale,
  currency,
  onClose,
  onOrderCompleted,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [orderCode, setOrderCode] = useState(() => generateOrderCode());
  const [paymentChannel, setPaymentChannel] = useState<PaymentChannel>('zalopay');
  const [client, setClient] = useState<ClientOrderForm>({
    fullName: '',
    phoneOrZalo: '',
    email: '',
    brandOrDomain: '',
    notes: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderSnapshot | null>(null);

  useEffect(() => {
    if (isOpen && step !== 3) {
      setOrderCode(generateOrderCode());
      setFormError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const dueAmountDisplay = useMemo(
    () => formatMoney(currency === 'VND' ? totals.payableNowVnd : totals.payableNowUsd, currency),
    [currency, totals.payableNowUsd, totals.payableNowVnd]
  );

  if (!isOpen) return null;

  const handleCopy = async (key: string, value: string) => {
    await copyToClipboard(value);
    setCopiedKey(key);
    window.setTimeout(() => {
      setCopiedKey((curr) => (curr === key ? null : curr));
    }, 1500);
  };

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client.fullName.trim() || !client.phoneOrZalo.trim() || !client.email.trim()) {
      setFormError(
        locale === 'vi'
          ? 'Vui lòng điền đầy đủ Họ tên, SĐT/Zalo và Email để nhận hợp đồng số.'
          : 'Please complete Full Name, Phone/Zalo, and Email to generate your contract receipt.'
      );
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email.trim())) {
      setFormError(
        locale === 'vi' ? 'Địa chỉ email chưa đúng định dạng.' : 'Please enter a valid email address.'
      );
      return;
    }
    setFormError(null);
    setStep(2);
  };

  const handleConfirmOrder = () => {
    const snapshot = createOrderSnapshot({
      orderCode,
      currency,
      paymentChannel,
      client,
      items,
      totals,
    });
    setConfirmedOrder(snapshot);
    setStep(3);
    onOrderCompleted(snapshot);
  };

  const handleCloseAll = () => {
    if (step === 3) {
      setStep(1);
      setConfirmedOrder(null);
    }
    onClose();
  };

  const stepLabels = [
    locale === 'vi' ? '1. Thông Tin & Brief' : '1. Client Brief',
    locale === 'vi' ? '2. Kênh Thanh Toán' : '2. Payment Channel',
    locale === 'vi' ? '3. Hợp Đồng Số' : '3. Digital Receipt',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="TVT Studio Checkout"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleCloseAll();
      }}
    >
      <div
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-strong)',
          boxShadow: 'var(--shadow-modal)',
        }}
      >
        {/* Top Modal Header + Stepper */}
        <div
          className="sticky top-0 z-10 border-b px-6 py-4 backdrop-blur-md"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-hairline)',
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="font-mono-num text-[11px] font-semibold uppercase" style={{ color: 'var(--accent)' }}>
                TVT STUDIO CHECKOUT · {confirmedOrder?.orderCode ?? orderCode}
              </span>
              <h2 className="font-display text-lg font-extrabold">
                {step === 1
                  ? locale === 'vi'
                    ? 'Thông Tin Khách Hàng & Brief Dự Án'
                    : 'Client Contact & Project Brief'
                  : step === 2
                    ? locale === 'vi'
                      ? 'Chọn Kênh Thanh Toán Trực Tiếp'
                      : 'Select Verified Payment Channel'
                    : locale === 'vi'
                      ? 'Đơn Hàng & Hợp Đồng Số Đã Sẵn Sàng'
                      : 'Order Confirmed & Digital Contract Ready'}
              </h2>
            </div>

            <button
              type="button"
              onClick={handleCloseAll}
              className="btn-ghost flex h-9 w-9 items-center justify-center rounded-lg"
              aria-label="Close checkout"
            >
              <IconClose className="h-4 w-4" />
            </button>
          </div>

          {/* 3-Step Indicator */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {stepLabels.map((label, idx) => {
              const s = (idx + 1) as 1 | 2 | 3;
              const active = step === s;
              const completed = step > s;
              return (
                <div
                  key={label}
                  className="rounded-lg border px-3 py-1.5 text-center text-[11px] font-semibold"
                  style={{
                    backgroundColor: active
                      ? 'var(--accent-soft)'
                      : completed
                        ? 'var(--emerald-soft)'
                        : 'var(--bg-elevated)',
                    borderColor: active
                      ? 'var(--accent)'
                      : completed
                        ? 'var(--emerald)'
                        : 'var(--border-hairline)',
                    color: active
                      ? 'var(--accent)'
                      : completed
                        ? 'var(--emerald)'
                        : 'var(--ink-muted)',
                  }}
                >
                  {label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* STEP 1: Client Contact & Project Brief */}
          {step === 1 && (
            <form onSubmit={handleStep1Next} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="chk-name" className="block text-xs font-semibold">
                    {locale === 'vi' ? 'Họ và tên *' : 'Full Name *'}
                  </label>
                  <input
                    id="chk-name"
                    type="text"
                    required
                    value={client.fullName}
                    onChange={(e) => setClient({ ...client, fullName: e.target.value })}
                    placeholder={locale === 'vi' ? 'Nguyễn Minh Anh' : 'Alex Nguyen'}
                    className="input-studio mt-1.5 h-10 w-full rounded-xl px-3.5 text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="chk-phone" className="block text-xs font-semibold">
                    {locale === 'vi' ? 'Số điện thoại / Zalo *' : 'Phone / Zalo *'}
                  </label>
                  <input
                    id="chk-phone"
                    type="tel"
                    required
                    value={client.phoneOrZalo}
                    onChange={(e) => setClient({ ...client, phoneOrZalo: e.target.value })}
                    placeholder="0909 123 456"
                    className="input-studio mt-1.5 h-10 w-full rounded-xl px-3.5 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="chk-email" className="block text-xs font-semibold">
                    Email *
                  </label>
                  <input
                    id="chk-email"
                    type="email"
                    required
                    value={client.email}
                    onChange={(e) => setClient({ ...client, email: e.target.value })}
                    placeholder="founder@company.vn"
                    className="input-studio mt-1.5 h-10 w-full rounded-xl px-3.5 text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="chk-domain" className="block text-xs font-semibold">
                    {locale === 'vi' ? 'Thương hiệu / Domain dự kiến' : 'Brand Name / Target Domain'}
                  </label>
                  <input
                    id="chk-domain"
                    type="text"
                    value={client.brandOrDomain}
                    onChange={(e) => setClient({ ...client, brandOrDomain: e.target.value })}
                    placeholder="thuonghieu.vn"
                    className="input-studio mt-1.5 h-10 w-full rounded-xl px-3.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="chk-notes" className="block text-xs font-semibold">
                  {locale === 'vi' ? 'Ghi chú yêu cầu kỹ thuật / Thời hạn mong muốn' : 'Project Notes / Target Launch Window'}
                </label>
                <textarea
                  id="chk-notes"
                  rows={3}
                  value={client.notes}
                  onChange={(e) => setClient({ ...client, notes: e.target.value })}
                  placeholder={
                    locale === 'vi'
                      ? 'Mô tả ngắn màu sắc thương hiệu, tích hợp thanh toán hoặc yêu cầu riêng...'
                      : 'Share brand palette, integrations, domain status, or target launch date...'
                  }
                  className="input-studio mt-1.5 w-full rounded-xl p-3.5 text-sm"
                />
              </div>

              {formError && (
                <p className="rounded-lg border px-3 py-2 text-xs font-semibold" style={{ borderColor: 'var(--accent)', color: 'var(--accent)', backgroundColor: 'var(--accent-soft)' }}>
                  {formError}
                </p>
              )}

              {/* Compact Order Bar */}
              <div
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-hairline)',
                }}
              >
                <div>
                  <span className="text-xs" style={{ color: 'var(--ink-secondary)' }}>
                    {totals.itemCount} {locale === 'vi' ? 'hạng mục' : 'items'} ·{' '}
                    {totals.paymentMode === 'deposit-30'
                      ? locale === 'vi'
                        ? 'Cọc khởi tạo 30%'
                        : '30% Kickoff Deposit'
                      : locale === 'vi'
                        ? 'Thanh toán 100%'
                        : '100% Settlement'}
                  </span>
                  <div className="font-mono-num text-lg font-extrabold" style={{ color: 'var(--accent)' }}>
                    {dueAmountDisplay}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
                  data-testid="checkout-step1-next"
                >
                  <span>{locale === 'vi' ? 'Tiếp Tục Chọn Thanh Toán' : 'Continue To Payment'}</span>
                  <IconArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: 3 Real Payment Channels */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Channel Selector Tabs */}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {(
                  [
                    {
                      id: 'zalopay' as PaymentChannel,
                      Icon: IconQrCode,
                      title: 'ZaloPay / QR',
                      sub: STUDIO_CONTACT.phoneDisplay,
                    },
                    {
                      id: 'momo' as PaymentChannel,
                      Icon: IconCreditCard,
                      title: locale === 'vi' ? 'Ví MoMo' : 'MoMo Wallet',
                      sub: STUDIO_CONTACT.phoneDisplay,
                    },
                    {
                      id: 'b2b-wire' as PaymentChannel,
                      Icon: IconGlobe,
                      title: 'B2B USD Invoice',
                      sub: 'Deel / Wise / Wire',
                    },
                  ] as const
                ).map(({ id, Icon, title, sub }) => {
                  const active = paymentChannel === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPaymentChannel(id)}
                      className="flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all"
                      style={{
                        backgroundColor: active ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                        borderColor: active ? 'var(--accent)' : 'var(--border-hairline)',
                      }}
                    >
                      <Icon className="h-5 w-5 shrink-0" style={{ color: active ? 'var(--accent)' : 'var(--ink-secondary)' }} />
                      <div>
                        <div className="text-xs font-bold">{title}</div>
                        <div className="font-mono-num text-[11px]" style={{ color: 'var(--ink-muted)' }}>
                          {sub}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Channel Detail Panel */}
              <div
                className="rounded-2xl border p-5"
                style={{
                  backgroundColor: 'var(--bg-canvas)',
                  borderColor: 'var(--border-hairline)',
                }}
              >
                {paymentChannel === 'zalopay' && (
                  <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-12">
                    <div className="flex flex-col items-center sm:col-span-5">
                      <div className="rounded-2xl bg-white p-3 shadow-md">
                        <img
                          src="./media/zalo_qr.jpg"
                          alt="Zalo QR Trương Văn Tình 0931 467 024"
                          className="h-48 w-48 rounded-lg object-contain"
                        />
                      </div>
                      <span className="font-mono-num mt-2 text-[11px]" style={{ color: 'var(--ink-muted)' }}>
                        {locale === 'vi' ? 'Quét bằng Zalo / ZaloPay' : 'Scan via Zalo / ZaloPay'}
                      </span>
                    </div>

                    <div className="space-y-3 sm:col-span-7">
                      <div>
                        <span className="font-mono-num text-[10px] uppercase" style={{ color: 'var(--accent)' }}>
                          {locale === 'vi' ? 'XÁC NHẬN TRỰC TIẾP VỚI KIẾN TRÚC SƯ' : 'DIRECT ARCHITECT VERIFICATION'}
                        </span>
                        <h3 className="text-sm font-bold sm:text-base">
                          ZaloPay / Zalo · {STUDIO_CONTACT.architectName}
                        </h3>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between rounded-lg border px-3 py-2" style={{ borderColor: 'var(--border-hairline)', backgroundColor: 'var(--bg-surface)' }}>
                          <div>
                            <div style={{ color: 'var(--ink-muted)' }}>{locale === 'vi' ? 'Hotline / ZaloPay' : 'Phone / ZaloPay'}</div>
                            <div className="font-mono-num font-bold">{STUDIO_CONTACT.phoneDisplay}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy('phone', STUDIO_CONTACT.phoneRaw)}
                            className="btn-ghost inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold"
                          >
                            {copiedKey === 'phone' ? <IconCheck className="h-3.5 w-3.5" /> : <IconCopy className="h-3.5 w-3.5" />}
                            <span>{copiedKey === 'phone' ? (locale === 'vi' ? 'Đã copy' : 'Copied') : 'Copy'}</span>
                          </button>
                        </div>

                        <div className="flex items-center justify-between rounded-lg border px-3 py-2" style={{ borderColor: 'var(--border-hairline)', backgroundColor: 'var(--bg-surface)' }}>
                          <div>
                            <div style={{ color: 'var(--ink-muted)' }}>{locale === 'vi' ? 'Nội dung chuyển khoản' : 'Transfer Memo'}</div>
                            <div className="font-mono-num font-bold" style={{ color: 'var(--accent)' }}>{orderCode}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy('memo', orderCode)}
                            className="btn-ghost inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold"
                          >
                            {copiedKey === 'memo' ? <IconCheck className="h-3.5 w-3.5" /> : <IconCopy className="h-3.5 w-3.5" />}
                            <span>{copiedKey === 'memo' ? (locale === 'vi' ? 'Đã copy' : 'Copied') : 'Copy'}</span>
                          </button>
                        </div>

                        <div className="flex items-center justify-between rounded-lg border px-3 py-2" style={{ borderColor: 'var(--border-hairline)', backgroundColor: 'var(--bg-surface)' }}>
                          <div>
                            <div style={{ color: 'var(--ink-muted)' }}>{locale === 'vi' ? 'Số tiền chính xác' : 'Exact Amount Due'}</div>
                            <div className="font-mono-num text-sm font-extrabold">
                              {formatMoney(totals.payableNowVnd, 'VND')} ({formatMoney(totals.payableNowUsd, 'USD')})
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy('amt', String(totals.payableNowVnd))}
                            className="btn-ghost inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold"
                          >
                            {copiedKey === 'amt' ? <IconCheck className="h-3.5 w-3.5" /> : <IconCopy className="h-3.5 w-3.5" />}
                            <span>{copiedKey === 'amt' ? (locale === 'vi' ? 'Đã copy' : 'Copied') : 'Copy'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentChannel === 'momo' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono-num text-[10px] uppercase" style={{ color: 'var(--accent)' }}>
                          MOMO WALLET INSTANT TRANSFER
                        </span>
                        <h3 className="text-base font-bold">
                          {locale === 'vi' ? 'Chuyển Qua Ví MoMo' : 'Transfer via MoMo Wallet'} — {STUDIO_CONTACT.architectName}
                        </h3>
                      </div>
                      <span className="font-mono-num rounded-lg px-2.5 py-1 text-xs font-bold" style={{ backgroundColor: 'var(--emerald-soft)', color: 'var(--emerald)' }}>
                        0% FEE
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="rounded-xl border p-3.5" style={{ borderColor: 'var(--border-hairline)', backgroundColor: 'var(--bg-surface)' }}>
                        <div className="text-[11px]" style={{ color: 'var(--ink-muted)' }}>{locale === 'vi' ? 'SĐT Nhận MoMo' : 'MoMo Phone'}</div>
                        <div className="font-mono-num mt-1 text-sm font-bold">{STUDIO_CONTACT.phoneDisplay}</div>
                        <button
                          type="button"
                          onClick={() => handleCopy('momo-phone', STUDIO_CONTACT.phoneRaw)}
                          className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold"
                          style={{ color: 'var(--accent)' }}
                        >
                          <IconCopy className="h-3 w-3" />
                          {copiedKey === 'momo-phone' ? (locale === 'vi' ? 'Đã sao chép' : 'Copied') : 'Copy SĐT'}
                        </button>
                      </div>

                      <div className="rounded-xl border p-3.5" style={{ borderColor: 'var(--border-hairline)', backgroundColor: 'var(--bg-surface)' }}>
                        <div className="text-[11px]" style={{ color: 'var(--ink-muted)' }}>{locale === 'vi' ? 'Lời nhắn chuyển tiền' : 'Transfer Memo'}</div>
                        <div className="font-mono-num mt-1 text-sm font-bold" style={{ color: 'var(--accent)' }}>{orderCode}</div>
                        <button
                          type="button"
                          onClick={() => handleCopy('momo-memo', orderCode)}
                          className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold"
                          style={{ color: 'var(--accent)' }}
                        >
                          <IconCopy className="h-3 w-3" />
                          {copiedKey === 'momo-memo' ? (locale === 'vi' ? 'Đã sao chép' : 'Copied') : 'Copy Memo'}
                        </button>
                      </div>

                      <div className="rounded-xl border p-3.5" style={{ borderColor: 'var(--border-hairline)', backgroundColor: 'var(--bg-surface)' }}>
                        <div className="text-[11px]" style={{ color: 'var(--ink-muted)' }}>{locale === 'vi' ? 'Số tiền cần chuyển' : 'Exact Amount'}</div>
                        <div className="font-mono-num mt-1 text-sm font-bold">{formatMoney(totals.payableNowVnd, 'VND')}</div>
                        <button
                          type="button"
                          onClick={() => handleCopy('momo-amt', String(totals.payableNowVnd))}
                          className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold"
                          style={{ color: 'var(--accent)' }}
                        >
                          <IconCopy className="h-3 w-3" />
                          {copiedKey === 'momo-amt' ? (locale === 'vi' ? 'Đã sao chép' : 'Copied') : 'Copy Số Tiền'}
                        </button>
                      </div>
                    </div>

                    <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
                      {locale === 'vi'
                        ? 'Sau khi chuyển khoản MoMo kèm nội dung trên, bấm "Xác Nhận Đã Tạo Đơn" để nhận Biên Nhận & Hợp Đồng Số và gửi xác nhận 1 chạm qua Zalo.'
                        : 'After sending via MoMo with the reference memo above, click Confirm Order below to download your digital contract receipt and notify via Zalo.'}
                    </p>
                  </div>
                )}

                {paymentChannel === 'b2b-wire' && (
                  <div className="space-y-4">
                    <div>
                      <span className="font-mono-num text-[10px] uppercase" style={{ color: 'var(--cyan)' }}>
                        GLOBAL CONTRACTOR BILLING · USD
                      </span>
                      <h3 className="text-base font-bold">
                        {locale === 'vi'
                          ? 'Hóa Đơn Doanh Nghiệp Quốc Tế (Deel / Wise / Wire USD)'
                          : 'International B2B Contractor Invoice (Deel / Wise / Wire USD)'}
                      </h3>
                    </div>

                    <p className="text-xs leading-relaxed sm:text-sm" style={{ color: 'var(--ink-secondary)' }}>
                      {locale === 'vi'
                        ? 'Hỗ trợ ký hợp đồng dịch vụ B2B / Freelance Contractor quốc tế qua Deel, Wise Business hoặc chuyển khoản Wire USD — không phát sinh chi phí payroll hay thủ tục thuế phức tạp cho doanh nghiệp.'
                        : 'Formal B2B contractor invoicing via Deel, Wise Business, or USD Wire Transfer — zero payroll or tax compliance overhead for US/EU/APAC engineering teams.'}
                    </p>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border p-3.5" style={{ borderColor: 'var(--border-hairline)', backgroundColor: 'var(--bg-surface)' }}>
                        <div className="text-[11px]" style={{ color: 'var(--ink-muted)' }}>Billing Contact</div>
                        <div className="font-mono-num mt-1 text-sm font-bold">{STUDIO_CONTACT.email}</div>
                      </div>
                      <div className="rounded-xl border p-3.5" style={{ borderColor: 'var(--border-hairline)', backgroundColor: 'var(--bg-surface)' }}>
                        <div className="text-[11px]" style={{ color: 'var(--ink-muted)' }}>USD Settlement Amount</div>
                        <div className="font-mono-num mt-1 text-sm font-bold" style={{ color: 'var(--accent)' }}>
                          {formatMoney(totals.payableNowUsd, 'USD')} ({orderCode})
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border p-3.5 text-xs" style={{ borderColor: 'var(--border-hairline)', backgroundColor: 'var(--bg-elevated)', color: 'var(--ink-secondary)' }}>
                <IconShield className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--emerald)' }} />
                <span>
                  {locale === 'vi'
                    ? 'Cam kết minh bạch: Đơn hàng chỉ khóa lịch triển khai sau khi Trương Văn Tình xác nhận trực tiếp qua Zalo/Email trong vòng 15 phút giờ làm việc.'
                    : 'Transparency pledge: Project kickoff begins immediately once Truong Van Tinh confirms receipt directly via Zalo or Email (typically within 15 minutes).'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-ghost rounded-xl px-4 py-3 text-xs font-semibold sm:text-sm"
                >
                  {locale === 'vi' ? '← Quay Lại Brief' : '← Back To Brief'}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmOrder}
                  className="btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
                  data-testid="checkout-confirm-order"
                >
                  <IconCheck className="h-4 w-4" />
                  <span>{locale === 'vi' ? 'Xác Nhận & Tạo Hợp Đồng Số' : 'Confirm & Issue Receipt'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Order Confirmation & Digital Contract Receipt */}
          {step === 3 && confirmedOrder && (
            <div className="space-y-5">
              <div
                className="flex items-start gap-3.5 rounded-2xl border p-4"
                style={{
                  backgroundColor: 'var(--emerald-soft)',
                  borderColor: 'var(--emerald)',
                }}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/20" style={{ color: 'var(--emerald)' }}>
                  <IconCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold sm:text-base" style={{ color: 'var(--ink-primary)' }}>
                    {locale === 'vi'
                      ? `Đã Khởi Tạo Đơn Hàng ${confirmedOrder.orderCode}`
                      : `Order ${confirmedOrder.orderCode} Created Successfully`}
                  </h3>
                  <p className="mt-0.5 text-xs" style={{ color: 'var(--ink-secondary)' }}>
                    {getPaymentChannelLabel(confirmedOrder.paymentChannel, locale)}
                  </p>
                </div>
              </div>

              {/* Itemized Receipt Card */}
              <div
                className="rounded-2xl border p-5"
                style={{
                  backgroundColor: 'var(--bg-canvas)',
                  borderColor: 'var(--border-hairline)',
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3" style={{ borderColor: 'var(--border-hairline)' }}>
                  <div>
                    <div className="text-xs font-bold">{confirmedOrder.client.fullName}</div>
                    <div className="font-mono-num text-[11px]" style={{ color: 'var(--ink-muted)' }}>
                      {confirmedOrder.client.phoneOrZalo} · {confirmedOrder.client.email}
                    </div>
                  </div>
                  <span className="font-mono-num rounded-md px-2.5 py-1 text-xs font-bold" style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}>
                    {confirmedOrder.orderCode}
                  </span>
                </div>

                <ul className="mt-3 divide-y" style={{ borderColor: 'var(--border-hairline)' }}>
                  {confirmedOrder.items.map((item) => (
                    <li key={item.cartKey} className="flex items-center justify-between py-2.5 text-xs">
                      <div>
                        <span className="font-semibold">
                          {item.kind === 'template' ? item.title : item.title[locale]}
                        </span>{' '}
                        <span style={{ color: 'var(--ink-muted)' }}>x{item.quantity}</span>
                      </div>
                      <span className="font-mono-num font-bold">
                        {formatMoney(
                          (currency === 'VND' ? item.unitVnd : item.unitUsd) * item.quantity,
                          currency
                        )}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 space-y-1.5 border-t pt-3 text-xs" style={{ borderColor: 'var(--border-hairline)' }}>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--ink-secondary)' }}>{locale === 'vi' ? 'Tổng hợp đồng' : 'Net contract value'}</span>
                    <span className="font-mono-num font-bold">
                      {formatMoney(
                        currency === 'VND' ? confirmedOrder.totals.netTotalVnd : confirmedOrder.totals.netTotalUsd,
                        currency
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold" style={{ color: 'var(--accent)' }}>
                    <span>{locale === 'vi' ? 'Số tiền thanh toán đợt này' : 'Amount Due Now'}</span>
                    <span className="font-mono-num">
                      {formatMoney(
                        currency === 'VND'
                          ? confirmedOrder.totals.payableNowVnd
                          : confirmedOrder.totals.payableNowUsd,
                        currency
                      )}
                    </span>
                  </div>
                </div>

                {/* Milestone Checklist */}
                <div className="mt-4 border-t pt-3" style={{ borderColor: 'var(--border-hairline)' }}>
                  <div className="text-[11px] font-bold uppercase" style={{ color: 'var(--ink-muted)' }}>
                    {locale === 'vi' ? 'Lộ Trình Nghiệm Thu' : 'Milestone Schedule'}
                  </div>
                  <div className="mt-2 space-y-1.5">
                    {confirmedOrder.milestones.map((m) => (
                      <div key={m.stage} className="flex items-center justify-between text-xs">
                        <span style={{ color: 'var(--ink-secondary)' }}>{m.label[locale]}</span>
                        <span className="font-mono-num font-semibold">
                          {formatMoney(currency === 'VND' ? m.amountVnd : m.amountUsd, currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3 Real Export & Confirmation Channels */}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => {
                    const md = generateOrderInvoiceMarkdown(confirmedOrder, locale);
                    downloadTextFile(`${confirmedOrder.orderCode}-TVT-Studio-Receipt.md`, md);
                  }}
                  className="btn-secondary inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-3 text-xs font-semibold"
                  data-testid="export-invoice-md-btn"
                >
                  <IconDownload className="h-4 w-4" />
                  <span>{locale === 'vi' ? 'Tải Hợp Đồng (.md)' : 'Export Receipt (.md)'}</span>
                </button>

                <a
                  href={buildMailtoOrderUrl(confirmedOrder, locale)}
                  className="btn-secondary inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-3 text-xs font-semibold"
                >
                  <IconMail className="h-4 w-4" />
                  <span>{locale === 'vi' ? 'Gửi Đơn Qua Email' : 'Send Via Email'}</span>
                </a>

                <a
                  href={buildZaloDirectUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-3 text-xs font-semibold"
                >
                  <IconPhone className="h-4 w-4" />
                  <span>{locale === 'vi' ? 'Xác Nhận Qua Zalo' : 'Confirm On Zalo'}</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
