/**
 * TVT STUDIO — Instant Order & Inquiry Push Notifier (Supabase Edge Function — Deno)
 * Eliminates Gmail delay: fires a <1s Telegram / Discord alert the moment a client
 * creates an order or submits a consultation request.
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// @ts-ignore Deno.serve
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false }), {
      status: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = (await req.json()) as {
      type: 'order' | 'inquiry';
      code: string;
      clientName: string;
      phone: string;
      summary: string;
      amountLabel?: string;
      channel?: string;
    };

    const lines =
      body.type === 'order'
        ? [
            `<b>[ĐƠN HÀNG MỚI · TVT STUDIO]</b>`,
            `Mã đơn: <code>${body.code}</code>`,
            `Khách: <b>${body.clientName}</b> · ${body.phone}`,
            `Kênh: ${body.channel || 'VietQR'} · Đợt này: <b>${body.amountLabel || '0₫'}</b>`,
            `Chi tiết: ${body.summary}`,
          ]
        : [
            `<b>[YÊU CẦU TƯ VẤN MỚI · TVT STUDIO]</b>`,
            `Mã lead: <code>${body.code}</code>`,
            `Khách: <b>${body.clientName}</b> · ${body.phone}`,
            `Nội dung: ${body.summary}`,
          ];

    const text = lines.join('\n');
    // @ts-ignore Deno global
    const tgToken = Deno.env.get('TELEGRAM_BOT_TOKEN') || '';
    // @ts-ignore Deno global
    const tgChatId = Deno.env.get('TELEGRAM_CHAT_ID') || '';
    // @ts-ignore Deno global
    const discordUrl = Deno.env.get('DISCORD_WEBHOOK_URL') || '';

    const jobs: Promise<unknown>[] = [];
    if (tgToken && tgChatId) {
      jobs.push(
        fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: tgChatId, text, parse_mode: 'HTML' }),
        })
      );
    }
    if (discordUrl) {
      jobs.push(
        fetch(discordUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: text.replace(/<\/?b>/g, '**') }),
        })
      );
    }
    await Promise.all(jobs);

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ ok: false }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
});
