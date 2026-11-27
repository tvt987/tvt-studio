# TVT Studio v8.0 — Commercial Full-Stack Storefront & Custom IT Engineering

> **Live Deployment**: [https://tvt987.github.io/tvt-studio/](https://tvt987.github.io/tvt-studio/)
> **Principal Architect**: Truong Van Tinh (`tinhkun102@gmail.com` · Zalo/Hotline `0931 467 024`)

## Overview

TVT Studio v8.0 is a high-performance, aggressively code-split commercial marketplace and custom IT engineering storefront showcasing:

- **26 Full-Stack Production Monorepos** (`18` `.NET 10` + `8` `Python FastAPI` systems, including `20` VIP 10M+ platforms led by `Velox EV Motors v4.0`) spanning 3D WebGL HDRI Commerce, B2B SaaS, Hybrid AI RAG, GIS Fleet CVRP, Clinical EHR HL7 FHIR R4, Smart Factory Digital Twin, Institutional Quant LOB, Hospitality POS/KDS, and 2026 Vietnam Payroll.
- **12 Free Local-First Pro Tools (`tvt-tools` v2.0)** — 6 Business + 6 Engineering client-side utilities with direct `#/<slug>` hash deep-links, including B2B Freelance Rate & Deel/Wise Margin and JSON/OpenAPI Diff & SLA Latency.
- **Interactive Custom IT Scope & Price Configurator** across 3 transparent tiers with 7 modular add-ons, real-time `VNĐ / USD` calculation, `30% / 40% / 30%` milestone schedule, and 1-click Technical Proposal `.md` export.
- **Real-Time Hybrid Checkout & Admin CMS v8.0** — Idempotent voucher engine (`TVTLAUNCH15`, `AGENCY10`, `VIP500K`), MBBank VietQR (`970422 / 0325456574`) ↔ SePay ↔ Supabase Realtime auto-verification, IndexedDB Order Tracker, Client Source Recovery Vault, and Owner Admin CMS (`Ctrl+Shift+A`).

## Performance & Code-Splitting Architecture (v8.0)

- **Main Entry Chunk (`index`)**: `83.06 kB` (`22.87 kB` gzip) — down **86.5%** from the prior `615.45 kB` monolithic bundle.
- **Vendor & Engine Splitting**: Dedicated `react` (`223.19 kB`), `engines` (`129.81 kB`), and 11 `React.lazy` on-demand chunks for all 9 modals/drawers (`OwnerConsoleModal`, `CheckoutModal`, `AccountPortalModal`, `OrderTrackerModal`, `CartDrawer`, `ProductDetailModal`, `QuickInquiryModal`, `CompareDrawer`, `LiveSandboxModal`) plus below-the-fold sections (`ProToolsSuiteSection`, `CustomEstimatorSection`).
- **Security Hardening**: Strict Content-Security-Policy (`script-src 'self'`, `object-src 'none'`), `strict-origin-when-cross-origin` Referrer-Policy, zero `dangerouslySetInnerHTML`/`innerHTML`/`eval`.

## Verification & Local Development

```bash
npm install
npm test        # 49/49 Vitest unit tests passing across 8 suites
npm run dev     # Vite dev server on :4321
npm run build   # Strict TypeScript + code-split Vite production build
```
