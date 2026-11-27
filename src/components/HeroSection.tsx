import React, { useState } from 'react';
import { CATALOG_PRODUCTS, STUDIO_CONTACT } from '../engines/catalog';
import type { Locale, TemplateProduct } from '../engines/types';
import {
  IconArrowDown,
  IconArrowUpRight,
  IconPhone,
  IconSliders,
} from './Icons';

interface HeroSectionProps {
  locale: Locale;
  onPreviewLive?: (product: TemplateProduct) => void;
}

const FEATURED_SLIDE_IDS = [
  'velox-ev-motors',
  'orbitalflow-saas',
  'vectradoc-rag',
  'fleetpulse-gis',
  'medcore-ehr',
  'chronos-horology',
];

export const HeroSection: React.FC<HeroSectionProps> = ({ locale, onPreviewLive }) => {
  const slides = FEATURED_SLIDE_IDS
    .map((id) => CATALOG_PRODUCTS.find((p) => p.id === id))
    .filter((p): p is TemplateProduct => Boolean(p));

  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const activeSlide = slides[activeSlideIdx] ?? CATALOG_PRODUCTS[0];

  const trustStats = [
    {
      value: '29',
      label: locale === 'vi' ? 'Hệ Thống & Pro Tools Live' : 'Live Apps & Pro Tools',
    },
    {
      value: '1,547',
      label: locale === 'vi' ? 'Bài Test Tự Động Xanh' : 'Automated CI Tests',
    },
    {
      value: '700+',
      label: locale === 'vi' ? 'Siêu Thị Thực Chiến' : 'Retail Stores Scale',
    },
    {
      value: locale === 'vi' ? '2–10 Ngày' : '2–10 Days',
      label: locale === 'vi' ? 'Bàn Giao Trọn Gói' : 'Turnkey Delivery',
    },
  ];

  return (
    <section
      id="top"
      className="studio-grid-bg relative overflow-hidden border-b"
      style={{ borderColor: 'var(--border-hairline)' }}
    >
      {/* Subtle architectural vermilion glow */}
      <div
        className="pointer-events-none absolute -top-36 right-1/4 h-[460px] w-[460px] rounded-full opacity-15 blur-[130px]"
        style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-[1360px] px-4 pt-12 pb-12 sm:px-6 lg:px-8 lg:pt-16 lg:pb-16">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Editorial Column */}
          <div className="lg:col-span-6">
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-strong)',
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--emerald)' }} />
              <span
                className="font-mono-num text-[11px] font-semibold tracking-[0.14em] uppercase"
                style={{ color: 'var(--ink-secondary)' }}
              >
                TVT STUDIO · FLAGSHIP EDITION
              </span>
            </div>

            <h1 className="font-display text-4xl leading-[1.08] font-extrabold tracking-tight sm:text-5xl lg:text-[54px]">
              {locale === 'vi' ? (
                <>
                  Website{' '}
                  <span className="font-editorial font-normal italic" style={{ color: 'var(--accent)' }}>
                    Flagship
                  </span>{' '}
                  &amp; Hệ Thống 3D Đẳng Cấp.
                </>
              ) : (
                <>
                  Flagship{' '}
                  <span className="font-editorial font-normal italic" style={{ color: 'var(--accent)' }}>
                    Websites
                  </span>{' '}
                  &amp; Bespoke 3D Systems.
                </>
              )}
            </h1>

            <p
              className="mt-5 max-w-lg text-base leading-relaxed sm:text-[17px]"
              style={{ color: 'var(--ink-secondary)' }}
            >
              {locale === 'vi'
                ? '26 hệ thống live từ B2B SaaS, AI RAG, GIS Logistics, Bệnh Án EHR đến 3D HDRI — bàn giao 2–10 ngày.'
                : '26 live systems across B2B SaaS, Hybrid AI RAG, GIS Fleet, Clinical EHR & 3D HDRI — delivered in 2–10 days.'}
            </p>

            {/* Primary CTA Cluster */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#catalog"
                className="btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold"
              >
                <span>{locale === 'vi' ? 'Khám Phá 26 Hệ Thống Live' : 'Explore 26 Live Systems'}</span>
                <IconArrowDown className="h-4 w-4" />
              </a>

              <a
                href="#estimator"
                className="btn-secondary inline-flex items-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold"
              >
                <IconSliders className="h-4 w-4" />
                <span>{locale === 'vi' ? 'Báo Giá Riêng' : 'Custom Scope'}</span>
              </a>

              <a
                href={STUDIO_CONTACT.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-2 text-sm font-medium transition-colors hover:text-[var(--accent)]"
                style={{ color: 'var(--ink-secondary)' }}
              >
                <IconPhone className="h-4 w-4" style={{ color: 'var(--accent)' }} />
                <span className="font-mono-num">Zalo {STUDIO_CONTACT.phoneDisplay}</span>
                <IconArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Right Real Live Website Preview Showcase (Zero AI Stock Fluff) */}
          <div className="lg:col-span-6">
            <div className="card-luxury card-ultra overflow-hidden rounded-3xl">
              {/* Live Product Screenshot */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#090a0d]">
                <img
                  src={activeSlide.previewImage}
                  alt={`${activeSlide.name} — Real Live Interface`}
                  width={1280}
                  height={800}
                  className="h-full w-full object-cover object-top"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(9,10,13,0.06) 0%, rgba(9,10,13,0) 64%, rgba(9,10,13,0.72) 100%)',
                  }}
                />

                {/* Real Product Name + Direct Live Link */}
                <div className="absolute right-4 bottom-4 left-4 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <span className="font-mono-num inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/65 px-2.5 py-1 text-[10px] font-semibold text-white/90 backdrop-blur-md">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
                      <span className="truncate">{activeSlide.name}</span>
                    </span>
                  </div>

                  {onPreviewLive ? (
                    <button
                      type="button"
                      onClick={() => onPreviewLive(activeSlide)}
                      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/25 bg-black/70 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)]"
                    >
                      <span>{locale === 'vi' ? 'Mở Live Demo' : 'Live Demo'}</span>
                      <IconArrowUpRight className="h-3 w-3" />
                    </button>
                  ) : (
                    <a
                      href={activeSlide.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/25 bg-black/70 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)]"
                    >
                      <span>{locale === 'vi' ? 'Mở Live Demo' : 'Live Demo'}</span>
                      <IconArrowUpRight className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Clean Instant Project Switcher Strip */}
              <div
                className="flex flex-wrap items-center gap-1.5 border-t px-4 py-3"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-hairline)',
                }}
                role="tablist"
                aria-label="Featured flagship previews"
              >
                {slides.map((item, idx) => {
                  const isActive = idx === activeSlideIdx;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveSlideIdx(idx)}
                      className="rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors"
                      style={{
                        backgroundColor: isActive ? 'var(--accent)' : 'var(--bg-elevated)',
                        borderColor: isActive ? 'var(--accent)' : 'var(--border-hairline)',
                        color: isActive ? '#ffffff' : 'var(--ink-secondary)',
                      }}
                    >
                      {item.name.replace(/\s+v\d+\.\d+$/, '')}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Minimalist Executive KPI Bar */}
        <div
          className="mt-10 grid grid-cols-2 overflow-hidden rounded-2xl border lg:mt-14 lg:grid-cols-4"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-hairline)',
          }}
        >
          {trustStats.map((stat, idx) => (
            <div
              key={stat.label}
              className={`px-5 py-4 sm:px-6 sm:py-5 ${idx < 3 ? 'border-b lg:border-r lg:border-b-0' : ''} ${
                idx % 2 === 0 ? 'border-r lg:border-r' : ''
              }`}
              style={{ borderColor: 'var(--border-hairline)' }}
            >
              <div
                className="font-mono-num text-2xl font-bold tracking-tight sm:text-[28px]"
                style={{ color: 'var(--ink-primary)' }}
              >
                {stat.value}
              </div>
              <div
                className="mt-1 text-xs font-medium sm:text-[13px]"
                style={{ color: 'var(--ink-muted)' }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
