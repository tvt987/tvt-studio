import React, { useMemo, useState } from 'react';
import { formatMoney } from '../engines/catalog';
import {
  calculateCustomEstimate,
  generateTechnicalProposalMarkdown,
  PREFERRED_STACK_OPTIONS,
  PROJECT_TYPES,
  SCOPE_ADDONS,
} from '../engines/estimator';
import type {
  AddonId,
  Currency,
  CustomScopeConfig,
  DeliveryPace,
  Locale,
  ProjectTypeId,
} from '../engines/types';
import { downloadTextFile } from '../utils/download';
import {
  IconCart,
  IconCheck,
  IconClock,
  IconDownload,
  IconShield,
  IconSliders,
} from './Icons';

interface CustomEstimatorSectionProps {
  locale: Locale;
  currency: Currency;
  onAddCustomToCart: (config: CustomScopeConfig) => void;
}

export const CustomEstimatorSection: React.FC<CustomEstimatorSectionProps> = ({
  locale,
  currency,
  onAddCustomToCart,
}) => {
  const [projectType, setProjectType] = useState<ProjectTypeId>('growth-webapp');
  const [selectedAddons, setSelectedAddons] = useState<AddonId[]>(['payment-gateway', 'seo-cwv']);
  const [pace, setPace] = useState<DeliveryPace>('standard');
  const [projectName, setProjectName] = useState('');
  const [preferredStack, setPreferredStack] = useState<string>('flexible');
  const [addedFeedback, setAddedFeedback] = useState(false);

  const selectedStackLabel = useMemo(() => {
    const found = PREFERRED_STACK_OPTIONS.find((opt) => opt.id === preferredStack);
    return found ? found[locale] : PREFERRED_STACK_OPTIONS[0][locale];
  }, [preferredStack, locale]);

  const config: CustomScopeConfig = useMemo(
    () => ({
      projectType,
      selectedAddons,
      pace,
      projectName,
      preferredStack: selectedStackLabel,
    }),
    [projectType, selectedAddons, pace, projectName, selectedStackLabel]
  );

  const estimate = useMemo(() => calculateCustomEstimate(config), [config]);

  const toggleAddon = (id: AddonId) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddCustom = () => {
    onAddCustomToCart(config);
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 1600);
  };

  const handleDownloadProposal = () => {
    const markdown = generateTechnicalProposalMarkdown(config, estimate, locale);
    const slug = (projectName.trim() || projectType).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    downloadTextFile(`TVT-Studio-Proposal-${slug}.md`, markdown);
  };

  return (
    <section
      id="estimator"
      className="scroll-mt-20 border-t py-16 lg:py-24"
      style={{
        borderColor: 'var(--border-hairline)',
        backgroundColor: 'var(--bg-surface)',
      }}
    >
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        {/* Architectural Banner Intro */}
        <div
          className="relative overflow-hidden rounded-2xl border"
          style={{ borderColor: 'var(--border-hairline)' }}
        >
          <img
            src="./media/studio-banner.webp"
            alt="TVT Studio Custom Engineering Architecture"
            width={1400}
            height={788}
            decoding="async"
            className="h-56 w-full object-cover sm:h-64"
          />
          <div
            className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8"
            style={{
              background:
                'linear-gradient(90deg, rgba(9,10,13,0.92) 0%, rgba(9,10,13,0.74) 58%, rgba(9,10,13,0.3) 100%)',
            }}
          >
            <span className="font-mono-num text-xs font-semibold tracking-widest uppercase" style={{ color: '#f25c2a' }}>
              02 // {locale === 'vi' ? 'DỊCH VỤ CODE THEO YÊU CẦU' : 'CUSTOM IT ENGINEERING'}
            </span>
            <h2 className="font-display mt-2 max-w-2xl text-2xl font-extrabold text-white sm:text-4xl">
              {locale === 'vi'
                ? 'Thiết Kế & Code Theo Yêu Cầu Mọi Ngôn Ngữ — Giá Hợp Lý, Hỗ Trợ Tận Tâm.'
                : 'Custom Design & Polyglot Engineering — Fair Pricing, Ongoing Support.'}
            </h2>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-white/80 sm:text-sm">
              {locale === 'vi'
                ? 'Nhận thiết kế web, tinh chỉnh tính năng và lập trình theo BẤT KỲ ngôn ngữ/nền tảng nào bạn yêu cầu (React, Next.js, Vue, Angular, Node.js, Python, .NET, Java, Go, PHP/Laravel, WordPress...) — đồng hành hỗ trợ xuyên suốt quá trình sử dụng.'
                : 'Bespoke websites, feature tuning, and full-stack builds in ANY language or framework you require (React, Next.js, Vue, Angular, Node.js, Python, .NET, Java, Go, PHP/Laravel, WordPress...) — backed by dedicated ongoing support.'}
            </p>
          </div>
        </div>

        {/* 3 Transparent Service Tiers */}
        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {PROJECT_TYPES.map((tier) => {
            const isSelected = projectType === tier.id;
            return (
              <div
                key={tier.id}
                className="flex flex-col justify-between rounded-2xl border p-6 transition-all"
                style={{
                  backgroundColor: isSelected ? 'var(--bg-elevated)' : 'var(--bg-canvas)',
                  borderColor: isSelected ? 'var(--accent)' : 'var(--border-hairline)',
                  boxShadow: isSelected ? '0 0 0 1px var(--accent)' : 'none',
                }}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono-num text-xs font-semibold uppercase" style={{ color: 'var(--ink-muted)' }}>
                      {tier.id === 'starter-landing'
                        ? 'TIER 01'
                        : tier.id === 'growth-webapp'
                          ? 'TIER 02'
                          : 'TIER 03'}
                    </span>
                    {tier.badge && (
                      <span
                        className="font-mono-num rounded-md px-2 py-0.5 text-[10px] font-bold"
                        style={{
                          backgroundColor: 'var(--accent-soft)',
                          color: 'var(--accent)',
                        }}
                      >
                        {tier.badge[locale]}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display mt-2 text-lg font-bold">{tier.tierName[locale]}</h3>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-mono-num text-2xl font-extrabold" style={{ color: 'var(--ink-primary)' }}>
                      {currency === 'VND' ? tier.priceRangeDisplay[locale] : tier.priceRangeUsdDisplay}
                    </span>
                    <span className="font-mono-num text-xs" style={{ color: 'var(--ink-muted)' }}>
                      · {locale === 'vi' ? `từ ${tier.baseDays} ngày` : `from ${tier.baseDays} days`}
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed sm:text-sm" style={{ color: 'var(--ink-secondary)' }}>
                    {tier.summary[locale]}
                  </p>

                  <ul className="mt-4 space-y-2 border-t pt-4" style={{ borderColor: 'var(--border-hairline)' }}>
                    {tier.idealFor[locale].map((point) => (
                      <li key={point} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
                        <IconCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: 'var(--emerald)' }} />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => setProjectType(tier.id)}
                  className={`mt-6 w-full rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                    isSelected ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  {isSelected
                    ? locale === 'vi'
                      ? 'Đang Chọn Trong Bộ Tính Giá'
                      : 'Selected In Configurator'
                    : locale === 'vi'
                      ? 'Chọn Gói Này Để Cấu Hình'
                      : 'Configure This Tier'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Interactive Smart Scope & Price Calculator */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Configurator Controls */}
          <div
            className="rounded-2xl border p-6 lg:col-span-7"
            style={{
              backgroundColor: 'var(--bg-canvas)',
              borderColor: 'var(--border-hairline)',
            }}
          >
            <div className="flex items-center justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--border-hairline)' }}>
              <div className="flex items-center gap-2.5">
                <IconSliders className="h-5 w-5" style={{ color: 'var(--accent)' }} />
                <div>
                  <h3 className="font-display text-base font-bold sm:text-lg">
                    {locale === 'vi' ? 'Bộ Tính Báo Giá Thông Minh' : 'Interactive Scope Configurator'}
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                    {locale === 'vi'
                      ? 'Bật/tắt các tính năng mở rộng để tính chi phí & thời gian thực tế.'
                      : 'Toggle add-on capabilities to compute exact investment and delivery schedule.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Optional Project Name */}
            <div className="mt-5">
              <label
                htmlFor="custom-project-name"
                className="block text-xs font-semibold uppercase"
                style={{ color: 'var(--ink-secondary)' }}
              >
                {locale === 'vi' ? 'Tên dự án / Thương hiệu dự kiến (Tùy chọn)' : 'Project / Brand Name (Optional)'}
              </label>
              <input
                id="custom-project-name"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder={
                  locale === 'vi'
                    ? 'Ví dụ: Hệ thống Đặt Lịch Nha Khoa Lumina Sài Gòn'
                    : 'e.g., Apex Dental Booking & VietQR Portal'
                }
                className="input-studio mt-2 h-11 w-full rounded-xl px-3.5 text-sm"
              />
            </div>

            {/* Polyglot Language & Stack Selector */}
            <div className="mt-5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase" style={{ color: 'var(--ink-secondary)' }}>
                  {locale === 'vi'
                    ? 'Ngôn Ngữ / Nền Tảng Mong Muốn (Nhận Mọi Ngôn Ngữ)'
                    : 'Preferred Tech Stack (Any Language Supported)'}
                </span>
                <span className="font-mono-num text-[11px]" style={{ color: 'var(--emerald)' }}>
                  {locale === 'vi' ? 'Đa nền tảng' : 'Polyglot'}
                </span>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {PREFERRED_STACK_OPTIONS.map((opt) => {
                  const active = preferredStack === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPreferredStack(opt.id)}
                      className="rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition-all"
                      style={{
                        backgroundColor: active ? 'var(--accent-soft)' : 'var(--bg-surface)',
                        borderColor: active ? 'var(--accent)' : 'var(--border-hairline)',
                        color: active ? 'var(--accent)' : 'var(--ink-secondary)',
                      }}
                    >
                      {opt[locale]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 7 Add-on Module Toggles */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase" style={{ color: 'var(--ink-secondary)' }}>
                  {locale === 'vi' ? 'Module Mở Rộng (7 Tính Năng Chuyên Sâu)' : 'Optional Engineering Modules (7)'}
                </span>
                <span className="font-mono-num text-xs" style={{ color: 'var(--accent)' }}>
                  {selectedAddons.length}/7 {locale === 'vi' ? 'đã chọn' : 'selected'}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {SCOPE_ADDONS.map((addon) => {
                  const active = selectedAddons.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon.id)}
                      aria-pressed={active}
                      className="flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all"
                      style={{
                        backgroundColor: active ? 'var(--accent-soft)' : 'var(--bg-surface)',
                        borderColor: active ? 'var(--accent)' : 'var(--border-hairline)',
                      }}
                    >
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border"
                        style={{
                          backgroundColor: active ? 'var(--accent)' : 'transparent',
                          borderColor: active ? 'var(--accent)' : 'var(--border-strong)',
                          color: '#ffffff',
                        }}
                      >
                        {active && <IconCheck className="h-3.5 w-3.5" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold leading-snug" style={{ color: 'var(--ink-primary)' }}>
                          {addon.label[locale]}
                        </div>
                        <p className="mt-1 text-[11px] leading-snug" style={{ color: 'var(--ink-secondary)' }}>
                          {addon.description[locale]}
                        </p>
                        <div className="font-mono-num mt-2 flex items-center gap-2 text-[11px] font-semibold">
                          <span style={{ color: active ? 'var(--accent)' : 'var(--ink-primary)' }}>
                            +{formatMoney(currency === 'VND' ? addon.priceVnd : addon.priceUsd, currency)}
                          </span>
                          <span style={{ color: 'var(--ink-muted)' }}>
                            · +{addon.addedDays} {locale === 'vi' ? 'ngày' : 'd'}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Delivery Pace Selector */}
            <div className="mt-6 border-t pt-5" style={{ borderColor: 'var(--border-hairline)' }}>
              <span className="text-xs font-semibold uppercase" style={{ color: 'var(--ink-secondary)' }}>
                {locale === 'vi' ? 'Tốc Độ Triển Khai' : 'Delivery Pace'}
              </span>
              <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {(
                  [
                    {
                      id: 'standard' as DeliveryPace,
                      title: locale === 'vi' ? 'Tiến Độ Tiêu Chuẩn' : 'Standard Schedule',
                      desc:
                        locale === 'vi'
                          ? 'Tối ưu chi phí, kiểm thử đầy đủ từng sprint'
                          : 'Balanced cost with full automated QA cycles',
                    },
                    {
                      id: 'priority' as DeliveryPace,
                      title: locale === 'vi' ? 'Ưu Tiên Gấp (+20% · Nhanh hơn 25%)' : 'Priority Rush (+20% · -25% Time)',
                      desc:
                        locale === 'vi'
                          ? 'Dồn tài nguyên ưu tiên bàn giao sớm cho chiến dịch'
                          : 'Dedicated sprint acceleration for tight launch dates',
                    },
                  ] as const
                ).map((option) => {
                  const active = pace === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setPace(option.id)}
                      className="rounded-xl border p-3.5 text-left transition-all"
                      style={{
                        backgroundColor: active ? 'var(--accent-soft)' : 'var(--bg-surface)',
                        borderColor: active ? 'var(--accent)' : 'var(--border-hairline)',
                      }}
                    >
                      <div className="text-xs font-bold" style={{ color: 'var(--ink-primary)' }}>
                        {option.title}
                      </div>
                      <p className="mt-1 text-[11px]" style={{ color: 'var(--ink-secondary)' }}>
                        {option.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Live Quote & 3-Stage Milestone Receipt */}
          <div className="lg:col-span-5">
            <div
              className="sticky top-24 rounded-2xl border p-6"
              style={{
                backgroundColor: 'var(--bg-canvas)',
                borderColor: 'var(--border-strong)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border-hairline)' }}>
                <div>
                  <span className="font-mono-num text-[11px] font-semibold uppercase" style={{ color: 'var(--accent)' }}>
                    {locale === 'vi' ? 'BẢNG DỰ TOÁN THỜI GIAN THỰC' : 'LIVE ESTIMATE RECEIPT'}
                  </span>
                  <h4 className="font-display mt-0.5 text-base font-bold">
                    {estimate.projectType.tierName[locale]}
                  </h4>
                </div>
                <div
                  className="font-mono-num inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-bold"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-hairline)',
                  }}
                >
                  <IconClock className="h-3.5 w-3.5" style={{ color: 'var(--cyan)' }} />
                  <span>
                    {estimate.estimatedDays} {locale === 'vi' ? 'ngày' : 'days'}
                  </span>
                </div>
              </div>

              {/* Line Breakdown */}
              <div className="mt-4 space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span style={{ color: 'var(--ink-secondary)' }}>
                    {locale === 'vi' ? 'Gói nền tảng cốt lõi' : 'Core architecture tier'}
                  </span>
                  <span className="font-mono-num font-semibold">
                    {formatMoney(currency === 'VND' ? estimate.baseVnd : estimate.baseUsd, currency)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span style={{ color: 'var(--ink-secondary)' }}>
                    {locale === 'vi'
                      ? `Module mở rộng (${estimate.addons.length})`
                      : `Selected add-ons (${estimate.addons.length})`}
                  </span>
                  <span className="font-mono-num font-semibold">
                    +{formatMoney(currency === 'VND' ? estimate.addonsVnd : estimate.addonsUsd, currency)}
                  </span>
                </div>

                {estimate.rushSurchargeVnd > 0 && (
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--accent)' }}>
                      {locale === 'vi' ? 'Phụ phí tăng tốc (+20%)' : 'Priority acceleration (+20%)'}
                    </span>
                    <span className="font-mono-num font-semibold" style={{ color: 'var(--accent)' }}>
                      +{formatMoney(
                        currency === 'VND' ? estimate.rushSurchargeVnd : estimate.rushSurchargeUsd,
                        currency
                      )}
                    </span>
                  </div>
                )}

                <div
                  className="flex items-baseline justify-between border-t pt-3"
                  style={{ borderColor: 'var(--border-hairline)' }}
                >
                  <span className="text-sm font-bold">
                    {locale === 'vi' ? 'Tổng Dự Toán Trọn Gói' : 'Estimated Contract Total'}
                  </span>
                  <div className="text-right">
                    <div className="font-mono-num text-2xl font-extrabold" style={{ color: 'var(--ink-primary)' }}>
                      {formatMoney(currency === 'VND' ? estimate.totalVnd : estimate.totalUsd, currency)}
                    </div>
                    <div className="font-mono-num text-[11px]" style={{ color: 'var(--ink-muted)' }}>
                      ≈ {formatMoney(currency === 'VND' ? estimate.totalUsd : estimate.totalVnd, currency === 'VND' ? 'USD' : 'VND')}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3-Stage Milestone Schedule */}
              <div
                className="mt-5 rounded-xl border p-4"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-hairline)',
                }}
              >
                <div className="flex items-center justify-between text-[11px] font-bold uppercase" style={{ color: 'var(--ink-secondary)' }}>
                  <span>{locale === 'vi' ? 'Lộ Trình 3 Đợt (30% · 40% · 30%)' : '3-Stage Milestones (30% · 40% · 30%)'}</span>
                  <IconShield className="h-3.5 w-3.5" style={{ color: 'var(--emerald)' }} />
                </div>

                <div className="mt-3 space-y-2.5">
                  {estimate.milestones.map((stage) => (
                    <div key={stage.stage} className="flex items-start justify-between gap-3 text-xs">
                      <div className="min-w-0">
                        <div className="font-semibold" style={{ color: 'var(--ink-primary)' }}>
                          {stage.label[locale]}
                        </div>
                        <div className="text-[11px]" style={{ color: 'var(--ink-muted)' }}>
                          {stage.deliverable[locale]}
                        </div>
                      </div>
                      <span className="font-mono-num shrink-0 font-bold" style={{ color: 'var(--ink-primary)' }}>
                        {formatMoney(currency === 'VND' ? stage.amountVnd : stage.amountUsd, currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={handleAddCustom}
                  className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold"
                  data-testid="add-custom-scope-btn"
                >
                  {addedFeedback ? (
                    <>
                      <IconCheck className="h-4 w-4" />
                      <span>{locale === 'vi' ? 'Đã Thêm Gói Custom Vào Giỏ!' : 'Custom Package Added!'}</span>
                    </>
                  ) : (
                    <>
                      <IconCart className="h-4 w-4" />
                      <span>{locale === 'vi' ? 'Thêm Gói Custom Vào Giỏ' : 'Add Custom Package To Cart'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadProposal}
                  className="btn-secondary inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold sm:text-sm"
                  data-testid="download-proposal-btn"
                >
                  <IconDownload className="h-4 w-4" />
                  <span>
                    {locale === 'vi'
                      ? 'Tải Bản Đề Xuất Kỹ Thuật (.md)'
                      : 'Download Technical Proposal (.md)'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
