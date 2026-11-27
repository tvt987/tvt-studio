-- ============================================================================
-- TVT STUDIO v8.5 — SYNC ALL 26 FULL-STACK PRODUCTION MONOREPO VERSIONS & SPECS
-- Non-destructive metadata refresh (preserves id, sku, prices, ranks & images)
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
  ('velox-ev-motors', 'Velox EV Motors v5.0', 'Hypercar Điện 3D Carbon Aero, Ghost Lap Telemetry & .NET 10', '3D Carbon Aero EV Hypercar, Ghost Lap Arena & .NET 10 API', '.NET 10 · 3D CARBON AERO · GHOST LAP', '["React 19",".NET 10","Three.js HDRI","Ghost Telemetry"]'),
  ('aeroforge-digital-twin', 'AeroForge 3D Twin v3.0', 'Nhà Máy 4.0 3D, Six Sigma SPC Cpk, G-Code CNC & .NET 10 SCADA', '3D Factory Twin, Six Sigma SPC Cpk, 6-Axis CNC & .NET 10 SCADA', '.NET 10 SCADA · SIX SIGMA SPC · CNC', '["React 19",".NET 10","Three.js 3D","Six Sigma SPC"]'),
  ('helios-quant-terminal', 'Helios Quant Terminal v3.0', 'Sàn L2 FIFO, Black-Scholes Greeks, Smart Order Router & FastAPI', 'FIFO L2 Book, Black-Scholes Greeks, Multi-Venue SOR & FastAPI', 'FASTAPI · BSM GREEKS · MULTI-VENUE SOR', '["React 19","FastAPI","BSM Greeks","Smart Router"]'),
  ('chronos-horology', 'Chronos 3D Watch v3.0', 'Tourbillon 3D Geneva, Isochronism 72h COSC & .NET 10 HMAC Vault', 'Geneva 3D Tourbillon, 72h Isochronism Lab & .NET 10 HMAC Vault', '.NET 10 HMAC · 72H ISOCHRONISM · 3D', '["React 19",".NET 10","Three.js 3D","HMAC Vault"]'),
  ('orbitalflow-saas', 'OrbitalFlow B2B SaaS v3.0', 'Multi-Tenant RBAC 403, Monte Carlo 500x, Webhook DLQ & .NET 10', 'Multi-Tenant RBAC 403, Monte Carlo Forecast, DLQ & .NET 10 API', '.NET 10 · LIVE RBAC 403 · MONTE CARLO', '["React 19",".NET 10","RBAC + DLQ","Monte Carlo"]'),
  ('vectradoc-rag', 'VectraDoc AI RAG v3.0', 'Hybrid RAG PDF, Knowledge Graph, Chunking Lab & FastAPI', 'Hybrid RAG PDF, Knowledge Graph, Chunking Eval Lab & FastAPI', 'FASTAPI · KNOWLEDGE GRAPH · FAITHFULNESS', '["React 19","FastAPI","PDF Hybrid RAG","Knowledge Graph"]'),
  ('fleetpulse-gis', 'FleetPulse GIS Fleet v3.0', 'Điều Phối CVRP -28.6%, Chuỗi Lạnh MKT, EV TCO & .NET 10 PostGIS', 'CVRP -28.6% GIS, Cold-Chain MKT Lab, EV 60M TCO & .NET 10 API', '.NET 10 GIS · CVRP -28.6% · COLD MKT', '["React 19",".NET 10","CVRP 2-Opt","Cold-Chain MKT"]'),
  ('medcore-ehr', 'MedCore Clinical EHR v3.0', 'Bệnh Án EHR, Sepsis-3 Hour-1, Lab 72h & FastAPI HL7 FHIR R4', 'Hospital EHR, Sepsis-3 Hour-1, 72h Labs & FastAPI HL7 FHIR R4', 'FASTAPI FHIR · SEPSIS-3 · AUTO-REPAIR', '["React 19","FastAPI","HL7 FHIR R4","Sepsis-3 SOFA"]'),
  ('aegispulse', 'AegisPulse SRE v5.0', 'Đua 500 Req Voucher 0% Rò, SQL Plan Tree, 5-Region Raft & .NET 10', '500-Req Voucher Race 0% Leak, SQL Plan Tree, Raft & .NET 10 API', '.NET 10 5K RPS · SQL PLAN · 5-REGION RAFT', '["React 19",".NET 10","Redis Lua","SQL Plan + Raft"]'),
  ('verdict-graph', 'Verdict Graph AI v4.0', 'OWASP LLM01–10 Firewall, Token Circuit Breaker & FastAPI MCP', 'OWASP LLM01–10 Firewall, Token Breaker & FastAPI MCP Runtime', 'FASTAPI MCP · OWASP LLM10 · -52% COST', '["React 19","FastAPI","OWASP Firewall","MCP / A2A"]'),
  ('zenith-wealth-fintech', 'Zenith Wealth FinTech v3.0', 'Private Banking, Tax-Loss Harvest, 4-FX Hedge & FastAPI Quant', 'Private Banking, Tax-Loss Harvest, 4-FX Hedging & FastAPI Quant', 'FASTAPI QUANT · TAX HARVEST · 4-FX HEDGE', '["React 19","FastAPI","Markowitz","FX Hedging"]'),
  ('coda-hr-payroll', 'CodaHR Payroll 2026 v3.0', 'HRIS Luật 109/2025, Kanban ATS, Salary Heatmap & .NET 10 API', 'Law 109/2025 Payroll, Kanban ATS, Salary Heatmap & .NET 10 API', '.NET 10 HRIS · LAW 109/2025 · KANBAN ATS', '["React 19",".NET 10","Law 109/2025","Kanban ATS"]'),
  ('meridian-logistics', 'Meridian Logistics v3.0', 'Port Reroute Lab, 3D Container CG + SOLAS VGM & .NET 10 EVFTA', 'Port Disruption Reroute, 3D CG + SOLAS VGM & .NET 10 EVFTA API', '.NET 10 FREIGHT · SOLAS VGM · REROUTE', '["React 19",".NET 10","3D CG SOLAS","EVFTA Duty"]'),
  ('aurelia-resort', 'Aurelia Resort PMS v3.0', 'RevPAR Yield Studio, Đồng Bộ Itinerary & .NET 10 Overlap Lock', '30D RevPAR Yield Studio, Itinerary Sync & .NET 10 PMS Lock 409', '.NET 10 PMS · REVPAR STUDIO · 409 LOCK', '["React 19",".NET 10","RevPAR Yield","PMS Overlap Lock"]'),
  ('nexus-lake', 'Nexus Lake OLAP v4.0', '500K DuckDB-WASM, Medallion SVG Lineage & FastAPI SQL Guard 403', '500K DuckDB-WASM, Medallion SVG Lineage & FastAPI SQL Guard 403', 'FASTAPI MCP · DUCKDB 500K · SQL GUARD', '["React 19","FastAPI + MCP","DuckDB-WASM","Medallion SVG"]'),
  ('atelier-canvas', 'Atelier Canvas Pro v5.0', 'Figma 2-Tab Realtime Collab, 4-Target Token Compiler & .NET 10', '2-Tab Live Collab Canvas, 4-Target Token Compiler & .NET 10 API', '.NET 10 · 2-TAB COLLAB · 4-TARGET TOKENS', '["React 19",".NET 10","2-Tab Collab","SwiftUI/Compose"]'),
  ('pulse-pos-fnb', 'PulsePOS F&B v4.0', 'POS ↔ KDS 2-Tab, Menu BCG Matrix, Queue Erlang-C & .NET 10 API', '2-Tab POS ↔ KDS, Menu BCG Matrix, Erlang-C Queue & .NET 10 API', '.NET 10 POS · 2-TAB KDS · BCG & ERLANG-C', '["React 19",".NET 10","2-Tab POS/KDS","BCG + Erlang-C"]'),
  ('maison-vera', 'Maison Véra 3D v5.0', 'Kính 3D PMREM, Optical Rx 1.50/1.74 Sagitta & .NET 10 Fitting', 'PMREM 3D Eyewear, Optical Rx 1.50/1.74 Lab & .NET 10 Lock API', '.NET 10 · OPTICAL RX 1.74 · PMREM 3D', '["React 19",".NET 10","Three.js PMREM","Optical Rx Lab"]'),
  ('kinetix-proptech', 'Kinetix PropTech v3.0', 'BĐS Saigon Sun-Path, 10Y Leverage IRR & .NET 10 Escrow 409', 'Saigon Sun-Path Lab, 10Y Leverage IRR & .NET 10 Unit Escrow 409', '.NET 10 ESCROW · SUN-PATH · 10Y IRR', '["React 19",".NET 10","Saigon Solar","Escrow Lock 409"]'),
  ('aether-acoustics', 'Aether Acoustics 3D v4.0', 'Loa 3D, Room Standing-Wave RT60, Auto-EQ & .NET 10 Biquad DSP', '3D Audio, Room Standing-Wave RT60, Auto-EQ & .NET 10 Biquad DSP', '.NET 10 DSP · ROOM MODES · 59KB SPLIT', '["React 19",".NET 10","Three.js 3D","Sabine RT60 DSP"]'),
  ('nordic-home-atelier', 'Nordic Home Atelier v2.0', 'CAD Nội Thất 2D AABB, Kelvin/Carbon Optimizer & .NET 10 BOQ', '2D AABB Clearance CAD, Kelvin/Carbon Optimizer & .NET 10 BOQ', '.NET 10 CAD · 2D AABB · 51.7KB SPLIT', '["React 19",".NET 10","2D AABB CAD","Kelvin/Carbon"]'),
  ('solaris-academy', 'Solaris Academy LMS v2.0', 'Oxford LMS, Algo Step Visualizer & FastAPI Zero-Eval AST Grader', 'Daylight Oxford LMS, Algo Visualizer & FastAPI Zero-Eval AST', 'FASTAPI AST · OXFORD UI · DIJKSTRA SVG', '["React 19","FastAPI","Zero-Eval AST","Algo Visualizer"]'),
  ('veritas-legal-firm', 'Veritas Legal Studio v2.0', 'So Sánh Redline LCS, Nghị Định 13 PDPD & FastAPI Conflict Check', 'LCS Contract Redline Diff, Decree 13 PDPD & FastAPI Legal API', 'FASTAPI LEGAL · LCS REDLINE · 37KB SPLIT', '["React 19","FastAPI","LCS Redline","Decree 13 PDPD"]'),
  ('lumina-medspa', 'Lumina MedSpa Clinic v3.0', 'Phác Đồ 12 Tuần Fitzpatrick I–VI, Trả Góp 0% & .NET 10 Slot Lock', '12W Fitzpatrick I–VI Clinical Roadmap & .NET 10 Room Slot Lock', '.NET 10 CLINIC · FITZPATRICK · 41.8KB', '["React 19",".NET 10","12W Roadmap","Doctor Slot Lock"]'),
  ('kuro-omakase', 'Kuro Omakase Hinoki v2.0', '14 Ghế Hinoki Anti-Orphan, Đổi Món Dị Ứng 18 Món & .NET 10 API', '14-Seat Hinoki Anti-Orphan Lock, 18-Course Arc & .NET 10 API', '.NET 10 HINOKI · ANTI-ORPHAN · 50.7KB', '["React 19",".NET 10","Anti-Orphan 14","Allergen Arc"]'),
  ('vanguard-fitness', 'Vanguard Fitness Club v2.0', 'Phác Đồ 12 Tuần ACWR, Waitlist FIFO Tự Động & .NET 10 Metabolic', '12W Periodization ACWR, Auto FIFO Waitlist & .NET 10 Club API', '.NET 10 CLUB · FIFO WAITLIST · 49KB', '["React 19",".NET 10","12W ACWR Lab","FIFO Waitlist"]')
) AS v(id, name, subtitle_vi, subtitle_en, badge, stack_json)
WHERE public.tvt_products.id = v.id;
