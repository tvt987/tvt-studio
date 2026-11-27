import React, { useState } from 'react';
import { formatMoney, STUDIO_CONTACT } from '../engines/catalog';
import type { Currency, Locale, ThemeMode } from '../engines/types';
import {
  IconArrowUpRight,
  IconCart,
  IconClose,
  IconMenu,
  IconMoon,
  IconSearch,
  IconShield,
  IconSun,
  IconUser,
} from './Icons';
import { TvtBrandLockup } from './TvtBrandMark';

interface NavbarProps {
  locale: Locale;
  currency: Currency;
  theme: ThemeMode;
  cartItemCount: number;
  cartPayableNow: number;
  savedOrderCount: number;
  accountEmail: string | null;
  isAdmin: boolean;
  onToggleLocale: (next: Locale) => void;
  onToggleCurrency: (next: Currency) => void;
  onToggleTheme: () => void;
  onOpenCart: () => void;
  onOpenTracker: () => void;
  onOpenAccount: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  locale,
  currency,
  theme,
  cartItemCount,
  cartPayableNow,
  savedOrderCount,
  accountEmail,
  isAdmin,
  onToggleLocale,
  onToggleCurrency,
  onToggleTheme,
  onOpenCart,
  onOpenTracker,
  onOpenAccount,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#catalog', label: locale === 'vi' ? '26 Hệ Thống' : '26 Systems' },
    { href: '#pro-tools', label: locale === 'vi' ? '12 Pro Tools' : '12 Pro Tools' },
    { href: '#estimator', label: locale === 'vi' ? 'Code Riêng' : 'Custom Build' },
    { href: '#payment-flow', label: locale === 'vi' ? 'Thanh Toán' : 'Payment' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-md"
      style={{
        backgroundColor: 'var(--bg-glass)',
        borderColor: 'var(--border-hairline)',
      }}
    >
      <div className="mx-auto flex h-16 max-w-[1360px] items-center justify-between gap-2 px-3 sm:gap-3 sm:px-6 lg:px-8">
        {/* Brand Identity */}
        <a
          href="#top"
          className="flex min-w-0 shrink items-center focus:outline-none"
          aria-label="TVT Studio Home"
        >
          <TvtBrandLockup size="md" subtitle="ARCHITECTURAL IT" />
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-4 lg:flex xl:gap-6" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-[13px] font-medium transition-colors hover:text-[var(--ink-primary)] xl:text-sm"
              style={{ color: 'var(--ink-secondary)' }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Controls Cluster */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* VI / EN Switcher */}
          <div
            className="flex items-center rounded-lg border p-0.5 text-[11px] font-semibold"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-hairline)',
            }}
            role="group"
            aria-label="Language toggle"
          >
            <button
              type="button"
              onClick={() => onToggleLocale('vi')}
              className="rounded-md px-2 py-1 transition-colors"
              style={{
                backgroundColor: locale === 'vi' ? 'var(--bg-surface)' : 'transparent',
                color: locale === 'vi' ? 'var(--ink-primary)' : 'var(--ink-muted)',
              }}
            >
              VI
            </button>
            <button
              type="button"
              onClick={() => onToggleLocale('en')}
              className="rounded-md px-2 py-1 transition-colors"
              style={{
                backgroundColor: locale === 'en' ? 'var(--bg-surface)' : 'transparent',
                color: locale === 'en' ? 'var(--ink-primary)' : 'var(--ink-muted)',
              }}
            >
              EN
            </button>
          </div>

          {/* VND / USD Switcher */}
          <div
            className="hidden items-center rounded-lg border p-0.5 text-[11px] font-semibold sm:flex"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-hairline)',
            }}
            role="group"
            aria-label="Currency toggle"
          >
            <button
              type="button"
              onClick={() => onToggleCurrency('VND')}
              className="rounded-md px-2 py-1 font-mono-num transition-colors"
              style={{
                backgroundColor: currency === 'VND' ? 'var(--bg-surface)' : 'transparent',
                color: currency === 'VND' ? 'var(--ink-primary)' : 'var(--ink-muted)',
              }}
            >
              VNĐ
            </button>
            <button
              type="button"
              onClick={() => onToggleCurrency('USD')}
              className="rounded-md px-2 py-1 font-mono-num transition-colors"
              style={{
                backgroundColor: currency === 'USD' ? 'var(--bg-surface)' : 'transparent',
                color: currency === 'USD' ? 'var(--ink-primary)' : 'var(--ink-muted)',
              }}
            >
              USD
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="btn-ghost flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-9 sm:w-9"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? <IconSun className="h-4 w-4" /> : <IconMoon className="h-4 w-4" />}
          </button>

          {/* Admin Portal Trigger (ONLY visible when signed in as tinhkun102@gmail.com) */}
          {isAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              className="hidden h-9 shrink-0 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-bold transition-colors md:flex"
              style={{
                borderColor: 'var(--emerald)',
                backgroundColor: 'var(--emerald-soft)',
                color: 'var(--emerald)',
              }}
              data-testid="navbar-admin-btn"
              aria-label="Admin Management Portal"
            >
              <IconShield className="h-3.5 w-3.5" />
              <span className="hidden xl:inline">Admin</span>
            </button>
          )}

          {/* Account / Source Vault Trigger */}
          <button
            type="button"
            onClick={onOpenAccount}
            className="btn-ghost hidden h-9 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold md:flex"
            aria-label={locale === 'vi' ? 'Tài khoản & Kho Source' : 'Account & Source Vault'}
            data-testid="navbar-account-btn"
            style={accountEmail ? { borderColor: 'var(--emerald)', color: 'var(--ink-primary)' } : undefined}
          >
            <IconUser className="h-3.5 w-3.5" style={accountEmail ? { color: 'var(--emerald)' } : undefined} />
            <span className="hidden max-w-[110px] truncate xl:inline">
              {accountEmail ? accountEmail.split('@')[0] : locale === 'vi' ? 'Đăng nhập' : 'Sign in'}
            </span>
          </button>

          {/* Order Tracker Trigger */}
          <button
            type="button"
            onClick={onOpenTracker}
            className="btn-ghost hidden h-9 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold md:flex"
            aria-label={locale === 'vi' ? 'Tra cứu đơn hàng' : 'Track orders'}
            data-testid="navbar-tracker-btn"
          >
            <IconSearch className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">{locale === 'vi' ? 'Tra cứu đơn' : 'Orders'}</span>
            {savedOrderCount > 0 && (
              <span
                className="font-mono-num flex h-4.5 min-w-4.5 items-center justify-center rounded px-1 text-[10px] font-bold"
                style={{ backgroundColor: 'var(--cyan-soft)', color: 'var(--cyan)' }}
              >
                {savedOrderCount}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            type="button"
            onClick={onOpenCart}
            className="btn-primary relative flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold sm:h-9 sm:gap-2 sm:px-3.5"
            aria-label={locale === 'vi' ? 'Mở giỏ hàng' : 'Open cart'}
            data-testid="navbar-cart-btn"
          >
            <IconCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">
              {cartItemCount > 0
                ? formatMoney(cartPayableNow, currency)
                : locale === 'vi'
                  ? 'Giỏ hàng'
                  : 'Cart'}
            </span>
            <span className="font-mono-num flex h-4.5 min-w-4.5 items-center justify-center rounded-md bg-black/25 px-1 text-[10px] font-bold sm:h-5 sm:min-w-5 sm:text-[11px]">
              {cartItemCount}
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="btn-ghost flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-9 sm:w-9 lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <IconClose className="h-4 w-4" /> : <IconMenu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Drawer */}
      {mobileMenuOpen && (
        <div
          className="border-t px-4 py-4 lg:hidden"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-hairline)',
          }}
        >
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                style={{ color: 'var(--ink-primary)', backgroundColor: 'var(--bg-elevated)' }}
              >
                {link.label}
              </a>
            ))}
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm font-bold"
                style={{
                  borderColor: 'var(--emerald)',
                  color: 'var(--emerald)',
                  backgroundColor: 'var(--emerald-soft)',
                }}
              >
                <span>Admin Portal (tinhkun102)</span>
                <IconShield className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAccount();
              }}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold"
              style={{ color: 'var(--emerald)', backgroundColor: 'var(--bg-elevated)' }}
            >
              <span>
                {accountEmail
                  ? locale === 'vi'
                    ? `Tài khoản (${accountEmail.split('@')[0]})`
                    : `Account (${accountEmail.split('@')[0]})`
                  : locale === 'vi'
                    ? 'Đăng Nhập Email & Kho Source'
                    : 'Email Login & Source Vault'}
              </span>
              <IconUser className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTracker();
              }}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold"
              style={{ color: 'var(--cyan)', backgroundColor: 'var(--bg-elevated)' }}
            >
              <span>{locale === 'vi' ? 'Tra Cứu Đơn Hàng Đã Lưu' : 'Track Saved Orders'}</span>
              <span className="font-mono-num text-xs">{savedOrderCount}</span>
            </button>
            <div className="flex items-center justify-between pt-2">
              <div
                className="flex items-center rounded-lg border p-0.5 text-xs font-semibold"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-hairline)',
                }}
              >
                <button
                  type="button"
                  onClick={() => onToggleCurrency('VND')}
                  className="rounded-md px-3 py-1.5 font-mono-num"
                  style={{
                    backgroundColor: currency === 'VND' ? 'var(--bg-surface)' : 'transparent',
                    color: currency === 'VND' ? 'var(--ink-primary)' : 'var(--ink-muted)',
                  }}
                >
                  VNĐ
                </button>
                <button
                  type="button"
                  onClick={() => onToggleCurrency('USD')}
                  className="rounded-md px-3 py-1.5 font-mono-num"
                  style={{
                    backgroundColor: currency === 'USD' ? 'var(--bg-surface)' : 'transparent',
                    color: currency === 'USD' ? 'var(--ink-primary)' : 'var(--ink-muted)',
                  }}
                >
                  USD
                </button>
              </div>
              <a
                href={STUDIO_CONTACT.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold"
              >
                <span>Zalo {STUDIO_CONTACT.phoneDisplay}</span>
                <IconArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
