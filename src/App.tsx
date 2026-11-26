import React, { useEffect, useMemo, useState } from 'react';
import {
  addCustomScopeToCart,
  addTemplateToCart,
  calculateCartTotals,
  removeCartItem,
  switchTemplateLicenseInCart,
  updateCartQuantity,
} from './engines/cart';
import { CATALOG_PRODUCTS } from './engines/catalog';
import type {
  CartItem,
  Currency,
  CustomScopeConfig,
  LicenseTier,
  Locale,
  OrderSnapshot,
  PaymentMode,
  TemplateProduct,
  ThemeMode,
} from './engines/types';
import { CartDrawer } from './components/CartDrawer';
import { CatalogSection } from './components/CatalogSection';
import { CheckoutModal } from './components/CheckoutModal';
import { CustomEstimatorSection } from './components/CustomEstimatorSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { IconCart, IconCheck } from './components/Icons';
import { LiveSandboxModal } from './components/LiveSandboxModal';
import { Navbar } from './components/Navbar';
import { ProcessSlaSection } from './components/ProcessSlaSection';
import { ProductDetailModal } from './components/ProductDetailModal';

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

  const [cartItems, setCartItems] = useState<CartItem[]>(() => loadSavedCart());
  const [activeVoucherCode, setActiveVoucherCode] = useState<string | null>(null);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('deposit-30');

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
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

  const totals = useMemo(
    () => calculateCartTotals(cartItems, activeVoucherCode, paymentMode),
    [cartItems, activeVoucherCode, paymentMode]
  );

  const showToast = (message: string) => {
    setToastText(message);
    window.setTimeout(() => {
      setToastText((curr) => (curr === message ? null : curr));
    }, 3200);
  };

  const handleToggleLocale = (next: Locale) => {
    setLocale(next);
  };

  const handleToggleCurrency = (next: Currency) => {
    setCurrency(next);
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleAddTemplate = (product: TemplateProduct, license: LicenseTier) => {
    setCartItems((prev) => addTemplateToCart(prev, product, license));
    showToast(
      locale === 'vi'
        ? `Đã thêm ${product.name} (${license === 'full-source' ? 'Full Source' : 'Standard'}) vào giỏ`
        : `Added ${product.name} (${license === 'full-source' ? 'Full Source' : 'Standard'}) to cart`
    );
  };

  const handleAddCustomScope = (config: CustomScopeConfig) => {
    setCartItems((prev) => addCustomScopeToCart(prev, config));
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
      switchTemplateLicenseInCart(prev, cartKey, targetLicense, CATALOG_PRODUCTS)
    );
  };

  const handleOrderCompleted = (order: OrderSnapshot) => {
    setCartItems([]);
    setActiveVoucherCode(null);
    showToast(
      locale === 'vi'
        ? `Đơn hàng ${order.orderCode} đã sẵn sàng — hãy tải hợp đồng hoặc xác nhận Zalo`
        : `Order ${order.orderCode} created — download receipt or confirm via Zalo`
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-canvas)', color: 'var(--ink-primary)' }}>
      <Navbar
        locale={locale}
        currency={currency}
        theme={theme}
        cartItemCount={totals.itemCount}
        cartPayableNow={currency === 'VND' ? totals.payableNowVnd : totals.payableNowUsd}
        onToggleLocale={handleToggleLocale}
        onToggleCurrency={handleToggleCurrency}
        onToggleTheme={handleToggleTheme}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main>
        <HeroSection locale={locale} />

        <CatalogSection
          products={CATALOG_PRODUCTS}
          locale={locale}
          currency={currency}
          onPreviewLive={(product) => setSandboxProduct(product)}
          onInspectDetails={(product, license) => setDetailTarget({ product, license })}
          onAddToCart={handleAddTemplate}
        />

        <CustomEstimatorSection
          locale={locale}
          currency={currency}
          onAddCustomToCart={handleAddCustomScope}
        />

        <ProcessSlaSection locale={locale} />
      </main>

      <Footer locale={locale} />

      {/* Live Sandbox Modal */}
      <LiveSandboxModal
        product={sandboxProduct}
        locale={locale}
        currency={currency}
        onClose={() => setSandboxProduct(null)}
        onAddToCart={handleAddTemplate}
      />

      {/* Product Specification Modal */}
      <ProductDetailModal
        product={detailTarget?.product ?? null}
        initialLicense={detailTarget?.license ?? 'standard'}
        locale={locale}
        currency={currency}
        onClose={() => setDetailTarget(null)}
        onOpenSandbox={(product) => setSandboxProduct(product)}
        onAddToCart={handleAddTemplate}
      />

      {/* Slide-Over Cart Drawer */}
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
        }}
      />

      {/* 3-Step Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        items={cartItems}
        totals={totals}
        locale={locale}
        currency={currency}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Subtle Bottom-Left Confirmation Toast (never collides with right-docked Cart Drawer) */}
      {toastText && !isCartOpen && (
        <div
          className="fixed bottom-4 left-4 z-50 flex max-w-md items-center gap-3 rounded-xl border px-4 py-3 text-xs font-semibold shadow-2xl sm:bottom-6 sm:left-6"
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
