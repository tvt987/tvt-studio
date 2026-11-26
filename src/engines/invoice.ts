import { formatMoney, STUDIO_CONTACT } from './catalog';
import { buildMilestones } from './estimator';
import type {
  CartItem,
  ClientOrderForm,
  Currency,
  Locale,
  OrderSnapshot,
  PaymentChannel,
} from './types';

export function getPaymentChannelLabel(channel: PaymentChannel, locale: Locale): string {
  if (channel === 'zalopay') {
    return locale === 'vi'
      ? `ZaloPay / Chuyển khoản QR (${STUDIO_CONTACT.phoneDisplay} · ${STUDIO_CONTACT.architectName})`
      : `ZaloPay / Direct QR Transfer (${STUDIO_CONTACT.phoneDisplay} · ${STUDIO_CONTACT.architectName})`;
  }
  if (channel === 'momo') {
    return locale === 'vi'
      ? `Ví MoMo (${STUDIO_CONTACT.phoneDisplay} · ${STUDIO_CONTACT.architectName})`
      : `MoMo Wallet (${STUDIO_CONTACT.phoneDisplay} · ${STUDIO_CONTACT.architectName})`;
  }
  return locale === 'vi'
    ? `Hóa Đơn B2B Quốc Tế (Deel / Wise / Wire USD · ${STUDIO_CONTACT.email})`
    : `International B2B Contractor Invoice (Deel / Wise / Wire USD · ${STUDIO_CONTACT.email})`;
}

export function createOrderSnapshot(params: {
  orderCode: string;
  currency: Currency;
  paymentChannel: PaymentChannel;
  client: ClientOrderForm;
  items: CartItem[];
  totals: OrderSnapshot['totals'];
  createdAtIso?: string;
}): OrderSnapshot {
  const milestones = buildMilestones(params.totals.netTotalVnd, params.totals.netTotalUsd);
  return {
    orderCode: params.orderCode,
    createdAtIso: params.createdAtIso ?? new Date().toISOString(),
    currency: params.currency,
    paymentChannel: params.paymentChannel,
    paymentMode: params.totals.paymentMode,
    client: { ...params.client },
    items: params.items.map((item) => ({ ...item })),
    totals: { ...params.totals },
    milestones,
  };
}

export function generateOrderInvoiceMarkdown(order: OrderSnapshot, locale: Locale): string {
  const dateDisplay = order.createdAtIso.slice(0, 16).replace('T', ' ');
  const channelLabel = getPaymentChannelLabel(order.paymentChannel, locale);

  const itemLines = order.items
    .map((item, idx) => {
      const lineVnd = item.unitVnd * item.quantity;
      const lineUsd = item.unitUsd * item.quantity;
      if (item.kind === 'template') {
        const licenseText =
          item.license === 'full-source'
            ? locale === 'vi'
              ? 'Full Source + Custom Brand (+30%)'
              : 'Full Source + Custom Brand (+30%)'
            : locale === 'vi'
              ? 'Standard Deploy'
              : 'Standard Deploy';
        return `| ${idx + 1} | ${item.title} (${item.sku}) — ${licenseText} | ${item.quantity} | ${formatMoney(lineVnd, 'VND')} (${formatMoney(lineUsd, 'USD')}) |`;
      }
      return `| ${idx + 1} | ${item.title[locale]} (${item.sku}) — ${item.summary[locale]} | ${item.quantity} | ${formatMoney(lineVnd, 'VND')} (${formatMoney(lineUsd, 'USD')}) |`;
    })
    .join('\n');

  const milestoneLines = order.milestones
    .map(
      (m) =>
        `- [ ] **${m.label[locale]} (${m.percentLabel})**: ${formatMoney(m.amountVnd, 'VND')} (${formatMoney(m.amountUsd, 'USD')}) — ${m.deliverable[locale]}`
    )
    .join('\n');

  if (locale === 'vi') {
    return [
      `# TVT STUDIO — BIÊN NHẬN ĐƠN HÀNG & HỢP ĐỒNG SỐ`,
      ``,
      `- **Mã đơn hàng / Nội dung CK**: \`${order.orderCode}\``,
      `- **Thời gian tạo**: ${dateDisplay} UTC`,
      `- **Hình thức thanh toán**: ${order.paymentMode === 'deposit-30' ? 'Đặt cọc khởi tạo 30%' : 'Thanh toán trọn gói 100%'}`,
      `- **Kênh thanh toán**: ${channelLabel}`,
      ``,
      `## 1. Thông Tin Khách Hàng & Brief Dự Án`,
      ``,
      `- **Họ và tên**: ${order.client.fullName}`,
      `- **Điện thoại / Zalo**: ${order.client.phoneOrZalo}`,
      `- **Email**: ${order.client.email}`,
      `- **Thương hiệu / Domain dự kiến**: ${order.client.brandOrDomain || 'Chưa cung cấp'}`,
      `- **Ghi chú yêu cầu**: ${order.client.notes || 'Không có ghi chú thêm'}`,
      ``,
      `## 2. Chi Tiết Hạng Mục Đơn Hàng`,
      ``,
      `| # | Sản phẩm / Gói dịch vụ | SL | Thành tiền |`,
      `| --- | --- | --- | --- |`,
      itemLines,
      ``,
      `- **Tạm tính**: ${formatMoney(order.totals.subtotalVnd, 'VND')} (${formatMoney(order.totals.subtotalUsd, 'USD')})`,
      ...(order.totals.appliedVoucher
        ? [
            `- **Mã ưu đãi (${order.totals.appliedVoucher.code})**: -${formatMoney(order.totals.discountVnd, 'VND')} (-${formatMoney(order.totals.discountUsd, 'USD')})`,
          ]
        : []),
      `- **Tổng giá trị đơn hàng**: **${formatMoney(order.totals.netTotalVnd, 'VND')} (${formatMoney(order.totals.netTotalUsd, 'USD')})**`,
      `- **Số tiền thanh toán ngay**: **${formatMoney(order.totals.payableNowVnd, 'VND')} (${formatMoney(order.totals.payableNowUsd, 'USD')})**`,
      ...(order.totals.remainingVnd > 0
        ? [
            `- **Số dư thanh toán theo nghiệm thu**: ${formatMoney(order.totals.remainingVnd, 'VND')} (${formatMoney(order.totals.remainingUsd, 'USD')})`,
          ]
        : []),
      ``,
      `## 3. Lộ Trình Nghiệm Thu & Bàn Giao`,
      ``,
      milestoneLines,
      ``,
      `## 4. Xác Nhận Trực Tiếp Từ Kiến Trúc Sư`,
      ``,
      `- **Phụ trách**: ${STUDIO_CONTACT.architectName} — ${STUDIO_CONTACT.architectTitleVi}`,
      `- **Zalo / Hotline**: ${STUDIO_CONTACT.phoneDisplay} (${STUDIO_CONTACT.zaloUrl})`,
      `- **Email**: ${STUDIO_CONTACT.email}`,
      `- **Portfolio**: ${STUDIO_CONTACT.portfolioUrl} | ${STUDIO_CONTACT.githubUrl}`,
      ``,
    ].join('\n');
  }

  return [
    `# TVT STUDIO — ORDER RECEIPT & DIGITAL CONTRACT BRIEF`,
    ``,
    `- **Order ID / Transfer Memo**: \`${order.orderCode}\``,
    `- **Created At**: ${dateDisplay} UTC`,
    `- **Payment Mode**: ${order.paymentMode === 'deposit-30' ? '30% Kickoff Deposit' : '100% Full Settlement'}`,
    `- **Payment Channel**: ${channelLabel}`,
    ``,
    `## 1. Client Details & Project Brief`,
    ``,
    `- **Full Name**: ${order.client.fullName}`,
    `- **Phone / Zalo**: ${order.client.phoneOrZalo}`,
    `- **Email**: ${order.client.email}`,
    `- **Brand / Target Domain**: ${order.client.brandOrDomain || 'TBD'}`,
    `- **Technical Notes**: ${order.client.notes || 'None'}`,
    ``,
    `## 2. Itemized Order Summary`,
    ``,
    `| # | Product / Service | Qty | Line Total |`,
    `| --- | --- | --- | --- |`,
    itemLines,
    ``,
    `- **Subtotal**: ${formatMoney(order.totals.subtotalUsd, 'USD')} (${formatMoney(order.totals.subtotalVnd, 'VND')})`,
    ...(order.totals.appliedVoucher
      ? [
          `- **Promo Code (${order.totals.appliedVoucher.code})**: -${formatMoney(order.totals.discountUsd, 'USD')} (-${formatMoney(order.totals.discountVnd, 'VND')})`,
        ]
      : []),
    `- **Net Contract Value**: **${formatMoney(order.totals.netTotalUsd, 'USD')} (${formatMoney(order.totals.netTotalVnd, 'VND')})**`,
    `- **Due Today**: **${formatMoney(order.totals.payableNowUsd, 'USD')} (${formatMoney(order.totals.payableNowVnd, 'VND')})**`,
    ...(order.totals.remainingUsd > 0
      ? [
          `- **Remaining on Milestones**: ${formatMoney(order.totals.remainingUsd, 'USD')} (${formatMoney(order.totals.remainingVnd, 'VND')})`,
        ]
      : []),
    ``,
    `## 3. Milestone Delivery Checklist`,
    ``,
    milestoneLines,
    ``,
    `## 4. Direct Architect Contact`,
    ``,
    `- **Principal Architect**: ${STUDIO_CONTACT.architectName}`,
    `- **Hotline / Zalo**: ${STUDIO_CONTACT.phoneDisplay} (${STUDIO_CONTACT.zaloUrl})`,
    `- **Email**: ${STUDIO_CONTACT.email}`,
    `- **GitHub**: ${STUDIO_CONTACT.githubUrl}`,
    ``,
  ].join('\n');
}

export function buildMailtoOrderUrl(order: OrderSnapshot, locale: Locale): string {
  const subject =
    locale === 'vi'
      ? `[TVT Studio] Xác nhận đơn hàng ${order.orderCode} - ${order.client.fullName}`
      : `[TVT Studio] Order Confirmation ${order.orderCode} - ${order.client.fullName}`;

  const itemSummary = order.items
    .map((item) => {
      const name = item.kind === 'template' ? `${item.title} (${item.license})` : item.title[locale];
      return `- ${name} x${item.quantity}`;
    })
    .join('\n');

  const bodyLines =
    locale === 'vi'
      ? [
          `Xin chào anh Trương Văn Tình (TVT Studio),`,
          ``,
          `Tôi vừa tạo đơn hàng trên TVT Studio với thông tin sau:`,
          `- Mã đơn hàng / Nội dung CK: ${order.orderCode}`,
          `- Khách hàng: ${order.client.fullName}`,
          `- SĐT / Zalo: ${order.client.phoneOrZalo}`,
          `- Thương hiệu / Domain: ${order.client.brandOrDomain || 'Chưa cung cấp'}`,
          `- Kênh thanh toán: ${getPaymentChannelLabel(order.paymentChannel, 'vi')}`,
          `- Số tiền thanh toán ngay: ${formatMoney(order.totals.payableNowVnd, 'VND')} (${formatMoney(order.totals.payableNowUsd, 'USD')})`,
          ``,
          `Danh sách hạng mục:`,
          itemSummary,
          ``,
          `Ghi chú: ${order.client.notes || 'Không có'}`,
        ]
      : [
          `Hi Truong Van Tinh (TVT Studio),`,
          ``,
          `I have submitted an order on TVT Studio:`,
          `- Order ID / Transfer Memo: ${order.orderCode}`,
          `- Client: ${order.client.fullName}`,
          `- Phone / Zalo: ${order.client.phoneOrZalo}`,
          `- Brand / Domain: ${order.client.brandOrDomain || 'TBD'}`,
          `- Payment Channel: ${getPaymentChannelLabel(order.paymentChannel, 'en')}`,
          `- Due Today: ${formatMoney(order.totals.payableNowUsd, 'USD')} (${formatMoney(order.totals.payableNowVnd, 'VND')})`,
          ``,
          `Items:`,
          itemSummary,
          ``,
          `Notes: ${order.client.notes || 'None'}`,
        ];

  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(bodyLines.join('\n'));
  return `mailto:${STUDIO_CONTACT.email}?subject=${encodedSubject}&body=${encodedBody}`;
}

export function buildZaloDirectUrl(): string {
  return STUDIO_CONTACT.zaloUrl;
}
