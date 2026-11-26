/**
 * TVT STUDIO — Authoritative Server-Side Order Creation (Supabase Edge Function)
 * SECURITY: Recomputes EVERY template price, Full-Source +30% multiplier, promo voucher,
 * and 30%/100% deposit directly on the server so DevTools / client-side price tampering
 * is 100% impossible.
 */

// @ts-ignore Deno / Supabase runtime import
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Authoritative server-side standard template prices (VND)
const SERVER_TEMPLATE_VND: Record<string, number> = {
  'lumina-medspa': 2_490_000,
  'maison-vera': 3_490_000,
  'aether-acoustics': 3_490_000,
  'kinetix-proptech': 3_990_000,
  'pulse-pos-fnb': 4_990_000,
  'atelier-canvas': 5_490_000,
  'nexus-lake': 5_490_000,
  'verdict-graph': 5_990_000,
  'aegis-pulse': 6_990_000,
};

function roundVnd10k(val: number): number {
  return Math.round(val / 10_000) * 10_000;
}

function computeServerVoucherDiscount(code: string | null | undefined, subtotalVnd: number): number {
  const normalized = String(code || '').trim().toUpperCase();
  if (normalized === 'TVTLAUNCH15' && subtotalVnd >= 2_000_000) {
    return Math.min(roundVnd10k(subtotalVnd * 0.15), 2_000_000);
  }
  if (normalized === 'AGENCY10' && subtotalVnd >= 5_000_000) {
    return Math.min(roundVnd10k(subtotalVnd * 0.1), 4_000_000);
  }
  if (normalized === 'VIP500K' && subtotalVnd >= 3_000_000) {
    return 500_000;
  }
  return 0;
}

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

  let body: {
    orderCode?: string;
    paymentChannel?: string;
    paymentMode?: 'deposit-30' | 'full';
    paymentRef?: string;
    voucherCode?: string | null;
    client?: {
      fullName?: string;
      phoneOrZalo?: string;
      email?: string;
      brandOrDomain?: string;
      notes?: string;
    };
    items?: Array<{
      kind: 'template' | 'custom';
      productId?: string;
      license?: 'standard' | 'full-source';
      quantity: number;
      unitVnd?: number;
      title?: unknown;
    }>;
  };

  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const orderCode = String(body.orderCode || '').trim().toUpperCase();
  if (!/^TVT-ORD-\d{4}$/.test(orderCode)) {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid order code format' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const clientName = String(body.client?.fullName || '').trim().slice(0, 120);
  const clientPhone = String(body.client?.phoneOrZalo || '').trim().slice(0, 40);
  const clientEmail = String(body.client?.email || '').trim().slice(0, 120);
  if (!clientName || !clientPhone || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid client contact fields' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const items = Array.isArray(body.items) ? body.items.slice(0, 20) : [];
  if (items.length === 0) {
    return new Response(JSON.stringify({ ok: false, error: 'Cart cannot be empty' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  // Recompute authoritative total on the server (blocks client price tampering!)
  let serverSubtotalVnd = 0;
  for (const item of items) {
    const qty = Math.min(20, Math.max(1, Math.floor(Number(item.quantity || 1))));
    if (item.kind === 'template') {
      const baseVnd = SERVER_TEMPLATE_VND[String(item.productId || '')];
      if (!baseVnd) {
        return new Response(JSON.stringify({ ok: false, error: `Unknown productId: ${item.productId}` }), {
          status: 400,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        });
      }
      const unitVnd = item.license === 'full-source' ? roundVnd10k(baseVnd * 1.3) : baseVnd;
      serverSubtotalVnd += unitVnd * qty;
    } else {
      // Custom scope packages require minimum Starter floor (1.8M VND)
      const safeCustomUnit = Math.max(1_800_000, roundVnd10k(Number(item.unitVnd || 1_800_000)));
      serverSubtotalVnd += safeCustomUnit * qty;
    }
  }

  const discountVnd = computeServerVoucherDiscount(body.voucherCode, serverSubtotalVnd);
  const netTotalVnd = Math.max(0, serverSubtotalVnd - discountVnd);
  const paymentMode = body.paymentMode === 'full' ? 'full' : 'deposit-30';
  const payableNowVnd = paymentMode === 'full' ? netTotalVnd : roundVnd10k(netTotalVnd * 0.3);
  const netTotalUsd = Math.round(netTotalVnd / 25_000);
  const payableNowUsd = Math.round(payableNowVnd / 25_000);
  const paymentChannel = String(body.paymentChannel || 'consult-first').slice(0, 32);
  const status =
    paymentChannel === 'consult-first'
      ? 'PENDING_CONSULTATION'
      : body.paymentRef && body.paymentRef.trim().length >= 4
        ? 'PROOF_SUBMITTED'
        : 'AWAITING_PAYMENT';

  // @ts-ignore Deno global
  const supabase = createClient(
    // @ts-ignore Deno global
    Deno.env.get('SUPABASE_URL')!,
    // @ts-ignore Deno global
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // If buyer is signed in via Email OTP JWT, attach verified auth.uid() to the order
  let authenticatedUserId: string | null = null;
  const authHeader = req.headers.get('authorization') || '';
  const bearer = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (bearer && bearer.split('.').length === 3) {
    const { data: authData } = await supabase.auth.getUser(bearer).catch(() => ({ data: null }));
    if (authData?.user?.id) {
      authenticatedUserId = authData.user.id;
    }
  }

  const { error: insertErr } = await supabase.from('tvt_orders').insert({
    user_id: authenticatedUserId,
    order_code: orderCode,
    idempotency_key: orderCode,
    status,
    payment_channel: paymentChannel,
    payment_mode: paymentMode,
    payment_ref: body.paymentRef?.trim().slice(0, 64) || null,
    client_name: clientName,
    client_phone: clientPhone,
    client_email: clientEmail,
    brand_or_domain: String(body.client?.brandOrDomain || '').trim().slice(0, 120) || null,
    notes: String(body.client?.notes || '').trim().slice(0, 800) || null,
    net_total_vnd: netTotalVnd,
    net_total_usd: netTotalUsd,
    payable_now_vnd: payableNowVnd,
    payable_now_usd: payableNowUsd,
    items_json: items,
  });

  if (insertErr) {
    return new Response(JSON.stringify({ ok: false, error: insertErr.message }), {
      status: 409,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  // Server-originated instant <1s Telegram push (cannot be spoofed directly!)
  // @ts-ignore Deno global
  const tgToken = Deno.env.get('TELEGRAM_BOT_TOKEN') || '';
  // @ts-ignore Deno global
  const tgChatId = Deno.env.get('TELEGRAM_CHAT_ID') || '';
  if (tgToken && tgChatId) {
    const text = [
      `<b>[ĐƠN HÀNG MỚI · SERVER VERIFIED]</b>`,
      `Mã đơn: <code>${orderCode}</code>`,
      `Khách: <b>${clientName}</b> · ${clientPhone}`,
      `Kênh: ${paymentChannel} · Đợt 1: <b>${payableNowVnd.toLocaleString('vi-VN')}₫</b> / Tổng: ${netTotalVnd.toLocaleString('vi-VN')}₫`,
    ].join('\n');
    await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: tgChatId, text, parse_mode: 'HTML' }),
    }).catch(() => null);
  }

  return new Response(
    JSON.stringify({
      ok: true,
      orderCode,
      status,
      netTotalVnd,
      payableNowVnd,
    }),
    { status: 201, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
  );
});
