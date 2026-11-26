import React from 'react';
import { STUDIO_CONTACT } from '../engines/catalog';
import type { Locale } from '../engines/types';
import { IconArrowUpRight, IconGlobe, IconMail, IconPhone } from './Icons';

interface FooterProps {
  locale: Locale;
}

export const Footer: React.FC<FooterProps> = ({ locale }) => {
  return (
    <footer
      className="border-t"
      style={{
        backgroundColor: 'var(--bg-canvas)',
        borderColor: 'var(--border-hairline)',
      }}
    >
      <div className="mx-auto max-w-[1360px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <img
                src="./media/studio-emblem.webp"
                alt="TVT Studio Emblem"
                width={44}
                height={44}
                className="h-11 w-11 rounded-xl border object-cover"
                style={{ borderColor: 'var(--border-strong)' }}
              />
              <div>
                <div className="font-brand text-base font-extrabold tracking-wider">TVT STUDIO</div>
                <div className="font-mono-num text-[11px]" style={{ color: 'var(--ink-muted)' }}>
                  BY {STUDIO_CONTACT.architectName.toUpperCase()}
                </div>
              </div>
            </div>

            <p className="mt-4 max-w-md text-xs leading-relaxed sm:text-sm" style={{ color: 'var(--ink-secondary)' }}>
              {locale === 'vi'
                ? 'Studio thiết kế & kỹ thuật phần mềm thương mại: Website 3D WebGL, Phòng khám, BĐS, POS F&B, SaaS BI và kiến trúc chịu tải cao .NET 10 / Hybrid RAG.'
                : 'Commercial Website Marketplace & Custom IT Engineering Studio: 3D WebGL commerce, Clinic/PropTech portals, Hospitality POS, BI SaaS, and high-concurrency .NET 10 / Hybrid RAG.'}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={STUDIO_CONTACT.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold"
              >
                <IconPhone className="h-3.5 w-3.5" />
                <span className="font-mono-num">Zalo {STUDIO_CONTACT.phoneDisplay}</span>
                <IconArrowUpRight className="h-3.5 w-3.5" />
              </a>

              <a
                href={`mailto:${STUDIO_CONTACT.email}`}
                className="btn-secondary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold"
              >
                <IconMail className="h-3.5 w-3.5" />
                <span>{STUDIO_CONTACT.email}</span>
              </a>
            </div>
          </div>

          {/* Direct Architect Contact Card */}
          <div className="lg:col-span-4">
            <h3 className="font-mono-num text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
              {locale === 'vi' ? 'LIÊN HỆ TRỰC TIẾP KIẾN TRÚC SƯ' : 'DIRECT ARCHITECT DESK'}
            </h3>
            <div className="surface-card mt-3 space-y-2.5 rounded-2xl p-5 text-xs">
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--ink-muted)' }}>{locale === 'vi' ? 'Phụ trách' : 'Principal'}</span>
                <span className="font-semibold">{STUDIO_CONTACT.architectName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--ink-muted)' }}>Hotline / Zalo</span>
                <a href={STUDIO_CONTACT.zaloUrl} target="_blank" rel="noopener noreferrer" className="font-mono-num font-bold hover:text-[var(--accent)]">
                  {STUDIO_CONTACT.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--ink-muted)' }}>Email</span>
                <a href={`mailto:${STUDIO_CONTACT.email}`} className="font-mono-num font-semibold hover:text-[var(--accent)]">
                  {STUDIO_CONTACT.email}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--ink-muted)' }}>Portfolio</span>
                <a href={STUDIO_CONTACT.portfolioUrl} target="_blank" rel="noopener noreferrer" className="font-mono-num inline-flex items-center gap-1 font-semibold hover:text-[var(--accent)]">
                  tvt987.github.io
                  <IconArrowUpRight className="h-3 w-3" />
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--ink-muted)' }}>GitHub</span>
                <a href={STUDIO_CONTACT.githubUrl} target="_blank" rel="noopener noreferrer" className="font-mono-num inline-flex items-center gap-1 font-semibold hover:text-[var(--accent)]">
                  github.com/tvt987
                  <IconArrowUpRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-3">
            <h3 className="font-mono-num text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
              {locale === 'vi' ? 'ĐIỀU HƯỚNG NHANH' : 'QUICK NAVIGATION'}
            </h3>
            <ul className="mt-3 space-y-2.5 text-sm" style={{ color: 'var(--ink-secondary)' }}>
              <li>
                <a href="#catalog" className="transition-colors hover:text-[var(--ink-primary)]">
                  {locale === 'vi' ? 'Kho 9 Website Mẫu Live' : '9 Live Website Templates'}
                </a>
              </li>
              <li>
                <a href="#estimator" className="transition-colors hover:text-[var(--ink-primary)]">
                  {locale === 'vi' ? 'Bộ Tính Báo Giá Code Riêng' : 'Custom Scope Estimator'}
                </a>
              </li>
              <li>
                <a href="#process" className="transition-colors hover:text-[var(--ink-primary)]">
                  {locale === 'vi' ? 'Quy Trình 4 Bước & Cam Kết SLA' : '4-Stage Process & SLA'}
                </a>
              </li>
              <li>
                <a href="#faq" className="transition-colors hover:text-[var(--ink-primary)]">
                  {locale === 'vi' ? 'Câu Hỏi Thường Gặp (FAQ)' : 'Commercial FAQ'}
                </a>
              </li>
            </ul>

            <div className="mt-5 inline-flex items-center gap-2 text-xs" style={{ color: 'var(--ink-muted)' }}>
              <IconGlobe className="h-3.5 w-3.5" />
              <span>{locale === 'vi' ? STUDIO_CONTACT.locationVi : STUDIO_CONTACT.locationEn}</span>
            </div>
          </div>
        </div>

        <div
          className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs sm:flex-row"
          style={{ borderColor: 'var(--border-hairline)', color: 'var(--ink-muted)' }}
        >
          <p>
            © {new Date().getFullYear()} TVT Studio — {STUDIO_CONTACT.architectName}.{' '}
            {locale === 'vi' ? 'Bảo lưu mọi quyền.' : 'All rights reserved.'}
          </p>
          <p className="font-mono-num text-[11px]">
            React 19 · TypeScript Strict · Tailwind v4 · Vitest Verified
          </p>
        </div>
      </div>
    </footer>
  );
};
