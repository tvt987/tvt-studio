import React from 'react';
import { STUDIO_CONTACT } from '../engines/catalog';
import type { Locale } from '../engines/types';
import {
  IconArrowDown,
  IconArrowUpRight,
  IconPhone,
  IconShield,
  IconSliders,
} from './Icons';

interface HeroSectionProps {
  locale: Locale;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ locale }) => {
  const trustStats = [
    {
      value: '10+',
      label: locale === 'vi' ? 'Sản Phẩm Thương Mại Live' : 'Live Commercial Products',
      detail: locale === 'vi' ? 'Xem demo thật 100% trước khi mua' : '100% live interactive sandboxes',
    },
    {
      value: '250+',
      label: locale === 'vi' ? 'CI Automated Tests Green' : 'CI Automated Tests Green',
      detail: locale === 'vi' ? 'Vitest + Strict TypeScript + Zero Error' : 'Vitest + Strict TS + Zero Errors',
    },
    {
      value: '700+',
      label: locale === 'vi' ? 'Siêu Thị Production' : 'Production Retail Stores',
      detail: locale === 'vi' ? 'Kinh nghiệm lõi .NET 8 / 5.000+ RPS' : 'Battle-tested .NET / 5,000+ RPS',
    },
    {
      value: locale === 'vi' ? '5–14 Ngày' : '5–14 Days',
      label: locale === 'vi' ? 'Thời Gian Bàn Giao' : 'Deployment Turnaround',
      detail: locale === 'vi' ? 'Thanh toán 3 đợt minh bạch 30/40/30' : 'Transparent 30/40/30 milestones',
    },
  ];

  return (
    <section id="top" className="studio-grid-bg relative overflow-hidden border-b" style={{ borderColor: 'var(--border-hairline)' }}>
      {/* Subtle architectural copper glow */}
      <div
        className="pointer-events-none absolute -top-40 right-0 h-[460px] w-[460px] rounded-full opacity-20 blur-[120px]"
        style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-[1360px] px-4 pt-12 pb-14 sm:px-6 lg:px-8 lg:pt-16 lg:pb-20">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Editorial Column */}
          <div className="lg:col-span-6">
            <div
              className="mb-6 inline-flex items-center gap-2.5 rounded-full border px-3.5 py-1.5"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-strong)',
              }}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--emerald)' }} />
              <span className="font-mono-num text-[11px] font-medium tracking-wider uppercase" style={{ color: 'var(--ink-secondary)' }}>
                {locale === 'vi'
                  ? 'NHẬN TRIỂN KHAI THÁNG NÀY · TP.HCM / GLOBAL REMOTE'
                  : 'BOOKING OPEN · HO CHI MINH CITY / GLOBAL REMOTE'}
              </span>
            </div>

            <h1 className="font-display text-3xl leading-[1.12] font-extrabold tracking-tight sm:text-5xl lg:text-[52px]">
              {locale === 'vi' ? (
                <>
                  Kho Website Mẫu Chuẩn{' '}
                  <span className="font-editorial font-normal italic" style={{ color: 'var(--accent)' }}>
                    Flagship
                  </span>{' '}
                  &amp; Code Phần Mềm Theo Yêu Cầu.
                </>
              ) : (
                <>
                  Flagship Website{' '}
                  <span className="font-editorial font-normal italic" style={{ color: 'var(--accent)' }}>
                    Marketplace
                  </span>{' '}
                  &amp; Custom IT Engineering.
                </>
              )}
            </h1>

            <p
              className="mt-5 max-w-xl text-base leading-relaxed sm:text-lg"
              style={{ color: 'var(--ink-secondary)' }}
            >
              {locale === 'vi'
                ? 'Kiến trúc phần mềm cấp doanh nghiệp do Solution Architect Trương Văn Tình trực tiếp thiết kế & kiểm thử — sẵn sàng bàn giao trọn gói trong 5–14 ngày với báo giá minh bạch và thanh toán theo mốc nghiệm thu.'
                : 'Commercial-grade storefronts, 3D WebGL experiences, F&B POS systems, and distributed .NET 10 / AI platforms architected directly by Principal Architect Truong Van Tinh — shipped in 5–14 days with transparent milestone pricing.'}
            </p>

            {/* Primary CTA Cluster */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#catalog"
                className="btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold"
              >
                <span>{locale === 'vi' ? 'Khám Phá Kho Website Mẫu' : 'Explore Ready Templates'}</span>
                <IconArrowDown className="h-4 w-4" />
              </a>

              <a
                href="#estimator"
                className="btn-secondary inline-flex items-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold"
              >
                <IconSliders className="h-4 w-4" />
                <span>{locale === 'vi' ? 'Tính Báo Giá Dự Án Riêng' : 'Estimate Custom Scope'}</span>
              </a>

              <a
                href={STUDIO_CONTACT.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost inline-flex items-center gap-2 rounded-xl px-4 py-3.5 text-sm font-medium"
              >
                <IconPhone className="h-4 w-4" style={{ color: 'var(--accent)' }} />
                <span className="font-mono-num">Zalo {STUDIO_CONTACT.phoneDisplay}</span>
                <IconArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Direct Architectural Credentials Strip */}
            <div
              className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 border-t pt-5 text-xs"
              style={{ borderColor: 'var(--border-hairline)', color: 'var(--ink-muted)' }}
            >
              <span className="inline-flex items-center gap-1.5">
                <IconShield className="h-3.5 w-3.5" style={{ color: 'var(--emerald)' }} />
                {locale === 'vi'
                  ? 'Bảo hành lỗi kỹ thuật 90 ngày'
                  : '90-day engineering warranty'}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <IconShield className="h-3.5 w-3.5" style={{ color: 'var(--cyan)' }} />
                {locale === 'vi'
                  ? 'Hỗ trợ xuất hợp đồng & hóa đơn B2B'
                  : 'B2B / Deel / Wise contractor invoicing'}
              </span>
            </div>
          </div>

          {/* Right Architectural Showcase Frame */}
          <div className="lg:col-span-6">
            <div className="surface-card overflow-hidden rounded-2xl">
              {/* Top Window Telemetry Bar */}
              <div
                className="flex items-center justify-between gap-2 border-b px-3.5 py-2.5 sm:px-4"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-hairline)',
                }}
              >
                <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full opacity-40" style={{ backgroundColor: 'var(--ink-secondary)' }} />
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full opacity-25" style={{ backgroundColor: 'var(--ink-secondary)' }} />
                  <span className="font-mono-num ml-1.5 truncate text-[10px] sm:text-[11px]" style={{ color: 'var(--ink-muted)' }}>
                    TVT.STUDIO // ENGINE
                  </span>
                </div>
                <span
                  className="font-mono-num shrink-0 whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-semibold"
                  style={{
                    backgroundColor: 'var(--emerald-soft)',
                    color: 'var(--emerald)',
                  }}
                >
                  PRODUCTION READY
                </span>
              </div>

              {/* Hero Studio Visual */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#090a0d]">
                <img
                  src="./media/studio-hero.webp"
                  alt="TVT Studio Architectural Engineering Workspace"
                  width={1400}
                  height={788}
                  className="h-full w-full object-cover"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(9,10,13,0.06) 0%, rgba(9,10,13,0.18) 60%, rgba(9,10,13,0.82) 100%)',
                  }}
                />
                <div className="absolute right-4 bottom-4 left-4 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="font-mono-num text-[10px] tracking-widest text-white/70 uppercase">
                      {locale === 'vi' ? 'TRỰC TIẾP TỪ SOLUTION ARCHITECT' : 'DIRECT FROM PRINCIPAL ARCHITECT'}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-white sm:text-base">
                      {locale === 'vi'
                        ? 'Không qua trung gian sale — Code chuẩn doanh nghiệp ngay từ dòng đầu.'
                        : 'Zero agency middlemen — Enterprise-grade code from commit one.'}
                    </p>
                  </div>
                  <div className="rounded-lg border border-white/15 bg-black/60 px-3 py-1.5 backdrop-blur-md">
                    <span className="font-mono-num text-[11px] font-semibold text-white">
                      CWV 98+ · 0 CONSOLE ERR
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Trust Telemetry Strip */}
        <div
          className="mt-12 grid grid-cols-2 overflow-hidden rounded-2xl border lg:mt-16 lg:grid-cols-4"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-hairline)',
          }}
        >
          {trustStats.map((stat, idx) => (
            <div
              key={stat.label}
              className={`p-5 sm:p-6 ${idx < 3 ? 'border-b lg:border-r lg:border-b-0' : ''} ${
                idx % 2 === 0 ? 'border-r lg:border-r' : ''
              }`}
              style={{ borderColor: 'var(--border-hairline)' }}
            >
              <div className="font-mono-num text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: 'var(--ink-primary)' }}>
                {stat.value}
              </div>
              <div className="mt-1.5 text-xs font-semibold sm:text-sm" style={{ color: 'var(--ink-primary)' }}>
                {stat.label}
              </div>
              <div className="mt-1 text-[11px] leading-snug sm:text-xs" style={{ color: 'var(--ink-muted)' }}>
                {stat.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
