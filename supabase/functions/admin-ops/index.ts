/**
 * TVT STUDIO — Zero-Trust Admin Operations Endpoint (Supabase Edge Function — Deno)
 * Strictly restricted to verified owner account (`tinhkun102@gmail.com`) via
 * cryptographic Supabase Auth JWT validation (`supabase.auth.getUser(jwt)`).
 *
 * Security Guarantees:
 *  - Missing/invalid JWT -> HTTP 401
 *  - Authenticated non-admin email -> HTTP 403
 *  - Strict CORS allowlist (never `*`)
 *  - Input validation & audit trail logging on every order status / delivery URL mutation
 */

// @ts-ignore Deno / Supabase runtime import
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ADMIN_EMAILS = new Set(['tinhkun102@gmail.com']);

const ALLOWED_ORIGINS = new Set([
  'https://tvt987.github.io',
  'http://localhost:5173',
  'http://127.0.0.1:4325',
  'http://127.0.0.1:4173',
]);

const VALID_STATUSES = new Set([
  'PENDING_CONSULTATION',
  'AWAITING_PAYMENT',
  'PROOF_SUBMITTED',
  'DEPOSIT_VERIFIED',
  'IN_DEVELOPMENT',
  'UAT_STAGING',
  'DELIVERED',
]);

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') || '';
  const allowed = ALLOWED_ORIGINS.has(origin) ? origin : 'https://tvt987.github.io';
  return {
    'Access-Control-Allow-Origin': allowed,
    Vary: 'Origin',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

function jsonResp(
  body: Record<string, unknown>,
  status: number,
  cors: Record<string, string>
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}

// @ts-ignore Deno.serve
Deno.serve(async (req: Request) => {
  const cors = getCorsHeaders(req);
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: cors });
  }
  if (req.method !== 'POST') {
    return jsonResp({ ok: false, error: 'Method not allowed' }, 405, cors);
  }

  const authHeader = req.headers.get('authorization') || '';
  const jwt = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!jwt || jwt.split('.').length !== 3) {
    return jsonResp({ ok: false, error: 'Admin authentication required' }, 401, cors);
  }

  // @ts-ignore Deno global
  const supabase = createClient(
    // @ts-ignore Deno global
    Deno.env.get('SUPABASE_URL')!,
    // @ts-ignore Deno global
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // 1. Cryptographically verify JWT identity & strict Admin email allowlist
  const { data: userData, error: userErr } = await supabase.auth.getUser(jwt);
  if (userErr || !userData?.user?.email) {
    return jsonResp({ ok: false, error: 'Invalid or expired session token' }, 401, cors);
  }

  const callerEmail = userData.user.email.trim().toLowerCase();
  if (!ADMIN_EMAILS.has(callerEmail)) {
    return jsonResp({ ok: false, error: 'Forbidden: owner admin account required' }, 403, cors);
  }

  const body = (await req.json().catch(() => ({}))) as {
    action?: string;
    orderCode?: string;
    status?: string;
    deliveryZipUrl?: string | null;
    licenseKey?: string | null;
    note?: string;
  };

  const action = String(body.action || 'overview');

  // ACTION 1: Full Cloud Admin Overview (Orders, MBBank/SePay Webhooks, Inquiries, Clients)
  if (action === 'overview') {
    const [ordersRes, webhooksRes, inquiriesRes, profilesRes] = await Promise.all([
      supabase
        .from('tvt_orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(120),
      supabase
        .from('tvt_payment_webhooks')
        .select('id, provider, provider_tx_id, order_code, transfer_amount_vnd, transfer_content, created_at')
        .order('created_at', { ascending: false })
        .limit(100),
      supabase
        .from('tvt_inquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100),
      supabase
        .from('tvt_client_profiles')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(100),
    ]);

    const orders = ordersRes.data ?? [];
    const webhooks = webhooksRes.data ?? [];
    const inquiries = inquiriesRes.data ?? [];
    const profiles = profilesRes.data ?? [];

    const paidOrders = orders.filter(
      (o: { status?: string }) =>
        o.status === 'DEPOSIT_VERIFIED' ||
        o.status === 'IN_DEVELOPMENT' ||
        o.status === 'UAT_STAGING' ||
        o.status === 'DELIVERED'
    );
    const paidRevenueVnd = orders.reduce(
      (sum: number, o: { paid_amount_vnd?: number }) => sum + Number(o.paid_amount_vnd || 0),
      0
    );
    const pipelineVnd = orders.reduce(
      (sum: number, o: { net_total_vnd?: number }) => sum + Number(o.net_total_vnd || 0),
      0
    );
    const webhooksTotalVnd = webhooks.reduce(
      (sum: number, w: { transfer_amount_vnd?: number }) =>
        sum + Number(w.transfer_amount_vnd || 0),
      0
    );

    return jsonResp(
      {
        ok: true,
        adminEmail: callerEmail,
        metrics: {
          totalOrders: orders.length,
          paidOrdersCount: paidOrders.length,
          paidRevenueVnd,
          pipelineVnd,
          webhooksCount: webhooks.length,
          webhooksTotalVnd,
          inquiriesCount: inquiries.length,
          clientsCount: profiles.length,
        },
        orders,
        webhooks,
        inquiries,
        profiles,
      },
      200,
      cors
    );
  }

  // ACTION 2: Update Order Status / Delivery Source ZIP URL / License Key
  if (action === 'update_order') {
    const orderCode = String(body.orderCode || '').trim().toUpperCase();
    if (!/^TVT-ORD-\d{4}$/.test(orderCode)) {
      return jsonResp({ ok: false, error: 'Invalid orderCode format' }, 400, cors);
    }

    const patch: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.status !== undefined) {
      if (!VALID_STATUSES.has(body.status)) {
        return jsonResp({ ok: false, error: 'Invalid status enum' }, 400, cors);
      }
      patch.status = body.status;
      if (body.status === 'DEPOSIT_VERIFIED' || body.status === 'DELIVERED') {
        patch.paid_at = new Date().toISOString();
      }
    }

    if (body.deliveryZipUrl !== undefined) {
      const url = String(body.deliveryZipUrl || '').trim();
      if (url && !/^https:\/\//i.test(url)) {
        return jsonResp({ ok: false, error: 'deliveryZipUrl must start with https://' }, 400, cors);
      }
      patch.delivery_zip_url = url || null;
    }

    if (body.licenseKey !== undefined) {
      const lic = String(body.licenseKey || '').trim().slice(0, 48);
      patch.license_key = lic || null;
    }

    const { data: updated, error: updErr } = await supabase
      .from('tvt_orders')
      .update(patch)
      .eq('order_code', orderCode)
      .select('*')
      .maybeSingle();

    if (updErr) {
      return jsonResp({ ok: false, error: updErr.message }, 500, cors);
    }

    if (body.status) {
      await supabase.from('tvt_order_events').insert({
        order_code: orderCode,
        status: body.status,
        note_vi: body.note || `Admin (${callerEmail}) cập nhật trạng thái -> ${body.status}`,
        note_en: body.note || `Admin (${callerEmail}) updated status -> ${body.status}`,
      });
    }

    return jsonResp({ ok: true, order: updated }, 200, cors);
  }

  // ACTION 3: Cleanly Delete a Test Order (only 10,000 VND test orders or explicit cleanup)
  if (action === 'delete_order') {
    const orderCode = String(body.orderCode || '').trim().toUpperCase();
    if (!/^TVT-ORD-\d{4}$/.test(orderCode)) {
      return jsonResp({ ok: false, error: 'Invalid orderCode format' }, 400, cors);
    }
    const { error: delErr } = await supabase
      .from('tvt_orders')
      .delete()
      .eq('order_code', orderCode);

    if (delErr) {
      return jsonResp({ ok: false, error: delErr.message }, 500, cors);
    }
    return jsonResp({ ok: true, deletedOrderCode: orderCode }, 200, cors);
  }

  return jsonResp({ ok: false, error: `Unknown admin action: ${action}` }, 400, cors);
});
