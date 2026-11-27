-- ============================================================================
-- TVT STUDIO v5.5 — ADD 3 ULTRA-FLAGSHIP COMMERCIAL PLATFORMS (26.9M - 29.9M VND)
-- Expands Live Commercial Catalog from 19 -> 22 Production Websites (25 Live Apps)
-- ============================================================================

-- Shift ranks >= 2 down by +3 so the 3 new Ultra-Flagships appear at Top #2, #3, #4 right beside #1 Velox EV v3.0
UPDATE public.tvt_products
SET featured_rank = featured_rank + 3,
    updated_at = NOW()
WHERE featured_rank >= 2
  AND id NOT IN ('aeroforge-digital-twin', 'helios-quant-terminal', 'chronos-horology');

INSERT INTO public.tvt_products (
  id, sku, name, subtitle_vi, subtitle_en, tagline_vi, tagline_en,
  category, category_label_vi, category_label_en,
  price_vnd, original_price_vnd, price_usd, original_price_usd,
  delivery_days_min, delivery_days_max, live_url, preview_image, preview_badge,
  featured_rank, stack_json, metrics_badge, is_active
) VALUES
  (
    'aeroforge-digital-twin', 'TVT-IOT-22', 'AeroForge 3D Digital Twin',
    'Bản Sao Số Nhà Máy 4.0 3D, Robot 6 Trục Kinematics & AI Dự Báo Lỗi FFT',
    'Industry 4.0 Smart Factory 3D Twin, 6-Axis Robot Kinematics & Vibration FFT AI',
    'Siêu Phẩm 29,9 Triệu: Sàn nhà máy 3D Three.js HDRI, cánh tay robot CNC 6 trục FK/IK thật, băng chuyền QA quang học, camera nhiệt hồng ngoại Ironbow, phổ rung động ổ bi FFT & tối ưu điện mặt trời EVN 3 khung giờ.',
    '29.9M Ultra-Flagship: Live Three.js Smart Factory 3D floor, real 6-axis CNC robot FK/IK kinematics, optical QA conveyor, Ironbow thermal heatmap, bearing vibration FFT predictive AI & EVN solar optimizer.',
    'saas-ai', 'SaaS & AI', 'SaaS & AI',
    29900000, 46000000, 1199, 1840, 6, 10,
    'https://tvt987.github.io/aeroforge-digital-twin/', './media/aeroforge-digital-twin.webp',
    '3D FACTORY TWIN · 6-AXIS IK · 29.9M ULTRA', 2,
    '["React 19","Three.js HDRI","6-Axis FK/IK","Vibration FFT"]'::jsonb,
    '3D FACTORY TWIN · 6-AXIS IK · 29.9M ULTRA', TRUE
  ),
  (
    'helios-quant-terminal', 'TVT-QNT-21', 'Helios Quant Terminal',
    'Sàn Khớp Lệnh L2 Orderbook, Biểu Đồ Nến Canvas & Backtest Thuật Toán Quant',
    'Institutional L2 Orderbook Matching Engine, Canvas Candlestick & Algo Backtester',
    'Siêu Phẩm 28,9 Triệu: Nhân khớp lệnh Price-Time Priority 6 thị trường (BTC/ETH/VN30F1M/Vàng/NVDA), biểu đồ nến Canvas HiDPI (EMA/Bollinger/VWAP/RSI/MACD), mô phỏng sốc thanh khoản & Backtest 4 chiến lược 500 nến (<5ms).',
    '28.9M Ultra-Flagship: Deterministic FIFO LOB matching engine across 6 markets (incl. VN30F1M), HiDPI Canvas candlesticks with EMA/BB/VWAP/RSI/MACD, flash-crash stress lab & sub-5ms 500-bar quant backtester.',
    'enterprise-b2b', 'Doanh Nghiệp, HR & FinTech', 'Enterprise, EdTech & FinTech',
    28900000, 44500000, 1159, 1780, 6, 10,
    'https://tvt987.github.io/helios-quant-terminal/', './media/helios-quant-terminal.webp',
    'L2 MATCHING ENGINE · ALGO QUANT · 28.9M', 3,
    '["React 19","FIFO LOB Engine","Canvas 2D TA","Quant Backtest"]'::jsonb,
    'L2 MATCHING ENGINE · ALGO QUANT · 28.9M', TRUE
  ),
  (
    'chronos-horology', 'TVT-LUX-20', 'Chronos Horology 3D',
    'Bộ Máy Đồng Hồ Cơ Tourbillon 3D Chạy Thật, Âm Thanh 4Hz & Boutique Thụy Sĩ',
    'Working 3D Mechanical Tourbillon Calibre, 4Hz Escapement Synth & Swiss Boutique',
    'Siêu Phẩm 26,9 Triệu: Bộ máy đồng hồ cơ Tourbillon 3D Three.js hoạt động thật 60fps (bánh răng ăn khớp, cầu cân bằng 28,800 vph, tách 7 tầng máy, dạ quang Lume Night, âm thanh bộ thoát 4Hz Web Audio) & chứng nhận COSC A4.',
    '26.9M Ultra-Flagship: Live animated 3D mechanical Tourbillon calibre (28,800 vph balance, meshed gear train, 7-layer exploded view, Lume Night, Web Audio 4Hz escapement synth) & COSC A4 certification.',
    'commerce-3d', 'Bán Hàng 3D & Nội Thất', '3D Commerce & Interior',
    26900000, 41500000, 1079, 1660, 5, 8,
    'https://tvt987.github.io/chronos-horology/', './media/chronos-horology.webp',
    '3D TOURBILLON CALIBRE · 4HZ AUDIO · 26.9M', 4,
    '["React 19","Three.js HDRI","Tourbillon 3D","Web Audio 4Hz"]'::jsonb,
    '3D TOURBILLON CALIBRE · 4HZ AUDIO · 26.9M', TRUE
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
