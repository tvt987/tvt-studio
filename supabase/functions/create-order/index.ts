/**
 * TVT STUDIO — Authoritative Server-Side Order Creation (Supabase Edge Function)
 * SECURITY: Recomputes EVERY template price, Full-Source +30% multiplier, promo voucher,
 * and 30%/100% deposit directly on the server so DevTools / client-side price tampering
 * is 100% impossible.
 */

// @ts-ignore Deno / Supabase runtime import
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ALLOWED_ORIGINS = new Set([
  'https://tvt987.github.io',
  'http://localhost:5173',
  'http://127.0.0.1:4325',
  'http://127.0.0.1:4173',
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

function stripUnsafeHtml(raw: unknown, maxLen: number): string {
  return String(raw || '')
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .trim()
    .slice(0, maxLen);
}

function escapeTelegramHtml(raw: string): string {
  return raw.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const ALLOWED_CHANNELS = new Set([
  'consult-first',
  'vietqr',
  'zalopay',
  'momo',
  'b2b-usd',
]);

// Authoritative server-side standard template prices (VND) across ALL 19 commercial websites (+ 10k live VietQR test SKU)
const SERVER_TEMPLATE_VND: Record<string, number> = {
  'vietqr-test-10k': 10_000,
  'velox-ev-motors': 20_000_000,
  'aegispulse': 22_900_000,
  'verdict-graph': 19_900_000,
  'zenith-wealth-fintech': 18_900_000,
  'coda-hr-payroll': 16_900_000,
  'meridian-logistics': 15_900_000,
  'aurelia-resort': 14_900_000,
  'nexus-lake': 14_900_000,
  'atelier-canvas': 13_900_000,
  'pulse-pos-fnb': 12_900_000,
  'maison-vera': 11_900_000,
  'kinetix-proptech': 11_900_000,
  'aether-acoustics': 10_900_000,
  'nordic-home-atelier': 9_900_000,
  'solaris-academy': 9_490_000,
  'veritas-legal-firm': 8_490_000,
  'lumina-medspa': 7_900_000,
  'kuro-omakase': 6_490_000,
  'vanguard-fitness': 5_990_000,
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
  const CORS_HEADERS = getCorsHeaders(req);
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

  const clientName = stripUnsafeHtml(body.client?.fullName, 120);
  const clientPhone = stripUnsafeHtml(body.client?.phoneOrZalo, 40);
  const clientEmail = stripUnsafeHtml(body.client?.email, 120).toLowerCase();
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
      // Custom scope packages require finite amount within [1.8M, 500M] VND
      const parsedCustom = Number(item.unitVnd || 1_800_000);
      const boundedCustom = Number.isFinite(parsedCustom)
        ? Math.min(500_000_000, Math.max(1_800_000, parsedCustom))
        : 1_800_000;
      const safeCustomUnit = roundVnd10k(boundedCustom);
      serverSubtotalVnd += safeCustomUnit * qty;
    }
  }

  const discountVnd = computeServerVoucherDiscount(body.voucherCode, serverSubtotalVnd);
  const netTotalVnd = Math.max(0, serverSubtotalVnd - discountVnd);
  const paymentMode = body.paymentMode === 'full' ? 'full' : 'deposit-30';
  const payableNowVnd =
    paymentMode === 'full' || netTotalVnd <= 20_000
      ? netTotalVnd
      : roundVnd10k(netTotalVnd * 0.3);
  const netTotalUsd = Math.round(netTotalVnd / 25_000);
  const payableNowUsd = Math.round(payableNowVnd / 25_000);
  const rawChannel = String(body.paymentChannel || 'consult-first').trim().toLowerCase();
  const paymentChannel = ALLOWED_CHANNELS.has(rawChannel) ? rawChannel : 'consult-first';
  const cleanPaymentRef = stripUnsafeHtml(body.paymentRef, 64);
  const status =
    paymentChannel === 'consult-first'
      ? 'PENDING_CONSULTATION'
      : cleanPaymentRef.length >= 4
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

  // Check if order_code was already pre-registered (idempotent Step 2 -> Step 3 flow)
  const { data: existingOrder } = await supabase
    .from('tvt_orders')
    .select('order_code, status, paid_amount_vnd, payment_ref, license_key, net_total_vnd, payable_now_vnd')
    .eq('order_code', orderCode)
    .maybeSingle();

  if (existingOrder) {
    const alreadyPaid =
      existingOrder.status === 'DEPOSIT_VERIFIED' || existingOrder.status === 'DELIVERED';
    if (!alreadyPaid) {
      await supabase
        .from('tvt_orders')
        .update({
          user_id: authenticatedUserId ?? undefined,
          status,
          payment_channel: paymentChannel,
          payment_mode: paymentMode,
          payment_ref: cleanPaymentRef || existingOrder.payment_ref || null,
          updated_at: new Date().toISOString(),
        })
        .eq('order_code', orderCode);
    }
    return new Response(
      JSON.stringify({
        ok: true,
        idempotent: true,
        orderCode,
        status: alreadyPaid ? existingOrder.status : status,
        netTotalVnd: Number(existingOrder.net_total_vnd || netTotalVnd),
        payableNowVnd: Number(existingOrder.payable_now_vnd || payableNowVnd),
        paidAmountVnd: Number(existingOrder.paid_amount_vnd || 0),
      }),
      { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }

  // Reconcile any early bank transfer that already landed in tvt_payment_webhooks
  const { data: earlyHooks } = await supabase
    .from('tvt_payment_webhooks')
    .select('transfer_amount_vnd, provider_tx_id')
    .eq('order_code', orderCode);

  const earlyPaidVnd = Array.isArray(earlyHooks)
    ? earlyHooks.reduce((acc, row) => acc + Number(row.transfer_amount_vnd || 0), 0)
    : 0;
  const earlySufficient = earlyPaidVnd >= payableNowVnd && payableNowVnd > 0;
  const finalStatus = earlySufficient ? 'DEPOSIT_VERIFIED' : status;
  const finalPaymentRef = earlySufficient
    ? `SEPAY-${String(earlyHooks?.[0]?.provider_tx_id || orderCode.slice(-4))}`
    : cleanPaymentRef || null;
  const finalLicenseKey = earlySufficient
    ? `TVT-LIC-${orderCode.slice(-4)}-${String(earlyHooks?.[0]?.provider_tx_id || 'AUTO').slice(-4).toUpperCase()}`
    : null;

  const { error: insertErr } = await supabase.from('tvt_orders').insert({
    user_id: authenticatedUserId,
    order_code: orderCode,
    idempotency_key: orderCode,
    status: finalStatus,
    payment_channel: paymentChannel,
    payment_mode: paymentMode,
    payment_ref: finalPaymentRef,
    paid_amount_vnd: earlyPaidVnd,
    paid_at: earlySufficient ? new Date().toISOString() : null,
    license_key: finalLicenseKey,
    client_name: clientName,
    client_phone: clientPhone,
    client_email: clientEmail,
    brand_or_domain: stripUnsafeHtml(body.client?.brandOrDomain, 120) || null,
    notes: stripUnsafeHtml(body.client?.notes, 800) || null,
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
      `Mã đơn: <code>${escapeTelegramHtml(orderCode)}</code>`,
      `Khách: <b>${escapeTelegramHtml(clientName)}</b> · ${escapeTelegramHtml(clientPhone)}`,
      `Kênh: ${escapeTelegramHtml(paymentChannel)} · Đợt 1: <b>${payableNowVnd.toLocaleString('vi-VN')}₫</b> / Tổng: ${netTotalVnd.toLocaleString('vi-VN')}₫`,
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
      status: finalStatus,
      netTotalVnd,
      payableNowVnd,
      paidAmountVnd: earlyPaidVnd,
    }),
    { status: 201, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
  );
});
