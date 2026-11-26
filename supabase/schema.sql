-- ============================================================================
-- TVT STUDIO — PRODUCTION POSTGRESQL / SUPABASE SCHEMA (FREE TIER: 0đ)
-- Supports:
--  1. Free Email OTP / Magic Link Auth (50,000 MAU free on Supabase Auth)
--  2. Client Saved Billing Profiles (`tvt_client_profiles`)
--  3. Server-Verified Orders & Permanent Source Code Vault (`tvt_orders`)
--  4. Private Source Package Catalog (`tvt_product_deliverables`)
--  5. Fail-Closed Real-Time SePay/PayOS Webhooks + Zero-PII Live Status RPC
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Client Saved Billing & Contact Profiles (1-Click Checkout Auto-Fill)
CREATE TABLE IF NOT EXISTS public.tvt_client_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  phone_or_zalo TEXT NOT NULL DEFAULT '',
  brand_or_domain TEXT NOT NULL DEFAULT '',
  preferred_channel TEXT NOT NULL DEFAULT 'vietqr',
  billing_note TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Private Product Deliverable Catalog (Stores Storage object path for each template)
CREATE TABLE IF NOT EXISTS public.tvt_product_deliverables (
  product_id TEXT PRIMARY KEY,
  storage_bucket TEXT NOT NULL DEFAULT 'source-packages',
  storage_path TEXT NOT NULL,
  repo_url TEXT,
  docs_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Orders Ledger & Permanent License / Source Recovery Vault
CREATE TABLE IF NOT EXISTS public.tvt_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
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
  license_key TEXT,
  delivery_repo_url TEXT,
  delivery_zip_url TEXT,
  delivery_docs_url TEXT,
  download_count INTEGER NOT NULL DEFAULT 0,
  items_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  milestones_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tvt_orders_status ON public.tvt_orders(status);
CREATE INDEX IF NOT EXISTS idx_tvt_orders_user_id ON public.tvt_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_tvt_orders_client_email ON public.tvt_orders(LOWER(client_email));
CREATE INDEX IF NOT EXISTS idx_tvt_orders_created_at ON public.tvt_orders(created_at DESC);

-- 4. Immutable Order Audit & Status Timeline
CREATE TABLE IF NOT EXISTS public.tvt_order_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code TEXT NOT NULL REFERENCES public.tvt_orders(order_code) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note_vi TEXT NOT NULL,
  note_en TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Idempotent Bank VietQR Webhook Log (SePay / PayOS / Casso)
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

-- 6. Custom Project Inquiries / Negotiations
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

-- 7. Strict Zero-Trust Row Level Security
ALTER TABLE public.tvt_client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tvt_product_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tvt_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tvt_order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tvt_payment_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tvt_inquiries ENABLE ROW LEVEL SECURITY;

-- Logged-in clients can ONLY manage their own saved billing profile
DROP POLICY IF EXISTS "client_manage_own_profile" ON public.tvt_client_profiles;
CREATE POLICY "client_manage_own_profile"
  ON public.tvt_client_profiles
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Logged-in clients can ONLY read their own past orders & source vault (never modify prices/status!)
DROP POLICY IF EXISTS "client_read_own_orders" ON public.tvt_orders;
CREATE POLICY "client_read_own_orders"
  ON public.tvt_orders
  FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id
    OR LOWER(client_email) = LOWER(COALESCE(auth.jwt() ->> 'email', ''))
  );

-- Logged-in clients can read audit events strictly for their own orders
DROP POLICY IF EXISTS "client_read_own_order_events" ON public.tvt_order_events;
CREATE POLICY "client_read_own_order_events"
  ON public.tvt_order_events
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tvt_orders o
      WHERE o.order_code = tvt_order_events.order_code
        AND (
          o.user_id = auth.uid()
          OR LOWER(o.client_email) = LOWER(COALESCE(auth.jwt() ->> 'email', ''))
        )
    )
  );

-- Public inquiries can be submitted without login (zero SELECT for anon)
DROP POLICY IF EXISTS "allow_anon_insert_inquiries" ON public.tvt_inquiries;
CREATE POLICY "allow_anon_insert_inquiries"
  ON public.tvt_inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);

-- 8. Zero-PII Real-Time Payment Status RPC (Only returns non-sensitive payment state)
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
