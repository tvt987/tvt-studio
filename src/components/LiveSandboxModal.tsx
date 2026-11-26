import React, { useEffect, useState } from 'react';
import { formatMoney } from '../engines/catalog';
import type { Currency, LicenseTier, Locale, TemplateProduct } from '../engines/types';
import {
  IconCart,
  IconClose,
  IconExternal,
  IconMonitor,
  IconSmartphone,
  IconTablet,
} from './Icons';

interface LiveSandboxModalProps {
  product: TemplateProduct | null;
  locale: Locale;
  currency: Currency;
  onClose: () => void;
  onAddToCart: (product: TemplateProduct, license: LicenseTier) => void;
}

type ViewportDevice = 'desktop' | 'tablet' | 'mobile';

export const LiveSandboxModal: React.FC<LiveSandboxModalProps> = ({
  product,
  locale,
  currency,
  onClose,
  onAddToCart,
}) => {
  const [device, setDevice] = useState<ViewportDevice>('desktop');
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    if (!product) return;
    setIframeLoaded(false);
    setDevice('desktop');

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [product, onClose]);

  if (!product) return null;

  const viewportWidthClass =
    device === 'mobile'
      ? 'w-[390px] max-w-full'
      : device === 'tablet'
        ? 'w-[768px] max-w-full'
        : 'w-full';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 backdrop-blur-md sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Live Sandbox ${product.name}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="flex h-[92vh] w-full max-w-[1440px] flex-col overflow-hidden rounded-2xl border"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-strong)',
          boxShadow: 'var(--shadow-modal)',
        }}
      >
        {/* Top Browser Chrome Bar */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-hairline)',
          }}
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: 'var(--emerald)' }} />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-display truncate text-sm font-bold sm:text-base">{product.name}</h3>
                <span className="font-mono-num hidden rounded px-1.5 py-0.5 text-[10px] sm:inline" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--ink-muted)' }}>
                  {product.sku}
                </span>
              </div>
              <p className="font-mono-num truncate text-[11px]" style={{ color: 'var(--ink-muted)' }}>
                {product.liveUrl}
              </p>
            </div>
          </div>

          {/* Device Switcher */}
          <div
            className="hidden items-center gap-1 rounded-lg border p-1 md:flex"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-hairline)',
            }}
          >
            {(
              [
                { id: 'desktop', label: 'Desktop', Icon: IconMonitor },
                { id: 'tablet', label: 'Tablet', Icon: IconTablet },
                { id: 'mobile', label: 'Mobile 390px', Icon: IconSmartphone },
              ] as const
            ).map(({ id, label, Icon }) => {
              const active = device === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setDevice(id)}
                  className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors"
                  style={{
                    backgroundColor: active ? 'var(--accent)' : 'transparent',
                    color: active ? '#ffffff' : 'var(--ink-secondary)',
                  }}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <a
              href={product.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold"
            >
              <IconExternal className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{locale === 'vi' ? 'Mở Tab Mới' : 'Open Tab'}</span>
            </a>

            <button
              type="button"
              onClick={() => {
                onAddToCart(product, 'standard');
                onClose();
              }}
              className="btn-primary inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold"
            >
              <IconCart className="h-3.5 w-3.5" />
              <span className="font-mono-num">
                {formatMoney(currency === 'VND' ? product.priceVnd : product.priceUsd, currency)}
              </span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="btn-ghost flex h-9 w-9 items-center justify-center rounded-lg"
              aria-label={locale === 'vi' ? 'Đóng bản xem thử' : 'Close sandbox'}
            >
              <IconClose className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Iframe Sandbox Viewport */}
        <div
          className="relative flex flex-1 items-center justify-center overflow-auto p-3 sm:p-4"
          style={{ backgroundColor: 'var(--bg-canvas)' }}
        >
          {!iframeLoaded && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div
                className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
                style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
              />
              <p className="font-mono-num text-xs" style={{ color: 'var(--ink-secondary)' }}>
                {locale === 'vi' ? 'Đang tải bản Live Sandbox...' : 'Loading Live Sandbox...'}
              </p>
            </div>
          )}

          <div
            className={`${viewportWidthClass} h-full overflow-hidden rounded-xl border bg-white transition-all duration-300`}
            style={{
              borderColor: 'var(--border-strong)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <iframe
              src={product.liveUrl}
              title={`Live Preview — ${product.name}`}
              className="h-full w-full border-0"
              onLoad={() => setIframeLoaded(true)}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
