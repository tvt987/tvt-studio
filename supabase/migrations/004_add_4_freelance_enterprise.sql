-- ============================================================================
-- TVT STUDIO v7.0 — ADD 4 ENTERPRISE FREELANCE PLATFORMS (24.9M - 27.9M VND)
-- Expands Live Commercial Catalog from 22 -> 26 Production Systems (29 Live Apps)
-- ============================================================================

UPDATE public.tvt_products
SET featured_rank = featured_rank + 4,
    updated_at = NOW()
WHERE featured_rank >= 5
  AND id NOT IN ('orbitalflow-saas', 'vectradoc-rag', 'fleetpulse-gis', 'medcore-ehr');

INSERT INTO public.tvt_products (
  id, sku, name, subtitle_vi, subtitle_en, tagline_vi, tagline_en,
  category, category_label_vi, category_label_en,
  price_vnd, original_price_vnd, price_usd, original_price_usd,
  delivery_days_min, delivery_days_max, live_url, preview_image, preview_badge,
  featured_rank, stack_json, metrics_badge, is_active
) VALUES
  (
    'orbitalflow-saas', 'TVT-SAAS-23', 'OrbitalFlow B2B SaaS',
    'Nền Tảng B2B SaaS Đa Tenant, RBAC, Gantt Đường Găng & Stripe Metering',
    'Multi-Tenant B2B SaaS, RBAC Matrix, Gantt CPM & Stripe Proration Billing',
    'Hệ thống SaaS chuẩn doanh nghiệp Linear × Stripe: chuyển tổ chức đa tenant, phân quyền RBAC khóa chức năng thật, Sprint Kanban + Gantt CPM, tính cước Metering/Proration & ký HMAC-SHA256 Webhook.',
    'Linear × Stripe B2B SaaS: multi-tenant org switcher, live RBAC permission enforcement, Sprint Kanban + CPM Critical Path Gantt, usage-based proration billing & HMAC-SHA256 webhook debugger.',
    'saas-ai', 'SaaS & AI', 'SaaS & AI',
    24900000, 38500000, 999, 1540, 5, 9,
    'https://tvt987.github.io/orbitalflow-saas/', './media/orbitalflow-saas.webp',
    'MULTI-TENANT RBAC · GANTT CPM · STRIPE', 5,
    '["React 19","RBAC Matrix","Gantt CPM","HMAC-SHA256"]'::jsonb,
    'MULTI-TENANT RBAC · GANTT CPM · STRIPE', TRUE
  ),
  (
    'vectradoc-rag', 'TVT-AI-24', 'VectraDoc AI RAG',
    'AI Đọc Tài Liệu Hybrid RAG (BM25 + Vector RRF), Trích Dẫn & Che PII',
    'Enterprise Document Intelligence, Live Hybrid BM25+Vector RRF RAG & PII Guard',
    'Không gian AI RAG chạy thuật toán thật ngay trên trình duyệt: nạp tài liệu .txt/.md/.json/.csv, chia chunk trực quan, truy xuất Okapi BM25 + Cosine + RRF, trích dẫn [1][2] tô sáng nguyên văn & che PII chuẩn Luhn.',
    'Live client-side Hybrid RAG workspace: ingest real files, inspect chunk spans, run genuine Okapi BM25 + TF-IDF Cosine + RRF reranking, highlight verbatim [1][2] citations & run 12-query MRR/NDCG evals.',
    'saas-ai', 'SaaS & AI', 'SaaS & AI',
    25900000, 39900000, 1039, 1599, 5, 9,
    'https://tvt987.github.io/vectradoc-rag/', './media/vectradoc-rag.webp',
    'OKAPI BM25 + RRF · 100% RECALL · PII', 6,
    '["React 19","Okapi BM25","RRF Hybrid RAG","PII Luhn Guard"]'::jsonb,
    'OKAPI BM25 + RRF · 100% RECALL · PII', TRUE
  ),
  (
    'fleetpulse-gis', 'TVT-GIS-25', 'FleetPulse GIS Fleet',
    'Điều Phối Đội Xe Bản Đồ Vector, Tối Ưu Tuyến CVRP & Chuỗi Lạnh -18°C',
    'Real-Time GIS Vector Fleet Control, CVRP 2-Opt Route Optimizer & Cold-Chain IoT',
    'Bản đồ điều phối đội xe toàn màn hình: thuật toán CVRP Clarke-Wright + 2-Opt cắt giảm 28,6% quãng đường trong 0,7ms, mô phỏng xe chạy thời gian thực, giám sát chuỗi lạnh -18°C & in lệnh điều vận A4.',
    'Full-viewport vector city GIS control room: Clarke-Wright + 2-Opt CVRP solver cutting route distance by 28.6% in 0.7ms, animated fleet telemetry, -18°C reefer fault drift & A4 dispatch manifest.',
    'enterprise-b2b', 'Doanh Nghiệp, HR & FinTech', 'Enterprise, Logistics & FinTech',
    27900000, 43000000, 1119, 1720, 6, 10,
    'https://tvt987.github.io/fleetpulse-gis/', './media/fleetpulse-gis.webp',
    'CVRP -28.6% KM · VECTOR GIS · -18°C', 7,
    '["React 19","CVRP 2-Opt","Vector GIS Map","Cold-Chain IoT"]'::jsonb,
    'CVRP -28.6% KM · VECTOR GIS · -18°C', TRUE
  ),
  (
    'medcore-ehr', 'TVT-MED-26', 'MedCore Clinical EHR',
    'Bệnh Án Điện Tử EHR, Sóng ECG/SpO2 Canvas, NEWS2 & Chuẩn HL7 FHIR R4',
    'Clinical EHR Workstation, Live Canvas ECG/SpO2, RCP NEWS2 & HL7 FHIR R4 Interop',
    'Trạm bác sĩ chuẩn bệnh viện quốc tế: màn hình Canvas vẽ sóng ECG Lead-II P-QRS-T & SpO2 trực tiếp, thang cấp cứu RCP NEWS2, cảnh báo tương tác thuốc/dị ứng chéo CPOE, lọc thận CrCl & xuất HL7 FHIR R4 JSON.',
    'Hospital-grade 3-column EHR workstation: live HiDPI Canvas Lead-II ECG & SpO2 waveforms, RCP NEWS2 triage matrix, 24-drug CPOE interaction & allergy hard-stop guard, Cockcroft-Gault CrCl & HL7 FHIR R4 JSON.',
    'clinic-proptech', 'Y Tế, BĐS & Wellness', 'HealthTech, Clinic & PropTech',
    26900000, 41500000, 1079, 1660, 6, 10,
    'https://tvt987.github.io/medcore-ehr/', './media/medcore-ehr.webp',
    'LIVE ECG/SPO2 · NEWS2 · HL7 FHIR R4', 8,
    '["React 19","Canvas ECG/PPG","CPOE Drug Guard","HL7 FHIR R4"]'::jsonb,
    'LIVE ECG/SPO2 · NEWS2 · HL7 FHIR R4', TRUE
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  subtitle_vi = EXCLUDED.subtitle_vi,
  subtitle_en = EXCLUDED.subtitle_en,
  tagline_vi = EXCLUDED.tagline_vi,
  tagline_en = EXCLUDED.tagline_en,
  price_vnd = EXCLUDED.price_vnd,
  original_price_vnd = EXCLUDED.original_price_vnd,
  price_usd = EXCLUDED.price_usd,
  original_price_usd = EXCLUDED.original_price_usd,
  live_url = EXCLUDED.live_url,
  preview_image = EXCLUDED.preview_image,
  preview_badge = EXCLUDED.preview_badge,
  featured_rank = EXCLUDED.featured_rank,
  stack_json = EXCLUDED.stack_json,
  metrics_badge = EXCLUDED.metrics_badge,
  is_active = TRUE,
  updated_at = NOW();
