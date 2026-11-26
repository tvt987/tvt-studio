import { formatMoney, roundUsd, roundVnd, STUDIO_CONTACT } from './catalog';
import type {
  AddonId,
  CustomEstimateResult,
  CustomScopeConfig,
  Locale,
  MilestoneStage,
  ProjectTypeId,
  ProjectTypeOption,
  ScopeAddon,
} from './types';

export const PREFERRED_STACK_OPTIONS = [
  { id: 'flexible', vi: 'Linh hoạt (Tư vấn tối ưu)', en: 'Flexible (Best-Fit Stack)' },
  { id: 'react-next', vi: 'React / Next.js / TS', en: 'React / Next.js / TS' },
  { id: 'vue-angular', vi: 'Vue / Nuxt / Angular', en: 'Vue / Nuxt / Angular' },
  { id: 'nodejs', vi: 'Node.js / NestJS', en: 'Node.js / NestJS' },
  { id: 'python', vi: 'Python / FastAPI / Django', en: 'Python / FastAPI / Django' },
  { id: 'dotnet', vi: 'C# / .NET 8–10', en: 'C# / .NET 8–10' },
  { id: 'java-go', vi: 'Java Spring / Golang', en: 'Java Spring / Golang' },
  { id: 'php-wp', vi: 'PHP / Laravel / WordPress', en: 'PHP / Laravel / WordPress' },
  { id: 'custom-lang', vi: 'Ngôn ngữ khác theo yêu cầu', en: 'Other Language on Request' },
] as const;

export const PROJECT_TYPES: ProjectTypeOption[] = [
  {
    id: 'starter-landing',
    tierName: {
      vi: 'Starter Landing / Profile / Công Ty',
      en: 'Starter Landing / Executive Profile',
    },
    priceRangeDisplay: {
      vi: '1.8M – 3.9M₫',
      en: '1.8M – 3.9M VND',
    },
    priceRangeUsdDisplay: '$75 – $159',
    summary: {
      vi: 'Landing page chuyển đổi cao, web giới thiệu công ty hoặc portfolio cá nhân thiết kế sắc nét — bàn giao nhanh, tinh chỉnh theo ý khách và hỗ trợ trong suốt quá trình sử dụng.',
      en: 'High-conversion landing page, company profile, or personal showcase — fast delivery, custom refinements, and ongoing usage support included.',
    },
    baseVnd: 2_400_000,
    baseUsd: 95,
    baseDays: 3,
    idealFor: {
      vi: [
        'Cá nhân, shop kinh doanh, SME cần web đẹp, chạy nhanh, chi phí hợp lý',
        'Nhận tinh chỉnh giao diện & nội dung theo đúng yêu cầu riêng',
        'Hỗ trợ kỹ thuật trực tiếp trong suốt quá trình vận hành & sử dụng',
      ],
      en: [
        'Founders, shops, and SMEs wanting flagship design at fair pricing',
        'Tailored layout & feature adjustments to match your brand',
        'Direct ongoing technical support while you operate the site',
      ],
    },
  },
  {
    id: 'growth-webapp',
    tierName: {
      vi: 'Growth Web Bán Hàng / Booking / Quản Lý',
      en: 'Growth E-Commerce / Booking / Web App',
    },
    priceRangeDisplay: {
      vi: '4.5M – 11.9M₫',
      en: '4.5M – 11.9M VND',
    },
    priceRangeUsdDisplay: '$179 – $479',
    badge: {
      vi: 'PHỔ BIẾN NHẤT',
      en: 'MOST POPULAR',
    },
    summary: {
      vi: 'Website bán hàng, phòng khám đặt lịch, sàn BĐS hoặc web app quản lý vận hành hoàn chỉnh — lập trình bằng bất kỳ ngôn ngữ nào khách yêu cầu, có thanh toán QR và hỗ trợ lâu dài.',
      en: 'Complete online store, clinic booking, PropTech, or business web app — built in any programming language/stack you prefer with QR checkout & ongoing support.',
    },
    baseVnd: 5_500_000,
    baseUsd: 219,
    baseDays: 6,
    idealFor: {
      vi: [
        'Cửa hàng, phòng khám, bất động sản, quán F&B, doanh nghiệp tăng trưởng',
        'Lập trình đa ngôn ngữ (React, Vue, Angular, Node.js, Python, .NET, Java, Go, PHP...)',
        'Nhận tinh chỉnh tính năng linh hoạt + đồng hành hỗ trợ suốt quá trình dùng',
      ],
      en: [
        'D2C shops, clinics, PropTech, F&B chains & growing businesses',
        'Polyglot delivery (React, Vue, Angular, Node.js, Python, .NET, Java, Go, PHP...)',
        'Flexible custom tweaks + dedicated ongoing operational support',
      ],
    },
  },
  {
    id: 'enterprise-system',
    tierName: {
      vi: 'Enterprise Hệ Thống Lớn / POS / AI & Backend Tải Cao',
      en: 'Enterprise Systems / POS / AI & High-Concurrency',
    },
    priceRangeDisplay: {
      vi: '12M₫+',
      en: '12M+ VND',
    },
    priceRangeUsdDisplay: '$480+',
    badge: {
      vi: 'CUSTOM ARCHITECTURE',
      en: 'CUSTOM ARCHITECTURE',
    },
    summary: {
      vi: 'Hệ thống phần mềm chuyên sâu theo yêu cầu (POS đa chi nhánh, CRM/ERP, Backend chịu tải cao hoặc AI Chatbot RAG) — xây dựng bằng bất kỳ stack nào doanh nghiệp đang dùng, thương lượng theo Milestone.',
      en: 'Deep custom software (Multi-branch POS, CRM/ERP, high-concurrency APIs, or private AI RAG) built in any stack your organization uses with milestone pricing.',
    },
    baseVnd: 12_000_000,
    baseUsd: 480,
    baseDays: 14,
    idealFor: {
      vi: [
        'Chuỗi cửa hàng, SaaS, tích hợp API/ERP/SSO hoặc nền tảng AI dữ liệu riêng',
        'Đa ngôn ngữ: .NET, Python, Node.js, Java, Go, PHP/Laravel, React, Vue, Angular...',
        'Đồng hành bảo trì, tinh chỉnh mở rộng và hỗ trợ đội vận hành dài hạn',
      ],
      en: [
        'Multi-branch operations, SaaS, ERP/SSO integrations, or private AI platforms',
        'Any requested stack: .NET, Python, Node.js, Java, Go, PHP/Laravel, React, Vue, Angular...',
        'Long-term support, iterative refinements, and team handover training',
      ],
    },
  },
];

export const SCOPE_ADDONS: ScopeAddon[] = [
  {
    id: 'webgl-3d',
    label: {
      vi: '3D Interactive WebGL / PBR',
      en: '3D Interactive WebGL / PBR Showcase',
    },
    description: {
      vi: 'Trình diễn sản phẩm 3D xoay 360°, ánh sáng studio PBR mượt 60fps',
      en: 'Interactive 360° PBR 3D product stage running smoothly at 60fps',
    },
    priceVnd: 1_500_000,
    priceUsd: 60,
    addedDays: 2,
  },
  {
    id: 'ai-rag',
    label: {
      vi: 'AI Chatbot RAG Dữ Liệu Riêng',
      en: 'Private-Data AI Chatbot (Hybrid RAG)',
    },
    description: {
      vi: 'Trợ lý AI trả lời chuẩn xác theo bảng giá, chính sách & PDF nội bộ doanh nghiệp',
      en: 'Grounded AI assistant trained on your pricing sheets, SOPs & private docs',
    },
    priceVnd: 2_500_000,
    priceUsd: 99,
    addedDays: 3,
  },
  {
    id: 'payment-gateway',
    label: {
      vi: 'Cổng Thanh Toán VietQR / VNPay / Stripe',
      en: 'Payment Gateway (VietQR / VNPay / Stripe)',
    },
    description: {
      vi: 'Tự động tạo mã thanh toán, đối soát giao dịch webhook chống trùng đơn',
      en: 'Automated QR checkout, webhook reconciliation & idempotent order ledger',
    },
    priceVnd: 1_200_000,
    priceUsd: 49,
    addedDays: 2,
  },
  {
    id: 'bilingual-i18n',
    label: {
      vi: 'Song Ngữ VI / EN & Đa Tiền Tệ',
      en: 'Bilingual VI / EN & Multi-Currency',
    },
    description: {
      vi: 'Chuyển đổi ngôn ngữ & tỷ giá VNĐ/USD 1 chạm chuẩn thương mại quốc tế',
      en: '1-click locale switcher and dynamic VND/USD pricing engine',
    },
    priceVnd: 800_000,
    priceUsd: 32,
    addedDays: 1,
  },
  {
    id: 'admin-cms',
    label: {
      vi: 'Trang Quản Trị CMS / Dashboard',
      en: 'Admin CMS & Executive Dashboard',
    },
    description: {
      vi: 'Tự cập nhật sản phẩm, bài viết, duyệt đơn hàng & xem biểu đồ doanh thu',
      en: 'Self-service catalog management, order approvals & live revenue telemetry',
    },
    priceVnd: 1_800_000,
    priceUsd: 72,
    addedDays: 3,
  },
  {
    id: 'seo-cwv',
    label: {
      vi: 'Tối Ưu SEO & Core Web Vitals 95+',
      en: 'Technical SEO & Core Web Vitals 95+',
    },
    description: {
      vi: 'Schema JSON-LD, sitemap tự động, nén ảnh WebP & tối ưu Lighthouse 95+',
      en: 'JSON-LD structured data, automated sitemaps, WebP pipeline & 95+ Lighthouse',
    },
    priceVnd: 600_000,
    priceUsd: 24,
    addedDays: 1,
  },
  {
    id: 'source-cicd',
    label: {
      vi: 'Bàn Giao 100% Source Code + CI/CD',
      en: '100% Source Code Ownership + CI/CD',
    },
    description: {
      vi: 'Toàn quyền sở hữu mã nguồn GitHub, automated tests & pipeline deploy 1 chạm',
      en: 'Full GitHub repository ownership, Vitest suite & automated deploy workflow',
    },
    priceVnd: 1_000_000,
    priceUsd: 40,
    addedDays: 1,
  },
];

export const PRIORITY_SURCHARGE_RATE = 0.2;
export const PRIORITY_TIME_FACTOR = 0.75;

export function buildMilestones(totalVnd: number, totalUsd: number): MilestoneStage[] {
  const stage1Vnd = roundVnd(totalVnd * 0.3);
  const stage2Vnd = roundVnd(totalVnd * 0.4);
  const stage3Vnd = Math.max(0, totalVnd - stage1Vnd - stage2Vnd);

  const stage1Usd = roundUsd(totalUsd * 0.3);
  const stage2Usd = roundUsd(totalUsd * 0.4);
  const stage3Usd = Math.max(0, totalUsd - stage1Usd - stage2Usd);

  return [
    {
      stage: 1,
      ratio: 0.3,
      percentLabel: '30%',
      label: {
        vi: 'Đợt 1 · Cọc Khởi Tạo & Chốt Spec',
        en: 'Stage 1 · Kickoff Deposit & Spec Lock',
      },
      deliverable: {
        vi: 'Chốt tài liệu kiến trúc, wireframe & khởi tạo repo CI/CD',
        en: 'Architecture blueprint lock, visual direction & CI/CD repo setup',
      },
      amountVnd: stage1Vnd,
      amountUsd: stage1Usd,
    },
    {
      stage: 2,
      ratio: 0.4,
      percentLabel: '40%',
      label: {
        vi: 'Đợt 2 · Nghiệm Thu UAT Staging',
        en: 'Stage 2 · Staging UAT Sign-Off',
      },
      deliverable: {
        vi: 'Kiểm thử toàn bộ tính năng trên link staging, responsive & hiệu năng',
        en: 'Full interactive feature review on live staging across desktop & mobile',
      },
      amountVnd: stage2Vnd,
      amountUsd: stage2Usd,
    },
    {
      stage: 3,
      ratio: 0.3,
      percentLabel: '30%',
      label: {
        vi: 'Đợt 3 · Go-Live & Bàn Giao Toàn Bộ',
        en: 'Stage 3 · Production Go-Live & Handover',
      },
      deliverable: {
        vi: 'Gắn domain production, bàn giao source code, tài liệu & kích hoạt bảo hành 90 ngày',
        en: 'Production domain launch, full source transfer, docs & 90-day warranty',
      },
      amountVnd: stage3Vnd,
      amountUsd: stage3Usd,
    },
  ];
}

export function getProjectTypeById(id: ProjectTypeId): ProjectTypeOption {
  const found = PROJECT_TYPES.find((item) => item.id === id);
  return found ?? PROJECT_TYPES[1];
}

export function calculateCustomEstimate(config: CustomScopeConfig): CustomEstimateResult {
  const projectType = getProjectTypeById(config.projectType);
  const uniqueAddonIds = Array.from(new Set<AddonId>(config.selectedAddons));
  const addons = SCOPE_ADDONS.filter((addon) => uniqueAddonIds.includes(addon.id));

  const baseVnd = projectType.baseVnd;
  const baseUsd = projectType.baseUsd;

  const addonsVnd = addons.reduce((acc, item) => acc + item.priceVnd, 0);
  const addonsUsd = addons.reduce((acc, item) => acc + item.priceUsd, 0);

  const subtotalVnd = baseVnd + addonsVnd;
  const subtotalUsd = baseUsd + addonsUsd;

  const rushSurchargeVnd =
    config.pace === 'priority' ? roundVnd(subtotalVnd * PRIORITY_SURCHARGE_RATE) : 0;
  const rushSurchargeUsd =
    config.pace === 'priority' ? roundUsd(subtotalUsd * PRIORITY_SURCHARGE_RATE) : 0;

  const totalVnd = subtotalVnd + rushSurchargeVnd;
  const totalUsd = subtotalUsd + rushSurchargeUsd;

  const rawDays = projectType.baseDays + addons.reduce((acc, item) => acc + item.addedDays, 0);
  const estimatedDays =
    config.pace === 'priority' ? Math.max(4, Math.ceil(rawDays * PRIORITY_TIME_FACTOR)) : rawDays;

  const milestones = buildMilestones(totalVnd, totalUsd);

  return {
    projectType,
    addons,
    baseVnd,
    baseUsd,
    addonsVnd,
    addonsUsd,
    rushSurchargeVnd,
    rushSurchargeUsd,
    totalVnd,
    totalUsd,
    estimatedDays,
    milestones,
  };
}

export function generateTechnicalProposalMarkdown(
  config: CustomScopeConfig,
  estimate: CustomEstimateResult,
  locale: Locale
): string {
  const nowDate = new Date().toISOString().slice(0, 10);
  const projectTitle =
    config.projectName?.trim() ||
    (locale === 'vi' ? 'Dự Án Phần Mềm Thiết Kế Riêng' : 'Custom Engineering Engagement');

  if (locale === 'vi') {
    const addonRows =
      estimate.addons.length > 0
        ? estimate.addons
            .map(
              (a) =>
                `| ${a.label.vi} | +${a.addedDays} ngày | ${formatMoney(a.priceVnd, 'VND')} (${formatMoney(a.priceUsd, 'USD')}) |`
            )
            .join('\n')
        : '| Không chọn module mở rộng | — | 0₫ ($0) |';

    const milestoneRows = estimate.milestones
      .map(
        (m) =>
          `| ${m.label.vi} | ${m.percentLabel} | ${formatMoney(m.amountVnd, 'VND')} (${formatMoney(m.amountUsd, 'USD')}) | ${m.deliverable.vi} |`
      )
      .join('\n');

    return [
      `# TVT STUDIO — BẢN ĐỀ XUẤT KỸ THUẬT & BÁO GIÁ DỰ ÁN`,
      ``,
      `- **Ngày lập**: ${nowDate}`,
      `- **Tên dự án**: ${projectTitle}`,
      `- **Gói nền tảng**: ${estimate.projectType.tierName.vi}`,
      `- **Ngôn ngữ / Nền tảng mong muốn**: ${config.preferredStack?.trim() || 'Linh hoạt theo yêu cầu (React, Next.js, Vue, Angular, Node.js, Python, .NET, Java, Go, PHP...)'}`,
      `- **Tiến độ triển khai**: ${config.pace === 'priority' ? 'Ưu tiên gấp (-25% thời gian)' : 'Tiêu chuẩn'} — Ước tính **${estimate.estimatedDays} ngày làm việc**`,
      `- **Kiến trúc sư phụ trách**: ${STUDIO_CONTACT.architectName} (${STUDIO_CONTACT.phoneDisplay} · ${STUDIO_CONTACT.email})`,
      ``,
      `## 1. Bóc Tách Hạng Mục & Chi Phí`,
      ``,
      `| Hạng mục | Thời gian | Chi phí |`,
      `| --- | --- | --- |`,
      `| Nền tảng cốt lõi: ${estimate.projectType.tierName.vi} | ${estimate.projectType.baseDays} ngày | ${formatMoney(estimate.baseVnd, 'VND')} (${formatMoney(estimate.baseUsd, 'USD')}) |`,
      addonRows,
      ...(config.pace === 'priority'
        ? [
            `| Phụ phí tăng tốc tiến độ (+20%) | Rút ngắn 25% | ${formatMoney(estimate.rushSurchargeVnd, 'VND')} (${formatMoney(estimate.rushSurchargeUsd, 'USD')}) |`,
          ]
        : []),
      `| **TỔNG CỘNG ƯỚC TÍNH** | **${estimate.estimatedDays} ngày** | **${formatMoney(estimate.totalVnd, 'VND')} (${formatMoney(estimate.totalUsd, 'USD')})** |`,
      ``,
      `## 2. Lộ Trình Thanh Toán 3 Giai Đoạn (30% · 40% · 30%)`,
      ``,
      `| Giai đoạn | Tỷ lệ | Giá trị | Tiêu chí nghiệm thu |`,
      `| --- | --- | --- | --- |`,
      milestoneRows,
      ``,
      `## 3. Cam Kết Kỹ Thuật & SLA`,
      ``,
      `- Kiểm thử tự động (Vitest / CI GitHub Actions) trước khi bàn giao staging & production.`,
      `- Tương thích đa thiết bị Desktop (1440px+) & Mobile (390px), 0 lỗi console, tối ưu tốc độ tải.`,
      `- Nhận tinh chỉnh linh hoạt theo yêu cầu và hỗ trợ kỹ thuật trực tiếp trong suốt quá trình sử dụng (bảo hành lỗi miễn phí & đồng hành lâu dài).`,
      `- Nhận triển khai bằng bất kỳ ngôn ngữ / framework nào khách hàng mong muốn.`,
      `- Kênh chốt phạm vi trực tiếp: Zalo ${STUDIO_CONTACT.phoneDisplay} (${STUDIO_CONTACT.zaloUrl}) hoặc Email ${STUDIO_CONTACT.email}.`,
      ``,
    ].join('\n');
  }

  const addonRows =
    estimate.addons.length > 0
      ? estimate.addons
          .map(
            (a) =>
              `| ${a.label.en} | +${a.addedDays} days | ${formatMoney(a.priceUsd, 'USD')} (${formatMoney(a.priceVnd, 'VND')}) |`
          )
          .join('\n')
      : '| No optional add-ons selected | — | $0 (0₫) |';

  const milestoneRows = estimate.milestones
    .map(
      (m) =>
        `| ${m.label.en} | ${m.percentLabel} | ${formatMoney(m.amountUsd, 'USD')} (${formatMoney(m.amountVnd, 'VND')}) | ${m.deliverable.en} |`
    )
    .join('\n');

  return [
    `# TVT STUDIO — TECHNICAL ARCHITECTURE PROPOSAL & ESTIMATE`,
    ``,
    `- **Prepared Date**: ${nowDate}`,
    `- **Project Name**: ${projectTitle}`,
    `- **Core Architecture Tier**: ${estimate.projectType.tierName.en}`,
    `- **Delivery Pace**: ${config.pace === 'priority' ? 'Priority Acceleration (-25% timeline)' : 'Standard'} — Estimated **${estimate.estimatedDays} business days**`,
    `- **Principal Architect**: ${STUDIO_CONTACT.architectName} (${STUDIO_CONTACT.phoneDisplay} · ${STUDIO_CONTACT.email})`,
    ``,
    `## 1. Scope Breakdown & Investment`,
    ``,
    `| Line Item | Effort | Investment |`,
    `| --- | --- | --- |`,
    `| Core Tier: ${estimate.projectType.tierName.en} | ${estimate.projectType.baseDays} days | ${formatMoney(estimate.baseUsd, 'USD')} (${formatMoney(estimate.baseVnd, 'VND')}) |`,
    addonRows,
    ...(config.pace === 'priority'
      ? [
          `| Priority Acceleration Surcharge (+20%) | -25% schedule | ${formatMoney(estimate.rushSurchargeUsd, 'USD')} (${formatMoney(estimate.rushSurchargeVnd, 'VND')}) |`,
        ]
      : []),
    `| **TOTAL ESTIMATE** | **${estimate.estimatedDays} days** | **${formatMoney(estimate.totalUsd, 'USD')} (${formatMoney(estimate.totalVnd, 'VND')})** |`,
    ``,
    `## 2. 3-Stage Milestone Schedule (30% · 40% · 30%)`,
    ``,
    `| Stage | Share | Amount | Acceptance Criteria |`,
    `| --- | --- | --- | --- |`,
    milestoneRows,
    ``,
    `## 3. Engineering & SLA Guarantees`,
    ``,
    `- Automated CI verification (TypeScript strict mode, Vitest suite, zero console errors) prior to staging and production release.`,
    `- Responsive verification across Desktop (1440px) and Mobile (390px) viewports.`,
    `- 90-day post-launch engineering defect warranty.`,
    `- B2B / Deel / Wise / Wire Transfer contractor invoicing available with zero payroll overhead.`,
    `- Direct Architect Contact: ${STUDIO_CONTACT.email} | Zalo/Hotline: ${STUDIO_CONTACT.phoneDisplay} (${STUDIO_CONTACT.zaloUrl})`,
    ``,
  ].join('\n');
}
