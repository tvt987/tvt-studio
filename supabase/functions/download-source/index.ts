/**
 * TVT STUDIO — Secure Signed Source Code Re-Download Endpoint (Supabase Edge Function)
 * Allows authenticated buyers to re-download purchased source packages anytime —
 * even years later if they accidentally deleted their local copy — while preventing
 * unauthorized link sharing (every download issues a fresh 5-minute signed URL).
 */

// @ts-ignore Deno / Supabase runtime import
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const UNLOCKED_STATUSES = new Set([
  'DEPOSIT_VERIFIED',
  'IN_DEVELOPMENT',
  'UAT_STAGING',
  'DELIVERED',
]);

// @ts-ignore Deno.serve
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const authHeader = req.headers.get('authorization') || '';
  const jwt = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!jwt) {
    return new Response(JSON.stringify({ ok: false, error: 'Authentication required' }), {
      status: 401,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  // @ts-ignore Deno global
  const supabase = createClient(
    // @ts-ignore Deno global
    Deno.env.get('SUPABASE_URL')!,
    // @ts-ignore Deno global
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // 1. Verify buyer's JWT identity cryptographically
  const { data: userData, error: userErr } = await supabase.auth.getUser(jwt);
  if (userErr || !userData?.user) {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid or expired session' }), {
      status: 401,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const body = (await req.json().catch(() => ({}))) as { orderCode?: string };
  const orderCode = String(body.orderCode || '').trim().toUpperCase();
  if (!orderCode) {
    return new Response(JSON.stringify({ ok: false, error: 'Missing orderCode' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  // 2. Confirm ownership AND verified payment status
  const { data: order } = await supabase
    .from('tvt_orders')
    .select('*')
    .eq('order_code', orderCode)
    .maybeSingle();

  const buyerEmail = (userData.user.email || '').toLowerCase();
  const isOwner =
    order &&
    (order.user_id === userData.user.id ||
      String(order.client_email || '').toLowerCase() === buyerEmail);

  if (!isOwner) {
    return new Response(JSON.stringify({ ok: false, error: 'Order not found for this account' }), {
      status: 403,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  if (!UNLOCKED_STATUSES.has(order.status)) {
    return new Response(JSON.stringify({ ok: false, error: 'Payment not yet verified' }), {
      status: 402,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  // 3. Increment download audit counter
  await supabase
    .from('tvt_orders')
    .update({ download_count: Number(order.download_count || 0) + 1 })
    .eq('order_code', orderCode);

  // 4. Return direct delivery URL or mint 5-minute signed Private Storage URL
  if (order.delivery_zip_url && /^https:\/\//i.test(order.delivery_zip_url)) {
    return new Response(
      JSON.stringify({ ok: true, downloadUrl: order.delivery_zip_url, expiresInSeconds: 300 }),
      { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }

  const firstTemplate = Array.isArray(order.items_json)
    ? order.items_json.find((i: { kind?: string; productId?: string }) => i.kind === 'template')
    : null;

  if (firstTemplate?.productId) {
    const { data: pkg } = await supabase
      .from('tvt_product_deliverables')
      .select('*')
      .eq('product_id', firstTemplate.productId)
      .maybeSingle();

    if (pkg?.storage_bucket && pkg?.storage_path) {
      const { data: signed } = await supabase.storage
        .from(pkg.storage_bucket)
        .createSignedUrl(pkg.storage_path, 300);
      if (signed?.signedUrl) {
        return new Response(
          JSON.stringify({ ok: true, downloadUrl: signed.signedUrl, expiresInSeconds: 300 }),
          { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      }
    }
  }

  return new Response(
    JSON.stringify({ ok: false, error: 'Source package not yet uploaded to storage' }),
    { status: 404, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
  );
});
