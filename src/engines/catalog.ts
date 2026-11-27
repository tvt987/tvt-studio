import type {
  CatalogSort,
  Currency,
  LicenseTier,
  ProductCategory,
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
    priceVnd: 3_490_000,
    originalPriceVnd: 6_200_000,
    priceUsd: 139,
    originalPriceUsd: 249,
    deliveryDaysMin: 3,
    deliveryDaysMax: 5,
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
    priceVnd: 3_490_000,
    originalPriceVnd: 6_500_000,
    priceUsd: 139,
    originalPriceUsd: 259,
    deliveryDaysMin: 3,
    deliveryDaysMax: 5,
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
    priceVnd: 2_490_000,
    originalPriceVnd: 4_500_000,
    priceUsd: 99,
    originalPriceUsd: 179,
    deliveryDaysMin: 2,
    deliveryDaysMax: 4,
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
    priceVnd: 3_990_000,
    originalPriceVnd: 7_200_000,
    priceUsd: 159,
    originalPriceUsd: 289,
    deliveryDaysMin: 3,
    deliveryDaysMax: 6,
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
    priceVnd: 4_990_000,
    originalPriceVnd: 8_900_000,
    priceUsd: 199,
    originalPriceUsd: 359,
    deliveryDaysMin: 4,
    deliveryDaysMax: 7,
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
    priceVnd: 5_490_000,
    originalPriceVnd: 9_900_000,
    priceUsd: 219,
    originalPriceUsd: 399,
    deliveryDaysMin: 4,
    deliveryDaysMax: 7,
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
    priceVnd: 5_490_000,
    originalPriceVnd: 9_900_000,
    priceUsd: 219,
    originalPriceUsd: 399,
    deliveryDaysMin: 4,
    deliveryDaysMax: 7,
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
    priceVnd: 5_990_000,
    originalPriceVnd: 10_900_000,
    priceUsd: 239,
    originalPriceUsd: 439,
    deliveryDaysMin: 5,
    deliveryDaysMax: 8,
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
    priceVnd: 6_990_000,
    originalPriceVnd: 12_900_000,
    priceUsd: 279,
    originalPriceUsd: 519,
    deliveryDaysMin: 5,
    deliveryDaysMax: 10,
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
  {
    id: 'aurelia-resort',
    sku: 'TVT-HOSP-10',
    name: 'Aurelia Phu Quoc Resort',
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
    priceVnd: 3_290_000,
    originalPriceVnd: 5_900_000,
    priceUsd: 129,
    originalPriceUsd: 235,
    deliveryDaysMin: 3,
    deliveryDaysMax: 5,
    liveUrl: 'https://tvt987.github.io/aurelia-resort/',
    previewImage: './media/aurelia-resort.webp',
    previewBadge: '5-STAR RESORT · DIRECT BOOKING',
    featuredRank: 10,
    stack: ['React 19', 'SVG Masterplan', 'VietQR EMVCo', 'ICS Pass'],
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
      vi: 'Giúp khách sạn & resort tiết kiệm 15–22% phí hoa hồng OTA nhờ trải nghiệm đặt phòng trực tiếp đẳng cấp.',
      en: 'Captures direct zero-commission bookings with deterministic seasonal rate and occupancy math.',
    },
    metricsBadge: 'DIRECT OTA-FREE · 25 CI',
  },
  {
    id: 'velox-ev-motors',
    sku: 'TVT-EV-11',
    name: 'Velox EV Motors',
    subtitle: {
      vi: 'Showroom Xe Điện 3D PBR & Mô Phỏng Quãng Đường WLTP',
      en: '3D PBR EV Showroom, WLTP Range Physics & TCO Configurator',
    },
    tagline: {
      vi: 'Cấu hình xe điện 3D WebGL (màu sơn, mâm đúc, nội thất, FSD), mô phỏng vật lý quãng đường thực tế, so sánh chi phí 5 năm vs xe xăng & đặt lái thử.',
      en: 'Interactive Three.js PBR 3D EV configurator, real-world aerodynamic/thermal WLTP range simulator, 5-year EV vs Petrol TCO & showroom test-drive lock.',
    },
    category: 'commerce-3d',
    categoryLabel: { vi: 'Bán Hàng 3D & Nội Thất', en: '3D Commerce & Interior' },
    priceVnd: 4_290_000,
    originalPriceVnd: 7_800_000,
    priceUsd: 169,
    originalPriceUsd: 309,
    deliveryDaysMin: 4,
    deliveryDaysMax: 6,
    liveUrl: 'https://tvt987.github.io/velox-ev-motors/',
    previewImage: './media/velox-ev-motors.webp',
    previewBadge: '3D PBR EV · WLTP PHYSICS',
    featuredRank: 11,
    stack: ['React 19', 'Three.js PBR', 'WLTP Physics', 'Loan PMT'],
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
      vi: 'Tự động tạm dừng render WebGL khi cuộn ra khỏi khung nhìn (IntersectionObserver) giữ pin tối ưu trên mobile.',
      en: 'IntersectionObserver GPU throttling paired with calibrated automotive lighting and TCO math.',
    },
    metricsBadge: 'THREE.JS PBR · 25 CI',
  },
  {
    id: 'solaris-academy',
    sku: 'TVT-EDU-12',
    name: 'Solaris Academy LMS',
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
    priceVnd: 4_190_000,
    originalPriceVnd: 7_500_000,
    priceUsd: 169,
    originalPriceUsd: 299,
    deliveryDaysMin: 4,
    deliveryDaysMax: 6,
    liveUrl: 'https://tvt987.github.io/solaris-academy/',
    previewImage: './media/solaris-academy.webp',
    previewBadge: 'EDTECH LMS · ZERO-EVAL SANDBOX',
    featuredRank: 12,
    stack: ['React 19', 'AST Sandbox', 'SM-2 SRS', 'Cert QR PDF'],
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
      vi: 'Bộ thông dịch AST tự viết chặn 100% mã độc hại thay vì dùng eval(), an toàn tuyệt đối cho LMS thương mại.',
      en: 'Custom AST sandbox blocks arbitrary code execution while grading student labs instantaneously.',
    },
    metricsBadge: 'AST SANDBOX · 25 CI',
  },
  {
    id: 'kuro-omakase',
    sku: 'TVT-FINE-13',
    name: 'Kuro Omakase',
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
    priceVnd: 2_990_000,
    originalPriceVnd: 5_400_000,
    priceUsd: 119,
    originalPriceUsd: 215,
    deliveryDaysMin: 3,
    deliveryDaysMax: 5,
    liveUrl: 'https://tvt987.github.io/kuro-omakase/',
    previewImage: './media/kuro-omakase.webp',
    previewBadge: 'FINE DINING · HINOKI SEAT MAP',
    featuredRank: 13,
    stack: ['React 19', 'SVG Seat Lock', 'Allergen Engine', 'VietQR'],
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
      vi: 'Tối ưu tỷ lệ lấp đầy ghế nhà hàng cao cấp bằng thuật toán gợi ý ghế liền kề & khóa chỗ chống trùng.',
      en: 'Maximizes fine-dining cover utilization with adjacency checks and real-time wave locking.',
    },
    metricsBadge: 'SEAT LOCK · 28 CI',
  },
  {
    id: 'vanguard-fitness',
    sku: 'TVT-FIT-14',
    name: 'Vanguard Fitness Club',
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
    priceVnd: 2_890_000,
    originalPriceVnd: 5_200_000,
    priceUsd: 115,
    originalPriceUsd: 209,
    deliveryDaysMin: 2,
    deliveryDaysMax: 4,
    liveUrl: 'https://tvt987.github.io/vanguard-fitness/',
    previewImage: './media/vanguard-fitness.webp',
    previewBadge: 'WELLNESS · METABOLIC SIMULATOR',
    featuredRank: 14,
    stack: ['React 19', 'Metabolic Math', 'Waitlist Lock', 'QR Pass'],
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
      vi: 'Kết hợp công cụ tính dinh dưỡng tương tác ngay trang chủ giúp tăng mạnh tỷ lệ đăng ký tư vấn gói PT.',
      en: 'Interactive metabolic lead magnet engineered to convert high-LTV personal training memberships.',
    },
    metricsBadge: 'BIO-METABOLIC · 27 CI',
  },
  {
    id: 'meridian-logistics',
    sku: 'TVT-LOG-15',
    name: 'Meridian Logistics',
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
    priceVnd: 4_790_000,
    originalPriceVnd: 8_600_000,
    priceUsd: 189,
    originalPriceUsd: 345,
    deliveryDaysMin: 4,
    deliveryDaysMax: 7,
    liveUrl: 'https://tvt987.github.io/meridian-logistics/',
    previewImage: './media/meridian-logistics.webp',
    previewBadge: 'LOGISTICS · CBM & WAYBILL',
    featuredRank: 15,
    stack: ['React 19', 'CBM Freight Math', 'SVG Corridors', 'Bill of Lading'],
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
      vi: 'Chuẩn hóa quy tắc tính cước W/M, hệ số thể tích hàng không và tính toán phát thải CO2e minh bạch.',
      en: 'Strict international freight chargeable-weight math with verified customs audit trails.',
    },
    metricsBadge: 'FREIGHT SAAS · 26 CI',
  },
  {
    id: 'coda-hr-payroll',
    sku: 'TVT-HR-16',
    name: 'CodaHR Payroll 2026',
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
    priceVnd: 4_890_000,
    originalPriceVnd: 8_900_000,
    priceUsd: 195,
    originalPriceUsd: 355,
    deliveryDaysMin: 4,
    deliveryDaysMax: 7,
    liveUrl: 'https://tvt987.github.io/coda-hr-payroll/',
    previewImage: './media/coda-hr-payroll.webp',
    previewBadge: 'HR TECH · 2026 LAW 109/2025',
    featuredRank: 16,
    stack: ['React 19', 'VN Payroll 2026', 'Kanban ATS', 'CSV BOM'],
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
      vi: 'Thuật toán tìm kiếm nhị phân Net→Gross hội tụ sai số <= 1₫ và tự động áp trần BHTN 4 vùng 2026.',
      en: 'Binary-search Net→Gross inverse solver with Decree 293/2025 regional BHTN caps.',
    },
    metricsBadge: 'LAW 2026 · 28 CI',
  },
  {
    id: 'veritas-legal-firm',
    sku: 'TVT-LAW-17',
    name: 'Veritas Legal Studio',
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
    priceVnd: 3_590_000,
    originalPriceVnd: 6_500_000,
    priceUsd: 145,
    originalPriceUsd: 259,
    deliveryDaysMin: 3,
    deliveryDaysMax: 5,
    liveUrl: 'https://tvt987.github.io/veritas-legal-firm/',
    previewImage: './media/veritas-legal-firm.webp',
    previewBadge: 'LEGALTECH · RISK SCORING',
    featuredRank: 17,
    stack: ['React 19', 'Contract Engine', 'PDPD Risk 0–100', 'A4 Legal PDF'],
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
      vi: 'Tạo lợi thế chuyển đổi vượt trội cho hãng luật và cố vấn pháp chế nhờ trải nghiệm kiểm tra rủi ro ngay trên web.',
      en: 'Transforms a passive law firm brochure into an interactive high-trust LegalTech client acquisition engine.',
    },
    metricsBadge: 'LEGALTECH · 26 CI',
  },
  {
    id: 'nordic-home-atelier',
    sku: 'TVT-INT-18',
    name: 'Nordic Atelier Interior',
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
    priceVnd: 3_890_000,
    originalPriceVnd: 6_900_000,
    priceUsd: 155,
    originalPriceUsd: 275,
    deliveryDaysMin: 3,
    deliveryDaysMax: 6,
    liveUrl: 'https://tvt987.github.io/nordic-home-atelier/',
    previewImage: './media/nordic-home-atelier.webp',
    previewBadge: 'INTERIOR · 2D ROOM PLANNER',
    featuredRank: 18,
    stack: ['React 19', '2D CAD Planner', 'Swatch Pricing', 'A4 Proposal'],
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
      vi: 'Toán học hình học AABB chính xác đến từng centimet giúp khách hàng tự bố trí phòng trước khi đặt đóng nội thất.',
      en: 'Centimeter-accurate AABB collision & circulation math empowering self-serve interior design quotes.',
    },
    metricsBadge: '2D CAD PLANNER · 28 CI',
  },
  {
    id: 'zenith-wealth-fintech',
    sku: 'TVT-FIN-19',
    name: 'Zenith Wealth FinTech',
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
    priceVnd: 5_290_000,
    originalPriceVnd: 9_500_000,
    priceUsd: 215,
    originalPriceUsd: 379,
    deliveryDaysMin: 4,
    deliveryDaysMax: 7,
    liveUrl: 'https://tvt987.github.io/zenith-wealth-fintech/',
    previewImage: './media/zenith-wealth-fintech.webp',
    previewBadge: 'FINTECH · MONTE CARLO FIRE',
    featuredRank: 19,
    stack: ['React 19', 'Monte Carlo', 'Sharpe Frontier', 'Rebalancer'],
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
      vi: 'Toán tài chính định lượng thuần chạy tức thì trên trình duyệt, sẵn sàng nối API chứng khoán hoặc quỹ mở.',
      en: 'Deterministic quantitative finance engine running sub-5ms client-side, ready for brokerage APIs.',
    },
    metricsBadge: 'QUANT FINTECH · 24 CI',
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
