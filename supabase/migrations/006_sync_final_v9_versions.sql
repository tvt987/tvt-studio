-- ============================================================================
-- TVT STUDIO v9.0 — FINAL SYNC FOR ALL 26 FULL-STACK MONOREPOS (v3.0–v6.0)
-- Non-destructive metadata refresh (preserves id, sku, prices, ranks & images)
-- Note: Row #9 live ID in public.tvt_products is 'aegispulse'
-- ============================================================================

UPDATE public.tvt_products SET
  name = v.name,
  subtitle_vi = v.subtitle_vi,
  subtitle_en = v.subtitle_en,
  preview_badge = v.badge,
  metrics_badge = v.badge,
  stack_json = v.stack_json::jsonb,
  updated_at = NOW()
FROM (VALUES
  ('velox-ev-motors', 'Velox EV Motors v6.0', 'Hypercar 3D Lofted Monocoque, Daylight Pavilion, Poster 1600p & .NET 10', '3D Lofted Pininfarina Hypercar, Daylight Pavilion, 1600p Poster & .NET 10', '.NET 10 · 3D LOFTED MONOCOQUE · 1600P POSTER', '["React 19",".NET 10","Three.js HDRI","Spec A/B Compare"]'),
  ('aeroforge-digital-twin', 'AeroForge 3D Twin v4.0', 'Nhà Máy 4.0 3D, Weibull RUL, BESS EVN 3 Khung Giờ, Six Sigma SPC & .NET 10', '3D Factory Twin, Weibull RUL PM, ISO 50001 BESS EVN, Six Sigma SPC & .NET 10', '.NET 10 SCADA · WEIBULL RUL · BESS EVN', '["React 19",".NET 10","Three.js 3D","Weibull + BESS"]'),
  ('helios-quant-terminal', 'Helios Quant Terminal v4.0', 'Sàn L2 FIFO, VaR/CVaR Monte Carlo Stress, SABR Vol Smile, Greeks & FastAPI', 'FIFO L2 Book, VaR/CVaR Stress Studio, SABR Vol Smile, Greeks & FastAPI', 'FASTAPI · VAR/CVAR STRESS · SABR SMILE', '["React 19","FastAPI","VaR/CVaR Stress","SABR Vol Smile"]'),
  ('chronos-horology', 'Chronos 3D Watch v3.0', 'Tourbillon 3D Geneva, Isochronism 72h COSC & .NET 10 HMAC Vault', 'Geneva 3D Tourbillon, 72h Isochronism Lab & .NET 10 HMAC Vault', '.NET 10 HMAC · 72H ISOCHRONISM · 3D', '["React 19",".NET 10","Three.js 3D","HMAC Vault"]'),
  ('orbitalflow-saas', 'OrbitalFlow B2B SaaS v4.0', 'Multi-Tenant RBAC 403, Feature Flags Canary + A/B Z-Test/SRM, Monte Carlo & .NET 10', 'Multi-Tenant RBAC 403, Feature Flags Canary + A/B Z-Test/SRM, Monte Carlo & .NET 10', '.NET 10 · CANARY FLAGS · A/B Z-TEST SRM', '["React 19",".NET 10","Canary + A/B SRM","RBAC 403 + DLQ"]'),
  ('vectradoc-rag', 'VectraDoc AI RAG v4.0', 'Hybrid RAG PDF, Red-Team Prompt Firewall, Latency Waterfall, CI Diff & FastAPI', 'Hybrid RAG PDF, Prompt-Injection Red-Team, Latency Waterfall, CI Diff & FastAPI', 'FASTAPI · RED-TEAM RAG · CI REGRESSION', '["React 19","FastAPI","Red-Team Guard","Knowledge Graph"]'),
  ('fleetpulse-gis', 'FleetPulse GIS Fleet v3.0', 'Điều Phối CVRP -28.6%, Chuỗi Lạnh MKT, EV TCO & .NET 10 PostGIS', 'CVRP -28.6% GIS, Cold-Chain MKT Lab, EV 60M TCO & .NET 10 API', '.NET 10 GIS · CVRP -28.6% · COLD MKT', '["React 19",".NET 10","CVRP 2-Opt","Cold-Chain MKT"]'),
  ('medcore-ehr', 'MedCore Clinical EHR v3.0', 'Bệnh Án EHR, Sepsis-3 Hour-1, Lab 72h & FastAPI HL7 FHIR R4', 'Hospital EHR, Sepsis-3 Hour-1, 72h Labs & FastAPI HL7 FHIR R4', 'FASTAPI FHIR · SEPSIS-3 · AUTO-REPAIR', '["React 19","FastAPI","HL7 FHIR R4","Sepsis-3 SOFA"]'),
  ('aegispulse', 'AegisPulse SRE v6.0', 'Rate-Limiter Token-Bucket, 500-Req Voucher 0% Rò, Raft 5 Vùng & .NET 10', 'Token-Bucket Rate-Limiter Lab, 500-Req Voucher 0% Leak, Raft & .NET 10', '.NET 10 1.26MS · RATE-LIMITER · 5-REGION RAFT', '["React 19",".NET 10","Rate-Limiter Lab","SQL Plan + Raft"]'),
  ('verdict-graph', 'Verdict Graph AI v5.0', 'LangSmith Studio Sáng, Pareto FinOps Router, OWASP LLM10 & FastAPI', 'LangSmith Daylight Studio, Pareto FinOps Router, OWASP LLM10 & FastAPI', 'FASTAPI MCP · PARETO ROUTER · OWASP LLM10', '["React 19","FastAPI","Pareto FinOps","OWASP Firewall"]'),
  ('zenith-wealth-fintech', 'Zenith Wealth FinTech v4.0', 'Private Banking Thụy Sĩ Sáng, Quỹ Tín Thác Family Trust & FastAPI Quant', 'Swiss Private Bank Daylight, Generational Estate Trust & FastAPI Quant', 'SWISS PRIVATE BANK · ESTATE TRUST · FASTAPI', '["React 19","FastAPI","Family Trust","Markowitz + FX"]'),
  ('coda-hr-payroll', 'CodaHR Payroll 2026 v4.0', 'Global EOR vs B2B (-62%), ESOP 48 Tháng, Luật 109/2025 & .NET 10', 'Global EOR vs B2B (-62%), 48M ESOP Cliff Tax, Law 109/2025 & .NET 10', '.NET 10 HRIS · GLOBAL EOR · ESOP 48M', '["React 19",".NET 10","Global EOR","ESOP + Law 2026"]'),
  ('meridian-logistics', 'Meridian Logistics v4.0', 'Tháp Hàng Hải Sáng, Bản Đồ Tuyến Biển SVG, Incoterms 2020 & .NET 10', 'Maritime Daylight Control Tower, Global Sea-Lane SVG, Incoterms & .NET 10', 'MARITIME DAYLIGHT · SEA-LANE SVG · INCOTERMS', '["React 19",".NET 10","Sea-Lane SVG","Incoterms 2020"]'),
  ('aurelia-resort', 'Aurelia Resort PMS v4.0', 'Bản Đồ Bãi Kem Phú Quốc SVG, Góc Nắng Hoàng Hôn & .NET 10 RevPAR', 'Bai Kem Estate Masterplan SVG, Golden-Hour Sun Lab & .NET 10 RevPAR', '.NET 10 PMS · ESTATE SVG · REVPAR ENGINE', '["React 19",".NET 10","Estate SVG Map","RevPAR Yield"]'),
  ('nexus-lake', 'Nexus Lake OLAP v5.0', 'Hex Daylight Lakehouse, Hợp Đồng Chất Lượng dbt-test & FastAPI MCP', 'Hex Daylight Lakehouse, dbt-test SLA Quality Contracts & FastAPI MCP', 'HEX DAYLIGHT · DBT-TEST SLA · DUCKDB 500K', '["React 19","FastAPI + MCP","dbt-test SLA","DuckDB-WASM"]'),
  ('atelier-canvas', 'Atelier Canvas Pro v6.0', 'Ma Trận 144 Biến Thể WCAG Auto-Fix, Cộng Tác 2 Tab & .NET 10', '144-Cell Variant Matrix + WCAG Auto-Fix, 2-Tab Collab & .NET 10', '.NET 10 · 144 VARIANTS WCAG · 2-TAB COLLAB', '["React 19",".NET 10","144 Variant WCAG","React/SwiftUI"]'),
  ('pulse-pos-fnb', 'PulsePOS F&B v4.0', 'POS ↔ KDS 2-Tab, Menu BCG Matrix, Queue Erlang-C & .NET 10 API', '2-Tab POS ↔ KDS, Menu BCG Matrix, Erlang-C Queue & .NET 10 API', '.NET 10 POS · 2-TAB KDS · BCG & ERLANG-C', '["React 19",".NET 10","2-Tab POS/KDS","BCG + Erlang-C"]'),
  ('maison-vera', 'Maison Véra 3D v6.0', 'Lab Phân Cực Malus Split-Screen, Quang Học PD & .NET 10 PMREM 3D', 'Split-Screen Malus Glare Lab, Optical PD Prentice & .NET 10 PMREM 3D', '.NET 10 · MALUS GLARE LAB · PMREM 3D', '["React 19",".NET 10","Three.js PMREM","Malus Glare + PD"]'),
  ('kinetix-proptech', 'Kinetix PropTech v4.0', 'Bản Đồ Metro 6 Quận Sài Gòn, So Sánh Tài Sản 10 Năm & .NET 10 Escrow', 'Saigon 6-District Metro Corridor Map, 10Y Asset Benchmark & .NET 10', '.NET 10 ESCROW · SAIGON METRO SVG · 10Y ROI', '["React 19",".NET 10","Saigon Metro SVG","10Y Wealth Bench"]'),
  ('aether-acoustics', 'Aether Acoustics 3D v5.0', 'CAD Bố Trí Loa SBIR 2D, Cardas Golden-Ratio & .NET 10 Biquad DSP', '2D Speaker Placement SBIR CAD, Cardas Golden-Ratio & .NET 10 DSP', '.NET 10 DSP · SBIR 2D CAD · CARDAS RATIO', '["React 19",".NET 10","Three.js 3D","SBIR CAD + RT60"]'),
  ('nordic-home-atelier', 'Nordic Home Atelier v3.0', 'Lab Nắng Tự Nhiên, Tam Giác Bếp NKBA, Tiêu Âm RT60 & .NET 10', 'Architectural Daylight Solar-Gain, NKBA Work-Triangle & .NET 10 BOQ', '.NET 10 CAD · DAYLIGHT + NKBA · SABINE RT60', '["React 19",".NET 10","Daylight + NKBA","2D AABB CAD"]'),
  ('solaris-academy', 'Solaris Academy LMS v3.0', 'Ước Tính Tải System Design 5 Tầng SVG, Zero-Eval AST & FastAPI', '5-Tier System Design Capacity SVG Lab, Zero-Eval AST & FastAPI', 'FASTAPI AST · SYSTEM DESIGN SVG · OXFORD UI', '["React 19","FastAPI","System Design Lab","Zero-Eval AST"]'),
  ('veritas-legal-firm', 'Veritas Legal Studio v3.0', 'Thác Thanh Khoản M&A Cap-Table & SAFE, Redline LCS & FastAPI', 'Startup M&A Cap-Table SAFE Waterfall SVG, LCS Redline & FastAPI', 'FASTAPI LEGAL · M&A CAP-TABLE · LCS REDLINE', '["React 19","FastAPI","M&A Cap-Table","LCS + Decree 13"]'),
  ('lumina-medspa', 'Lumina MedSpa Clinic v4.0', 'Lab Chống Nắng UV Sau Laser (0.45x), Hoàn Vốn Máy Laser & .NET 10', 'Post-Laser UV Photobiology Lab (0.45x), Laser CapEx ROI & .NET 10', '.NET 10 CLINIC · POST-LASER UV · CAPEX ROI', '["React 19",".NET 10","UV Photobiology","CapEx ROI + Lock"]'),
  ('kuro-omakase', 'Kuro Omakase Hinoki v3.0', 'Bản Đồ Chuỗi Lạnh Toyosu, Ủ Cá Jukusei, Ghép Sake & .NET 10', 'Toyosu Cold-Chain Provenance Map, Jukusei Aging, Sake Lab & .NET 10', '.NET 10 HINOKI · TOYOSU COLD-CHAIN · JUKUSEI', '["React 19",".NET 10","Toyosu Cold-Chain","Sake + Anti-Orphan"]'),
  ('vanguard-fitness', 'Vanguard Fitness Club v3.0', 'Vùng Tim Karvonen Z1–Z5, Đường Lactate, HRV/ACWR & .NET 10', 'Karvonen Z1–Z5 Lactate Curve, Autonomic HRV/ACWR Engine & .NET 10', '.NET 10 CLUB · KARVONEN LACTATE · HRV/ACWR', '["React 19",".NET 10","Lactate Z1-Z5","HRV + ACWR Lab"]')
) AS v(id, name, subtitle_vi, subtitle_en, badge, stack_json)
WHERE public.tvt_products.id = v.id;
