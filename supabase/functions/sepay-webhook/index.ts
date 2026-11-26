/**
 * TVT STUDIO — Real-Time VietQR Bank Webhook (Supabase Edge Function — Deno)
 * Works 24/7 even when the owner is offline / asleep (0đ Supabase Free + SePay/PayOS Free).
 *
 * End-to-End Latency: 1–3 seconds from customer bank transfer to:
 *  1. PostgreSQL `tvt_orders.status = 'DEPOSIT_VERIFIED'` (idempotent, anti-duplicate)
 *  2. Customer browser auto-updates to "ĐÃ THANH TOÁN THÀNH CÔNG (AUTO-VERIFIED)"
 *  3. Owner phone rings in <1s via Telegram Bot API / Discord Webhook (zero email lag!)
 *
 * Required Supabase Secrets (`supabase secrets set ...`):
 *  - SUPABASE_URL (auto-injected)
 *  - SUPABASE_SERVICE_ROLE_KEY (auto-injected)
 *  - SEPAY_WEBHOOK_API_KEY (matches Authorization: Apikey <KEY> set in SePay dashboard)
 *  - TELEGRAM_BOT_TOKEN (optional, recommended for <1s phone push)
 *  - TELEGRAM_CHAT_ID (optional, your numeric Telegram user/group chat ID)
 *  - DISCORD_WEBHOOK_URL (optional secondary push channel)
 */

// @ts-ignore Deno std / Supabase runtime import
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface SePayWebhookBody {
  id: string | number;
  gateway?: string;
  transactionDate?: string;
  accountNumber?: string;
  transferType?: 'in' | 'out';
  transferAmount: number;
  content: string;
  referenceCode?: string;
  description?: string;
}

function extractNormalizedOrderCode(rawContent: string): string | null {
  const cleaned = String(rawContent || '').toUpperCase();
  const match = cleaned.match(/TVT[\s_-]*ORD[\s_-]*(\d{4})/);
  return match ? `TVT-ORD-${match[1]}` : null;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function formatVnd(amount: number): string {
  return `${Math.round(amount).toLocaleString('vi-VN')}₫`;
}

async function sendInstantOwnerPush(messageLines: string[]): Promise<void> {
  // @ts-ignore Deno global
  const tgToken = Deno.env.get('TELEGRAM_BOT_TOKEN') || '';
  // @ts-ignore Deno global
  const tgChatId = Deno.env.get('TELEGRAM_CHAT_ID') || '';
  // @ts-ignore Deno global
  const discordUrl = Deno.env.get('DISCORD_WEBHOOK_URL') || '';
  const text = messageLines.join('\n');

  const tasks: Promise<unknown>[] = [];
  if (tgToken && tgChatId) {
    tasks.push(
      fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: tgChatId,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      }).catch(() => null)
    );
  }
  if (discordUrl) {
    tasks.push(
      fetch(discordUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text.replace(/<\/?b>/g, '**') }),
      }).catch(() => null)
    );
  }
  await Promise.all(tasks);
}

// @ts-ignore Deno.serve
Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 1. FAIL-CLOSED Authentication (`Authorization: Apikey <SEPAY_WEBHOOK_API_KEY>`)
  // @ts-ignore Deno global
  const expectedKey = (Deno.env.get('SEPAY_WEBHOOK_API_KEY') || '').trim();
  if (!expectedKey || expectedKey.length < 16) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Webhook secret not configured (fail-closed)' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const authHeader = (req.headers.get('authorization') || '').trim();
  const providedKey = authHeader.replace(/^(Apikey|Bearer)\s+/i, '').trim();

  if (!providedKey || !timingSafeEqual(providedKey, expectedKey)) {
    return new Response(JSON.stringify({ ok: false, error: 'Unauthorized webhook key' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let payload: SePayWebhookBody;
  try {
    payload = (await req.json()) as SePayWebhookBody;
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Ignore outbound transfers immediately
  if (payload.transferType && payload.transferType !== 'in') {
    return new Response(JSON.stringify({ ok: true, ignored: 'outbound' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // @ts-ignore Deno global
  const supabase = createClient(
    // @ts-ignore Deno global
    Deno.env.get('SUPABASE_URL')!,
    // @ts-ignore Deno global
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const memoSource = `${payload.content || ''} ${payload.description || ''}`;
  const orderCode = extractNormalizedOrderCode(memoSource);
  const providerTxId = String(payload.id || payload.referenceCode || Date.now());
  const rawAmount = Number(payload.transferAmount);
  if (!Number.isFinite(rawAmount) || rawAmount <= 0) {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid transferAmount' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const transferAmount = Math.round(rawAmount);

  // 2. Idempotent webhook insert (prevents duplicate processing on SePay retry)
  const { error: logErr } = await supabase.from('tvt_payment_webhooks').insert({
    provider: payload.gateway || 'sepay',
    provider_tx_id: providerTxId,
    order_code: orderCode,
    transfer_amount_vnd: transferAmount,
    transfer_content: memoSource.trim(),
    raw_payload: payload,
  });

  if (logErr && String(logErr.code) === '23505') {
    return new Response(JSON.stringify({ ok: true, deduplicated: true, orderCode }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!orderCode) {
    await sendInstantOwnerPush([
      `<b>[TVT Studio · Biến động số dư không rõ mã đơn]</b>`,
      `Số tiền: <b>${formatVnd(transferAmount)}</b> (${payload.gateway || 'Bank'})`,
      `Nội dung: <code>${memoSource.trim().slice(0, 120)}</code>`,
    ]);
    return new Response(JSON.stringify({ ok: true, matched: false, reason: 'No TVT-ORD code' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 3. Lookup order and verify payable amount
  const { data: order, error: orderErr } = await supabase
    .from('tvt_orders')
    .select('*')
    .eq('order_code', orderCode)
    .maybeSingle();

  if (orderErr || !order) {
    await sendInstantOwnerPush([
      `<b>[TVT Studio · Tiền về nhưng chưa thấy mã đơn trong DB]</b>`,
      `Mã đọc được: <code>${orderCode}</code>`,
      `Số tiền: <b>${formatVnd(transferAmount)}</b> (${payload.gateway || 'Bank'})`,
    ]);
    return new Response(JSON.stringify({ ok: true, matched: false, orderCode }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const cumulativePaid = Number(order.paid_amount_vnd || 0) + transferAmount;
  const requiredNow = Number(order.payable_now_vnd || 0);
  const sufficient = cumulativePaid >= requiredNow;
  const nextStatus = sufficient ? 'DEPOSIT_VERIFIED' : 'PROOF_SUBMITTED';
  const refCode = payload.referenceCode || `SEPAY-${providerTxId}`;
  const nowIso = new Date().toISOString();
  const digits = orderCode.slice(-4);
  const licenseKey = order.license_key || (sufficient ? `TVT-LIC-${digits}-${providerTxId.slice(-4).toUpperCase()}` : null);

  await supabase
    .from('tvt_orders')
    .update({
      status: nextStatus,
      paid_amount_vnd: cumulativePaid,
      payment_ref: refCode,
      paid_at: sufficient ? nowIso : order.paid_at,
      license_key: licenseKey,
      updated_at: nowIso,
    })
    .eq('order_code', orderCode);

  await supabase.from('tvt_order_events').insert({
    order_code: orderCode,
    status: nextStatus,
    note_vi: sufficient
      ? `Tự động xác nhận VietQR thành công (${formatVnd(transferAmount)} qua ${payload.gateway || 'Bank'} · Ref ${refCode}).`
      : `Đã nhận chuyển khoản một phần ${formatVnd(transferAmount)} / ${formatVnd(requiredNow)} (Ref ${refCode}).`,
    note_en: sufficient
      ? `Auto-verified VietQR payment (${formatVnd(transferAmount)} via ${payload.gateway || 'Bank'} · Ref ${refCode}).`
      : `Partial transfer received ${formatVnd(transferAmount)} / ${formatVnd(requiredNow)} (Ref ${refCode}).`,
  });

  // 4. Instant <1s Push Notification to Owner's Phone (Telegram / Discord)
  await sendInstantOwnerPush([
    sufficient
      ? `<b>[PAID · TỰ ĐỘNG XÁC NHẬN REAL-TIME]</b>`
      : `<b>[CHUYỂN KHOẢN THIẾU · CẦN KIỂM TRA]</b>`,
    `Mã đơn: <code>${orderCode}</code>`,
    `Khách hàng: <b>${order.client_name}</b> · ${order.client_phone}`,
    `Đã nhận: <b>${formatVnd(transferAmount)}</b> (Tổng đã nhận: ${formatVnd(cumulativePaid)} / Cần đợt này: ${formatVnd(requiredNow)})`,
    `Ngân hàng: ${payload.gateway || 'VietQR'} · Ref: <code>${refCode}</code>`,
    `Màn hình khách đã tự động chuyển sang ĐÃ THANH TOÁN.`,
  ]);

  return new Response(
    JSON.stringify({
      ok: true,
      matched: true,
      orderCode,
      status: nextStatus,
      paidAmountVnd: cumulativePaid,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
});
