import React, { useEffect, useState } from 'react';
import {
  formatDeliveryRange,
  formatMoney,
  getLicensePrice,
  getOriginalLicensePrice,
} from '../engines/catalog';
import type { Currency, LicenseTier, Locale, TemplateProduct } from '../engines/types';
import {
  IconCart,
  IconCheck,
  IconClock,
  IconClose,
  IconCode,
  IconExternal,
  IconMonitor,
  IconShield,
} from './Icons';

interface ProductDetailModalProps {
  product: TemplateProduct | null;
  initialLicense: LicenseTier;
  locale: Locale;
  currency: Currency;
  onClose: () => void;
  onOpenSandbox: (product: TemplateProduct) => void;
  onAddToCart: (product: TemplateProduct, license: LicenseTier) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  initialLicense,
  locale,
  currency,
  onClose,
  onOpenSandbox,
  onAddToCart,
}) => {
  const [license, setLicense] = useState<LicenseTier>(initialLicense);

  useEffect(() => {
    setLicense(initialLicense);
  }, [initialLicense, product]);

  useEffect(() => {
    if (!product) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [product, onClose]);

  if (!product) return null;

  const activePrice = getLicensePrice(product, license, currency);
  const originalPrice = getOriginalLicensePrice(product, license, currency);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Product specs ${product.name}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border"
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
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono-num text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                {product.sku}
              </span>
              <span className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                · {product.categoryLabel[locale]}
              </span>
            </div>
            <h3 className="font-display text-lg font-extrabold sm:text-xl">{product.name}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost flex h-9 w-9 items-center justify-center rounded-lg"
            aria-label="Close product specs"
          >
            <IconClose className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-12">
          {/* Left Preview + Architecture */}
          <div className="space-y-4 lg:col-span-6">
            <div className="overflow-hidden rounded-xl border" style={{ borderColor: 'var(--border-hairline)' }}>
              <img
                src={product.previewImage}
                alt={product.name}
                className="aspect-[16/10] w-full object-cover"
              />
            </div>

            <div className="surface-elevated rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase" style={{ color: 'var(--ink-primary)' }}>
                <IconCode className="h-4 w-4" style={{ color: 'var(--accent)' }} />
                <span>{locale === 'vi' ? 'Ghi Chú Kiến Trúc' : 'Architecture Note'}</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed sm:text-sm" style={{ color: 'var(--ink-secondary)' }}>
                {product.architectureNote[locale]}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {product.stack.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono-num rounded border px-2 py-0.5 text-[11px]"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-hairline)',
                      color: 'var(--ink-secondary)',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSandbox(product);
                }}
                className="btn-secondary flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold"
              >
                <IconMonitor className="h-4 w-4" />
                <span>{locale === 'vi' ? 'Xem Live Sandbox' : 'Open Live Sandbox'}</span>
              </button>
              <a
                href={product.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold"
              >
                <IconExternal className="h-4 w-4" />
                <span>{locale === 'vi' ? 'Tab Mới' : 'New Tab'}</span>
              </a>
            </div>
          </div>

          {/* Right Deliverables & License Selection */}
          <div className="flex flex-col justify-between space-y-5 lg:col-span-6">
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                {product.subtitle[locale]}
              </p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
                {product.tagline[locale]}
              </p>

              <h4 className="mt-5 text-xs font-bold tracking-wider uppercase" style={{ color: 'var(--ink-primary)' }}>
                {locale === 'vi' ? 'Hạng Mục Bàn Giao Bao Gồm' : 'Included Deliverables'}
              </h4>
              <ul className="mt-3 space-y-2.5">
                {product.deliverables[locale].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-xs leading-relaxed sm:text-sm" style={{ color: 'var(--ink-secondary)' }}>
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--emerald)' }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* License Choice Cards */}
            <div className="space-y-3 border-t pt-4" style={{ borderColor: 'var(--border-hairline)' }}>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setLicense('standard')}
                  className="rounded-xl border p-3.5 text-left transition-all"
                  style={{
                    backgroundColor: license === 'standard' ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                    borderColor: license === 'standard' ? 'var(--accent)' : 'var(--border-hairline)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">Standard Deploy</span>
                    <span className="font-mono-num text-xs font-bold">
                      {formatMoney(getLicensePrice(product, 'standard', currency), currency)}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px]" style={{ color: 'var(--ink-secondary)' }}>
                    {locale === 'vi'
                      ? 'Tùy biến logo/màu/nội dung & deploy domain riêng sẵn sàng chạy.'
                      : 'Rebranded deployment on your custom domain with SSL & SEO.'}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setLicense('full-source')}
                  className="rounded-xl border p-3.5 text-left transition-all"
                  style={{
                    backgroundColor: license === 'full-source' ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                    borderColor: license === 'full-source' ? 'var(--accent)' : 'var(--border-hairline)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">Full Source +40%</span>
                    <span className="font-mono-num text-xs font-bold" style={{ color: 'var(--accent)' }}>
                      {formatMoney(getLicensePrice(product, 'full-source', currency), currency)}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px]" style={{ color: 'var(--ink-secondary)' }}>
                    {locale === 'vi'
                      ? 'Sở hữu 100% mã nguồn GitHub, CI/CD, unit tests & mở rộng tự do.'
                      : '100% GitHub repository ownership, CI/CD & unlimited customization.'}
                  </p>
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono-num text-2xl font-bold">{formatMoney(activePrice, currency)}</span>
                    <span className="font-mono-num text-xs line-through" style={{ color: 'var(--ink-muted)' }}>
                      {formatMoney(originalPrice, currency)}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-[11px]" style={{ color: 'var(--ink-muted)' }}>
                    <span className="inline-flex items-center gap-1">
                      <IconClock className="h-3.5 w-3.5" />
                      {formatDeliveryRange(product, locale)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <IconShield className="h-3.5 w-3.5" style={{ color: 'var(--emerald)' }} />
                      {locale === 'vi' ? 'Bảo hành 90 ngày' : '90-day warranty'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onAddToCart(product, license);
                    onClose();
                  }}
                  className="btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
                >
                  <IconCart className="h-4 w-4" />
                  <span>{locale === 'vi' ? 'Thêm Vào Giỏ Hàng' : 'Add To Cart'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
