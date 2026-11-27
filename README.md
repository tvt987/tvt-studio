# TVT Studio v9.0 — Awwwards Commercial Full-Stack Storefront & Custom IT Engineering

> **Live Deployment**: [https://tvt987.github.io/tvt-studio/](https://tvt987.github.io/tvt-studio/)
> **Principal Architect**: Truong Van Tinh (`tinhkun102@gmail.com` · Zalo/Hotline `0931 467 024`)

## Overview

TVT Studio v9.0 is an aggressively code-split, dual-theme (Obsidian Dark + Warm Paper Light) commercial marketplace and custom IT engineering storefront showcasing:

- **26 Full-Stack Production Monorepos** (`18` `.NET 10` + `8` `Python FastAPI` systems, including `20` VIP 10M+ platforms led by `Velox EV Motors v5.0`) spanning 3D WebGL HDRI Commerce, B2B SaaS, Hybrid AI RAG, GIS Fleet CVRP, Clinical EHR HL7 FHIR R4, Smart Factory Digital Twin, Institutional Quant LOB, Hospitality POS/KDS, and 2026 Vietnam Payroll.
- **Architectural Tech-Stack Filter Bar (v9.0)** — Instant 1-click CTO stack filtering (`All Stacks (26)` · `.NET 10 Backend (18)` · `Python FastAPI (8)` · `Three.js 3D PBR (5)` · `AI / RAG / MCP (4)`) smoothly composed with category tabs, VIP 10M+ toggle, live search, and sorting.
- **Agency-vs-TVT Studio ROI & Time-to-Market Comparator (v9.0)** — Dynamic cost & delivery-speed comparison inside the lazy-loaded `ProductDetailModal` quantifying exact VND/USD cash saved (`~4.5x–6.5x` traditional 3-person agency vs TVT Studio turnkey) and days-to-market saved (`-91%` to `-96%` faster launch) across both `Standard Deploy` and `Full Source +30%` licenses.
- **Dual Dark Obsidian & Crisp Architectural Light Mode (v9.0)** — Calibrated Warm Paper (`#F8F7F4`) canvas, pure white (`#FFFFFF`) elevated surfaces, deep architectural ink (`#111318`), and hairline `#E4E2DC` dividers across every section and modal.
- **12 Free Local-First Pro Tools (`tvt-tools` v2.0)** — 6 Business + 6 Engineering client-side utilities with direct `#/<slug>` hash deep-links, including B2B Freelance Rate & Deel/Wise Margin and JSON/OpenAPI Diff & SLA Latency.
- **Interactive Custom IT Scope & Price Configurator** across 3 transparent tiers with 7 modular add-ons, real-time `VNĐ / USD` calculation, `30% / 40% / 30%` milestone schedule, and 1-click Technical Proposal `.md` export.
- **Real-Time Hybrid Checkout & Admin CMS** — Idempotent voucher engine (`TVTLAUNCH15`, `AGENCY10`, `VIP500K`), MBBank VietQR (`970422 / 0325456574`) ↔ SePay ↔ Supabase Realtime auto-verification, IndexedDB Order Tracker, Client Source Recovery Vault, and Owner Admin CMS (`Ctrl+Shift+A`).

## Performance & Code-Splitting Architecture (v9.0)

- **Main Entry Chunk (`index`)**: `85.63 kB` (`23.39 kB` gzip) — strictly `< 95 kB` with **0 kB** entry overhead for the ROI Comparator engine.
- **Vendor & Engine Splitting**: Dedicated `react` (`223.19 kB`), `engines` (`130.62 kB`), and 11 `React.lazy` on-demand chunks for all 9 modals/drawers (`OwnerConsoleModal`, `CheckoutModal`, `AccountPortalModal`, `OrderTrackerModal`, `CartDrawer`, `ProductDetailModal`, `QuickInquiryModal`, `CompareDrawer`, `LiveSandboxModal`) plus below-the-fold sections (`ProToolsSuiteSection`, `CustomEstimatorSection`).
- **Security Hardening**: Strict Content-Security-Policy (`script-src 'self'`, `object-src 'none'`), `strict-origin-when-cross-origin` Referrer-Policy, zero `dangerouslySetInnerHTML`/`innerHTML`/`eval`, zero custom mouse cursors, zero UI emojis.

## Verification & Local Development

```bash
npm install
npm test        # 62/62 Vitest unit tests passing across 9 suites
npm run dev     # Vite dev server on :4321
npm run build   # Strict TypeScript + code-split Vite production build
```
