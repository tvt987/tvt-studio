import React from 'react';
import { formatDeliveryRange, formatMoney, getLicensePrice } from '../engines/catalog';
import type { Currency, LicenseTier, Locale, TemplateProduct } from '../engines/types';
import { IconCart, IconClose, IconMonitor } from './Icons';

interface CompareDrawerProps {
  isOpen: boolean;
  products: TemplateProduct[];
  locale: Locale;
  currency: Currency;
  onClose: () => void;
  onRemoveProduct: (id: string) => void;
  onPreviewLive: (product: TemplateProduct) => void;
  onAddToCart: (product: TemplateProduct, license: LicenseTier) => void;
}

export const CompareDrawer: React.FC<CompareDrawerProps> = ({
  isOpen,
  products,
  locale,
  currency,
  onClose,
  onRemoveProduct,
  onPreviewLive,
  onAddToCart,
}) => {
  if (!isOpen || products.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Compare Templates"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-strong)',
          boxShadow: 'var(--shadow-modal)',
        }}
      >
        <div
          className="sticky top-0 z-10 flex items-center justify-between border-b px-6 py-4 backdrop-blur-md"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-hairline)',
          }}
        >
          <div>
            <span className="font-mono-num text-[11px] font-semibold uppercase" style={{ color: 'var(--accent)' }}>
              SIDE-BY-SIDE COMPARISON · {products.length}/3
            </span>
            <h2 className="font-display text-lg font-extrabold">
              {locale === 'vi' ? 'So Sánh Mẫu Website Theo Độ Phức Tạp & Chi Phí' : 'Compare Templates Side-By-Side'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost flex h-9 w-9 items-center justify-center rounded-lg"
            aria-label="Close compare modal"
          >
            <IconClose className="h-4 w-4" />
          </button>
        </div>

        <div
          className={`grid grid-cols-1 gap-4 p-6 ${
            products.length === 1
              ? 'mx-auto max-w-md md:grid-cols-1'
              : products.length === 2
                ? 'md:grid-cols-2'
                : 'md:grid-cols-3'
          }`}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col justify-between rounded-2xl border p-4"
              style={{
                backgroundColor: 'var(--bg-canvas)',
                borderColor: 'var(--border-hairline)',
              }}
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-black">
                  <img
                    src={product.previewImage}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveProduct(product.id)}
                    className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/75 text-white hover:bg-[var(--accent)]"
                    aria-label={`Remove ${product.name} from compare`}
                  >
                    <IconClose className="h-3.5 w-3.5" />
                  </button>
                </div>

                <h3 className="font-display mt-3 text-base font-bold">{product.name}</h3>
                <p className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                  {product.subtitle[locale]}
                </p>

                <dl className="mt-4 space-y-2 border-t pt-3 text-xs" style={{ borderColor: 'var(--border-hairline)' }}>
                  <div className="flex justify-between">
                    <dt style={{ color: 'var(--ink-muted)' }}>Standard Deploy</dt>
                    <dd className="font-mono-num font-bold">
                      {formatMoney(getLicensePrice(product, 'standard', currency), currency)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt style={{ color: 'var(--ink-muted)' }}>Full Source +30%</dt>
                    <dd className="font-mono-num font-bold" style={{ color: 'var(--accent)' }}>
                      {formatMoney(getLicensePrice(product, 'full-source', currency), currency)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt style={{ color: 'var(--ink-muted)' }}>{locale === 'vi' ? 'Bàn giao' : 'Delivery'}</dt>
                    <dd className="font-mono-num font-semibold">{formatDeliveryRange(product, locale)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt style={{ color: 'var(--ink-muted)' }}>{locale === 'vi' ? 'Hỗ trợ sử dụng' : 'Support'}</dt>
                    <dd className="font-semibold" style={{ color: 'var(--emerald)' }}>
                      {locale === 'vi' ? 'Xuyên suốt + Tinh chỉnh' : 'Ongoing + Tuning'}
                    </dd>
                  </div>
                </dl>

                <div className="mt-3 flex flex-wrap gap-1">
                  {product.stack.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono-num rounded border px-1.5 py-0.5 text-[10px]"
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

              <div className="mt-4 grid grid-cols-2 gap-2 border-t pt-3" style={{ borderColor: 'var(--border-hairline)' }}>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onPreviewLive(product);
                  }}
                  className="btn-secondary inline-flex items-center justify-center gap-1 rounded-xl py-2 text-xs font-semibold"
                >
                  <IconMonitor className="h-3.5 w-3.5" />
                  <span>Demo</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onAddToCart(product, 'standard');
                    onClose();
                  }}
                  className="btn-primary inline-flex items-center justify-center gap-1 rounded-xl py-2 text-xs font-semibold"
                >
                  <IconCart className="h-3.5 w-3.5" />
                  <span>{locale === 'vi' ? 'Chọn Mẫu' : 'Add'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
