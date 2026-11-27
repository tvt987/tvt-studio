import React, { useMemo, useState } from 'react';
import {
  countCatalogStacks,
  filterAndSortCatalog,
  filterCatalogByStack,
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
  TechStackFilter,
  TemplateProduct,
} from '../engines/types';
import {
  IconArrowUpRight,
  IconCart,
  IconCheck,
  IconExternal,
  IconLayers,
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
  const [stackFilter, setStackFilter] = useState<TechStackFilter>('all');
  const [vipOnly, setVipOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<CatalogSort>('featured');
  const [cardLicenses, setCardLicenses] = useState<Record<string, LicenseTier>>({});
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const counts = useMemo(() => getCategoryCounts(products), [products]);
  const stackCounts = useMemo(() => countCatalogStacks(products), [products]);
  const vipCount = useMemo(() => products.filter((p) => p.priceVnd >= 10_000_000).length, [products]);

  const visibleProducts = useMemo(() => {
    const byCategoryAndQuery = filterAndSortCatalog(products, category, searchQuery, sortBy);
    const byStack = filterCatalogByStack(byCategoryAndQuery, stackFilter);
    return vipOnly ? byStack.filter((p) => p.priceVnd >= 10_000_000) : byStack;
  }, [products, category, stackFilter, searchQuery, sortBy, vipOnly]);

  const hasActiveFilters =
    category !== 'all' ||
    stackFilter !== 'all' ||
    vipOnly ||
    searchQuery.trim().length > 0;

  const stackTabs: Array<{ id: TechStackFilter; label: string }> = [
    { id: 'all', label: locale === 'vi' ? 'All Stacks' : 'All Stacks' },
    { id: 'dotnet', label: '.NET 10 Backend' },
    { id: 'fastapi', label: 'Python FastAPI' },
    { id: 'threejs', label: 'Three.js 3D PBR' },
    { id: 'ai-rag', label: 'AI / RAG / MCP' },
  ];

  const categoryTabs: Array<{ id: ProductCategory; label: string }> = [
    { id: 'all', label: locale === 'vi' ? 'Tất Cả' : 'All' },
    { id: 'commerce-3d', label: locale === 'vi' ? '3D & Nội Thất' : '3D & Luxury' },
    { id: 'clinic-proptech', label: locale === 'vi' ? 'Y Tế & BĐS' : 'Clinic & PropTech' },
    { id: 'pos-fnb', label: locale === 'vi' ? 'Resort & F&B' : 'Resort & F&B' },
    { id: 'enterprise-b2b', label: locale === 'vi' ? 'FinTech & B2B' : 'FinTech & B2B' },
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
    <section id="catalog" className="mx-auto max-w-[1360px] scroll-mt-20 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      {/* Crisp Editorial Section Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="font-mono-num text-[11px] font-semibold tracking-[0.16em] uppercase" style={{ color: 'var(--accent)' }}>
            01 · {locale === 'vi' ? 'BỘ SƯU TẬP FLAGSHIP' : 'FLAGSHIP COLLECTION'}
          </div>
          <h2 className="font-display mt-2 text-2xl font-extrabold tracking-tight sm:text-4xl">
            {locale === 'vi' ? `${products.length} Hệ Thống & Website Live` : `${products.length} Live Commercial Systems`}
          </h2>
        </div>

        {/* Compact Promo Pill */}
        <div
          className="surface-elevated inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs"
          style={{ color: 'var(--ink-secondary)' }}
        >
          <span>{locale === 'vi' ? 'Ưu đãi:' : 'Promo:'}</span>
          <span className="font-mono-num font-bold" style={{ color: 'var(--accent)' }}>
            TVTLAUNCH15
          </span>
          <span style={{ color: 'var(--ink-muted)' }}>·</span>
          <span className="font-mono-num font-bold" style={{ color: 'var(--ink-primary)' }}>
            VIP500K
          </span>
        </div>
      </div>

      {/* Clean Filter & Search Bar */}
      <div
        className="mt-7 flex flex-col justify-between gap-3.5 border-y py-3.5 lg:flex-row lg:items-center"
        style={{ borderColor: 'var(--border-hairline)' }}
      >
        <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Product categories">
          {categoryTabs.map((tab) => {
            const active = category === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(tab.id)}
                className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all"
                style={{
                  backgroundColor: active ? 'var(--accent)' : 'transparent',
                  borderColor: active ? 'var(--accent)' : 'var(--border-hairline)',
                  color: active ? '#ffffff' : 'var(--ink-secondary)',
                }}
              >
                <span>{tab.label}</span>
                <span
                  className="font-mono-num text-[10px] opacity-75"
                  style={{ color: active ? '#ffffff' : 'var(--ink-muted)' }}
                >
                  {counts[tab.id]}
                </span>
              </button>
            );
          })}
        </div>

        {/* VIP Toggle + Search + Sort */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => setVipOnly((v) => !v)}
            data-testid="filter-vip-10m-btn"
            className="inline-flex h-9 shrink-0 items-center justify-center rounded-full border px-3.5 text-xs font-bold transition-all"
            style={{
              backgroundColor: vipOnly ? 'var(--accent)' : 'var(--accent-soft)',
              borderColor: 'var(--accent)',
              color: vipOnly ? '#ffffff' : 'var(--accent)',
            }}
          >
            {locale === 'vi' ? `VIP 10M+ (${vipCount})` : `VIP 10M+ (${vipCount})`}
          </button>

          <div className="relative flex-1 sm:w-48">
            <IconSearch
              className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 opacity-60"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === 'vi' ? 'Tìm mẫu 3D, AI, POS...' : 'Search 3D, AI, POS...'}
              className="input-studio h-9 w-full rounded-full pr-3 pl-8 text-xs"
              aria-label={locale === 'vi' ? 'Tìm kiếm mẫu website' : 'Search templates'}
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as CatalogSort)}
            className="input-studio h-9 rounded-full px-3 text-xs font-medium"
            aria-label={locale === 'vi' ? 'Sắp xếp sản phẩm' : 'Sort products'}
          >
            <option value="featured">{locale === 'vi' ? 'Nổi bật nhất' : 'Featured'}</option>
            <option value="price-desc">{locale === 'vi' ? 'Giá cao → thấp' : 'Price: High → Low'}</option>
            <option value="price-asc">{locale === 'vi' ? 'Giá thấp → cao' : 'Price: Low → High'}</option>
            <option value="fastest">{locale === 'vi' ? 'Bàn giao nhanh' : 'Fastest'}</option>
          </select>
        </div>
      </div>

      {/* Architectural Tech-Stack Filter Pill Strip */}
      <div
        className="flex flex-col justify-between gap-2.5 border-b py-3 sm:flex-row sm:items-center"
        style={{ borderColor: 'var(--border-hairline)' }}
        data-testid="tech-stack-filter-bar"
      >
        <div
          className="flex flex-wrap items-center gap-1.5"
          role="group"
          aria-label={locale === 'vi' ? 'Lọc theo kiến trúc công nghệ' : 'Filter by engineering stack'}
        >
          <span
            className="font-mono-num mr-1 inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.14em] uppercase"
            style={{ color: 'var(--ink-muted)' }}
          >
            <IconLayers className="h-3.5 w-3.5" style={{ color: 'var(--cyan)' }} />
            <span>{locale === 'vi' ? 'KIẾN TRÚC' : 'STACK'}</span>
          </span>

          {stackTabs.map((chip) => {
            const active = stackFilter === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                aria-pressed={active}
                data-testid={`stack-filter-${chip.id}`}
                onClick={() => setStackFilter(chip.id)}
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold transition-all"
                style={{
                  backgroundColor: active ? 'var(--ink-primary)' : 'var(--bg-surface)',
                  borderColor: active ? 'var(--ink-primary)' : 'var(--border-hairline)',
                  color: active ? 'var(--bg-surface)' : 'var(--ink-secondary)',
                }}
              >
                {active && (
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: 'var(--cyan)' }}
                  />
                )}
                <span>{chip.label}</span>
                <span
                  className="font-mono-num text-[10px]"
                  style={{
                    color: active ? 'var(--bg-surface)' : 'var(--ink-muted)',
                    opacity: active ? 0.85 : 1,
                  }}
                >
                  ({stackCounts[chip.id]})
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-2.5 text-[11px]">
          <span
            className="font-mono-num font-semibold"
            style={{ color: 'var(--ink-secondary)' }}
            data-testid="catalog-visible-count"
          >
            {locale === 'vi'
              ? `Hiển thị ${visibleProducts.length}/${products.length} hệ thống`
              : `Showing ${visibleProducts.length}/${products.length} systems`}
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              data-testid="catalog-reset-filters-btn"
              onClick={() => {
                setCategory('all');
                setStackFilter('all');
                setVipOnly(false);
                setSearchQuery('');
              }}
              className="font-mono-num rounded-full border px-2.5 py-0.5 text-[10px] font-bold transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              style={{
                borderColor: 'var(--border-strong)',
                color: 'var(--ink-secondary)',
                backgroundColor: 'var(--bg-surface)',
              }}
            >
              {locale === 'vi' ? 'Đặt lại' : 'Reset'}
            </button>
          )}
        </div>
      </div>

      {/* Active Compare Strip */}
      {compareIds.length > 0 && (
        <div
          className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3"
          style={{
            backgroundColor: 'var(--accent-soft)',
            borderColor: 'var(--accent-border)',
          }}
        >
          <div className="text-xs font-semibold sm:text-sm">
            {locale === 'vi'
              ? `Đang chọn so sánh ${compareIds.length}/3 mẫu`
              : `Comparing ${compareIds.length}/3 templates`}
          </div>
          <button
            type="button"
            onClick={onOpenCompare}
            className="btn-primary rounded-full px-4 py-1.5 text-xs font-semibold"
            data-testid="open-compare-drawer-btn"
          >
            {locale === 'vi' ? `So Sánh Ngay (${compareIds.length})` : `Compare Now (${compareIds.length})`}
          </button>
        </div>
      )}

      {/* Luxury Gallery Product Grid */}
      {visibleProducts.length === 0 ? (
        <div className="surface-card mt-8 rounded-2xl p-12 text-center">
          <p className="text-sm font-semibold">
            {locale === 'vi' ? 'Không tìm thấy mẫu phù hợp.' : 'No templates match your filter.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setCategory('all');
              setStackFilter('all');
              setVipOnly(false);
              setSearchQuery('');
            }}
            className="btn-secondary mt-4 rounded-full px-5 py-2 text-xs font-semibold"
          >
            {locale === 'vi' ? 'Đặt lại bộ lọc' : 'Reset filters'}
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
          {visibleProducts.map((product) => {
            const selectedLicense = cardLicenses[product.id] ?? 'standard';
            const activePrice = getLicensePrice(product, selectedLicense, currency);
            const originalPrice = getOriginalLicensePrice(product, selectedLicense, currency);
            const savingsPct = getSavingsPercent(product, currency);
            const isJustAdded = recentlyAddedId === product.id;
            const isCompared = compareIds.includes(product.id);
            const isUltra = product.priceVnd >= 20_000_000;
            const isVip = product.priceVnd >= 10_000_000;

            return (
              <article
                key={product.id}
                className={`card-luxury group flex flex-col overflow-hidden rounded-3xl ${isUltra ? 'card-ultra' : ''}`}
                data-testid={`product-card-${product.id}`}
              >
                {/* Unobstructed Full-Bleed Subject Artwork */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => onPreviewLive(product)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onPreviewLive(product);
                    }
                  }}
                  aria-label={`Live Demo ${product.name}`}
                  className="relative aspect-[16/10] w-full cursor-pointer overflow-hidden bg-[#07080b]"
                >
                  <img
                    src={product.previewImage}
                    alt={`${product.name} — ${product.subtitle[locale]}`}
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />

                  {/* Whisper-Subtle Bottom Vignette Only — Keeps Subject 100% Clear */}
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(7,8,11,0.14) 0%, rgba(7,8,11,0) 32%, rgba(7,8,11,0) 68%, rgba(7,8,11,0.62) 100%)',
                    }}
                  />

                  {/* Single Top-Left Tier Pill */}
                  <div className="absolute top-3.5 left-3.5">
                    {product.priceVnd >= 25_000_000 ? (
                      <span className="badge-ultra-gold font-mono-num inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-extrabold tracking-wider uppercase">
                        ULTRA
                      </span>
                    ) : isVip ? (
                      <span
                        className="font-mono-num inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-white uppercase shadow-md"
                        style={{ backgroundColor: 'var(--accent)' }}
                      >
                        VIP PRO
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full border border-white/15 bg-black/50 px-2.5 py-1 text-[10px] font-semibold text-white/90 backdrop-blur-md">
                        {product.categoryLabel[locale]}
                      </span>
                    )}
                  </div>

                  {/* Single Bottom-Right Live Demo Trigger Pill */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreviewLive(product);
                    }}
                    className="absolute right-3.5 bottom-3.5 inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/55 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md transition-all hover:border-[var(--accent)] hover:bg-[var(--accent)]"
                  >
                    <span>Live Demo</span>
                    <IconArrowUpRight className="h-3 w-3" />
                  </button>
                </div>

                {/* Ultra-Clean 4-Row Luxury Body */}
                <div className="flex flex-1 flex-col px-5 pt-4 pb-5">
                  {/* Row 1: Title + Subtle Utility Controls */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display truncate text-[18px] font-bold tracking-tight" style={{ color: 'var(--ink-primary)' }}>
                      {product.name}
                    </h3>
                    <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
                      <button
                        type="button"
                        onClick={() => onToggleCompare(product.id)}
                        data-testid={`compare-toggle-${product.id}`}
                        className="rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-colors"
                        style={{
                          backgroundColor: isCompared ? 'var(--accent)' : 'transparent',
                          borderColor: isCompared ? 'var(--accent)' : 'var(--border-hairline)',
                          color: isCompared ? '#ffffff' : 'var(--ink-muted)',
                        }}
                        title={locale === 'vi' ? 'So sánh mẫu' : 'Compare'}
                      >
                        {isCompared ? '✓' : locale === 'vi' ? '+ So sánh' : '+ Compare'}
                      </button>
                      <a
                        href={product.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--accent)]"
                        style={{ color: 'var(--ink-muted)' }}
                        aria-label={`Open ${product.name} in new tab`}
                      >
                        <IconExternal className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Row 2: Single Crisp 1-Line Subject Caption + Quiet Meta */}
                  <p
                    className="mt-1 truncate text-[13px]"
                    style={{ color: 'var(--ink-secondary)' }}
                    title={product.subtitle[locale]}
                  >
                    {product.subtitle[locale]}
                  </p>
                  <div
                    className="font-mono-num mt-1.5 text-[11px]"
                    style={{ color: 'var(--ink-muted)' }}
                  >
                    {product.categoryLabel[locale]} · {formatDeliveryRange(product, locale)}
                  </div>

                  {/* Row 3: Clean Price + Compact Inline License Toggle */}
                  <div
                    className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3.5"
                    style={{ borderColor: 'var(--border-hairline)' }}
                  >
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span
                          className="font-mono-num text-[21px] font-bold tracking-tight"
                          style={{ color: 'var(--ink-primary)' }}
                        >
                          {formatMoney(activePrice, currency)}
                        </span>
                        {savingsPct > 0 && (
                          <span
                            className="font-mono-num rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                            style={{
                              backgroundColor: 'var(--emerald-soft)',
                              color: 'var(--emerald)',
                            }}
                          >
                            -{savingsPct}%
                          </span>
                        )}
                      </div>
                      <div
                        className="font-mono-num text-[11px] line-through opacity-65"
                        style={{ color: 'var(--ink-muted)' }}
                      >
                        {formatMoney(originalPrice, currency)}
                      </div>
                    </div>

                    {/* Sleek Compact License Pill */}
                    <div
                      className="inline-flex shrink-0 items-center rounded-full border p-0.5"
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        borderColor: 'var(--border-hairline)',
                      }}
                      role="group"
                      aria-label={`License tier for ${product.name}`}
                    >
                      <button
                        type="button"
                        onClick={() => handleCardLicense(product.id, 'standard')}
                        className="rounded-full px-2.5 py-1 text-[10px] font-semibold transition-all"
                        style={{
                          backgroundColor: selectedLicense === 'standard' ? 'var(--bg-surface)' : 'transparent',
                          color: selectedLicense === 'standard' ? 'var(--ink-primary)' : 'var(--ink-muted)',
                        }}
                      >
                        Deploy
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCardLicense(product.id, 'full-source')}
                        className="rounded-full px-2.5 py-1 text-[10px] font-semibold transition-all"
                        style={{
                          backgroundColor: selectedLicense === 'full-source' ? 'var(--bg-surface)' : 'transparent',
                          color: selectedLicense === 'full-source' ? 'var(--accent)' : 'var(--ink-muted)',
                        }}
                      >
                        Source +30%
                      </button>
                    </div>
                  </div>

                  {/* Row 4: Crisp Single Action Row */}
                  <div className="mt-4 grid grid-cols-12 gap-2">
                    <button
                      type="button"
                      onClick={() => onInspectDetails(product, selectedLicense)}
                      data-testid={`product-specs-${product.id}`}
                      className="btn-ghost col-span-4 inline-flex items-center justify-center rounded-xl px-2 py-2.5 text-xs font-semibold"
                    >
                      {locale === 'vi' ? 'Chi Tiết' : 'Specs'}
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenInquiry(product)}
                      data-testid={`inquire-${product.id}`}
                      className="btn-ghost col-span-3 inline-flex items-center justify-center rounded-xl px-2 py-2.5 text-xs font-semibold hover:text-[var(--accent)]"
                    >
                      {locale === 'vi' ? 'Tư Vấn' : 'Chat'}
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
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
