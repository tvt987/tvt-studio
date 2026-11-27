-- ============================================================================
-- TVT STUDIO v5.0 — LIVE PRODUCT CATALOG CMS & NON-PII TRAFFIC ANALYTICS
-- Free Tier 0đ · Strict Zero-Trust RLS (Admin mutations ONLY via admin-ops JWT)
-- ============================================================================

-- 1. Live Cloud Product Catalog (Insert / Update / Delete / Inline Pricing)
CREATE TABLE IF NOT EXISTS public.tvt_products (
  id TEXT PRIMARY KEY,
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  subtitle_vi TEXT NOT NULL DEFAULT '',
  subtitle_en TEXT NOT NULL DEFAULT '',
  tagline_vi TEXT NOT NULL DEFAULT '',
  tagline_en TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'saas-ai'
    CHECK (category IN ('commerce-3d', 'clinic-proptech', 'pos-fnb', 'enterprise-b2b', 'saas-ai')),
  category_label_vi TEXT NOT NULL DEFAULT '',
  category_label_en TEXT NOT NULL DEFAULT '',
  price_vnd BIGINT NOT NULL CHECK (price_vnd >= 10000),
  original_price_vnd BIGINT NOT NULL CHECK (original_price_vnd >= 10000),
  price_usd INTEGER NOT NULL CHECK (price_usd >= 1),
  original_price_usd INTEGER NOT NULL CHECK (original_price_usd >= 1),
  delivery_days_min INTEGER NOT NULL DEFAULT 3 CHECK (delivery_days_min >= 1),
  delivery_days_max INTEGER NOT NULL DEFAULT 7 CHECK (delivery_days_max >= 1),
  live_url TEXT NOT NULL DEFAULT '',
  preview_image TEXT NOT NULL DEFAULT './media/studio-emblem.webp',
  preview_badge TEXT,
  featured_rank INTEGER NOT NULL DEFAULT 50,
  stack_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  deliverables_vi JSONB NOT NULL DEFAULT '[]'::jsonb,
  deliverables_en JSONB NOT NULL DEFAULT '[]'::jsonb,
  architecture_note_vi TEXT NOT NULL DEFAULT '',
  architecture_note_en TEXT NOT NULL DEFAULT '',
  metrics_badge TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tvt_products_active_rank
  ON public.tvt_products(is_active, featured_rank ASC);

ALTER TABLE public.tvt_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_active_products" ON public.tvt_products;
CREATE POLICY "public_read_active_products"
  ON public.tvt_products
  FOR SELECT TO anon, authenticated
  USING (is_active = TRUE);

-- 2. Non-PII Real-Time Traffic & Conversion Funnel Telemetry
CREATE TABLE IF NOT EXISTS public.tvt_analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL
    CHECK (event_type IN (
      'page_view',
      'sandbox_open',
      'product_detail',
      'add_to_cart',
      'checkout_start',
      'inquiry_submit'
    )),
  session_id TEXT NOT NULL,
  product_id TEXT,
  path TEXT NOT NULL DEFAULT '/',
  referrer TEXT NOT NULL DEFAULT '',
  locale TEXT NOT NULL DEFAULT 'vi',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tvt_analytics_created_at
  ON public.tvt_analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tvt_analytics_event_type
  ON public.tvt_analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_tvt_analytics_product_id
  ON public.tvt_analytics_events(product_id);

ALTER TABLE public.tvt_analytics_events ENABLE ROW LEVEL SECURITY;
-- Zero anon/authenticated SELECT/INSERT policies on tvt_analytics_events:
-- Writes happen strictly through validated SECURITY DEFINER RPC below;
-- Reads happen strictly through Zero-Trust `admin-ops` Edge Function (tinhkun102@gmail.com).

CREATE OR REPLACE FUNCTION public.record_site_event(
  p_event_type TEXT,
  p_session_id TEXT,
  p_product_id TEXT DEFAULT NULL,
  p_path TEXT DEFAULT '/',
  p_referrer TEXT DEFAULT '',
  p_locale TEXT DEFAULT 'vi'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_type TEXT := LOWER(TRIM(COALESCE(p_event_type, '')));
  v_sid TEXT := LEFT(TRIM(COALESCE(p_session_id, '')), 64);
BEGIN
  IF v_type NOT IN (
    'page_view',
    'sandbox_open',
    'product_detail',
    'add_to_cart',
    'checkout_start',
    'inquiry_submit'
  ) THEN
    RETURN FALSE;
  END IF;

  IF LENGTH(v_sid) < 6 THEN
    RETURN FALSE;
  END IF;

  INSERT INTO public.tvt_analytics_events (
    event_type,
    session_id,
    product_id,
    path,
    referrer,
    locale
  ) VALUES (
    v_type,
    v_sid,
    NULLIF(LEFT(TRIM(COALESCE(p_product_id, '')), 64), ''),
    LEFT(TRIM(COALESCE(p_path, '/')), 120),
    LEFT(TRIM(COALESCE(p_referrer, '')), 200),
    CASE WHEN LOWER(TRIM(COALESCE(p_locale, 'vi'))) = 'en' THEN 'en' ELSE 'vi' END
  );

  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.record_site_event(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_site_event(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;

-- 3. Idempotent Initial Seed for all 19 Flagship Commercial Websites
INSERT INTO public.tvt_products (
  id, sku, name, subtitle_vi, subtitle_en, tagline_vi, tagline_en,
  category, category_label_vi, category_label_en,
  price_vnd, original_price_vnd, price_usd, original_price_usd,
  delivery_days_min, delivery_days_max, live_url, preview_image, preview_badge,
  featured_rank, stack_json, metrics_badge, is_active
) VALUES
  (
    'velox-ev-motors', 'TVT-EV-11', 'Velox EV Motors v3.0',
    'Showroom Hypercar Điện 3D HDRI, Cửa Cánh Chim & Launch 0–100',
    '3D HDRI Hypercar Showroom, Gullwing Doors & 0–100 Launch Telemetry',
    'Flagship 20 Triệu: Xe điện 3D PBR ánh sáng Studio HDRI, cửa cánh chim mở động, buồng lái OLED, đường hầm gió Cd 0.19, Launch Control 2.1s & lộ trình sạc 350kW xuyên Việt.',
    '20M Flagship: Three.js PMREM Studio HDRI clearcoat EV, articulated gullwing doors, OLED cockpit POV, Cd 0.19 wind tunnel aero, 2.1s Web Audio launch control & VN 350kW routing.',
    'commerce-3d', 'Bán Hàng 3D & Nội Thất', '3D Commerce & Interior',
    20000000, 32000000, 799, 1280, 4, 6,
    'https://tvt987.github.io/velox-ev-motors/', './media/velox-ev-motors.webp',
    '3D HDRI HYPERCAR · GULLWING · 20M VIP', 1,
    '["React 19","Three.js HDRI","Wind Tunnel","Launch Synth"]'::jsonb,
    '3D HDRI HYPERCAR · GULLWING · 20M VIP', TRUE
  ),
  (
    'aegispulse', 'TVT-ENT-09', 'AegisPulse v3.0',
    'Kiến Trúc SRE Phân Tán .NET 10, Chaos Raft & Flamegraph',
    'Distributed .NET 10 SRE, Raft Chaos Injector & GC Flamegraph',
    'Bảng điều khiển SRE 5 khu vực toàn cầu: tiêm lỗi Chaos Raft Quorum, kéo tải 250K RPS trực tiếp, Flamegraph CPU/GC Pause & Hybrid RAG.',
    '5-region Raft consensus Chaos Fault Injector, live 250K RPS stress slider, interactive CPU/GC Flamegraph profiler & enterprise Hybrid RAG.',
    'saas-ai', 'SaaS & AI', 'SaaS & AI',
    22900000, 36000000, 899, 1440, 5, 10,
    'https://tvt987.github.io/aegispulse-distributed-sre/', './media/aegispulse.webp',
    'RAFT CHAOS · 250K RPS · FLAMEGRAPH', 2,
    '[".NET 10 / C#","Raft Chaos","Flamegraph","Hybrid RAG"]'::jsonb,
    'RAFT CHAOS · 250K RPS · FLAMEGRAPH', TRUE
  ),
  (
    'verdict-graph', 'TVT-AI-08', 'Verdict Graph v3.0',
    'Hệ Thống Điều Phối Multi-Agent DAG, Time-Travel Diff & FinOps',
    'Multi-Agent DAG Builder, Time-Travel Diff & LLM FinOps Router',
    'Trình dựng luồng AI Agent đa bước, nhân bản nhánh Time-Travel so sánh Diff, bộ định tuyến chi phí đa mô hình & kiểm thử Red-Team OWASP Top-10.',
    'Interactive multi-agent DAG builder, time-travel branch diffing, multi-model FinOps cost/latency router & OWASP LLM Top-10 Red-Team suite.',
    'saas-ai', 'SaaS & AI', 'SaaS & AI',
    19900000, 31000000, 789, 1240, 5, 8,
    'https://tvt987.github.io/verdict-graph/', './media/verdict-graph.webp',
    'AGENT BUILDER · TIME-TRAVEL · OWASP', 3,
    '["React 19","DAG Builder","FinOps Router","OWASP Red-Team"]'::jsonb,
    'AGENT BUILDER · TIME-TRAVEL · OWASP', TRUE
  ),
  (
    'zenith-wealth-fintech', 'TVT-FIN-19', 'Zenith Wealth v2.0',
    'Cổng Quản Lý Tài Sản, Monte Carlo FIRE & Stress-Test Khủng Hoảng',
    'Private Wealth Terminal, Monte Carlo FIRE & Crisis Stress-Test',
    'Mô phỏng 200 kịch bản Monte Carlo P10/P50/P90, đường biên Markowitz 40 điểm, diễn tập khủng hoảng 2008/2020/2022 & tính thuế đầu tư VN.',
    '200-path deterministic Monte Carlo FIRE fan-chart, 40-node Markowitz frontier, 4 crisis replays & Vietnam dividend/trade tax drag engine.',
    'enterprise-b2b', 'Doanh Nghiệp, HR & FinTech', 'Enterprise, EdTech & FinTech',
    18900000, 29500000, 749, 1180, 4, 7,
    'https://tvt987.github.io/zenith-wealth-fintech/', './media/zenith-wealth-fintech.webp',
    'QUANT FIRE · CRISIS STRESS-TEST', 4,
    '["React 19","Monte Carlo","Sharpe Frontier","Rebalancer"]'::jsonb,
    'QUANT FIRE · CRISIS STRESS-TEST', TRUE
  ),
  (
    'coda-hr-payroll', 'TVT-HR-16', 'CodaHR Enterprise v2.0',
    'Phần Mềm Tính Lương Luật 2026 (5 Bậc), Quyết Toán & Kanban ATS',
    'Vietnam 2026 Law Payroll, Annual PIT Finalization & Kanban ATS',
    'Chuẩn Luật Thuế TNCN 2026 số 109/2025, quyết toán năm + thưởng tháng 13, xuất file chi lương hàng loạt MBBank/VCB & Kanban ATS 5 vòng.',
    'Vietnam 2026 Law 109/2025 Gross-Net solver, annual PIT & 13th-month bonus reconciliation, bank bulk salary CSV BOM & 5-stage Kanban ATS.',
    'enterprise-b2b', 'Doanh Nghiệp, HR & FinTech', 'Enterprise, EdTech & FinTech',
    16900000, 26500000, 679, 1060, 4, 7,
    'https://tvt987.github.io/coda-hr-payroll/', './media/coda-hr-payroll.webp',
    'LAW 2026 · PIT FINALIZATION · ATS', 5,
    '["React 19","VN Payroll 2026","Kanban ATS","CSV BOM"]'::jsonb,
    'LAW 2026 · PIT FINALIZATION · ATS', TRUE
  ),
  (
    'meridian-logistics', 'TVT-LOG-15', 'Meridian Logistics v2.0',
    'Vận Tải Quốc Tế, Xếp Container 3D & Thuế Hải Quan EVFTA/CPTPP',
    'Global Freight Control Tower, 3D Container Stuffing & HS/FTA Duty',
    'Mô phỏng xếp hàng Container 3D Isometric, tính thuế nhập khẩu HS Code theo hiệp định EVFTA/CPTPP/ACFTA, tháp xử lý ngoại lệ & Vận đơn A4.',
    '3D Isometric container stuffing planner, Vietnam HS/EVFTA/CPTPP/ACFTA duty calculator, exception tower & 3-tab printable A4 trade docs.',
    'enterprise-b2b', 'Doanh Nghiệp, HR & FinTech', 'Enterprise, EdTech & FinTech',
    15900000, 24900000, 639, 990, 4, 7,
    'https://tvt987.github.io/meridian-logistics/', './media/meridian-logistics.webp',
    'CONTAINER 3D PACK · HS/EVFTA', 6,
    '["React 19","3D Container","HS/EVFTA Duty","Bill of Lading"]'::jsonb,
    'CONTAINER 3D PACK · HS/EVFTA', TRUE
  ),
  (
    'aurelia-resort', 'TVT-HOSP-10', 'Aurelia Resort v2.0',
    'Website Resort 5 Sao, Biểu Đồ Giá Động & Sự Kiện MICE/Tiệc Cưới',
    '5-Star Beachfront Resort, Yield Heatmap & Multi-Villa MICE Planner',
    'Bản đồ 10 khu biệt thự, lịch nhiệt giá động 30 ngày, lập kế hoạch tiệc cưới/MICE đa villa tiết kiệm 18% hoa hồng OTA & VietQR trực tiếp.',
    '30-day availability & dynamic yield heatmap, multi-villa wedding/MICE planner saving 18% OTA commissions & live MBBank VietQR booking.',
    'pos-fnb', 'Nhà Hàng, Resort & POS', 'Hospitality & POS',
    14900000, 23500000, 599, 940, 3, 5,
    'https://tvt987.github.io/aurelia-resort/', './media/aurelia-resort.webp',
    '5-STAR HEATMAP · MICE PLANNER', 7,
    '["React 19","Yield Heatmap","MICE Planner","VietQR"]'::jsonb,
    '5-STAR HEATMAP · MICE PLANNER', TRUE
  ),
  (
    'nexus-lake', 'TVT-DATA-07', 'Nexus Lake v3.0',
    'Kho Dữ Liệu SQL DuckDB-WASM, Notebook Đa Ô & Pivot Trực Quan',
    'In-Browser DuckDB-WASM Lakehouse, SQL Notebook & Cohort Heatmap',
    'Kéo thả file CSV/JSON thật vào trình duyệt, SQL Notebook nhiều ô, bảng Pivot kéo chiều động, Cohort Retention Heatmap & NL-to-SQL Copilot.',
    'Drag-drop local CSV/JSON ingestion into DuckDB-WASM, multi-cell SQL notebook with visual Pivot matrix, Cohort Retention heatmap & NL-to-SQL.',
    'saas-ai', 'SaaS & AI', 'SaaS & AI',
    14900000, 23500000, 599, 940, 4, 7,
    'https://tvt987.github.io/nexus-lake/', './media/nexus-lake.webp',
    'CSV INGEST · SQL NOTEBOOK · PIVOT', 8,
    '["React 19","DuckDB-WASM","SQL Notebook","Cohort BI"]'::jsonb,
    'CSV INGEST · SQL NOTEBOOK · PIVOT', TRUE
  ),
  (
    'atelier-canvas', 'TVT-SAAS-06', 'Atelier Canvas v4.0',
    'Công Cụ Thiết Kế Vector, Design Tokens & Trình Chạy Prototype',
    'Browser Vector Studio, Design Tokens & Interactive Prototype Player',
    'Trình thiết kế vector cấp Figma: hệ thống Design Tokens đổi theme tức thì, chuyển khung hình Responsive, trình phát Prototype & xuất React/Tailwind.',
    'Figma-class browser vector editor with W3C Design Tokens, Responsive Breakpoint preview, interactive Prototype player & React/Tailwind exporter.',
    'saas-ai', 'SaaS & AI', 'SaaS & AI',
    13900000, 21900000, 549, 879, 4, 7,
    'https://tvt987.github.io/atelier-canvas/', './media/atelier-canvas.webp',
    'DESIGN TOKENS · PROTOTYPE · REACT', 9,
    '["React 19","Design Tokens","Prototype Player","Tailwind Export"]'::jsonb,
    'DESIGN TOKENS · PROTOTYPE · REACT', TRUE
  ),
  (
    'pulse-pos-fnb', 'TVT-POS-05', 'PulsePOS F&B v2.0',
    'Hệ Thống POS Café / Nhà Hàng, QR Đặt Bàn & Bếp KDS Real-Time',
    'Café & Restaurant POS Terminal, Table QR & Live KDS',
    'Sơ đồ bàn cảm ứng, gọi món QR tại bàn, màn hình bếp KDS đồng bộ thời gian thực, định mức tồn kho tự động & tách hóa đơn VietQR.',
    'Touch-first hospitality POS with Table QR ordering, real-time Kitchen Display (KDS), auto-PO inventory & instant VietQR split billing.',
    'pos-fnb', 'POS & F&B', 'POS & F&B',
    12900000, 19900000, 519, 799, 4, 7,
    'https://tvt987.github.io/pulse-pos-fnb/', './media/pulse-pos-fnb.webp',
    'TABLE QR · LIVE KDS · AUTO-PO', 10,
    '["React 19","POS Engine","KDS Real-Time","VietQR Ready"]'::jsonb,
    'TABLE QR · LIVE KDS · AUTO-PO', TRUE
  ),
  (
    'maison-vera', 'TVT-3D-01', 'Maison Véra v4.0',
    'Website Kính Mắt 3D HDRI, Mô Phỏng Tròng UV & Đo Khuôn Mặt',
    'Luxury 3D HDRI Eyewear, UV Polarized Lens Lab & Bespoke Fit',
    'Trình diễn gọng titan 3D phản chiếu HDRI studio, mô phỏng tròng đổi màu UV/phân cực trực tiếp, đo khuôn mặt chọn dáng kính & Lookbook VIP.',
    'PMREM HDRI titanium 3D eyewear, real-time photochromic UV & polarized lens physics lab, millimeter face-shape fit studio & VIP lookbook.',
    'commerce-3d', 'Bán Hàng 3D', '3D Commerce',
    11900000, 18500000, 479, 739, 3, 5,
    'https://tvt987.github.io/maison-vera/', './media/maison-vera.webp',
    '3D HDRI TITANIUM · UV LENS LAB', 11,
    '["React 19","Three.js HDRI","UV Lens Sim","Bespoke Fit"]'::jsonb,
    '3D HDRI TITANIUM · UV LENS LAB', TRUE
  ),
  (
    'kinetix-proptech', 'TVT-PROP-04', 'Kinetix PropTech v2.0',
    'Sàn Bất Động Sản 3D & Stress-Test Lãi Suất Ngân Hàng',
    '3D Real Estate Portal & +4% Mortgage Rate Stress-Test',
    'Tháp căn hộ 3D tương tác, bộ lọc đa tiêu chí, máy tính trả góp ngân hàng kèm mô phỏng sốc lãi suất +4% & đặt lịch tham quan nhà mẫu.',
    'Interactive 3D tower unit explorer, multi-facet property filter & bank amortization calculator with +4% interest-rate stress simulation.',
    'clinic-proptech', 'Phòng Khám & BĐS', 'Clinic & PropTech',
    11900000, 18500000, 479, 739, 3, 6,
    'https://tvt987.github.io/kinetix-proptech/', './media/kinetix-proptech.webp',
    'TOWER 3D · +4% RATE STRESS', 12,
    '["React 19","3D Tower","Mortgage Engine","TypeScript"]'::jsonb,
    'TOWER 3D · +4% RATE STRESS', TRUE
  ),
  (
    'aether-acoustics', 'TVT-3D-02', 'Aether Acoustics v3.0',
    'Website Âm Thanh 3D, Radar Không Gian HRTF & Mô Phỏng Phòng RT60',
    '3D Spatial Audio, Binaural HRTF Radar & Room RT60 Acoustic Lab',
    'Radar điểm ngọt âm thanh không gian HRTF kéo thả, mô phỏng vật liệu tiêu âm phòng nghe tính RT60, đồ thị đáp tuyến tần số & THD+N.',
    'Interactive Binaural 3D HRTF soundstage radar, room surface material RT60 physics simulator, live 20Hz–20kHz frequency response & THD+N.',
    'commerce-3d', 'Bán Hàng 3D', '3D Commerce',
    10900000, 16900000, 439, 679, 3, 5,
    'https://tvt987.github.io/aether-acoustics/', './media/aether-acoustics.webp',
    '3D HRTF RADAR · RT60 · THD+N', 13,
    '["React 19","WebGL PBR","HRTF Spatial","RT60 Physics"]'::jsonb,
    '3D HRTF RADAR · RT60 · THD+N', TRUE
  ),
  (
    'nordic-home-atelier', 'TVT-INT-18', 'Nordic Atelier Interior',
    'Nội Thất Cao Cấp & Công Cụ Thiết Kế Mặt Bằng 2D',
    'Bespoke Scandinavian Furniture & 2D Floorplan Room Designer',
    'Kéo thả & xoay 90° đồ nội thất trên lưới 2D 50mm, cảnh báo lối đi <60cm, phối gỗ/vải tính giá trực tiếp & thanh kéo Trước/Sau cải tạo.',
    'Interactive 50mm-grid 2D floorplan designer with collision checks, live Wood × Fabric pricing swatches & Before/After renovation slider.',
    'commerce-3d', 'Bán Hàng 3D & Nội Thất', '3D Commerce & Interior',
    9900000, 15500000, 399, 619, 3, 6,
    'https://tvt987.github.io/nordic-home-atelier/', './media/nordic-home-atelier.webp',
    '2D CAD PLANNER · BOQ PRO', 14,
    '["React 19","2D CAD Planner","Swatch Pricing","A4 Proposal"]'::jsonb,
    '2D CAD PLANNER · BOQ PRO', TRUE
  ),
  (
    'solaris-academy', 'TVT-EDU-12', 'Solaris Academy LMS',
    'Nền Tảng E-Learning, Chấm Code Sandbox & Cấp Chứng Chỉ',
    'Interactive Coding LMS, Zero-Eval Sandbox & Verifiable Certificates',
    'Học trực tuyến với trình chấm bài tập code AST an toàn ngay trên trình duyệt, flashcard SM-2 & cấp chứng chỉ QR PDF A4.',
    'Modern EdTech LMS with zero-eval AST code sandbox, SM-2 spaced repetition flashcards, XP streaks & verifiable A4 PDF certificates.',
    'enterprise-b2b', 'Doanh Nghiệp, HR & FinTech', 'Enterprise, EdTech & FinTech',
    9490000, 14900000, 379, 599, 4, 6,
    'https://tvt987.github.io/solaris-academy/', './media/solaris-academy.webp',
    'ZERO-EVAL AST SANDBOX · SM-2', 15,
    '["React 19","AST Sandbox","SM-2 SRS","Cert QR PDF"]'::jsonb,
    'ZERO-EVAL AST SANDBOX · SM-2', TRUE
  ),
  (
    'veritas-legal-firm', 'TVT-LAW-17', 'Veritas Legal Studio',
    'Website Hãng Luật & Trình Soạn Hợp Đồng Chấm Điểm Rủi Ro',
    'Corporate Law Firm & Bilingual Contract Risk Analyzer Studio',
    'Soạn hợp đồng song ngữ MSA/NDA/B2B bật tắt 8 điều khoản bảo vệ, chấm điểm rủi ro 0–100 chuẩn Nghị định 13 PDPD & in PDF A4.',
    'Bilingual contract builder with 8 toggleable protection clauses, 0–100 Decree 13 PDPD risk analyzer & formal A4 print export.',
    'enterprise-b2b', 'Doanh Nghiệp, HR & FinTech', 'Enterprise, EdTech & FinTech',
    8490000, 13500000, 339, 539, 3, 5,
    'https://tvt987.github.io/veritas-legal-firm/', './media/veritas-legal-firm.webp',
    'DECREE 13 PDPD RISK · A4 PDF', 16,
    '["React 19","Contract Engine","PDPD Risk 0–100","A4 Legal PDF"]'::jsonb,
    'DECREE 13 PDPD RISK · A4 PDF', TRUE
  ),
  (
    'lumina-medspa', 'TVT-MED-03', 'Lumina MedSpa v2.0',
    'Website Phòng Khám Nha Khoa / Thẩm Mỹ & Đặt Lịch',
    'Aesthetic Clinic, Dental & Smart Booking Platform',
    'Chuẩn y khoa cao cấp với đặt lịch chọn bác sĩ chống trùng giờ, hồ sơ bệnh nhân, trả góp 0% & bảng giá minh bạch.',
    'Editorial medical aesthetics storefront with doctor slot booking, patient vault, 0% installment calculator & before/after comparison.',
    'clinic-proptech', 'Phòng Khám & BĐS', 'Clinic & PropTech',
    7900000, 12500000, 319, 499, 2, 4,
    'https://tvt987.github.io/lumina-medspa/', './media/lumina-medspa.webp',
    'PATIENT VAULT · 0% INSTALLMENT', 17,
    '["React 19","Booking Engine","TypeScript","SEO Medical"]'::jsonb,
    'PATIENT VAULT · 0% INSTALLMENT', TRUE
  ),
  (
    'kuro-omakase', 'TVT-FINE-13', 'Kuro Omakase',
    'Nhà Hàng Fine Dining & Sơ Đồ Quầy Hinoki 14 Chỗ',
    'Michelin Omakase & Interactive 14-Seat Hinoki Counter Booking',
    'Đặt từng ghế cụ thể quanh quầy gỗ Hinoki 14 chỗ, lọc dị ứng tự động đổi món đầu bếp & thiệp mời VIP PDF A4.',
    'Pick exact seats along the 14-seat Hinoki counter or Tatami room with smart allergen auto-substitutions & A4 VIP invitations.',
    'pos-fnb', 'Nhà Hàng, Resort & POS', 'Hospitality & POS',
    6490000, 10500000, 259, 419, 3, 5,
    'https://tvt987.github.io/kuro-omakase/', './media/kuro-omakase.webp',
    '14-SEAT HINOKI MAP · ALLERGEN', 18,
    '["React 19","SVG Seat Lock","Allergen Engine","VietQR"]'::jsonb,
    '14-SEAT HINOKI MAP · ALLERGEN', TRUE
  ),
  (
    'vanguard-fitness', 'TVT-FIT-14', 'Vanguard Fitness Club',
    'CLB Gym, Pilates & Mô Phỏng Chuyển Hóa 12 Tuần',
    'Luxury Gym, Pilates & 12-Week Metabolic Transformation Portal',
    'Tính BMR/TDEE/Macro Mifflin-St Jeor kèm đồ thị 12 tuần, đặt lớp có hàng chờ tự động, ghép PT & thẻ thành viên QR.',
    'Mifflin-St Jeor BMR/TDEE & 12-week trajectory simulator, live class waitlist locking, PT matcher & QR Member Pass.',
    'clinic-proptech', 'Y Tế, BĐS & Wellness', 'Clinic, PropTech & Wellness',
    5990000, 9500000, 239, 379, 2, 4,
    'https://tvt987.github.io/vanguard-fitness/', './media/vanguard-fitness.webp',
    '12W METABOLIC · WAITLIST LOCK', 19,
    '["React 19","Metabolic Math","Waitlist Lock","QR Pass"]'::jsonb,
    '12W METABOLIC · WAITLIST LOCK', TRUE
  )
ON CONFLICT (id) DO NOTHING;
