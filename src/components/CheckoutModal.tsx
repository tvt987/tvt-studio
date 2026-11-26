import React, { useEffect, useMemo, useRef, useState } from 'react';
import { generateOrderCode } from '../engines/cart';
import { formatMoney, STUDIO_CONTACT } from '../engines/catalog';
import {
  buildMailtoOrderUrl,
  buildZaloDirectUrl,
  createOrderSnapshot,
  generateOrderInvoiceMarkdown,
  getPaymentChannelLabel,
} from '../engines/invoice';
import {
  dispatchOrderToCloud,
  isCloudRealtimeConfigured,
  pollOrderCloudPaymentStatus,
  subscribeRealtimePaymentVerified,
} from '../engines/orderLedger';
import {
  buildVietQrImageUrl,
  formatBankSafeMemo,
  isValidBankVietQrConfig,
} from '../engines/vietqr';
import type {
  BankVietQrConfig,
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
  IconClock,
  IconClose,
  IconCopy,
  IconCreditCard,
  IconDownload,
  IconGlobe,
  IconMail,
  IconPhone,
  IconQrCode,
  IconSearch,
  IconShield,
} from './Icons';

interface CheckoutModalProps {
  isOpen: boolean;
  items: CartItem[];
  totals: CartTotals;
  locale: Locale;
  currency: Currency;
  bankConfig: BankVietQrConfig | null;
  onClose: () => void;
  onOrderCompleted: (order: OrderSnapshot) => void;
  onAutoVerifiedPayment: (orderCode: string, paymentRef: string, paidAmountVnd: number) => void;
  onOpenTracker: (orderCode: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  items,
  totals,
  locale,
  currency,
  bankConfig,
  onClose,
  onOrderCompleted,
  onAutoVerifiedPayment,
  onOpenTracker,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [orderCode, setOrderCode] = useState(() => generateOrderCode());
  const [paymentChannel, setPaymentChannel] = useState<PaymentChannel>('consult-first');
  const [paymentRef, setPaymentRef] = useState('');
  const [submitting, setSubmitting] = useState(false);
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
  const scrollShellRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen && scrollShellRef.current) {
      scrollShellRef.current.scrollTo({ top: 0 });
    }
  }, [isOpen, step]);

  useEffect(() => {
    if (isOpen && step !== 3) {
      setOrderCode(generateOrderCode());
      setPaymentRef('');
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

  const hasLiveBankQr = isValidBankVietQrConfig(bankConfig);
  const bankSafeMemo = useMemo(() => formatBankSafeMemo(orderCode), [orderCode]);
  const liveVietQrUrl = useMemo(() => {
    if (!hasLiveBankQr || !bankConfig) return null;
    return buildVietQrImageUrl(bankConfig, totals.payableNowVnd, bankSafeMemo);
  }, [bankConfig, bankSafeMemo, hasLiveBankQr, totals.payableNowVnd]);

  // Real-time auto-verification listener (Supabase non-PII RPC 3s poll + BroadcastChannel)
  useEffect(() => {
    if (!isOpen || step !== 3 || !confirmedOrder) return;
    if (confirmedOrder.paymentChannel === 'consult-first') return;
    if (confirmedOrder.status === 'DEPOSIT_VERIFIED' || confirmedOrder.status === 'DELIVERED') return;

    const targetCode = confirmedOrder.orderCode;
    const applyVerified = (ref: string, paidAmount: number) => {
      setConfirmedOrder((prev) =>
        prev && prev.orderCode === targetCode
          ? { ...prev, status: 'DEPOSIT_VERIFIED', paymentRef: ref }
          : prev
      );
      onAutoVerifiedPayment(targetCode, ref, paidAmount);
    };

    const unsub = subscribeRealtimePaymentVerified((ev) => {
      if (ev.orderCode === targetCode && ev.status === 'DEPOSIT_VERIFIED') {
        applyVerified(ev.paymentRef, ev.paidAmountVnd);
      }
    });

    const cloudEnabled = isCloudRealtimeConfigured();
    let timer: number | null = null;
    if (cloudEnabled) {
      const checkNow = async () => {
        const res = await pollOrderCloudPaymentStatus(targetCode);
        if (res && (res.status === 'DEPOSIT_VERIFIED' || res.status === 'DELIVERED')) {
          applyVerified(res.paymentRef, res.paidAmountVnd);
        }
      };
      void checkNow();
      timer = window.setInterval(() => {
        void checkNow();
      }, 3000);
    }

    return () => {
      unsub();
      if (timer !== null) window.clearInterval(timer);
    };
  }, [confirmedOrder, isOpen, onAutoVerifiedPayment, step]);

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

  const handleConfirmOrder = async () => {
    if (submitting) return;
    setSubmitting(true);
    const snapshot = createOrderSnapshot({
      orderCode,
      currency,
      paymentChannel,
      client,
      items,
      totals,
      paymentRef: paymentChannel === 'consult-first' ? undefined : paymentRef.trim() || undefined,
    });
    const syncState = await dispatchOrderToCloud(snapshot, locale);
    const persistedSnapshot: OrderSnapshot = { ...snapshot, syncState };
    setConfirmedOrder(persistedSnapshot);
    setStep(3);
    setSubmitting(false);
    onOrderCompleted(persistedSnapshot);
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
    locale === 'vi' ? '2. Chọn Cách Thanh Toán' : '2. Payment Channel',
    locale === 'vi' ? '3. Lưu Đơn & Hợp Đồng' : '3. Receipt & Tracking',
  ];

  const channelOptions = [
    {
      id: 'consult-first' as PaymentChannel,
      Icon: IconShield,
      title: locale === 'vi' ? 'Tư Vấn Trước' : 'Consult First',
      sub: locale === 'vi' ? '0₫ cọc trước' : '$0 upfront',
    },
    {
      id: 'vietqr' as PaymentChannel,
      Icon: IconQrCode,
      title: 'VietQR 24/7',
      sub: hasLiveBankQr && bankConfig ? bankConfig.bankShortName : locale === 'vi' ? 'Ngân hàng VN' : 'VN Bank QR',
    },
    {
      id: 'zalopay' as PaymentChannel,
      Icon: IconPhone,
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
      title: 'B2B USD',
      sub: 'Deel / Wise',
    },
  ];

  const postPaymentSteps = [
    {
      time: 'T+0',
      text:
        locale === 'vi'
          ? 'Đơn hàng đã lưu bền vững vào Tra Cứu Đơn Hàng (IndexedDB) & sẵn sàng in PDF A4.'
          : 'Order persisted in Order Tracker (IndexedDB) with printable A4 PDF invoice.',
    },
    {
      time: 'T+15m',
      text:
        locale === 'vi'
          ? 'Trương Văn Tình xác nhận trực tiếp qua Zalo 0931 467 024 / Email & khóa lịch làm việc.'
          : 'Truong Van Tinh confirms directly via Zalo 0931 467 024 / Email and locks kickoff.',
    },
    {
      time: locale === 'vi' ? 'Ngày 1–5' : 'Days 1–5',
      text:
        locale === 'vi'
          ? 'Gửi link Staging chạy thật để bạn kiểm tra & yêu cầu tinh chỉnh cho đúng ý.'
          : 'Live Staging link delivered for interactive QA and custom brand refinements.',
    },
    {
      time: 'Go-Live+',
      text:
        locale === 'vi'
          ? 'Gắn tên miền riêng + SSL, bàn giao source sạch & hỗ trợ xuyên suốt khi sử dụng.'
          : 'Custom domain + SSL launch, clean source handover, and ongoing usage support.',
    },
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
        ref={scrollShellRef}
        className="printable-invoice-shell max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-strong)',
          boxShadow: 'var(--shadow-modal)',
        }}
      >
        {/* Top Modal Header + Stepper */}
        <div
          className="no-print sticky top-0 z-10 border-b px-6 py-4 backdrop-blur-md"
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
                      ? 'Chọn Hình Thức Thanh Toán Hoặc Tư Vấn Trước'
                      : 'Choose Payment Channel Or Consult First'
                    : locale === 'vi'
                      ? 'Đã Lưu Đơn Hàng & Hợp Đồng Số'
                      : 'Order Saved & Digital Contract Issued'}
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
                  className="rounded-lg border px-2.5 py-1.5 text-center text-[11px] font-semibold"
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
                  {locale === 'vi'
                    ? 'Yêu cầu tinh chỉnh / Ngôn ngữ lập trình / Thời hạn mong muốn'
                    : 'Custom Refinements / Preferred Tech Stack / Target Launch'}
                </label>
                <textarea
                  id="chk-notes"
                  rows={3}
                  value={client.notes}
                  onChange={(e) => setClient({ ...client, notes: e.target.value })}
                  placeholder={
                    locale === 'vi'
                      ? 'Mô tả màu sắc thương hiệu, tính năng cần tinh chỉnh thêm, hoặc ngôn ngữ bạn muốn code...'
                      : 'Share brand palette, desired refinements, preferred tech stack, or target launch date...'
                  }
                  className="input-studio mt-1.5 w-full rounded-xl p-3.5 text-sm"
                />
              </div>

              {formError && (
                <p
                  className="rounded-lg border px-3 py-2 text-xs font-semibold"
                  style={{
                    borderColor: 'var(--accent)',
                    color: 'var(--accent)',
                    backgroundColor: 'var(--accent-soft)',
                  }}
                >
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
                        ? 'Cọc khởi tạo 30% (Hoặc 0₫ tư vấn trước)'
                        : '30% Kickoff Deposit (Or $0 Consult First)'
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

          {/* STEP 2: 5 Payment Channels (Incl. Consult-First $0 & Dynamic VietQR) */}
          {step === 2 && (
            <div className="space-y-5">
              {/* 5 Channel Selector Tabs */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {channelOptions.map(({ id, Icon, title, sub }) => {
                  const active = paymentChannel === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPaymentChannel(id)}
                      data-testid={`channel-${id}`}
                      className="flex flex-col items-start gap-1.5 rounded-xl border p-3 text-left transition-all"
                      style={{
                        backgroundColor: active ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                        borderColor: active ? 'var(--accent)' : 'var(--border-hairline)',
                      }}
                    >
                      <Icon
                        className="h-4 w-4 shrink-0"
                        style={{ color: active ? 'var(--accent)' : 'var(--ink-secondary)' }}
                      />
                      <div className="min-w-0">
                        <div className="truncate text-xs font-bold">{title}</div>
                        <div className="font-mono-num truncate text-[10px]" style={{ color: 'var(--ink-muted)' }}>
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
                {paymentChannel === 'consult-first' && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="font-mono-num text-[10px] font-bold uppercase" style={{ color: 'var(--emerald)' }}>
                          {locale === 'vi' ? 'AN TOÀN TUYỆT ĐỐI · 0₫ CỌC TRƯỚC' : 'ZERO RISK · $0 UPFRONT'}
                        </span>
                        <h3 className="mt-0.5 text-base font-bold">
                          {locale === 'vi'
                            ? 'Chốt Lịch Tư Vấn & Thương Lượng Trước Khi Thanh Toán'
                            : 'Lock Consultation & Scope Agreement Before Paying'}
                        </h3>
                      </div>
                      <span
                        className="font-mono-num rounded-lg px-2.5 py-1 text-xs font-bold"
                        style={{ backgroundColor: 'var(--emerald-soft)', color: 'var(--emerald)' }}
                      >
                        0₫ TODAY
                      </span>
                    </div>

                    <p className="text-xs leading-relaxed sm:text-sm" style={{ color: 'var(--ink-secondary)' }}>
                      {locale === 'vi'
                        ? 'Bạn chưa cần chuyển khoản ngay. Hệ thống sẽ tạo mã đơn hàng TVT-ORD-XXXX, lưu lại toàn bộ cấu hình đã chọn, xuất hợp đồng nháp A4 và gửi thông báo về cho Trương Văn Tình. Hai bên trao đổi thống nhất 100% tính năng, ngôn ngữ lập trình và giá thương lượng qua Zalo trước khi đặt cọc 30%.'
                        : 'No upfront payment needed today. Your order code TVT-ORD-XXXX is saved with your selected items and printable draft brief. We align 100% on scope, stack, and pricing via Zalo before starting the 30% deposit.'}
                    </p>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border p-3.5 text-xs" style={{ borderColor: 'var(--border-hairline)', backgroundColor: 'var(--bg-surface)' }}>
                        <div style={{ color: 'var(--ink-muted)' }}>{locale === 'vi' ? 'Mã đơn lưu giữ' : 'Reserved Order Code'}</div>
                        <div className="font-mono-num mt-1 text-sm font-bold" style={{ color: 'var(--accent)' }}>
                          {orderCode}
                        </div>
                      </div>
                      <div className="rounded-xl border p-3.5 text-xs" style={{ borderColor: 'var(--border-hairline)', backgroundColor: 'var(--bg-surface)' }}>
                        <div style={{ color: 'var(--ink-muted)' }}>{locale === 'vi' ? 'Thời gian phản hồi Zalo' : 'Direct Zalo Response'}</div>
                        <div className="font-mono-num mt-1 text-sm font-bold" style={{ color: 'var(--emerald)' }}>
                          {locale === 'vi' ? 'Trong 15 phút (08:00–22:00)' : 'Within 15 min (08:00–22:00 ICT)'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentChannel === 'vietqr' && (
                  <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-12">
                    <div className="flex flex-col items-center sm:col-span-5">
                      <div className="rounded-2xl bg-white p-3 shadow-md">
                        <img
                          src={liveVietQrUrl ?? './media/zalo_qr.jpg'}
                          alt={
                            liveVietQrUrl
                              ? `VietQR ${orderCode}`
                              : 'Zalo QR Trương Văn Tình 0931 467 024'
                          }
                          className="h-48 w-48 rounded-lg object-contain"
                        />
                      </div>
                      <span className="font-mono-num mt-2 text-center text-[11px]" style={{ color: liveVietQrUrl ? 'var(--emerald)' : 'var(--ink-muted)' }}>
                        {liveVietQrUrl
                          ? locale === 'vi'
                            ? 'Quét bằng App Ngân Hàng (Tự điền tiền & mã đơn)'
                            : 'Scan with any VN Banking App (Auto-filled)'
                          : locale === 'vi'
                            ? 'Quét Zalo nhận STK Ngân Hàng chính chủ'
                            : 'Scan Zalo to receive verified Bank VietQR'}
                      </span>
                    </div>

                    <div className="space-y-3 sm:col-span-7">
                      <div>
                        <span className="font-mono-num text-[10px] uppercase" style={{ color: 'var(--accent)' }}>
                          {hasLiveBankQr ? 'NAPAS VIETQR 24/7 AUTO-FILLED' : 'VERIFIED BANK TRANSFER VIA ARCHITECT'}
                        </span>
                        <h3 className="text-sm font-bold sm:text-base">
                          {hasLiveBankQr && bankConfig
                            ? `${bankConfig.bankShortName} · ${bankConfig.accountName}`
                            : `${locale === 'vi' ? 'Chuyển Khoản Ngân Hàng 24/7' : '24/7 Bank Transfer'} · ${STUDIO_CONTACT.architectName}`}
                        </h3>
                      </div>

                      {!hasLiveBankQr && (
                        <p className="rounded-lg border p-2.5 text-xs leading-relaxed" style={{ borderColor: 'var(--border-hairline)', backgroundColor: 'var(--bg-surface)', color: 'var(--ink-secondary)' }}>
                          {locale === 'vi'
                            ? 'Để bảo mật STK cá nhân khỏi spam công khai, bấm "Xác Nhận & Lưu Đơn" bên dưới rồi nhắn mã đơn qua Zalo 0931 467 024 — Tình gửi ngay ảnh VietQR ngân hàng chính chủ tự điền đúng số tiền trong 2 phút (hoặc chuyển trực tiếp qua tab ZaloPay / MoMo).'
                            : 'To protect personal bank details from public scrapers, confirm your order below and message your code on Zalo 0931 467 024 to receive the exact VietQR image within 2 minutes.'}
                        </p>
                      )}

                      <div className="space-y-2 text-xs">
                        {hasLiveBankQr && bankConfig && (
                          <div className="flex items-center justify-between rounded-lg border px-3 py-2" style={{ borderColor: 'var(--border-hairline)', backgroundColor: 'var(--bg-surface)' }}>
                            <div>
                              <div style={{ color: 'var(--ink-muted)' }}>{bankConfig.bankShortName}</div>
                              <div className="font-mono-num font-bold">{bankConfig.accountNumber}</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopy('bank-acct', bankConfig.accountNumber)}
                              className="btn-ghost inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold"
                            >
                              {copiedKey === 'bank-acct' ? <IconCheck className="h-3.5 w-3.5" /> : <IconCopy className="h-3.5 w-3.5" />}
                              <span>{copiedKey === 'bank-acct' ? 'Đã copy' : 'Copy'}</span>
                            </button>
                          </div>
                        )}

                        <div className="flex items-center justify-between rounded-lg border px-3 py-2" style={{ borderColor: 'var(--border-hairline)', backgroundColor: 'var(--bg-surface)' }}>
                          <div>
                            <div style={{ color: 'var(--ink-muted)' }}>{locale === 'vi' ? 'Nội dung chuyển khoản (Chuẩn VietQR)' : 'Transfer Memo (Bank-Safe)'}</div>
                            <div className="font-mono-num font-bold" style={{ color: 'var(--accent)' }}>{bankSafeMemo}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy('vqr-memo', bankSafeMemo)}
                            className="btn-ghost inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold"
                          >
                            {copiedKey === 'vqr-memo' ? <IconCheck className="h-3.5 w-3.5" /> : <IconCopy className="h-3.5 w-3.5" />}
                            <span>{copiedKey === 'vqr-memo' ? 'Đã copy' : 'Copy'}</span>
                          </button>
                        </div>

                        <div className="flex items-center justify-between rounded-lg border px-3 py-2" style={{ borderColor: 'var(--border-hairline)', backgroundColor: 'var(--bg-surface)' }}>
                          <div>
                            <div style={{ color: 'var(--ink-muted)' }}>{locale === 'vi' ? 'Số tiền chính xác' : 'Exact Amount'}</div>
                            <div className="font-mono-num text-sm font-extrabold">
                              {formatMoney(totals.payableNowVnd, 'VND')} ({formatMoney(totals.payableNowUsd, 'USD')})
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy('vqr-amt', String(totals.payableNowVnd))}
                            className="btn-ghost inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold"
                          >
                            {copiedKey === 'vqr-amt' ? <IconCheck className="h-3.5 w-3.5" /> : <IconCopy className="h-3.5 w-3.5" />}
                            <span>{copiedKey === 'vqr-amt' ? 'Đã copy' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

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
                        ? 'Hỗ trợ ký hợp đồng dịch vụ B2B / Freelance Contractor quốc tế qua Deel, Wise Business hoặc chuyển khoản Wire USD — không phát sinh thủ tục thuế phức tạp cho doanh nghiệp.'
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

                {/* Optional Transfer Proof Input for Direct Payment Channels */}
                {paymentChannel !== 'consult-first' && (
                  <div className="mt-4 border-t pt-4" style={{ borderColor: 'var(--border-hairline)' }}>
                    <label htmlFor="chk-payment-ref" className="block text-xs font-semibold">
                      {locale === 'vi'
                        ? 'Mã giao dịch ngân hàng / MoMo / ZaloPay (Tùy chọn — có thể điền sau trong Tra Cứu Đơn Hàng)'
                        : 'Transfer Reference ID (Optional — or attach later in Order Tracker)'}
                    </label>
                    <input
                      id="chk-payment-ref"
                      type="text"
                      value={paymentRef}
                      onChange={(e) => setPaymentRef(e.target.value)}
                      placeholder="VD: FT2633012984 hoặc MOMO-88412"
                      className="input-studio mt-1.5 h-10 w-full rounded-xl px-3.5 font-mono-num text-xs"
                      data-testid="checkout-payment-ref"
                    />
                  </div>
                )}
              </div>

              <div
                className="flex items-start gap-2.5 rounded-xl border p-3.5 text-xs"
                style={{
                  borderColor: 'var(--border-hairline)',
                  backgroundColor: 'var(--bg-elevated)',
                  color: 'var(--ink-secondary)',
                }}
              >
                <IconShield className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--emerald)' }} />
                <span>
                  {locale === 'vi'
                    ? 'Đơn hàng được lưu bền vững vào Tra Cứu Đơn Hàng (IndexedDB) + gửi thông báo tức thì về hệ thống của Trương Văn Tình. Mọi điều chỉnh & hỗ trợ sử dụng đều được xác nhận trực tiếp.'
                    : 'Your order persists immediately in Order Tracker (IndexedDB) and dispatches a live alert to Truong Van Tinh.'}
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
                  disabled={submitting}
                  onClick={handleConfirmOrder}
                  className="btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold disabled:opacity-60"
                  data-testid="checkout-confirm-order"
                >
                  <IconCheck className="h-4 w-4" />
                  <span>
                    {submitting
                      ? locale === 'vi'
                        ? 'Đang Lưu Đơn...'
                        : 'Saving Order...'
                      : paymentChannel === 'consult-first'
                        ? locale === 'vi'
                          ? 'Xác Nhận Đặt Lịch Tư Vấn (0₫)'
                          : 'Confirm $0 Consultation Booking'
                        : locale === 'vi'
                          ? 'Xác Nhận & Lưu Hợp Đồng Số'
                          : 'Confirm & Save Contract'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Persisted Order Confirmation, Printable A4 Receipt & Post-Payment Journey */}
          {step === 3 && confirmedOrder && (
            <div className="space-y-5">
              <div
                className="no-print flex flex-wrap items-start justify-between gap-3 rounded-2xl border p-4"
                style={{
                  backgroundColor: 'var(--emerald-soft)',
                  borderColor: 'var(--emerald)',
                }}
                data-testid={
                  confirmedOrder.status === 'DEPOSIT_VERIFIED'
                    ? 'realtime-paid-banner'
                    : 'checkout-saved-banner'
                }
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/20" style={{ color: 'var(--emerald)' }}>
                    <IconCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold sm:text-base" style={{ color: 'var(--ink-primary)' }}>
                      {confirmedOrder.status === 'DEPOSIT_VERIFIED'
                        ? locale === 'vi'
                          ? `ĐÃ THANH TOÁN THÀNH CÔNG · ${confirmedOrder.orderCode} (AUTO-VERIFIED)`
                          : `PAYMENT VERIFIED REAL-TIME · ${confirmedOrder.orderCode}`
                        : locale === 'vi'
                          ? `Đã Lưu Đơn Hàng ${confirmedOrder.orderCode}`
                          : `Order ${confirmedOrder.orderCode} Saved Successfully`}
                    </h3>
                    <p className="mt-0.5 text-xs" style={{ color: 'var(--ink-secondary)' }}>
                      {confirmedOrder.status === 'DEPOSIT_VERIFIED'
                        ? locale === 'vi'
                          ? 'Hệ thống đã tự động xác nhận tiền vào tài khoản & đẩy thông báo Telegram cho Trương Văn Tình.'
                          : 'Inbound transfer auto-verified via real-time webhook & instant owner alert dispatched.'
                        : getPaymentChannelLabel(confirmedOrder.paymentChannel, locale)}
                    </p>
                  </div>
                </div>
                <span
                  className="font-mono-num rounded-lg border px-2.5 py-1 text-[10px] font-bold"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--emerald)',
                    color: 'var(--emerald)',
                  }}
                >
                  {confirmedOrder.status === 'DEPOSIT_VERIFIED'
                    ? 'PAID · AUTO-VERIFIED'
                    : confirmedOrder.syncState === 'supabase_synced'
                      ? 'DB: SUPABASE + IDB'
                      : confirmedOrder.syncState === 'email_webhook_sent'
                        ? 'EMAIL ALERT + IDB SAVED'
                        : 'INDEXEDDB SAVED'}
                </span>
              </div>

              {/* Real-Time Auto-Verify Payment Radar (Visible while awaiting bank transfer) */}
              {confirmedOrder.paymentChannel !== 'consult-first' &&
                confirmedOrder.status !== 'DEPOSIT_VERIFIED' && (
                  <div
                    className="no-print flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-xs"
                    style={{
                      backgroundColor: 'var(--cyan-soft)',
                      borderColor: 'var(--cyan)',
                    }}
                    data-testid="realtime-payment-radar"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full"
                        style={{ backgroundColor: 'var(--cyan)' }}
                      />
                      <div>
                        <div className="font-bold" style={{ color: 'var(--ink-primary)' }}>
                          {isCloudRealtimeConfigured()
                            ? locale === 'vi'
                              ? 'Đang tự động lắng nghe biến động số dư VietQR (3 giây/lần)...'
                              : 'Listening for real-time VietQR bank confirmation (every 3s)...'
                            : locale === 'vi'
                              ? 'Sẵn sàng đối soát Real-time (SePay/PayOS Webhook + Telegram <1s)'
                              : 'Real-time Webhook Auto-Verify Ready (SePay/PayOS + Telegram <1s)'}
                        </div>
                        <div className="mt-0.5 text-[11px]" style={{ color: 'var(--ink-secondary)' }}>
                          {locale === 'vi'
                            ? `Nội dung CK chuẩn không dấu: ${formatBankSafeMemo(confirmedOrder.orderCode)} — chuyển xong màn hình sẽ tự động nhảy sang ĐÃ THANH TOÁN kể cả lúc chủ shop không online.`
                            : `Bank-safe memo: ${formatBankSafeMemo(confirmedOrder.orderCode)} — screen auto-updates to PAID in 1–3s upon transfer.`}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {/* Printable A4 Itemized Receipt Card */}
              <div
                className="printable-invoice-card rounded-2xl border p-5"
                style={{
                  backgroundColor: 'var(--bg-canvas)',
                  borderColor: 'var(--border-hairline)',
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3" style={{ borderColor: 'var(--border-hairline)' }}>
                  <div>
                    <div className="font-mono-num text-[10px] font-bold uppercase" style={{ color: 'var(--accent)' }}>
                      TVT STUDIO · COMMERCIAL ORDER RECEIPT
                    </div>
                    <div className="mt-0.5 text-sm font-bold">{confirmedOrder.client.fullName}</div>
                    <div className="font-mono-num text-[11px]" style={{ color: 'var(--ink-muted)' }}>
                      {confirmedOrder.client.phoneOrZalo} · {confirmedOrder.client.email}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono-num rounded-md px-2.5 py-1 text-xs font-bold" style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}>
                      {confirmedOrder.orderCode}
                    </span>
                    {confirmedOrder.paymentRef && (
                      <div className="font-mono-num mt-1 text-[10px]" style={{ color: 'var(--cyan)' }}>
                        Ref: {confirmedOrder.paymentRef}
                      </div>
                    )}
                  </div>
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
                    <span>
                      {confirmedOrder.paymentChannel === 'consult-first'
                        ? locale === 'vi'
                          ? 'Cần chuyển hôm nay (Tư vấn trước)'
                          : 'Due today (Consult first)'
                        : locale === 'vi'
                          ? 'Số tiền thanh toán đợt này'
                          : 'Amount Due Now'}
                    </span>
                    <span className="font-mono-num">
                      {confirmedOrder.paymentChannel === 'consult-first'
                        ? formatMoney(0, currency)
                        : formatMoney(
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
                    {locale === 'vi' ? 'Lộ Trình Nghiệm Thu (30% / 40% / 30%)' : 'Milestone Schedule (30% / 40% / 30%)'}
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

              {/* Post-Payment Next Steps Box */}
              <div
                className="no-print rounded-2xl border p-4"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-hairline)',
                }}
              >
                <div className="flex items-center gap-2 text-xs font-bold uppercase" style={{ color: 'var(--cyan)' }}>
                  <IconClock className="h-3.5 w-3.5" />
                  <span>{locale === 'vi' ? 'Điều Gì Xảy Ra Tiếp Theo?' : 'What Happens Next?'}</span>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {postPaymentSteps.map((st) => (
                    <div
                      key={st.time}
                      className="flex items-start gap-2.5 rounded-xl border p-2.5 text-xs"
                      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-hairline)' }}
                    >
                      <span className="font-mono-num shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold" style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}>
                        {st.time}
                      </span>
                      <span className="leading-snug" style={{ color: 'var(--ink-secondary)' }}>
                        {st.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4 Action Buttons: Print A4 PDF, Download MD, Open Order Tracker, Zalo Direct */}
              <div className="no-print grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn-secondary inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-3 text-xs font-semibold"
                >
                  <IconDownload className="h-3.5 w-3.5" />
                  <span>{locale === 'vi' ? 'In PDF A4' : 'Print A4 PDF'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const md = generateOrderInvoiceMarkdown(confirmedOrder, locale);
                    downloadTextFile(`${confirmedOrder.orderCode}-TVT-Studio-Receipt.md`, md);
                  }}
                  className="btn-secondary inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-3 text-xs font-semibold"
                  data-testid="export-invoice-md-btn"
                >
                  <IconDownload className="h-3.5 w-3.5" />
                  <span>{locale === 'vi' ? 'Tải File (.md)' : 'Export (.md)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const code = confirmedOrder.orderCode;
                    handleCloseAll();
                    onOpenTracker(code);
                  }}
                  className="btn-secondary inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-3 text-xs font-semibold"
                  data-testid="checkout-open-tracker-btn"
                >
                  <IconSearch className="h-3.5 w-3.5" />
                  <span>{locale === 'vi' ? 'Tra Cứu Đơn' : 'Track Order'}</span>
                </button>

                <a
                  href={buildZaloDirectUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-3 text-xs font-semibold"
                >
                  <IconPhone className="h-3.5 w-3.5" />
                  <span>{locale === 'vi' ? 'Gửi Zalo Ngay' : 'Send On Zalo'}</span>
                </a>
              </div>

              <div className="no-print text-center">
                <a
                  href={buildMailtoOrderUrl(confirmedOrder, locale)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors hover:text-[var(--accent)]"
                  style={{ color: 'var(--ink-secondary)' }}
                >
                  <IconMail className="h-3.5 w-3.5" />
                  <span>
                    {locale === 'vi'
                      ? 'Hoặc mở sẵn email gửi trực tiếp tới tinhkun102@gmail.com'
                      : 'Or open pre-filled email draft to tinhkun102@gmail.com'}
                  </span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
