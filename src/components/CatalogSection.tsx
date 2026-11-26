import React, { useMemo, useState } from 'react';
import {
  filterAndSortCatalog,
  formatDeliveryRange,
  formatMoney,
  getCategoryCounts,
  getLicensePrice,
  getOriginalLicensePrice,
  getSavingsPercent,
} from '../engines/catalog';
import type {
  CatalogSort,
  Currency,
  LicenseTier,
  Locale,
  ProductCategory,
  TemplateProduct,
} from '../engines/types';
import {
  IconCart,
  IconCheck,
  IconClock,
  IconExternal,
  IconLayers,
  IconMonitor,
  IconSearch,
} from './Icons';

interface CatalogSectionProps {
  products: TemplateProduct[];
  locale: Locale;
  currency: Currency;
  compareIds: string[];
  onPreviewLive: (product: TemplateProduct) => void;
  onInspectDetails: (product: TemplateProduct, license: LicenseTier) => void;
  onAddToCart: (product: TemplateProduct, license: LicenseTier) => void;
  onToggleCompare: (productId: string) => void;
  onOpenCompare: () => void;
  onOpenInquiry: (product: TemplateProduct) => void;
}

function getComplexityBadge(priceVnd: number, locale: Locale): { label: string; colorVar: string } {
  if (priceVnd <= 2_990_000) {
    return { label: locale === 'vi' ? 'Mức Tiêu Chuẩn' : 'Standard Tier', colorVar: 'var(--emerald)' };
  }
  if (priceVnd <= 4_490_000) {
    return { label: locale === 'vi' ? 'Mức Trung - Cao' : 'Mid-High Tier', colorVar: 'var(--cyan)' };
  }
  if (priceVnd <= 5_990_000) {
    return { label: locale === 'vi' ? 'Mức Chuyên Sâu' : 'Advanced Tier', colorVar: 'var(--accent)' };
  }
  return { label: 'Enterprise', colorVar: 'var(--accent)' };
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  products,
  locale,
  currency,
  compareIds,
  onPreviewLive,
  onInspectDetails,
  onAddToCart,
  onToggleCompare,
  onOpenCompare,
  onOpenInquiry,
}) => {
  const [category, setCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<CatalogSort>('featured');
  const [cardLicenses, setCardLicenses] = useState<Record<string, LicenseTier>>({});
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const counts = useMemo(() => getCategoryCounts(products), [products]);

  const visibleProducts = useMemo(
    () => filterAndSortCatalog(products, category, searchQuery, sortBy),
    [products, category, searchQuery, sortBy]
  );

  const categoryTabs: Array<{ id: ProductCategory; label: string }> = [
    { id: 'all', label: locale === 'vi' ? 'Tất Cả' : 'All' },
    { id: 'commerce-3d', label: locale === 'vi' ? 'Bán Hàng 3D' : '3D Commerce' },
    { id: 'clinic-proptech', label: locale === 'vi' ? 'Phòng Khám & BĐS' : 'Clinic & PropTech' },
    { id: 'pos-fnb', label: 'POS & F&B' },
    { id: 'saas-ai', label: 'SaaS & AI' },
  ];

  const handleCardLicense = (productId: string, license: LicenseTier) => {
    setCardLicenses((prev) => ({ ...prev, [productId]: license }));
  };

  const handleAdd = (product: TemplateProduct) => {
    const chosenLicense = cardLicenses[product.id] ?? 'standard';
    onAddToCart(product, chosenLicense);
    setRecentlyAddedId(product.id);
    window.setTimeout(() => {
      setRecentlyAddedId((curr) => (curr === product.id ? null : curr));
    }, 1400);
  };

  return (
    <section id="catalog" className="mx-auto max-w-[1360px] scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      {/* Section Header */}
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <div className="font-mono-num text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
            01 // {locale === 'vi' ? 'KHO WEBSITE MẪU THƯƠNG MẠI' : 'READY-TO-DEPLOY STOREFRONT'}
          </div>
          <h2 className="font-display mt-2 text-2xl font-extrabold tracking-tight sm:text-4xl">
            {locale === 'vi'
              ? '9 Sản Phẩm Live — Chọn Mẫu, Tùy Biến Thương Hiệu & Chạy Ngay.'
              : '9 Live Commercial Products — Rebrand, Deploy & Launch Fast.'}
          </h2>
          <p className="mt-3 text-sm leading-relaxed sm:text-base" style={{ color: 'var(--ink-secondary)' }}>
            {locale === 'vi'
              ? 'Mỗi mẫu được định giá vừa phải theo đúng độ phức tạp, đều có Demo Live thật 100%, bao gồm hỗ trợ trong quá trình sử dụng và nhận tinh chỉnh giao diện/tính năng theo yêu cầu. Chọn Standard Deploy hoặc Full Source + Tinh Chỉnh Sâu (+30%).'
              : 'Fairly priced by actual complexity with live interactive sandboxes, ongoing usage support, and custom refinements. Pick Standard Deploy or Full Source + Deep Customization (+30%).'}
          </p>
        </div>

        {/* License Legend Pill */}
        <div
          className="surface-elevated flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-xs"
          style={{ color: 'var(--ink-secondary)' }}
        >
          <IconLayers className="h-4 w-4 shrink-0" style={{ color: 'var(--accent)' }} />
          <div>
            <span className="font-semibold" style={{ color: 'var(--ink-primary)' }}>
              {locale === 'vi' ? 'Mã ưu đãi khai trương: ' : 'Launch promo codes: '}
            </span>
            <span className="font-mono-num font-semibold" style={{ color: 'var(--accent)' }}>
              TVTLAUNCH15
            </span>
            <span> · </span>
            <span className="font-mono-num font-semibold" style={{ color: 'var(--ink-primary)' }}>
              VIP500K
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div
        className="mt-8 flex flex-col justify-between gap-4 border-y py-4 lg:flex-row lg:items-center"
        style={{ borderColor: 'var(--border-hairline)' }}
      >
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Product categories">
          {categoryTabs.map((tab) => {
            const active = category === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(tab.id)}
                className="inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-all sm:text-sm"
                style={{
                  backgroundColor: active ? 'var(--accent)' : 'var(--bg-surface)',
                  borderColor: active ? 'var(--accent)' : 'var(--border-hairline)',
                  color: active ? '#ffffff' : 'var(--ink-secondary)',
                }}
              >
                <span>{tab.label}</span>
                <span
                  className="font-mono-num rounded px-1.5 py-0.5 text-[10px]"
                  style={{
                    backgroundColor: active ? 'rgba(0,0,0,0.22)' : 'var(--bg-elevated)',
                    color: active ? '#ffffff' : 'var(--ink-muted)',
                  }}
                >
                  {counts[tab.id]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search + Sort */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:w-60">
            <IconSearch
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === 'vi' ? 'Tìm tên mẫu, POS, 3D, .NET...' : 'Search template, POS, 3D, AI...'}
              className="input-studio h-10 w-full rounded-lg pr-3 pl-9 text-xs sm:text-sm"
              aria-label={locale === 'vi' ? 'Tìm kiếm mẫu website' : 'Search templates'}
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as CatalogSort)}
            className="input-studio h-10 rounded-lg px-3 text-xs font-medium sm:text-sm"
            aria-label={locale === 'vi' ? 'Sắp xếp sản phẩm' : 'Sort products'}
          >
            <option value="featured">{locale === 'vi' ? 'Sắp xếp: Nổi bật' : 'Sort: Featured'}</option>
            <option value="price-asc">{locale === 'vi' ? 'Giá: Thấp → Cao' : 'Price: Low → High'}</option>
            <option value="price-desc">{locale === 'vi' ? 'Giá: Cao → Thấp' : 'Price: High → Low'}</option>
            <option value="fastest">{locale === 'vi' ? 'Bàn giao nhanh nhất' : 'Fastest Delivery'}</option>
          </select>
        </div>
      </div>

      {/* Active Compare Strip */}
      {compareIds.length > 0 && (
        <div
          className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3"
          style={{
            backgroundColor: 'var(--accent-soft)',
            borderColor: 'var(--accent-border)',
          }}
        >
          <div className="text-xs font-semibold sm:text-sm">
            {locale === 'vi'
              ? `Đang chọn so sánh ${compareIds.length}/3 mẫu website theo độ phức tạp & chi phí.`
              : `Comparing ${compareIds.length}/3 templates side-by-side.`}
          </div>
          <button
            type="button"
            onClick={onOpenCompare}
            className="btn-primary rounded-lg px-3.5 py-2 text-xs font-semibold"
            data-testid="open-compare-drawer-btn"
          >
            {locale === 'vi' ? `Mở Bảng So Sánh (${compareIds.length})` : `Open Comparison (${compareIds.length})`}
          </button>
        </div>
      )}

      {/* Product Grid */}
      {visibleProducts.length === 0 ? (
        <div className="surface-card mt-8 rounded-2xl p-12 text-center">
          <p className="text-base font-semibold">
            {locale === 'vi' ? 'Không tìm thấy sản phẩm phù hợp với từ khóa hiện tại.' : 'No templates match your current filter.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setCategory('all');
              setSearchQuery('');
            }}
            className="btn-secondary mt-4 rounded-lg px-4 py-2 text-xs font-semibold"
          >
            {locale === 'vi' ? 'Đặt lại bộ lọc' : 'Reset filters'}
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleProducts.map((product) => {
            const selectedLicense = cardLicenses[product.id] ?? 'standard';
            const activePrice = getLicensePrice(product, selectedLicense, currency);
            const originalPrice = getOriginalLicensePrice(product, selectedLicense, currency);
            const savingsPct = getSavingsPercent(product, currency);
            const isJustAdded = recentlyAddedId === product.id;
            const complexity = getComplexityBadge(product.priceVnd, locale);
            const isCompared = compareIds.includes(product.id);

            return (
              <article
                key={product.id}
                className="surface-card group flex flex-col overflow-hidden rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)]"
                data-testid={`product-card-${product.id}`}
              >
                {/* Preview Media */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0c0e13]">
                  <img
                    src={product.previewImage}
                    alt={`${product.name} — ${product.subtitle[locale]}`}
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(9,10,13,0.45) 0%, rgba(9,10,13,0) 42%, rgba(9,10,13,0.72) 100%)',
                    }}
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3 right-3 left-3 flex items-center justify-between gap-2">
                    <span className="rounded-md border border-white/15 bg-black/65 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                      {product.categoryLabel[locale]}
                    </span>
                    <span className="font-mono-num inline-flex items-center gap-1 rounded-md border border-white/15 bg-black/65 px-2 py-1 text-[10px] font-medium text-white/90 backdrop-blur-md">
                      <IconClock className="h-3 w-3" />
                      {formatDeliveryRange(product, locale)}
                    </span>
                  </div>

                  {/* Bottom Domain Tag / Quick Live Trigger */}
                  <div className="absolute right-3 bottom-3 left-3 flex items-center justify-between gap-2">
                    <span className="font-mono-num truncate rounded bg-black/70 px-2 py-1 text-[10px] font-medium text-white/85 backdrop-blur-md">
                      {product.previewBadge ?? product.metricsBadge}
                    </span>
                    <button
                      type="button"
                      onClick={() => onPreviewLive(product)}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-white/25 bg-black/75 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)]"
                    >
                      <IconMonitor className="h-3.5 w-3.5" />
                      <span>{locale === 'vi' ? 'Live Sandbox' : 'Live Sandbox'}</span>
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-num text-[11px] font-semibold" style={{ color: 'var(--ink-muted)' }}>
                        {product.sku}
                      </span>
                      <span
                        className="font-mono-num rounded border px-1.5 py-0.5 text-[10px] font-semibold"
                        style={{
                          borderColor: 'var(--border-hairline)',
                          backgroundColor: 'var(--bg-elevated)',
                          color: complexity.colorVar,
                        }}
                      >
                        {complexity.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onToggleCompare(product.id)}
                        data-testid={`compare-toggle-${product.id}`}
                        className="rounded-md border px-2 py-0.5 text-[10px] font-semibold transition-colors"
                        style={{
                          backgroundColor: isCompared ? 'var(--accent)' : 'var(--bg-elevated)',
                          borderColor: isCompared ? 'var(--accent)' : 'var(--border-hairline)',
                          color: isCompared ? '#ffffff' : 'var(--ink-secondary)',
                        }}
                      >
                        {isCompared
                          ? locale === 'vi'
                            ? '✓ Đã chọn'
                            : '✓ Selected'
                          : locale === 'vi'
                            ? '+ So sánh'
                            : '+ Compare'}
                      </button>
                      <a
                        href={product.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-medium transition-colors hover:text-[var(--accent)]"
                        style={{ color: 'var(--ink-muted)' }}
                        aria-label={`Open ${product.name} in new tab`}
                      >
                        <IconExternal className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>

                  <h3 className="font-display mt-1.5 text-lg font-bold tracking-tight">
                    {product.name}
                  </h3>
                  <p className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                    {product.subtitle[locale]}
                  </p>
                  <p
                    className="mt-2.5 line-clamp-2 text-xs leading-relaxed sm:text-[13px]"
                    style={{ color: 'var(--ink-secondary)' }}
                  >
                    {product.tagline[locale]}
                  </p>

                  {/* Tech Stack Chips */}
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {product.stack.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono-num rounded-md border px-2 py-0.5 text-[10px] font-medium"
                        style={{
                          backgroundColor: 'var(--bg-elevated)',
                          borderColor: 'var(--border-hairline)',
                          color: 'var(--ink-secondary)',
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* License Tier Switcher */}
                  <div
                    className="mt-4 grid grid-cols-2 gap-1 rounded-lg border p-1"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--border-hairline)',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleCardLicense(product.id, 'standard')}
                      className="rounded-md px-2 py-1.5 text-[11px] font-semibold transition-colors"
                      style={{
                        backgroundColor: selectedLicense === 'standard' ? 'var(--bg-surface)' : 'transparent',
                        color: selectedLicense === 'standard' ? 'var(--ink-primary)' : 'var(--ink-muted)',
                      }}
                    >
                      Standard Deploy
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCardLicense(product.id, 'full-source')}
                      className="rounded-md px-2 py-1.5 text-[11px] font-semibold transition-colors"
                      style={{
                        backgroundColor: selectedLicense === 'full-source' ? 'var(--bg-surface)' : 'transparent',
                        color: selectedLicense === 'full-source' ? 'var(--accent)' : 'var(--ink-muted)',
                      }}
                    >
                      Full Source +30%
                    </button>
                  </div>

                  {/* Pricing Row */}
                  <div
                    className="mt-4 flex items-baseline justify-between gap-2 border-t pt-4"
                    style={{ borderColor: 'var(--border-hairline)' }}
                  >
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono-num text-xl font-bold" style={{ color: 'var(--ink-primary)' }}>
                          {formatMoney(activePrice, currency)}
                        </span>
                        <span
                          className="font-mono-num text-xs line-through"
                          style={{ color: 'var(--ink-muted)' }}
                        >
                          {formatMoney(originalPrice, currency)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px]" style={{ color: 'var(--ink-muted)' }}>
                        {selectedLicense === 'standard'
                          ? locale === 'vi'
                            ? 'Triển khai trọn gói + gắn domain riêng'
                            : 'Turnkey rebranded live deployment'
                          : locale === 'vi'
                            ? 'Bàn giao 100% Source Code + Custom Brand'
                            : '100% Source Code + Custom Brand Setup'}
                      </p>
                    </div>
                    {savingsPct > 0 && (
                      <span
                        className="font-mono-num shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold"
                        style={{
                          backgroundColor: 'var(--emerald-soft)',
                          color: 'var(--emerald)',
                        }}
                      >
                        -{savingsPct}%
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 grid grid-cols-12 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onPreviewLive(product)}
                      className="btn-ghost col-span-4 inline-flex items-center justify-center gap-1 rounded-xl px-2.5 py-2.5 text-xs font-semibold"
                    >
                      <IconMonitor className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{locale === 'vi' ? 'Demo' : 'Demo'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onInspectDetails(product, selectedLicense)}
                      className="btn-ghost col-span-3 inline-flex items-center justify-center rounded-xl px-2 py-2.5 text-xs font-semibold"
                    >
                      {locale === 'vi' ? 'Chi Tiết' : 'Specs'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAdd(product)}
                      className="btn-primary col-span-5 inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold"
                      data-testid={`add-to-cart-${product.id}`}
                    >
                      {isJustAdded ? (
                        <>
                          <IconCheck className="h-3.5 w-3.5" />
                          <span>{locale === 'vi' ? 'Đã Thêm' : 'Added'}</span>
                        </>
                      ) : (
                        <>
                          <IconCart className="h-3.5 w-3.5" />
                          <span>{locale === 'vi' ? 'Thêm Giỏ' : 'Add Cart'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenInquiry(product)}
                    data-testid={`inquire-${product.id}`}
                    className="btn-ghost mt-2 w-full rounded-xl py-2 text-[11px] font-semibold transition-colors hover:text-[var(--accent)]"
                  >
                    {locale === 'vi'
                      ? 'Tư vấn tinh chỉnh / Thương lượng giá riêng →'
                      : 'Request custom tuning / Direct negotiation →'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
