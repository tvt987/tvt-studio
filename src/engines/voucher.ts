import { formatMoney, roundUsd } from './catalog';
import type { VoucherDefinition, VoucherEvaluation } from './types';

export const VOUCHER_CATALOG: VoucherDefinition[] = [
  {
    code: 'TVTLAUNCH15',
    type: 'percent',
    percentOff: 15,
    minSubtotalVnd: 2_000_000,
    minSubtotalUsd: 80,
    maxDiscountVnd: 2_000_000,
    maxDiscountUsd: 80,
    label: {
      vi: 'Giảm 15% Khai Trương Studio (tối đa 2.000.000₫)',
      en: '15% Studio Launch Offer (up to $80)',
    },
    description: {
      vi: 'Áp dụng cho đơn từ 2.000.000₫ ($80)',
      en: 'Valid on orders from $80 (2,000,000₫)',
    },
  },
  {
    code: 'AGENCY10',
    type: 'percent',
    percentOff: 10,
    minSubtotalVnd: 0,
    minSubtotalUsd: 0,
    maxDiscountVnd: 2_000_000,
    maxDiscountUsd: 80,
    label: {
      vi: 'Ưu Đãi Đối Tác Agency -10%',
      en: '10% Agency Partner Discount',
    },
    description: {
      vi: 'Không yêu cầu giá trị đơn tối thiểu',
      en: 'No minimum order threshold',
    },
  },
  {
    code: 'VIP500K',
    type: 'fixed',
    fixedVnd: 500_000,
    fixedUsd: 20,
    minSubtotalVnd: 3_000_000,
    minSubtotalUsd: 120,
    label: {
      vi: 'Giảm Trực Tiếp 500.000₫ ($20)',
      en: 'Flat $20 (500,000₫) Direct Discount',
    },
    description: {
      vi: 'Áp dụng cho đơn từ 3.000.000₫ ($120)',
      en: 'Valid on orders from $120 (3,000,000₫)',
    },
  },
];

export function normalizeVoucherCode(rawCode: string): string {
  return rawCode.trim().toUpperCase().replace(/\s+/g, '');
}

export function computeVoucherIdempotencyKey(
  normalizedCode: string,
  subtotalVnd: number,
  subtotalUsd: number
): string {
  const safeCode = normalizedCode || 'NONE';
  return `VCH-${safeCode}-${Math.max(0, Math.round(subtotalVnd))}-${Math.max(0, Math.round(subtotalUsd))}`;
}

export function evaluateVoucher(
  rawCode: string,
  subtotalVnd: number,
  subtotalUsd: number,
  previouslyAppliedKey?: string
): VoucherEvaluation {
  const code = normalizeVoucherCode(rawCode);
  const idempotencyKey = computeVoucherIdempotencyKey(code, subtotalVnd, subtotalUsd);

  if (!code) {
    return {
      valid: false,
      code: '',
      idempotencyKey,
      discountVnd: 0,
      discountUsd: 0,
      message: {
        vi: 'Vui lòng nhập mã ưu đãi hợp lệ.',
        en: 'Please enter a valid promo code.',
      },
    };
  }

  if (subtotalVnd <= 0 || subtotalUsd <= 0) {
    return {
      valid: false,
      code,
      idempotencyKey,
      discountVnd: 0,
      discountUsd: 0,
      message: {
        vi: 'Giỏ hàng đang trống — hãy chọn sản phẩm trước khi áp mã.',
        en: 'Your cart is empty — add a product before applying a promo code.',
      },
    };
  }

  const voucher = VOUCHER_CATALOG.find((v) => v.code === code);
  if (!voucher) {
    return {
      valid: false,
      code,
      idempotencyKey,
      discountVnd: 0,
      discountUsd: 0,
      message: {
        vi: `Mã "${code}" không tồn tại. Thử TVTLAUNCH15, AGENCY10 hoặc VIP500K.`,
        en: `Code "${code}" was not found. Try TVTLAUNCH15, AGENCY10, or VIP500K.`,
      },
    };
  }

  if (subtotalVnd < voucher.minSubtotalVnd) {
    return {
      valid: false,
      code,
      idempotencyKey,
      discountVnd: 0,
      discountUsd: 0,
      voucher,
      message: {
        vi: `Mã ${code} áp dụng cho đơn tối thiểu ${formatMoney(voucher.minSubtotalVnd, 'VND')}.`,
        en: `Code ${code} requires a minimum order of ${formatMoney(voucher.minSubtotalUsd, 'USD')}.`,
      },
    };
  }

  let discountVnd = 0;
  let discountUsd = 0;

  if (voucher.type === 'percent' && voucher.percentOff) {
    discountVnd = Math.round((subtotalVnd * voucher.percentOff) / 100 / 10_000) * 10_000;
    discountUsd = roundUsd((subtotalUsd * voucher.percentOff) / 100);

    if (voucher.maxDiscountVnd !== undefined) {
      discountVnd = Math.min(discountVnd, voucher.maxDiscountVnd);
    }
    if (voucher.maxDiscountUsd !== undefined) {
      discountUsd = Math.min(discountUsd, voucher.maxDiscountUsd);
    }
  } else if (voucher.type === 'fixed') {
    discountVnd = voucher.fixedVnd ?? 0;
    discountUsd = voucher.fixedUsd ?? 0;
  }

  discountVnd = Math.min(discountVnd, subtotalVnd);
  discountUsd = Math.min(discountUsd, subtotalUsd);

  const isIdempotentReplay = Boolean(previouslyAppliedKey && previouslyAppliedKey === idempotencyKey);

  return {
    valid: true,
    code: voucher.code,
    idempotencyKey,
    discountVnd,
    discountUsd,
    voucher,
    message: isIdempotentReplay
      ? {
          vi: `Mã ${voucher.code} đã được áp dụng idempotent (không tính trùng).`,
          en: `Code ${voucher.code} is already active (idempotent lock preserved).`,
        }
      : {
          vi: `Đã áp dụng mã ${voucher.code}: tiết kiệm ${formatMoney(discountVnd, 'VND')}.`,
          en: `Applied ${voucher.code}: saving ${formatMoney(discountUsd, 'USD')}.`,
        },
  };
}
