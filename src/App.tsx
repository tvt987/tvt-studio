import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { isAdminSession } from './engines/adminOps';
import { fetchLiveCatalogProducts, trackSiteEvent } from './engines/analyticsAndCms';
import {
  createDefaultProfile,
  ensureOrderDeliverable,
  fetchCloudAccountData,
  loadAuthSession,
  loadLocalClientProfile,
  mergeCloudAndLocalOrders,
  parseOAuthCallbackFromUrl,
  saveAuthSession,
  syncCloudProfile,
} from './engines/authVault';
import {
  addCustomScopeToCart,
  addTemplateToCart,
  calculateCartTotals,
  removeCartItem,
  switchTemplateLicenseInCart,
  updateCartQuantity,
} from './engines/cart';
import { CATALOG_PRODUCTS } from './engines/catalog';
import {
  appendStatusTransition,
  broadcastRealtimePaymentVerified,
  loadPersistedInquiries,
  loadPersistedOrders,
  savePersistedInquiry,
  savePersistedOrder,
  subscribeRealtimePaymentVerified,
} from './engines/orderLedger';
import { loadBankVietQrConfig } from './engines/vietqr';
import type {
  AuthSession,
  BankVietQrConfig,
  CartItem,
  ClientProfile,
  Currency,
  CustomScopeConfig,
  LicenseTier,
  Locale,
  OrderLifecycleStatus,
  OrderSnapshot,
  PaymentMode,
  QuickInquiryRecord,
  TemplateProduct,
  ThemeMode,
} from './engines/types';
import { CatalogSection } from './components/CatalogSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { IconCart, IconCheck } from './components/Icons';
import { Navbar } from './components/Navbar';
import { PaymentJourneySection } from './components/PaymentJourneySection';
import { ProcessSlaSection } from './components/ProcessSlaSection';

const AccountPortalModal = lazy(() =>
  import('./components/AccountPortalModal').then((m) => ({ default: m.AccountPortalModal }))
);
const CartDrawer = lazy(() =>
  import('./components/CartDrawer').then((m) => ({ default: m.CartDrawer }))
);
const CheckoutModal = lazy(() =>
  import('./components/CheckoutModal').then((m) => ({ default: m.CheckoutModal }))
);
const CompareDrawer = lazy(() =>
  import('./components/CompareDrawer').then((m) => ({ default: m.CompareDrawer }))
);
const CustomEstimatorSection = lazy(() =>
  import('./components/CustomEstimatorSection').then((m) => ({
    default: m.CustomEstimatorSection,
  }))
);
const LiveSandboxModal = lazy(() =>
  import('./components/LiveSandboxModal').then((m) => ({ default: m.LiveSandboxModal }))
);
const OrderTrackerModal = lazy(() =>
  import('./components/OrderTrackerModal').then((m) => ({ default: m.OrderTrackerModal }))
);
const OwnerConsoleModal = lazy(() =>
  import('./components/OwnerConsoleModal').then((m) => ({ default: m.OwnerConsoleModal }))
);
const ProToolsSuiteSection = lazy(() =>
  import('./components/ProToolsSuiteSection').then((m) => ({
    default: m.ProToolsSuiteSection,
  }))
);
const ProductDetailModal = lazy(() =>
  import('./components/ProductDetailModal').then((m) => ({ default: m.ProductDetailModal }))
);
const QuickInquiryModal = lazy(() =>
  import('./components/QuickInquiryModal').then((m) => ({ default: m.QuickInquiryModal }))
);

const CART_STORAGE_KEY = 'tvt_studio_cart_v1';

function loadSavedCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

export const App: React.FC = () => {
  const [locale, setLocale] = useState<Locale>('vi');
  const [currency, setCurrency] = useState<Currency>('VND');
  const [theme, setTheme] = useState<ThemeMode>('dark');

  const [catalogProducts, setCatalogProducts] = useState<TemplateProduct[]>(() =>
    [...CATALOG_PRODUCTS].sort((a, b) => a.featuredRank - b.featuredRank)
  );
  const pageViewTrackedRef = useRef(false);

  const [cartItems, setCartItems] = useState<CartItem[]>(() => loadSavedCart());
  const [activeVoucherCode, setActiveVoucherCode] = useState<string | null>(null);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('deposit-30');

  const [persistedOrders, setPersistedOrders] = useState<OrderSnapshot[]>([]);
  const [persistedInquiries, setPersistedInquiries] = useState<QuickInquiryRecord[]>([]);
  const [bankConfig, setBankConfig] = useState<BankVietQrConfig | null>(() => loadBankVietQrConfig());
  const [authSession, setAuthSession] = useState<AuthSession | null>(() => loadAuthSession());
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(() => {
    const sess = loadAuthSession();
    return sess ? loadLocalClientProfile(sess.email) : null;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [trackerInitialCode, setTrackerInitialCode] = useState<string | null>(null);
  const [isOwnerConsoleOpen, setIsOwnerConsoleOpen] = useState(false);

  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryProduct, setInquiryProduct] = useState<TemplateProduct | null>(null);

  const [sandboxProduct, setSandboxProduct] = useState<TemplateProduct | null>(null);
  const [detailTarget, setDetailTarget] = useState<{
    product: TemplateProduct;
    license: LicenseTier;
  } | null>(null);
  const [toastText, setToastText] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('lang', locale);
  }, [locale]);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore storage quota errors
    }
  }, [cartItems]);

  // Hydrate live Cloud CMS catalog (`tvt_products`) & fire non-PII page_view telemetry once on mount
  useEffect(() => {
    let mounted = true;
    void fetchLiveCatalogProducts().then((liveProducts) => {
      if (mounted && liveProducts.length > 0) {
        setCatalogProducts(liveProducts);
      }
    });
    if (!pageViewTrackedRef.current) {
      pageViewTrackedRef.current = true;
      void trackSiteEvent('page_view', { locale: 'vi' });
    }
    return () => {
      mounted = false;
    };
  }, []);

  // Handle returning OAuth 2.0 callback hash from Google / Facebook / LinkedIn via Supabase Auth
  useEffect(() => {
    void parseOAuthCallbackFromUrl().then((oauthSession) => {
      if (oauthSession) {
        setAuthSession(oauthSession);
        const prof = loadLocalClientProfile(oauthSession.email);
        setClientProfile(prof ?? createDefaultProfile(oauthSession.email, oauthSession.userId));
      }
    });
  }, []);

  // Dedicated 10,000 VND Live Real-Time VietQR test link (`?test10k=1`) without cluttering the 19-web catalog
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('test10k') === '1') {
      const testItem: CartItem = {
        kind: 'template',
        cartKey: 'tpl:vietqr-test-10k:standard',
        productId: 'vietqr-test-10k',
        sku: 'TVT-TEST-10K',
        title: 'Gói Test VietQR Real-Time (10.000₫)',
        subtitle: {
          vi: 'Kiểm thử thanh toán tự động MBBank ↔ SePay ↔ Supabase (1–3 giây)',
          en: 'Live MBBank ↔ SePay ↔ Supabase Real-Time Webhook Test (1–3s)',
        },
        previewImage: './media/studio-emblem.webp',
        license: 'standard',
        unitVnd: 10_000,
        unitUsd: 1,
        quantity: 1,
        deliveryDaysLabel: '1–3 giây (Auto-Verified)',
      };
      setCartItems([testItem]);
      setActiveVoucherCode(null);
      setPaymentMode('full');
      setIsCheckoutOpen(true);
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  // Hydrate persistent IndexedDB order & inquiry ledger on mount (and merge Cloud Account orders when signed in)
  useEffect(() => {
    let active = true;
    void loadPersistedOrders().then((rows) => {
      if (!active) return;
      setPersistedOrders(rows);
      if (authSession) {
        void fetchCloudAccountData(authSession).then(({ profile, orders: cloudOrders }) => {
          if (!active) return;
          if (profile) setClientProfile(profile);
          if (cloudOrders.length > 0) {
            setPersistedOrders((curr) => mergeCloudAndLocalOrders(cloudOrders, curr));
          }
        });
      }
    });
    void loadPersistedInquiries().then((rows) => {
      if (active) setPersistedInquiries(rows);
    });
    return () => {
      active = false;
    };
  }, [authSession]);

  // Keyboard shortcut Ctrl+Shift+A to open Owner Console
  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === 'A') {
        e.preventDefault();
        setIsOwnerConsoleOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  // Cross-tab real-time payment verification sync into IndexedDB
  useEffect(() => {
    return subscribeRealtimePaymentVerified((ev) => {
      if (ev.status !== 'DEPOSIT_VERIFIED') return;
      setPersistedOrders((prev) => {
        const target = prev.find((o) => o.orderCode === ev.orderCode);
        if (!target || target.status === 'DEPOSIT_VERIFIED') return prev;
        const updated = appendStatusTransition(
          target,
          'DEPOSIT_VERIFIED',
          `Tự động xác nhận VietQR thành công (Ref ${ev.paymentRef})`,
          `Auto-verified VietQR transfer (Ref ${ev.paymentRef})`,
          ev.paymentRef,
          ev.verifiedAtIso
        );
        void savePersistedOrder(updated);
        return [updated, ...prev.filter((o) => o.orderCode !== ev.orderCode)];
      });
    });
  }, []);

  const totals = useMemo(
    () => calculateCartTotals(cartItems, activeVoucherCode, paymentMode),
    [cartItems, activeVoucherCode, paymentMode]
  );

  const comparedProducts = useMemo(
    () =>
      compareIds
        .map((id) => catalogProducts.find((p) => p.id === id))
        .filter((p): p is TemplateProduct => Boolean(p)),
    [compareIds, catalogProducts]
  );

  const showToast = (message: string) => {
    setToastText(message);
    window.setTimeout(() => {
      setToastText((curr) => (curr === message ? null : curr));
    }, 3400);
  };

  const handleAddTemplate = (product: TemplateProduct, license: LicenseTier) => {
    setCartItems((prev) => addTemplateToCart(prev, product, license));
    void trackSiteEvent('add_to_cart', { productId: product.id, locale });
    showToast(
      locale === 'vi'
        ? `Đã thêm ${product.name} (${license === 'full-source' ? 'Full Source' : 'Standard'}) vào giỏ`
        : `Added ${product.name} (${license === 'full-source' ? 'Full Source' : 'Standard'}) to cart`
    );
  };

  const handleAddCustomScope = (config: CustomScopeConfig) => {
    setCartItems((prev) => addCustomScopeToCart(prev, config));
    void trackSiteEvent('add_to_cart', { productId: `custom-${config.projectType}`, locale });
    showToast(
      locale === 'vi'
        ? 'Đã thêm gói Code Theo Yêu Cầu vào giỏ hàng'
        : 'Added Custom Engineering Package to cart'
    );
  };

  const handleUpdateQuantity = (cartKey: string, delta: number) => {
    setCartItems((prev) => updateCartQuantity(prev, cartKey, delta));
  };

  const handleRemoveItem = (cartKey: string) => {
    setCartItems((prev) => removeCartItem(prev, cartKey));
  };

  const handleSwitchLicense = (cartKey: string, targetLicense: LicenseTier) => {
    setCartItems((prev) =>
      switchTemplateLicenseInCart(prev, cartKey, targetLicense, catalogProducts)
    );
  };

  const handleToggleCompare = (productId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 3) {
        showToast(
          locale === 'vi'
            ? 'Tối đa so sánh cùng lúc 3 mẫu website.'
            : 'You can compare up to 3 templates at once.'
        );
        return prev;
      }
      return [...prev, productId];
    });
  };

  const handleOrderCompleted = (order: OrderSnapshot) => {
    setCartItems([]);
    setActiveVoucherCode(null);
    void savePersistedOrder(order).then((updated) => {
      setPersistedOrders(updated);
    });
    // Auto-save client's billing details into their signed-in profile for 1-click future orders
    if (authSession) {
      const base = clientProfile ?? createDefaultProfile(authSession.email, authSession.userId);
      void syncCloudProfile(authSession, {
        ...base,
        fullName: order.client.fullName || base.fullName,
        phoneOrZalo: order.client.phoneOrZalo || base.phoneOrZalo,
        brandOrDomain: order.client.brandOrDomain || base.brandOrDomain,
        preferredChannel: order.paymentChannel,
      }).then((savedProf) => setClientProfile(savedProf));
    }
    showToast(
      locale === 'vi'
        ? `Đã lưu đơn ${order.orderCode} vào Tra Cứu Đơn Hàng (IndexedDB)`
        : `Order ${order.orderCode} saved to Order Tracker (IndexedDB)`
    );
  };

  const handleSubmitPaymentProof = (orderCode: string, paymentRef: string) => {
    const target = persistedOrders.find((o) => o.orderCode === orderCode);
    if (!target) return;
    const updated = appendStatusTransition(
      target,
      'PROOF_SUBMITTED',
      `Khách đã gửi mã giao dịch đối soát: ${paymentRef}`,
      `Client submitted transfer reference: ${paymentRef}`,
      paymentRef
    );
    void savePersistedOrder(updated).then((rows) => setPersistedOrders(rows));
    showToast(
      locale === 'vi'
        ? `Đã gắn mã giao dịch ${paymentRef} vào đơn ${orderCode}`
        : `Attached ref ${paymentRef} to ${orderCode}`
    );
  };

  const handleUpdateOrderStatus = (orderCode: string, nextStatus: OrderLifecycleStatus) => {
    const target = persistedOrders.find((o) => o.orderCode === orderCode);
    if (!target) return;
    const updated = appendStatusTransition(target, nextStatus);
    void savePersistedOrder(updated).then((rows) => setPersistedOrders(rows));
  };

  const handleUpdateOrderDeliveryUrl = (orderCode: string, downloadUrl: string) => {
    const target = persistedOrders.find((o) => o.orderCode === orderCode);
    if (!target) return;
    const deliv = ensureOrderDeliverable(target);
    const updated: OrderSnapshot = {
      ...target,
      deliverable: {
        ...deliv,
        sourceDownloadUrl: downloadUrl || undefined,
      },
    };
    void savePersistedOrder(updated).then((rows) => setPersistedOrders(rows));
  };

  const handleAuthenticated = (nextSession: AuthSession) => {
    setAuthSession(nextSession);
    const localProf = loadLocalClientProfile(nextSession.email);
    setClientProfile(localProf ?? createDefaultProfile(nextSession.email, nextSession.userId));
    showToast(
      locale === 'vi'
        ? `Đã đăng nhập tài khoản ${nextSession.email}`
        : `Signed in as ${nextSession.email}`
    );
  };

  const handleLogout = () => {
    saveAuthSession(null);
    setAuthSession(null);
    setClientProfile(null);
    showToast(locale === 'vi' ? 'Đã đăng xuất khỏi tài khoản' : 'Signed out');
  };

  const handleAutoVerifiedPayment = (orderCode: string, paymentRef: string) => {
    const target = persistedOrders.find((o) => o.orderCode === orderCode);
    if (!target || target.status === 'DEPOSIT_VERIFIED') return;
    const updated = appendStatusTransition(
      target,
      'DEPOSIT_VERIFIED',
      `Tự động xác nhận VietQR Real-time (Ref ${paymentRef})`,
      `Auto-verified via real-time VietQR webhook (Ref ${paymentRef})`,
      paymentRef
    );
    void savePersistedOrder(updated).then((rows) => setPersistedOrders(rows));
  };

  const handleSimulateRealtimeWebhook = (orderCode: string, amountVnd: number) => {
    const syntheticRef = `SEPAY-${Date.now().toString().slice(-6)}`;
    broadcastRealtimePaymentVerified({
      orderCode,
      status: 'DEPOSIT_VERIFIED',
      paidAmountVnd: amountVnd,
      paymentRef: syntheticRef,
      gateway: 'MBBank',
      verifiedAtIso: new Date().toISOString(),
    });
  };

  const handleInquirySaved = (record: QuickInquiryRecord) => {
    void savePersistedInquiry(record).then((rows) => setPersistedInquiries(rows));
    void trackSiteEvent('inquiry_submit', { productId: record.productId, locale });
    showToast(
      locale === 'vi'
        ? `Đã lưu yêu cầu tư vấn ${record.inquiryCode} — Tình sẽ phản hồi trong 15 phút`
        : `Consultation request ${record.inquiryCode} saved`
    );
  };

  const handleLaunch10kLiveTest = () => {
    const testItem: CartItem = {
      kind: 'template',
      cartKey: 'tpl:vietqr-test-10k:standard',
      productId: 'vietqr-test-10k',
      sku: 'TVT-TEST-10K',
      title: 'Gói Test VietQR Real-Time (10.000₫)',
      subtitle: {
        vi: 'Kiểm thử thanh toán tự động MBBank ↔ SePay ↔ Supabase (1–3 giây)',
        en: 'Live MBBank ↔ SePay ↔ Supabase Real-Time Webhook Test (1–3s)',
      },
      previewImage: './media/studio-emblem.webp',
      license: 'standard',
      unitVnd: 10_000,
      unitUsd: 1,
      quantity: 1,
      deliveryDaysLabel: '1–3 giây (Auto-Verified)',
    };
    setCartItems([testItem]);
    setActiveVoucherCode(null);
    setPaymentMode('full');
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-canvas)', color: 'var(--ink-primary)' }}>
      <div className="no-print">
        <Navbar
          locale={locale}
          currency={currency}
          theme={theme}
          cartItemCount={totals.itemCount}
          cartPayableNow={currency === 'VND' ? totals.payableNowVnd : totals.payableNowUsd}
          savedOrderCount={persistedOrders.length}
          accountEmail={authSession?.email ?? null}
          isAdmin={isAdminSession(authSession)}
          onToggleLocale={setLocale}
          onToggleCurrency={setCurrency}
          onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenTracker={() => {
            setTrackerInitialCode(null);
            setIsTrackerOpen(true);
          }}
          onOpenAccount={() => setIsAccountOpen(true)}
          onOpenAdmin={() => setIsOwnerConsoleOpen(true)}
        />

        <main>
          <HeroSection
            locale={locale}
            onPreviewLive={(product) => {
              void trackSiteEvent('sandbox_open', { productId: product.id, locale });
              setSandboxProduct(product);
            }}
          />

          <CatalogSection
            products={catalogProducts}
            locale={locale}
            currency={currency}
            compareIds={compareIds}
            onPreviewLive={(product) => {
              void trackSiteEvent('sandbox_open', { productId: product.id, locale });
              setSandboxProduct(product);
            }}
            onInspectDetails={(product, license) => {
              void trackSiteEvent('product_detail', { productId: product.id, locale });
              setDetailTarget({ product, license });
            }}
            onAddToCart={handleAddTemplate}
            onToggleCompare={handleToggleCompare}
            onOpenCompare={() => setIsCompareOpen(true)}
            onOpenInquiry={(product) => {
              setInquiryProduct(product);
              setInquiryOpen(true);
            }}
          />

          <Suspense fallback={<div id="pro-tools" className="min-h-[240px]" />}>
            <ProToolsSuiteSection locale={locale} />
          </Suspense>

          <Suspense fallback={<div id="estimator" className="min-h-[240px]" />}>
            <CustomEstimatorSection
              locale={locale}
              currency={currency}
              onAddCustomToCart={handleAddCustomScope}
            />
          </Suspense>

          <PaymentJourneySection
            locale={locale}
            savedOrderCount={persistedOrders.length}
            onOpenTracker={() => {
              setTrackerInitialCode(null);
              setIsTrackerOpen(true);
            }}
            onOpenInquiry={() => {
              setInquiryProduct(null);
              setInquiryOpen(true);
            }}
          />

          <ProcessSlaSection locale={locale} />
        </main>

        <Footer
          locale={locale}
          onOpenTracker={() => {
            setTrackerInitialCode(null);
            setIsTrackerOpen(true);
          }}
        />
      </div>

      {/* Live Sandbox Modal */}
      {sandboxProduct !== null && (
        <Suspense fallback={null}>
          <LiveSandboxModal
            product={sandboxProduct}
            locale={locale}
            currency={currency}
            onClose={() => setSandboxProduct(null)}
            onAddToCart={handleAddTemplate}
          />
        </Suspense>
      )}

      {/* Product Specification Modal */}
      {detailTarget !== null && (
        <Suspense fallback={null}>
          <ProductDetailModal
            product={detailTarget.product}
            initialLicense={detailTarget.license}
            locale={locale}
            currency={currency}
            onClose={() => setDetailTarget(null)}
            onOpenSandbox={(product) => setSandboxProduct(product)}
            onAddToCart={handleAddTemplate}
          />
        </Suspense>
      )}

      {/* Side-by-Side Template Comparison Modal */}
      {isCompareOpen && (
        <Suspense fallback={null}>
          <CompareDrawer
            isOpen={isCompareOpen}
            products={comparedProducts}
            locale={locale}
            currency={currency}
            onClose={() => setIsCompareOpen(false)}
            onRemoveProduct={(id) => setCompareIds((prev) => prev.filter((item) => item !== id))}
            onPreviewLive={(product) => setSandboxProduct(product)}
            onAddToCart={handleAddTemplate}
          />
        </Suspense>
      )}

      {/* Quick Consultation / Negotiation Modal */}
      {inquiryOpen && (
        <Suspense fallback={null}>
          <QuickInquiryModal
            isOpen={inquiryOpen}
            targetProduct={inquiryProduct}
            locale={locale}
            onClose={() => setInquiryOpen(false)}
            onInquirySaved={handleInquirySaved}
          />
        </Suspense>
      )}

      {/* Slide-Over Cart Drawer */}
      {isCartOpen && (
        <Suspense fallback={null}>
          <CartDrawer
            isOpen={isCartOpen}
            items={cartItems}
            totals={totals}
            locale={locale}
            currency={currency}
            activeVoucherCode={activeVoucherCode}
            onClose={() => setIsCartOpen(false)}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onSwitchLicense={handleSwitchLicense}
            onApplyVoucher={setActiveVoucherCode}
            onChangePaymentMode={setPaymentMode}
            onProceedToCheckout={() => {
              setIsCartOpen(false);
              setIsCheckoutOpen(true);
              void trackSiteEvent('checkout_start', { locale });
            }}
          />
        </Suspense>
      )}

      {/* 3-Step Hybrid Payment Checkout Modal */}
      {isCheckoutOpen && (
        <Suspense fallback={null}>
          <CheckoutModal
            isOpen={isCheckoutOpen}
            items={cartItems}
            totals={totals}
            locale={locale}
            currency={currency}
            bankConfig={bankConfig}
            authSession={authSession}
            clientProfile={clientProfile}
            onClose={() => setIsCheckoutOpen(false)}
            onOrderCompleted={handleOrderCompleted}
            onAutoVerifiedPayment={handleAutoVerifiedPayment}
            onOpenTracker={(orderCode) => {
              setTrackerInitialCode(orderCode);
              setIsTrackerOpen(true);
            }}
            onOpenAccount={() => setIsAccountOpen(true)}
          />
        </Suspense>
      )}

      {/* Client Email Auth & Permanent Source Recovery Vault */}
      {isAccountOpen && (
        <Suspense fallback={null}>
          <AccountPortalModal
            isOpen={isAccountOpen}
            locale={locale}
            currency={currency}
            session={authSession}
            profile={clientProfile}
            orders={persistedOrders}
            onClose={() => setIsAccountOpen(false)}
            onAuthenticated={handleAuthenticated}
            onLogout={handleLogout}
            onProfileSaved={setClientProfile}
            onOpenOrderTracker={(orderCode) => {
              setTrackerInitialCode(orderCode);
              setIsTrackerOpen(true);
            }}
          />
        </Suspense>
      )}

      {/* Persistent Order Tracker Modal (IndexedDB) */}
      {isTrackerOpen && (
        <Suspense fallback={null}>
          <OrderTrackerModal
            isOpen={isTrackerOpen}
            orders={persistedOrders}
            locale={locale}
            currency={currency}
            initialOrderCode={trackerInitialCode}
            onClose={() => setIsTrackerOpen(false)}
            onSubmitPaymentProof={handleSubmitPaymentProof}
          />
        </Suspense>
      )}

      {/* Owner Admin Console (Executive Analytics, Product CMS CRUD, Orders, Live Bank VietQR) */}
      {isOwnerConsoleOpen && (
        <Suspense fallback={null}>
          <OwnerConsoleModal
            isOpen={isOwnerConsoleOpen}
            locale={locale}
            authSession={authSession}
            orders={persistedOrders}
            inquiries={persistedInquiries}
            bankConfig={bankConfig}
            catalogProducts={catalogProducts}
            onClose={() => setIsOwnerConsoleOpen(false)}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onUpdateOrderDeliveryUrl={handleUpdateOrderDeliveryUrl}
            onSimulateRealtimeWebhook={handleSimulateRealtimeWebhook}
            onBankConfigChange={setBankConfig}
            onCatalogProductsChange={setCatalogProducts}
            onLaunch10kLiveTest={handleLaunch10kLiveTest}
          />
        </Suspense>
      )}

      {/* Subtle Bottom-Left Confirmation Toast (never collides with open modals/drawers) */}
      {toastText && !isCartOpen && !isCheckoutOpen && !isTrackerOpen && !isAccountOpen && !isOwnerConsoleOpen && (
        <div
          className="no-print fixed bottom-4 left-4 z-50 flex max-w-md items-center gap-3 rounded-xl border px-4 py-3 text-xs font-semibold shadow-2xl sm:bottom-6 sm:left-6"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--accent)',
            color: 'var(--ink-primary)',
          }}
          role="status"
          aria-live="polite"
        >
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: 'var(--emerald-soft)', color: 'var(--emerald)' }}
          >
            <IconCheck className="h-3.5 w-3.5" />
          </span>
          <span className="leading-snug">{toastText}</span>
          {totals.itemCount > 0 && !isCartOpen && !isCheckoutOpen && (
            <button
              type="button"
              onClick={() => {
                setToastText(null);
                setIsCartOpen(true);
              }}
              className="btn-primary ml-1 inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold"
            >
              <IconCart className="h-3 w-3" />
              <span>{locale === 'vi' ? 'Xem Giỏ' : 'Cart'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
