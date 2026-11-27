import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ADMIN_OWNER_EMAIL,
  deleteCloudOrderAsAdmin,
  fetchAdminCloudOverview,
  isAdminSession,
  updateCloudOrderAsAdmin,
  type AdminClientRecord,
  type AdminOverviewPayload,
  type AdminWebhookRecord,
} from '../engines/adminOps';
import { CATALOG_PRODUCTS, formatMoney } from '../engines/catalog';
import {
  exportOrdersToCsvBom,
  isCloudRealtimeConfigured,
  loadSupabaseRuntimeConfig,
  ORDER_STATUS_META,
  ORDER_STATUS_SEQUENCE,
  saveSupabaseRuntimeConfig,
  type SupabaseRuntimeConfig,
} from '../engines/orderLedger';
import {
  buildVietQrImageUrl,
  isValidBankVietQrConfig,
  saveBankVietQrConfig,
  VIETNAM_BANKS,
} from '../engines/vietqr';
import type {
  AuthSession,
  BankVietQrConfig,
  Locale,
  OrderLifecycleStatus,
  OrderSnapshot,
  QuickInquiryRecord,
} from '../engines/types';
import { downloadTextFile } from '../utils/download';
import {
  IconArrowUpRight,
  IconCheck,
  IconClose,
  IconDownload,
  IconQrCode,
  IconSearch,
  IconShield,
  IconUser,
} from './Icons';

interface OwnerConsoleModalProps {
  isOpen: boolean;
  locale: Locale;
  authSession: AuthSession | null;
  orders: OrderSnapshot[];
  inquiries: QuickInquiryRecord[];
  bankConfig: BankVietQrConfig | null;
  onClose: () => void;
  onUpdateOrderStatus: (orderCode: string, nextStatus: OrderLifecycleStatus) => void;
  onUpdateOrderDeliveryUrl: (orderCode: string, downloadUrl: string) => void;
  onSimulateRealtimeWebhook: (orderCode: string, amountVnd: number) => void;
  onBankConfigChange: (next: BankVietQrConfig | null) => void;
  onLaunch10kLiveTest: () => void;
}

type AdminTab = 'orders' | 'webhooks' | 'clients' | 'settings';

export const OwnerConsoleModal: React.FC<OwnerConsoleModalProps> = ({
  isOpen,
  locale,
  authSession,
  orders,
  inquiries,
  bankConfig,
  onClose,
  onUpdateOrderStatus,
  onUpdateOrderDeliveryUrl,
  onSimulateRealtimeWebhook,
  onBankConfigChange,
  onLaunch10kLiveTest,
}) => {
  const [tab, setTab] = useState<AdminTab>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');

  const [cloudOverview, setCloudOverview] = useState<AdminOverviewPayload | null>(null);
  const [loadingCloud, setLoadingCloud] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const [bankBin, setBankBin] = useState(bankConfig?.bankBin ?? '970422');
  const [accountNumber, setAccountNumber] = useState(bankConfig?.accountNumber ?? '0325456574');
  const [accountName, setAccountName] = useState(bankConfig?.accountName ?? 'TRUONG VAN TINH');
  const [bankSaved, setBankSaved] = useState(false);

  const [cloudCfg, setCloudCfg] = useState<SupabaseRuntimeConfig>(() => loadSupabaseRuntimeConfig());
  const [cloudSaved, setCloudSaved] = useState(false);

  const isVerifiedAdmin = isAdminSession(authSession);

  const refreshCloudData = useCallback(async () => {
    setLoadingCloud(true);
    const data = await fetchAdminCloudOverview(authSession, orders, inquiries);
    setCloudOverview(data);
    setLoadingCloud(false);
  }, [authSession, inquiries, orders]);

  useEffect(() => {
    if (isOpen) {
      void refreshCloudData();
    }
  }, [isOpen, refreshCloudData]);

  const effectiveOrders: OrderSnapshot[] = cloudOverview?.orders ?? orders;
  const effectiveInquiries: QuickInquiryRecord[] = cloudOverview?.inquiries ?? inquiries;
  const effectiveWebhooks: AdminWebhookRecord[] = cloudOverview?.webhooks ?? [];
  const effectiveClients: AdminClientRecord[] = cloudOverview?.clients ?? [];

  const filteredOrders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const paidStatuses = new Set<OrderLifecycleStatus>([
      'DEPOSIT_VERIFIED',
      'IN_DEVELOPMENT',
      'UAT_STAGING',
      'DELIVERED',
    ]);
    return effectiveOrders.filter((o) => {
      if (statusFilter === 'paid' && !paidStatuses.has(o.status ?? 'AWAITING_PAYMENT')) {
        return false;
      }
      if (statusFilter === 'pending' && paidStatuses.has(o.status ?? 'AWAITING_PAYMENT')) {
        return false;
      }
      if (!q) return true;
      return (
        o.orderCode.toLowerCase().includes(q) ||
        o.client.fullName.toLowerCase().includes(q) ||
        o.client.email.toLowerCase().includes(q) ||
        o.client.phoneOrZalo.toLowerCase().includes(q) ||
        (o.paymentRef ?? '').toLowerCase().includes(q)
      );
    });
  }, [effectiveOrders, searchQuery, statusFilter]);

  if (!isOpen) return null;

  const metrics = cloudOverview?.metrics ?? {
    totalOrders: effectiveOrders.length,
    paidOrdersCount: effectiveOrders.filter((o) =>
      ['DEPOSIT_VERIFIED', 'IN_DEVELOPMENT', 'UAT_STAGING', 'DELIVERED'].includes(o.status ?? '')
    ).length,
    paidRevenueVnd: effectiveOrders
      .filter((o) =>
        ['DEPOSIT_VERIFIED', 'IN_DEVELOPMENT', 'UAT_STAGING', 'DELIVERED'].includes(o.status ?? '')
      )
      .reduce((acc, o) => acc + o.totals.payableNowVnd, 0),
    pipelineVnd: effectiveOrders.reduce((acc, o) => acc + o.totals.netTotalVnd, 0),
    webhooksCount: effectiveWebhooks.length,
    webhooksTotalVnd: effectiveWebhooks.reduce((acc, w) => acc + w.transferAmountVnd, 0),
    inquiriesCount: effectiveInquiries.length,
    clientsCount: effectiveClients.length,
  };

  const selectedBank = VIETNAM_BANKS.find((b) => b.bin === bankBin) ?? VIETNAM_BANKS[0];
  const draftBankCfg: BankVietQrConfig = {
    bankBin,
    bankShortName: selectedBank.shortName,
    accountNumber,
    accountName,
  };
  const draftValid = isValidBankVietQrConfig(draftBankCfg);

  const flashNote = (msg: string) => {
    setActionFeedback(msg);
    window.setTimeout(() => {
      setActionFeedback((curr) => (curr === msg ? null : curr));
    }, 3000);
  };

  const handleStatusChange = async (orderCode: string, nextStatus: OrderLifecycleStatus) => {
    onUpdateOrderStatus(orderCode, nextStatus);
    if (cloudOverview?.source === 'supabase_cloud' && authSession) {
      const res = await updateCloudOrderAsAdmin(authSession, { orderCode, status: nextStatus });
      if (res.ok) {
        flashNote(`Đã đồng bộ Cloud: ${orderCode} → ${nextStatus}`);
        void refreshCloudData();
      } else {
        flashNote(`Lỗi đồng bộ Cloud: ${res.error || 'Unknown'}`);
      }
    }
  };

  const handleDeliveryUrlBlur = async (orderCode: string, nextUrl: string, prevUrl: string) => {
    const clean = nextUrl.trim();
    if (clean === prevUrl) return;
    onUpdateOrderDeliveryUrl(orderCode, clean);
    if (cloudOverview?.source === 'supabase_cloud' && authSession) {
      const res = await updateCloudOrderAsAdmin(authSession, {
        orderCode,
        deliveryZipUrl: clean,
      });
      if (res.ok) {
        flashNote(`Đã lưu link Source Code Cloud cho ${orderCode}`);
        void refreshCloudData();
      } else {
        flashNote(`Lỗi lưu link Source: ${res.error || 'Phải bắt đầu bằng https://'}`);
      }
    }
  };

  const handleDeleteOrder = async (orderCode: string) => {
    if (!authSession || cloudOverview?.source !== 'supabase_cloud') return;
    const res = await deleteCloudOrderAsAdmin(authSession, orderCode);
    if (res.ok) {
      flashNote(`Đã xóa đơn test ${orderCode} trên Cloud DB`);
      void refreshCloudData();
    } else {
      flashNote(`Không thể xóa ${orderCode}: ${res.error}`);
    }
  };

  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftValid) return;
    saveBankVietQrConfig(draftBankCfg);
    onBankConfigChange(draftBankCfg);
    setBankSaved(true);
    window.setTimeout(() => setBankSaved(false), 2000);
  };

  const handleClearBank = () => {
    saveBankVietQrConfig(null);
    onBankConfigChange(null);
    setAccountNumber('');
  };

  const handleSaveCloud = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseRuntimeConfig(cloudCfg);
    setCloudSaved(true);
    window.setTimeout(() => setCloudSaved(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="TVT Studio Owner Console"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl border"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-strong)',
          boxShadow: 'var(--shadow-modal)',
        }}
      >
        {/* Top Admin Header */}
        <div
          className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b px-6 py-4 backdrop-blur-md"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-hairline)',
          }}
        >
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono-num text-[11px] font-bold uppercase" style={{ color: 'var(--accent)' }}>
                ADMIN MANAGEMENT PORTAL · {ADMIN_OWNER_EMAIL}
              </span>
              <span
                className="font-mono-num rounded-full border px-2 py-0.5 text-[10px] font-bold"
                style={{
                  borderColor:
                    cloudOverview?.source === 'supabase_cloud' ? 'var(--emerald)' : 'var(--border-hairline)',
                  backgroundColor:
                    cloudOverview?.source === 'supabase_cloud' ? 'var(--emerald-soft)' : 'var(--bg-elevated)',
                  color:
                    cloudOverview?.source === 'supabase_cloud' ? 'var(--emerald)' : 'var(--ink-muted)',
                }}
              >
                {cloudOverview?.source === 'supabase_cloud'
                  ? 'CLOUD DB LIVE · ZERO-TRUST JWT'
                  : isVerifiedAdmin
                    ? 'LOCAL ADMIN MODE'
                    : 'PREVIEW MODE'}
              </span>
            </div>
            <h2 className="font-display mt-0.5 text-lg font-extrabold">
              {locale === 'vi'
                ? 'Trung Tâm Quản Trị TVT Studio — Đơn Hàng, MBBank Webhook & Kho Source'
                : 'TVT Studio Executive Admin — Orders, Bank Webhooks & Clients'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onLaunch10kLiveTest();
              }}
              className="btn-secondary hidden items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold sm:inline-flex"
            >
              <IconQrCode className="h-3.5 w-3.5" />
              <span>{locale === 'vi' ? 'Test QR 10K' : 'Test 10K QR'}</span>
            </button>
            <button
              type="button"
              onClick={() => void refreshCloudData()}
              disabled={loadingCloud}
              className="btn-ghost rounded-lg px-3 py-2 text-xs font-semibold"
              data-testid="admin-refresh-btn"
            >
              {loadingCloud ? '...' : locale === 'vi' ? 'Làm mới Cloud' : 'Sync Cloud'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost flex h-9 w-9 items-center justify-center rounded-lg"
              aria-label="Close owner console"
            >
              <IconClose className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Action Feedback Banner */}
        {actionFeedback && (
          <div
            className="border-b px-6 py-2.5 text-xs font-semibold"
            style={{
              backgroundColor: 'var(--emerald-soft)',
              borderColor: 'var(--emerald)',
              color: 'var(--emerald)',
            }}
          >
            {actionFeedback}
          </div>
        )}

        {/* Tab Strip */}
        <div className="flex flex-wrap gap-2 border-b px-6 py-3" style={{ borderColor: 'var(--border-hairline)' }}>
          {(
            [
              {
                id: 'orders',
                label:
                  locale === 'vi'
                    ? `Đơn Hàng (${metrics.totalOrders})`
                    : `Orders (${metrics.totalOrders})`,
              },
              {
                id: 'webhooks',
                label:
                  locale === 'vi'
                    ? `Biến Động MBBank / SePay (${effectiveWebhooks.length})`
                    : `Bank Webhooks (${effectiveWebhooks.length})`,
              },
              {
                id: 'clients',
                label:
                  locale === 'vi'
                    ? `Khách Hàng & Tư Vấn (${effectiveClients.length + effectiveInquiries.length})`
                    : `Clients & Leads (${effectiveClients.length + effectiveInquiries.length})`,
              },
              {
                id: 'settings',
                label: locale === 'vi' ? 'VietQR, Bảng Giá & Hệ Thống' : 'VietQR & System Config',
              },
            ] as const
          ).map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                data-testid={`admin-tab-${item.id}`}
                className="rounded-lg border px-3.5 py-2 text-xs font-semibold transition-all"
                style={{
                  backgroundColor: active ? 'var(--accent)' : 'var(--bg-elevated)',
                  borderColor: active ? 'var(--accent)' : 'var(--border-hairline)',
                  color: active ? '#ffffff' : 'var(--ink-secondary)',
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* TAB 1: ORDERS & CLOUD KPI */}
          {tab === 'orders' && (
            <div className="space-y-5">
              {/* 4 KPI Cards */}
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <div className="surface-elevated rounded-xl p-4">
                  <div className="text-[11px]" style={{ color: 'var(--ink-muted)' }}>
                    {locale === 'vi' ? 'Thực Thu Đã Xác Nhận' : 'Verified Paid Revenue'}
                  </div>
                  <div className="font-mono-num mt-1 text-xl font-extrabold sm:text-2xl" style={{ color: 'var(--emerald)' }}>
                    {formatMoney(metrics.paidRevenueVnd, 'VND')}
                  </div>
                </div>
                <div className="surface-elevated rounded-xl p-4">
                  <div className="text-[11px]" style={{ color: 'var(--ink-muted)' }}>
                    {locale === 'vi' ? 'Tổng Pipeline Hợp Đồng' : 'Total Contract Pipeline'}
                  </div>
                  <div className="font-mono-num mt-1 text-xl font-extrabold sm:text-2xl">
                    {formatMoney(metrics.pipelineVnd, 'VND')}
                  </div>
                </div>
                <div className="surface-elevated rounded-xl p-4">
                  <div className="text-[11px]" style={{ color: 'var(--ink-muted)' }}>
                    {locale === 'vi' ? 'Đơn Đã Cọc / Tổng Đơn' : 'Paid / Total Orders'}
                  </div>
                  <div className="font-mono-num mt-1 text-xl font-extrabold sm:text-2xl" style={{ color: 'var(--cyan)' }}>
                    {metrics.paidOrdersCount} / {metrics.totalOrders}
                  </div>
                </div>
                <div className="surface-elevated rounded-xl p-4">
                  <div className="text-[11px]" style={{ color: 'var(--ink-muted)' }}>
                    {locale === 'vi' ? 'Webhook MBBank / Tư Vấn' : 'Bank Webhooks / Leads'}
                  </div>
                  <div className="font-mono-num mt-1 text-xl font-extrabold sm:text-2xl" style={{ color: 'var(--accent)' }}>
                    {metrics.webhooksCount} · {metrics.inquiriesCount}
                  </div>
                </div>
              </div>

              {/* Search + Filter + Export */}
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative w-56">
                    <IconSearch className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm mã đơn, tên, SĐT, email..."
                      className="input-studio h-9 w-full rounded-lg pr-3 pl-8 text-xs"
                    />
                  </div>
                  {(['all', 'paid', 'pending'] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setStatusFilter(f)}
                      className="rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold"
                      style={{
                        backgroundColor: statusFilter === f ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                        borderColor: statusFilter === f ? 'var(--accent)' : 'var(--border-hairline)',
                        color: statusFilter === f ? 'var(--accent)' : 'var(--ink-secondary)',
                      }}
                    >
                      {f === 'all' ? 'Tất cả' : f === 'paid' ? 'Đã thanh toán' : 'Chờ xử lý'}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={effectiveOrders.length === 0}
                  onClick={() => {
                    const csv = exportOrdersToCsvBom(effectiveOrders);
                    downloadTextFile(`TVT-Studio-Orders-${new Date().toISOString().slice(0, 10)}.csv`, csv);
                  }}
                  className="btn-secondary inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-40"
                >
                  <IconDownload className="h-3.5 w-3.5" />
                  <span>Export CSV (UTF-8 BOM)</span>
                </button>
              </div>

              {/* Orders Table/Cards */}
              {filteredOrders.length === 0 ? (
                <p className="rounded-xl border p-6 text-center text-xs" style={{ borderColor: 'var(--border-hairline)', color: 'var(--ink-muted)' }}>
                  {locale === 'vi' ? 'Không có đơn hàng nào khớp bộ lọc.' : 'No orders match this filter.'}
                </p>
              ) : (
                <div className="space-y-2.5">
                  {filteredOrders.map((order) => {
                    const isPaid = ['DEPOSIT_VERIFIED', 'IN_DEVELOPMENT', 'UAT_STAGING', 'DELIVERED'].includes(
                      order.status ?? ''
                    );
                    return (
                      <div
                        key={order.orderCode}
                        className="flex flex-col justify-between gap-3 rounded-xl border p-4 sm:flex-row sm:items-center"
                        style={{
                          backgroundColor: 'var(--bg-canvas)',
                          borderColor: isPaid ? 'var(--emerald)' : 'var(--border-hairline)',
                        }}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono-num text-xs font-bold" style={{ color: 'var(--accent)' }}>
                              {order.orderCode}
                            </span>
                            <span className="text-xs font-bold">{order.client.fullName}</span>
                            <span className="font-mono-num text-[11px]" style={{ color: 'var(--ink-muted)' }}>
                              {order.client.phoneOrZalo} · {order.client.email}
                            </span>
                            {order.syncState === 'supabase_synced' && (
                              <span
                                className="font-mono-num rounded px-1.5 py-0.5 text-[9px] font-bold"
                                style={{ backgroundColor: 'var(--cyan-soft)', color: 'var(--cyan)' }}
                              >
                                CLOUD
                              </span>
                            )}
                          </div>
                          <div className="mt-1 text-[11px]" style={{ color: 'var(--ink-secondary)' }}>
                            <strong>{formatMoney(order.totals.netTotalVnd, 'VND')}</strong> (Đợt 1:{' '}
                            {formatMoney(order.totals.payableNowVnd, 'VND')}) · {order.paymentChannel}
                            {order.paymentRef ? ` · Ref: ${order.paymentRef}` : ''}
                            {order.deliverable?.licenseKey ? ` · Key: ${order.deliverable.licenseKey}` : ''}
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <input
                              type="url"
                              defaultValue={order.deliverable?.sourceDownloadUrl ?? ''}
                              onBlur={(e) =>
                                void handleDeliveryUrlBlur(
                                  order.orderCode,
                                  e.target.value,
                                  order.deliverable?.sourceDownloadUrl ?? ''
                                )
                              }
                              placeholder="Dán link HTTPS tải Source Code (.zip / Release) -> blur để lưu Cloud..."
                              className="input-studio h-8 w-full max-w-md rounded-lg px-2.5 font-mono-num text-[11px]"
                            />
                            {order.client.phoneOrZalo && (
                              <a
                                href={`https://zalo.me/${order.client.phoneOrZalo.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-ghost inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold"
                              >
                                <span>Zalo</span>
                                <IconArrowUpRight className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {!isCloudRealtimeConfigured() &&
                            order.status !== 'DEPOSIT_VERIFIED' &&
                            order.status !== 'DELIVERED' && (
                              <button
                                type="button"
                                onClick={() =>
                                  onSimulateRealtimeWebhook(order.orderCode, order.totals.payableNowVnd)
                                }
                                data-testid={`simulate-webhook-${order.orderCode}`}
                                className="rounded-lg border px-2.5 py-2 text-[11px] font-bold transition-colors hover:bg-[var(--emerald-soft)]"
                                style={{
                                  borderColor: 'var(--emerald)',
                                  color: 'var(--emerald)',
                                  backgroundColor: 'var(--bg-surface)',
                                }}
                              >
                                Test SePay PAID
                              </button>
                            )}
                          <select
                            value={order.status ?? 'AWAITING_PAYMENT'}
                            onChange={(e) =>
                              void handleStatusChange(
                                order.orderCode,
                                e.target.value as OrderLifecycleStatus
                              )
                            }
                            className="input-studio h-9 rounded-lg px-3 text-xs font-semibold"
                            aria-label={`Status for ${order.orderCode}`}
                          >
                            {ORDER_STATUS_SEQUENCE.map((st) => (
                              <option key={st} value={st}>
                                {ORDER_STATUS_META[st][locale]}
                              </option>
                            ))}
                          </select>
                          {cloudOverview?.source === 'supabase_cloud' &&
                            order.totals.netTotalVnd <= 20_000 && (
                              <button
                                type="button"
                                onClick={() => void handleDeleteOrder(order.orderCode)}
                                className="rounded-lg border px-2 py-2 text-[10px] font-bold"
                                style={{
                                  borderColor: 'var(--border-hairline)',
                                  color: 'var(--ink-muted)',
                                }}
                                title="Xóa đơn test 10K khỏi Cloud DB"
                              >
                                Xóa test
                              </button>
                            )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LIVE MBBANK / SEPAY WEBHOOKS LOG */}
          {tab === 'webhooks' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4" style={{ backgroundColor: 'var(--bg-canvas)', borderColor: 'var(--border-hairline)' }}>
                <div>
                  <div className="text-xs font-bold" style={{ color: 'var(--emerald)' }}>
                    MBBank `0325456574` ↔ SePay Free (0₫) ↔ Supabase `sepay-webhook`
                  </div>
                  <p className="mt-0.5 text-xs" style={{ color: 'var(--ink-secondary)' }}>
                    Tổng tiền ghi nhận qua Webhook Cloud:{' '}
                    <strong className="font-mono-num" style={{ color: 'var(--ink-primary)' }}>
                      {formatMoney(metrics.webhooksTotalVnd, 'VND')}
                    </strong>{' '}
                    ({effectiveWebhooks.length} giao dịch)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onLaunch10kLiveTest();
                  }}
                  className="btn-primary inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold"
                >
                  <IconQrCode className="h-3.5 w-3.5" />
                  <span>Tạo Đơn Test Quét QR 10.000₫</span>
                </button>
              </div>

              {effectiveWebhooks.length === 0 ? (
                <p className="rounded-xl border p-8 text-center text-xs" style={{ borderColor: 'var(--border-hairline)', color: 'var(--ink-muted)' }}>
                  {cloudOverview?.source === 'supabase_cloud'
                    ? 'Chưa có biến động số dư MBBank nào được SePay gửi về. Bấm "Tạo Đơn Test Quét QR 10.000₫" để kiểm tra trực tiếp!'
                    : 'Đăng nhập bằng tài khoản Admin tinhkun102@gmail.com (Google OAuth / Email Supabase) để xem nhật ký giao dịch MBBank real-time từ Cloud.'}
                </p>
              ) : (
                <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--border-hairline)' }}>
                  <table className="w-full text-left text-xs">
                    <thead style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--ink-muted)' }}>
                      <tr>
                        <th className="px-3.5 py-2.5">Mã GD / Kênh</th>
                        <th className="px-3.5 py-2.5">Mã Đơn Khớp</th>
                        <th className="px-3.5 py-2.5">Số Tiền</th>
                        <th className="px-3.5 py-2.5">Nội Dung CK</th>
                        <th className="px-3.5 py-2.5">Thời Gian</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: 'var(--border-hairline)' }}>
                      {effectiveWebhooks.map((w) => (
                        <tr key={String(w.id)} style={{ backgroundColor: 'var(--bg-canvas)' }}>
                          <td className="font-mono-num px-3.5 py-2.5 font-semibold">
                            {w.providerTxId} · {w.provider}
                          </td>
                          <td className="font-mono-num px-3.5 py-2.5 font-bold" style={{ color: w.orderCode ? 'var(--emerald)' : 'var(--ink-muted)' }}>
                            {w.orderCode || 'Không có mã đơn'}
                          </td>
                          <td className="font-mono-num px-3.5 py-2.5 font-bold" style={{ color: 'var(--emerald)' }}>
                            +{formatMoney(w.transferAmountVnd, 'VND')}
                          </td>
                          <td className="max-w-xs truncate px-3.5 py-2.5" style={{ color: 'var(--ink-secondary)' }}>
                            {w.transferContent}
                          </td>
                          <td className="font-mono-num px-3.5 py-2.5 text-[11px]" style={{ color: 'var(--ink-muted)' }}>
                            {new Date(w.createdAtIso).toLocaleString('vi-VN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CLIENTS & CONSULTATION LEADS */}
          {tab === 'clients' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-bold">
                  <IconUser className="h-4 w-4" style={{ color: 'var(--emerald)' }} />
                  <span>Tài Khoản Khách Hàng ({effectiveClients.length})</span>
                </h3>
                {effectiveClients.length === 0 ? (
                  <p className="rounded-xl border p-5 text-xs" style={{ borderColor: 'var(--border-hairline)', color: 'var(--ink-muted)' }}>
                    Chưa có hồ sơ khách hàng trên Cloud (hoặc chưa đăng nhập JWT Admin).
                  </p>
                ) : (
                  effectiveClients.map((c) => (
                    <div
                      key={c.email}
                      className="rounded-xl border p-3.5 text-xs"
                      style={{ backgroundColor: 'var(--bg-canvas)', borderColor: 'var(--border-hairline)' }}
                    >
                      <div className="font-bold">{c.fullName || '(Chưa đặt tên)'}</div>
                      <div className="font-mono-num mt-0.5 text-[11px]" style={{ color: 'var(--cyan)' }}>
                        {c.email}
                      </div>
                      <div className="mt-1 text-[11px]" style={{ color: 'var(--ink-secondary)' }}>
                        {c.phoneOrZalo || 'Chưa nhập SĐT'} · {c.brandOrDomain || 'Chưa nhập domain'}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold">
                  Yêu Cầu Tư Vấn / Thương Lượng Giá ({effectiveInquiries.length})
                </h3>
                {effectiveInquiries.length === 0 ? (
                  <p className="rounded-xl border p-5 text-xs" style={{ borderColor: 'var(--border-hairline)', color: 'var(--ink-muted)' }}>
                    Chưa có yêu cầu tư vấn nào.
                  </p>
                ) : (
                  effectiveInquiries.map((inq) => (
                    <div
                      key={inq.inquiryCode}
                      className="rounded-xl border p-3.5 text-xs"
                      style={{ backgroundColor: 'var(--bg-canvas)', borderColor: 'var(--border-hairline)' }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono-num font-bold" style={{ color: 'var(--cyan)' }}>
                          {inq.inquiryCode} · {inq.productName || 'Custom'}
                        </span>
                        <span className="font-mono-num text-[10px]" style={{ color: 'var(--ink-muted)' }}>
                          {inq.preferredLanguage}
                        </span>
                      </div>
                      <div className="mt-1 font-semibold">
                        {inq.fullName} — {inq.phoneOrZalo} ({inq.email})
                      </div>
                      <p className="mt-1" style={{ color: 'var(--ink-secondary)' }}>
                        {inq.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: VIETQR, PRICING TIERS & CLOUD CONFIG */}
          {tab === 'settings' && (
            <div className="space-y-6">
              <form onSubmit={handleSaveBank} className="grid grid-cols-1 gap-6 md:grid-cols-12">
                <div className="space-y-4 md:col-span-7">
                  <div className="text-sm font-bold">Cấu Hình VietQR Nhận Tiền (Mặc định MBBank 0325456574)</div>
                  <div>
                    <label htmlFor="owner-bank-bin" className="block text-xs font-semibold">
                      Ngân hàng (NAPAS BIN)
                    </label>
                    <select
                      id="owner-bank-bin"
                      value={bankBin}
                      onChange={(e) => setBankBin(e.target.value)}
                      className="input-studio mt-1.5 h-10 w-full rounded-xl px-3 text-sm"
                    >
                      {VIETNAM_BANKS.map((bank) => (
                        <option key={bank.bin} value={bank.bin}>
                          {bank.shortName} ({bank.bin}) — {bank.fullName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="owner-bank-acct" className="block text-xs font-semibold">
                        Số tài khoản
                      </label>
                      <input
                        id="owner-bank-acct"
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="input-studio mt-1.5 h-10 w-full rounded-xl px-3.5 font-mono-num text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="owner-bank-name" className="block text-xs font-semibold">
                        Tên chủ tài khoản
                      </label>
                      <input
                        id="owner-bank-name"
                        type="text"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        className="input-studio mt-1.5 h-10 w-full rounded-xl px-3.5 font-mono-num text-sm uppercase"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="submit"
                      disabled={!draftValid}
                      className="btn-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold disabled:opacity-45"
                    >
                      <IconCheck className="h-4 w-4" />
                      <span>{bankSaved ? 'Đã Lưu VietQR!' : 'Lưu & Kích Hoạt VietQR'}</span>
                    </button>
                    {bankConfig && (
                      <button
                        type="button"
                        onClick={handleClearBank}
                        className="btn-ghost rounded-xl px-3.5 py-2.5 text-xs font-semibold"
                      >
                        Xóa override cục bộ
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center rounded-2xl border p-5 md:col-span-5" style={{ backgroundColor: 'var(--bg-canvas)', borderColor: 'var(--border-hairline)' }}>
                  {draftValid ? (
                    <>
                      <div className="rounded-xl bg-white p-2.5 shadow-md">
                        <img
                          src={buildVietQrImageUrl(draftBankCfg, 10_000, 'TVTORDDEMO')}
                          alt="Live VietQR Preview"
                          className="h-44 w-44 object-contain"
                        />
                      </div>
                      <span className="font-mono-num mt-2 text-[11px]" style={{ color: 'var(--emerald)' }}>
                        LIVE MBBANK VIETQR PREVIEW
                      </span>
                    </>
                  ) : (
                    <IconQrCode className="h-10 w-10 opacity-40" />
                  )}
                </div>
              </form>

              <form onSubmit={handleSaveCloud} className="space-y-4 border-t pt-5" style={{ borderColor: 'var(--border-hairline)' }}>
                <div className="flex items-center gap-2 text-sm font-bold">
                  <IconShield className="h-4 w-4" style={{ color: 'var(--emerald)' }} />
                  <span>Supabase Cloud & Bảng Giá Server-Verified ({CATALOG_PRODUCTS.length} Web Mẫu)</span>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="sb-url" className="block text-xs font-semibold">
                      Supabase Project URL
                    </label>
                    <input
                      id="sb-url"
                      type="url"
                      value={cloudCfg.url}
                      onChange={(e) => setCloudCfg({ ...cloudCfg, url: e.target.value })}
                      className="input-studio mt-1.5 h-10 w-full rounded-xl px-3.5 font-mono-num text-xs"
                    />
                  </div>
                  <div>
                    <label htmlFor="sb-key" className="block text-xs font-semibold">
                      Supabase Anon Key
                    </label>
                    <input
                      id="sb-key"
                      type="password"
                      value={cloudCfg.anonKey}
                      onChange={(e) => setCloudCfg({ ...cloudCfg, anonKey: e.target.value })}
                      className="input-studio mt-1.5 h-10 w-full rounded-xl px-3.5 font-mono-num text-xs"
                    />
                  </div>
                </div>
                <button type="submit" className="btn-secondary inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold">
                  <IconCheck className="h-4 w-4" />
                  <span>{cloudSaved ? 'Đã Lưu Cấu Hình Cloud!' : 'Lưu Cấu Hình Cloud'}</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
