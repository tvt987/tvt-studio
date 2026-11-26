import type {
  CatalogSort,
  Currency,
  LicenseTier,
  ProductCategory,
  TemplateProduct,
} from './types';

export const FULL_SOURCE_MULTIPLIER = 1.4;

export const STUDIO_CONTACT = {
  architectName: 'Trương Văn Tình',
  architectTitleVi: 'Principal Solution Architect & Founder',
  architectTitleEn: 'Principal Solution Architect & Founder',
  phoneDisplay: '0931 467 024',
  phoneRaw: '0931467024',
  email: 'tinhkun102@gmail.com',
  zaloUrl: 'https://zalo.me/0931467024',
  githubUrl: 'https://github.com/tvt987',
  portfolioUrl: 'https://tvt987.github.io',
  locationVi: 'TP. Hồ Chí Minh, Việt Nam · Global Remote',
  locationEn: 'Ho Chi Minh City, Vietnam · Global Remote',
} as const;

export const CATALOG_PRODUCTS: TemplateProduct[] = [
  {
    id: 'maison-vera',
    sku: 'TVT-3D-01',
    name: 'Maison Véra',
    subtitle: {
      vi: 'Website Thời Trang & Kính Mắt 3D Xa Xỉ',
      en: 'Luxury 3D Eyewear & Couture Commerce',
    },
    tagline: {
      vi: 'Trình diễn sản phẩm 3D WebGL PBR trực quan, giỏ hàng sang trọng và trải nghiệm editorial đẳng cấp flagship boutique.',
      en: 'Interactive WebGL PBR 3D product showcase, luxury atelier checkout flow, and editorial flagship storytelling.',
    },
    category: 'commerce-3d',
    categoryLabel: {
      vi: 'Bán Hàng 3D',
      en: '3D Commerce',
    },
    priceVnd: 8_900_000,
    originalPriceVnd: 14_500_000,
    priceUsd: 359,
    originalPriceUsd: 580,
    deliveryDaysMin: 5,
    deliveryDaysMax: 7,
    liveUrl: 'https://tvt987.github.io/maison-vera/',
    previewImage: './media/maison-vera.webp',
    featuredRank: 1,
    stack: ['React 19', 'Three.js PBR', 'TypeScript', 'Tailwind v4'],
    deliverables: {
      vi: [
        'Tùy biến toàn bộ nhận diện thương hiệu, màu sắc, bộ ảnh và SKU sản phẩm',
        'Trình xoay 3D PBR ánh sáng studio mượt 60fps trên Desktop & Mobile',
        'Giỏ hàng, mã ưu đãi, đặt lịch thử kính tại boutique & form đơn hàng',
        'Triển khai Hosting, gắn Domain riêng, SSL & tối ưu SEO OpenGraph',
      ],
      en: [
        'Complete brand customization across typography, palette, imagery, and SKUs',
        '60fps WebGL PBR 3D studio showcase calibrated for desktop & mobile',
        'Shopping bag, promo code engine, private fitting booking & order capture',
        'Custom domain deployment, SSL, CI/CD workflow & SEO OpenGraph optimization',
      ],
    },
    architectureNote: {
      vi: 'Kiến trúc tách lớp 3D Scene + Pricing Engine thuần giúp mở rộng danh mục hàng trăm SKU không giật khung hình.',
      en: 'Decoupled 3D PBR scene graph and pure pricing engine built to scale cleanly across flagship SKUs.',
    },
    metricsBadge: '60FPS PBR · CWV 96+',
  },
  {
    id: 'aether-acoustics',
    sku: 'TVT-3D-02',
    name: 'Aether Acoustics',
    subtitle: {
      vi: 'Website Âm Thanh 3D PBR & DSP',
      en: '3D Acoustic Hardware & Real-Time DSP Storefront',
    },
    tagline: {
      vi: 'Trình diễn tai nghe & thiết bị âm thanh 3D kim loại phay xước kèm bộ cân bằng âm học DSP thời gian thực.',
      en: 'Machined acoustic hardware showcase in WebGL PBR paired with an interactive Web Audio DSP equalizer.',
    },
    category: 'commerce-3d',
    categoryLabel: {
      vi: 'Bán Hàng 3D',
      en: '3D Commerce',
    },
    priceVnd: 8_900_000,
    originalPriceVnd: 15_000_000,
    priceUsd: 359,
    originalPriceUsd: 599,
    deliveryDaysMin: 5,
    deliveryDaysMax: 8,
    liveUrl: 'https://tvt987.github.io/aether-acoustics/',
    previewImage: './media/aether-acoustics.webp',
    featuredRank: 2,
    stack: ['React 19', 'WebGL PBR', 'Web Audio DSP', 'Vitest'],
    deliverables: {
      vi: [
        'Bản dựng sản phẩm 3D vật liệu nhôm/titan và chuyển đổi phiên bản màu trực tiếp',
        'Module thử âm học DSP trực quan tạo khác biệt tuyệt đối trước đối thủ',
        'Trang cấu hình phiên bản, bảng thông số kỹ thuật & giỏ hàng đặt mua',
        'Tối ưu tải tài nguyên WebP/DRACO, bàn giao trọn bộ hướng dẫn vận hành',
      ],
      en: [
        'Brushed titanium/anodized 3D hardware viewer with instant colorway switching',
        'Interactive acoustic DSP preview module elevating product conversion',
        'Spec matrix, colorway configurator, and streamlined checkout pipeline',
        'Compressed asset pipeline with full deployment & handover documentation',
      ],
    },
    architectureNote: {
      vi: 'Tối ưu shader vật liệu nhẹ cho GPU mobile kết hợp Web Audio API không phụ thuộc thư viện nặng.',
      en: 'Lightweight PBR shaders paired with zero-dependency Web Audio DSP acoustics.',
    },
    metricsBadge: 'WEB AUDIO DSP · 3D PBR',
  },
  {
    id: 'lumina-medspa',
    sku: 'TVT-MED-03',
    name: 'Lumina MedSpa',
    subtitle: {
      vi: 'Website Phòng Khám Nha Khoa / Thẩm Mỹ & Đặt Lịch',
      en: 'Aesthetic Clinic, Dental & Smart Booking Platform',
    },
    tagline: {
      vi: 'Website chuẩn y khoa cao cấp với hệ thống chọn bác sĩ, khung giờ thông minh, so sánh trước/sau và bảng giá dịch vụ minh bạch.',
      en: 'Editorial medical aesthetics storefront with doctor slot booking, treatment calculator, and before/after showcase.',
    },
    category: 'clinic-proptech',
    categoryLabel: {
      vi: 'Phòng Khám & BĐS',
      en: 'Clinic & PropTech',
    },
    priceVnd: 6_900_000,
    originalPriceVnd: 11_500_000,
    priceUsd: 279,
    originalPriceUsd: 460,
    deliveryDaysMin: 5,
    deliveryDaysMax: 7,
    liveUrl: 'https://tvt987.github.io/lumina-medspa/',
    previewImage: './media/lumina-medspa.webp',
    previewBadge: 'MEDSPA & DENTAL · LIVE BOOKING',
    featuredRank: 3,
    stack: ['React 19', 'Booking Engine', 'TypeScript', 'SEO Medical'],
    deliverables: {
      vi: [
        'Luồng đặt lịch khám 3 bước chọn chi nhánh, chuyên khoa, bác sĩ & khung giờ trống',
        'Bảng giá liệu trình minh bạch, tính gói combo chăm sóc & gửi xác nhận Zalo/Email',
        'Khu vực đội ngũ bác sĩ, chứng chỉ y khoa & hình ảnh khách hàng tăng độ tin cậy',
        'Tối ưu SEO Local Google Maps và tốc độ tải tức thì trên điện thoại khách hàng',
      ],
      en: [
        '3-step appointment booking flow by branch, specialty, doctor, and live time slots',
        'Transparent treatment menu, bundle calculator & instant Zalo/Email confirmation',
        'Doctor credential profiles, clinical hygiene badges, and social proof showcase',
        'Local SEO schema markup and instant mobile loading performance',
      ],
    },
    architectureNote: {
      vi: 'Bộ lọc lịch trống thuần logic có kiểm thử đơn vị chống đặt trùng giờ và tính toán gói liệu trình chính xác.',
      en: 'Unit-tested slot conflict prevention and treatment bundle pricing engine.',
    },
    metricsBadge: 'SMART BOOKING · 5–7D',
  },
  {
    id: 'kinetix-proptech',
    sku: 'TVT-PROP-04',
    name: 'Kinetix PropTech',
    subtitle: {
      vi: 'Sàn Bất Động Sản 3D & Máy Tính Lãi Vay',
      en: '3D Real Estate Portal & Mortgage Simulator',
    },
    tagline: {
      vi: 'Sàn giao dịch dự án cao cấp với bộ lọc căn hộ đa tiêu chí, mô phỏng phân khu và máy tính trả góp ngân hàng theo từng tháng.',
      en: 'High-conversion property portal with multi-facet unit filtering, interactive floor insights, and amortization calculator.',
    },
    category: 'clinic-proptech',
    categoryLabel: {
      vi: 'Phòng Khám & BĐS',
      en: 'Clinic & PropTech',
    },
    priceVnd: 9_900_000,
    originalPriceVnd: 16_500_000,
    priceUsd: 399,
    originalPriceUsd: 660,
    deliveryDaysMin: 6,
    deliveryDaysMax: 10,
    liveUrl: 'https://tvt987.github.io/kinetix-proptech/',
    previewImage: './media/kinetix-proptech.webp',
    previewBadge: 'PROPTECH 3D · MORTGAGE ENGINE',
    featuredRank: 4,
    stack: ['React 19', 'Mortgage Engine', 'Interactive Map', 'TypeScript'],
    deliverables: {
      vi: [
        'Bộ lọc dự án/căn hộ theo khu vực, diện tích, hướng ban công & tầm tài chính',
        'Máy tính lãi vay ngân hàng (dư nợ giảm dần / cố định) xuất bảng lịch trả nợ chi tiết',
        'Trang chi tiết dự án chuẩn chủ đầu tư, đăng ký tham quan nhà mẫu thu lead ngay',
        'Hỗ trợ song ngữ VI/EN phù hợp khách mua trong nước và nhà đầu tư quốc tế',
      ],
      en: [
        'Multi-facet property filter by district, floor area, orientation, and budget',
        'Interactive mortgage amortization simulator (reducing balance & fixed rate)',
        'Developer-grade project showcase with instant private viewing lead capture',
        'Bilingual VI/EN layout tailored for domestic buyers and overseas investors',
      ],
    },
    architectureNote: {
      vi: 'Động cơ tài chính tính lãi suất gốc-lãi theo chuẩn ngân hàng Việt Nam không sai số làm tròn.',
      en: 'Precision amortization math engine verified with automated financial unit tests.',
    },
    metricsBadge: 'AMORTIZATION MATH · LEAD GEN',
  },
  {
    id: 'pulse-pos-fnb',
    sku: 'TVT-POS-05',
    name: 'PulsePOS F&B',
    subtitle: {
      vi: 'Hệ Thống POS Quán Café / Nhà Hàng & Bếp KDS',
      en: 'Café & Restaurant POS Terminal with Live KDS',
    },
    tagline: {
      vi: 'Phần mềm bán hàng cảm ứng mượt mà cho quán café, nhà hàng: sơ đồ bàn, topping, đồng bộ màn hình bếp KDS & tính tiền tách bill.',
      en: 'Touch-optimized hospitality POS with floor plan management, modifiers, live kitchen display (KDS), and split billing.',
    },
    category: 'pos-fnb',
    categoryLabel: {
      vi: 'POS & F&B',
      en: 'POS & F&B',
    },
    priceVnd: 12_900_000,
    originalPriceVnd: 22_000_000,
    priceUsd: 499,
    originalPriceUsd: 880,
    deliveryDaysMin: 7,
    deliveryDaysMax: 12,
    liveUrl: 'https://tvt987.github.io/pulse-pos-fnb/',
    previewImage: './media/pulse-pos-fnb.webp',
    previewBadge: 'F&B POS · LIVE KITCHEN KDS',
    featuredRank: 5,
    stack: ['React 19', 'POS Engine', 'KDS Real-Time', 'VietQR Ready'],
    deliverables: {
      vi: [
        'Giao diện POS chọn món, size, mức đường/đá, topping & sơ đồ bàn trực quan',
        'Màn hình bếp KDS cập nhật trạng thái chế biến theo thời gian thực & cảnh báo trễ món',
        'Tách hóa đơn, áp voucher, tính VAT/phí dịch vụ, thanh toán tiền mặt & VietQR',
        'Báo cáo ca làm việc, doanh thu món bán chạy & dễ dàng kết nối backend chuỗi cửa hàng',
      ],
      en: [
        'Touch-first POS terminal with table map, item modifiers, notes & instant search',
        'Live Kitchen Display System (KDS) with ticket timers and station status progression',
        'Split checks, voucher discounts, VAT/service charge & VietQR payment workflow',
        'Shift closing telemetry, top-SKU analytics & API-ready multi-store architecture',
      ],
    },
    architectureNote: {
      vi: 'Kế thừa kinh nghiệm vận hành POS thực chiến cho 700+ siêu thị, chống lệch đơn và nhân đôi giao dịch.',
      en: 'Engineered from real 700+ retail store POS lessons with strict transactional consistency.',
    },
    metricsBadge: 'POS + KDS · ZERO LAG',
  },
  {
    id: 'atelier-canvas',
    sku: 'TVT-SAAS-06',
    name: 'Atelier Canvas',
    subtitle: {
      vi: 'Công Cụ Thiết Kế Vector & Prototype SaaS',
      en: 'Browser Vector Design & Prototyping SaaS',
    },
    tagline: {
      vi: 'Ứng dụng thiết kế vector trực tiếp trên trình duyệt với undo/redo không giới hạn, quản lý layer, căn gióng thông minh và xuất SVG/PNG.',
      en: 'Precision browser-based vector editor with command history, layer hierarchy, smart snapping, and SVG/PNG export.',
    },
    category: 'saas-ai',
    categoryLabel: {
      vi: 'SaaS & AI',
      en: 'SaaS & AI',
    },
    priceVnd: 14_900_000,
    originalPriceVnd: 25_000_000,
    priceUsd: 599,
    originalPriceUsd: 990,
    deliveryDaysMin: 10,
    deliveryDaysMax: 14,
    liveUrl: 'https://tvt987.github.io/atelier-canvas/',
    previewImage: './media/atelier-canvas.webp',
    featuredRank: 6,
    stack: ['React 19', 'Canvas / SVG', 'Command Stack', 'TypeScript'],
    deliverables: {
      vi: [
        'Khung vẽ vector tương tác tốc độ cao: pan/zoom, hình khối, văn bản, biến đổi tọa độ',
        'Hệ thống Undo/Redo chuẩn command pattern, cây layer và bảng thuộc tính trực tiếp',
        'Xuất thiết kế ra SVG chuẩn chỉnh hoặc ảnh độ phân giải cao phục vụ in ấn/web',
        'Nền tảng vững chắc cho startup sản phẩm in ấn POD, thiết kế bao bì hoặc công cụ nội bộ',
      ],
      en: [
        'High-performance interactive vector stage with zoom/pan, shapes, text, and transforms',
        'Deterministic Undo/Redo command stack, layer tree, and real-time property inspector',
        'Clean vector SVG & crisp raster export suitable for POD or design workflows',
        'Extensible SaaS foundation ready for multi-tenant collaboration and billing',
      ],
    },
    architectureNote: {
      vi: 'Kiến trúc state bất biến kết hợp spatial hit-testing mang lại trải nghiệm ngang ngửa ứng dụng desktop.',
      en: 'Immutable scene state with precision hit-testing for desktop-class browser responsiveness.',
    },
    metricsBadge: 'VECTOR ENGINE · 60FPS',
  },
  {
    id: 'nexus-lake',
    sku: 'TVT-DATA-07',
    name: 'Nexus Lake',
    subtitle: {
      vi: 'Nền Tảng BI & Kho Dữ Liệu SQL DuckDB-WASM',
      en: 'In-Browser SQL Lakehouse & BI Analytics Platform',
    },
    tagline: {
      vi: 'Phân tích dữ liệu lớn trực tiếp ngay trên trình duyệt bằng SQL DuckDB-WASM, biểu đồ tương tác tức thì không tốn chi phí server truy vấn.',
      en: 'Zero-server-latency BI lakehouse running analytical SQL directly in-browser via DuckDB-WASM with interactive charts.',
    },
    category: 'saas-ai',
    categoryLabel: {
      vi: 'SaaS & AI',
      en: 'SaaS & AI',
    },
    priceVnd: 14_900_000,
    originalPriceVnd: 26_000_000,
    priceUsd: 599,
    originalPriceUsd: 1_040,
    deliveryDaysMin: 10,
    deliveryDaysMax: 14,
    liveUrl: 'https://tvt987.github.io/nexus-lake/',
    previewImage: './media/nexus-lake.webp',
    featuredRank: 7,
    stack: ['React 19', 'DuckDB-WASM', 'SQL Engine', 'BI Charts'],
    deliverables: {
      vi: [
        'Trình soạn thảo truy vấn SQL thông minh kèm bộ truy vấn mẫu KPI doanh nghiệp',
        'Nạp file CSV/Parquet trực tiếp và trực quan hóa doanh thu, cohort, phễu chuyển đổi',
        'Xử lý hàng trăm nghìn dòng dữ liệu cục bộ ngay trên trình duyệt bảo mật tuyệt đối',
        'Bàn giao kiến trúc dễ tích hợp API kho dữ liệu SQL Server / PostgreSQL / BigQuery',
      ],
      en: [
        'Interactive SQL workbench with pre-built executive KPI and cohort templates',
        'Local CSV/Parquet ingestion with instant chart visualization & CSV export',
        'Sub-second analytical scans on hundreds of thousands of rows inside WASM',
        'Clean connector boundaries ready for SQL Server, PostgreSQL, or BigQuery',
      ],
    },
    architectureNote: {
      vi: 'Chạy WebAssembly trên Web Worker tách biệt hoàn toàn khỏi luồng UI giúp giao diện luôn mượt mà.',
      en: 'Isolated Web Worker WASM execution keeps UI rendering completely lock-free.',
    },
    metricsBadge: 'DUCKDB-WASM · SQL BI',
  },
  {
    id: 'verdict-graph',
    sku: 'TVT-AI-08',
    name: 'Verdict Graph',
    subtitle: {
      vi: 'Hệ Thống Điều Phối AI Agent Doanh Nghiệp',
      en: 'Enterprise AI Agent Orchestration & Evaluation Studio',
    },
    tagline: {
      vi: 'Bản điều khiển đồ thị luồng AI Agent đa bước, theo dõi token budget, kiểm soát guardrail và chấm điểm độ chính xác đầu ra theo thời gian thực.',
      en: 'Visual multi-agent DAG orchestration console with token budgeting, compliance guardrails, and live evaluation telemetry.',
    },
    category: 'saas-ai',
    categoryLabel: {
      vi: 'SaaS & AI',
      en: 'SaaS & AI',
    },
    priceVnd: 16_900_000,
    originalPriceVnd: 29_000_000,
    priceUsd: 679,
    originalPriceUsd: 1_150,
    deliveryDaysMin: 10,
    deliveryDaysMax: 14,
    liveUrl: 'https://tvt987.github.io/verdict-graph/',
    previewImage: './media/verdict-graph.webp',
    featuredRank: 8,
    stack: ['React 19', 'DAG Engine', 'AI Guardrails', 'Telemetry'],
    deliverables: {
      vi: [
        'Đồ thị trực quan điều phối các nút Agent, Tool-Calling, Reranker & Human-in-the-Loop',
        'Bảng giám sát chi phí Token, độ trễ từng bước (P50/P95) & nhật ký audit đầy đủ',
        'Bộ kiểm thử đánh giá tự động chất lượng câu trả lời LLM chống ảo giác',
        'Sẵn sàng kết nối FastAPI, LangGraph, OpenAI / Gemini / Ollama doanh nghiệp',
      ],
      en: [
        'Visual DAG inspector for multi-agent steps, tool calls, rerankers & human approvals',
        'Real-time token budget accounting, step latency profiling (P50/P95) & audit trails',
        'Automated LLM verdict evaluation harness against hallucination & policy drift',
        'Adapter-ready frontend for FastAPI, LangGraph, Gemini, OpenAI, or local vLLM',
      ],
    },
    architectureNote: {
      vi: 'Thiết kế theo chuẩn AI Engineering thực chiến: schema validation chặt chẽ, retry backoff và kiểm soát ngân sách token.',
      en: 'Built around production AI Ops standards: strict schema validation, backoff retries & token budgets.',
    },
    metricsBadge: 'AI OPS · DAG STUDIO',
  },
  {
    id: 'aegispulse',
    sku: 'TVT-ENT-09',
    name: 'AegisPulse',
    subtitle: {
      vi: 'Kiến Trúc Backend .NET 10 Tải Cao & Hybrid RAG',
      en: 'High-Concurrency .NET 10 SRE & Hybrid RAG Control Plane',
    },
    tagline: {
      vi: 'Bộ khung kiến trúc phân tán chịu tải 5.000+ RPS, Redis Distributed Lock chống double-spending, observability SRE & tìm kiếm Hybrid RAG.',
      en: 'Distributed high-throughput architecture blueprint with 5,000+ RPS telemetry, Redis locking, SRE dashboards, and Hybrid RAG.',
    },
    category: 'saas-ai',
    categoryLabel: {
      vi: 'SaaS & AI',
      en: 'SaaS & AI',
    },
    priceVnd: 18_900_000,
    originalPriceVnd: 34_000_000,
    priceUsd: 749,
    originalPriceUsd: 1_350,
    deliveryDaysMin: 12,
    deliveryDaysMax: 16,
    liveUrl: 'https://tvt987.github.io/aegispulse-distributed-sre/',
    previewImage: './media/aegispulse.webp',
    featuredRank: 9,
    stack: ['.NET 10 / C#', 'Redis Lock', 'Hybrid RAG', 'OpenTelemetry'],
    deliverables: {
      vi: [
        'Kiến trúc phân tán chịu tải cao kế thừa thực chiến hệ thống 700+ siêu thị',
        'Bảng điều khiển SRE giám sát RPS, P99 latency, Circuit Breaker & chống nhân đôi voucher',
        'Pipeline tìm kiếm Hybrid RAG (BM25 + Dense Vector + Reranking) cho tài liệu nội bộ',
        'Kèm buổi tư vấn kiến trúc trực tiếp 1-1 với Solution Architect để áp dụng vào hệ thống thật',
      ],
      en: [
        'Battle-tested distributed system blueprint proven across 700+ retail stores',
        'Live SRE control plane tracking RPS, P99 latency, circuit breakers & idempotent locks',
        'Enterprise Hybrid RAG pipeline (BM25 + Dense Embeddings + Reranking)',
        'Includes 1-on-1 architecture handover workshop for your engineering team',
      ],
    },
    architectureNote: {
      vi: 'Giảm p99 latency từ 800ms xuống dưới 45ms bằng Dapper + Redis Optimistic Concurrency + OpenTelemetry.',
      en: 'Engineered for sub-45ms p99 latency via Dapper, Redis Optimistic Concurrency, and OpenTelemetry.',
    },
    metricsBadge: '5,000+ RPS · .NET 10',
  },
];

export function roundVnd(amount: number): number {
  return Math.round(amount / 100_000) * 100_000;
}

export function roundUsd(amount: number): number {
  return Math.round(amount);
}

export function getLicensePrice(
  product: TemplateProduct,
  license: LicenseTier,
  currency: Currency
): number {
  const base = currency === 'VND' ? product.priceVnd : product.priceUsd;
  if (license === 'standard') {
    return base;
  }
  return currency === 'VND'
    ? roundVnd(base * FULL_SOURCE_MULTIPLIER)
    : roundUsd(base * FULL_SOURCE_MULTIPLIER);
}

export function getOriginalLicensePrice(
  product: TemplateProduct,
  license: LicenseTier,
  currency: Currency
): number {
  const base = currency === 'VND' ? product.originalPriceVnd : product.originalPriceUsd;
  if (license === 'standard') {
    return base;
  }
  return currency === 'VND'
    ? roundVnd(base * FULL_SOURCE_MULTIPLIER)
    : roundUsd(base * FULL_SOURCE_MULTIPLIER);
}

export function getSavingsPercent(product: TemplateProduct, currency: Currency): number {
  const current = currency === 'VND' ? product.priceVnd : product.priceUsd;
  const original = currency === 'VND' ? product.originalPriceVnd : product.originalPriceUsd;
  if (original <= current || original <= 0) {
    return 0;
  }
  return Math.round(((original - current) / original) * 100);
}

export function formatMoney(amount: number, currency: Currency): string {
  const safeAmount = Math.max(0, Math.round(amount));
  if (currency === 'VND') {
    const formatted = safeAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formatted}₫`;
  }
  const formatted = safeAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `$${formatted}`;
}

export function formatDeliveryRange(product: TemplateProduct, locale: 'vi' | 'en'): string {
  return locale === 'vi'
    ? `${product.deliveryDaysMin}–${product.deliveryDaysMax} ngày`
    : `${product.deliveryDaysMin}–${product.deliveryDaysMax} days`;
}

export function filterAndSortCatalog(
  products: TemplateProduct[],
  category: ProductCategory,
  searchQuery: string,
  sortBy: CatalogSort
): TemplateProduct[] {
  const q = searchQuery.trim().toLowerCase();

  const filtered = products.filter((item) => {
    const categoryMatch = category === 'all' || item.category === category;
    if (!categoryMatch) return false;
    if (!q) return true;
    const haystack = [
      item.name,
      item.sku,
      item.subtitle.vi,
      item.subtitle.en,
      item.tagline.vi,
      item.tagline.en,
      item.categoryLabel.vi,
      item.categoryLabel.en,
      ...item.stack,
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });

  const sorted = [...filtered];
  switch (sortBy) {
    case 'price-asc':
      sorted.sort((a, b) => a.priceVnd - b.priceVnd);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.priceVnd - a.priceVnd);
      break;
    case 'fastest':
      sorted.sort((a, b) => a.deliveryDaysMin - b.deliveryDaysMin || a.featuredRank - b.featuredRank);
      break;
    case 'featured':
    default:
      sorted.sort((a, b) => a.featuredRank - b.featuredRank);
      break;
  }
  return sorted;
}

export function getCategoryCounts(
  products: TemplateProduct[]
): Record<ProductCategory, number> {
  const counts: Record<ProductCategory, number> = {
    all: products.length,
    'commerce-3d': 0,
    'clinic-proptech': 0,
    'pos-fnb': 0,
    'saas-ai': 0,
  };
  for (const p of products) {
    counts[p.category] += 1;
  }
  return counts;
}
