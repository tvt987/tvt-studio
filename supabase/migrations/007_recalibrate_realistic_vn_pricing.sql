-- ============================================================================
-- TVT STUDIO v9.5 — RECALIBRATE ALL 26 PRODUCTS TO REALISTIC VN MARKET PRICING
-- Direct-from-Engineer Tiers: 990,000 VND – 3,990,000 VND ($39 – $159 USD)
-- ============================================================================

UPDATE public.tvt_products SET
  price_vnd = v.price_vnd,
  original_price_vnd = v.original_price_vnd,
  price_usd = v.price_usd,
  original_price_usd = v.original_price_usd,
  updated_at = NOW()
FROM (VALUES
  ('vanguard-fitness', 990000, 1690000, 39, 69),
  ('kuro-omakase', 1190000, 1990000, 49, 79),
  ('lumina-medspa', 1290000, 2190000, 52, 89),
  ('veritas-legal-firm', 1290000, 2190000, 52, 89),
  ('solaris-academy', 1390000, 2390000, 56, 95),
  ('nordic-home-atelier', 1490000, 2490000, 59, 99),
  ('aether-acoustics', 1690000, 2790000, 69, 112),
  ('maison-vera', 1790000, 2990000, 72, 119),
  ('kinetix-proptech', 1890000, 3190000, 76, 129),
  ('pulse-pos-fnb', 1990000, 3390000, 79, 135),
  ('aurelia-resort', 2190000, 3690000, 89, 149),
  ('atelier-canvas', 2290000, 3890000, 92, 155),
  ('meridian-logistics', 2490000, 4190000, 99, 169),
  ('coda-hr-payroll', 2590000, 4390000, 105, 175),
  ('nexus-lake', 2690000, 4490000, 109, 179),
  ('zenith-wealth-fintech', 2790000, 4690000, 112, 189),
  ('velox-ev-motors', 2990000, 4990000, 119, 199),
  ('chronos-horology', 3190000, 5290000, 129, 212),
  ('verdict-graph', 3290000, 5490000, 132, 219),
  ('aegispulse', 3490000, 5490000, 139, 219),
  ('orbitalflow-saas', 3490000, 5790000, 139, 232),
  ('vectradoc-rag', 3590000, 5990000, 145, 239),
  ('fleetpulse-gis', 3690000, 6190000, 149, 249),
  ('medcore-ehr', 3690000, 6190000, 149, 249),
  ('helios-quant-terminal', 3890000, 6490000, 155, 259),
  ('aeroforge-digital-twin', 3990000, 6690000, 159, 269)
) AS v(id, price_vnd, original_price_vnd, price_usd, original_price_usd)
WHERE public.tvt_products.id = v.id;
