import React, { useState } from 'react';
import type { Locale } from '../engines/types';
import { IconCheck, IconChevronDown, IconShield } from './Icons';

interface ProcessSlaSectionProps {
  locale: Locale;
}

export const ProcessSlaSection: React.FC<ProcessSlaSectionProps> = ({ locale }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const steps = [
    {
      num: '01',
      duration: locale === 'vi' ? 'Ngày 1' : 'Day 1',
      title: locale === 'vi' ? 'Khám Phá & Chốt Spec' : 'Discovery & Spec Lock',
      desc:
        locale === 'vi'
          ? 'Trao đổi trực tiếp 1-1 với Solution Architect để chốt mẫu/tính năng, cấu trúc dữ liệu, ngân sách và ký biên nhận đợt 1 (30%).'
          : 'Direct 1-on-1 kickoff with the Principal Architect to lock visual identity, data model, acceptance criteria, and 30% kickoff milestone.',
    },
    {
      num: '02',
      duration: locale === 'vi' ? 'Ngày 2–4' : 'Days 2–4',
      title: locale === 'vi' ? 'Tùy Biến Giao Diện & Kiến Trúc' : 'Brand System & Core Architecture',
      desc:
        locale === 'vi'
          ? 'Triển khai bộ màu nhận diện, typography, tối ưu tài nguyên WebP và xây dựng các module logic cốt lõi (giỏ hàng, đặt lịch, POS, AI).'
          : 'Implement custom brand typography, Dark/Light palettes, WebP media optimization, and unit-tested core commerce/booking engines.',
    },
    {
      num: '03',
      duration: locale === 'vi' ? 'Ngày 5–10' : 'Days 5–10',
      title: locale === 'vi' ? 'Kiểm Thử Tự Động & UAT Staging' : 'Automated CI & Staging UAT',
      desc:
        locale === 'vi'
          ? 'Chạy Vitest + Playwright kiểm tra Desktop 1440px & Mobile 390px, 0 lỗi console. Gửi link staging thật để khách hàng nghiệm thu đợt 2 (40%).'
          : 'Run Vitest & multi-viewport Playwright QA (zero errors, zero horizontal overflow). Deliver live staging URL for Stage 2 UAT sign-off (40%).',
    },
    {
      num: '04',
      duration: locale === 'vi' ? 'Go-Live' : 'Go-Live',
      title: locale === 'vi' ? 'Bàn Giao Domain, Source & Bảo Hành' : 'Production Launch & 90-Day Warranty',
      desc:
        locale === 'vi'
          ? 'Gắn tên miền chính thức, bật SSL/CI/CD, bàn giao trọn tài liệu vận hành (và GitHub repo với gói Full Source), tất toán 30% còn lại.'
          : 'Attach production custom domain, enable SSL & CI/CD, hand over documentation & full repo ownership, and activate 90-day warranty.',
    },
  ];

  const slaGuarantees = [
    {
      code: 'SLA-01',
      title: locale === 'vi' ? 'Hiệu Năng Core Web Vitals 95+' : 'Core Web Vitals 95+ Target',
      detail:
        locale === 'vi'
          ? 'Toàn bộ hình ảnh nén chuẩn WebP, bundle tách chunk gọn nhẹ, 0 lỗi console và tương thích mượt từ 360px đến 4K.'
          : 'WebP asset pipelines, clean code splitting, zero runtime console errors, and responsive fidelity from 360px to 4K.',
    },
    {
      code: 'SLA-02',
      title:
        locale === 'vi'
          ? 'Đồng Hành Hỗ Trợ Trong Suốt Quá Trình Sử Dụng & Tinh Chỉnh Linh Hoạt'
          : 'Ongoing Usage Support & Flexible Custom Refinements',
      detail:
        locale === 'vi'
          ? 'Không bỏ rơi sau bàn giao: hướng dẫn vận hành 1-1, hỗ trợ kỹ thuật trực tiếp qua Zalo trong quá trình sử dụng thực tế, bảo hành lỗi miễn phí và nhận tinh chỉnh/nâng cấp theo yêu cầu.'
          : 'Dedicated 1-on-1 guidance, direct technical support throughout real-world operation, free defect warranty, and flexible iterative feature refinements.',
    },
    {
      code: 'SLA-03',
      title: locale === 'vi' ? 'Kiến Trúc Chống Lỗi Giao Dịch' : 'Transactional Safety & Idempotency',
      detail:
        locale === 'vi'
          ? 'Áp dụng kỷ luật kiểm thử tài chính từ hệ thống 700+ siêu thị: không sai số làm tròn, chống áp trùng voucher và mất dữ liệu.'
          : 'Financial precision borrowed from 700+ retail store systems: zero rounding drift, idempotent vouchers, and strict input validation.',
    },
    {
      code: 'SLA-04',
      title: locale === 'vi' ? 'Minh Bạch 100% Quyền Sở Hữu' : '100% Ownership Transparency',
      detail:
        locale === 'vi'
          ? 'Không khóa nhà cung cấp (zero vendor lock-in). Gói Full Source bàn giao sạch repository GitHub + GitHub Actions CI/CD.'
          : 'Zero vendor lock-in. Full Source licenses transfer clean GitHub repository ownership plus automated CI/CD workflows.',
    },
  ];

  const faqs = [
    {
      q:
        locale === 'vi'
          ? 'Khác biệt giữa gói Standard Deploy và Full Source + Custom Brand (+30%) là gì?'
          : 'What is the difference between Standard Deploy and Full Source + Custom Brand (+30%)?',
      a:
        locale === 'vi'
          ? 'Standard Deploy bao gồm tùy biến logo, bảng màu, nội dung, tinh chỉnh theo nhu cầu và triển khai trọn gói lên tên miền riêng kèm hỗ trợ sử dụng. Gói Full Source (+30%) bổ sung bàn giao 100% mã nguồn sạch trên GitHub, bộ kiểm thử tự động, CI/CD và quyền tự mở rộng không giới hạn.'
          : 'Standard Deploy covers brand styling, copy/product swap, custom tweaks, live domain launch, and usage support. Full Source (+30%) adds 100% private GitHub repository ownership, automated test suites, CI/CD, and unrestricted internal extensibility.',
    },
    {
      q:
        locale === 'vi'
          ? 'Thời gian bàn giao thực tế cho một website mẫu hoặc dự án custom là bao lâu?'
          : 'How fast can you deliver a rebranded template or custom software build?',
      a:
        locale === 'vi'
          ? 'Các mẫu sẵn có như Lumina MedSpa, Maison Véra hoặc Aether Acoustics chỉ cần 2–5 ngày làm việc sau khi nhận nội dung thương hiệu. Hệ thống POS/SaaS hoặc code theo yêu cầu từ đầu dao động 5–14 ngày tùy độ phức tạp.'
          : 'Ready-to-deploy storefronts like Lumina MedSpa, Maison Véra, or Aether Acoustics launch within 2–5 business days after receiving brand assets. Custom POS, SaaS, or backend systems run 5–14 days depending on scope.',
    },
    {
      q:
        locale === 'vi'
          ? 'Tôi có được xem bản chạy thử và yêu cầu tinh chỉnh trước khi thanh toán đủ 100% không?'
          : 'Can I review a working staging deployment and request adjustments before paying 100%?',
      a:
        locale === 'vi'
          ? 'Chắc chắn có. Toàn bộ dự án đều có chế độ Đặt cọc khởi tạo 30%, bạn được dùng thử trực tiếp link Staging, yêu cầu tinh chỉnh giao diện/tính năng cho ưng ý rồi mới thanh toán 40%, và 30% cuối cùng khi Go-Live hoàn tất.'
          : 'Absolutely. Start with a 30% kickoff deposit, test the live staging URL and request refinements before settling 40%, and pay the final 30% upon production launch.',
    },
    {
      q:
        locale === 'vi'
          ? 'TVT Studio có nhận code bằng ngôn ngữ lập trình khác ngoài .NET hay Angular không?'
          : 'Can TVT Studio build in programming languages other than .NET or Angular?',
      a:
        locale === 'vi'
          ? 'Có — chúng tôi nhận thiết kế web & lập trình theo yêu cầu bằng BẤT KỲ ngôn ngữ/nền tảng nào phù hợp với bài toán của bạn: React, Next.js, Vue, Nuxt, Angular, TypeScript, Node.js/NestJS, Python/FastAPI/Django, C#/.NET, Java Spring Boot, Golang, PHP/Laravel hay WordPress, đồng thời hỗ trợ trực tiếp trong suốt quá trình sử dụng.'
          : 'Yes — we design and engineer custom projects in ANY language or stack your project requires: React, Next.js, Vue, Nuxt, Angular, TypeScript, Node.js/NestJS, Python/FastAPI/Django, C#/.NET, Java Spring Boot, Golang, PHP/Laravel, or WordPress, with full ongoing usage support.',
    },
    {
      q:
        locale === 'vi'
          ? 'Khách hàng doanh nghiệp quốc tế (US/EU/Singapore) thanh toán và làm việc như thế nào?'
          : 'How do international B2B clients (US/EU/APAC) handle contracts and payments?',
      a:
        locale === 'vi'
          ? 'Hỗ trợ đầy đủ hóa đơn B2B Contractor qua Deel, Wise Business hoặc chuyển khoản Wire USD — không phát sinh thủ tục thuế/payroll. Múi giờ làm việc linh hoạt overlap 4–6 giờ/ngày với US (EST/PST) và EU.'
          : 'We support seamless B2B contractor engagement via Deel, Wise Business, or USD Wire Transfer with zero payroll overhead, plus 4–6 hours daily overlap with US (EST/PST) and EU business hours.',
    },
    {
      q:
        locale === 'vi'
          ? 'Chi phí duy trì Hosting và tên miền hàng năm có cao không?'
          : 'What are the ongoing annual hosting and domain maintenance costs?',
      a:
        locale === 'vi'
          ? 'Với các website tĩnh/SPA hiện đại (React + Vite), bạn có thể chạy miễn phí 0₫ trên Cloudflare Pages / Vercel / GitHub Pages với tốc độ CDN toàn cầu, chỉ cần duy trì tên miền khoảng 300.000₫–800.000₫/năm. Với hệ thống cần server API/Database riêng, tôi sẽ tư vấn gói VPS/Cloud tối ưu chi phí nhất.'
          : 'Modern React/Vite storefronts run at $0/month on Cloudflare Pages, Vercel, or GitHub Pages with global edge CDN — you only pay ~$12–$30/year for your custom domain. Full backend workloads are sized cleanly on cost-effective cloud VPS or containers.',
    },
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-canvas)' }}>
      {/* Process & SLA Section */}
      <section
        id="process"
        className="mx-auto max-w-[1360px] border-t px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
        style={{ borderColor: 'var(--border-hairline)' }}
      >
        <div className="max-w-2xl">
          <div className="font-mono-num text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
            03 // {locale === 'vi' ? 'QUY TRÌNH & CAM KẾT SLA' : 'DELIVERY PROCESS & SLA'}
          </div>
          <h2 className="font-display mt-2 text-2xl font-extrabold sm:text-4xl">
            {locale === 'vi'
              ? '4 Bước Bàn Giao Chuẩn Kỹ Sư — Không Mập Mờ, Không Trễ Hẹn.'
              : '4-Stage Engineering Delivery — Zero Ambiguity, Zero Slipped Deadlines.'}
          </h2>
        </div>

        {/* 4 Process Steps */}
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.num} className="surface-card flex flex-col justify-between rounded-2xl p-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono-num text-2xl font-extrabold" style={{ color: 'var(--accent)' }}>
                    {step.num}
                  </span>
                  <span
                    className="font-mono-num rounded-md border px-2 py-0.5 text-[11px] font-semibold"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--border-hairline)',
                      color: 'var(--ink-secondary)',
                    }}
                  >
                    {step.duration}
                  </span>
                </div>
                <h3 className="font-display mt-4 text-base font-bold">{step.title}</h3>
                <p className="mt-2.5 text-xs leading-relaxed sm:text-sm" style={{ color: 'var(--ink-secondary)' }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* SLA Guarantees */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {slaGuarantees.map((sla) => (
            <div
              key={sla.code}
              className="surface-elevated flex items-start gap-4 rounded-2xl p-5"
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-hairline)',
                  color: 'var(--emerald)',
                }}
              >
                <IconShield className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono-num text-[10px] font-bold" style={{ color: 'var(--accent)' }}>
                    {sla.code}
                  </span>
                  <h3 className="text-sm font-bold">{sla.title}</h3>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed sm:text-sm" style={{ color: 'var(--ink-secondary)' }}>
                  {sla.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        className="border-t py-16 lg:py-20"
        style={{
          borderColor: 'var(--border-hairline)',
          backgroundColor: 'var(--bg-surface)',
        }}
      >
        <div className="mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="font-mono-num text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
              04 // FAQ
            </span>
            <h2 className="font-display mt-2 text-2xl font-extrabold sm:text-3xl">
              {locale === 'vi' ? 'Câu Hỏi Thường Gặp Trước Khi Đặt Hàng' : 'Frequently Asked Commercial Questions'}
            </h2>
          </div>

          <div className="mt-8 space-y-3">
            {faqs.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={item.q}
                  className="overflow-hidden rounded-xl border transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-canvas)',
                    borderColor: isOpen ? 'var(--border-strong)' : 'var(--border-hairline)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-sm font-semibold sm:text-[15px]">{item.q}</span>
                    <IconChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div
                      className="border-t px-5 py-4 text-xs leading-relaxed sm:text-sm"
                      style={{
                        borderColor: 'var(--border-hairline)',
                        color: 'var(--ink-secondary)',
                      }}
                    >
                      <div className="flex items-start gap-2.5">
                        <IconCheck className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--emerald)' }} />
                        <p>{item.a}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
