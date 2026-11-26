import React, { useEffect, useState } from 'react';
import { formatMoney } from '../engines/catalog';
import { evaluateVoucher, VOUCHER_CATALOG } from '../engines/voucher';
import type {
  CartItem,
  CartTotals,
  Currency,
  LicenseTier,
  Locale,
  PaymentMode,
} from '../engines/types';
import {
  IconArrowUpRight,
  IconCart,
  IconCheck,
  IconClose,
  IconLock,
  IconMinus,
  IconPlus,
  IconTag,
  IconTrash,
} from './Icons';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  totals: CartTotals;
  locale: Locale;
  currency: Currency;
  activeVoucherCode: string | null;
  onClose: () => void;
  onUpdateQuantity: (cartKey: string, delta: number) => void;
  onRemoveItem: (cartKey: string) => void;
  onSwitchLicense: (cartKey: string, license: LicenseTier) => void;
  onApplyVoucher: (code: string | null) => void;
  onChangePaymentMode: (mode: PaymentMode) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  totals,
  locale,
  currency,
  activeVoucherCode,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onSwitchLicense,
  onApplyVoucher,
  onChangePaymentMode,
  onProceedToCheckout,
}) => {
  const [voucherInput, setVoucherInput] = useState(activeVoucherCode ?? '');
  const [voucherFeedback, setVoucherFeedback] = useState<{
    ok: boolean;
    text: string;
    key?: string;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const tryApplyCode = (rawCode: string) => {
    const evalResult = evaluateVoucher(
      rawCode,
      totals.subtotalVnd,
      totals.subtotalUsd,
      totals.appliedVoucher?.idempotencyKey
    );
    setVoucherInput(evalResult.code || rawCode);
    if (evalResult.valid) {
      onApplyVoucher(evalResult.code);
      setVoucherFeedback({
        ok: true,
        text: evalResult.message[locale],
        key: evalResult.idempotencyKey,
      });
    } else {
      setVoucherFeedback({
        ok: false,
        text: evalResult.message[locale],
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={locale === 'vi' ? 'Giỏ hàng TVT Studio' : 'TVT Studio Cart'}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="flex h-full w-full max-w-lg flex-col border-l"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-strong)',
          boxShadow: 'var(--shadow-modal)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-5 py-4"
          style={{ borderColor: 'var(--border-hairline)' }}
        >
          <div className="flex items-center gap-2.5">
            <IconCart className="h-5 w-5" style={{ color: 'var(--accent)' }} />
            <h2 className="font-display text-base font-bold">
              {locale === 'vi' ? 'Giỏ Hàng Dự Án' : 'Project Cart'}
            </h2>
            <span
              className="font-mono-num rounded-md px-2 py-0.5 text-xs font-bold"
              style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--ink-secondary)' }}
            >
              {totals.itemCount}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost flex h-9 w-9 items-center justify-center rounded-lg"
            aria-label="Close cart"
          >
            <IconClose className="h-4 w-4" />
          </button>
        </div>

        {/* Cart Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl border"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-hairline)',
                  color: 'var(--ink-muted)',
                }}
              >
                <IconCart className="h-6 w-6" />
              </div>
              <p className="mt-4 text-sm font-bold">
                {locale === 'vi' ? 'Giỏ hàng của bạn đang trống' : 'Your project cart is empty'}
              </p>
              <p className="mt-1.5 max-w-xs text-xs leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
                {locale === 'vi'
                  ? 'Chọn một website mẫu sẵn sàng triển khai hoặc cấu hình gói code riêng theo yêu cầu.'
                  : 'Add a ready-to-deploy template or configure a custom IT engineering package.'}
              </p>
              <div className="mt-5 flex gap-2">
                <a
                  href="#catalog"
                  onClick={onClose}
                  className="btn-primary rounded-xl px-4 py-2.5 text-xs font-semibold"
                >
                  {locale === 'vi' ? 'Xem Kho Website Mẫu' : 'Browse Templates'}
                </a>
                <a
                  href="#estimator"
                  onClick={onClose}
                  className="btn-secondary rounded-xl px-4 py-2.5 text-xs font-semibold"
                >
                  {locale === 'vi' ? 'Tính Báo Giá Riêng' : 'Scope Estimator'}
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const lineAmount =
                  (currency === 'VND' ? item.unitVnd : item.unitUsd) * item.quantity;
                return (
                  <div
                    key={item.cartKey}
                    className="rounded-xl border p-4"
                    style={{
                      backgroundColor: 'var(--bg-canvas)',
                      borderColor: 'var(--border-hairline)',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {item.kind === 'template' ? (
                        <img
                          src={item.previewImage}
                          alt={item.title}
                          className="h-14 w-20 shrink-0 rounded-lg border object-cover"
                          style={{ borderColor: 'var(--border-hairline)' }}
                        />
                      ) : (
                        <div
                          className="font-mono-num flex h-14 w-20 shrink-0 items-center justify-center rounded-lg border text-[10px] font-bold uppercase"
                          style={{
                            backgroundColor: 'var(--accent-soft)',
                            borderColor: 'var(--accent-border)',
                            color: 'var(--accent)',
                          }}
                        >
                          CUSTOM
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <span className="font-mono-num text-[10px]" style={{ color: 'var(--ink-muted)' }}>
                              {item.sku}
                            </span>
                            <h3 className="truncate text-sm font-bold">
                              {item.kind === 'template' ? item.title : item.title[locale]}
                            </h3>
                            <p className="truncate text-xs" style={{ color: 'var(--ink-secondary)' }}>
                              {item.kind === 'template' ? item.subtitle[locale] : item.summary[locale]}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.cartKey)}
                            className="rounded-md p-1.5 transition-colors hover:text-[var(--accent)]"
                            style={{ color: 'var(--ink-muted)' }}
                            aria-label="Remove item"
                          >
                            <IconTrash className="h-4 w-4" />
                          </button>
                        </div>

                        {/* License Switch for Template Items */}
                        {item.kind === 'template' && (
                          <div
                            className="mt-3 grid grid-cols-2 gap-1 rounded-lg border p-0.5"
                            style={{
                              backgroundColor: 'var(--bg-elevated)',
                              borderColor: 'var(--border-hairline)',
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => onSwitchLicense(item.cartKey, 'standard')}
                              className="rounded-md px-2 py-1 text-[11px] font-semibold"
                              style={{
                                backgroundColor:
                                  item.license === 'standard' ? 'var(--bg-surface)' : 'transparent',
                                color:
                                  item.license === 'standard'
                                    ? 'var(--ink-primary)'
                                    : 'var(--ink-muted)',
                              }}
                            >
                              Standard
                            </button>
                            <button
                              type="button"
                              onClick={() => onSwitchLicense(item.cartKey, 'full-source')}
                              className="rounded-md px-2 py-1 text-[11px] font-semibold"
                              style={{
                                backgroundColor:
                                  item.license === 'full-source'
                                    ? 'var(--bg-surface)'
                                    : 'transparent',
                                color:
                                  item.license === 'full-source'
                                    ? 'var(--accent)'
                                    : 'var(--ink-muted)',
                              }}
                            >
                              Full Source +40%
                            </button>
                          </div>
                        )}

                        {/* Add-on chips for custom items */}
                        {item.kind === 'custom' && item.addonLabels.length > 0 && (
                          <div className="mt-2.5 flex flex-wrap gap-1">
                            {item.addonLabels.map((lbl) => (
                              <span
                                key={lbl.en}
                                className="rounded border px-1.5 py-0.5 text-[10px]"
                                style={{
                                  backgroundColor: 'var(--bg-elevated)',
                                  borderColor: 'var(--border-hairline)',
                                  color: 'var(--ink-secondary)',
                                }}
                              >
                                {lbl[locale]}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Quantity + Line Price */}
                        <div className="mt-3 flex items-center justify-between">
                          <div
                            className="inline-flex items-center rounded-lg border"
                            style={{ borderColor: 'var(--border-hairline)' }}
                          >
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.cartKey, -1)}
                              className="flex h-7 w-7 items-center justify-center hover:bg-[var(--bg-elevated)]"
                              aria-label="Decrease quantity"
                            >
                              <IconMinus className="h-3.5 w-3.5" />
                            </button>
                            <span className="font-mono-num w-8 text-center text-xs font-bold">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.cartKey, 1)}
                              className="flex h-7 w-7 items-center justify-center hover:bg-[var(--bg-elevated)]"
                              aria-label="Increase quantity"
                            >
                              <IconPlus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <span className="font-mono-num text-sm font-bold">
                            {formatMoney(lineAmount, currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Idempotent Voucher Box */}
              <div
                className="rounded-xl border p-4"
                style={{
                  backgroundColor: 'var(--bg-canvas)',
                  borderColor: 'var(--border-hairline)',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold">
                    <IconTag className="h-3.5 w-3.5" style={{ color: 'var(--accent)' }} />
                    {locale === 'vi' ? 'Mã Ưu Đãi (Idempotent Voucher)' : 'Promo Code (Idempotent Engine)'}
                  </span>
                  {totals.appliedVoucher && (
                    <button
                      type="button"
                      onClick={() => {
                        onApplyVoucher(null);
                        setVoucherInput('');
                        setVoucherFeedback(null);
                      }}
                      className="text-[11px] font-semibold hover:underline"
                      style={{ color: 'var(--accent)' }}
                    >
                      {locale === 'vi' ? 'Gỡ mã' : 'Remove'}
                    </button>
                  )}
                </div>

                <div className="mt-2.5 flex gap-2">
                  <input
                    type="text"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value)}
                    placeholder="TVTLAUNCH15, AGENCY10, VIP500K"
                    className="input-studio font-mono-num h-9 flex-1 rounded-lg px-3 text-xs uppercase"
                    data-testid="voucher-input"
                  />
                  <button
                    type="button"
                    onClick={() => tryApplyCode(voucherInput)}
                    className="btn-secondary rounded-lg px-3.5 text-xs font-semibold"
                    data-testid="voucher-apply-btn"
                  >
                    {locale === 'vi' ? 'Áp Dụng' : 'Apply'}
                  </button>
                </div>

                {/* Quick Apply Voucher Chips */}
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {VOUCHER_CATALOG.map((v) => {
                    const isApplied = totals.appliedVoucher?.code === v.code;
                    return (
                      <button
                        key={v.code}
                        type="button"
                        onClick={() => tryApplyCode(v.code)}
                        className="font-mono-num inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-semibold transition-colors"
                        style={{
                          backgroundColor: isApplied ? 'var(--emerald-soft)' : 'var(--bg-elevated)',
                          borderColor: isApplied ? 'var(--emerald)' : 'var(--border-hairline)',
                          color: isApplied ? 'var(--emerald)' : 'var(--ink-secondary)',
                        }}
                      >
                        {isApplied && <IconCheck className="h-3 w-3" />}
                        {v.code}
                      </button>
                    );
                  })}
                </div>

                {voucherFeedback && (
                  <p
                    className="mt-2 text-[11px] font-medium"
                    style={{ color: voucherFeedback.ok ? 'var(--emerald)' : 'var(--accent)' }}
                  >
                    {voucherFeedback.text}
                  </p>
                )}
              </div>

              {/* Payment Mode Toggle */}
              <div
                className="rounded-xl border p-4"
                style={{
                  backgroundColor: 'var(--bg-canvas)',
                  borderColor: 'var(--border-hairline)',
                }}
              >
                <span className="text-xs font-bold">
                  {locale === 'vi' ? 'Chế Độ Thanh Toán' : 'Settlement Mode'}
                </span>
                <div className="mt-2.5 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onChangePaymentMode('deposit-30')}
                    className="rounded-xl border p-3 text-left transition-all"
                    style={{
                      backgroundColor:
                        totals.paymentMode === 'deposit-30'
                          ? 'var(--accent-soft)'
                          : 'var(--bg-surface)',
                      borderColor:
                        totals.paymentMode === 'deposit-30'
                          ? 'var(--accent)'
                          : 'var(--border-hairline)',
                    }}
                    data-testid="payment-mode-deposit"
                  >
                    <div className="text-xs font-bold">
                      {locale === 'vi' ? 'Đặt Cọc Khởi Tạo 30%' : '30% Kickoff Deposit'}
                    </div>
                    <div className="mt-0.5 text-[11px]" style={{ color: 'var(--ink-secondary)' }}>
                      {locale === 'vi' ? '70% còn lại theo UAT & Go-Live' : '70% across UAT & Go-Live'}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onChangePaymentMode('full')}
                    className="rounded-xl border p-3 text-left transition-all"
                    style={{
                      backgroundColor:
                        totals.paymentMode === 'full' ? 'var(--accent-soft)' : 'var(--bg-surface)',
                      borderColor:
                        totals.paymentMode === 'full' ? 'var(--accent)' : 'var(--border-hairline)',
                    }}
                    data-testid="payment-mode-full"
                  >
                    <div className="text-xs font-bold">
                      {locale === 'vi' ? 'Thanh Toán 100%' : 'Full Payment 100%'}
                    </div>
                    <div className="mt-0.5 text-[11px]" style={{ color: 'var(--ink-secondary)' }}>
                      {locale === 'vi' ? 'Tất toán 1 lần, ưu tiên slot' : 'Single settlement, priority queue'}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer Summary */}
        {items.length > 0 && (
          <div
            className="border-t p-5"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-hairline)',
            }}
          >
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between" style={{ color: 'var(--ink-secondary)' }}>
                <span>{locale === 'vi' ? 'Tạm tính' : 'Subtotal'}</span>
                <span className="font-mono-num">
                  {formatMoney(currency === 'VND' ? totals.subtotalVnd : totals.subtotalUsd, currency)}
                </span>
              </div>

              {totals.discountVnd > 0 && (
                <div className="flex justify-between" style={{ color: 'var(--emerald)' }}>
                  <span>
                    {locale === 'vi' ? 'Ưu đãi' : 'Discount'} ({totals.appliedVoucher?.code})
                  </span>
                  <span className="font-mono-num font-semibold">
                    -{formatMoney(currency === 'VND' ? totals.discountVnd : totals.discountUsd, currency)}
                  </span>
                </div>
              )}

              <div className="flex justify-between font-semibold" style={{ color: 'var(--ink-primary)' }}>
                <span>{locale === 'vi' ? 'Tổng giá trị hợp đồng' : 'Net contract total'}</span>
                <span className="font-mono-num">
                  {formatMoney(currency === 'VND' ? totals.netTotalVnd : totals.netTotalUsd, currency)}
                </span>
              </div>

              <div
                className="flex items-baseline justify-between border-t pt-2.5"
                style={{ borderColor: 'var(--border-hairline)' }}
              >
                <span className="text-sm font-bold">
                  {totals.paymentMode === 'deposit-30'
                    ? locale === 'vi'
                      ? 'Cọc Cần Thanh Toán Ngay (30%)'
                      : 'Kickoff Deposit Due Today (30%)'
                    : locale === 'vi'
                      ? 'Thanh Toán Ngay (100%)'
                      : 'Total Due Today (100%)'}
                </span>
                <span className="font-mono-num text-lg font-extrabold" style={{ color: 'var(--accent)' }}>
                  {formatMoney(currency === 'VND' ? totals.payableNowVnd : totals.payableNowUsd, currency)}
                </span>
              </div>

              {totals.remainingVnd > 0 && (
                <div className="flex justify-between text-[11px]" style={{ color: 'var(--ink-muted)' }}>
                  <span>{locale === 'vi' ? 'Còn lại theo nghiệm thu' : 'Remaining on milestones'}</span>
                  <span className="font-mono-num">
                    {formatMoney(currency === 'VND' ? totals.remainingVnd : totals.remainingUsd, currency)}
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onProceedToCheckout}
              className="btn-primary mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold"
              data-testid="proceed-checkout-btn"
            >
              <IconLock className="h-4 w-4" />
              <span>{locale === 'vi' ? 'Tiến Hành Thanh Toán & Chốt Đơn' : 'Proceed To Checkout'}</span>
              <IconArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
