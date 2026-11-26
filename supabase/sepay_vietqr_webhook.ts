/**
 * TVT STUDIO — Automated VietQR Payment Confirmation Webhook (SePay / PayOS / Casso)
 * Deployable in 2 minutes on Supabase Edge Functions (Deno) or Cloudflare Workers (0đ Free Tier).
 *
 * Flow:
 * 1. Client scans VietQR on tvt987.github.io/tvt-studio/ with memo `TVT-ORD-XXXX`.
 * 2. Vietnam bank receives transfer -> SePay / PayOS triggers HTTPS POST to this endpoint.
 * 3. Webhook validates Bearer API Key, deduplicates `provider_tx_id`, matches `TVT-ORD-XXXX`,
 *    marks `tvt_orders.status = 'DEPOSIT_VERIFIED'`, inserts an audit event, and notifies Telegram/Email.
 */

export interface BankWebhookPayload {
  id: string | number;
  gateway?: string;
  transferType?: 'in' | 'out';
  transferAmount: number;
  content: string;
  referenceCode?: string;
}

export function extractTvtOrderCode(transferContent: string): string | null {
  const match = transferContent.toUpperCase().match(/TVT[\s-]?ORD[\s-]?(\d{4})/);
  return match ? `TVT-ORD-${match[1]}` : null;
}

export function verifyWebhookOrderMatch(
  payload: BankWebhookPayload,
  expectedPayableVnd: number
): { matched: boolean; orderCode: string | null; reason: string } {
  if (payload.transferType && payload.transferType !== 'in') {
    return { matched: false, orderCode: null, reason: 'Ignored outbound transfer' };
  }
  const orderCode = extractTvtOrderCode(payload.content);
  if (!orderCode) {
    return { matched: false, orderCode: null, reason: 'No TVT-ORD-XXXX memo detected' };
  }
  if (payload.transferAmount < expectedPayableVnd) {
    return {
      matched: false,
      orderCode,
      reason: `Underpaid transfer (${payload.transferAmount} < ${expectedPayableVnd})`,
    };
  }
  return { matched: true, orderCode, reason: 'Exact/sufficient inbound VietQR settlement verified' };
}
