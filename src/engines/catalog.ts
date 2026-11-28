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
    name: 'Maison Véra 3D v7.0',
    subtitle: {
      vi: 'Thử Kính Mắt 3D Virtual Try-On, Webcam AR, Tròng UV 0–11 & Phân Cực Malus',
      en: 'Live 3D Virtual Try-On Studio, Webcam AR, UV 0–11 Photochromic & Malus Glare',
    },
    tagline: {
      vi: 'Studio Thử Kính 3D Parisian: tượng điêu khắc Alabaster xoay 6-DOF đeo đúng kính titan vừa cấu hình, 4 dáng mặt + điểm Fit %, Webcam AR trực tiếp, kéo chỉ số UV 0–11 đổi màu tròng & màn cắt chói phân cực Malus -99.4%.',
      en: 'Parisian 3D Virtual Try-On Studio: sculpted Travertine bust wearing your live-configured titanium frame across 4 face archetypes + Atelier Fit %, on-demand Webcam AR, UV 0–11 photochromic darkening & Malus -99.4% glare split curtain.',
    },
    category: 'commerce-3d',
    categoryLabel: {
      vi: 'Bán Hàng 3D',
      en: '3D Commerce',
    },
    priceVnd: 1_790_000,
    originalPriceVnd: 2_990_000,
    priceUsd: 72,
    originalPriceUsd: 119,
    deliveryDaysMin: 3,
    deliveryDaysMax: 5,
    liveUrl: 'https://tvt987.github.io/maison-vera/',
    previewImage: './media/maison-vera.webp',
    featuredRank: 14,
    stack: ['.NET 10', 'Three.js 3D Try-On', 'Webcam AR', 'UV + Malus'],
    deliverables: {
      vi: [
        'Studio Thử Kính 3D Virtual Try-On (4 dáng mặt, đo PD, chấm điểm Fit %) & bật Webcam AR trực tiếp',
        'Kéo chỉ số UV 0–11 xem tròng Photochromic tối màu trực tiếp + màn cắt chói Riviera phân cực Malus -99.4%',
        'Xuất ảnh chân dung thử kính Editorial 1200×800 PNG + Chế độ tách lớp 3D CAD & Lookbook Paris',
        'Triển khai Hosting, gắn Domain riêng, SSL & tối ưu SEO OpenGraph',
      ],
      en: [
        'Live 3D Virtual Try-On Studio (4 face shapes, PD fit score) plus privacy-first browser Webcam AR',
        'Real-time UV 0–11 photochromic lens darkening & draggable Malus -99.4% Riviera glare split curtain',
        '1-click 1200×800 Editorial Try-On Portrait PNG export, 3D CAD exploded view & Parisian lookbook',
        'Custom domain deployment, SSL, CI/CD workflow & SEO OpenGraph optimization',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo .NET 10 + Studio Thử Kính 3D Three.js PMREM, Webcam AR 6-DOF, Photochromic UV 0–11 & Optical Rx Lab.',
      en: 'Full-Stack .NET 10 monorepo pairing Three.js PMREM 3D Virtual Try-On, Webcam AR 6-DOF pose smoothing, UV 0–11 & Optical Rx Lab.',
    },
    metricsBadge: '3D VIRTUAL TRY-ON · WEBCAM AR · UV 0–11',
  },
  {
    id: 'aether-acoustics',
    sku: 'TVT-3D-02',
    name: 'Aether Acoustics 3D v6.0',
    subtitle: {
      vi: 'Phòng Nghe 3D Ray-Traced Bắn Tia Âm, Lắp Gỗ Tán Âm QRD 3D & HRTF',
      en: 'Live 3D Ray-Traced Acoustic Chamber, Install 3D Oak QRD Diffusers & HRTF',
    },
    tagline: {
      vi: 'Phòng nghe 3D Ray-Traced 60fps: chùm tia âm phản xạ 3 bậc bắn thật từ loa dội tường, bản đồ sóng đứng dưới sàn, kéo loa/ghế trực tiếp trong 3D & click tường lắp tấm gỗ tán âm Oak QRD 3D giảm RT60 0.76s -> 0.32s.',
      en: '60fps 3D Ray-Traced Acoustic Chamber: volumetric 3-order reflected sound beams, live floor standing-wave heatmap, drag speakers/chair in 3D & click walls to mount physical 3D Oak QRD diffusers dropping RT60 from 0.76s to 0.32s.',
    },
    category: 'commerce-3d',
    categoryLabel: {
      vi: 'Bán Hàng 3D',
      en: '3D Commerce',
    },
    priceVnd: 1_690_000,
    originalPriceVnd: 2_790_000,
    priceUsd: 69,
    originalPriceUsd: 112,
    deliveryDaysMin: 3,
    deliveryDaysMax: 5,
    liveUrl: 'https://tvt987.github.io/aether-acoustics/',
    previewImage: './media/aether-acoustics.webp',
    featuredRank: 16,
    stack: ['.NET 10', 'Three.js Ray-Traced', '3D Oak QRD', 'Binaural HRTF'],
    deliverables: {
      vi: [
        'Phòng nghe 3D Ray-Traced hiển thị tia âm trực tiếp + phản xạ tường 2 bậc + sóng đứng áp suất dưới sàn',
        'Kéo thả loa & ghế nghe trực tiếp trong 3D (Cardas Sweet Spot) + Click tường lắp gỗ tán âm QRD & Bass Trap 3D',
        'Âm thanh Binaural HRTF Web Audio đổi sắc thái thật giữa phòng trần bê tông và phòng đã xử lý âm học',
        'Kèm sân khấu soi cận cảnh loa 3D PBR tách lớp CAD, khắc laser thân máy & tối ưu tải WebP/Lazy-Split',
      ],
      en: [
        '3D Ray-Traced Listening Chamber visualizing direct beams, 2-order wall bounces & floor standing-wave modes',
        'Direct 3D drag of speakers & listener chair (Cardas Sweet Spot) + click walls to mount 3D Oak QRD diffusers & bass traps',
        'Live Binaural HRTF Web Audio DSP shifting audibly between bare concrete and treated studio acoustics',
        'Includes sculptural 3D PBR speaker closeup, exploded CAD, laser chassis plaque & lazy-split bundle',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo .NET 10 + Phòng nghe 3D Three.js Ray-Traced, lắp tấm tán âm QRD 3D, Sabine RT60 & Web Audio HRTF.',
      en: 'Full-Stack .NET 10 monorepo combining Three.js 3D ray-traced acoustics, physical 3D QRD diffusers, Sabine RT60 & Web Audio HRTF.',
    },
    metricsBadge: '3D RAY-TRACED CHAMBER · OAK QRD · HRTF',
  },
  {
    id: 'lumina-medspa',
    sku: 'TVT-MED-03',
    name: 'Lumina MedSpa Clinic v4.0',
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
    priceVnd: 1_290_000,
    originalPriceVnd: 2_190_000,
    priceUsd: 52,
    originalPriceUsd: 89,
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
    name: 'Kinetix PropTech v4.0',
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
    priceVnd: 1_890_000,
    originalPriceVnd: 3_190_000,
    priceUsd: 76,
    originalPriceUsd: 129,
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
    priceVnd: 1_990_000,
    originalPriceVnd: 3_390_000,
    priceUsd: 79,
    originalPriceUsd: 135,
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
    name: 'Atelier Canvas Pro v6.0',
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
    priceVnd: 2_290_000,
    originalPriceVnd: 3_890_000,
    priceUsd: 92,
    originalPriceUsd: 155,
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
    name: 'Nexus Lake OLAP v5.0',
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
    priceVnd: 2_690_000,
    originalPriceVnd: 4_490_000,
    priceUsd: 109,
    originalPriceUsd: 179,
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
    name: 'Verdict Graph AI v6.0',
    subtitle: {
      vi: 'Canvas Kéo-Thả Agent 60fps, Tiêm Tấn Công Trên Dây, Breakpoint & Fork Race',
      en: 'Drag-and-Wire Multi-Agent Debugger, Edge Attack Injector, Breakpoints & Fork Race',
    },
    tagline: {
      vi: 'LangSmith × xyflow Visual Debugger: kéo-thả 7 node agent nối dây động 60fps, click dây tiêm Prompt Injection INJ-EXFIL-001 bị OWASP chặn 0B, đặt Red Breakpoint chỉnh sống State JSON & đua song song 2 nhánh Time-Travel Fork (-54% chi phí).',
      en: 'LangSmith × xyflow Visual Debugger: drag-and-rewire 7 agent nodes at 60fps, click any wire to inject Prompt Injection / 429 mid-flight deflected by OWASP Firewall (0B leak), toggle Red Breakpoints to edit live State JSON & race Dual Time-Travel Forks (-54% cost).',
    },
    category: 'saas-ai',
    categoryLabel: {
      vi: 'SaaS & AI',
      en: 'SaaS & AI',
    },
    priceVnd: 3_290_000,
    originalPriceVnd: 5_490_000,
    priceUsd: 132,
    originalPriceUsd: 219,
    deliveryDaysMin: 5,
    deliveryDaysMax: 8,
    liveUrl: 'https://tvt987.github.io/verdict-graph/',
    previewImage: './media/verdict-graph.webp',
    featuredRank: 6,
    stack: ['FastAPI', 'Drag-Wire AG-UI', 'OWASP Shield', 'Dual Fork Race'],
    deliverables: {
      vi: [
        'Canvas đa tác tử kéo-thả node 60fps kèm luồng gói tin AG-UI SSE / MCP 2.0 JSON-RPC bay thực tế trên dây',
        'Click thẳng vào dây nối để tiêm gói Prompt-Injection / 429 / Hallucination kiểm chứng tường lửa OWASP LLM10',
        'Đặt Red Breakpoint ● BP tạm dừng giữa luồng, chỉnh sống Agent State JSON & bấm Step Over hoặc Fork',
        'Đua song song 2 nhánh Time-Travel Fork (Main vs Guarded Cascade: -54% USD, +0.38 Groundedness)',
      ],
      en: [
        '60fps draggable multi-agent canvas with live AG-UI SSE & MCP 2.0 JSON-RPC packets traveling curved wires',
        'Click-edge mid-flight fault injector (Prompt Injection / 429 / Hallucination) testing OWASP LLM10 deflection',
        'Per-node Red Breakpoints pausing mid-flight with live editable State JSON & Step Over / Fork controls',
        'Side-by-side Dual-Branch Time-Travel Fork Race proving -54% USD cost & 0.99 groundedness lift',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo FastAPI chuẩn LangGraph × AG-UI: Canvas kéo-thả node, tiêm tấn công trên dây, OWASP LLM10 & Dual Fork Race.',
      en: 'Full-Stack FastAPI AI Ops monorepo uniting drag-and-wire AG-UI/MCP debugging, mid-flight OWASP LLM firewall & dual time-travel fork racing.',
    },
    metricsBadge: 'DRAG-WIRE DEBUGGER · OWASP · FORK RACE',
  },
  {
    id: 'aegispulse',
    sku: 'TVT-ENT-09',
    name: 'AegisPulse SRE v7.0',
    subtitle: {
      vi: 'Sàn Chaos-Scissors Cắt Dây Mạng 5 Vùng, Bầu Raft, Bão 500 Voucher & Jepsen DST',
      en: 'DST Chaos-Scissors 5-Region Cluster, Live Raft Partition, 500-Req Storm & Jepsen',
    },
    tagline: {
      vi: 'Sân chơi Chaos phân tán chuẩn TigerBeetle DST: cầm kéo Scissors click cắt dây mạng dựng tường Partition Wall 2v3, đánh sập/hồi sinh node, xả bão 500 voucher so sánh Naive nổ leak vs Redis Lua + ROWVERSION 0% rò rỉ, tua Jepsen Timeline & Hybrid RAG.',
      en: 'TigerBeetle-style DST Chaos Playground: click links with Chaos Scissors to sever 5 global regions with a live 2v3 Partition Wall, crash/revive nodes, blast 500-req voucher storms (Naive leaks vs Redis Lua 0% leak), scrub Jepsen Linearizability Timeline & Hybrid RAG.',
    },
    category: 'saas-ai',
    categoryLabel: {
      vi: 'SaaS & AI',
      en: 'SaaS & AI',
    },
    priceVnd: 3_490_000,
    originalPriceVnd: 5_490_000,
    priceUsd: 139,
    originalPriceUsd: 219,
    deliveryDaysMin: 5,
    deliveryDaysMax: 10,
    liveUrl: 'https://tvt987.github.io/aegispulse-distributed-sre/',
    previewImage: './media/aegispulse.webp',
    featuredRank: 5,
    stack: ['.NET 10', 'DST Chaos Scissors', 'Raft 5-Region', 'Redis Lua 0%'],
    deliverables: {
      vi: [
        'Sàn mô phỏng 5 vùng cụm phân tán 60fps: kéo Chaos Scissors cắt dây mạng, dựng tường Split-Brain 2v3 & bầu Raft',
        'Xả bão 500 voucher đồng thời đối chiếu trực quan Naive RMW nổ double-spend vs Redis Lua + ROWVERSION 0% rò rỉ',
        'Hệ thống Deterministic Simulation Testing (DST Seed phát lại 1:1) kèm thanh thời gian tuyến tính Jepsen 5 làn',
        'Kèm Hybrid RAG SRE, Rate-Limiter Lab, SQL Execution Plan & tư vấn kiến trúc thực chiến 700+ siêu thị',
      ],
      en: [
        '60fps 5-region distributed cluster arena: cut links with Chaos Scissors, trigger 2v3 Split-Brain & live Raft elections',
        'Blast 500-req concurrent voucher storms contrasting Naive RMW leak explosions vs Redis Lua + ROWVERSION 0% leak',
        'Deterministic Simulation Testing (editable DST Seed replay) with 5-track Jepsen Linearizability Time-Travel Scrubber',
        'Includes Hybrid RAG SRE, Rate-Limiter Lab, SQL Execution Plan & 700+ store architecture handover',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo .NET 10 kết hợp Deterministic Simulation Testing (DST), kéo Chaos Scissors, Raft 5 vùng & Hybrid RAG.',
      en: 'Full-Stack .NET 10 distributed SRE arena pairing Deterministic Simulation Testing (DST), Chaos Scissors, 5-region Raft & Hybrid RAG.',
    },
    metricsBadge: 'DST CHAOS SCISSORS · RAFT · HYBRID RAG',
  },
  {
    id: 'aurelia-resort',
    sku: 'TVT-HOSP-10',
    name: 'Aurelia Resort PMS v4.0',
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
    priceVnd: 2_190_000,
    originalPriceVnd: 3_690_000,
    priceUsd: 89,
    originalPriceUsd: 149,
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
    name: 'Velox EV Motors v7.0',
    subtitle: {
      vi: 'Lái Thử Hypercar 3D 320km/h, Đua Ghost Hologram 400m & Buồng Lái Velox OS',
      en: 'Playable 3D EV Test-Drive (320 km/h), 400m Hologram Ghost Race & Velox OS Cockpit',
    },
    tagline: {
      vi: 'Flagship 3D Chơi Thật: Lái trực tiếp chiếc xe vừa cấu hình (WASD/Bàn đạp) tới 320 km/h trên cao tốc ướt ban đêm, đua 0–400m với Ghost Hologram Taycan/Nevera, đĩa phanh gốm rực đỏ 850°C + Air-Brake +28°, 5 Hotspot 3D & buồng lái AR HUD.',
      en: 'Playable 3D Hypercar: Drive your exact build (WASD/Pedals) up to 320 km/h on a wet midnight highway, race a 3D Hologram Ghost (Taycan/Nevera), 850°C glowing ceramic rotors + Air-Brake, 5 3D Raycast Hotspots & live Velox OS AR Cockpit.',
    },
    category: 'commerce-3d',
    categoryLabel: { vi: 'Bán Hàng 3D & Nội Thất', en: '3D Commerce & Interior' },
    priceVnd: 2_990_000,
    originalPriceVnd: 4_990_000,
    priceUsd: 119,
    originalPriceUsd: 199,
    deliveryDaysMin: 4,
    deliveryDaysMax: 6,
    liveUrl: 'https://tvt987.github.io/velox-ev-motors/',
    previewImage: './media/velox-ev-motors.webp',
    previewBadge: '3D TEST DRIVE · GHOST RACE · VELOX OS',
    featuredRank: 1,
    stack: ['.NET 10', 'Three.js 3D Drive', 'Ghost Race', 'Velox OS AR'],
    deliverables: {
      vi: [
        'Lái thử 3D tương tác (WASD / Bàn đạp) tới 320 km/h, phanh gốm phát sáng 850°C, Air-Brake +28° & âm thanh 800V synth',
        'Đua Drag 0–400m thời gian thực với 3D Hologram Ghost đối thủ (Taycan Turbo GT / Rimac Nevera / Model S Plaid)',
        '5 điểm chạm Raycast 3D ngay trên thân xe + Buồng lái POV (AR HUD đồng bộ OLED 3D + Velox OS đổi đèn nội thất)',
        'Link chia sẻ cấu hình #build=, Xuất Poster 1600p + QR & đặt lịch lái thử chống trùng khung giờ (.NET 10)',
      ],
      en: [
        'Playable 60fps 3D Highway Test-Drive (WASD/Pedals to 320 km/h) with 850°C ceramic rotors, +28° Air-Brake & 800V audio',
        'Real-time 0–400m drag duel against a 3D Cyan Hologram Ghost (Taycan Turbo GT / Rimac Nevera / Model S Plaid)',
        '5 direct 3D Raycast Hotspots + interactive Cockpit POV (synced AR HUD, 3D OLED cluster & Velox OS ambient console)',
        'Shareable #build= URL, 1600p Bespoke Poster PNG + QR & .NET 10 idempotent showroom reservation lock',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo .NET 10 + Trải nghiệm lái thử 3D 60fps, đua Ghost Hologram 0–400m, buồng lái AR Velox OS & khóa đơn Idempotent.',
      en: 'Full-Stack .NET 10 flagship featuring playable 60fps 3D Test-Drive physics, 0–400m Hologram Ghost Race, Velox OS AR Cockpit & idempotent booking.',
    },
    metricsBadge: '3D TEST DRIVE · GHOST RACE · VELOX OS',
  },
  {
    id: 'solaris-academy',
    sku: 'TVT-EDU-12',
    name: 'Solaris Academy LMS v3.0',
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
    priceVnd: 1_390_000,
    originalPriceVnd: 2_390_000,
    priceUsd: 56,
    originalPriceUsd: 95,
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
    name: 'Kuro Omakase Hinoki v3.0',
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
    priceVnd: 1_190_000,
    originalPriceVnd: 1_990_000,
    priceUsd: 49,
    originalPriceUsd: 79,
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
    name: 'Vanguard Fitness Club v3.0',
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
    priceVnd: 990_000,
    originalPriceVnd: 1_690_000,
    priceUsd: 39,
    originalPriceUsd: 69,
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
    name: 'Meridian Logistics v4.0',
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
    priceVnd: 2_490_000,
    originalPriceVnd: 4_190_000,
    priceUsd: 99,
    originalPriceUsd: 169,
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
    name: 'CodaHR Payroll 2026 v4.0',
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
    priceVnd: 2_590_000,
    originalPriceVnd: 4_390_000,
    priceUsd: 105,
    originalPriceUsd: 175,
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
    name: 'Veritas Legal Studio v3.0',
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
    priceVnd: 1_290_000,
    originalPriceVnd: 2_190_000,
    priceUsd: 52,
    originalPriceUsd: 89,
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
    name: 'Nordic Home Atelier v3.0',
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
    priceVnd: 1_490_000,
    originalPriceVnd: 2_490_000,
    priceUsd: 59,
    originalPriceUsd: 99,
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
    name: 'Zenith Wealth FinTech v4.0',
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
    priceVnd: 2_790_000,
    originalPriceVnd: 4_690_000,
    priceUsd: 112,
    originalPriceUsd: 189,
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
    name: 'AeroForge 3D Twin v5.0',
    subtitle: {
      vi: 'Nhà Máy 3D Chạy Thật Khép Kín, Tia Lửa CNC, Đặt Vật Cản A* AGV & Robot IK',
      en: 'Playable Closed-Loop 3D Smart Factory: CNC Sparks, Click-to-Drop A* AGV Maze & 3D IK',
    },
    tagline: {
      vi: 'Siêu Phẩm Nhà Máy 3D Sống Động: Băng chuyền quay thật -> Robot 6 trục KR-60 gắp phôi IK -> Phay CNC 160 hạt tia lửa nóng sáng -> Camera AI Vision phát hiện nứt đẩy phế phẩm -> Click thẳng sàn đặt vật cản ép đội AGV tự né A* <1ms.',
      en: 'Live Closed-Loop 3D Factory: Spinning conveyor -> 6-axis KR-60 IK pick-and-place -> 5-axis CNC with 160 ballistic sparks -> AI Vision PIP micro-crack pneumatic reject -> Click floor to drop OSHA pallets forcing <1ms A* AGV rerouting.',
    },
    category: 'saas-ai',
    categoryLabel: { vi: 'SaaS & AI', en: 'SaaS & AI' },
    priceVnd: 3_990_000,
    originalPriceVnd: 6_690_000,
    priceUsd: 159,
    originalPriceUsd: 269,
    deliveryDaysMin: 6,
    deliveryDaysMax: 10,
    liveUrl: 'https://tvt987.github.io/aeroforge-digital-twin/',
    previewImage: './media/aeroforge-digital-twin.webp',
    previewBadge: 'LIVE CNC SPARKS · A* AGV MAZE · 3D IK',
    featuredRank: 2,
    stack: ['.NET 10', 'Three.js CNC Sparks', 'A* AGV Maze', '3D Robot IK'],
    deliverables: {
      vi: [
        'Chu trình sản xuất 3D khép kín 60fps: băng chuyền phôi -> Robot KR-60 IK gắp thật -> phay CNC 160 tia lửa -> Piston đẩy lỗi',
        'Tương tác trực tiếp trên sàn 3D: Click đặt pallet OSHA ép đội xe AGV vẽ lại đường A* 8 hướng <1ms (0 va chạm)',
        'Click điều khiển tay Robot 6 trục tới tọa độ 3D bất kỳ + Click máy xem HUD nổi, khói quá nhiệt FLIR & tiêm lỗi AI Vision',
        'Tích hợp trọn bộ Weibull RUL, tối ưu Pin BESS 3 khung giờ EVN (-28%), Six Sigma SPC Cpk & .NET 10 SCADA API',
      ],
      en: [
        '60fps closed-loop 3D production floor: moving conveyor -> KR-60 IK pick-and-place -> 160-spark CNC -> AI Vision pneumatic reject',
        'Direct 3D floor interaction: click to drop OSHA safety pallets triggering live <1ms 8-directional A* AGV rerouting',
        'Click-to-command 3D Robot IK reachability + click any machine for floating HUD, overheat smoke, FLIR & fault injection',
        'Includes Weibull RUL survival, EVN 3-tier BESS peak-shaving (-28%), Six Sigma SPC Cpk & .NET 10 SCADA API',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo .NET 10 SCADA + sàn nhà máy 3D chạy vòng lặp sản xuất thật, hạt tia lửa CNC, tìm đường A* AGV & động học ngược IK.',
      en: 'Full-Stack .NET 10 Industry 4.0 twin with live closed-loop 3D CNC sparks, real-time A* AGV obstacle rerouting & analytical 6-axis IK.',
    },
    metricsBadge: 'LIVE CNC SPARKS · A* AGV MAZE · 3D IK',
  },
  {
    id: 'helios-quant-terminal',
    sku: 'TVT-QNT-21',
    name: 'Helios Quant Terminal v5.0',
    subtitle: {
      vi: 'Bookmap Heatmap Thanh Khoản Cá Voi, Vẽ Fib/R:R Kéo Lệnh Trực Tiếp & Đấu Bot Quant',
      en: 'Bookmap L2 Liquidity Heatmap, Interactive Chart Drawing/R:R Trading & Live Algo Battle',
    },
    tagline: {
      vi: 'Sàn Quant Chuẩn TradingView × Bookmap: Bản đồ nhiệt thanh khoản L2 phát sáng tường Cá Voi & cảnh báo SPOOF PULL, bong bóng khớp lệnh Volume, vẽ Trendline/Fibonacci/khung Risk:Reward đặt lệnh 1-click, kéo thả đường Limit & Đấu Trường Bot trực tiếp.',
      en: 'TradingView × Bookmap Desk: Glowing L2 Whale Liquidity Heatmap + SPOOF PULL alerts, Volume Footprint bubbles, interactive Trendline/Fibonacci/Risk:Reward box with 1-click execution, draggable Limit lines & Live 3-Way Algo Battle Arena.',
    },
    category: 'enterprise-b2b',
    categoryLabel: { vi: 'Doanh Nghiệp, HR & FinTech', en: 'Enterprise, EdTech & FinTech' },
    priceVnd: 3_890_000,
    originalPriceVnd: 6_490_000,
    priceUsd: 155,
    originalPriceUsd: 259,
    deliveryDaysMin: 6,
    deliveryDaysMax: 10,
    liveUrl: 'https://tvt987.github.io/helios-quant-terminal/',
    previewImage: './media/helios-quant-terminal.webp',
    previewBadge: 'BOOKMAP HEATMAP · CHART R:R · ALGO BATTLE',
    featuredRank: 3,
    stack: ['FastAPI', 'Bookmap Heatmap', 'Chart R:R Trade', 'Live Algo Battle'],
    deliverables: {
      vi: [
        'Bookmap L2 Liquidity Heatmap 60fps: tường thanh khoản cá voi phát sáng, phát hiện SPOOF PULL & bong bóng khối lượng mua/bán',
        'Bộ công cụ vẽ TradingView-Pro ngay trên chart (Trendline, S/R, Fibonacci 7 mức, khung Long/Short R:R bấm thực thi lệnh thật)',
        'Kéo thả đường BUY/SELL LIMIT trực tiếp trên đồ thị + Thang lệnh 1-Click DOM Ladder đồng bộ sổ lệnh FIFO',
        'Đấu Trường Bot trực tiếp (YOU vs MM-Alpha vs Apex-Momentum) kèm đồ thị Equity 3 đường, VaR/CVaR & SABR Vol Smile (FastAPI)',
      ],
      en: [
        '60fps Bookmap L2 Liquidity Heatmap with glowing whale walls, SPOOF PULL detection & translucent volume trade bubbles',
        'TradingView-Pro chart toolbar (Trendline, S/R, 7-level Fibonacci, draggable Long/Short R:R box with 1-click execution)',
        'Directly draggable BUY/SELL LIMIT order lines on chart + 1-Click DOM ladder wired to deterministic FIFO LOB',
        'Live 3-Way Algo Battle Arena (YOU vs MM-Alpha vs Apex-Momentum) with live equity race, VaR/CVaR & SABR Vol Smile (FastAPI)',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo FastAPI kết hợp Bookmap L2 Heatmap, giao dịch kéo thả trực tiếp trên biểu đồ, Đấu Trường Bot Quant & VaR/SABR.',
      en: 'Full-Stack FastAPI quant desk uniting Bookmap L2 Liquidity Heatmap, direct-on-chart R:R trading, Live Algo Battle & VaR/SABR analytics.',
    },
    metricsBadge: 'BOOKMAP HEATMAP · CHART R:R · ALGO BATTLE',
  },
  {
    id: 'chronos-horology',
    sku: 'TVT-LUX-20',
    name: 'Chronos 3D Watch v4.0',
    subtitle: {
      vi: 'Bàn Chế Tác Tourbillon 3D: Lên Cót Núm, Kính Lúp 10× & Nam Châm 15.000G',
      en: 'Interactive 3D Watchmaker Bench: Wind Crown, 10× Loupe & 15,000G Magnet Lab',
    },
    tagline: {
      vi: 'Bàn Chế Tác Geneva 3D Tương Tác Thật: Vặn núm cót 3D lên dây 0→72h kèm tiếng bánh cóc Web Audio, bấm 2 nút Chronograph Flyback 3D, kéo kính lúp quang học 10× soi lồng Tourbillon 28,800 vph & kéo nam châm 15.000G 3D so sánh dây tóc Nivarox vs Silicon.',
      en: 'Interactive Geneva 3D Watchmaker Bench: Wind the fluted 3D crown (0→72h) with Web Audio ratchet clicks, press 3D Flyback Chronograph pushers, drag a 10× optical magnifying loupe over the 28,800 vph tourbillon & stress-test with a 3D 15,000G magnet.',
    },
    category: 'commerce-3d',
    categoryLabel: { vi: 'Bán Hàng 3D & Nội Thất', en: '3D Commerce & Interior' },
    priceVnd: 3_190_000,
    originalPriceVnd: 5_290_000,
    priceUsd: 129,
    originalPriceUsd: 212,
    deliveryDaysMin: 5,
    deliveryDaysMax: 8,
    liveUrl: 'https://tvt987.github.io/chronos-horology/',
    previewImage: './media/chronos-horology.webp',
    previewBadge: '3D WATCHMAKER BENCH · 10X LOUPE · 15,000G',
    featuredRank: 4,
    stack: ['.NET 10', 'Three.js 3D Watch', '10x Loupe', '15,000G Magnet'],
    deliverables: {
      vi: [
        'Tương tác cơ học 3D trực tiếp: vặn núm 3H lên dây cót 0→72h, bấm nút 2H/4H chạy Chronograph Flyback & tách 7 tầng máy',
        'Kính lúp quang học 10× APO kéo soi trực tiếp lồng Tourbillon 28.800 vph (2.6× phóng đại sắc nét trên WebGL)',
        'Phòng thử nam châm Neodymium 15.000 Gauss 3D kèm máy đo Witschi trực tiếp (Nivarox nhiễu đỏ vs Silicon Si-14 miễn nhiễm)',
        'Tùy biến 4 kim loại quý, khắc laser nắp đáy 3D, Collector Vault HMAC-SHA256 (.NET 10) & Chứng nhận COSC A4',
      ],
      en: [
        'Direct 3D mechanical interaction: wind 3H crown (0→72h), press 2H/4H Flyback Chronograph pushers & 7-layer explode scrubber',
        'Draggable 10× APO optical watchmaker loupe magnifying the live 28,800 vph tourbillon escapement at crisp 2.6× zoom',
        '3D 15,000 Gauss Neodymium magnet stress-test with live Witschi oscilloscope (Nivarox alarm vs Silicon Si-14 immunity)',
        '4 haute-horlogerie metals, live 3D caseback engraving, .NET 10 HMAC Vault & printable A4 COSC certificate',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo .NET 10 + Bàn chế tác Three.js 3D tương tác núm cót/Chronograph, kính lúp 10×, nam châm 15.000G & HMAC Vault.',
      en: 'Full-Stack .NET 10 haute-horlogerie bench with Three.js 3D crown/chronograph physics, 10× optical loupe, 15,000G magnet & HMAC Vault.',
    },
    metricsBadge: '3D WATCHMAKER BENCH · 10X LOUPE · 15,000G',
  },
  {
    id: 'orbitalflow-saas',
    sku: 'TVT-SAAS-23',
    name: 'OrbitalFlow B2B SaaS v4.0',
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
    priceVnd: 3_490_000,
    originalPriceVnd: 5_790_000,
    priceUsd: 139,
    originalPriceUsd: 232,
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
    name: 'VectraDoc AI RAG v4.0',
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
    priceVnd: 3_590_000,
    originalPriceVnd: 5_990_000,
    priceUsd: 145,
    originalPriceUsd: 239,
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
    name: 'FleetPulse GIS 3D v4.0',
    subtitle: {
      vi: 'Bản Sao Số Sài Gòn 3D Skyline, Drone Lạnh Bay Vượt Ngập & Bẻ Tuyến A* <1ms',
      en: 'Live 3D Saigon City Twin, Autonomous Cold-Chain Drones & Flood A* Reroute',
    },
    tagline: {
      vi: 'Trung tâm điều phối 3D deck.gl-style: Sài Gòn 3D (Landmark 81, Bitexco, cầu Ba Son), click thả mái vòm Ngập Mưa 3D ép xe tải lạnh bẻ tuyến A* <1ms & Drone tự hành cất cánh bay vòng cung vượt ngập cứu -60m SLA + khóa Drone Follow-Cam.',
      en: 'Live 3D deck.gl-style Saigon Digital Twin (Landmark 81, Bitexco, Ba Son Bridge): click roads to drop Monsoon Flood Domes forcing <1ms A* re-routing while autonomous cold-chain drones fly elevated 3D arcs over floods saving 60m SLA + Drone Follow-Cam.',
    },
    category: 'enterprise-b2b',
    categoryLabel: { vi: 'Doanh Nghiệp, HR & FinTech', en: 'Enterprise, Logistics & FinTech' },
    priceVnd: 3_690_000,
    originalPriceVnd: 6_190_000,
    priceUsd: 149,
    originalPriceUsd: 249,
    deliveryDaysMin: 6,
    deliveryDaysMax: 10,
    liveUrl: 'https://tvt987.github.io/fleetpulse-gis/',
    previewImage: './media/fleetpulse-gis.webp',
    previewBadge: '3D SAIGON DRONES · FLOOD A* <1MS · -18°C',
    featuredRank: 7,
    stack: ['.NET 10', 'Three.js 3D City', 'Drone Bypass', 'CVRP <1ms'],
    deliverables: {
      vi: [
        'Sài Gòn 3D Skyline tương tác 60fps: Landmark 81, Bitexco, cầu Ba Son, xe tải lạnh & 3 Drone tự hành bay cung 3D',
        'Click thả vùng Ngập Mưa / Kẹt Xe 3D ép xe bẻ tuyến A* <1ms + Drone cất cánh bay vòng cung vượt ngập cứu SLA',
        'Khóa Drone Follow-Cam / Street Chase bám sát trực tiếp phương tiện kèm HUD độ cao, nhiệt độ -18°C & chuyển 2D GIS',
        'Tích hợp trọn bộ CVRP -28.6%, chuỗi lạnh MKT USP <1079>, TCO xe điện 60 tháng & .NET 10 PostGIS/MQTT',
      ],
      en: [
        '60fps 3D Saigon Urban Twin (Landmark 81, Bitexco, Ba Son Bridge) with live refrigerated vans & 3 quadcopter drones',
        'Click roads to drop Monsoon Flood / Jam Hazard Domes forcing <1ms A* rerouting & elevated 3D drone air-bypass arcs',
        'Cinematic Drone Follow-Cam & Street Chase tracking with live altitude/-18°C HUD + 1-click 2D Vector GIS mode',
        'Includes CVRP -28.6% solver, USP <1079> Cold-Chain MKT, 60-mo EV TCO & .NET 10 PostGIS/MQTT API',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo .NET 10 + Bản sao số Sài Gòn 3D Three.js, Drone bay vượt ngập tự hành, A* CVRP <1ms & PostGIS/MQTT.',
      en: 'Full-Stack .NET 10 GIS twin pairing a Three.js 3D Saigon skyline, autonomous flood-bypass drones, <1ms A* CVRP & PostGIS/MQTT.',
    },
    metricsBadge: '3D SAIGON DRONES · FLOOD A* <1MS · -18°C',
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
    priceVnd: 3_690_000,
    originalPriceVnd: 6_190_000,
    priceUsd: 149,
    originalPriceUsd: 249,
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
