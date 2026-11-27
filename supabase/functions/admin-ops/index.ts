// TVT STUDIO v5.0 — Zero-Trust Executive Admin Operations (Supabase Edge Function)
// Strictly restricted to verified owner JWT (tinhkun102@gmail.com)
// Supports: overview (with 14d Traffic/Revenue Analytics + Funnel + Top Products),
//           upsert_product, quick_update_price, delete_product, bulk_seed_products,
//           update_order, delete_order.

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

const VALID_CATEGORIES = new Set([
  'commerce-3d',
  'clinic-proptech',
  'pos-fnb',
  'enterprise-b2b',
  'saas-ai',
]);

const CATEGORY_LABELS: Record<string, { vi: string; en: string }> = {
  'commerce-3d': { vi: 'Bán Hàng 3D & Nội Thất', en: '3D Commerce & Interior' },
  'clinic-proptech': { vi: 'Y Tế, BĐS & Wellness', en: 'Clinic, PropTech & Wellness' },
  'pos-fnb': { vi: 'Nhà Hàng, Resort & POS', en: 'Hospitality & POS' },
  'enterprise-b2b': { vi: 'Doanh Nghiệp, HR & FinTech', en: 'Enterprise, EdTech & FinTech' },
  'saas-ai': { vi: 'SaaS & AI', en: 'SaaS & AI' },
};

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

function cleanText(raw: unknown, maxLen: number): string {
  return String(raw ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .trim()
    .slice(0, maxLen);
}

function cleanStringArray(raw: unknown, maxItems: number, maxLen: number): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .slice(0, maxItems)
    .map((item) => cleanText(item, maxLen))
    .filter(Boolean);
}

function toVnDateKey(isoOrDate: string | Date): string {
  const dt = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
  if (Number.isNaN(dt.getTime())) return '';
  const vnMs = dt.getTime() + 7 * 60 * 60 * 1000;
  return new Date(vnMs).toISOString().slice(0, 10);
}

interface ProductInput {
  id?: string;
  sku?: string;
  name?: string;
  subtitleVi?: string;
  subtitleEn?: string;
  taglineVi?: string;
  taglineEn?: string;
  category?: string;
  categoryLabelVi?: string;
  categoryLabelEn?: string;
  priceVnd?: number;
  originalPriceVnd?: number;
  priceUsd?: number;
  originalPriceUsd?: number;
  deliveryDaysMin?: number;
  deliveryDaysMax?: number;
  liveUrl?: string;
  previewImage?: string;
  previewBadge?: string;
  featuredRank?: number;
  stack?: string[];
  deliverablesVi?: string[];
  deliverablesEn?: string[];
  architectureNoteVi?: string;
  architectureNoteEn?: string;
  metricsBadge?: string;
  isActive?: boolean;
}

function sanitizeProductRow(input: ProductInput): { ok: true; row: Record<string, unknown> } | { ok: false; error: string } {
  const id = cleanText(input.id, 64).toLowerCase();
  if (!/^[a-z0-9][a-z0-9-]{1,63}$/.test(id)) {
    return { ok: false, error: 'Product id must be slug format (lowercase letters, digits, hyphens)' };
  }
  const name = cleanText(input.name, 120);
  if (name.length < 2) {
    return { ok: false, error: 'Product name is required (min 2 chars)' };
  }
  const sku = cleanText(input.sku || `TVT-${id.slice(0, 6).toUpperCase()}`, 32).toUpperCase();
  const category = VALID_CATEGORIES.has(String(input.category || ''))
    ? String(input.category)
    : 'saas-ai';

  const priceVnd = Math.round(Number(input.priceVnd || 0));
  if (!Number.isFinite(priceVnd) || priceVnd < 10_000 || priceVnd > 5_000_000_000) {
    return { ok: false, error: 'priceVnd must be between 10,000 and 5,000,000,000 VND' };
  }
  const rawOrigVnd = Math.round(Number(input.originalPriceVnd || Math.round(priceVnd * 1.45)));
  const originalPriceVnd = Math.max(priceVnd, Math.min(8_000_000_000, rawOrigVnd));

  const priceUsd = Math.max(1, Math.round(Number(input.priceUsd || Math.round(priceVnd / 25_000))));
  const originalPriceUsd = Math.max(
    priceUsd,
    Math.round(Number(input.originalPriceUsd || Math.round(originalPriceVnd / 25_000)))
  );

  const liveUrl = cleanText(input.liveUrl, 240);
  if (liveUrl && !/^https:\/\//i.test(liveUrl)) {
    return { ok: false, error: 'liveUrl must start with https://' };
  }
  const previewImage = cleanText(input.previewImage || './media/studio-emblem.webp', 240);
  if (previewImage && !/^(\.\/media\/|https:\/\/)/i.test(previewImage)) {
    return { ok: false, error: 'previewImage must start with ./media/ or https://' };
  }

  const minDays = Math.max(1, Math.min(90, Math.round(Number(input.deliveryDaysMin || 3))));
  const maxDays = Math.max(minDays, Math.min(180, Math.round(Number(input.deliveryDaysMax || minDays + 3))));
  const featuredRank = Math.max(1, Math.min(999, Math.round(Number(input.featuredRank || 20))));
  const defaultCatLabel = CATEGORY_LABELS[category] ?? CATEGORY_LABELS['saas-ai'];
  const metricsBadge = cleanText(input.metricsBadge || input.previewBadge || 'PRODUCTION READY', 80);

  return {
    ok: true,
    row: {
      id,
      sku,
      name,
      subtitle_vi: cleanText(input.subtitleVi, 160),
      subtitle_en: cleanText(input.subtitleEn || input.subtitleVi, 160),
      tagline_vi: cleanText(input.taglineVi, 420),
      tagline_en: cleanText(input.taglineEn || input.taglineVi, 420),
      category,
      category_label_vi: cleanText(input.categoryLabelVi || defaultCatLabel.vi, 60),
      category_label_en: cleanText(input.categoryLabelEn || defaultCatLabel.en, 60),
      price_vnd: priceVnd,
      original_price_vnd: originalPriceVnd,
      price_usd: priceUsd,
      original_price_usd: originalPriceUsd,
      delivery_days_min: minDays,
      delivery_days_max: maxDays,
      live_url: liveUrl,
      preview_image: previewImage || './media/studio-emblem.webp',
      preview_badge: cleanText(input.previewBadge || metricsBadge, 80) || null,
      featured_rank: featuredRank,
      stack_json: cleanStringArray(input.stack, 8, 32),
      deliverables_vi: cleanStringArray(input.deliverablesVi, 8, 220),
      deliverables_en: cleanStringArray(input.deliverablesEn, 8, 220),
      architecture_note_vi: cleanText(input.architectureNoteVi, 320),
      architecture_note_en: cleanText(input.architectureNoteEn || input.architectureNoteVi, 320),
      metrics_badge: metricsBadge,
      is_active: input.isActive !== false,
      updated_at: new Date().toISOString(),
    },
  };
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

  // 1. Cryptographically verify JWT & strict owner email allowlist
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
    product?: ProductInput;
    products?: ProductInput[];
    productId?: string;
    priceVnd?: number;
    originalPriceVnd?: number;
    featuredRank?: number;
    isActive?: boolean;
  };

  const action = String(body.action || 'overview');

  // ACTION 1: Full Executive Overview (Orders, Webhooks, Inquiries, Clients, Products CMS, 14-Day Analytics)
  if (action === 'overview') {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const [ordersRes, webhooksRes, inquiriesRes, profilesRes, productsRes, eventsRes] =
      await Promise.all([
        supabase
          .from('tvt_orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(200),
        supabase
          .from('tvt_payment_webhooks')
          .select('id, provider, provider_tx_id, order_code, transfer_amount_vnd, transfer_content, received_at')
          .order('received_at', { ascending: false })
          .limit(120),
        supabase
          .from('tvt_inquiries')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(120),
        supabase
          .from('tvt_client_profiles')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(120),
        supabase
          .from('tvt_products')
          .select('*')
          .order('featured_rank', { ascending: true })
          .order('updated_at', { ascending: false })
          .limit(200),
        supabase
          .from('tvt_analytics_events')
          .select('event_type, session_id, product_id, path, locale, created_at')
          .gte('created_at', thirtyDaysAgo)
          .order('created_at', { ascending: false })
          .limit(10000),
      ]);

    const orders = ordersRes.data ?? [];
    const webhooks = (webhooksRes.data ?? []).map((w: Record<string, unknown>) => ({
      ...w,
      created_at: w.received_at ?? w.created_at ?? new Date().toISOString(),
    }));
    const inquiries = inquiriesRes.data ?? [];
    const profiles = profilesRes.data ?? [];
    const products = productsRes.data ?? [];
    const events = eventsRes.data ?? [];

    const paidStatuses = new Set(['DEPOSIT_VERIFIED', 'IN_DEVELOPMENT', 'UAT_STAGING', 'DELIVERED']);
    const paidOrders = orders.filter((o: { status?: string }) => paidStatuses.has(String(o.status || '')));
    const paidRevenueVnd = orders.reduce(
      (sum: number, o: { paid_amount_vnd?: number; payable_now_vnd?: number; status?: string }) => {
        const paid = Number(o.paid_amount_vnd || 0);
        if (paid > 0) return sum + paid;
        return paidStatuses.has(String(o.status || '')) ? sum + Number(o.payable_now_vnd || 0) : sum;
      },
      0
    );
    const pipelineVnd = orders.reduce(
      (sum: number, o: { net_total_vnd?: number }) => sum + Number(o.net_total_vnd || 0),
      0
    );
    const webhooksTotalVnd = webhooks.reduce(
      (sum: number, w: { transfer_amount_vnd?: number }) => sum + Number(w.transfer_amount_vnd || 0),
      0
    );

    // Build 14-day Vietnam-timezone daily series
    const todayVn = toVnDateKey(new Date());
    const dailyMap = new Map<
      string,
      {
        date: string;
        label: string;
        visits: number;
        sessions: Set<string>;
        orders: number;
        revenueVnd: number;
      }
    >();
    for (let i = 13; i >= 0; i -= 1) {
      const dt = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = toVnDateKey(dt);
      const label = `${key.slice(8, 10)}/${key.slice(5, 7)}`;
      dailyMap.set(key, {
        date: key,
        label,
        visits: 0,
        sessions: new Set<string>(),
        orders: 0,
        revenueVnd: 0,
      });
    }

    const allSessions = new Set<string>();
    let totalVisits = 0;
    let todayVisits = 0;
    let sandboxOpens = 0;
    let productDetailViews = 0;
    let addToCartEvents = 0;
    let checkoutStarts = 0;

    const productStats = new Map<
      string,
      {
        productId: string;
        name: string;
        sandboxOpens: number;
        detailViews: number;
        cartAdds: number;
        orderCount: number;
        revenueVnd: number;
      }
    >();

    const productNameLookup = new Map<string, string>();
    for (const p of products as Array<{ id: string; name: string }>) {
      productNameLookup.set(p.id, p.name);
    }

    const ensureProdStat = (pid: string) => {
      let entry = productStats.get(pid);
      if (!entry) {
        entry = {
          productId: pid,
          name: productNameLookup.get(pid) || pid,
          sandboxOpens: 0,
          detailViews: 0,
          cartAdds: 0,
          orderCount: 0,
          revenueVnd: 0,
        };
        productStats.set(pid, entry);
      }
      return entry;
    };

    for (const ev of events as Array<{
      event_type: string;
      session_id: string;
      product_id?: string | null;
      created_at: string;
    }>) {
      const dayKey = toVnDateKey(ev.created_at);
      if (ev.session_id) allSessions.add(ev.session_id);
      if (ev.event_type === 'page_view') {
        totalVisits += 1;
        if (dayKey === todayVn) todayVisits += 1;
        const bucket = dailyMap.get(dayKey);
        if (bucket) {
          bucket.visits += 1;
          if (ev.session_id) bucket.sessions.add(ev.session_id);
        }
      } else if (ev.event_type === 'sandbox_open') {
        sandboxOpens += 1;
        if (ev.product_id) ensureProdStat(ev.product_id).sandboxOpens += 1;
      } else if (ev.event_type === 'product_detail') {
        productDetailViews += 1;
        if (ev.product_id) ensureProdStat(ev.product_id).detailViews += 1;
      } else if (ev.event_type === 'add_to_cart') {
        addToCartEvents += 1;
        if (ev.product_id) ensureProdStat(ev.product_id).cartAdds += 1;
      } else if (ev.event_type === 'checkout_start') {
        checkoutStarts += 1;
      }
    }

    for (const o of orders as Array<{
      created_at?: string;
      status?: string;
      paid_amount_vnd?: number;
      payable_now_vnd?: number;
      net_total_vnd?: number;
      items_json?: Array<{ productId?: string; unitVnd?: number; quantity?: number }>;
    }>) {
      const dayKey = toVnDateKey(o.created_at || '');
      const bucket = dailyMap.get(dayKey);
      const realized =
        Number(o.paid_amount_vnd || 0) > 0
          ? Number(o.paid_amount_vnd || 0)
          : paidStatuses.has(String(o.status || ''))
            ? Number(o.payable_now_vnd || 0)
            : 0;
      if (bucket) {
        bucket.orders += 1;
        bucket.revenueVnd += realized;
      }
      if (Array.isArray(o.items_json)) {
        for (const item of o.items_json) {
          if (item.productId) {
            const st = ensureProdStat(item.productId);
            st.orderCount += Math.max(1, Number(item.quantity || 1));
            st.revenueVnd += Number(item.unitVnd || 0) * Math.max(1, Number(item.quantity || 1));
          }
        }
      }
    }

    const uniqueVisitors = allSessions.size;
    const conversionRatePct =
      uniqueVisitors > 0 ? Math.round((orders.length / uniqueVisitors) * 1000) / 10 : 0;
    const paidConversionPct =
      uniqueVisitors > 0 ? Math.round((paidOrders.length / uniqueVisitors) * 1000) / 10 : 0;

    const dailySeries14d = Array.from(dailyMap.values()).map((d) => ({
      date: d.date,
      label: d.label,
      visits: d.visits,
      uniqueVisitors: d.sessions.size,
      orders: d.orders,
      revenueVnd: d.revenueVnd,
    }));

    const topProducts = Array.from(productStats.values())
      .sort(
        (a, b) =>
          b.orderCount * 10 + b.cartAdds * 4 + b.sandboxOpens * 2 + b.detailViews -
          (a.orderCount * 10 + a.cartAdds * 4 + a.sandboxOpens * 2 + a.detailViews)
      )
      .slice(0, 8);

    const activeProductsCount = (products as Array<{ is_active?: boolean }>).filter(
      (p) => p.is_active !== false
    ).length;

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
          totalVisits,
          uniqueVisitors,
          todayVisits,
          sandboxOpens,
          productDetailViews,
          addToCartEvents,
          checkoutStarts,
          conversionRatePct,
          paidConversionPct,
          activeProductsCount,
          totalProductsCount: products.length,
        },
        analytics: {
          dailySeries14d,
          topProducts,
        },
        orders,
        webhooks,
        inquiries,
        profiles,
        products,
      },
      200,
      cors
    );
  }

  // ACTION 2: Insert or Update a Product in Live Cloud CMS (tvt_products)
  if (action === 'upsert_product') {
    const validated = sanitizeProductRow(body.product || {});
    if (!validated.ok) {
      return jsonResp({ ok: false, error: validated.error }, 400, cors);
    }

    const { data: saved, error: upsertErr } = await supabase
      .from('tvt_products')
      .upsert(validated.row, { onConflict: 'id' })
      .select('*')
      .single();

    if (upsertErr) {
      return jsonResp({ ok: false, error: upsertErr.message }, 500, cors);
    }
    return jsonResp({ ok: true, product: saved }, 200, cors);
  }

  // ACTION 3: Fast Inline Price / Rank / Active Update
  if (action === 'quick_update_price') {
    const productId = cleanText(body.productId, 64).toLowerCase();
    if (!/^[a-z0-9][a-z0-9-]{1,63}$/.test(productId)) {
      return jsonResp({ ok: false, error: 'Invalid productId' }, 400, cors);
    }

    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (body.priceVnd !== undefined) {
      const priceVnd = Math.round(Number(body.priceVnd));
      if (!Number.isFinite(priceVnd) || priceVnd < 10_000 || priceVnd > 5_000_000_000) {
        return jsonResp({ ok: false, error: 'Invalid priceVnd range' }, 400, cors);
      }
      patch.price_vnd = priceVnd;
      patch.price_usd = Math.max(1, Math.round(priceVnd / 25_000));
    }
    if (body.originalPriceVnd !== undefined) {
      const origVnd = Math.round(Number(body.originalPriceVnd));
      if (Number.isFinite(origVnd) && origVnd >= 10_000) {
        patch.original_price_vnd = origVnd;
        patch.original_price_usd = Math.max(1, Math.round(origVnd / 25_000));
      }
    }
    if (body.featuredRank !== undefined) {
      const rank = Math.round(Number(body.featuredRank));
      if (Number.isFinite(rank) && rank >= 1 && rank <= 999) {
        patch.featured_rank = rank;
      }
    }
    if (body.isActive !== undefined) {
      patch.is_active = Boolean(body.isActive);
    }

    const { data: updated, error: updErr } = await supabase
      .from('tvt_products')
      .update(patch)
      .eq('id', productId)
      .select('*')
      .maybeSingle();

    if (updErr) {
      return jsonResp({ ok: false, error: updErr.message }, 500, cors);
    }
    return jsonResp({ ok: true, product: updated }, 200, cors);
  }

  // ACTION 4: Delete Product from Cloud CMS
  if (action === 'delete_product') {
    const productId = cleanText(body.productId, 64).toLowerCase();
    if (!/^[a-z0-9][a-z0-9-]{1,63}$/.test(productId)) {
      return jsonResp({ ok: false, error: 'Invalid productId' }, 400, cors);
    }
    const { error: delErr } = await supabase
      .from('tvt_products')
      .delete()
      .eq('id', productId);

    if (delErr) {
      return jsonResp({ ok: false, error: delErr.message }, 500, cors);
    }
    return jsonResp({ ok: true, deletedProductId: productId }, 200, cors);
  }

  // ACTION 5: Bulk Seed / Sync Bundled Catalog into Cloud CMS
  if (action === 'bulk_seed_products') {
    const list = Array.isArray(body.products) ? body.products.slice(0, 50) : [];
    const rows: Record<string, unknown>[] = [];
    for (const item of list) {
      const check = sanitizeProductRow(item);
      if (check.ok) rows.push(check.row);
    }
    if (rows.length === 0) {
      return jsonResp({ ok: false, error: 'No valid products supplied' }, 400, cors);
    }
    const { error: seedErr } = await supabase
      .from('tvt_products')
      .upsert(rows, { onConflict: 'id' });
    if (seedErr) {
      return jsonResp({ ok: false, error: seedErr.message }, 500, cors);
    }
    return jsonResp({ ok: true, seededCount: rows.length }, 200, cors);
  }

  // ACTION 6: Update Order Status / Delivery Source ZIP URL / License Key
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

  // ACTION 7: Cleanly Delete Order
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
