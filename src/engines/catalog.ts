import type {
  CatalogSort,
  Currency,
  LicenseTier,
  ProductCategory,
  TechStackFilter,
  TemplateProduct,
} from './types';

export const FULL_SOURCE_MULTIPLIER = 1.3;

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
    name: 'Maison Véra 3D v5.0',
    subtitle: {
      vi: 'Website Thời Trang & Kính Mắt 3D HDRI, Tròng UV & Đo Khuôn Mặt',
      en: 'Luxury 3D HDRI Eyewear, UV Polarized Lens Lab & Bespoke Fit',
    },
    tagline: {
      vi: 'Trình diễn gọng titan 3D phản chiếu HDRI studio, mô phỏng tròng đổi màu UV/phân cực trực tiếp, phân tích dáng khuôn mặt & Lookbook VIP.',
      en: 'PMREM Studio HDRI titanium 3D eyewear, photochromic UV & polarized lens physics simulator, face-shape fit studio & private client lookbook.',
    },
    category: 'commerce-3d',
    categoryLabel: {
      vi: 'Bán Hàng 3D',
      en: '3D Commerce',
    },
    priceVnd: 11_900_000,
    originalPriceVnd: 18_500_000,
    priceUsd: 479,
    originalPriceUsd: 739,
    deliveryDaysMin: 3,
    deliveryDaysMax: 5,
    liveUrl: 'https://tvt987.github.io/maison-vera/',
    previewImage: './media/maison-vera.webp',
    featuredRank: 14,
    stack: ['.NET 10', 'Optical Rx Lab', '1.50 vs 1.74', 'PMREM 3D'],
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
      vi: 'Full-Stack Monorepo .NET 10 + Three.js PMREM HDRI & Optical Rx Lab (1.50 vs 1.74), OpenAPI 3.1 + Docker sẵn sàng vận hành.',
      en: 'Full-Stack .NET 10 monorepo pairing PMREM 3D eyewear, Optical Rx Lab (1.50 vs 1.74), OpenAPI 3.1 & multi-stage Docker.',
    },
    metricsBadge: '3D HDRI TITANIUM · UV LENS LAB',
  },
  {
    id: 'aether-acoustics',
    sku: 'TVT-3D-02',
    name: 'Aether Acoustics 3D v4.0',
    subtitle: {
      vi: 'Website Âm Thanh 3D, Radar Không Gian HRTF & Phòng RT60',
      en: '3D Spatial Audio, Binaural HRTF Radar & Room RT60 Acoustic Lab',
    },
    tagline: {
      vi: 'Radar điểm ngọt âm thanh không gian HRTF kéo thả, mô phỏng vật liệu tiêu âm phòng nghe tính RT60, đồ thị đáp tuyến tần số & THD+N.',
      en: 'Interactive Binaural 3D HRTF soundstage radar, room material RT60 physics simulator, live 20Hz–20kHz frequency response & THD+N.',
    },
    category: 'commerce-3d',
    categoryLabel: {
      vi: 'Bán Hàng 3D',
      en: '3D Commerce',
    },
    priceVnd: 10_900_000,
    originalPriceVnd: 16_900_000,
    priceUsd: 439,
    originalPriceUsd: 679,
    deliveryDaysMin: 3,
    deliveryDaysMax: 5,
    liveUrl: 'https://tvt987.github.io/aether-acoustics/',
    previewImage: './media/aether-acoustics.webp',
    featuredRank: 16,
    stack: ['.NET 10', 'Room Modes Lab', 'Sabine RT60', 'Biquad DSP'],
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
      vi: 'Full-Stack Monorepo .NET 10 + Room Modes Lab, mô phỏng Sabine RT60 & Web Audio Biquad DSP không phụ thuộc thư viện nặng.',
      en: 'Full-Stack .NET 10 monorepo combining Room Modes Lab, Sabine RT60 physics & zero-dependency Biquad Web Audio DSP.',
    },
    metricsBadge: '3D FFT AUDIO · ROOM RT60 EQ',
  },
  {
    id: 'lumina-medspa',
    sku: 'TVT-MED-03',
    name: 'Lumina MedSpa Clinic v3.0',
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
    priceVnd: 7_900_000,
    originalPriceVnd: 12_500_000,
    priceUsd: 319,
    originalPriceUsd: 499,
    deliveryDaysMin: 2,
    deliveryDaysMax: 4,
    liveUrl: 'https://tvt987.github.io/lumina-medspa/',
    previewImage: './media/lumina-medspa.webp',
    previewBadge: 'PATIENT VAULT · 0% INSTALLMENT',
    featuredRank: 20,
    stack: ['.NET 10', '12W Roadmap', 'Fitzpatrick Guard', 'Slot Lock'],
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
      vi: 'Full-Stack Monorepo .NET 10 với lộ trình 12 tuần, cảnh báo Fitzpatrick an toàn da & khóa khung giờ chống đặt trùng.',
      en: 'Full-Stack .NET 10 clinic monorepo with 12-week treatment roadmap, Fitzpatrick safety guard & atomic slot conflict lock.',
    },
    metricsBadge: 'PATIENT VAULT · 0% INSTALLMENT',
  },
  {
    id: 'kinetix-proptech',
    sku: 'TVT-PROP-04',
    name: 'Kinetix PropTech v3.0',
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
    priceVnd: 11_900_000,
    originalPriceVnd: 18_500_000,
    priceUsd: 479,
    originalPriceUsd: 739,
    deliveryDaysMin: 3,
    deliveryDaysMax: 6,
    liveUrl: 'https://tvt987.github.io/kinetix-proptech/',
    previewImage: './media/kinetix-proptech.webp',
    previewBadge: 'TOWER 3D · +4% RATE STRESS',
    featuredRank: 15,
    stack: ['.NET 10', 'Saigon Sun-Path', '10Y IRR Lab', 'Escrow 409'],
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
      vi: 'Full-Stack Monorepo .NET 10 tích hợp biểu đồ nắng Sài Gòn, phân tích IRR 10 năm & khóa ký quỹ HTTP 409 chống trùng cọc.',
      en: 'Full-Stack .NET 10 PropTech monorepo featuring Saigon sun-path telemetry, 10Y IRR modeling & HTTP 409 escrow lock.',
    },
    metricsBadge: 'TOWER 3D · +4% RATE STRESS',
  },
  {
    id: 'pulse-pos-fnb',
    sku: 'TVT-POS-05',
    name: 'PulsePOS F&B v4.0',
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
    originalPriceVnd: 19_900_000,
    priceUsd: 519,
    originalPriceUsd: 799,
    deliveryDaysMin: 4,
    deliveryDaysMax: 7,
    liveUrl: 'https://tvt987.github.io/pulse-pos-fnb/',
    previewImage: './media/pulse-pos-fnb.webp',
    previewBadge: 'TABLE QR · LIVE KDS · AUTO-PO',
    featuredRank: 13,
    stack: ['.NET 10', '2-Tab Live KDS', 'Floorplan CAD', 'Atomic Stock'],
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
      vi: 'Full-Stack Monorepo .NET 10 kế thừa vận hành 700+ cửa hàng: đồng bộ bếp KDS 2-tab thời gian thực, Floorplan CAD & trừ kho Atomic.',
      en: 'Full-Stack .NET 10 hospitality POS with 2-tab live KDS sync, CAD floorplan & atomic stock deduction proven at 700+ store scale.',
    },
    metricsBadge: 'TABLE QR · LIVE KDS · AUTO-PO',
  },
  {
    id: 'atelier-canvas',
    sku: 'TVT-SAAS-06',
    name: 'Atelier Canvas Pro v5.0',
    subtitle: {
      vi: 'Công Cụ Thiết Kế Vector, Design Tokens & Trình Chạy Prototype',
      en: 'Browser Vector Studio, Design Tokens & Interactive Prototype Player',
    },
    tagline: {
      vi: 'Trình thiết kế vector cấp Figma: hệ thống Design Tokens đổi theme tức thì, chuyển khung hình Responsive, trình phát Prototype & xuất React/Tailwind.',
      en: 'Figma-class browser vector editor with W3C Design Tokens, Responsive Breakpoint preview, interactive Prototype player & React/Tailwind export.',
    },
    category: 'saas-ai',
    categoryLabel: {
      vi: 'SaaS & AI',
      en: 'SaaS & AI',
    },
    priceVnd: 13_900_000,
    originalPriceVnd: 21_900_000,
    priceUsd: 549,
    originalPriceUsd: 879,
    deliveryDaysMin: 4,
    deliveryDaysMax: 7,
    liveUrl: 'https://tvt987.github.io/atelier-canvas/',
    previewImage: './media/atelier-canvas.webp',
    featuredRank: 12,
    stack: ['.NET 10', '2-Tab Collab', '4-Target Tokens', 'Optimistic Lock'],
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
      vi: 'Full-Stack Monorepo .NET 10 hỗ trợ cộng tác 2-tab, xuất 4 hệ Design Tokens (CSS/Tailwind/iOS/Android) & Optimistic Lock chống ghi đè.',
      en: 'Full-Stack .NET 10 vector studio with 2-tab collaboration, 4-target Design Tokens export & optimistic concurrency locking.',
    },
    metricsBadge: 'BROWSER FIGMA · YJS CRDT',
  },
  {
    id: 'nexus-lake',
    sku: 'TVT-DATA-07',
    name: 'Nexus Lake OLAP v4.0',
    subtitle: {
      vi: 'Nền Tảng BI & Kho Dữ Liệu SQL DuckDB-WASM, Notebook Đa Ô & Pivot',
      en: 'In-Browser DuckDB-WASM Lakehouse, SQL Notebook & Cohort Heatmap',
    },
    tagline: {
      vi: 'Kéo thả file CSV/JSON thật vào trình duyệt, SQL Notebook nhiều ô, bảng Pivot kéo chiều động, Cohort Retention Heatmap & NL-to-SQL Copilot.',
      en: 'Drag-drop local CSV/JSON ingestion into DuckDB-WASM, multi-cell SQL notebook with visual Pivot matrix, Cohort Retention heatmap & NL-to-SQL.',
    },
    category: 'saas-ai',
    categoryLabel: {
      vi: 'SaaS & AI',
      en: 'SaaS & AI',
    },
    priceVnd: 14_900_000,
    originalPriceVnd: 23_500_000,
    priceUsd: 599,
    originalPriceUsd: 940,
    deliveryDaysMin: 4,
    deliveryDaysMax: 7,
    liveUrl: 'https://tvt987.github.io/nexus-lake/',
    previewImage: './media/nexus-lake.webp',
    featuredRank: 11,
    stack: ['FastAPI + MCP', 'DuckDB-WASM', 'Medallion SVG', 'SQL AST Guard'],
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
      vi: 'Full-Stack Monorepo FastAPI + MCP kết hợp DuckDB-WASM trên Web Worker, sơ đồ Medallion SVG & lá chắn SQL AST chống truy vấn độc hại.',
      en: 'Full-Stack FastAPI + MCP lakehouse pairing worker-isolated DuckDB-WASM, Medallion SVG lineage & strict SQL AST guard.',
    },
    metricsBadge: 'DUCKDB-WASM · KAFKA CDC · MCP',
  },
  {
    id: 'verdict-graph',
    sku: 'TVT-AI-08',
    name: 'Verdict Graph AI v4.0',
    subtitle: {
      vi: 'Hệ Thống Điều Phối Multi-Agent DAG, Time-Travel Diff & FinOps',
      en: 'Multi-Agent DAG Builder, Time-Travel Diff & LLM FinOps Router',
    },
    tagline: {
      vi: 'Trình dựng luồng AI Agent đa bước, nhân bản nhánh Time-Travel so sánh Diff, bộ định tuyến chi phí đa mô hình & kiểm thử Red-Team OWASP Top-10.',
      en: 'Interactive multi-agent DAG builder, time-travel branch diffing, multi-model FinOps cost/latency router & OWASP LLM Top-10 Red-Team suite.',
    },
    category: 'saas-ai',
    categoryLabel: {
      vi: 'SaaS & AI',
      en: 'SaaS & AI',
    },
    priceVnd: 19_900_000,
    originalPriceVnd: 31_000_000,
    priceUsd: 789,
    originalPriceUsd: 1_240,
    deliveryDaysMin: 5,
    deliveryDaysMax: 8,
    liveUrl: 'https://tvt987.github.io/verdict-graph/',
    previewImage: './media/verdict-graph.webp',
    featuredRank: 6,
    stack: ['FastAPI', 'OWASP Firewall', 'Token Breaker', 'DAG Replay'],
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
      vi: 'Full-Stack Monorepo FastAPI chuẩn AI Ops: tường lửa OWASP LLM Top-10, ngắt mạch Token Breaker & phát lại DAG Time-Travel.',
      en: 'Full-Stack FastAPI AI Ops monorepo with OWASP LLM firewall, automatic Token Circuit Breaker & deterministic DAG replay.',
    },
    metricsBadge: 'MULTI-AGENT DAG · RED-TEAM',
  },
  {
    id: 'aegispulse',
    sku: 'TVT-ENT-09',
    name: 'AegisPulse SRE v5.0',
    subtitle: {
      vi: 'Kiến Trúc SRE Phân Tán .NET 10, Chaos Raft & Flamegraph',
      en: 'Distributed .NET 10 SRE, Raft Chaos Injector & GC Flamegraph',
    },
    tagline: {
      vi: 'Bảng điều khiển SRE 5 khu vực toàn cầu: tiêm lỗi Chaos Raft Quorum, kéo tải 250K RPS trực tiếp, Flamegraph CPU/GC Pause & Hybrid RAG.',
      en: '5-region Raft consensus Chaos Fault Injector, live 250K RPS stress slider, interactive CPU/GC Flamegraph profiler & enterprise Hybrid RAG.',
    },
    category: 'saas-ai',
    categoryLabel: {
      vi: 'SaaS & AI',
      en: 'SaaS & AI',
    },
    priceVnd: 22_900_000,
    originalPriceVnd: 36_000_000,
    priceUsd: 899,
    originalPriceUsd: 1_440,
    deliveryDaysMin: 5,
    deliveryDaysMax: 10,
    liveUrl: 'https://tvt987.github.io/aegispulse-distributed-sre/',
    previewImage: './media/aegispulse.webp',
    featuredRank: 5,
    stack: ['.NET 10', '500-Req Race', '0.00% Leak', 'k6 5K RPS'],
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
      vi: 'Full-Stack Monorepo .NET 10 kiểm chứng thực chiến 500-request concurrency race (0.00% double-spend leak) & kịch bản chịu tải k6 5K RPS.',
      en: 'Full-Stack .NET 10 distributed SRE engine verified against 500-request race storms (0.00% leak) & k6 5K RPS load benchmarks.',
    },
    metricsBadge: '139K RPS .NET 10 · HYBRID RAG',
  },
  {
    id: 'aurelia-resort',
    sku: 'TVT-HOSP-10',
    name: 'Aurelia Resort PMS v3.0',
    subtitle: {
      vi: 'Website Resort 5 Sao & Đặt Phòng Villa Trực Tiếp',
      en: '5-Star Beachfront Resort & Direct Villa Booking Engine',
    },
    tagline: {
      vi: 'Bản đồ quy hoạch resort SVG 10 điểm tương tác, giá động theo mùa/cuối tuần, thẻ VIP Check-In QR & VietQR đặt cọc trực tiếp không tốn hoa hồng OTA.',
      en: 'Interactive 10-pin beachfront SVG masterplan, dynamic seasonal/weekend pricing, VIP QR Check-In Pass & zero-commission direct VietQR booking.',
    },
    category: 'pos-fnb',
    categoryLabel: { vi: 'Nhà Hàng, Resort & POS', en: 'Hospitality & POS' },
    priceVnd: 14_900_000,
    originalPriceVnd: 23_500_000,
    priceUsd: 599,
    originalPriceUsd: 940,
    deliveryDaysMin: 3,
    deliveryDaysMax: 5,
    liveUrl: 'https://tvt987.github.io/aurelia-resort/',
    previewImage: './media/aurelia-resort.webp',
    previewBadge: '5-STAR HEATMAP · MICE PLANNER',
    featuredRank: 10,
    stack: ['.NET 10', 'RevPAR Studio', 'Itinerary Sync', 'Overlap Lock'],
    deliverables: {
      vi: [
        'Bản đồ resort SVG tương tác 10 khu biệt thự kèm sơ đồ mặt bằng CAD chi tiết',
        'Động cơ tính giá động theo mùa cao điểm, cuối tuần, mã giảm giá & gói dịch vụ du thuyền/spa',
        'Thẻ VIP Check-In QR + xuất lịch .ics + phiếu đặt phòng PDF A4 & VietQR cọc trực tiếp',
        'Lưu lịch sử đặt phòng trên trình duyệt & hỗ trợ song ngữ VI/EN + VNĐ/USD',
      ],
      en: [
        'Interactive 10-pin SVG beachfront resort masterplan with villa CAD blueprints',
        'Dynamic seasonal/weekend pricing engine, promo codes & yacht/spa add-on configurator',
        'VIP Check-In QR Pass, .ics calendar export, A4 PDF confirmation & direct VietQR deposit',
        'Persistent My Reservations vault with full VI/EN & VND/USD switching',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo .NET 10 PMS với RevPAR Studio, đồng bộ lịch trình khách VIP & khóa trùng lịch Overlap Lock tiết kiệm 15–22% phí OTA.',
      en: 'Full-Stack .NET 10 Resort PMS with RevPAR yield studio, VIP itinerary sync & date-overlap locking eliminating 15–22% OTA fees.',
    },
    metricsBadge: '5-STAR HEATMAP · MICE PLANNER',
  },
  {
    id: 'velox-ev-motors',
    sku: 'TVT-EV-11',
    name: 'Velox EV Motors v5.0',
    subtitle: {
      vi: 'Showroom Hypercar Điện 3D HDRI, Cửa Cánh Chim & Launch 0–100',
      en: '3D HDRI Hypercar Showroom, Gullwing Doors & 0–100 Launch Telemetry',
    },
    tagline: {
      vi: 'Flagship 20 Triệu: Xe điện 3D PBR ánh sáng Studio HDRI, cửa cánh chim mở động, buồng lái OLED, đường hầm gió Cd 0.19, Launch Control 2.1s & lộ trình sạc 350kW xuyên Việt.',
      en: '20M Flagship: Three.js PMREM Studio HDRI clearcoat EV, articulated gullwing doors, OLED cockpit POV, Cd 0.19 wind tunnel aero, 2.1s Web Audio launch control & VN 350kW routing.',
    },
    category: 'commerce-3d',
    categoryLabel: { vi: 'Bán Hàng 3D & Nội Thất', en: '3D Commerce & Interior' },
    priceVnd: 20_000_000,
    originalPriceVnd: 32_000_000,
    priceUsd: 799,
    originalPriceUsd: 1_280,
    deliveryDaysMin: 4,
    deliveryDaysMax: 6,
    liveUrl: 'https://tvt987.github.io/velox-ev-motors/',
    previewImage: './media/velox-ev-motors.webp',
    previewBadge: '3D HDRI HYPERCAR · GULLWING · 20M VIP',
    featuredRank: 1,
    stack: ['.NET 10', 'Three.js HDRI', '3-Circuit Lab', 'Idempotent Lock'],
    deliverables: {
      vi: [
        'Sân khấu 3D PBR xoay 360 độ cho 3 dòng xe, 6 màu sơn kim loại, 3 bộ mâm & 3 nội thất',
        'Phòng mô phỏng vật lý quãng đường thực tế theo vận tốc cao tốc, nhiệt độ & điều hòa',
        'Bảng so sánh chi phí sở hữu 5 năm (miễn lệ phí trước bạ EV) & máy tính trả góp ngân hàng',
        'Đặt lịch lái thử chống trùng khung giờ, lưu cấu hình Garage & xuất hồ sơ xe PDF A4',
      ],
      en: [
        '360-degree Three.js PBR configurator across 3 EV models, 6 paints, 3 forged rims & FSD',
        'Real-world aerodynamic drag & thermal HVAC WLTP range physics lab',
        '5-year EV vs Petrol TCO savings breakdown + interactive bank auto-loan PMT simulator',
        'Anti-double-booking showroom test-drive lock, Saved Garage & printable A4 spec sheet',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo .NET 10 + Three.js PMREM HDRI, mô phỏng 3 trường đua (3-Circuit Lab) & Idempotent Lock đặt cọc xe chống trùng đơn.',
      en: 'Full-Stack .NET 10 flagship pairing Three.js PMREM HDRI, 3-Circuit telemetry lab & idempotent EV reservation locking.',
    },
    metricsBadge: '3D PBR EV · X-RAY 800V · 20M VIP',
  },
  {
    id: 'solaris-academy',
    sku: 'TVT-EDU-12',
    name: 'Solaris Academy LMS v2.0',
    subtitle: {
      vi: 'Nền Tảng E-Learning, Chấm Code Sandbox & Cấp Chứng Chỉ',
      en: 'Interactive Coding LMS, Zero-Eval Sandbox & Verifiable Certificates',
    },
    tagline: {
      vi: 'Hệ thống học trực tuyến hiện đại với trình chạy & chấm bài tập code an toàn ngay trên trình duyệt, flashcard lặp lại ngắt quãng SM-2 và cấp chứng chỉ QR.',
      en: 'Modern EdTech LMS featuring a custom zero-eval AST code sandbox, SM-2 spaced-repetition flashcards, XP streaks, and verifiable SVG/PDF certificates.',
    },
    category: 'enterprise-b2b',
    categoryLabel: { vi: 'Doanh Nghiệp, HR & FinTech', en: 'Enterprise, EdTech & FinTech' },
    priceVnd: 9_490_000,
    originalPriceVnd: 14_900_000,
    priceUsd: 379,
    originalPriceUsd: 599,
    deliveryDaysMin: 4,
    deliveryDaysMax: 6,
    liveUrl: 'https://tvt987.github.io/solaris-academy/',
    previewImage: './media/solaris-academy.webp',
    previewBadge: 'ZERO-EVAL AST SANDBOX · SM-2',
    featuredRank: 18,
    stack: ['FastAPI', 'Zero-Eval AST', 'Algo Visualizer', 'Oxford UI'],
    deliverables: {
      vi: [
        '6 lộ trình khóa học công nghệ kèm theo dõi tiến độ từng bài học & chuỗi XP bền vững',
        'Trình chấm code thực hành dùng bộ thông dịch AST an toàn (0 eval / 0 lỗ hổng XSS)',
        'Bộ thẻ Flashcard lặp lại ngắt quãng SM-2 & ngân hàng câu hỏi trắc nghiệm có giải thích',
        'Cấp chứng chỉ hoàn thành PDF A4 kèm mã xác thực băm + QR & giỏ khóa học VietQR',
      ],
      en: [
        '6 flagship curriculum tracks with persistent syllabus progress & daily XP streaks',
        'Custom zero-eval AST sandbox interpreter with automated unit test grading',
        'SM-2 spaced-repetition flashcard trainer & timed architecture quiz engine',
        'Verifiable SVG/A4 PDF completion certificate generator + course bundle VietQR checkout',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo FastAPI với trình chấm code Zero-Eval AST an toàn 100%, trực quan hóa thuật toán (Algo Visualizer) & giao diện Oxford UI.',
      en: 'Full-Stack FastAPI EdTech monorepo with zero-eval AST grader, interactive Algo Visualizer & editorial Oxford UI.',
    },
    metricsBadge: 'ZERO-EVAL AST SANDBOX · SM-2',
  },
  {
    id: 'kuro-omakase',
    sku: 'TVT-FINE-13',
    name: 'Kuro Omakase Hinoki v2.0',
    subtitle: {
      vi: 'Nhà Hàng Fine Dining & Sơ Đồ Quầy Hinoki 14 Chỗ',
      en: 'Michelin Omakase & Interactive 14-Seat Hinoki Counter Booking',
    },
    tagline: {
      vi: 'Đặt từng ghế cụ thể quanh quầy gỗ Hinoki hoặc phòng Tatami riêng theo 2 khung giờ, lọc dị ứng tự động đổi món đầu bếp & thiệp mời VIP PDF A4.',
      en: 'Pick exact counter seats facing the Head Itamae or Private Tatami room across seating waves, smart allergen auto-substitutions & formal A4 VIP invitation.',
    },
    category: 'pos-fnb',
    categoryLabel: { vi: 'Nhà Hàng, Resort & POS', en: 'Hospitality & POS' },
    priceVnd: 6_490_000,
    originalPriceVnd: 10_500_000,
    priceUsd: 259,
    originalPriceUsd: 419,
    deliveryDaysMin: 3,
    deliveryDaysMax: 5,
    liveUrl: 'https://tvt987.github.io/kuro-omakase/',
    previewImage: './media/kuro-omakase.webp',
    previewBadge: '14-SEAT HINOKI MAP · ALLERGEN',
    featuredRank: 21,
    stack: ['.NET 10', '14-Seat Anti-Orphan', 'Allergen Swap', 'Flavor Arc'],
    deliverables: {
      vi: [
        'Sơ đồ quầy Sushi Hinoki chữ U 14 ghế + phòng Tatami riêng với tia tầm nhìn tới bếp trưởng',
        '3 thực đơn Kaiseki theo mùa + ghép cặp Sake/Vang/Trà Kyoto & bộ lọc dị ứng tự động đổi món',
        'Đặt cọc 30% + VAT/phí dịch vụ qua VietQR & chống chọn ghế lẻ trống vô lý',
        'Thiệp mời VIP PDF A4 + mã QR Check-In + tệp lịch .ics lưu bền vững trên trình duyệt',
      ],
      en: [
        'Interactive 14-seat Hinoki U-counter + Tatami floorplan with Chef sightline proximity',
        '3 seasonal Kaiseki tasting menus, sommelier pairing & automated allergen substitutions',
        '30% deposit + VAT/service checkout via live VietQR with anti-orphan seat validation',
        'Formal A4 VIP invitation card, vector QR pass, .ics calendar & persistent bookings',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo .NET 10 chống ghế lẻ 14 chỗ Hinoki (Anti-Orphan), tự đổi món dị ứng Allergen Swap & biểu đồ vị giác Flavor Arc.',
      en: 'Full-Stack .NET 10 fine-dining engine with 14-seat anti-orphan allocation, live allergen swaps & Kaiseki flavor-arc profiling.',
    },
    metricsBadge: '14-SEAT HINOKI MAP · ALLERGEN',
  },
  {
    id: 'vanguard-fitness',
    sku: 'TVT-FIT-14',
    name: 'Vanguard Fitness Club v2.0',
    subtitle: {
      vi: 'CLB Gym, Pilates & Mô Phỏng Chuyển Hóa 12 Tuần',
      en: 'Luxury Gym, Pilates & 12-Week Metabolic Transformation Portal',
    },
    tagline: {
      vi: 'Tính toán BMR/TDEE/Macro chuẩn Mifflin-St Jeor kèm đồ thị chuyển hóa 12 tuần, đặt chỗ lớp học có hàng chờ tự động, ghép PT & thẻ thành viên QR.',
      en: 'Mifflin-St Jeor BMR/TDEE/Macro & 12-week SVG trajectory simulator, live class capacity locking with auto-waitlist, PT matcher & QR Member Pass.',
    },
    category: 'clinic-proptech',
    categoryLabel: { vi: 'Y Tế, BĐS & Wellness', en: 'Clinic, PropTech & Wellness' },
    priceVnd: 5_990_000,
    originalPriceVnd: 9_500_000,
    priceUsd: 239,
    originalPriceUsd: 379,
    deliveryDaysMin: 2,
    deliveryDaysMax: 4,
    liveUrl: 'https://tvt987.github.io/vanguard-fitness/',
    previewImage: './media/vanguard-fitness.webp',
    previewBadge: '12W METABOLIC · WAITLIST LOCK',
    featuredRank: 22,
    stack: ['.NET 10', '12W Periodization', 'FIFO Waitlist', 'ACWR Guard'],
    deliverables: {
      vi: [
        'Máy tính chỉ số trao đổi chất Mifflin-St Jeor + chia gram Đạm/Tinh bột/Béo & đồ thị 12 tuần',
        'Lịch lớp HIIT, Reformer Pilates, Strength & Recovery với khóa suất trống + xếp hàng chờ tự động',
        'Bộ ghép Huấn luyện viên (PT) theo mục tiêu + so sánh gói hội viên Tháng/Năm (-20%)',
        'Thẻ hội viên Obsidian QR, xuất lộ trình tập luyện PDF A4 & thanh toán VietQR',
      ],
      en: [
        'Mifflin-St Jeor BMR/TDEE/Macro engine with interactive 12-week lean-mass SVG projection',
        'Live weekly class schedule with real-time seat counters, automatic waitlist & .ics export',
        'Personal Trainer specialty matcher & Monthly vs Annual (-20%) membership comparator',
        'Digital QR Member Pass, printable A4 training blueprint & live VietQR settlement',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo .NET 10 lập chu kỳ tập luyện 12 tuần (Periodization), hàng chờ lớp FIFO tự động & cảnh báo quá tải chấn thương ACWR Guard.',
      en: 'Full-Stack .NET 10 club platform with 12-week periodization planner, atomic FIFO class waitlist & ACWR injury-load guard.',
    },
    metricsBadge: '12W METABOLIC · WAITLIST LOCK',
  },
  {
    id: 'meridian-logistics',
    sku: 'TVT-LOG-15',
    name: 'Meridian Logistics v3.0',
    subtitle: {
      vi: 'Nền Tảng Vận Tải Quốc Tế, Tính CBM & Tra Cứu Vận Đơn',
      en: 'Global Freight Control Tower, CBM Quoter & Waybill Tracker',
    },
    tagline: {
      vi: 'Bản đồ hành lang vận tải biển/hàng không thời gian thực, tính cước trọng lượng thể tích CBM (Air/Sea FCL-LCL, Incoterms FOB/CIF/DDP) & in Vận đơn PDF A4.',
      en: 'Interactive global sea/air freight corridor map, volumetric CBM/FCL/LCL quote calculator (FOB/CIF/DDP), live waybill customs tracker & A4 Bill of Lading.',
    },
    category: 'enterprise-b2b',
    categoryLabel: { vi: 'Doanh Nghiệp, HR & FinTech', en: 'Enterprise, EdTech & FinTech' },
    priceVnd: 15_900_000,
    originalPriceVnd: 24_900_000,
    priceUsd: 639,
    originalPriceUsd: 990,
    deliveryDaysMin: 4,
    deliveryDaysMax: 7,
    liveUrl: 'https://tvt987.github.io/meridian-logistics/',
    previewImage: './media/meridian-logistics.webp',
    previewBadge: 'CONTAINER 3D PACK · HS/EVFTA',
    featuredRank: 9,
    stack: ['.NET 10', 'Port Reroute', '3D CG + SOLAS', 'EVFTA Duty'],
    deliverables: {
      vi: [
        'Bản đồ tuyến Cát Lái/Hải Phòng đi Mỹ/Châu Âu/Nhật kèm theo dõi nhiệt độ container & ETA',
        'Động cơ báo giá cước Air (5000/6000), Sea LCL theo CBM & FCL 20ft/40ft theo chuẩn Incoterms 2020',
        'Tra cứu vận đơn 6 mốc thông quan, đặt booking trực tiếp VietQR & lưu lịch sử bền vững',
        'In Vận đơn Bill of Lading chuẩn PDF A4 & xuất Manifest CSV UTF-8 BOM cho kế toán',
      ],
      en: [
        'Animated SVG maritime/air route map with live container telemetry & port congestion',
        'Precision Air/Sea LCL/FCL volumetric weight quoter with Incoterms 2020 (FOB/CIF/DDP)',
        '6-stage customs waybill tracker, instant booking via VietQR & persistent shipment vault',
        'Printable A4 Bill of Lading PDF & RFC 4180 UTF-8 BOM CSV manifest export',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo .NET 10 định tuyến tránh nghẽn cảng (Port Reroute), tính trọng tâm container 3D CG + SOLAS & biểu thuế EVFTA.',
      en: 'Full-Stack .NET 10 freight control tower with live port rerouting, 3D container CG + SOLAS compliance & EVFTA duty engine.',
    },
    metricsBadge: 'CONTAINER 3D PACK · HS/EVFTA',
  },
  {
    id: 'coda-hr-payroll',
    sku: 'TVT-HR-16',
    name: 'CodaHR Payroll 2026 v3.0',
    subtitle: {
      vi: 'Phần Mềm Tính Lương Luật 2026 (5 Bậc) & Tuyển Dụng ATS',
      en: 'Vietnam 2026 Law Payroll Calculator, Batch Excel & Kanban ATS',
    },
    tagline: {
      vi: 'Cập nhật chuẩn Luật Thuế TNCN 2026 số 109/2025 (5 bậc, giảm trừ 15,5tr/6,2tr, trần BHXH 50,6tr), quy đổi Gross↔Net chính xác tới 1₫, bảng lương hàng loạt & Kanban ATS.',
      en: 'Built on Vietnam 2026 Law No. 109/2025 (5 PIT brackets, 15.5M/6.2M deductions, 50.6M BHXH cap), exact Gross↔Net solver, batch payroll CSV & Kanban ATS.',
    },
    category: 'enterprise-b2b',
    categoryLabel: { vi: 'Doanh Nghiệp, HR & FinTech', en: 'Enterprise, EdTech & FinTech' },
    priceVnd: 16_900_000,
    originalPriceVnd: 26_500_000,
    priceUsd: 679,
    originalPriceUsd: 1_060,
    deliveryDaysMin: 4,
    deliveryDaysMax: 7,
    liveUrl: 'https://tvt987.github.io/coda-hr-payroll/',
    previewImage: './media/coda-hr-payroll.webp',
    previewBadge: 'LAW 2026 · PIT FINALIZATION · ATS',
    featuredRank: 8,
    stack: ['.NET 10', 'Kanban ATS', 'Law 109/2025', 'Salary Heatmap'],
    deliverables: {
      vi: [
        'Tính lương Gross→Net & Net→Gross theo Luật 109/2025 (5 bậc mới) so sánh trực tiếp Luật 2025 cũ',
        'Bảng lương doanh nghiệp hàng loạt + chi phí chủ sử dụng 23,5% + in Phiếu Lương PDF A4',
        'Xuất Excel CSV UTF-8 BOM chống formula-injection + tính OT miễn thuế theo Bộ luật Lao động',
        'Bảng Kanban quản lý ứng viên 5 vòng phỏng vấn lưu bền vững & định giá gói doanh nghiệp VietQR',
      ],
      en: [
        '2026 Law 109/2025 Gross↔Net solver (<= 1 VND tolerance) with side-by-side 2025 tax savings',
        'Multi-employee batch payroll table, 23.5% employer cost ledger & printable A4 payslips',
        'Formula-injection-safe UTF-8 BOM CSV export + Labor Code overtime exemption engine',
        '5-stage Kanban ATS candidate pipeline with localStorage persistence & enterprise pricing',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo .NET 10 chuẩn Luật 109/2025 (5 bậc mới), Kanban ATS tuyển dụng & bản đồ nhiệt quỹ lương Salary Heatmap.',
      en: 'Full-Stack .NET 10 HRIS monorepo implementing 2026 Law 109/2025 payroll, Kanban ATS & department Salary Heatmap.',
    },
    metricsBadge: 'LAW 2026 · PIT FINALIZATION · ATS',
  },
  {
    id: 'veritas-legal-firm',
    sku: 'TVT-LAW-17',
    name: 'Veritas Legal Studio v2.0',
    subtitle: {
      vi: 'Website Hãng Luật & Trình Soạn Hợp Đồng Chấm Điểm Rủi Ro',
      en: 'Corporate Law Firm & Bilingual Contract Risk Analyzer Studio',
    },
    tagline: {
      vi: 'Soạn thảo hợp đồng song ngữ (MSA, NDA, Freelance B2B, SaaS DPA) bật/tắt 8 điều khoản bảo vệ, chấm điểm rủi ro 0–100 theo Nghị định 13 PDPD & in PDF A4.',
      en: 'Interactive bilingual contract clause builder (MSA, NDA, B2B, DPA), real-time 0–100 legal risk scoring (Decree 13 PDPD), partner directory & A4 PDF export.',
    },
    category: 'enterprise-b2b',
    categoryLabel: { vi: 'Doanh Nghiệp, HR & FinTech', en: 'Enterprise, EdTech & FinTech' },
    priceVnd: 8_490_000,
    originalPriceVnd: 13_500_000,
    priceUsd: 339,
    originalPriceUsd: 539,
    deliveryDaysMin: 3,
    deliveryDaysMax: 5,
    liveUrl: 'https://tvt987.github.io/veritas-legal-firm/',
    previewImage: './media/veritas-legal-firm.webp',
    previewBadge: 'DECREE 13 PDPD RISK · A4 PDF',
    featuredRank: 19,
    stack: ['FastAPI', 'Clause Redline', 'Decree 13 PDPD', 'Conflict Check'],
    deliverables: {
      vi: [
        '4 bộ mẫu hợp đồng thương mại song ngữ Việt–Anh bật/tắt 8 điều khoản bảo vệ sở hữu trí tuệ & thanh toán',
        'Bộ phân tích điểm an toàn pháp lý 0–100 tự cảnh báo thiếu điều khoản hoặc xung đột NDA/PDPD',
        'Xuất bản thảo hợp đồng chuẩn in ấn PDF A4, tải file .md & lưu kho bản nháp cá nhân',
        'Ước tính phí tư vấn/retainer doanh nghiệp, hồ sơ luật sư thành viên & đặt lịch bảo mật .ics',
      ],
      en: [
        '4 bilingual commercial contract templates with 8 toggleable IP, liability & VIAC clauses',
        'Real-time 0–100 legal protection score flagging omissions, NDA conflicts & Decree 13 PDPD',
        'Formal A4 print contract preview, Markdown legal draft download & Saved Contract Vault',
        'Corporate retainer estimator, Senior Partner credentials & double-booking-safe slot locker',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo FastAPI so sánh Redline điều khoản, chấm rủi ro Nghị định 13 PDPD & kiểm tra xung đột lợi ích Conflict Check.',
      en: 'Full-Stack FastAPI LegalTech monorepo featuring clause redline diffing, Decree 13 PDPD risk scoring & conflict-of-interest checks.',
    },
    metricsBadge: 'DECREE 13 PDPD RISK · A4 PDF',
  },
  {
    id: 'nordic-home-atelier',
    sku: 'TVT-INT-18',
    name: 'Nordic Home Atelier v2.0',
    subtitle: {
      vi: 'Nội Thất Cao Cấp & Công Cụ Thiết Kế Mặt Bằng 2D',
      en: 'Bespoke Scandinavian Furniture & 2D Floorplan Room Designer',
    },
    tagline: {
      vi: 'Kéo thả & xoay 90° đồ nội thất trên lưới mặt bằng 2D đo diện tích m², cảnh báo lối đi <60cm, phối bảng gỗ/vải tính giá trực tiếp & thanh kéo Trước/Sau cải tạo.',
      en: 'Interactive 2D SVG floorplan room planner (50mm grid, 90° rotation, 60cm clearance check), live Wood × Fabric pricing swatches & Before/After renovation slider.',
    },
    category: 'commerce-3d',
    categoryLabel: { vi: 'Bán Hàng 3D & Nội Thất', en: '3D Commerce & Interior' },
    priceVnd: 9_900_000,
    originalPriceVnd: 15_500_000,
    priceUsd: 399,
    originalPriceUsd: 619,
    deliveryDaysMin: 3,
    deliveryDaysMax: 6,
    liveUrl: 'https://tvt987.github.io/nordic-home-atelier/',
    previewImage: './media/nordic-home-atelier.webp',
    previewBadge: '2D CAD PLANNER · BOQ PRO',
    featuredRank: 17,
    stack: ['.NET 10', '2D AABB Check', 'Kelvin/Carbon', 'Budget Fit'],
    deliverables: {
      vi: [
        'Trình kéo thả, xoay 90° & sắp xếp 10 món nội thất trên lưới 50mm kèm kiểm tra va chạm & lối đi >= 60cm',
        '3 mẫu phòng kiến trúc chọn sẵn (Thảo Điền Penthouse, Kyoto Bedroom, Nordic Study) + xuất mặt bằng .svg',
        'Bảng phối chất liệu Gỗ × Vải tự cập nhật giá & thanh kéo so sánh Trước/Sau cải tạo căn hộ',
        'Tự động gom dự toán BOM chi tiết, xuất CSV UTF-8 BOM, in Proposal PDF A4 & cọc VietQR',
      ],
      en: [
        'Interactive 50mm-grid 2D room planner with drag/rotate/nudge, collision & 60cm walkway alerts',
        '3 architectural room presets, persistent localStorage saves & downloadable SVG floorplan',
        'Live Wood × Fabric swatch board multiplier + 1:1 Before/After renovation drag comparator',
        'Auto-synced itemized BOM cart, UTF-8 BOM CSV export, A4 Design Proposal PDF & VietQR',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo .NET 10 kiểm tra va chạm 2D AABB chính xác từng cm, mô phỏng ánh sáng Kelvin/Carbon & tối ưu ngân sách Budget Fit.',
      en: 'Full-Stack .NET 10 interior configurator with cm-accurate 2D AABB collision, Kelvin/carbon metrics & smart budget fitting.',
    },
    metricsBadge: '2D CAD PLANNER · BOQ PRO',
  },
  {
    id: 'zenith-wealth-fintech',
    sku: 'TVT-FIN-19',
    name: 'Zenith Wealth FinTech v3.0',
    subtitle: {
      vi: 'Cổng Quản Lý Tài Sản, Monte Carlo FIRE & Tái Cân Bằng Danh Mục',
      en: 'Private Wealth Terminal, Monte Carlo FIRE & Portfolio Optimizer',
    },
    tagline: {
      vi: 'Mô phỏng 200 kịch bản Monte Carlo P10/P50/P90 trừ lạm phát thực, đường biên hiệu quả Sharpe Ratio tối ưu & phiếu lệnh tự động tái cân bằng danh mục.',
      en: '200-path deterministic Monte Carlo FIRE fan-chart (real inflation-adjusted), MPT Efficient Frontier Max-Sharpe optimizer & zero-sum auto-rebalance blotter.',
    },
    category: 'enterprise-b2b',
    categoryLabel: { vi: 'Doanh Nghiệp, HR & FinTech', en: 'Enterprise, EdTech & FinTech' },
    priceVnd: 18_900_000,
    originalPriceVnd: 29_500_000,
    priceUsd: 749,
    originalPriceUsd: 1_180,
    deliveryDaysMin: 4,
    deliveryDaysMax: 7,
    liveUrl: 'https://tvt987.github.io/zenith-wealth-fintech/',
    previewImage: './media/zenith-wealth-fintech.webp',
    previewBadge: 'QUANT FIRE · CRISIS STRESS-TEST',
    featuredRank: 7,
    stack: ['FastAPI', 'Tax-Loss Harvest', '4-FX Hedge', '30Y Glide'],
    deliverables: {
      vi: [
        'Mô phỏng 200 đường Monte Carlo tức thì (<5ms) tính mốc tự do tài chính FIRE P10/P50/P90',
        'Đồ thị đường biên hiệu quả Markowitz (Efficient Frontier) tự tìm tỷ trọng Sharpe Ratio cực đại',
        'Phiếu lệnh Auto-Rebalance (MUA / BÁN cân bằng tổng = 0) cho 5 lớp tài sản VN30, Tech, Trái phiếu, Vàng, Tiền mặt',
        'Lưu kế hoạch tài sản, xuất bảng dự phóng CSV UTF-8 BOM, in Wealth Blueprint PDF A4 & đặt cố vấn VietQR',
      ],
      en: [
        'Instant 200-path seeded Monte Carlo FIRE simulator with real vs nominal SVG fan-chart',
        'Interactive Modern Portfolio Theory Efficient Frontier with 1-click Max-Sharpe adoption',
        'Zero-sum Auto-Rebalance trade blotter across 5 Vietnam & global asset classes',
        'Saved Wealth Plans vault, UTF-8 BOM CSV schedule, A4 Blueprint PDF & VietQR advisory booking',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo FastAPI mô phỏng tối ưu thuế Tax-Loss Harvesting, phòng hộ 4 ngoại tệ (4-FX Hedge) & lộ trình 30 năm (30Y Glide).',
      en: 'Full-Stack FastAPI WealthTech monorepo with Tax-Loss Harvesting, 4-currency FX hedging & 30-year FIRE glide-path engine.',
    },
    metricsBadge: 'QUANT FIRE · CRISIS STRESS-TEST',
  },
  {
    id: 'aeroforge-digital-twin',
    sku: 'TVT-IOT-22',
    name: 'AeroForge 3D Twin v3.0',
    subtitle: {
      vi: 'Bản Sao Số Nhà Máy 4.0 3D, Robot 6 Trục Kinematics & AI Dự Báo Lỗi FFT',
      en: 'Industry 4.0 Smart Factory 3D Twin, 6-Axis Robot Kinematics & Vibration FFT AI',
    },
    tagline: {
      vi: 'Siêu Phẩm 29,9 Triệu: Sàn nhà máy 3D Three.js HDRI, cánh tay robot CNC 6 trục FK/IK thật, băng chuyền QA quang học, camera nhiệt hồng ngoại Ironbow, phổ rung động ổ bi FFT & tối ưu điện mặt trời EVN 3 khung giờ.',
      en: '29.9M Ultra-Flagship: Live Three.js Smart Factory 3D floor, real 6-axis CNC robot FK/IK kinematics, optical QA conveyor, Ironbow thermal heatmap, bearing vibration FFT predictive AI & EVN solar optimizer.',
    },
    category: 'saas-ai',
    categoryLabel: { vi: 'SaaS & AI', en: 'SaaS & AI' },
    priceVnd: 29_900_000,
    originalPriceVnd: 46_000_000,
    priceUsd: 1_199,
    originalPriceUsd: 1_840,
    deliveryDaysMin: 6,
    deliveryDaysMax: 10,
    liveUrl: 'https://tvt987.github.io/aeroforge-digital-twin/',
    previewImage: './media/aeroforge-digital-twin.webp',
    previewBadge: '3D FACTORY TWIN · 6-AXIS IK · 29.9M ULTRA',
    featuredRank: 2,
    stack: ['.NET 10', '6-Axis G-Code', 'Collision Guard', 'FFT ROI'],
    deliverables: {
      vi: [
        'Sàn nhà máy 3D Three.js HDRI: cánh tay robot CNC 6 trục FK/IK thật, băng chuyền QA quang học & đội xe AGV',
        'Chế độ Camera nhiệt hồng ngoại Ironbow thời gian thực & 4 kịch bản tiêm lỗi công nghiệp tự sinh lệnh bảo trì AI',
        'Phổ rung động ổ bi FFT (0–2.500 Hz) chuẩn ISO 10816 + đồ thị tuổi thọ còn lại Weibull RUL & OEE',
        'Bộ tối ưu điện mặt trời áp mái + pin lưu trữ BESS theo biểu giá 3 khung giờ EVN + báo cáo ca PDF A4 / CSV BOM',
      ],
      en: [
        'Three.js HDRI Smart Factory bay with 6-axis FK/IK robotic arm, optical QA vision gate & AGV fleet',
        'Real-time FLIR Ironbow 3D thermal heatmap overlay & 4 industrial fault injectors generating AI work orders',
        'ISO 10816 bearing vibration FFT spectrum (0–2,500 Hz), Weibull RUL survival curve & live OEE cockpit',
        'Vietnam EVN 3-tier industrial tariff & rooftop solar BESS optimizer with A4 shift dossier & CSV BOM',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo .NET 10 + động học robot 6 trục G-Code, cảnh báo va chạm Collision Guard & phân tích ROI bảo trì rung động FFT.',
      en: 'Full-Stack .NET 10 Industry 4.0 twin with 6-axis G-Code kinematics, real-time Collision Guard & predictive FFT maintenance ROI.',
    },
    metricsBadge: '3D FACTORY TWIN · 6-AXIS IK · 29.9M ULTRA',
  },
  {
    id: 'helios-quant-terminal',
    sku: 'TVT-QNT-21',
    name: 'Helios Quant Terminal v3.0',
    subtitle: {
      vi: 'Sàn Khớp Lệnh L2 Orderbook, Biểu Đồ Nến Canvas & Backtest Thuật Toán Quant',
      en: 'Institutional L2 Orderbook Matching Engine, Canvas Candlestick & Algo Backtester',
    },
    tagline: {
      vi: 'Siêu Phẩm 28,9 Triệu: Nhân khớp lệnh Price-Time Priority 6 thị trường (BTC/ETH/VN30F1M/Vàng/NVDA), biểu đồ nến Canvas HiDPI (EMA/Bollinger/VWAP/RSI/MACD), mô phỏng sốc thanh khoản & Backtest 4 chiến lược 500 nến (<5ms).',
      en: '28.9M Ultra-Flagship: Deterministic FIFO LOB matching engine across 6 markets (incl. VN30F1M), HiDPI Canvas candlesticks with EMA/BB/VWAP/RSI/MACD, flash-crash stress lab & sub-5ms 500-bar quant backtester.',
    },
    category: 'enterprise-b2b',
    categoryLabel: { vi: 'Doanh Nghiệp, HR & FinTech', en: 'Enterprise, EdTech & FinTech' },
    priceVnd: 28_900_000,
    originalPriceVnd: 44_500_000,
    priceUsd: 1_159,
    originalPriceUsd: 1_780,
    deliveryDaysMin: 6,
    deliveryDaysMax: 10,
    liveUrl: 'https://tvt987.github.io/helios-quant-terminal/',
    previewImage: './media/helios-quant-terminal.webp',
    previewBadge: 'L2 MATCHING ENGINE · ALGO QUANT · 28.9M',
    featuredRank: 3,
    stack: ['FastAPI', 'FIFO LOB', '6x6 Sharpe Map', 'Depth OFI'],
    deliverables: {
      vi: [
        'Nhân khớp lệnh Limit Order Book chuẩn FIFO 15×15 cấp giá cho 6 thị trường (BTC, ETH, SOL, VN30F1M, XAU, NVDA)',
        'Biểu đồ nến OHLCV Canvas 2D HiDPI mượt 60fps kèm EMA 9/21, Bollinger Bands, VWAP, RSI(14) & MACD',
        'Phòng mô phỏng sốc thanh khoản (Flash Crash -10%, Short Squeeze +12%, Whale Sweep $50M) & rủi ro Margin/Liquidation',
        'Bộ Backtest 4 chiến lược thuật toán 500 nến (<5ms) tính Sharpe/Sortino/Calmar/VaR 99% & xuất sổ lệnh CSV BOM',
      ],
      en: [
        'Deterministic FIFO L2 Orderbook matching engine (15×15 levels) across 6 global & VN30F1M futures markets',
        '60fps HiDPI Canvas 2D OHLCV candlestick chart with EMA 9/21, Bollinger Bands, VWAP, RSI(14) & MACD',
        '1-click liquidity stress shock lab (Flash Crash, Short Squeeze, Whale Sweep) with live liquidation risk',
        'Sub-5ms 500-bar quant backtester (4 strategies) with Sharpe/Sortino/VaR 99% & UTF-8 BOM blotter CSV',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo FastAPI với nhân khớp lệnh FIFO LOB, bản đồ nhiệt Sharpe 6×6 & phân tích mất cân bằng sổ lệnh Depth OFI.',
      en: 'Full-Stack FastAPI quant trading terminal combining deterministic FIFO LOB, 6x6 Sharpe heatmap & order-flow imbalance (OFI).',
    },
    metricsBadge: 'L2 MATCHING ENGINE · ALGO QUANT · 28.9M',
  },
  {
    id: 'chronos-horology',
    sku: 'TVT-LUX-20',
    name: 'Chronos 3D Watch v3.0',
    subtitle: {
      vi: 'Bộ Máy Đồng Hồ Cơ Tourbillon 3D Chạy Thật, Âm Thanh 4Hz & Boutique Thụy Sĩ',
      en: 'Working 3D Mechanical Tourbillon Calibre, 4Hz Escapement Synth & Swiss Boutique',
    },
    tagline: {
      vi: 'Siêu Phẩm 26,9 Triệu: Bộ máy đồng hồ cơ Tourbillon 3D Three.js hoạt động thật 60fps (bánh răng ăn khớp, cầu cân bằng 28,800 vph, tách 7 tầng máy, dạ quang Lume Night, âm thanh bộ thoát 4Hz Web Audio) & chứng nhận COSC A4.',
      en: '26.9M Ultra-Flagship: Live animated 3D mechanical Tourbillon calibre (28,800 vph balance, meshed gear train, 7-layer exploded view, Lume Night, Web Audio 4Hz escapement synth) & COSC A4 certification.',
    },
    category: 'commerce-3d',
    categoryLabel: { vi: 'Bán Hàng 3D & Nội Thất', en: '3D Commerce & Interior' },
    priceVnd: 26_900_000,
    originalPriceVnd: 41_500_000,
    priceUsd: 1_079,
    originalPriceUsd: 1_660,
    deliveryDaysMin: 5,
    deliveryDaysMax: 8,
    liveUrl: 'https://tvt987.github.io/chronos-horology/',
    previewImage: './media/chronos-horology.webp',
    previewBadge: '3D TOURBILLON CALIBRE · 4HZ AUDIO · 26.9M',
    featuredRank: 4,
    stack: ['.NET 10', 'Timegrapher', '7-Layer Caliber', 'HMAC Vault'],
    deliverables: {
      vi: [
        'Bộ máy Tourbillon 3D Three.js HDRI chạy thật: bánh răng ăn khớp tỷ số chính xác, tách 7 tầng máy & 7 góc camera macro',
        'Chế độ dạ quang Super-LumiNova, bấm giờ Chronograph có Split-Lap & âm thanh bộ thoát 28.800 vph tổng hợp Web Audio',
        'Phòng lab vật lý COSC 6 vị trí trọng lực, mô phỏng mô-men dây cót 72 giờ & khắc laser nắp đáy 3D thời gian thực',
        'Tùy biến 4 kim loại quý (Vàng hồng 18K / Titan / Carbon / Platinum), Collector Vault & Chứng nhận COSC A4 QR',
      ],
      en: [
        'Live Three.js HDRI mechanical Tourbillon calibre with meshed gear train, 7-layer explode slider & 7 macro cams',
        'Super-LumiNova night mode, live Split-Lap Chronograph & synthesized 28,800 vph Web Audio escapement acoustics',
        'ISO 3159 COSC 6-position accuracy lab, 72h barrel torque simulation & live 3D CanvasTexture caseback engraving',
        '4 haute-horlogerie metals (18K Rose Gold, Grade-5 Ti, Forged Carbon, Pt950), Collector Vault & A4 COSC QR',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo .NET 10 mô phỏng máy đo Timegrapher COSC, tách 7 tầng bộ máy Tourbillon 3D & kho chứng nhận bảo mật HMAC Vault.',
      en: 'Full-Stack .NET 10 haute-horlogerie platform with COSC Timegrapher, 7-layer 3D Tourbillon caliber & HMAC Collector Vault.',
    },
    metricsBadge: '3D TOURBILLON CALIBRE · 4HZ AUDIO · 26.9M',
  },
  {
    id: 'orbitalflow-saas',
    sku: 'TVT-SAAS-23',
    name: 'OrbitalFlow B2B SaaS v3.0',
    subtitle: {
      vi: 'Nền Tảng B2B SaaS Đa Tenant, RBAC, Gantt Đường Găng & Stripe Metering',
      en: 'Multi-Tenant B2B SaaS, RBAC Matrix, Gantt CPM & Stripe Proration Billing',
    },
    tagline: {
      vi: 'Hệ thống SaaS chuẩn doanh nghiệp Linear × Stripe: chuyển tổ chức đa tenant, phân quyền RBAC khóa chức năng thật, Sprint Kanban + Gantt CPM, tính cước Metering/Proration & ký HMAC-SHA256 Webhook.',
      en: 'Linear × Stripe B2B SaaS: multi-tenant org switcher, live RBAC permission enforcement, Sprint Kanban + CPM Critical Path Gantt, usage-based proration billing & HMAC-SHA256 webhook debugger.',
    },
    category: 'saas-ai',
    categoryLabel: { vi: 'SaaS & AI', en: 'SaaS & AI' },
    priceVnd: 24_900_000,
    originalPriceVnd: 38_500_000,
    priceUsd: 999,
    originalPriceUsd: 1_540,
    deliveryDaysMin: 5,
    deliveryDaysMax: 9,
    liveUrl: 'https://tvt987.github.io/orbitalflow-saas/',
    previewImage: './media/orbitalflow-saas.webp',
    previewBadge: 'MULTI-TENANT RBAC · GANTT CPM · STRIPE',
    featuredRank: 5,
    stack: ['.NET 10', 'Drag-Drop + Undo', 'Gantt SVG', 'Stripe Metering'],
    deliverables: {
      vi: [
        'Quản lý đa tổ chức (Multi-Tenant) kèm ma trận phân quyền RBAC 4 vai trò khóa hành động thực tế',
        'Bảng Sprint Kanban có giới hạn WIP, biểu đồ Gantt tính đường găng CPM & đồ thị Burnup SVG',
        'Động cơ tính cước Stripe-style (Ghế + API Metering bậc thang + Proration theo ngày + Hóa đơn A4)',
        'Quản lý API Key, ký Webhook HMAC-SHA256, mô phỏng Retry Backoff & Nhật ký Audit chuỗi băm SHA-256',
      ],
      en: [
        'Multi-tenant workspace switcher with live 4-role RBAC capability enforcement & denied-action audit logs',
        'WIP-limited Sprint Kanban, Critical Path Method (CPM) Gantt scheduler & SVG velocity burnup chart',
        'Stripe-style graduated API usage metering, daily mid-cycle proration math & printable A4 invoice',
        'Scoped API key vault, Web Crypto HMAC-SHA256 webhook replay debugger & hash-chained audit ledger',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo .NET 10 đa tenant RLS: Sprint Kanban Drag-Drop + Undo, biểu đồ Gantt SVG & tính cước Stripe Metering/Proration.',
      en: 'Full-Stack .NET 10 multi-tenant SaaS featuring Drag-Drop + Undo Kanban, CPM Gantt SVG & graduated Stripe Metering billing.',
    },
    metricsBadge: 'MULTI-TENANT RBAC · GANTT CPM · STRIPE',
  },
  {
    id: 'vectradoc-rag',
    sku: 'TVT-AI-24',
    name: 'VectraDoc AI RAG v3.0',
    subtitle: {
      vi: 'AI Đọc Tài Liệu Hybrid RAG (BM25 + Vector RRF), Trích Dẫn & Che PII',
      en: 'Enterprise Document Intelligence, Live Hybrid BM25+Vector RRF RAG & PII Guard',
    },
    tagline: {
      vi: 'Không gian AI RAG chạy thuật toán thật ngay trên trình duyệt: nạp tài liệu .txt/.md/.json/.csv, chia chunk trực quan, truy xuất Okapi BM25 + Cosine + RRF, trích dẫn [1][2] tô sáng nguyên văn & che PII chuẩn Luhn.',
      en: 'Live client-side Hybrid RAG workspace: ingest real files, inspect chunk spans, run genuine Okapi BM25 + TF-IDF Cosine + RRF reranking, highlight verbatim [1][2] citations & run 12-query MRR/NDCG evals.',
    },
    category: 'saas-ai',
    categoryLabel: { vi: 'SaaS & AI', en: 'SaaS & AI' },
    priceVnd: 25_900_000,
    originalPriceVnd: 39_900_000,
    priceUsd: 1_039,
    originalPriceUsd: 1_599,
    deliveryDaysMin: 5,
    deliveryDaysMax: 9,
    liveUrl: 'https://tvt987.github.io/vectradoc-rag/',
    previewImage: './media/vectradoc-rag.webp',
    previewBadge: 'OKAPI BM25 + RRF · 100% RECALL · PII',
    featuredRank: 6,
    stack: ['FastAPI', 'PDF FlateDecode', '4-Way A/B RAG', 'PII Guard'],
    deliverables: {
      vi: [
        'Nạp tài liệu thật (.txt/.md/.json/.csv) + 3 chiến lược chia Chunk hiển thị ranh giới vị trí chính xác',
        'Thuật toán Hybrid RAG thật (Okapi BM25 + Cosine Vector + RRF + Reranker) có thanh trượt tỷ trọng alpha',
        'Tổng hợp câu trả lời bám sát nguồn, bấm [1][2] tô sáng nguyên văn & đo độ trung thực Faithfulness 0–100%',
        'Lá chắn che PII (Email, SĐT, CCCD, Thẻ tín dụng Luhn), chống Prompt Injection & bộ đo chuẩn MRR/NDCG@5',
      ],
      en: [
        'Live document upload (.txt/.md/.json/.csv) with 3 visual chunking strategies & exact offset spans',
        'Genuine Okapi BM25 + N-Gram Cosine + Reciprocal Rank Fusion (RRF) + Cross-Encoder reranker',
        'Grounded extractive synthesis with clickable verbatim [1][2] citation highlights & Faithfulness audit',
        'Luhn/Regex PII redaction, Prompt Injection guard & 12-query Recall@5 / MRR / NDCG@5 eval harness',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo FastAPI giải nén PDF FlateDecode trực tiếp, so sánh A/B 4 chiến lược RAG & lá chắn PII Guard bảo mật doanh nghiệp.',
      en: 'Full-Stack FastAPI Document AI monorepo with native PDF FlateDecode ingestion, 4-way A/B RAG benchmarking & Luhn PII Guard.',
    },
    metricsBadge: 'OKAPI BM25 + RRF · 100% RECALL · PII',
  },
  {
    id: 'fleetpulse-gis',
    sku: 'TVT-GIS-25',
    name: 'FleetPulse GIS Fleet v3.0',
    subtitle: {
      vi: 'Điều Phối Đội Xe Bản Đồ Vector, Tối Ưu Tuyến CVRP & Chuỗi Lạnh -18°C',
      en: 'Real-Time GIS Vector Fleet Control, CVRP 2-Opt Route Optimizer & Cold-Chain IoT',
    },
    tagline: {
      vi: 'Bản đồ điều phối đội xe toàn màn hình: thuật toán CVRP Clarke-Wright + 2-Opt cắt giảm 28,6% quãng đường trong 0,7ms, mô phỏng xe chạy thời gian thực, giám sát chuỗi lạnh -18°C & in lệnh điều vận A4.',
      en: 'Full-viewport vector city GIS control room: Clarke-Wright + 2-Opt CVRP solver cutting route distance by 28.6% in 0.7ms, animated fleet telemetry, -18°C reefer fault drift & A4 dispatch manifest.',
    },
    category: 'enterprise-b2b',
    categoryLabel: { vi: 'Doanh Nghiệp, HR & FinTech', en: 'Enterprise, Logistics & FinTech' },
    priceVnd: 27_900_000,
    originalPriceVnd: 43_000_000,
    priceUsd: 1_119,
    originalPriceUsd: 1_720,
    deliveryDaysMin: 6,
    deliveryDaysMax: 10,
    liveUrl: 'https://tvt987.github.io/fleetpulse-gis/',
    previewImage: './media/fleetpulse-gis.webp',
    previewBadge: 'CVRP -28.6% KM · VECTOR GIS · -18°C',
    featuredRank: 7,
    stack: ['.NET 10', 'CVRP <1ms', 'Shift Scrub', 'PostGIS/MQTT'],
    deliverables: {
      vi: [
        'Bản đồ vector hành lang TP.HCM – Bình Dương – Đồng Nai có phóng to/thu nhỏ, vùng Geofence & xe di chuyển thật',
        'Bộ giải tối ưu tuyến đa xe có tải trọng & nhiệt độ (Clarke-Wright + 2-Opt) so sánh Trước/Sau tức thì',
        'Giám sát chuỗi lạnh -18°C/+4°C kèm nút tiêm sự cố kẹt hầm Thủ Thiêm, hỏng máy lạnh & chèn đơn gấp Rush Order',
        'Tính nhiên liệu, chi phí vận hành, lượng CO2e tiết kiệm, xuất Manifest CSV BOM & Lệnh điều xe A4',
      ],
      en: [
        'Interactive pan/zoom vector logistics corridor map with geofences, live truck heading & Before/After route diff',
        'Compartment-aware Clarke-Wright Savings + 2-Opt CVRP optimizer solving 24 stops in <1ms (-28.6% km)',
        'Cold-chain thermal physics (-18°C/+4°C) with 1-click traffic congestion, reefer fault & rush order injectors',
        'Fuel/cost/CO2e savings ledger, formula-safe UTF-8 BOM CSV manifest & printable A4 driver dispatch sheet',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo .NET 10 tối ưu tuyến CVRP <1ms, tua lại ca chạy Shift Scrub & kiến trúc PostGIS/MQTT chuỗi lạnh -18°C.',
      en: 'Full-Stack .NET 10 GIS dispatch engine solving CVRP in <1ms with live Shift Scrub replay & PostGIS/MQTT cold-chain telemetry.',
    },
    metricsBadge: 'CVRP -28.6% KM · VECTOR GIS · -18°C',
  },
  {
    id: 'medcore-ehr',
    sku: 'TVT-MED-26',
    name: 'MedCore Clinical EHR v3.0',
    subtitle: {
      vi: 'Bệnh Án Điện Tử EHR, Sóng ECG/SpO2 Canvas, NEWS2 & Chuẩn HL7 FHIR R4',
      en: 'Clinical EHR Workstation, Live Canvas ECG/SpO2, RCP NEWS2 & HL7 FHIR R4 Interop',
    },
    tagline: {
      vi: 'Trạm bác sĩ chuẩn bệnh viện quốc tế: màn hình Canvas vẽ sóng ECG Lead-II P-QRS-T & SpO2 trực tiếp, thang cấp cứu RCP NEWS2, cảnh báo tương tác thuốc/dị ứng chéo CPOE, lọc thận CrCl & xuất HL7 FHIR R4 JSON.',
      en: 'Hospital-grade 3-column EHR workstation: live HiDPI Canvas Lead-II ECG & SpO2 waveforms, RCP NEWS2 triage matrix, 24-drug CPOE interaction & allergy hard-stop guard, Cockcroft-Gault CrCl & HL7 FHIR R4 JSON.',
    },
    category: 'clinic-proptech',
    categoryLabel: { vi: 'Y Tế, BĐS & Wellness', en: 'HealthTech, Clinic & PropTech' },
    priceVnd: 26_900_000,
    originalPriceVnd: 41_500_000,
    priceUsd: 1_079,
    originalPriceUsd: 1_660,
    deliveryDaysMin: 6,
    deliveryDaysMax: 10,
    liveUrl: 'https://tvt987.github.io/medcore-ehr/',
    previewImage: './media/medcore-ehr.webp',
    previewBadge: 'LIVE ECG/SPO2 · NEWS2 · HL7 FHIR R4',
    featuredRank: 8,
    stack: ['FastAPI', 'HL7 FHIR R4', '3-Ch ECG/EtCO2', 'Safe Drug Sub'],
    deliverables: {
      vi: [
        'Hàng đợi nội trú tự sắp theo mức độ nặng RCP NEWS2 (0–20) cùng dải cảnh báo dị ứng & hồ sơ SOAP',
        'Màn hình sinh hiệu HTML5 Canvas vẽ sóng ECG Lead-II (4 dạng nhịp tim) & SpO2 Plethysmograph mượt 60fps',
        'Kê đơn CPOE chặn cứng tương tác thuốc Major, dị ứng chéo Penicillin & tính liều theo cân nặng / lọc thận CrCl',
        'Xuất gói hồ sơ chuẩn quốc tế HL7 FHIR R4 Bundle JSON (mã LOINC/RxNorm), bảng xét nghiệm CSV BOM & Đơn thuốc A4',
      ],
      en: [
        'Acuity-sorted inpatient ward queue powered by RCP NEWS2 (0–20) scoring, allergy alerts & structured SOAP notes',
        'Real-time HiDPI HTML5 Canvas Lead-II ECG (4 arrhythmia rhythms) & SpO2 photoplethysmograph monitor',
        '24-drug CPOE safety engine catching Major DDIs, Penicillin cross-reactivity & Cockcroft-Gault renal dosing',
        'Spec-compliant HL7 FHIR R4 Bundle JSON (LOINC/RxNorm), UTF-8 BOM lab CSV & formal printable A4 e-Prescription',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo FastAPI chuẩn liên thông HL7 FHIR R4, màn hình 3 kênh ECG/SpO2/EtCO2 & gợi ý thay thế thuốc an toàn Safe Drug Sub.',
      en: 'Full-Stack FastAPI Clinical EHR with HL7 FHIR R4 interoperability, 3-channel ECG/SpO2/EtCO2 monitor & safe drug substitution.',
    },
    metricsBadge: 'LIVE ECG/SPO2 · NEWS2 · HL7 FHIR R4',
  },
];

export function roundVnd(amount: number): number {
  return Math.round(amount / 10_000) * 10_000;
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
    'enterprise-b2b': 0,
    'saas-ai': 0,
  };
  for (const p of products) {
    counts[p.category] += 1;
  }
  return counts;
}

const THREE_JS_3D_PATTERN = /\b(three\.js|webgl|pmrem|hdri|pbr|3d hardware|3d fft)\b/i;
const AI_RAG_MCP_PATTERN = /\b(rag|mcp|llm|multi-agent)\b/i;

export function matchesTechStack(
  product: TemplateProduct,
  stackFilter: TechStackFilter
): boolean {
  if (stackFilter === 'all') {
    return true;
  }
  if (stackFilter === 'dotnet') {
    return product.stack.some((tag) => {
      const lower = tag.toLowerCase();
      return lower.includes('.net 10') || lower.includes('dotnet');
    });
  }
  if (stackFilter === 'fastapi') {
    return product.stack.some((tag) => tag.toLowerCase().includes('fastapi'));
  }

  const metadataBlob = [
    product.name,
    product.metricsBadge,
    ...product.stack,
    product.tagline.en,
    product.architectureNote.en,
    ...product.deliverables.en,
  ].join(' ');

  if (stackFilter === 'threejs') {
    return THREE_JS_3D_PATTERN.test(metadataBlob);
  }
  if (stackFilter === 'ai-rag') {
    return AI_RAG_MCP_PATTERN.test(metadataBlob);
  }
  return true;
}

export function filterCatalogByStack(
  products: TemplateProduct[],
  stackFilter: TechStackFilter
): TemplateProduct[] {
  if (stackFilter === 'all') {
    return [...products];
  }
  return products.filter((item) => matchesTechStack(item, stackFilter));
}

export function countCatalogStacks(
  products: TemplateProduct[]
): Record<TechStackFilter, number> {
  const counts: Record<TechStackFilter, number> = {
    all: products.length,
    dotnet: 0,
    fastapi: 0,
    threejs: 0,
    'ai-rag': 0,
  };
  for (const product of products) {
    if (matchesTechStack(product, 'dotnet')) counts.dotnet += 1;
    if (matchesTechStack(product, 'fastapi')) counts.fastapi += 1;
    if (matchesTechStack(product, 'threejs')) counts.threejs += 1;
    if (matchesTechStack(product, 'ai-rag')) counts['ai-rag'] += 1;
  }
  return counts;
}
