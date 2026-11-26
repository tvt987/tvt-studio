import {
  formatDeliveryRange,
  getLicensePrice,
  roundUsd,
  roundVnd,
} from './catalog';
import { calculateCustomEstimate } from './estimator';
import { evaluateVoucher } from './voucher';
import type {
  CartCustomItem,
  CartItem,
  CartTemplateItem,
  CartTotals,
  CustomScopeConfig,
  LicenseTier,
  PaymentMode,
  TemplateProduct,
} from './types';

export const DEPOSIT_RATIO = 0.3;

export function buildTemplateCartKey(productId: string, license: LicenseTier): string {
  return `tpl:${productId}:${license}`;
}

export function buildCustomCartKey(config: CustomScopeConfig): string {
  const sortedAddons = [...config.selectedAddons].sort().join(',');
  return `custom:${config.projectType}:${config.pace}:${sortedAddons || 'base'}`;
}

export function addTemplateToCart(
  items: CartItem[],
  product: TemplateProduct,
  license: LicenseTier
): CartItem[] {
  const cartKey = buildTemplateCartKey(product.id, license);
  const existingIdx = items.findIndex((i) => i.cartKey === cartKey);

  if (existingIdx >= 0) {
    return items.map((item, idx) =>
      idx === existingIdx ? { ...item, quantity: item.quantity + 1 } : item
    );
  }

  const newItem: CartTemplateItem = {
    kind: 'template',
    cartKey,
    productId: product.id,
    sku: product.sku,
    title: product.name,
    subtitle: product.subtitle,
    previewImage: product.previewImage,
    license,
    unitVnd: getLicensePrice(product, license, 'VND'),
    unitUsd: getLicensePrice(product, license, 'USD'),
    quantity: 1,
    deliveryDaysLabel: formatDeliveryRange(product, 'vi'),
  };

  return [...items, newItem];
}

export function addCustomScopeToCart(
  items: CartItem[],
  config: CustomScopeConfig
): CartItem[] {
  const estimate = calculateCustomEstimate(config);
  const cartKey = buildCustomCartKey(config);
  const existingIdx = items.findIndex((i) => i.cartKey === cartKey);

  const customItem: CartCustomItem = {
    kind: 'custom',
    cartKey,
    sku: `TVT-CST-${config.projectType.slice(0, 3).toUpperCase()}`,
    title: {
      vi: config.projectName?.trim()
        ? `Gói Custom: ${config.projectName.trim()}`
        : `Gói Custom · ${estimate.projectType.tierName.vi}`,
      en: config.projectName?.trim()
        ? `Custom Build: ${config.projectName.trim()}`
        : `Custom Build · ${estimate.projectType.tierName.en}`,
    },
    summary: {
      vi: `${estimate.addons.length} module mở rộng · ${config.pace === 'priority' ? 'Ưu tiên gấp' : 'Tiêu chuẩn'} · ~${estimate.estimatedDays} ngày`,
      en: `${estimate.addons.length} add-on modules · ${config.pace === 'priority' ? 'Priority pace' : 'Standard pace'} · ~${estimate.estimatedDays} days`,
    },
    config: {
      ...config,
      selectedAddons: [...config.selectedAddons].sort(),
    },
    unitVnd: estimate.totalVnd,
    unitUsd: estimate.totalUsd,
    quantity: 1,
    estimatedDays: estimate.estimatedDays,
    addonLabels: estimate.addons.map((a) => a.label),
  };

  if (existingIdx >= 0) {
    return items.map((item, idx) => (idx === existingIdx ? customItem : item));
  }
  return [...items, customItem];
}

export function updateCartQuantity(
  items: CartItem[],
  cartKey: string,
  delta: number
): CartItem[] {
  return items
    .map((item) => {
      if (item.cartKey !== cartKey) return item;
      const nextQty = item.quantity + delta;
      return nextQty <= 0 ? null : { ...item, quantity: nextQty };
    })
    .filter((item): item is CartItem => item !== null);
}

export function removeCartItem(items: CartItem[], cartKey: string): CartItem[] {
  return items.filter((item) => item.cartKey !== cartKey);
}

export function switchTemplateLicenseInCart(
  items: CartItem[],
  cartKey: string,
  targetLicense: LicenseTier,
  products: TemplateProduct[]
): CartItem[] {
  const targetItem = items.find((i) => i.cartKey === cartKey);
  if (!targetItem || targetItem.kind !== 'template' || targetItem.license === targetLicense) {
    return items;
  }

  const product = products.find((p) => p.id === targetItem.productId);
  if (!product) return items;

  const nextKey = buildTemplateCartKey(product.id, targetLicense);
  const existingMerged = items.find((i) => i.cartKey === nextKey);

  if (existingMerged && existingMerged.kind === 'template') {
    return items
      .filter((i) => i.cartKey !== cartKey)
      .map((i) =>
        i.cartKey === nextKey
          ? { ...i, quantity: i.quantity + targetItem.quantity }
          : i
      );
  }

  return items.map((item) => {
    if (item.cartKey !== cartKey || item.kind !== 'template') return item;
    return {
      ...item,
      cartKey: nextKey,
      license: targetLicense,
      unitVnd: getLicensePrice(product, targetLicense, 'VND'),
      unitUsd: getLicensePrice(product, targetLicense, 'USD'),
    };
  });
}

export function calculateCartTotals(
  items: CartItem[],
  activeVoucherCode: string | null,
  paymentMode: PaymentMode
): CartTotals {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalVnd = items.reduce((sum, item) => sum + item.unitVnd * item.quantity, 0);
  const subtotalUsd = items.reduce((sum, item) => sum + item.unitUsd * item.quantity, 0);

  let appliedVoucher = undefined;
  let discountVnd = 0;
  let discountUsd = 0;

  if (activeVoucherCode && items.length > 0) {
    const evalResult = evaluateVoucher(activeVoucherCode, subtotalVnd, subtotalUsd);
    if (evalResult.valid) {
      appliedVoucher = evalResult;
      discountVnd = evalResult.discountVnd;
      discountUsd = evalResult.discountUsd;
    }
  }

  const netTotalVnd = Math.max(0, subtotalVnd - discountVnd);
  const netTotalUsd = Math.max(0, subtotalUsd - discountUsd);

  const payableNowVnd =
    paymentMode === 'deposit-30' ? roundVnd(netTotalVnd * DEPOSIT_RATIO) : netTotalVnd;
  const payableNowUsd =
    paymentMode === 'deposit-30' ? roundUsd(netTotalUsd * DEPOSIT_RATIO) : netTotalUsd;

  const remainingVnd = Math.max(0, netTotalVnd - payableNowVnd);
  const remainingUsd = Math.max(0, netTotalUsd - payableNowUsd);

  return {
    itemCount,
    subtotalVnd,
    subtotalUsd,
    discountVnd,
    discountUsd,
    netTotalVnd,
    netTotalUsd,
    payableNowVnd,
    payableNowUsd,
    remainingVnd,
    remainingUsd,
    paymentMode,
    appliedVoucher,
  };
}

export function generateOrderCode(seedNumber?: number): string {
  const num =
    seedNumber !== undefined
      ? Math.abs(Math.floor(seedNumber)) % 9000 + 1000
      : Math.floor(1000 + Math.random() * 9000);
  return `TVT-ORD-${num}`;
}
