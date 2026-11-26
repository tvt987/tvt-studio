import React, { useEffect, useMemo, useState } from 'react';
import { formatMoney, STUDIO_CONTACT } from '../engines/catalog';
import {
  buildMailtoOrderUrl,
  buildZaloDirectUrl,
  generateOrderInvoiceMarkdown,
  getPaymentChannelLabel,
} from '../engines/invoice';
import { ORDER_STATUS_META } from '../engines/orderLedger';
import type { Currency, Locale, OrderSnapshot } from '../engines/types';
import { downloadTextFile } from '../utils/download';
import {
  IconCheck,
  IconClose,
  IconDownload,
  IconMail,
  IconPhone,
  IconSearch,
  IconShield,
} from './Icons';

interface OrderTrackerModalProps {
  isOpen: boolean;
  orders: OrderSnapshot[];
  locale: Locale;
  currency: Currency;
  initialOrderCode?: string | null;
  onClose: () => void;
  onSubmitPaymentProof: (orderCode: string, paymentRef: string) => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  orders,
  locale,
  currency,
  initialOrderCode,
  onClose,
  onSubmitPaymentProof,
}) => {
  const [searchCode, setSearchCode] = useState(initialOrderCode ?? '');
  const [selectedCode, setSelectedCode] = useState<string | null>(initialOrderCode ?? null);
  const [proofInput, setProofInput] = useState('');
  const [proofSavedMsg, setProofSavedMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (initialOrderCode) {
      setSelectedCode(initialOrderCode);
      setSearchCode(initialOrderCode);
    } else {
      setSearchCode('');
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [initialOrderCode, isOpen, onClose]);

  const filteredOrders = useMemo(() => {
    const q = searchCode.trim().toUpperCase();
    if (!q) return orders;
    return orders.filter(
      (o) =>
        o.orderCode.toUpperCase().includes(q) ||
        o.client.fullName.toUpperCase().includes(q) ||
        o.client.phoneOrZalo.includes(q)
    );
  }, [orders, searchCode]);

  const activeOrder = useMemo(() => {
    if (selectedCode) {
      const exact = orders.find((o) => o.orderCode === selectedCode);
      if (exact) return exact;
    }
    return filteredOrders[0] ?? null;
  }, [filteredOrders, orders, selectedCode]);

  if (!isOpen) return null;

  const progressSteps = [
    locale === 'vi' ? 'Ghi Nhận Đơn' : 'Order Logged',
    locale === 'vi' ? 'Gửi Minh Chứng CK' : 'Proof Submitted',
    locale === 'vi' ? 'Xác Nhận Cọc' : 'Deposit Verified',
    locale === 'vi' ? 'Đang Lập Trình' : 'In Development',
    locale === 'vi' ? 'Link Staging UAT' : 'Staging Review',
    locale === 'vi' ? 'Go-Live & Hỗ Trợ' : 'Live & Support',
  ];

  const activeStatus = activeOrder?.status ?? 'AWAITING_PAYMENT';
  const activeStepIdx = ORDER_STATUS_META[activeStatus]?.stepIndex ?? 0;

  const handleAttachProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder || proofInput.trim().length < 3) return;
    onSubmitPaymentProof(activeOrder.orderCode, proofInput.trim());
    setProofInput('');
    setProofSavedMsg(
      locale === 'vi'
        ? 'Đã lưu mã giao dịch vào hồ sơ đơn hàng — Trương Văn Tình sẽ xác nhận qua Zalo trong 15 phút.'
        : 'Transfer reference attached — Truong Van Tinh will verify within 15 minutes.'
    );
    window.setTimeout(() => setProofSavedMsg(null), 4000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Order Tracker"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="printable-invoice-shell max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-strong)',
          boxShadow: 'var(--shadow-modal)',
        }}
      >
        {/* Header */}
        <div
          className="no-print sticky top-0 z-10 flex items-center justify-between gap-4 border-b px-6 py-4 backdrop-blur-md"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-hairline)',
          }}
        >
          <div>
            <span className="font-mono-num text-[11px] font-semibold uppercase" style={{ color: 'var(--cyan)' }}>
              INDEXEDDB PERSISTENT LEDGER · {orders.length} {locale === 'vi' ? 'ĐƠN ĐÃ LƯU' : 'SAVED ORDERS'}
            </span>
            <h2 className="font-display text-lg font-extrabold">
              {locale === 'vi' ? 'Tra Cứu Đơn Hàng & Tiến Độ Bàn Giao' : 'Order Tracker & Delivery Timeline'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost flex h-9 w-9 items-center justify-center rounded-lg"
            aria-label="Close order tracker"
          >
            <IconClose className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6">
          {/* Search Bar */}
          <div className="no-print relative">
            <IconSearch className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
            <input
              type="search"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder={
                locale === 'vi'
                  ? 'Nhập mã đơn (VD: TVT-ORD-7442), tên hoặc SĐT...'
                  : 'Search by Order ID (e.g. TVT-ORD-7442), name, or phone...'
              }
              className="input-studio h-11 w-full rounded-xl pr-4 pl-10 text-sm"
              data-testid="order-tracker-search"
            />
          </div>

          {orders.length === 0 ? (
            <div
              className="mt-6 rounded-2xl border p-10 text-center"
              style={{
                backgroundColor: 'var(--bg-canvas)',
                borderColor: 'var(--border-hairline)',
              }}
            >
              <p className="text-base font-bold">
                {locale === 'vi' ? 'Chưa có đơn hàng nào được lưu trên thiết bị này.' : 'No orders saved on this device yet.'}
              </p>
              <p className="mt-2 text-xs leading-relaxed sm:text-sm" style={{ color: 'var(--ink-secondary)' }}>
                {locale === 'vi'
                  ? 'Khi bạn đặt mẫu website hoặc tạo đơn tư vấn (0₫), đơn hàng sẽ tự động lưu bền vững vào IndexedDB tại đây kèm hợp đồng A4 & lịch sử tiến độ.'
                  : 'When you place a template order or $0 consultation booking, it persists automatically here in IndexedDB with printable receipts.'}
              </p>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-12">
              {/* Left Order List */}
              <div className="no-print space-y-2 lg:col-span-4">
                {filteredOrders.map((order) => {
                  const isSel = activeOrder?.orderCode === order.orderCode;
                  const meta = ORDER_STATUS_META[order.status ?? 'AWAITING_PAYMENT'];
                  return (
                    <button
                      key={order.orderCode}
                      type="button"
                      onClick={() => setSelectedCode(order.orderCode)}
                      className="w-full rounded-xl border p-3.5 text-left transition-all"
                      style={{
                        backgroundColor: isSel ? 'var(--accent-soft)' : 'var(--bg-canvas)',
                        borderColor: isSel ? 'var(--accent)' : 'var(--border-hairline)',
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono-num text-xs font-bold" style={{ color: 'var(--accent)' }}>
                          {order.orderCode}
                        </span>
                        <span className="font-mono-num text-[10px]" style={{ color: 'var(--ink-muted)' }}>
                          {order.createdAtIso.slice(0, 10)}
                        </span>
                      </div>
                      <div className="mt-1 truncate text-xs font-semibold">{order.client.fullName}</div>
                      <div className="mt-1.5 flex items-center justify-between text-[11px]">
                        <span className="truncate font-medium" style={{ color: meta.colorVar }}>
                          {meta[locale]}
                        </span>
                        <span className="font-mono-num font-bold">
                          {formatMoney(
                            currency === 'VND' ? order.totals.netTotalVnd : order.totals.netTotalUsd,
                            currency
                          )}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Active Order Detail & Printable A4 Contract */}
              {activeOrder && (
                <div
                  className="printable-invoice-card space-y-5 rounded-2xl border p-5 lg:col-span-8"
                  style={{
                    backgroundColor: 'var(--bg-canvas)',
                    borderColor: 'var(--border-hairline)',
                  }}
                >
                  {/* Top Summary */}
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-4" style={{ borderColor: 'var(--border-hairline)' }}>
                    <div>
                      <div className="font-mono-num text-xs font-bold" style={{ color: 'var(--accent)' }}>
                        TVT STUDIO · {activeOrder.orderCode}
                      </div>
                      <h3 className="font-display mt-0.5 text-base font-extrabold">
                        {activeOrder.client.fullName}
                      </h3>
                      <div className="font-mono-num mt-0.5 text-[11px]" style={{ color: 'var(--ink-muted)' }}>
                        {activeOrder.client.phoneOrZalo} · {activeOrder.client.email}
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-bold"
                        style={{
                          borderColor: ORDER_STATUS_META[activeStatus].colorVar,
                          color: ORDER_STATUS_META[activeStatus].colorVar,
                          backgroundColor: 'var(--bg-surface)',
                        }}
                      >
                        <IconShield className="h-3.5 w-3.5" />
                        {ORDER_STATUS_META[activeStatus][locale]}
                      </span>
                      <div className="font-mono-num mt-1 text-[10px]" style={{ color: 'var(--ink-muted)' }}>
                        Sync:{' '}
                        {activeOrder.syncState === 'supabase_synced'
                          ? 'Supabase Cloud DB'
                          : activeOrder.syncState === 'email_webhook_sent'
                            ? 'Email Webhook + IndexedDB'
                            : 'IndexedDB Local Ledger'}
                      </div>
                    </div>
                  </div>

                  {/* 6-Stage Progress Stepper */}
                  <div className="no-print">
                    <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
                      {progressSteps.map((label, idx) => {
                        const done = idx <= activeStepIdx;
                        return (
                          <div
                            key={label}
                            className="rounded-lg border px-2 py-2 text-center text-[10px] font-semibold"
                            style={{
                              backgroundColor: done ? 'var(--emerald-soft)' : 'var(--bg-surface)',
                              borderColor: done ? 'var(--emerald)' : 'var(--border-hairline)',
                              color: done ? 'var(--emerald)' : 'var(--ink-muted)',
                            }}
                          >
                            <div className="font-mono-num text-[9px]">0{idx + 1}</div>
                            <div className="mt-0.5 leading-tight">{label}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit / Update Bank Transfer Proof (if not yet verified) */}
                  {(activeStatus === 'AWAITING_PAYMENT' || activeStatus === 'PENDING_CONSULTATION') && (
                    <form
                      onSubmit={handleAttachProof}
                      className="no-print rounded-xl border p-3.5"
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        borderColor: 'var(--border-strong)',
                      }}
                    >
                      <label htmlFor="tracker-proof-ref" className="block text-xs font-bold">
                        {locale === 'vi'
                          ? 'Đã chuyển khoản cọc? Nhập mã giao dịch ngân hàng / MoMo / ZaloPay để đối soát ngay:'
                          : 'Already transferred? Enter your bank / wallet transaction ref for fast verification:'}
                      </label>
                      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                        <input
                          id="tracker-proof-ref"
                          type="text"
                          value={proofInput}
                          onChange={(e) => setProofInput(e.target.value)}
                          placeholder="VD: FT2633012984 hoặc MOMO-99421"
                          className="input-studio h-9 flex-1 rounded-lg px-3 font-mono-num text-xs"
                        />
                        <button
                          type="submit"
                          className="btn-primary inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold"
                        >
                          <IconCheck className="h-3.5 w-3.5" />
                          <span>{locale === 'vi' ? 'Gửi Mã Giao Dịch' : 'Submit Ref'}</span>
                        </button>
                      </div>
                      {proofSavedMsg && (
                        <p className="mt-2 text-xs font-semibold" style={{ color: 'var(--emerald)' }}>
                          {proofSavedMsg}
                        </p>
                      )}
                    </form>
                  )}

                  {/* Line Items & Payment Summary */}
                  <div>
                    <div className="text-[11px] font-bold uppercase" style={{ color: 'var(--ink-muted)' }}>
                      {locale === 'vi' ? 'Chi Tiết Hạng Mục' : 'Line Items'}
                    </div>
                    <ul className="mt-2 divide-y text-xs" style={{ borderColor: 'var(--border-hairline)' }}>
                      {activeOrder.items.map((item) => (
                        <li key={item.cartKey} className="flex items-center justify-between py-2">
                          <span>
                            <strong>{item.kind === 'template' ? item.title : item.title[locale]}</strong>{' '}
                            <span style={{ color: 'var(--ink-muted)' }}>x{item.quantity}</span>
                          </span>
                          <span className="font-mono-num font-bold">
                            {formatMoney(
                              (currency === 'VND' ? item.unitVnd : item.unitUsd) * item.quantity,
                              currency
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-3 space-y-1 border-t pt-3 text-xs" style={{ borderColor: 'var(--border-hairline)' }}>
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--ink-secondary)' }}>
                          {locale === 'vi' ? 'Kênh thanh toán' : 'Payment Channel'}
                        </span>
                        <span className="text-right font-semibold">
                          {getPaymentChannelLabel(activeOrder.paymentChannel, locale)}
                        </span>
                      </div>
                      {activeOrder.paymentRef && (
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--ink-secondary)' }}>
                            {locale === 'vi' ? 'Mã giao dịch đối soát' : 'Transfer Reference'}
                          </span>
                          <span className="font-mono-num font-bold" style={{ color: 'var(--cyan)' }}>
                            {activeOrder.paymentRef}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--ink-secondary)' }}>
                          {locale === 'vi' ? 'Tổng giá trị hợp đồng' : 'Contract Total'}
                        </span>
                        <span className="font-mono-num font-bold">
                          {formatMoney(
                            currency === 'VND' ? activeOrder.totals.netTotalVnd : activeOrder.totals.netTotalUsd,
                            currency
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-extrabold" style={{ color: 'var(--accent)' }}>
                        <span>{locale === 'vi' ? 'Thanh toán đợt 1' : 'Initial Settlement'}</span>
                        <span className="font-mono-num">
                          {formatMoney(
                            currency === 'VND'
                              ? activeOrder.totals.payableNowVnd
                              : activeOrder.totals.payableNowUsd,
                            currency
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Audit Timeline Log */}
                  {activeOrder.events && activeOrder.events.length > 0 && (
                    <div className="border-t pt-3" style={{ borderColor: 'var(--border-hairline)' }}>
                      <div className="text-[11px] font-bold uppercase" style={{ color: 'var(--ink-muted)' }}>
                        {locale === 'vi' ? 'Nhật Ký Tiến Độ Đơn Hàng' : 'Immutable Order Audit Log'}
                      </div>
                      <ul className="mt-2 space-y-1.5 text-xs">
                        {activeOrder.events.map((ev, idx) => (
                          <li key={`${ev.atIso}-${idx}`} className="flex items-start justify-between gap-3">
                            <span style={{ color: 'var(--ink-secondary)' }}>
                              {locale === 'vi' ? ev.noteVi : ev.noteEn}
                            </span>
                            <span className="font-mono-num shrink-0 text-[10px]" style={{ color: 'var(--ink-muted)' }}>
                              {ev.atIso.slice(0, 16).replace('T', ' ')}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="no-print grid grid-cols-2 gap-2 pt-2 sm:grid-cols-4">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="btn-secondary inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold"
                    >
                      <IconDownload className="h-3.5 w-3.5" />
                      <span>{locale === 'vi' ? 'In PDF A4' : 'Print PDF'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const md = generateOrderInvoiceMarkdown(activeOrder, locale);
                        downloadTextFile(`${activeOrder.orderCode}-TVT-Studio-Receipt.md`, md);
                      }}
                      className="btn-secondary inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold"
                    >
                      <IconDownload className="h-3.5 w-3.5" />
                      <span>{locale === 'vi' ? 'Tải .md' : 'Export .md'}</span>
                    </button>

                    <a
                      href={buildMailtoOrderUrl(activeOrder, locale)}
                      className="btn-secondary inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold"
                    >
                      <IconMail className="h-3.5 w-3.5" />
                      <span>Email</span>
                    </a>

                    <a
                      href={buildZaloDirectUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold"
                    >
                      <IconPhone className="h-3.5 w-3.5" />
                      <span>Zalo {STUDIO_CONTACT.phoneDisplay.slice(-4)}</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
