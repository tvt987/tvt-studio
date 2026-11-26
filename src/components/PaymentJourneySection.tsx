import React from 'react';
import type { Locale } from '../engines/types';
import { IconCheck, IconClock, IconQrCode, IconShield } from './Icons';

interface PaymentJourneySectionProps {
  locale: Locale;
  savedOrderCount: number;
  onOpenTracker: () => void;
  onOpenInquiry: () => void;
}

export const PaymentJourneySection: React.FC<PaymentJourneySectionProps> = ({
  locale,
  savedOrderCount,
  onOpenTracker,
  onOpenInquiry,
}) => {
  const flowSteps = [
    {
      num: '01',
      time: locale === 'vi' ? 'T+0 phút' : 'T+0 min',
      title: locale === 'vi' ? 'Chọn Mẫu Hoặc Đặt Tư Vấn 0₫' : 'Pick Template Or Consult $0',
      desc:
        locale === 'vi'
          ? 'Đặt trực tiếp trên web hoặc chọn "Chốt lịch tư vấn trước (0₫ cọc)" để trao đổi & thương lượng trước khi chuyển tiền.'
          : 'Order directly or choose Consult First ($0 upfront) to align on requirements & pricing before paying.',
    },
    {
      num: '02',
      time: locale === 'vi' ? 'T+2 phút' : 'T+2 min',
      title: locale === 'vi' ? 'Thanh Toán Linh Hoạt 30% / 100%' : 'Flexible 30% Deposit / 100%',
      desc:
        locale === 'vi'
          ? 'Hỗ trợ VietQR ngân hàng 24/7, ZaloPay, MoMo (0931 467 024) hoặc Hóa đơn B2B USD (Deel/Wise). Nhập mã giao dịch để đối soát nhanh.'
          : 'Pay via Vietnam Bank VietQR, ZaloPay, MoMo (0931 467 024), or B2B USD Invoice (Deel/Wise) with instant reference tracking.',
    },
    {
      num: '03',
      time: locale === 'vi' ? 'T+15 phút' : 'T+15 min',
      title: locale === 'vi' ? 'Ghi Nhận Đơn & Xác Nhận Zalo' : 'Order Logged & Zalo Kickoff',
      desc:
        locale === 'vi'
          ? 'Đơn hàng được cấp mã TVT-ORD-XXXX, lưu vào Tra Cứu Đơn Hàng, tự động gửi thông báo về Email/Hệ thống & xuất Hợp Đồng PDF A4.'
          : 'Assigned unique TVT-ORD-XXXX saved to your Order Tracker, dispatched via Email/Cloud webhook, with printable A4 PDF receipt.',
    },
    {
      num: '04',
      time: locale === 'vi' ? 'Ngày 1–5' : 'Days 1–5',
      title: locale === 'vi' ? 'Nhận Link Staging & Tinh Chỉnh' : 'Live Staging & Custom Tuning',
      desc:
        locale === 'vi'
          ? 'Dùng thử sản phẩm chạy thật trên link Staging (Desktop + Mobile), yêu cầu tinh chỉnh màu sắc/tính năng cho đúng ý trước đợt 2.'
          : 'Test your live staging deployment across desktop & mobile and request visual/functional adjustments before Stage 2.',
    },
    {
      num: '05',
      time: locale === 'vi' ? 'Go-Live+' : 'Go-Live+',
      title: locale === 'vi' ? 'Bàn Giao & Hỗ Trợ Khi Sử Dụng' : 'Launch & Ongoing Support',
      desc:
        locale === 'vi'
          ? 'Gắn tên miền riêng + SSL, bàn giao Source Code sạch & kích hoạt hỗ trợ kỹ thuật trực tiếp xuyên suốt quá trình vận hành.'
          : 'Custom domain + SSL launch, clean source code handover, and direct ongoing support throughout real-world operation.',
    },
  ];

  const architecturePillars = [
    {
      badge: 'PERSISTENCE',
      title: locale === 'vi' ? 'Lưu Trữ Đơn Hàng & Tra Cứu Mọi Lúc' : 'Persistent Order Ledger & Live Tracker',
      detail:
        locale === 'vi'
          ? 'Mọi đơn hàng & biên nhận đều được lưu bền vững ngay trên trình duyệt (IndexedDB), tự động đồng bộ thông báo về tinhkun102@gmail.com và sẵn sàng nối Supabase PostgreSQL.'
          : 'Every order & contract brief persists locally in IndexedDB, dispatches real-time email alerts to tinhkun102@gmail.com, and plugs directly into Supabase PostgreSQL.',
    },
    {
      badge: 'ZERO RISK',
      title: locale === 'vi' ? 'An Toàn Thanh Toán 3 Đợt (30/40/30)' : 'Zero-Risk 30/40/30 Milestone Protection',
      detail:
        locale === 'vi'
          ? 'Không cần thanh toán 100% trước: chỉ cọc 30% sau khi đã chốt phương án rõ ràng, nghiệm thu link chạy thật mới trả 40%, Go-Live mới tất toán 30% cuối.'
          : 'Never pay 100% blind: start with 30% kickoff only after spec lock, 40% upon testing live staging, and final 30% at production launch.',
    },
    {
      badge: 'ANY STACK',
      title: locale === 'vi' ? 'Code Mọi Ngôn Ngữ · Hỗ Trợ Lâu Dài' : 'Polyglot Delivery & Ongoing Support',
      detail:
        locale === 'vi'
          ? 'Triển khai trên bất kỳ ngôn ngữ nào bạn yêu cầu (React, Next.js, Vue, Angular, Node, Python, .NET, Java, Go, PHP...) và luôn hỗ trợ kỹ thuật khi bạn vận hành.'
          : 'Built in any requested language or framework (React, Next.js, Vue, Angular, Node, Python, .NET, Java, Go, PHP...) with dedicated post-launch support.',
    },
  ];

  return (
    <section
      id="payment-flow"
      className="scroll-mt-20 border-t py-16 lg:py-24"
      style={{
        borderColor: 'var(--border-hairline)',
        backgroundColor: 'var(--bg-canvas)',
      }}
    >
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="font-mono-num text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--cyan)' }}>
              {locale === 'vi' ? 'MINH BẠCH THANH TOÁN & BÀN GIAO' : 'PAYMENT & POST-PAYMENT FULFILLMENT'}
            </div>
            <h2 className="font-display mt-2 text-2xl font-extrabold sm:text-4xl">
              {locale === 'vi'
                ? 'Thanh Toán Thế Nào? Thanh Toán Xong Nhận Gì?'
                : 'How Payment Works & What Happens Next.'}
            </h2>
            <p className="mt-3 text-sm leading-relaxed sm:text-base" style={{ color: 'var(--ink-secondary)' }}>
              {locale === 'vi'
                ? 'Quy trình đặt mua, lưu trữ hồ sơ đơn hàng và bàn giao rõ ràng từng mốc thời gian — không mập mờ, không rủi ro.'
                : 'Crystal-clear checkout, persistent order records, printable contracts, and verified delivery milestones.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenTracker}
              className="btn-secondary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold sm:text-sm"
              data-testid="payment-flow-open-tracker"
            >
              <IconQrCode className="h-4 w-4" style={{ color: 'var(--cyan)' }} />
              <span>
                {locale === 'vi' ? 'Tra Cứu Đơn Hàng' : 'Track My Orders'}
                {savedOrderCount > 0 ? ` (${savedOrderCount})` : ''}
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenInquiry}
              className="btn-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold sm:text-sm"
            >
              <IconCheck className="h-4 w-4" />
              <span>{locale === 'vi' ? 'Tư Vấn & Thương Lượng Trước' : 'Consult & Negotiate First'}</span>
            </button>
          </div>
        </div>

        {/* 5-Step Post-Payment Visual Timeline */}
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          {flowSteps.map((step) => (
            <div
              key={step.num}
              className="surface-card flex flex-col justify-between rounded-2xl p-5"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono-num text-xl font-extrabold" style={{ color: 'var(--accent)' }}>
                    {step.num}
                  </span>
                  <span
                    className="font-mono-num inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--border-hairline)',
                      color: 'var(--cyan)',
                    }}
                  >
                    <IconClock className="h-3 w-3" />
                    {step.time}
                  </span>
                </div>
                <h3 className="font-display mt-3.5 text-sm font-bold leading-snug sm:text-[15px]">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 3 Persistence & Security Pillars */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {architecturePillars.map((pillar) => (
            <div
              key={pillar.badge}
              className="surface-elevated flex items-start gap-3.5 rounded-2xl p-5"
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-hairline)',
                  color: 'var(--emerald)',
                }}
              >
                <IconShield className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="font-mono-num text-[10px] font-bold tracking-wider uppercase" style={{ color: 'var(--accent)' }}>
                  {pillar.badge}
                </span>
                <h3 className="mt-0.5 text-sm font-bold">{pillar.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
                  {pillar.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
