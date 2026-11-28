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
    name: 'Lumina MedSpa Clinic v5.0',
    subtitle: {
      vi: 'Hiệu Chuẩn Laser 3D Trên Gương Mặt & X-Ray Giải Phẫu 3 Tầng Da, Làm Lạnh Cryo & .NET 10',
      en: '60fps 3D Facial Laser Calibration & Dermal Layer X-Ray Cutaway, Cryo DCD & .NET 10',
    },
    tagline: {
      vi: 'Bản sao số Da liễu Thụy Sĩ 3D Three.js: chạm trực tiếp 5 vùng mặt Z1–Z5, bắn tia 532/755/1064nm kết hợp làm lạnh Cryogen -18°C, mở mặt cắt X-Ray 3 tầng da 2.6mm đo nhiệt trung bì & tái tạo Collagen theo thang Fitzpatrick I–VI.',
      en: '60fps Three.js Swiss Dermatology Twin: click facial zones Z1–Z5, fire 532/755/1064nm laser pulses with -18°C Cryogen DCD cooling, inspect 3-layer 2.6mm Dermal Depth X-Ray cutaway & calibrate Fitzpatrick I–VI thermal safety.',
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
    previewBadge: '.NET 10 · 3D FACIAL LASER · DERMAL X-RAY · CRYO',
    featuredRank: 20,
    stack: ['.NET 10', 'Three.js 3D Laser', 'Dermal X-Ray', 'Fitzpatrick Guard'],
    deliverables: {
      vi: [
        'Tượng gương mặt Alabaster 3D & tay cầm Laser khớp động bắn tia 532/755/1064nm + mặt cắt X-Ray 3 tầng da 2.6mm',
        'Cảnh báo an toàn nhiệt biểu bì theo sắc tố Fitzpatrick I–VI, hệ thống làm lạnh Cryogen -18°C & lộ trình 12 tuần',
        'Đặt lịch chọn bác sĩ, phòng máy Laser (Suite-409-B) khóa chống trùng slot (.NET 10 API, 175 CI tests) & VietQR',
        'Hồ sơ bệnh án Patient Vault, máy tính hoàn vốn CapEx máy Laser & tối ưu SEO Local Google Maps',
      ],
      en: [
        '60fps Three.js Alabaster facial twin & articulated laser handpiece firing 532/755/1064nm beams into 3-layer 2.6mm Dermal X-Ray',
        'Real-time Fitzpatrick I–VI thermal guard, -18°C Cryogen DCD cooling & 12-week clinical treatment roadmap',
        'Atomic suite & doctor slot locker (.NET 10 API, 175 CI tests), treatment bundle estimator & VietQR deposit',
        'Patient Vault dossier, Laser CapEx ROI lab & Local SEO schema markup',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo .NET 10 + Hiệu chuẩn Laser 3D Three.js, mặt cắt X-Ray 3 tầng da, cảnh báo Fitzpatrick I–VI & khóa phòng chống đặt trùng.',
      en: 'Full-Stack .NET 10 clinic monorepo pairing Three.js 3D facial laser physics, 3-layer dermal X-Ray, Fitzpatrick safety guard & atomic slot lock.',
    },
    metricsBadge: '.NET 10 · 3D FACIAL LASER · DERMAL X-RAY · CRYO',
  },
  {
    id: 'kinetix-proptech',
    sku: 'TVT-PROP-04',
    name: 'Kinetix PropTech v5.0',
    subtitle: {
      vi: 'Tháp Saigon Sky-Tower 3D & Tàu Metro Line-1, Bóng Nắng 06–18h, X-Ray BIM & Escrow 409',
      en: '60fps 3D Saigon Sky-Tower & Metro Line-1 Twin, Tropical Sun Shadows, X-Ray BIM & Escrow 409',
    },
    tagline: {
      vi: 'Tòa tháp Thủ Thiêm 28 tầng 3D Three.js PBR ven sông Sài Gòn cùng tàu Metro Line-1 chạy thật: click từng căn hộ trên mặt dựng xem tầm nhìn ban công, kéo bóng nắng 06:00→17:30 đo bức xạ nhiệt kW/m², bật X-Ray BIM lõi tháp & khóa ký quỹ HTTP 409.',
      en: '60fps Three.js PBR 28-story Thủ Thiêm Saigon Sky-Tower with animated Metro Line-1 viaduct train: click 3D apartment units directly on the facade for Balcony POV & solar heat gain (06:00→17:30 shadows), toggle X-Ray BIM Floorplate & lock Escrow (HTTP 409).',
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
    previewBadge: '.NET 10 · 3D SAIGON TOWER · METRO · X-RAY BIM',
    featuredRank: 15,
    stack: ['.NET 10', 'Three.js 3D Tower', 'Metro + X-Ray BIM', 'Escrow 409'],
    deliverables: {
      vi: [
        'Tòa tháp 28 tầng 3D ven sông Sài Gòn + cầu Ba Son + tàu Metro Line-1 chạy thật 60fps & click chọn từng căn hộ trực tiếp',
        'Thanh trượt hướng nắng nhiệt đới 06:00→17:30 đổ bóng thực tế, tính bức xạ nhiệt kW/m² & % che bóng ban công từng căn',
        '3 góc máy 3D (Xoay Tháp, Góc Nhìn Ban Công POV, X-Quang Lõi & Mặt Bằng BIM) + bản đồ Metro 6 quận & máy tính lãi vay',
        'Khóa ký quỹ chống trùng cọc HTTP 409 (.NET 10 API, 151 CI tests), VietQR & hồ sơ đầu tư PDF A4 song ngữ VI/EN',
      ],
      en: [
        '60fps Three.js 28-story Thủ Thiêm Sky-Tower with Ba Son Bridge, live gliding Metro Line-1 train & direct 3D raycast unit picking',
        'Real-time 06:00→17:30 Saigon solar-path shadows computing exact unit heat gain (kW/m²) & balcony shade percentage',
        'Orbit Tower, Balcony POV & X-Ray BIM Floorplate modes + 6-district Metro yield map & 10-year IRR/mortgage simulator',
        'Idempotent HTTP 409 Escrow Lock (.NET 10 API, 151 CI tests), VietQR deposit & printable A4 bilingual investor dossier',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo .NET 10 + Tòa tháp Sài Gòn 3D Three.js, tàu Metro Line-1, bóng nắng thực 06–18h, X-Ray BIM & khóa Escrow 409.',
      en: 'Full-Stack .NET 10 PropTech twin pairing a Three.js 28-story Saigon Sky-Tower, Metro Line-1 train, tropical solar shadows, X-Ray BIM & HTTP 409 escrow.',
    },
    metricsBadge: '.NET 10 · 3D SAIGON TOWER · METRO · X-RAY BIM',
  },
  {
    id: 'pulse-pos-fnb',
    sku: 'TVT-POS-05',
    name: 'PulsePOS F&B v5.0',
    subtitle: {
      vi: 'Sàn Roastery Café 3D Đầy Nắng, Vòng Cung Ticket Bay Vào KDS, Rush-Hour +3x & Barista POV',
      en: '60fps 3D Sunlit Specialty Roastery Floor, Flying KDS Ticket Arcs, Rush-Hour Surge & Barista POV',
    },
    tagline: {
      vi: 'Sàn Roastery Café 3D Three.js tràn ngập ánh sáng với máy Espresso đồng 3-group nhả khói thật: click bàn T01–T08 bắn vòng cung Order Ticket bay thẳng vào quầy KDS 2-tab, bật bão Rush-Hour (+3x) xem hàng chờ Erlang-C, thêm Barista (+1) & góc nhìn Barista POV.',
      en: '60fps Three.js Sunlit Specialty Roastery Floor with gleaming Copper Espresso Machine & rising steam: click tables T01–T08 to launch glowing 3D Order Ticket Arcs straight into the live 2-tab KDS pass, trigger Rush-Hour Surge (+3x), scale Baristas live & switch to Barista POV.',
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
    previewBadge: '.NET 10 · 3D ROASTERY · FLYING KDS ARCS · POV',
    featuredRank: 13,
    stack: ['.NET 10', 'Three.js 3D Roastery', 'Flying KDS Arcs', 'Erlang-C + 409'],
    deliverables: {
      vi: [
        'Sàn Roastery 3D Three.js ánh sáng tự nhiên với 8 bàn tương tác T01–T08, máy Espresso đồng nhả khói & màn KDS trực tiếp',
        'Click bàn bắn vòng cung 3D Order Ticket bay sang quầy pha chế/bánh ngọt + đồng bộ 2 tab POS ↔ KDS (<50ms)',
        'Mô phỏng Rush-Hour Surge (+3x) tính thời gian chờ Erlang-C, áp suất 9.0 bar, thêm Barista (+1) & góc nhìn Barista POV',
        'Khóa tồn kho nguyên tử HTTP 409 khi hết bánh, ma trận lợi nhuận Menu BCG, tách bill, VietQR & .NET 10 API (166 CI)',
      ],
      en: [
        '60fps Three.js sunlit roastery floor with 8 clickable tables T01–T08, steaming copper espresso bar & live KDS pass monitor',
        'Direct 3D Bezier Order Ticket Arcs flying from tables into Espresso/Bakery stations + live 2-tab BroadcastChannel POS↔KDS',
        'Rush-Hour Surge (+3x) with live Erlang-C wait telemetry, 9.0 bar pressure, +1 Barista scaling & behind-the-bar Barista POV',
        'Atomic 409 Out-of-Stock lock, Menu BCG Profitability Matrix, split bills, VietQR & .NET 10 backend (166 CI tests)',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo .NET 10 + Sàn Roastery 3D Three.js, vòng cung Order Ticket bay thẳng vào KDS 2-tab, Erlang-C & trừ kho Atomic 409.',
      en: 'Full-Stack .NET 10 hospitality POS pairing a Three.js 3D sunlit roastery floor, flying KDS ticket arcs, Erlang-C queue telemetry & atomic 409 stock.',
    },
    metricsBadge: '.NET 10 · 3D ROASTERY · FLYING KDS ARCS · POV',
  },
  {
    id: 'atelier-canvas',
    sku: 'TVT-SAAS-06',
    name: 'Atelier Canvas Pro v7.0',
    subtitle: {
      vi: 'WebGL2 GLSL Shaders Trực Tiếp, Tách Tầng 3D Z-Stack 80%, WCAG AAA 16/16 & .NET 10',
      en: 'Live 60fps WebGL2 GLSL Shader Fills, 3D Z-Stack Exploder, WCAG AAA 16/16 Repair & .NET 10',
    },
    tagline: {
      vi: 'Studio thiết kế cấp Figma × Paper Shaders: 4 nền WebGL2 GLSL chạy 60fps (Mesh Warp, Liquid Iridescence, Dot-Orbit, Liquid Glass), tách tầng 3D Z-Stack (80% depth) xoay & click lớp trực tiếp, sửa WCAG AAA 16/16 1-click & sinh mã GLSL/React 19/SwiftUI.',
      en: 'Figma × Paper Shaders studio: 4 live 60fps WebGL2 GLSL shader fills (Mesh Warp, Liquid Iridescence, Dot-Orbit, Liquid Glass), interactive 3D Z-Stack layer exploder (80% depth), 1-click WCAG AAA 16/16 repair & diff-highlighted GLSL/React 19/SwiftUI codegen.',
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
    stack: ['.NET 10', 'WebGL2 GLSL Shaders', '3D Z-Stack', 'WCAG AAA + SwiftUI'],
    deliverables: {
      vi: [
        '4 bộ Procedural WebGL2 GLSL ES 3.00 Shader chạy 60fps trực tiếp bên trong khung Artboard (chỉnh Speed/Warp/Iridescence)',
        'Tách tầng 3D Z-Stack Exploder (Z+0 Shader -> Z+120 Type & CTA) cho phép xoay góc nghiêng & click từng tầng thiết kế',
        'Live Component Sandbox 5 trạng thái + sửa độ tương phản WCAG AAA 16/16 1-click kèm đồng bộ cộng tác 2 tab',
        'Xuất trực tiếp mã nguồn GLSL ES 3.00, React 19 + Tailwind v4, SwiftUI & .NET 10 Optimistic Lock API',
      ],
      en: [
        '4 live 60fps WebGL2 GLSL ES 3.00 procedural shader fills directly inside hero artboards with real-time uniforms',
        'Interactive 3D Z-Stack Layer Exploder (Z+0 Shader to Z+120 CTA) with 3D orbit tilt & clickable layer inspection',
        '5-state Live Component Sandbox with 1-click WCAG AAA 16/16 auto-repair & 2-tab BroadcastChannel collab',
        'Diff-highlighted GLSL ES 3.00, React 19 + Tailwind v4 & SwiftUI codegen backed by .NET 10 Optimistic Lock API',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo .NET 10 kết hợp WebGL2 GLSL Shader Studio, 3D Z-Stack Exploder, tự sửa WCAG AAA 16/16 & cộng tác 2 tab.',
      en: 'Full-Stack .NET 10 design studio pairing live WebGL2 GLSL shader fills, 3D Z-Stack layer exploder, WCAG AAA 16/16 repair & 2-tab collab.',
    },
    metricsBadge: '.NET 10 · GLSL SHADERS · 3D Z-STACK · WCAG AAA',
  },
  {
    id: 'nexus-lake',
    sku: 'TVT-DATA-07',
    name: 'Nexus Lake OLAP v6.0',
    subtitle: {
      vi: 'GPU 100K Điểm Khoanh Lasso→SQL DuckDB-WASM, Khối 3D OLAP, Luồng Kafka CDC Drift & FastAPI MCP',
      en: 'GPU 100K-Row Direct Lasso→SQL DuckDB-WASM, 3D Anomaly Cube, Live Kafka CDC Drift & FastAPI MCP',
    },
    tagline: {
      vi: 'Kho phân tích OLAP chuẩn Hex × MotherDuck: vẽ 101.800+ điểm GPU 60fps, khoanh Box/Freehand Lasso tự sinh & chạy SQL thật trên DuckDB-WASM (<3ms), xoay Khối Lập Phương 3D OLAP & tiêm lỗi Schema Drift trên ống Kafka CDC bị chốt dbt-test bắt vào DLQ (0% nhiễm Gold).',
      en: 'Hex × MotherDuck OLAP workbench: 60fps GPU 101,800+ point explorer, direct Box & Freehand Lasso brush auto-generating AST-guarded DuckDB-WASM SQL (<3ms), rotating 3D Anomaly Cube & animated Kafka CDC stream catching Schema Drift into Quarantine DLQ (0 Gold corruption).',
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
    stack: ['FastAPI + MCP', 'DuckDB-WASM', '100K GPU Lasso', 'Kafka CDC + DLQ'],
    deliverables: {
      vi: [
        'Khám phá 101.800+ bản ghi thời gian thực trên Canvas GPU 60fps (<3ms truy vấn lưới không gian)',
        'Khoanh vùng Box & Freehand Lasso tự động sinh câu lệnh WHERE SQL bảo vệ bởi AST Guard và chạy thật trên DuckDB-WASM',
        'Khối Lập Phương 3D OLAP xoay tương tác + luồng Kafka CDC (+12.5K/s) Bronze -> Silver -> dbt-test Gate -> Gold',
        'Nút Inject Schema Drift bắn bản ghi lỗi đỏ bị chốt dbt-test chặn 100% vào Quarantine DLQ + FastAPI MCP Server',
      ],
      en: [
        '60fps GPU 101,800+ row anomaly explorer with sub-3ms spatial grid indexing inside the browser',
        'Direct Box & Freehand Lasso brush auto-generating AST-guarded WHERE SQL executed live on DuckDB-WASM',
        'Rotating 3D OLAP Anomaly Cube + live Kafka CDC (+12.5K/s) Medallion pipeline with dbt-test SLA gate',
        'Live Inject Schema Drift catching crimson malformed droplets into Quarantine DLQ (0 Gold leaks) + FastAPI MCP',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo FastAPI + MCP với DuckDB-WASM 100K điểm GPU Lasso-to-SQL, khối 3D OLAP, luồng Kafka CDC & lá chắn SQL AST.',
      en: 'Full-Stack FastAPI + MCP lakehouse with 100K-row GPU Lasso-to-SQL DuckDB-WASM, 3D OLAP cube, live Kafka CDC drift quarantine & SQL AST guard.',
    },
    metricsBadge: 'FASTAPI MCP · 100K GPU LASSO · 3D OLAP · KAFKA CDC',
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
    name: 'Aurelia Resort PMS v5.0',
    subtitle: {
      vi: 'Vịnh Bãi Kem Phú Quốc 3D Sóng Biển Thật, 6 Ocean Villa, Hoàng Hôn Đỏ & Đèn Lồng 2700K',
      en: '60fps 3D Phu Quoc Ocean Cove, Clickable Infinity Villas, Crimson Sunset Shader & 2700K Lanterns',
    },
    tagline: {
      vi: 'Bản sao số vịnh Bãi Kem Phú Quốc 3D Three.js với shader sóng biển ngọc bích thật: click 6 biệt thự bể bơi vô cực xem góc nhìn biển, kéo giờ nắng Trưa Ngọc Bích → Hoàng Hôn Đỏ Phú Quốc 17:45 → Đêm Đèn Lồng 2700K, chế độ Terrace POV & khóa phòng 409 tiết kiệm 18% phí OTA.',
      en: '60fps Three.js Bãi Kem Phú Quốc coastal twin with custom animated ocean shader: click 6 infinity-pool villas for Ocean Sightline & RevPAR, scrub 13:00 Turquoise Noon → 17:45 Crimson Sunset → 20:30 Starlit 2700K Lanterns, switch to Terrace POV & lock direct reservations (HTTP 409, -18% OTA).',
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
    previewBadge: '.NET 10 · 3D PHU QUOC COVE · SUNSET SHADER · 409',
    featuredRank: 10,
    stack: ['.NET 10', 'Three.js 3D Cove', 'Ocean Sunset Shader', 'RevPAR + 409'],
    deliverables: {
      vi: [
        'Vịnh Bãi Kem Phú Quốc 3D Three.js sóng biển shader thật, bãi cát lưỡi liềm, cầu tàu gỗ, du thuyền & 6 biệt thự bể bơi vô cực',
        'Thanh trượt bầu trời & đèn lồng 06:30→20:30 (Hoàng Hôn Đỏ 17:45, Đêm Đèn Lồng 2700K phản chiếu mặt nước) & sóng biển động',
        'Click chọn biệt thự 3D đo Ocean Sightline, RevPAR, tiền tiết kiệm 18% hoa hồng OTA & chế độ Terrace POV ngay mép hồ bơi',
        'Khóa phòng chống trùng lịch HTTP 409 (.NET 10 API, 166 CI tests), VietQR cọc trực tiếp, thẻ VIP QR & lịch .ics',
      ],
      en: [
        '60fps Three.js Bãi Kem Phú Quốc cove with custom GLSL ocean waves, crescent beach, teak pier, catamaran & 6 infinity villas',
        '06:30→20:30 Solar & Lantern Scrubber (17:45 Crimson Sunset & automatic 2700K underwater pool/pier lanterns) + breeze toggle',
        'Direct 3D raycast villa selection showing Ocean Sightline, Nightly RevPAR, 18% OTA savings & eye-level Infinity Terrace POV',
        'Overlap-proof HTTP 409 villa reservation lock (.NET 10 API, 166 CI tests), direct VietQR deposit, VIP QR pass & .ics export',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo .NET 10 + Vịnh Phú Quốc 3D Three.js, shader sóng biển Hoàng Hôn/Đèn Lồng 2700K, RevPAR Studio & khóa phòng 409.',
      en: 'Full-Stack .NET 10 Resort PMS pairing a Three.js 3D Phu Quoc ocean cove, animated sunset/lantern shader, RevPAR engine & HTTP 409 locking.',
    },
    metricsBadge: '.NET 10 · 3D PHU QUOC COVE · SUNSET SHADER · 409',
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
    name: 'Solaris Academy LMS v4.0',
    subtitle: {
      vi: 'Sa Bàn Kiến Trúc Phân Tán 5 Tầng 3D, Bão Cache Stampede, 1-Click Auto-Scale & FastAPI AST',
      en: '60fps 3D 5-Tier Distributed Architecture Sandbox, Cache Stampede Chaos, Auto-Scale & FastAPI AST',
    },
    tagline: {
      vi: 'Sa bàn kiến trúc Cloud 5 tầng 3D Three.js (Edge CDN → API GW → App Cluster → Redis Cache → Sharded DB): kéo tải 1K–100K RPS, click tủ rack nâng +1 blade, tiêm bão Cache Stampede đỏ rực & bấm 1-Click Auto-Scale phục hồi P99 <22ms kèm trình chấm code AST 0-eval.',
      en: '60fps Three.js 5-Tier Distributed Cloud Sandbox (Edge CDN → API GW → App Cluster → Redis Cache → Sharded DB): scrub 1K–100K RPS, click racks to add blades, inject Cache Stampede chaos & trigger 1-Click Auto-Scale (<22ms P99) plus zero-eval AST grader & SM-2 flashcards.',
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
    previewBadge: 'FASTAPI · 3D CLOUD TOPOLOGY · CACHE STAMPEDE · AST',
    featuredRank: 18,
    stack: ['FastAPI', 'Three.js 3D Topology', 'Zero-Eval AST', 'SM-2 + Oxford UI'],
    deliverables: {
      vi: [
        'Sa bàn kiến trúc phân tán 5 tầng 3D 60fps với luồng gói tin HTTP, tiêm bão Cache Stampede/DB Failover & 1-Click Auto-Scale',
        '6 lộ trình khóa học công nghệ + Trình chấm code thực hành dùng bộ thông dịch AST an toàn (0 eval / 144 CI tests)',
        'Bộ thẻ Flashcard lặp lại ngắt quãng SM-2 & trực quan hóa thuật toán Binary Search/QuickSort/Dijkstra',
        'Cấp chứng chỉ hoàn thành PDF A4 kèm mã xác thực băm HMAC + QR & giỏ khóa học VietQR',
      ],
      en: [
        '60fps Three.js 5-tier distributed architecture sandbox with animated HTTP packets, Cache Stampede chaos & 1-Click Auto-Scale',
        '6 flagship tracks + custom zero-eval AST sandbox interpreter with automated unit test grading (144 CI tests)',
        'SM-2 spaced-repetition flashcard trainer & interactive Binary Search / QuickSort / Dijkstra visualizer',
        'HMAC-verifiable SVG/A4 PDF completion certificates + course bundle VietQR checkout',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo FastAPI + Sa bàn Cloud 5 tầng 3D Three.js, trình chấm code Zero-Eval AST, Algo Visualizer & giao diện Oxford UI.',
      en: 'Full-Stack FastAPI EdTech monorepo pairing a Three.js 3D 5-tier distributed topology sandbox, zero-eval AST grader & Oxford UI.',
    },
    metricsBadge: 'FASTAPI · 3D CLOUD TOPOLOGY · CACHE STAMPEDE · AST',
  },
  {
    id: 'kuro-omakase',
    sku: 'TVT-FINE-13',
    name: 'Kuro Omakase Hinoki v4.0',
    subtitle: {
      vi: 'Quầy Gỗ Hinoki Kyoto 14 Ghế 3D, Macro Nigiri Ủ Jukusei 1–14 Ngày & Khò Than Binchōtan 3D',
      en: '60fps 3D Kyoto Hinoki 14-Seat Counter, Macro Jukusei Nigiri, Binchotan Ember Sear & Anti-Orphan',
    },
    tagline: {
      vi: 'Quầy Omakase gỗ Kiso Hinoki Kyoto 14 ghế 3D Three.js PBR: click chọn từng ghế S01–S14 kiểm định tầm nhìn Bếp trưởng & chống ghế lẻ, phóng cận Macro Nigiri 3D trượt ủ Jukusei Ngày 1→14, bấm khò than Binchōtan bắn 140 tàn lửa 3D + âm thanh cháy xèo & khóa ghế HTTP 409.',
      en: '60fps Three.js PBR 14-seat Kiso Hinoki Kyoto counter: click stools S01–S14 directly in 3D with Chef Blade Sightline & Anti-Orphan 409 lock, switch to Macro Nigiri to scrub Day 1→14 Jukusei dry-aging & fire Binchōtan Torch Sear unleashing glowing 3D embers + aromatic smoke.',
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
    previewBadge: '.NET 10 · 3D HINOKI 14-SEAT · BINCHOTAN SEAR',
    featuredRank: 21,
    stack: ['.NET 10', 'Three.js 3D Hinoki', 'Jukusei + Binchotan', '14-Seat 409'],
    deliverables: {
      vi: [
        'Quầy gỗ Kiso Hinoki Kyoto chữ L 14 ghế 3D PBR kèm vách Shoji phát sáng, rèm Noren chàm & bộ bình gốm Sake',
        'Click từng ghế 3D S01–S14 đo góc nhìn Bếp trưởng (98% Front-Row), kiểm luật chống ghế lẻ Anti-Orphan & khóa ghế HTTP 409',
        'Chế độ Macro Nigiri 3D (Ōtoro / Uni / Nodoguro / Kohada): trượt ủ Jukusei Ngày 1→14 & bấm Khò Than Binchōtan bắn tàn lửa 3D',
        'Góc nhìn Seat #7 Chef POV, chế độ sáng Warm Washi, ghép cặp Sake/dị ứng, VietQR cọc 30% & .NET 10 API (153 CI tests)',
      ],
      en: [
        '60fps Three.js PBR L-shaped Kiso Hinoki 14-seat counter with backlit Shoji lattice, Indigo Noren & Bizen ceramic sake vessels',
        'Direct 3D stool clicking (S01–S14) with Chef Blade Sightline (98% Front-Row), Anti-Orphan validation & HTTP 409 seat lock',
        'Macro 3D Edomae Nigiri (Ōtoro / Uni / Nodoguro / Kohada) with Day 1→14 Jukusei scrubber & 140-spark Binchōtan Torch Sear',
        'Seat #7 Chef POV, Kyoto Night & Warm Washi atmospheres, Sake/Allergen lab, VietQR deposit & .NET 10 API (153 CI tests)',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo .NET 10 + Quầy Hinoki Kyoto 14 ghế 3D Three.js, cận cảnh Macro Nigiri ủ Jukusei, khò than Binchōtan & chống ghế lẻ 409.',
      en: 'Full-Stack .NET 10 fine-dining twin pairing a Three.js 3D Kyoto Hinoki 14-seat counter, Macro Jukusei Nigiri, Binchōtan ember sear & 409 anti-orphan lock.',
    },
    metricsBadge: '.NET 10 · 3D HINOKI 14-SEAT · BINCHOTAN SEAR',
  },
  {
    id: 'vanguard-fitness',
    sku: 'TVT-FIT-14',
    name: 'Vanguard Fitness Club v4.0',
    subtitle: {
      vi: 'Vận Động Viên Sinh Trắc 3D, Đốt Lactate Z5 & Phác Đồ Deload Tự Động ACWR .NET 10',
      en: '60fps 3D Bio-Telemetry Kinematic Runner, VO2/Lactate Strain & Auto-Deload ACWR .NET 10',
    },
    tagline: {
      vi: 'Vận động viên chạy bộ 3D Three.js gắn cảm biến sinh trắc học theo thời gian thực: đẩy công suất 100W→380W (Z5 VO2max Redline, 8.4mM Lactate), tiêm quá tải ACWR 1.65 phát sáng nhóm cơ nguy hiểm & bấm Prescribe Deload phục hồi HRV 94% tức thì.',
      en: '60fps Three.js articulated bio-telemetry runner on a force-plate treadmill: drive 100W→380W (Z5 VO2max, 8.4mM Lactate), inject ACWR 1.65 overtraining illuminating crimson muscle strain rings & prescribe Autonomic Deload rebounding HRV to 94%.',
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
    previewBadge: '.NET 10 · 3D BIO-ATHLETE · LACTATE · DELOAD',
    featuredRank: 22,
    stack: ['.NET 10', 'Three.js 3D Athlete', 'Lactate + ACWR', 'FIFO Waitlist'],
    deliverables: {
      vi: [
        'Vận động viên 3D Kinematic chạy trên thảm đo lực với chế độ Bio X-Ray & Side Gait Cam, click soi từng nhóm cơ (SmO2/Impact)',
        'Mô phỏng quá tải chấn thương ACWR 1.65 & phác đồ Deload tự động + máy tính Mifflin-St Jeor & đồ thị chuyển hóa 12 tuần',
        'Lịch lớp HIIT, Reformer Pilates, Strength & Recovery với khóa suất trống + xếp hàng chờ FIFO (.NET 10 API, 162 CI tests)',
        'Thẻ hội viên Obsidian QR, xuất lộ trình tập luyện PDF A4 & thanh toán VietQR',
      ],
      en: [
        '60fps Three.js kinematic runner with Bio X-Ray & Side Gait Cam, clickable muscle telemetry (SmO2, lactate clearance, G-impact)',
        'Live ACWR 1.65 overtraining injection & 1-click Autonomic Deload + Mifflin-St Jeor BMR/TDEE & 12-week projection',
        'Live weekly class schedule with real-time seat counters, automatic FIFO waitlist (.NET 10 API, 162 CI tests) & .ics export',
        'Digital QR Member Pass, printable A4 training blueprint & live VietQR settlement',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo .NET 10 + Vận động viên sinh trắc 3D Three.js, chu kỳ 12 tuần, hàng chờ FIFO tự động & cảnh báo quá tải ACWR.',
      en: 'Full-Stack .NET 10 club platform pairing a Three.js 3D bio-telemetry runner, 12-week periodization, atomic FIFO waitlist & ACWR guard.',
    },
    metricsBadge: '.NET 10 · 3D BIO-ATHLETE · LACTATE · DELOAD',
  },
  {
    id: 'meridian-logistics',
    sku: 'TVT-LOG-15',
    name: 'Meridian Logistics v5.0',
    subtitle: {
      vi: 'Cảng Nước Sâu 3D & Cẩu Giàn STS Khớp Động, Tàu Nghiêng SOLAS VGM, Auto-Trim & .NET 10',
      en: '60fps 3D Deep-Water Port & Articulated STS Gantry Cranes, Hydrostatic SOLAS Heel/GM & .NET 10',
    },
    tagline: {
      vi: 'Cảng nước sâu Cái Mép 3D Three.js PBR với 2 cẩu giàn STS khớp động bốc container 40ft/Reefer/Hazmat lên tàu 14.000 TEU: bơm lệch tải mạn phải làm thân tàu nghiêng thật +7.9° (SOLAS CRITICAL), bấm Auto-Trim cân bằng lại 0.0° (GM 2.98m) + bản đồ hải trình & thuế EVFTA.',
      en: '60fps Three.js PBR Cái Mép Deep-Water Port with 2 articulated STS Gantry Cranes hoisting 40ft Dry/Reefer/Hazmat boxes onto a 14,000-TEU ship: inject starboard imbalance to visibly heel the vessel +7.9° (SOLAS CRITICAL), trigger Auto-Trim to level 0.0° (GM 2.98m) + Incoterms & EVFTA.',
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
    previewBadge: '.NET 10 · 3D STS PORT · SOLAS HEEL/GM · AUTO-TRIM',
    featuredRank: 9,
    stack: ['.NET 10', 'Three.js 3D Port', 'STS Crane + SOLAS', 'EVFTA + Incoterms'],
    deliverables: {
      vi: [
        'Cảng nước sâu 3D Three.js PBR với tàu 14.000 TEU nổi bồng bềnh thật & 2 cẩu giàn STS khớp động 8 pha cẩu xếp container',
        'Click thẳng vào khoang tàu 3D để cẩu container 40ft Dry / Reefer (-18°C) / Hazmat & theo dõi đồng hồ nghiêng SOLAS VGM / GM',
        'Nút Inject Starboard Imbalance làm tàu nghiêng +7.9° báo động đỏ + nút Auto-Trim Ballast & Stow tự xếp lại cân bằng 0.0°',
        'Góc nhìn Cabin Cẩu STS POV, bão biển Suez Storm, bản đồ hải trình SVG, Incoterms 2020, thuế EVFTA & .NET 10 API (177 CI)',
      ],
      en: [
        '60fps Three.js PBR deep-water quay with floating 14,000-TEU vessel & 2 articulated 8-phase STS Gantry Cranes hoisting boxes',
        'Direct 3D bay clicking to dispatch 40ft Dry / Reefer (-18°C) / Hazmat loads updating live SOLAS VGM, 3D CG & GM stability',
        'Inject Starboard Imbalance heeling ship +7.9° (SOLAS CRITICAL) + 1-click Auto-Trim Ballast & Stow leveling back to 0.0°',
        'Crane Cabin POV, Suez Storm sea state, Global Sea-Lane SVG, Incoterms 2020, EVFTA customs & .NET 10 API (177 CI tests)',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo .NET 10 + Cảng nước sâu 3D Three.js, cẩu giàn STS khớp động, vật lý nghiêng tàu SOLAS VGM/GM & biểu thuế EVFTA.',
      en: 'Full-Stack .NET 10 freight control tower pairing a Three.js 3D deep-water port, articulated STS gantry cranes, hydrostatic SOLAS heel/GM & EVFTA.',
    },
    metricsBadge: '.NET 10 · 3D STS PORT · SOLAS HEEL/GM · AUTO-TRIM',
  },
  {
    id: 'coda-hr-payroll',
    sku: 'TVT-HR-16',
    name: 'CodaHR Payroll 2026 v5.0',
    subtitle: {
      vi: 'Địa Cầu Bảng Lương Toàn Cầu 3D, Tháp ESOP 48 Tháng, EOR vs B2B & Luật 109/2025 .NET 10',
      en: '60fps 3D Global Payroll Corridor Globe, 48M ESOP Monolith, EOR vs B2B & Law 109/2025 .NET 10',
    },
    tagline: {
      vi: 'Địa cầu hành lang lương toàn cầu 3D Three.js kết nối 6 hub (VN/SG/US/DE/UK/JP) kèm Tháp ESOP 48 tháng (3x–10x Exit): chuyển đổi EOR ($599/th) vs Direct B2B (-62% so với US HQ), Luật Thuế TNCN 109/2025 5 bậc & Kanban ATS.',
      en: '60fps Three.js Global Payroll Corridor Globe linking 6 engineering hubs (VN/SG/US/DE/UK/JP) beside crystalline 48M ESOP pillars (3x–10x exits): compare EOR vs Direct B2B (-62% vs US HQ), Vietnam Law 109/2025 5-tier PIT & Kanban ATS.',
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
    previewBadge: '.NET 10 · 3D PAYROLL GLOBE · ESOP 48M · LAW 2026',
    featuredRank: 8,
    stack: ['.NET 10', 'Three.js 3D Globe', 'Law 109/2025', 'ESOP + Kanban ATS'],
    deliverables: {
      vi: [
        'Địa cầu 3D Global Payroll Corridor 6 hub (VN/SG/US/DE/UK/JP) với 240 gói tin dòng tiền & Tháp ESOP 48 tháng bật 3x–10x',
        'Tính lương Gross→Net & Net→Gross theo Luật 109/2025 (5 bậc mới, 15.5tr/6.2tr) so sánh trực tiếp Luật 2025 (.NET 10, 183 CI)',
        'Bảng lương hàng loạt + chi phí chủ sử dụng 23,5%, xuất Excel CSV UTF-8 BOM & in Phiếu Lương PDF A4',
        'Bảng Kanban ATS quản lý ứng viên 5 vòng phỏng vấn, bản đồ nhiệt quỹ lương & định giá VietQR',
      ],
      en: [
        '60fps Three.js Global Payroll Globe (6 hubs, 240 streaming payment packets) & rising 48M ESOP Waterfall Pillars (3x–10x)',
        '2026 Law 109/2025 Gross↔Net solver (<= 1 VND tolerance) vs 2025 tax savings (.NET 10 API, 183 CI tests)',
        'Multi-employee batch payroll table, 23.5% employer ledger, UTF-8 BOM CSV export & printable A4 payslips',
        '5-stage Kanban ATS pipeline, department Salary Band Heatmap & enterprise VietQR pricing',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo .NET 10 + Địa cầu 3D Global Payroll Globe Three.js, Tháp ESOP 48 tháng, Luật 109/2025 & Kanban ATS.',
      en: 'Full-Stack .NET 10 HRIS monorepo uniting a Three.js 3D Global Payroll Globe, 48M ESOP pillars, 2026 Law 109/2025 & Kanban ATS.',
    },
    metricsBadge: '.NET 10 · 3D PAYROLL GLOBE · ESOP 48M · LAW 2026',
  },
  {
    id: 'veritas-legal-firm',
    sku: 'TVT-LAW-17',
    name: 'Veritas Legal Studio v4.0',
    subtitle: {
      vi: 'Tháp Thác Vốn M&A Cap-Table 3D, Tiêm Điều Khoản Độc Hại 2x & Tự Động Redline FastAPI',
      en: '60fps 3D M&A Cap-Table Waterfall Monument, Toxic 2x Double-Dip Injection & Auto-Redline FastAPI',
    },
    tagline: {
      vi: 'Tháp Thác Thanh Khoản M&A 3D Three.js phong cách phòng luật Thụy Sĩ: kéo định giá thoái vốn $10M–$150M, bấm tiêm điều khoản độc hại 2x Participating làm tháp Sáng lập sập đỏ (-$13.80M) & bấm Auto-Redline 1x NP khôi phục ngay kèm trình soạn hợp đồng NĐ 13.',
      en: '60fps Three.js Swiss Law Library 3D M&A Cap-Table Waterfall Monument: scrub $10M–$150M exit valuations, inject Toxic 2x Participating double-dip collapsing Founder equity (-$13.80M) & trigger 1-Click Auto-Redline 1x NP plus Decree 13 PDPD bilingual contracts.',
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
    previewBadge: 'FASTAPI · 3D M&A WATERFALL · TOXIC 2X REDLINE',
    featuredRank: 19,
    stack: ['FastAPI', 'Three.js 3D Waterfall', 'Clause Redline', 'Decree 13 PDPD'],
    deliverables: {
      vi: [
        'Tháp Thác Thanh Khoản M&A 3D 5 tầng cổ đông (Founders/ESOP/SAFE/Series A/B) với dòng tiền đổ từ vương miện Exit & Auto-Redline',
        '4 bộ mẫu hợp đồng thương mại song ngữ Việt–Anh bật/tắt 8 điều khoản bảo vệ IP, chấm điểm rủi ro 0–100 NĐ 13 (150 CI tests)',
        'Đối chiếu Redline LCS từng dòng, xuất bản thảo hợp đồng chuẩn in ấn PDF A4, tải file .md & lưu kho bản nháp',
        'Ước tính phí tư vấn/retainer doanh nghiệp, hồ sơ luật sư thành viên & đặt lịch bảo mật .ics',
      ],
      en: [
        '60fps Three.js 5-class M&A Liquidation Waterfall Monument with toxic 2x double-dip stress test & 1-click Auto-Redline recovery',
        '4 bilingual commercial contract templates with 8 toggleable IP, liability & VIAC clauses & 0–100 Decree 13 PDPD scorer (150 CI)',
        'Side-by-side LCS contract redline diff, formal A4 print preview, Markdown draft download & Saved Contract Vault',
        'Corporate retainer estimator, Senior Partner credentials & double-booking-safe slot locker',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo FastAPI + Tháp Thác Vốn M&A 3D Three.js, so sánh Redline điều khoản, chấm rủi ro Nghị định 13 PDPD & Conflict Check.',
      en: 'Full-Stack FastAPI LegalTech monorepo pairing a Three.js 3D M&A Cap-Table Waterfall Monument, clause redline diffing & Decree 13 PDPD.',
    },
    metricsBadge: 'FASTAPI · 3D M&A WATERFALL · TOXIC 2X REDLINE',
  },
  {
    id: 'nordic-home-atelier',
    sku: 'TVT-INT-18',
    name: 'Nordic Home Atelier v4.0',
    subtitle: {
      vi: 'Penthouse Bắc Âu 3D Đổ Bóng Nắng 06–21h, Kéo Nội Thất 3D, Laser Bếp NKBA & Đi Bộ POV .NET 10',
      en: '60fps 3D Sunlit Penthouse (06–21h Shadows), 3D Floor Drag, NKBA Laser Triangle & First-Person POV',
    },
    tagline: {
      vi: 'Căn hộ Penthouse Bắc Âu 3D Three.js PBR: kéo giờ nắng 06:00 Bình Minh -> 17:30 Hoàng Hôn -> 21:00 Hygge tự bật đèn đồng 2700K, kéo bàn/đảo bếp ngay trên sàn 3D đồng bộ 1:1 mặt bằng CAD & dự toán BOQ, tia laser tam giác bếp NKBA & chế độ đi bộ POV ngang tầm mắt 1.62m.',
      en: '60fps Three.js PBR Sunlit Scandinavian Penthouse: scrub real-time solar shadows (06:00 Dawn -> 17:30 Golden Hour -> 21:00 Hygge Night auto-lighting 2700K brass lamps), drag furniture & kitchen island directly on the 3D floor synced 1:1 with 2D CAD & Turnkey BOQ, live 3D NKBA work-triangle lasers & First-Person Walkthrough POV.',
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
    previewBadge: '.NET 10 · 3D PENTHOUSE · SOLAR 06–21H · POV WALK',
    featuredRank: 17,
    stack: ['.NET 10', 'Three.js 3D Penthouse', 'NKBA Laser + POV', '2D AABB + BOQ'],
    deliverables: {
      vi: [
        'Penthouse 3D Three.js PBR đổ bóng mềm thực tế theo thanh trượt giờ nắng 06:00 -> 21:00 tự bật đèn Hygge 2700K',
        'Kéo thả nội thất & đảo bếp trực tiếp trên sàn 3D đồng bộ 1:1 mặt bằng 2D AABB, lối đi >=60cm & dự toán BOQ',
        'Tia laser 3D đo Tam Giác Công Năng Bếp NKBA (6.80m), đổi vân gỗ Copenhagen Oak / Japandi Ash / Smoked Walnut trực tiếp',
        'Chế độ Đi Bộ Góc Nhìn Thứ Nhất (First-Person Walkthrough POV 1.62m), xuất CSV BOM, Proposal PDF A4 & VietQR',
      ],
      en: [
        '60fps Three.js PBR Penthouse with PCFSoftShadowMap solar scrubbing (06:00 Dawn -> 21:00 Hygge Night 2700K lamps)',
        'Direct 3D floor furniture & kitchen island dragging synced 1:1 with 2D AABB CAD, 60cm walkway checks & live BOQ',
        'Live 3D NKBA Kitchen Work-Triangle lasers (6.80m) + live Copenhagen Oak / Japandi Ash / Smoked Walnut finishes',
        'First-Person Walkthrough POV (1.62m eye height), UTF-8 BOM CSV export, A4 Design Proposal PDF & VietQR',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo .NET 10 + Penthouse 3D Three.js PBR đổ bóng nắng 06–21h, kéo nội thất 3D đồng bộ CAD, laser NKBA & đi bộ POV.',
      en: 'Full-Stack .NET 10 interior platform pairing a Three.js PBR sunlit 3D penthouse, direct 3D floor drag synced to 2D CAD, NKBA lasers & POV walkthrough.',
    },
    metricsBadge: '.NET 10 · 3D PENTHOUSE · SOLAR 06–21H · POV WALK',
  },
  {
    id: 'zenith-wealth-fintech',
    sku: 'TVT-FIN-19',
    name: 'Zenith Wealth FinTech v5.0',
    subtitle: {
      vi: 'Mặt Cong 3D Efficient Frontier Thụy Sĩ, Biến Dạng Sốc 2008 GFC, Tax Alpha & 3D Monte Carlo',
      en: '60fps 3D Swiss Private Bank Efficient Frontier Surface, Macro Stress Deformer & 3D Monte Carlo Fan',
    },
    tagline: {
      vi: 'Bề mặt 3D Risk-Yield Thụy Sĩ 36×36 (Alabaster & Emerald) chạy 60fps: click trực tiếp lên bề mặt 3D hoặc 5 khối cầu tài sản giải tỷ trọng tối ưu, tiêm sốc 2008 GFC / +250bps làm mặt cong 3D sụp lún đỏ trực tiếp, bấm Auto-Rebalance + Tax-Loss Harvest (+$48.2K) & bung nón 3D Monte Carlo 20 năm.',
      en: '60fps Three.js Swiss Private Bank 36×36 Risk-Yield Surface (Alabaster & Deep Emerald): click anywhere on the 3D terrain or 5 Asset Orbs to solve optimal weights, trigger 2008 GFC / +250bps shocks visibly deforming the 3D mesh, run Auto-Rebalance + Tax-Loss Harvest (+$48.2K) & erupt 20-year 3D Monte Carlo wealth ribbons.',
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
    previewBadge: 'FASTAPI · 3D SWISS FRONTIER · GFC SHOCK · MC FAN',
    featuredRank: 7,
    stack: ['FastAPI', 'Three.js 3D Frontier', 'GFC Stress + TLH', '3D Monte Carlo'],
    deliverables: {
      vi: [
        'Bề mặt địa hình 3D Efficient Frontier 36×36 (Thụy Sĩ Alabaster/Emerald/Gold) cùng 5 khối cầu tài sản & dây hiệp phương sai',
        'Click thẳng lên bề mặt 3D giải tức thì tỷ trọng danh mục, Sharpe Ratio, Expected Return, Volatility & 95% VaR',
        'Tiêm sốc vĩ mô 2008 GFC / +250bps Rate Hike / USD-CHF -12% làm mặt cong 3D biến dạng sống & Auto-Rebalance Tax Alpha +$48.2K',
        'Bung dải 3D Monte Carlo 1.000 kịch bản (P90/P50/P10 20 năm), Quỹ tín thác Family Trust, 4-FX Hedge & FastAPI (154 CI)',
      ],
      en: [
        '60fps Three.js 36×36 Swiss Private Bank Risk-Yield surface with 5 metallic/jade Asset Orbs & golden covariance filaments',
        'Direct raycast click anywhere on the 3D surface or orbs solving optimal weights, Sharpe Ratio, Expected Return & 95% VaR',
        'Live Macro Stress Deformer (2008 GFC / +250bps / USD-CHF -12%) + 1-click Auto-Rebalance & Tax-Loss Harvest (+$48.2K)',
        '3D 1,000-path 20-year Monte Carlo wealth ribbons (P90/P50/P10), Family Trust Estate Sim, 4-FX Hedge & FastAPI (154 CI)',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo FastAPI + Bề mặt 3D Swiss Efficient Frontier Three.js, biến dạng sốc 2008 GFC, Tax-Loss Harvest & nón 3D Monte Carlo.',
      en: 'Full-Stack FastAPI WealthTech pairing a Three.js 3D Swiss Efficient Frontier surface, macro shock deformer, Tax-Loss Harvest & 3D Monte Carlo fan.',
    },
    metricsBadge: 'FASTAPI · 3D SWISS FRONTIER · GFC SHOCK · MC FAN',
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
    name: 'OrbitalFlow B2B SaaS v5.0',
    subtitle: {
      vi: 'Phòng Tác Chiến Multiplayer: Ống Canary 0–100%, Bắn Spike 500 Auto-Rollback, Gantt CPM & .NET 10',
      en: 'Multiplayer War-Room: Live 0–100% Canary Pipe, 500 Spike Auto-Rollback, Direct Gantt CPM & .NET 10',
    },
    tagline: {
      vi: 'Phòng tác chiến kỹ thuật thời gian thực Linear × LaunchDarkly: ống chia lưu lượng Canary 60fps bắn 200+ gói tin, nút Inject Canary 500 Spike đóng sập cổng Auto-Rollback BREAKER 0% (khóa RBAC 403), kéo thanh Gantt CPM + nối dây DAG cập nhật Monte Carlo P85 tức thì & con trỏ Multiplayer Figma-style (Sarah, Minh).',
      en: 'Live Multiplayer Engineering War-Room: 60fps Obsidian Canary Traffic Pipe (0→100%) streaming 200+ droplets, Inject Canary 500 Spike slamming physical BREAKER 0% Auto-Rollback (live RBAC 403), direct-manipulation Gantt CPM bar dragging + DAG wiring feeding 500-run Monte Carlo P85 & Figma-style teammate cursors.',
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
    previewBadge: '.NET 10 · MULTIPLAYER WAR-ROOM · CANARY PIPE · CPM',
    featuredRank: 5,
    stack: ['.NET 10', 'Canary Auto-Rollback', 'Direct Gantt + CPM', 'Multiplayer + RBAC'],
    deliverables: {
      vi: [
        'Ống phân luồng Canary 0–100% chạy 60fps + nút Inject Canary 500 Spike đóng cổng Auto-Rollback BREAKER 0% trong <150ms',
        'Kéo trực tiếp thanh Gantt CPM, nối dây phụ thuộc DAG & chạy tức thì 500 lượt Monte Carlo P85 + đồng bộ 2 tab',
        'Con trỏ cộng tác Multiplayer kiểu Figma (Sarah, Minh), ma trận phân quyền RBAC 403 thật & tính cước Stripe Proration',
        'Quản lý API Key, ký Webhook HMAC-SHA256, Retry Backoff & .NET 10 Clean Architecture API (219 CI tests)',
      ],
      en: [
        '60fps Obsidian Canary Traffic Splitter Pipe (0–100%) + Inject 500 Spike triggering physical BREAKER 0% Auto-Rollback',
        'Direct-manipulation Gantt CPM bar dragging & DAG dependency wiring updating 500-run Monte Carlo P85 live',
        'Floating Figma-style Multiplayer cursors (Sarah, Minh), real 403 RBAC enforcement & Stripe Metering/Proration',
        'HMAC-SHA256 Webhook DLQ replay, 2-tab BroadcastChannel sync & .NET 10 Minimal API (219 CI tests)',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo .NET 10 phòng tác chiến Multiplayer: ống Canary 500 Auto-Rollback, Gantt CPM kéo-thả trực tiếp, RBAC 403 & Stripe Metering.',
      en: 'Full-Stack .NET 10 multiplayer B2B SaaS war-room featuring 60fps Canary Auto-Rollback pipe, direct Gantt CPM dragging, RBAC 403 & Stripe Metering.',
    },
    metricsBadge: '.NET 10 · MULTIPLAYER WAR-ROOM · CANARY PIPE · CPM',
  },
  {
    id: 'vectradoc-rag',
    sku: 'TVT-AI-24',
    name: 'VectraDoc AI RAG v5.0',
    subtitle: {
      vi: 'Tinh Vân Vector 3D HNSW, Tia Laser Cosine/BM25, Lồng Cách Ly Poison Chunk 3D & FastAPI',
      en: '60fps 3D HNSW Vector Nebula, Live BM25↔Vector Beams, 3D Poison Quarantine Cage & FastAPI',
    },
    tagline: {
      vi: 'Phòng Lab Hybrid RAG 3D Three.js: tinh vân không gian vector HNSW 60fps phóng tia laser Cosine/BM25/RRF nối tâm truy vấn tới đúng đoạn văn bản, kéo thanh Alpha 0.0 BM25 ↔ 1.0 Vector thấy tia laser bẻ tuyến trực tiếp, click bay camera soi chunk & nút Inject Poison Chunk khóa chết vào Lồng Cách Ly Đỏ 3D (0% rò rỉ).',
      en: '60fps Three.js 3D HNSW Semantic Vector Nebula: starburst Query Anchor firing curved Cosine/BM25/RRF retrieval laser beams, live 0.0 BM25 ↔ 1.0 Vector alpha snapping, click-to-fly-in Chunk Inspector & Inject Poison Chunk trapped inside a 3D Crimson Octahedral Quarantine Cage (0% leak).',
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
    previewBadge: 'FASTAPI · 3D HNSW NEBULA · POISON CAGE · RRF',
    featuredRank: 6,
    stack: ['FastAPI', 'Three.js 3D HNSW', 'Hybrid RAG + RRF', '3D Poison Cage'],
    deliverables: {
      vi: [
        'Tinh vân Vector 3D HNSW Three.js 60fps: tâm truy vấn bắn tia laser retrieval nối thẳng các cụm tài liệu chuẩn xác',
        'Kéo tỷ trọng 0.0 BM25 ↔ 1.0 Vector bẻ tuyến tia laser thời gian thực + click vào node 3D bay camera soi nguyên văn [1][2]',
        'Nút Inject Poison Chunk phóng khối tấn công Prompt Injection bị khóa cứng trong Lồng Bát Diện Đỏ 3D (QUARANTINED · 0% LEAK)',
        'Nạp file PDF FlateDecode thật, đo Recall@5 100% / MRR 100%, che PII chuẩn Luhn & FastAPI Backend (243 CI tests)',
      ],
      en: [
        '60fps Three.js 3D HNSW Semantic Vector Nebula with starburst Query Anchor & curved Cosine/BM25/RRF laser beams',
        'Live 0.0 BM25 ↔ 1.0 Vector alpha beam snapping + click-to-fly-in Chunk Inspector with verbatim [1][2] citations',
        'Inject Poison Chunk trapped inside a 3D Crimson Octahedral Quarantine Cage (QUARANTINED · 0% LEAK)',
        'Native PDF FlateDecode ingestion, 100% Recall@5 / MRR evals, Luhn PII Guard & FastAPI Backend (243 CI tests)',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo FastAPI + Tinh vân Vector 3D HNSW Three.js, Lồng Cách Ly Poison Chunk 3D, Hybrid RAG RRF & lá chắn PII Guard.',
      en: 'Full-Stack FastAPI Document AI pairing a Three.js 3D HNSW Vector Nebula, 3D Poison Quarantine Cage, Hybrid RAG RRF & Luhn PII Guard.',
    },
    metricsBadge: 'FASTAPI · 3D HNSW NEBULA · POISON CAGE · RRF',
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
    name: 'MedCore Clinical EHR v4.0',
    subtitle: {
      vi: 'Tim 3D Đập Đồng Bộ ECG, Tia X Dẫn Truyền, Sốc Điện 200J Cứu V-Fib & FastAPI HL7 FHIR R4',
      en: '60fps 3D Beating Heart Synced to ECG, X-Ray Conduction, 200J Code-Blue Defib & FastAPI FHIR',
    },
    tagline: {
      vi: 'Trạm hồi sức ICU 3D Three.js: mô hình giải phẫu Tim 3D PBR co bóp đồng bộ từng nhịp QRS sóng ECG Lead-II kèm xung điện SA->AV->Purkinje, bật chế độ X-Ray kính trong suốt, kích hoạt Code-Blue V-Fib & phóng tia sét Sốc Điện 200J Biphasic giữa 2 điện cực phục hồi ROSC + tiêm thuốc ACLS IV 1-click & chuẩn HL7 FHIR R4.',
      en: '60fps Three.js PBR Beating Anatomical Heart phase-locked to live Lead-II ECG with glowing SA->AV->Purkinje conduction waves, translucent Conduction X-Ray mode, Code-Blue V-Fib/V-Tach emergency + 200J Biphasic Defibrillator firing 3D lightning arcs restoring ROSC, 1-click IV ACLS pushes & FastAPI HL7 FHIR R4.',
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
    previewBadge: 'FASTAPI · 3D BEATING HEART · 200J DEFIB · FHIR R4',
    featuredRank: 8,
    stack: ['FastAPI', 'Three.js 3D Heart', '200J Defib + X-Ray', 'HL7 FHIR R4'],
    deliverables: {
      vi: [
        'Tim giải phẫu 3D Three.js PBR co bóp 60fps khóa pha 1:1 với sóng ECG Lead-II, mạch vành & chế độ X-Ray dẫn truyền SA->Purkinje',
        'Mô phỏng cấp cứu Code-Blue (V-Fib / V-Tach / Bradycardia / Septic Shock) + Sốc điện 200J phóng tia sét 3D cứu nhịp ROSC',
        'Tiêm tĩnh mạch ACLS 1-click (Epinephrine, Amiodarone, Atropine), chấm NEWS2/Sepsis-3 SOFA & chặn tương tác thuốc CPOE',
        'Xuất & tự sửa gói chuẩn quốc tế HL7 FHIR R4 Bundle JSON (LOINC/RxNorm), lab 72h & FastAPI Backend (190 CI tests)',
      ],
      en: [
        '60fps Three.js PBR anatomical beating heart phase-locked to Lead-II ECG + translucent Conduction X-Ray (SA->AV->Purkinje)',
        'Code-Blue emergency simulator (V-Fib / V-Tach / Bradycardia / Septic Shock) + 200J Biphasic Defib 3D lightning arcs restoring ROSC',
        '1-click IV ACLS drug pushes (Epinephrine, Amiodarone, Atropine), NEWS2/Sepsis-3 SOFA & 24-drug CPOE hard-stop guard',
        'Auto-repair HL7 FHIR R4 Bundle JSON (LOINC/RxNorm), 72h biomarker sparklines & FastAPI Backend (190 CI tests)',
      ],
    },
    architectureNote: {
      vi: 'Full-Stack Monorepo FastAPI + Tim giải phẫu 3D Three.js đồng bộ ECG, Sốc điện 200J cứu V-Fib, X-Ray dẫn truyền & chuẩn HL7 FHIR R4.',
      en: 'Full-Stack FastAPI Clinical EHR pairing a Three.js 3D beating heart phase-locked to Lead-II ECG, 200J Code-Blue defibrillator & HL7 FHIR R4.',
    },
    metricsBadge: 'FASTAPI · 3D BEATING HEART · 200J DEFIB · FHIR R4',
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
