import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ADMIN_OWNER_EMAIL,
  bulkSeedCloudProductsAsAdmin,
  deleteCloudOrderAsAdmin,
  deleteCloudProductAsAdmin,
  fetchAdminCloudOverview,
  isAdminSession,
  quickUpdateCloudPriceAsAdmin,
  updateCloudOrderAsAdmin,
  upsertCloudProductAsAdmin,
  type AdminClientRecord,
  type AdminOverviewPayload,
  type AdminWebhookRecord,
} from '../engines/adminOps';
import {
  getBundledCmsProducts,
  getCategoryDefaultLabel,
  saveLocalCmsCatalogOverride,
  templateProductToAdminInput,
  validateProductDraft,
  type AdminCmsProduct,
  type ProductAdminMutationInput,
} from '../engines/analyticsAndCms';
import { formatMoney } from '../engines/catalog';
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
  ProductCategory,
  QuickInquiryRecord,
  TemplateProduct,
} from '../engines/types';
import { downloadTextFile } from '../utils/download';
import {
  IconArrowUpRight,
  IconCheck,
  IconClose,
  IconDownload,
  IconLayers,
  IconPlus,
  IconQrCode,
  IconSearch,
  IconShield,
  IconTrash,
  IconUser,
} from './Icons';

interface OwnerConsoleModalProps {
  isOpen: boolean;
  locale: Locale;
  authSession: AuthSession | null;
  orders: OrderSnapshot[];
  inquiries: QuickInquiryRecord[];
  bankConfig: BankVietQrConfig | null;
  catalogProducts: TemplateProduct[];
  onClose: () => void;
  onUpdateOrderStatus: (orderCode: string, nextStatus: OrderLifecycleStatus) => void;
  onUpdateOrderDeliveryUrl: (orderCode: string, downloadUrl: string) => void;
  onSimulateRealtimeWebhook: (orderCode: string, amountVnd: number) => void;
  onBankConfigChange: (next: BankVietQrConfig | null) => void;
  onCatalogProductsChange: (nextActiveProducts: TemplateProduct[]) => void;
  onLaunch10kLiveTest: () => void;
}

type AdminTab = 'overview' | 'products' | 'orders' | 'webhooks' | 'clients' | 'settings';
type ChartMode = 'visits' | 'revenue' | 'orders';

const EMPTY_PRODUCT_FORM: ProductAdminMutationInput = {
  id: '',
  sku: 'TVT-PRO-20',
  name: '',
  subtitleVi: '',
  subtitleEn: '',
  taglineVi: '',
  taglineEn: '',
  category: 'saas-ai',
  priceVnd: 12_900_000,
  originalPriceVnd: 19_900_000,
  priceUsd: 519,
  originalPriceUsd: 799,
  deliveryDaysMin: 3,
  deliveryDaysMax: 6,
  liveUrl: 'https://tvt987.github.io/',
  previewImage: './media/studio-emblem.webp',
  previewBadge: 'VIP PRO EDITION',
  featuredRank: 10,
  stack: ['React 19', 'TypeScript', 'Tailwind v4'],
  deliverablesVi: [
    'Tùy biến toàn bộ nhận diện thương hiệu, màu sắc & nội dung',
    'Triển khai Hosting, gắn Domain riêng, SSL & bảo hành kỹ thuật',
  ],
  deliverablesEn: [
    'Complete brand customization across typography, palette & copy',
    'Custom domain deployment, SSL & ongoing engineering support',
  ],
  architectureNoteVi: 'Kiến trúc module chuẩn sản xuất, tối ưu Core Web Vitals & bảo mật CSP.',
  architectureNoteEn: 'Production-grade modular architecture with Strict CSP & Core Web Vitals.',
  metricsBadge: 'VIP PRO EDITION',
  isActive: true,
};

function cmsInputToProduct(input: ProductAdminMutationInput): AdminCmsProduct {
  const catLabel = getCategoryDefaultLabel(input.category);
  const priceVnd = Math.max(10_000, Math.round(input.priceVnd));
  const originalPriceVnd = Math.max(priceVnd, Math.round(input.originalPriceVnd || priceVnd * 1.45));
  const priceUsd = Math.max(1, Math.round(input.priceUsd || priceVnd / 25_000));
  const originalPriceUsd = Math.max(
    priceUsd,
    Math.round(input.originalPriceUsd || originalPriceVnd / 25_000)
  );
  return {
    id: input.id.trim().toLowerCase(),
    sku: input.sku.trim().toUpperCase(),
    name: input.name.trim(),
    subtitle: {
      vi: input.subtitleVi.trim() || 'Giải pháp website thương mại cao cấp',
      en: input.subtitleEn.trim() || input.subtitleVi.trim() || 'Commercial enterprise web solution',
    },
    tagline: {
      vi: input.taglineVi.trim(),
      en: input.taglineEn.trim() || input.taglineVi.trim(),
    },
    category: input.category,
    categoryLabel: {
      vi: input.categoryLabelVi || catLabel.vi,
      en: input.categoryLabelEn || catLabel.en,
    },
    priceVnd,
    originalPriceVnd,
    priceUsd,
    originalPriceUsd,
    deliveryDaysMin: Math.max(1, Math.round(input.deliveryDaysMin || 3)),
    deliveryDaysMax: Math.max(
      Math.max(1, Math.round(input.deliveryDaysMin || 3)),
      Math.round(input.deliveryDaysMax || 6)
    ),
    liveUrl: input.liveUrl.trim() || 'https://tvt987.github.io/tvt-studio/',
    previewImage: input.previewImage.trim() || './media/studio-emblem.webp',
    previewBadge: input.previewBadge?.trim() || input.metricsBadge.trim() || 'VIP PRO',
    featuredRank: Math.max(1, Math.round(input.featuredRank || 20)),
    stack: input.stack.length > 0 ? input.stack : ['React 19', 'TypeScript'],
    deliverables: {
      vi: input.deliverablesVi.length > 0 ? input.deliverablesVi : EMPTY_PRODUCT_FORM.deliverablesVi,
      en: input.deliverablesEn.length > 0 ? input.deliverablesEn : EMPTY_PRODUCT_FORM.deliverablesEn,
    },
    architectureNote: {
      vi: input.architectureNoteVi.trim() || EMPTY_PRODUCT_FORM.architectureNoteVi,
      en: input.architectureNoteEn.trim() || EMPTY_PRODUCT_FORM.architectureNoteEn,
    },
    metricsBadge: input.metricsBadge.trim() || input.previewBadge?.trim() || 'VIP PRO',
    isActive: input.isActive,
    updatedAtIso: new Date().toISOString(),
  };
}

export const OwnerConsoleModal: React.FC<OwnerConsoleModalProps> = ({
  isOpen,
  locale,
  authSession,
  orders,
  inquiries,
  bankConfig,
  catalogProducts,
  onClose,
  onUpdateOrderStatus,
  onUpdateOrderDeliveryUrl,
  onSimulateRealtimeWebhook,
  onBankConfigChange,
  onCatalogProductsChange,
  onLaunch10kLiveTest,
}) => {
  const [tab, setTab] = useState<AdminTab>('overview');
  const [chartMode, setChartMode] = useState<ChartMode>('visits');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');

  // Product CMS State
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState<ProductCategory>('all');
  const [cmsProducts, setCmsProducts] = useState<AdminCmsProduct[]>(() =>
    catalogProducts.map((p) => ({ ...p, isActive: true }))
  );
  const [inlinePriceDrafts, setInlinePriceDrafts] = useState<Record<string, string>>({});
  const [inlineRankDrafts, setInlineRankDrafts] = useState<Record<string, string>>({});
  const [editingForm, setEditingForm] = useState<ProductAdminMutationInput | null>(null);
  const [editingStackText, setEditingStackText] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [savingProductId, setSavingProductId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

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
    if (data.products.length > 0) {
      setCmsProducts(data.products);
    }
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
  const dailySeries = cloudOverview?.analytics.dailySeries14d ?? [];
  const topProducts = cloudOverview?.analytics.topProducts ?? [];

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

  const filteredCmsProducts = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    return [...cmsProducts]
      .filter((p) => {
        if (productCatFilter !== 'all' && p.category !== productCatFilter) return false;
        if (!q) return true;
        return (
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.subtitle.vi.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => a.featuredRank - b.featuredRank);
  }, [cmsProducts, productCatFilter, productSearch]);

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
    totalVisits: 1,
    uniqueVisitors: 1,
    todayVisits: 1,
    sandboxOpens: 0,
    productDetailViews: 0,
    addToCartEvents: 0,
    checkoutStarts: 0,
    conversionRatePct: 0,
    paidConversionPct: 0,
    activeProductsCount: cmsProducts.filter((p) => p.isActive).length,
    totalProductsCount: cmsProducts.length,
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
    }, 3400);
  };

  const applyProductsUpdateLocally = (nextAll: AdminCmsProduct[]) => {
    const sorted = [...nextAll].sort((a, b) => a.featuredRank - b.featuredRank);
    setCmsProducts(sorted);
    saveLocalCmsCatalogOverride(sorted);
    onCatalogProductsChange(sorted.filter((p) => p.isActive));
  };

  // --- PRODUCT CMS CRUD HANDLERS ---

  const handleOpenCreateProduct = () => {
    const nextRank = Math.max(1, cmsProducts.length + 1);
    const nextSkuNum = String(cmsProducts.length + 1).padStart(2, '0');
    const draft: ProductAdminMutationInput = {
      ...EMPTY_PRODUCT_FORM,
      sku: `TVT-PRO-${nextSkuNum}`,
      featuredRank: nextRank,
    };
    setEditingForm(draft);
    setEditingStackText(draft.stack.join(', '));
    setIsCreatingNew(true);
    setFormError(null);
  };

  const handleOpenEditProduct = (product: AdminCmsProduct) => {
    const draft = templateProductToAdminInput(product, product.isActive);
    setEditingForm(draft);
    setEditingStackText(draft.stack.join(', '));
    setIsCreatingNew(false);
    setFormError(null);
  };

  const handleSaveProductForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingForm) return;

    const stackParsed = editingStackText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 8);

    const payload: ProductAdminMutationInput = {
      ...editingForm,
      id: editingForm.id.trim().toLowerCase(),
      sku: editingForm.sku.trim().toUpperCase(),
      priceVnd: Math.round(Number(editingForm.priceVnd) || 0),
      originalPriceVnd: Math.max(
        Math.round(Number(editingForm.priceVnd) || 0),
        Math.round(Number(editingForm.originalPriceVnd) || Math.round((Number(editingForm.priceVnd) || 0) * 1.45))
      ),
      priceUsd: Math.max(1, Math.round((Number(editingForm.priceVnd) || 0) / 25_000)),
      originalPriceUsd: Math.max(
        1,
        Math.round(
          Math.max(
            Number(editingForm.priceVnd) || 0,
            Number(editingForm.originalPriceVnd) || Math.round((Number(editingForm.priceVnd) || 0) * 1.45)
          ) / 25_000
        )
      ),
      stack: stackParsed.length > 0 ? stackParsed : ['React 19', 'TypeScript'],
    };

    const check = validateProductDraft(payload);
    if (!check.valid) {
      setFormError(check.error || 'Dữ liệu sản phẩm chưa hợp lệ');
      return;
    }

    setSavingProductId(payload.id);
    setFormError(null);

    const localMapped = cmsInputToProduct(payload);
    const nextList = [
      localMapped,
      ...cmsProducts.filter((p) => p.id !== localMapped.id),
    ];

    if (cloudOverview?.source === 'supabase_cloud' && authSession) {
      const res = await upsertCloudProductAsAdmin(authSession, payload);
      if (res.ok) {
        const saved = res.product ?? localMapped;
        applyProductsUpdateLocally([saved, ...cmsProducts.filter((p) => p.id !== saved.id)]);
        flashNote(
          isCreatingNew
            ? `Đã thêm sản phẩm mới "${saved.name}" lên Cloud DB (tvt_products)`
            : `Đã cập nhật "${saved.name}" (${formatMoney(saved.priceVnd, 'VND')}) lên Cloud DB`
        );
        setEditingForm(null);
        void refreshCloudData();
      } else {
        setFormError(res.error || 'Lỗi lưu sản phẩm lên Cloud');
      }
    } else {
      applyProductsUpdateLocally(nextList);
      flashNote(
        isCreatingNew
          ? `Đã thêm sản phẩm "${localMapped.name}" vào Storefront (Local CMS)`
          : `Đã cập nhật "${localMapped.name}" — ${formatMoney(localMapped.priceVnd, 'VND')}`
      );
      setEditingForm(null);
    }
    setSavingProductId(null);
  };

  const handleQuickSavePrice = async (product: AdminCmsProduct) => {
    const rawPrice = inlinePriceDrafts[product.id];
    const rawRank = inlineRankDrafts[product.id];
    const nextPriceVnd =
      rawPrice !== undefined
        ? Math.round(Number(rawPrice.replace(/[^\d]/g, '')))
        : product.priceVnd;
    const nextRank =
      rawRank !== undefined ? Math.max(1, Math.min(999, Math.round(Number(rawRank)))) : product.featuredRank;

    if (!Number.isFinite(nextPriceVnd) || nextPriceVnd < 10_000) {
      flashNote('Giá bán VNĐ tối thiểu là 10.000₫');
      return;
    }

    setSavingProductId(product.id);
    const nextOrigVnd = Math.max(nextPriceVnd, product.originalPriceVnd);
    const updatedLocal: AdminCmsProduct = {
      ...product,
      priceVnd: nextPriceVnd,
      originalPriceVnd: nextOrigVnd,
      priceUsd: Math.max(1, Math.round(nextPriceVnd / 25_000)),
      originalPriceUsd: Math.max(1, Math.round(nextOrigVnd / 25_000)),
      featuredRank: nextRank,
      updatedAtIso: new Date().toISOString(),
    };

    if (cloudOverview?.source === 'supabase_cloud' && authSession) {
      const res = await quickUpdateCloudPriceAsAdmin(authSession, {
        productId: product.id,
        priceVnd: nextPriceVnd,
        originalPriceVnd: nextOrigVnd,
        featuredRank: nextRank,
      });
      if (res.ok) {
        const saved = res.product ?? updatedLocal;
        applyProductsUpdateLocally(cmsProducts.map((p) => (p.id === product.id ? saved : p)));
        flashNote(`Đã cập nhật giá Cloud: ${product.name} → ${formatMoney(nextPriceVnd, 'VND')} (Top #${nextRank})`);
      } else {
        flashNote(`Lỗi cập nhật giá Cloud: ${res.error || 'Unknown'}`);
      }
    } else {
      applyProductsUpdateLocally(cmsProducts.map((p) => (p.id === product.id ? updatedLocal : p)));
      flashNote(`Đã cập nhật giá: ${product.name} → ${formatMoney(nextPriceVnd, 'VND')} (Top #${nextRank})`);
    }
    setSavingProductId(null);
  };

  const handleToggleProductActive = async (product: AdminCmsProduct) => {
    const nextActive = !product.isActive;
    setSavingProductId(product.id);
    const updatedLocal: AdminCmsProduct = { ...product, isActive: nextActive };

    if (cloudOverview?.source === 'supabase_cloud' && authSession) {
      const res = await quickUpdateCloudPriceAsAdmin(authSession, {
        productId: product.id,
        isActive: nextActive,
      });
      if (res.ok) {
        applyProductsUpdateLocally(cmsProducts.map((p) => (p.id === product.id ? updatedLocal : p)));
        flashNote(nextActive ? `Đã hiển thị lại "${product.name}" trên Storefront` : `Đã tạm ẩn "${product.name}" khỏi Storefront`);
      } else {
        flashNote(`Lỗi cập nhật trạng thái: ${res.error}`);
      }
    } else {
      applyProductsUpdateLocally(cmsProducts.map((p) => (p.id === product.id ? updatedLocal : p)));
      flashNote(nextActive ? `Đã hiển thị "${product.name}"` : `Đã tạm ẩn "${product.name}"`);
    }
    setSavingProductId(null);
  };

  const handleDeleteProduct = async (product: AdminCmsProduct) => {
    if (confirmDeleteId !== product.id) {
      setConfirmDeleteId(product.id);
      return;
    }
    setSavingProductId(product.id);
    setConfirmDeleteId(null);

    if (cloudOverview?.source === 'supabase_cloud' && authSession) {
      const res = await deleteCloudProductAsAdmin(authSession, product.id);
      if (res.ok) {
        applyProductsUpdateLocally(cmsProducts.filter((p) => p.id !== product.id));
        flashNote(`Đã xóa vĩnh viễn "${product.name}" khỏi Cloud DB`);
      } else {
        flashNote(`Lỗi xóa sản phẩm: ${res.error}`);
      }
    } else {
      applyProductsUpdateLocally(cmsProducts.filter((p) => p.id !== product.id));
      flashNote(`Đã xóa "${product.name}" khỏi danh mục`);
    }
    setSavingProductId(null);
  };

  const handleSyncBundledCatalogToCloud = async () => {
    const bundled = getBundledCmsProducts();
    if (cloudOverview?.source === 'supabase_cloud' && authSession) {
      setLoadingCloud(true);
      const res = await bulkSeedCloudProductsAsAdmin(
        authSession,
        bundled.map((p) => templateProductToAdminInput(p, true))
      );
      setLoadingCloud(false);
      if (res.ok) {
        flashNote(`Đã đồng bộ ${res.seededCount ?? bundled.length} mẫu chuẩn lên Supabase Cloud!`);
        void refreshCloudData();
      } else {
        flashNote(`Lỗi đồng bộ Cloud: ${res.error}`);
      }
    } else {
      applyProductsUpdateLocally(bundled);
      flashNote(`Đã khôi phục ${bundled.length} mẫu website chuẩn vào danh mục!`);
    }
  };

  // --- ORDER HANDLERS ---

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

  // --- SVG 14-DAY CHART COMPUTATION ---
  const chartValues = dailySeries.map((d) =>
    chartMode === 'visits' ? d.visits : chartMode === 'revenue' ? d.revenueVnd : d.orders
  );
  const chartMax = Math.max(1, ...chartValues);
  const chartHeight = 156;
  const chartWidth = 640;
  const padX = 28;
  const padY = 18;
  const plotW = chartWidth - padX * 2;
  const plotH = chartHeight - padY * 2;

  const chartPoints = dailySeries.map((d, idx) => {
    const val = chartValues[idx] ?? 0;
    const x =
      dailySeries.length > 1
        ? padX + (idx / (dailySeries.length - 1)) * plotW
        : padX + plotW / 2;
    const y = padY + plotH - (val / chartMax) * plotH;
    return { x, y, val, label: d.label, date: d.date, unique: d.uniqueVisitors };
  });

  const polylineStr = chartPoints.map((pt) => `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(' ');

  const funnelStages = [
    {
      label: locale === 'vi' ? 'Lượt Ghé Thăm (Page Views)' : 'Page Visits',
      count: metrics.totalVisits,
      color: 'var(--cyan)',
    },
    {
      label: locale === 'vi' ? 'Mở Live Sandbox / Xem Chi Tiết' : 'Sandbox & Spec Views',
      count: metrics.sandboxOpens + metrics.productDetailViews,
      color: '#818cf8',
    },
    {
      label: locale === 'vi' ? 'Thêm Vào Giỏ Hàng' : 'Add to Cart',
      count: metrics.addToCartEvents,
      color: 'var(--accent)',
    },
    {
      label: locale === 'vi' ? 'Bắt Đầu Thanh Toán (Checkout)' : 'Checkout Started',
      count: metrics.checkoutStarts,
      color: '#f59e0b',
    },
    {
      label: locale === 'vi' ? 'Đơn Đã Xác Nhận Thanh Toán' : 'Verified Paid Orders',
      count: metrics.paidOrdersCount,
      color: 'var(--emerald)',
    },
  ];
  const funnelMax = Math.max(1, ...funnelStages.map((s) => s.count));

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
        className="max-h-[93vh] w-full max-w-6xl overflow-y-auto rounded-2xl border"
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
                EXECUTIVE ADMIN CMS v8.0 · {ADMIN_OWNER_EMAIL}
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
                    : 'PREVIEW CMS MODE'}
              </span>
            </div>
            <h2 className="font-display mt-0.5 text-lg font-extrabold">
              {locale === 'vi'
                ? 'Trung Tâm Quản Trị TVT Studio — Doanh Thu, Lượt Ghé Thăm & CRUD Sản Phẩm'
                : 'TVT Studio Executive CMS — Revenue, Traffic Analytics & Product CRUD'}
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
              {loadingCloud ? '...' : locale === 'vi' ? 'Đồng Bộ Cloud' : 'Sync Cloud'}
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
            data-testid="admin-feedback-banner"
          >
            {actionFeedback}
          </div>
        )}

        {/* 6-Tab Executive Strip */}
        <div className="flex flex-wrap gap-2 border-b px-6 py-3" style={{ borderColor: 'var(--border-hairline)' }}>
          {(
            [
              {
                id: 'overview',
                label: locale === 'vi' ? 'Tổng Quan & Lượt Ghé Thăm' : 'Overview & Traffic',
              },
              {
                id: 'products',
                label:
                  locale === 'vi'
                    ? `Sản Phẩm & Giá (${cmsProducts.length})`
                    : `Products CMS (${cmsProducts.length})`,
              },
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
                    ? `MBBank / SePay (${effectiveWebhooks.length})`
                    : `Bank Webhooks (${effectiveWebhooks.length})`,
              },
              {
                id: 'clients',
                label:
                  locale === 'vi'
                    ? `Khách & Tư Vấn (${effectiveClients.length + effectiveInquiries.length})`
                    : `Clients (${effectiveClients.length + effectiveInquiries.length})`,
              },
              {
                id: 'settings',
                label: locale === 'vi' ? 'VietQR & Hệ Thống' : 'VietQR & Config',
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
                className="rounded-lg border px-3 py-2 text-xs font-semibold transition-all"
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
          {/* ================================================================ */}
          {/* TAB 1: EXECUTIVE OVERVIEW, TRAFFIC ANALYTICS & 14-DAY CHARTS    */}
          {/* ================================================================ */}
          {tab === 'overview' && (
            <div className="space-y-6" data-testid="admin-overview-panel">
              {/* 6 Executive KPI Cards */}
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                <div className="surface-elevated rounded-xl p-4">
                  <div className="text-[11px] font-semibold" style={{ color: 'var(--ink-muted)' }}>
                    {locale === 'vi' ? 'Tổng Lượt Ghé Thăm (30 ngày)' : 'Total Visits (30d)'}
                  </div>
                  <div className="font-mono-num mt-1 text-2xl font-extrabold" style={{ color: 'var(--cyan)' }}>
                    {metrics.totalVisits.toLocaleString('vi-VN')}
                  </div>
                  <div className="font-mono-num mt-1 text-[11px]" style={{ color: 'var(--ink-secondary)' }}>
                    Hôm nay: <strong>+{metrics.todayVisits}</strong> · Khách duy nhất:{' '}
                    <strong>{metrics.uniqueVisitors}</strong>
                  </div>
                </div>

                <div className="surface-elevated rounded-xl p-4">
                  <div className="text-[11px] font-semibold" style={{ color: 'var(--ink-muted)' }}>
                    {locale === 'vi' ? 'Doanh Thu Thực Thu (MBBank)' : 'Verified Paid Revenue'}
                  </div>
                  <div className="font-mono-num mt-1 text-2xl font-extrabold" style={{ color: 'var(--emerald)' }}>
                    {formatMoney(metrics.paidRevenueVnd, 'VND')}
                  </div>
                  <div className="font-mono-num mt-1 text-[11px]" style={{ color: 'var(--ink-secondary)' }}>
                    Webhook SePay: <strong>{metrics.webhooksCount}</strong> GD ({formatMoney(metrics.webhooksTotalVnd, 'VND')})
                  </div>
                </div>

                <div className="surface-elevated rounded-xl p-4">
                  <div className="text-[11px] font-semibold" style={{ color: 'var(--ink-muted)' }}>
                    {locale === 'vi' ? 'Tổng Đơn Hàng & Chuyển Đổi' : 'Total Orders & Conversion'}
                  </div>
                  <div className="font-mono-num mt-1 text-2xl font-extrabold">
                    {metrics.paidOrdersCount} / {metrics.totalOrders}
                  </div>
                  <div className="font-mono-num mt-1 text-[11px]" style={{ color: 'var(--ink-secondary)' }}>
                    Tỷ lệ tạo đơn: <strong>{metrics.conversionRatePct}%</strong> · Đã cọc:{' '}
                    <strong>{metrics.paidConversionPct}%</strong>
                  </div>
                </div>

                <div className="surface-elevated rounded-xl p-4">
                  <div className="text-[11px] font-semibold" style={{ color: 'var(--ink-muted)' }}>
                    {locale === 'vi' ? 'Tổng Pipeline Hợp Đồng' : 'Total Contract Pipeline'}
                  </div>
                  <div className="font-mono-num mt-1 text-2xl font-extrabold" style={{ color: 'var(--accent)' }}>
                    {formatMoney(metrics.pipelineVnd, 'VND')}
                  </div>
                  <div className="font-mono-num mt-1 text-[11px]" style={{ color: 'var(--ink-secondary)' }}>
                    Khách hàng đăng ký: <strong>{metrics.clientsCount}</strong> · Tư vấn:{' '}
                    <strong>{metrics.inquiriesCount}</strong>
                  </div>
                </div>

                <div className="surface-elevated rounded-xl p-4">
                  <div className="text-[11px] font-semibold" style={{ color: 'var(--ink-muted)' }}>
                    {locale === 'vi' ? 'Tương Tác Live Sandbox / Giỏ' : 'Sandbox & Cart Activity'}
                  </div>
                  <div className="font-mono-num mt-1 text-2xl font-extrabold">
                    {metrics.sandboxOpens} / {metrics.addToCartEvents}
                  </div>
                  <div className="font-mono-num mt-1 text-[11px]" style={{ color: 'var(--ink-secondary)' }}>
                    Xem chi tiết: <strong>{metrics.productDetailViews}</strong> · Mở Checkout:{' '}
                    <strong>{metrics.checkoutStarts}</strong>
                  </div>
                </div>

                <div className="surface-elevated rounded-xl p-4">
                  <div className="text-[11px] font-semibold" style={{ color: 'var(--ink-muted)' }}>
                    {locale === 'vi' ? 'Kho Sản Phẩm Đang Bán (CMS)' : 'Active Catalog SKUs'}
                  </div>
                  <div className="font-mono-num mt-1 text-2xl font-extrabold" style={{ color: 'var(--emerald)' }}>
                    {metrics.activeProductsCount} / {metrics.totalProductsCount}
                  </div>
                  <button
                    type="button"
                    onClick={() => setTab('products')}
                    className="mt-1 text-[11px] font-bold underline"
                    style={{ color: 'var(--accent)' }}
                  >
                    Mở CRUD Sản Phẩm & Cập Nhật Giá →
                  </button>
                </div>
              </div>

              {/* 14-Day Interactive SVG Chart + Conversion Funnel */}
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                {/* 14-Day Trend SVG Chart */}
                <div
                  className="rounded-2xl border p-5 lg:col-span-7"
                  style={{ backgroundColor: 'var(--bg-canvas)', borderColor: 'var(--border-hairline)' }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold">
                        {locale === 'vi' ? 'Biểu Đồ 14 Ngày Gần Nhất (Giờ VN)' : '14-Day Performance Trend'}
                      </h3>
                      <p className="text-[11px]" style={{ color: 'var(--ink-muted)' }}>
                        Dữ liệu telemetry không lưu PII · đồng bộ tự động từ Supabase
                      </p>
                    </div>
                    <div className="flex items-center gap-1 rounded-lg border p-1" style={{ borderColor: 'var(--border-hairline)', backgroundColor: 'var(--bg-elevated)' }}>
                      {(
                        [
                          { id: 'visits', label: 'Lượt Ghé Thăm' },
                          { id: 'revenue', label: 'Doanh Thu' },
                          { id: 'orders', label: 'Đơn Hàng' },
                        ] as const
                      ).map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setChartMode(m.id)}
                          data-testid={`chart-mode-${m.id}`}
                          className="rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors"
                          style={{
                            backgroundColor: chartMode === m.id ? 'var(--accent)' : 'transparent',
                            color: chartMode === m.id ? '#ffffff' : 'var(--ink-secondary)',
                          }}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 overflow-x-auto">
                    <svg
                      viewBox={`0 0 ${chartWidth} ${chartHeight + 24}`}
                      className="h-48 w-full min-w-[460px]"
                      role="img"
                      aria-label="14-day analytics trend chart"
                    >
                      {/* Horizontal grid lines */}
                      {[0, 0.5, 1].map((ratio) => {
                        const y = padY + plotH * (1 - ratio);
                        return (
                          <line
                            key={ratio}
                            x1={padX}
                            y1={y}
                            x2={chartWidth - padX}
                            y2={y}
                            stroke="currentColor"
                            strokeOpacity="0.12"
                            strokeDasharray="3 4"
                          />
                        );
                      })}

                      {/* Bars */}
                      {chartPoints.map((pt, idx) => {
                        const barW = Math.max(12, plotW / Math.max(14, dailySeries.length) - 8);
                        const barH = Math.max(2, padY + plotH - pt.y);
                        return (
                          <g key={pt.date || idx}>
                            <rect
                              x={pt.x - barW / 2}
                              y={pt.y}
                              width={barW}
                              height={barH}
                              rx="4"
                              fill={
                                chartMode === 'revenue'
                                  ? '#10b981'
                                  : chartMode === 'orders'
                                    ? '#f97316'
                                    : '#06b6d4'
                              }
                              fillOpacity="0.32"
                            >
                              <title>
                                {`${pt.date}: ${
                                  chartMode === 'revenue'
                                    ? formatMoney(pt.val, 'VND')
                                    : `${pt.val} (${pt.unique} unique)`
                                }`}
                              </title>
                            </rect>
                            {idx % 2 === 0 && (
                              <text
                                x={pt.x}
                                y={chartHeight + 14}
                                textAnchor="middle"
                                fontSize="10"
                                fill="currentColor"
                                fillOpacity="0.55"
                              >
                                {pt.label}
                              </text>
                            )}
                          </g>
                        );
                      })}

                      {/* Trend line */}
                      {chartPoints.length > 1 && (
                        <polyline
                          fill="none"
                          stroke={
                            chartMode === 'revenue'
                              ? '#10b981'
                              : chartMode === 'orders'
                                ? '#f97316'
                                : '#06b6d4'
                          }
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={polylineStr}
                        />
                      )}

                      {/* Data dots */}
                      {chartPoints.map((pt, idx) => (
                        <circle
                          key={`dot-${pt.date || idx}`}
                          cx={pt.x}
                          cy={pt.y}
                          r={pt.val > 0 ? 3.5 : 2}
                          fill={
                            chartMode === 'revenue'
                              ? '#10b981'
                              : chartMode === 'orders'
                                ? '#f97316'
                                : '#06b6d4'
                          }
                        />
                      ))}
                    </svg>
                  </div>
                </div>

                {/* Conversion Funnel */}
                <div
                  className="rounded-2xl border p-5 lg:col-span-5"
                  style={{ backgroundColor: 'var(--bg-canvas)', borderColor: 'var(--border-hairline)' }}
                >
                  <h3 className="text-sm font-bold">
                    {locale === 'vi' ? 'Phễu Chuyển Đổi Khách Hàng (Funnel)' : 'Customer Conversion Funnel'}
                  </h3>
                  <p className="mt-0.5 text-[11px]" style={{ color: 'var(--ink-muted)' }}>
                    Theo dõi hành trình từ lúc vào trang → mở Demo → chốt đơn VietQR
                  </p>
                  <div className="mt-4 space-y-3">
                    {funnelStages.map((stage) => {
                      const pct = Math.max(4, Math.round((stage.count / funnelMax) * 100));
                      return (
                        <div key={stage.label}>
                          <div className="flex items-center justify-between text-xs">
                            <span style={{ color: 'var(--ink-secondary)' }}>{stage.label}</span>
                            <span className="font-mono-num font-bold">{stage.count}</span>
                          </div>
                          <div
                            className="mt-1.5 h-2 w-full overflow-hidden rounded-full"
                            style={{ backgroundColor: 'var(--bg-elevated)' }}
                          >
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${pct}%`, backgroundColor: stage.color }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Top Products Performance Table */}
              <div
                className="rounded-2xl border p-5"
                style={{ backgroundColor: 'var(--bg-canvas)', borderColor: 'var(--border-hairline)' }}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold">
                    {locale === 'vi'
                      ? 'Sản Phẩm Được Quan Tâm & Doanh Số Cao Nhất'
                      : 'Top Viewed & Highest Revenue Products'}
                  </h3>
                  <span className="font-mono-num text-[11px]" style={{ color: 'var(--ink-muted)' }}>
                    Top {topProducts.length} SKUs
                  </span>
                </div>
                {topProducts.length === 0 ? (
                  <p className="mt-3 text-xs" style={{ color: 'var(--ink-muted)' }}>
                    Chưa có lượt mở Live Sandbox hoặc đơn hàng nào trong 30 ngày gần nhất. Khi khách bấm Demo hoặc Thêm Giỏ, bảng xếp hạng sẽ cập nhật ngay lập tức.
                  </p>
                ) : (
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead style={{ color: 'var(--ink-muted)' }}>
                        <tr className="border-b" style={{ borderColor: 'var(--border-hairline)' }}>
                          <th className="py-2 pr-4">Sản phẩm</th>
                          <th className="px-3 py-2 text-right">Mở Sandbox</th>
                          <th className="px-3 py-2 text-right">Xem Chi Tiết</th>
                          <th className="px-3 py-2 text-right">Thêm Giỏ</th>
                          <th className="px-3 py-2 text-right">Số Đơn</th>
                          <th className="py-2 pl-3 text-right">Doanh Số Ghi Nhận</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderColor: 'var(--border-hairline)' }}>
                        {topProducts.map((tp) => (
                          <tr key={tp.productId}>
                            <td className="py-2.5 pr-4 font-semibold">{tp.name}</td>
                            <td className="font-mono-num px-3 py-2.5 text-right">{tp.sandboxOpens}</td>
                            <td className="font-mono-num px-3 py-2.5 text-right">{tp.detailViews}</td>
                            <td className="font-mono-num px-3 py-2.5 text-right">{tp.cartAdds}</td>
                            <td className="font-mono-num px-3 py-2.5 text-right font-bold" style={{ color: 'var(--cyan)' }}>
                              {tp.orderCount}
                            </td>
                            <td className="font-mono-num py-2.5 pl-3 text-right font-bold" style={{ color: 'var(--emerald)' }}>
                              {formatMoney(tp.revenueVnd, 'VND')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 2: FULL PRODUCT & PRICING CMS (INSERT / UPDATE / DELETE)     */}
          {/* ================================================================ */}
          {tab === 'products' && (
            <div className="space-y-5" data-testid="admin-products-panel">
              {/* Top CMS Action Bar */}
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative w-56">
                    <IconSearch className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2" />
                    <input
                      type="search"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Tìm sản phẩm, SKU, ID..."
                      className="input-studio h-9 w-full rounded-lg pr-3 pl-8 text-xs"
                    />
                  </div>
                  <select
                    value={productCatFilter}
                    onChange={(e) => setProductCatFilter(e.target.value as ProductCategory)}
                    className="input-studio h-9 rounded-lg px-2.5 text-xs font-semibold"
                    aria-label="Filter CMS products by category"
                  >
                    <option value="all">Tất cả danh mục ({cmsProducts.length})</option>
                    <option value="commerce-3d">3D & Nội Thất</option>
                    <option value="saas-ai">SaaS & AI</option>
                    <option value="enterprise-b2b">HR, Luật & FinTech</option>
                    <option value="pos-fnb">Resort, F&B & POS</option>
                    <option value="clinic-proptech">Y Tế, BĐS & Gym</option>
                  </select>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void handleSyncBundledCatalogToCloud()}
                    className="btn-secondary inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold"
                  >
                    <IconLayers className="h-3.5 w-3.5" />
                    <span>Đồng Bộ 26 Mẫu Chuẩn</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenCreateProduct}
                    data-testid="admin-add-product-btn"
                    className="btn-primary inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold"
                  >
                    <IconPlus className="h-3.5 w-3.5" />
                    <span>Thêm Sản Phẩm Mới</span>
                  </button>
                </div>
              </div>

              {/* Inline Create / Edit Product Form Drawer */}
              {editingForm && (
                <form
                  onSubmit={(e) => void handleSaveProductForm(e)}
                  data-testid="admin-product-form"
                  className="space-y-4 rounded-2xl border p-5"
                  style={{
                    backgroundColor: 'var(--bg-canvas)',
                    borderColor: 'var(--accent)',
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-sm font-extrabold" style={{ color: 'var(--accent)' }}>
                      {isCreatingNew
                        ? '+ THÊM SẢN PHẨM MỚI VÀO STOREFRONT & CLOUD DB'
                        : `CHỈNH SỬA SẢN PHẨM: ${editingForm.name} (${editingForm.id})`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingForm(null)}
                      className="btn-ghost rounded-lg px-2.5 py-1 text-xs font-semibold"
                    >
                      Hủy
                    </button>
                  </div>

                  {formError && (
                    <div
                      className="rounded-lg border px-3 py-2 text-xs font-semibold"
                      style={{ borderColor: '#ef4444', color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)' }}
                    >
                      {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                      <label className="block text-[11px] font-semibold">Slug ID (duy nhất) *</label>
                      <input
                        type="text"
                        required
                        disabled={!isCreatingNew}
                        value={editingForm.id}
                        onChange={(e) => setEditingForm({ ...editingForm, id: e.target.value })}
                        placeholder="vd: hyper-crm-ai"
                        data-testid="cms-input-id"
                        className="input-studio mt-1 h-9 w-full rounded-lg px-3 font-mono-num text-xs disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold">Mã SKU *</label>
                      <input
                        type="text"
                        required
                        value={editingForm.sku}
                        onChange={(e) => setEditingForm({ ...editingForm, sku: e.target.value })}
                        placeholder="TVT-PRO-20"
                        data-testid="cms-input-sku"
                        className="input-studio mt-1 h-9 w-full rounded-lg px-3 font-mono-num text-xs uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold">Tên Sản Phẩm *</label>
                      <input
                        type="text"
                        required
                        value={editingForm.name}
                        onChange={(e) => setEditingForm({ ...editingForm, name: e.target.value })}
                        placeholder="HyperCRM Enterprise v1.0"
                        data-testid="cms-input-name"
                        className="input-studio mt-1 h-9 w-full rounded-lg px-3 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                    <div>
                      <label className="block text-[11px] font-semibold">Giá Bán Chính Thức (VNĐ) *</label>
                      <input
                        type="number"
                        min={10000}
                        step={10000}
                        required
                        value={editingForm.priceVnd}
                        onChange={(e) =>
                          setEditingForm({ ...editingForm, priceVnd: Number(e.target.value) })
                        }
                        data-testid="cms-input-price"
                        className="input-studio mt-1 h-9 w-full rounded-lg px-3 font-mono-num text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold">Giá Gốc Gạch Ngang (VNĐ)</label>
                      <input
                        type="number"
                        min={10000}
                        step={10000}
                        value={editingForm.originalPriceVnd}
                        onChange={(e) =>
                          setEditingForm({
                            ...editingForm,
                            originalPriceVnd: Number(e.target.value),
                          })
                        }
                        className="input-studio mt-1 h-9 w-full rounded-lg px-3 font-mono-num text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold">Danh Mục</label>
                      <select
                        value={editingForm.category}
                        onChange={(e) =>
                          setEditingForm({
                            ...editingForm,
                            category: e.target.value as Exclude<ProductCategory, 'all'>,
                          })
                        }
                        className="input-studio mt-1 h-9 w-full rounded-lg px-2.5 text-xs font-semibold"
                      >
                        <option value="commerce-3d">3D & Nội Thất</option>
                        <option value="saas-ai">SaaS & AI</option>
                        <option value="enterprise-b2b">HR, Luật & FinTech</option>
                        <option value="pos-fnb">Resort, F&B & POS</option>
                        <option value="clinic-proptech">Y Tế, BĐS & Gym</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold">Thứ Hạng Hiển Thị (Top #)</label>
                      <input
                        type="number"
                        min={1}
                        max={999}
                        value={editingForm.featuredRank}
                        onChange={(e) =>
                          setEditingForm({ ...editingForm, featuredRank: Number(e.target.value) })
                        }
                        data-testid="cms-input-rank"
                        className="input-studio mt-1 h-9 w-full rounded-lg px-3 font-mono-num text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-[11px] font-semibold">Tiêu Đề Phụ (Tiếng Việt)</label>
                      <input
                        type="text"
                        value={editingForm.subtitleVi}
                        onChange={(e) => setEditingForm({ ...editingForm, subtitleVi: e.target.value })}
                        placeholder="Hệ thống quản trị doanh nghiệp chuẩn Enterprise"
                        data-testid="cms-input-subtitle-vi"
                        className="input-studio mt-1 h-9 w-full rounded-lg px-3 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold">Link Live Demo (https://)</label>
                      <input
                        type="url"
                        value={editingForm.liveUrl}
                        onChange={(e) => setEditingForm({ ...editingForm, liveUrl: e.target.value })}
                        placeholder="https://tvt987.github.io/..."
                        className="input-studio mt-1 h-9 w-full rounded-lg px-3 font-mono-num text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold">Mô Tả Ngắn (Tagline VI)</label>
                      <input
                        type="text"
                        value={editingForm.taglineVi}
                        onChange={(e) => setEditingForm({ ...editingForm, taglineVi: e.target.value })}
                        placeholder="Mô tả nổi bật hiển thị trên thẻ sản phẩm..."
                        className="input-studio mt-1 h-9 w-full rounded-lg px-3 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold">Badge Nổi Bật</label>
                      <input
                        type="text"
                        value={editingForm.previewBadge ?? ''}
                        onChange={(e) =>
                          setEditingForm({
                            ...editingForm,
                            previewBadge: e.target.value,
                            metricsBadge: e.target.value,
                          })
                        }
                        placeholder="VIP PRO · 3D HDRI"
                        className="input-studio mt-1 h-9 w-full rounded-lg px-3 font-mono-num text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                      <label className="block text-[11px] font-semibold">Ảnh Preview (./media/... hoặc https://)</label>
                      <input
                        type="text"
                        value={editingForm.previewImage}
                        onChange={(e) => setEditingForm({ ...editingForm, previewImage: e.target.value })}
                        className="input-studio mt-1 h-9 w-full rounded-lg px-3 font-mono-num text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold">Công Nghệ (phân cách bằng dấu phẩy)</label>
                      <input
                        type="text"
                        value={editingStackText}
                        onChange={(e) => setEditingStackText(e.target.value)}
                        placeholder="React 19, Three.js, .NET 10"
                        className="input-studio mt-1 h-9 w-full rounded-lg px-3 font-mono-num text-xs"
                      />
                    </div>
                    <div className="flex items-end gap-3">
                      <label className="inline-flex h-9 cursor-pointer items-center gap-2 text-xs font-semibold">
                        <input
                          type="checkbox"
                          checked={editingForm.isActive}
                          onChange={(e) =>
                            setEditingForm({ ...editingForm, isActive: e.target.checked })
                          }
                        />
                        <span>Hiển thị bán ngay trên Storefront</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setEditingForm(null)}
                      className="btn-ghost rounded-xl px-4 py-2 text-xs font-semibold"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      disabled={savingProductId !== null}
                      data-testid="cms-submit-product-btn"
                      className="btn-primary inline-flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-bold"
                    >
                      <IconCheck className="h-3.5 w-3.5" />
                      <span>
                        {savingProductId !== null
                          ? 'Đang lưu...'
                          : isCreatingNew
                            ? 'Lưu & Đăng Sản Phẩm Ngay'
                            : 'Lưu Thay Đổi Sản Phẩm'}
                      </span>
                    </button>
                  </div>
                </form>
              )}

              {/* Live Editable Product List */}
              <div className="space-y-2.5">
                {filteredCmsProducts.map((product) => {
                  const priceVal = inlinePriceDrafts[product.id] ?? String(product.priceVnd);
                  const rankVal = inlineRankDrafts[product.id] ?? String(product.featuredRank);
                  const isBusy = savingProductId === product.id;
                  const isConfirmDel = confirmDeleteId === product.id;

                  return (
                    <div
                      key={product.id}
                      data-testid={`cms-product-row-${product.id}`}
                      className="flex flex-col justify-between gap-3 rounded-xl border p-3.5 lg:flex-row lg:items-center"
                      style={{
                        backgroundColor: 'var(--bg-canvas)',
                        borderColor: product.isActive ? 'var(--border-hairline)' : '#ef4444',
                        opacity: product.isActive ? 1 : 0.65,
                      }}
                    >
                      {/* Left: Thumbnail + Info */}
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <img
                          src={product.previewImage}
                          alt={product.name}
                          className="h-12 w-20 shrink-0 rounded-lg border object-cover"
                          style={{ borderColor: 'var(--border-hairline)' }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className="font-mono-num rounded px-1.5 py-0.5 text-[10px] font-bold"
                              style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}
                            >
                              #{product.featuredRank}
                            </span>
                            <span className="truncate text-xs font-bold">{product.name}</span>
                            <span className="font-mono-num text-[10px]" style={{ color: 'var(--ink-muted)' }}>
                              {product.sku}
                            </span>
                            {!product.isActive && (
                              <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] font-bold text-red-400">
                                ĐANG ẨN
                              </span>
                            )}
                          </div>
                          <div className="mt-0.5 truncate text-[11px]" style={{ color: 'var(--ink-secondary)' }}>
                            {product.subtitle[locale]}
                          </div>
                        </div>
                      </div>

                      {/* Right: Inline Price + Rank Quick Edit + CRUD Actions */}
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-semibold" style={{ color: 'var(--ink-muted)' }}>
                            Top
                          </span>
                          <input
                            type="number"
                            min={1}
                            max={999}
                            value={rankVal}
                            onChange={(e) =>
                              setInlineRankDrafts((prev) => ({ ...prev, [product.id]: e.target.value }))
                            }
                            aria-label={`Rank for ${product.name}`}
                            className="input-studio h-8 w-14 rounded-lg px-2 text-center font-mono-num text-xs font-bold"
                          />
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-semibold" style={{ color: 'var(--ink-muted)' }}>
                            Giá VNĐ
                          </span>
                          <input
                            type="number"
                            min={10000}
                            step={100000}
                            value={priceVal}
                            onChange={(e) =>
                              setInlinePriceDrafts((prev) => ({ ...prev, [product.id]: e.target.value }))
                            }
                            data-testid={`cms-inline-price-${product.id}`}
                            aria-label={`Price VND for ${product.name}`}
                            className="input-studio h-8 w-32 rounded-lg px-2.5 font-mono-num text-xs font-bold"
                          />
                        </div>

                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => void handleQuickSavePrice(product)}
                          data-testid={`cms-save-price-${product.id}`}
                          className="btn-primary h-8 rounded-lg px-2.5 text-[11px] font-bold disabled:opacity-50"
                        >
                          {isBusy ? '...' : 'Lưu Giá'}
                        </button>

                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleOpenEditProduct(product)}
                          data-testid={`cms-edit-${product.id}`}
                          className="btn-secondary h-8 rounded-lg px-2.5 text-[11px] font-semibold"
                        >
                          Sửa
                        </button>

                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => void handleToggleProductActive(product)}
                          className="btn-ghost h-8 rounded-lg px-2.5 text-[11px] font-semibold"
                        >
                          {product.isActive ? 'Ẩn' : 'Hiện'}
                        </button>

                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => void handleDeleteProduct(product)}
                          data-testid={`cms-delete-${product.id}`}
                          className="inline-flex h-8 items-center gap-1 rounded-lg border px-2.5 text-[11px] font-semibold transition-colors"
                          style={{
                            borderColor: isConfirmDel ? '#ef4444' : 'var(--border-hairline)',
                            backgroundColor: isConfirmDel ? 'rgba(239,68,68,0.18)' : 'transparent',
                            color: isConfirmDel ? '#ef4444' : 'var(--ink-muted)',
                          }}
                        >
                          <IconTrash className="h-3 w-3" />
                          <span>{isConfirmDel ? 'Xác nhận xóa?' : 'Xóa'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 3: ORDERS LEDGER                                             */}
          {/* ================================================================ */}
          {tab === 'orders' && (
            <div className="space-y-5">
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

          {/* ================================================================ */}
          {/* TAB 4: LIVE MBBANK / SEPAY WEBHOOKS LOG                          */}
          {/* ================================================================ */}
          {tab === 'webhooks' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4" style={{ backgroundColor: 'var(--bg-canvas)', borderColor: 'var(--border-hairline)' }}>
                <div>
                  <div className="text-xs font-bold" style={{ color: 'var(--emerald)' }}>
                    MBBank 0325456574 ↔ SePay Free (0₫) ↔ Supabase sepay-webhook
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
                    : 'Đăng nhập bằng tài khoản Admin tinhkun102@gmail.com để xem nhật ký giao dịch MBBank real-time từ Cloud.'}
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

          {/* ================================================================ */}
          {/* TAB 5: CLIENTS & CONSULTATION LEADS                              */}
          {/* ================================================================ */}
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

          {/* ================================================================ */}
          {/* TAB 6: VIETQR & SYSTEM CONFIG                                    */}
          {/* ================================================================ */}
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
                  <span>Supabase Cloud & CMS Pricing Sync ({cmsProducts.length} Sản Phẩm)</span>
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
