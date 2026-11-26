-- ============================================================================
-- TVT STUDIO — PRODUCTION POSTGRESQL / SUPABASE SCHEMA (FREE TIER READY: 0đ)
-- Supports: Order Persistence, Real-Time Auto-Verified VietQR Webhooks
--           (SePay / PayOS / Casso), Non-PII Live Payment Status RPC,
--           Audit Timeline Events, and Custom Consultation Leads.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Orders Ledger (Protected by unique order_code + idempotency_key)
CREATE TABLE IF NOT EXISTS public.tvt_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code TEXT NOT NULL UNIQUE,
  idempotency_key TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'AWAITING_PAYMENT'
    CHECK (status IN (
      'PENDING_CONSULTATION',
      'AWAITING_PAYMENT',
      'PROOF_SUBMITTED',
      'DEPOSIT_VERIFIED',
      'IN_DEVELOPMENT',
      'UAT_STAGING',
      'DELIVERED'
    )),
  payment_channel TEXT NOT NULL,
  payment_mode TEXT NOT NULL,
  payment_ref TEXT,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT NOT NULL,
  brand_or_domain TEXT,
  notes TEXT,
  net_total_vnd BIGINT NOT NULL CHECK (net_total_vnd >= 0),
  net_total_usd INTEGER NOT NULL CHECK (net_total_usd >= 0),
  payable_now_vnd BIGINT NOT NULL CHECK (payable_now_vnd >= 0),
  payable_now_usd INTEGER NOT NULL CHECK (payable_now_usd >= 0),
  paid_amount_vnd BIGINT NOT NULL DEFAULT 0,
  paid_at TIMESTAMPTZ,
  items_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  milestones_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tvt_orders_status ON public.tvt_orders(status);
CREATE INDEX IF NOT EXISTS idx_tvt_orders_created_at ON public.tvt_orders(created_at DESC);

-- 2. Immutable Order Audit & Status Timeline
CREATE TABLE IF NOT EXISTS public.tvt_order_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code TEXT NOT NULL REFERENCES public.tvt_orders(order_code) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note_vi TEXT NOT NULL,
  note_en TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Idempotent Bank VietQR Webhook Log (SePay / PayOS / Casso)
CREATE TABLE IF NOT EXISTS public.tvt_payment_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  provider_tx_id TEXT NOT NULL UNIQUE,
  order_code TEXT REFERENCES public.tvt_orders(order_code) ON DELETE SET NULL,
  transfer_amount_vnd BIGINT NOT NULL,
  transfer_content TEXT NOT NULL,
  raw_payload JSONB NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Custom Project Inquiries / Negotiations
CREATE TABLE IF NOT EXISTS public.tvt_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_code TEXT NOT NULL UNIQUE,
  product_name TEXT,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT NOT NULL,
  preferred_language TEXT NOT NULL DEFAULT 'Flexible',
  budget_note TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Strict Zero-Trust Row Level Security
-- ZERO direct anon SELECT / UPDATE / DELETE on any table.
-- Orders are created EXCLUSIVELY through `supabase/functions/create-order` (server-side price validation!)
-- Payments are confirmed EXCLUSIVELY through `supabase/functions/sepay-webhook` (fail-closed API key!).
ALTER TABLE public.tvt_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tvt_order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tvt_payment_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tvt_inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_anon_insert_orders" ON public.tvt_orders;

DROP POLICY IF EXISTS "allow_anon_insert_inquiries" ON public.tvt_inquiries;
CREATE POLICY "allow_anon_insert_inquiries"
  ON public.tvt_inquiries FOR INSERT TO anon WITH CHECK (true);

-- 6. Zero-PII Real-Time Payment Status RPC (Called every 3s by Checkout / Order Tracker)
-- Returns ONLY non-sensitive payment confirmation state for the exact requested order_code.
CREATE OR REPLACE FUNCTION public.get_order_payment_status(p_order_code TEXT)
RETURNS TABLE (
  order_code TEXT,
  status TEXT,
  paid_amount_vnd BIGINT,
  payment_ref TEXT,
  paid_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    o.order_code,
    o.status,
    o.paid_amount_vnd,
    o.payment_ref,
    o.paid_at,
    o.updated_at
  FROM public.tvt_orders o
  WHERE UPPER(o.order_code) = UPPER(TRIM(p_order_code))
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_order_payment_status(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_order_payment_status(TEXT) TO anon, authenticated;
