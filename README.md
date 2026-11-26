# TVT Studio — Commercial Website Marketplace & Custom IT Engineering Storefront

> **Live Deployment**: [https://tvt987.github.io/tvt-studio/](https://tvt987.github.io/tvt-studio/)
> **Principal Architect**: Truong Van Tinh (`tinhkun102@gmail.com` · Zalo/Hotline `0931 467 024`)

## Overview

TVT Studio is a Swiss-industrial commercial marketplace and custom IT engineering storefront offering:

- **9 Ready-to-Deploy Commercial Website Templates** across 3D Commerce, Medical/Dental & PropTech, Hospitality POS/KDS, and SaaS/AI — each with a built-in Desktop/Tablet/Mobile Live Sandbox iframe preview and Standard vs. Full Source (+40%) licensing.
- **Interactive Custom IT Scope & Price Configurator** across 3 transparent tiers (Starter, Growth, Enterprise `.NET 10` / Python AI) with 7 modular add-ons, real-time `VNĐ / USD` calculation, 3-stage `30% / 40% / 30%` milestone schedule, and 1-click Technical Proposal `.md` export.
- **Full Transactional Cart & Idempotent Voucher Engine** (`TVTLAUNCH15`, `AGENCY10`, `VIP500K`) with `100%` vs `30%` kickoff deposit mode and a 3-step Checkout flow supporting ZaloPay QR, MoMo (`0931 467 024`), and International B2B USD Invoicing (`Deel / Wise / Wire`).

## Engineering & Quality Stack

- **Frontend**: React 19, TypeScript (Strict), Vite 6, Tailwind CSS v4
- **Pure Logic Engines**: `src/engines/` (Catalog, Scope Estimator, Idempotent Voucher, Cart & Deposit Math, Contract Invoice Export)
- **Automated Testing**: 25+ Vitest unit tests (`npm test`) + GitHub Actions CI & GitHub Pages deployment

## Local Development

```bash
npm install
npm test
npm run dev
npm run build
```
