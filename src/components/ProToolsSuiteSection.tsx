import React from 'react';
import type { Locale } from '../engines/types';
import { IconArrowUpRight, IconCode, IconShield } from './Icons';

interface ProToolsSuiteSectionProps {
  locale: Locale;
}

const TOOLS_BASE_URL = 'https://tvt987.github.io/tvt-tools/';

const PRO_TOOLS = [
  {
    slug: 'vietqr-pro',
    group: 'BUSINESS',
    title: { vi: 'VietQR EMVCo Pro & Standee', en: 'VietQR EMVCo Pro & Standee' },
    desc: {
      vi: 'Tạo mã VietQR chuẩn NAPAS CRC16 offline, tạo hàng loạt CSV & in bảng quét A4.',
      en: 'Offline NAPAS CRC16 VietQR generator, CSV batch export & printable A4 standee.',
    },
  },
  {
    slug: 'gross-net-vn',
    group: 'BUSINESS',
    title: { vi: 'Tính Lương Gross ↔ Net 2026', en: 'VN Gross ↔ Net Salary 2026' },
    desc: {
      vi: 'Chuẩn Luật Thuế TNCN 109/2025 (5 bậc mới, 15,5tr/6,2tr) so sánh trực tiếp luật cũ.',
      en: '2026 Law 109/2025 (5 PIT brackets, 15.5M/6.2M deductions) vs Legacy 2025 delta.',
    },
  },
  {
    slug: 'invoice-a4',
    group: 'BUSINESS',
    title: { vi: 'Tạo Hóa Đơn & Báo Giá PDF A4', en: 'Commercial Invoice PDF A4' },
    desc: {
      vi: 'Tự tính VAT 0/8/10%, chiết khấu, nhúng sẵn VietQR trên hóa đơn & xuất PDF A4.',
      en: 'Itemized VAT/discount quote builder with embedded VietQR & formal A4 PDF print.',
    },
  },
  {
    slug: 'image-studio',
    group: 'BUSINESS',
    title: { vi: 'Nén Ảnh WebP & Crop Social', en: 'WebP Optimizer & Social Crop' },
    desc: {
      vi: 'Tối ưu ảnh PNG/JPG/WebP 100% tại trình duyệt theo chuẩn Facebook/OG/YouTube.',
      en: 'Zero-upload client-side Canvas WebP compressor with FB/OG/YT crop presets.',
    },
  },
  {
    slug: 'finance-lab',
    group: 'BUSINESS',
    title: { vi: 'Lãi Vay & Hòa Vốn Startup', en: 'Mortgage & Break-Even Lab' },
    desc: {
      vi: 'Lịch trả nợ dư nợ giảm dần vs cố định, LTV:CAC, Runway & xuất Excel CSV BOM.',
      en: 'Amortization schedule, startup unit economics, runway chart & UTF-8 BOM CSV.',
    },
  },
  {
    slug: 'schema-forge',
    group: 'ENGINEERING',
    title: { vi: 'JSON → TS / C# / Pydantic / Zod', en: 'JSON → TS / C# / Pydantic / Zod' },
    desc: {
      vi: 'Sinh mã định kiểu chuẩn .NET 10, TypeScript, Python Pydantic v2 & Zod tức thì.',
      en: 'Instant strict codegen for TypeScript, C# .NET 10 records, Pydantic v2 & Zod.',
    },
  },
  {
    slug: 'crypto-lab',
    group: 'ENGINEERING',
    title: { vi: 'JWT HS256 & Web Crypto Lab', en: 'JWT HS256 & Web Crypto Lab' },
    desc: {
      vi: 'Ký/xác thực JWT HS256, SHA-256/512, HMAC, UUID v7 & đo độ mạnh mật khẩu.',
      en: 'Web Crypto Subtle HS256 JWT signer/verifier, SHA-256/512, UUID v7 & entropy.',
    },
  },
  {
    slug: 'regex-lab',
    group: 'ENGINEERING',
    title: { vi: 'Regex Debugger & Quét ReDoS', en: 'Visual Regex & ReDoS Auditor' },
    desc: {
      vi: 'Tô màu nhóm bắt, cảnh báo lỗ hổng ReDoS & 12 mẫu chuẩn SĐT/CCCD/MST Việt Nam.',
      en: 'Live capture groups, static ReDoS catastrophic backtracking warning & 12 presets.',
    },
  },
  {
    slug: 'sql-studio',
    group: 'ENGINEERING',
    title: { vi: 'SQL Formatter & Vẽ Sơ Đồ ERD', en: 'SQL Linter & Live SVG ERD' },
    desc: {
      vi: 'Định dạng SQL, cảnh báo lỗi hiệu năng & tự vẽ sơ đồ ERD vector từ CREATE TABLE.',
      en: 'SQL formatter, static index linter & auto-layout SVG ERD diagram from DDL.',
    },
  },
  {
    slug: 'design-tokens',
    group: 'ENGINEERING',
    title: { vi: 'Bảng Màu OKLCH & WCAG AAA', en: 'OKLCH Scale & WCAG AAA Lab' },
    desc: {
      vi: 'Sinh thang màu 50–950, tự sửa tương phản WCAG AAA & xuất Tailwind v4 @theme.',
      en: '11-shade OKLCH palette, WCAG 2.1 AAA contrast auto-fix & Tailwind v4 export.',
    },
  },
];

export const ProToolsSuiteSection: React.FC<ProToolsSuiteSectionProps> = ({ locale }) => {
  return (
    <section
      id="pro-tools"
      className="scroll-mt-20 border-t py-16 lg:py-24"
      style={{
        borderColor: 'var(--border-hairline)',
        backgroundColor: 'var(--bg-surface)',
      }}
    >
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="font-mono-num text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--cyan)' }}>
              {locale === 'vi' ? 'BỘ 10 CÔNG CỤ MIỄN PHÍ · 100% LOCAL-FIRST' : 'FREE 10 PRO TOOLS SUITE · 100% LOCAL-FIRST'}
            </div>
            <h2 className="font-display mt-2 text-2xl font-extrabold tracking-tight sm:text-4xl">
              {locale === 'vi'
                ? 'TVT Pro Tools — 10 Công Cụ Kinh Doanh & Kỹ Thuật Miễn Phí Trọn Đời.'
                : 'TVT Pro Tools — 10 Free Business & Engineering Engines.'}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed sm:text-base" style={{ color: 'var(--ink-secondary)' }}>
              {locale === 'vi'
                ? 'Trải nghiệm trực tiếp năng lực kỹ thuật của TVT Studio qua 10 công cụ thực chiến chạy 100% ngay trên trình duyệt — không gửi dữ liệu nhạy cảm lên máy chủ lạ, 41/41 bài test tự động xanh.'
                : 'Experience TVT Studio craftsmanship firsthand across 10 production utilities running 100% locally in your browser — zero telemetry leaks, 41/41 Vitest verified.'}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a
                href={TOOLS_BASE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
              >
                <IconCode className="h-4 w-4" />
                <span>{locale === 'vi' ? 'Mở Toàn Bộ 10 Pro Tools' : 'Launch All 10 Pro Tools'}</span>
                <IconArrowUpRight className="h-4 w-4" />
              </a>
              <span
                className="inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-xs font-semibold"
                style={{
                  backgroundColor: 'var(--bg-canvas)',
                  borderColor: 'var(--border-hairline)',
                  color: 'var(--emerald)',
                }}
              >
                <IconShield className="h-4 w-4" />
                <span>{locale === 'vi' ? '0₫ · Không quảng cáo · Chạy offline' : '$0 · Zero Ads · Client-Side'}</span>
              </span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <a
              href={TOOLS_BASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="surface-card group block overflow-hidden rounded-2xl transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#090b10]">
                <img
                  src="./media/tvt-tools.webp"
                  alt="TVT Pro Tools Suite — 10 Business & Engineering Utilities"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="font-mono-num absolute right-3 bottom-3 rounded-md border border-white/20 bg-black/75 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                  41/41 CI · 10 TOOLS LIVE ↗
                </span>
              </div>
            </a>
          </div>
        </div>

        {/* 10 Clickable Direct Tool Deep-Link Cards */}
        <div className="mt-8 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
          {PRO_TOOLS.map((tool, index) => (
            <a
              key={tool.slug}
              href={`${TOOLS_BASE_URL}#/tool/${tool.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:border-[var(--accent)]"
              style={{
                backgroundColor: 'var(--bg-canvas)',
                borderColor: 'var(--border-hairline)',
              }}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono-num text-[10px] font-bold" style={{ color: 'var(--ink-muted)' }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span
                    className="font-mono-num rounded px-1.5 py-0.5 text-[9px] font-bold"
                    style={{
                      backgroundColor: tool.group === 'BUSINESS' ? 'var(--emerald-soft)' : 'var(--cyan-soft)',
                      color: tool.group === 'BUSINESS' ? 'var(--emerald)' : 'var(--cyan)',
                    }}
                  >
                    {tool.group}
                  </span>
                </div>
                <h3 className="font-display mt-2 text-xs font-bold leading-snug group-hover:text-[var(--accent)] sm:text-[13px]">
                  {tool.title[locale]}
                </h3>
                <p className="mt-1.5 text-[11px] leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
                  {tool.desc[locale]}
                </p>
              </div>
              <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: 'var(--accent)' }}>
                <span>{locale === 'vi' ? 'Mở công cụ' : 'Open tool'}</span>
                <IconArrowUpRight className="h-3 w-3" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
