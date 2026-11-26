import { describe, expect, it } from 'vitest';
import {
  computeVoucherIdempotencyKey,
  evaluateVoucher,
  normalizeVoucherCode,
} from '../voucher';

describe('Idempotent Voucher Engine', () => {
  it('normalizes whitespace and casing cleanly', () => {
    expect(normalizeVoucherCode('  tvtlaunch15 ')).toBe('TVTLAUNCH15');
    expect(normalizeVoucherCode(' agency 10 ')).toBe('AGENCY10');
  });

  it('applies TVTLAUNCH15 (-15%) with minimum subtotal and maximum cap enforcement', () => {
    const belowMin = evaluateVoucher('TVTLAUNCH15', 4_000_000, 160);
    expect(belowMin.valid).toBe(false);
    expect(belowMin.discountVnd).toBe(0);

    const normal = evaluateVoucher('TVTLAUNCH15', 10_000_000, 400);
    expect(normal.valid).toBe(true);
    expect(normal.discountVnd).toBe(1_500_000);
    expect(normal.discountUsd).toBe(60);

    // Cap check: 15% of 50M = 7.5M, capped at 4M / $160
    const capped = evaluateVoucher('TVTLAUNCH15', 50_000_000, 2_000);
    expect(capped.valid).toBe(true);
    expect(capped.discountVnd).toBe(4_000_000);
    expect(capped.discountUsd).toBe(160);
  });

  it('applies AGENCY10 (-10%) without minimum order requirement', () => {
    const result = evaluateVoucher('agency10', 2_000_000, 80);
    expect(result.valid).toBe(true);
    expect(result.discountVnd).toBe(200_000);
    expect(result.discountUsd).toBe(8);
  });

  it('applies VIP500K flat discount above threshold and rejects below threshold', () => {
    const rejected = evaluateVoucher('VIP500K', 2_500_000, 100);
    expect(rejected.valid).toBe(false);

    const accepted = evaluateVoucher('VIP500K', 6_900_000, 279);
    expect(accepted.valid).toBe(true);
    expect(accepted.discountVnd).toBe(500_000);
    expect(accepted.discountUsd).toBe(20);
  });

  it('maintains deterministic idempotency keys and flags idempotent replays without double discount', () => {
    const key1 = computeVoucherIdempotencyKey('TVTLAUNCH15', 8_900_000, 359);
    const first = evaluateVoucher('TVTLAUNCH15', 8_900_000, 359);
    expect(first.idempotencyKey).toBe(key1);

    const replay = evaluateVoucher('TVTLAUNCH15', 8_900_000, 359, first.idempotencyKey);
    expect(replay.valid).toBe(true);
    expect(replay.discountVnd).toBe(first.discountVnd);
    expect(replay.message.en).toContain('idempotent');
  });

  it('rejects unknown codes and empty carts safely', () => {
    const unknown = evaluateVoucher('FAKE99', 8_900_000, 359);
    expect(unknown.valid).toBe(false);
    expect(unknown.discountVnd).toBe(0);

    const emptyCart = evaluateVoucher('AGENCY10', 0, 0);
    expect(emptyCart.valid).toBe(false);
  });
});
